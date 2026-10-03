"""Several tasks changed at once (D#199): assignment, labels, priority,
warning days and reminders.

The panel's bulk bar runs one command per selected task for complete,
archive and move; an edit sent that way to fifty tasks reloaded each object
once per task. ``tasks/update_many`` groups the tasks by object, applies each
change with the rule ``task/update`` applies to the same field, writes an
object's tasks in one update and reloads every object once. The answer names
the tasks that changed and those that did not (and why), and returns the
values it replaced so the panel can undo exactly.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import CONF_TASKS, MAX_LABEL_LENGTH, MAX_LABELS
from ..helpers.aggregate import is_object_entry
from ..helpers.entry_tasks import write_tasks
from ..helpers.permissions import require_write
from ..helpers.sanitize import sanitize_assignee_pool, sanitize_labels, seed_rotation_assignee
from . import ID_FIELD
from .tasks_crud import _TASK_FIELDS

#: At most this many tasks per call — a whole household's catalog fits.
MAX_BULK_TASKS = 500

# The fields a bulk edit may touch, validated as task/update validates them.
# ``None`` restores "not set" (absent key) — the shape the undo sends back.
BULK_FIELDS: tuple[str, ...] = (
    "responsible_user_id",
    "assignee_pool",
    "rotation_strategy",
    "labels",
    "priority",
    "warning_days",
    "notify_enabled",
)
_LABEL_LIST = vol.All([vol.All(str, vol.Length(max=MAX_LABEL_LENGTH))], vol.Length(max=MAX_LABELS))
_CHANGES = {
    **{vol.Optional(key): vol.Any(_TASK_FIELDS[key], None) for key in BULK_FIELDS},
    # Added to / removed from each task's own labels (the rest stays).
    vol.Optional("labels_add"): _LABEL_LIST,
    vol.Optional("labels_remove"): _LABEL_LIST,
}


def apply_bulk_changes(task: dict[str, Any], changes: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    """``(task with changes applied, the replaced values)``.

    The rules are task/update's for the same fields: rotation off and
    reminders on are stored as absence, labels and the assignee pool are
    cleaned, a rotation always carries an assignee. The replaced values use
    ``None`` for "was not set" so they can be sent back as the undo.
    """
    out = dict(task)
    touched = [key for key in BULK_FIELDS if key in changes]
    if "labels_add" in changes or "labels_remove" in changes:
        touched.append("labels")
    if any(key in touched for key in ("responsible_user_id", "assignee_pool", "rotation_strategy")):
        # A rotation re-seeds the assignee: undo all three together.
        touched = [*{*touched, "responsible_user_id", "assignee_pool", "rotation_strategy"}]
    previous = {key: task.get(key) for key in touched}
    if "notify_enabled" in previous:
        previous["notify_enabled"] = task.get("notify_enabled") is not False

    for key in ("responsible_user_id", "priority", "warning_days"):
        if key in changes:
            if changes[key] is None:
                out.pop(key, None)
            else:
                out[key] = changes[key]
    if "assignee_pool" in changes:
        pool = sanitize_assignee_pool(changes["assignee_pool"] or [])
        if pool:
            out["assignee_pool"] = pool
        else:
            out.pop("assignee_pool", None)
    if "rotation_strategy" in changes:
        if changes["rotation_strategy"]:
            out["rotation_strategy"] = changes["rotation_strategy"]
        else:
            out.pop("rotation_strategy", None)
    if "labels" in changes:
        out["labels"] = sanitize_labels(changes["labels"] or [])
    if "labels_add" in changes or "labels_remove" in changes:
        removed = set(sanitize_labels(changes.get("labels_remove") or []))
        kept = [label for label in sanitize_labels(out.get("labels") or []) if label not in removed]
        out["labels"] = sanitize_labels(kept + list(changes.get("labels_add") or []))
    if "labels" in out and not out["labels"]:
        out.pop("labels")
    if "notify_enabled" in changes:
        if changes["notify_enabled"] is False:
            out["notify_enabled"] = False
        else:
            out.pop("notify_enabled", None)
    seed_rotation_assignee(out)
    return out, previous


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/tasks/update_many",
        vol.Required("items"): vol.All(
            [
                {
                    vol.Required("entry_id"): ID_FIELD,
                    vol.Required("task_id"): ID_FIELD,
                    # Per-task values over the shared ones — the undo's shape.
                    vol.Optional("changes"): _CHANGES,
                }
            ],
            vol.Length(min=1, max=MAX_BULK_TASKS),
        ),
        vol.Optional("changes", default={}): _CHANGES,
    }
)
@require_write
@websocket_api.async_response
async def ws_update_many_tasks(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Apply the same change to several tasks; one write and one reload per object."""
    shared = msg.get("changes") or {}
    per_task = [(item, {**shared, **(item.get("changes") or {})}) for item in msg["items"]]
    # The user lookups are awaits — all of them before any task is read.
    named = {changes["responsible_user_id"] for _, changes in per_task if changes.get("responsible_user_id")}
    unknown = {user_id for user_id in named if await hass.auth.async_get_user(user_id) is None}

    updated: list[dict[str, str]] = []
    failed: list[dict[str, str]] = []
    previous: list[dict[str, Any]] = []
    by_entry: dict[str, list[tuple[str, dict[str, Any]]]] = {}
    for item, changes in per_task:
        if not changes:
            failed.append({"entry_id": item["entry_id"], "task_id": item["task_id"], "code": "invalid_input"})
            continue
        by_entry.setdefault(item["entry_id"], []).append((item["task_id"], changes))

    for entry_id, pairs in by_entry.items():
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is None or not is_object_entry(entry):
            failed.extend({"entry_id": entry_id, "task_id": task_id, "code": "not_found"} for task_id, _ in pairs)
            continue
        stored_tasks = entry.data.get(CONF_TASKS) or {}
        new_tasks: dict[str, dict[str, Any]] = {}
        for task_id, changes in pairs:
            stored = stored_tasks.get(task_id)
            if stored is None:
                failed.append({"entry_id": entry_id, "task_id": task_id, "code": "not_found"})
                continue
            user_id = changes.get("responsible_user_id")
            # The stored assignee passes unchecked (task/update's rule): an undo
            # must not be refused for a user deleted in the meantime.
            if user_id in unknown and user_id != stored.get("responsible_user_id"):
                failed.append({"entry_id": entry_id, "task_id": task_id, "code": "invalid_user"})
                continue
            new_tasks[task_id], replaced = apply_bulk_changes(new_tasks.get(task_id, stored), changes)
            updated.append({"entry_id": entry_id, "task_id": task_id})
            previous.append({"entry_id": entry_id, "task_id": task_id, "changes": replaced})
        if new_tasks:
            write_tasks(hass, entry, new_tasks)
            await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"updated": updated, "failed": failed, "previous": previous})
