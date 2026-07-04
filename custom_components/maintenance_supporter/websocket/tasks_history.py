"""Task history-entry edit WS handler."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import (
    MAX_ID_LENGTH,
    MAX_META_LENGTH,
    MAX_TEXT_LENGTH,
    HistoryEntryType,
)
from ..helpers.permissions import require_write
from . import (
    _get_runtime_data,
    _load_object_entry,
)

# v2.2.0 — edit existing history entries (Discussion #49 follow-up).
#
# Identifying the entry: by its CURRENT timestamp (the original_timestamp the
# frontend last saw). Index would shift if the user completes a task in another
# browser between read and write — timestamp is more stable. If multiple
# entries share a timestamp (rare), the first match is patched.
#
# Patchable fields: timestamp, notes, cost, duration, completed_by. Anything
# else (type, trigger_value, checklist_state, feedback) is intentionally
# read-only — those carry semantic meaning that shouldn't be silently rewritten.
#
# After the patch we recompute last_performed if the edited entry is the
# latest type=completed/reset/skipped entry — otherwise the next_due math
# uses a stale anchor.

@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/history/update",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        # ISO datetime string identifying the entry being edited.
        vol.Required("original_timestamp"): vol.All(str, vol.Length(max=64)),
        # Patch fields — all optional; absent fields stay unchanged.
        vol.Optional("timestamp"): vol.All(str, vol.Length(max=64)),
        vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        vol.Optional("cost"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=0, max=1_000_000)), None),
        vol.Optional("duration"): vol.Any(vol.All(vol.Coerce(int), vol.Range(min=0, max=525_600)), None),
        vol.Optional("completed_by"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
    }
)
@require_write
@websocket_api.async_response
async def ws_update_history_entry(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Edit fields of an existing history entry."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Object not loaded")
        return

    task_id = msg["task_id"]
    history = list(store.get_history(task_id))
    if not history:
        connection.send_error(msg["id"], "not_found", "Task or history not found")
        return

    # Validate new timestamp format up front so we don't half-mutate
    if "timestamp" in msg:
        new_ts = msg["timestamp"]
        try:
            dt_util.parse_datetime(new_ts)
            if dt_util.parse_datetime(new_ts) is None:
                raise ValueError("not a datetime")
        except (ValueError, TypeError):
            connection.send_error(
                msg["id"], "invalid_date",
                "timestamp must be an ISO datetime string",
            )
            return

    # Locate the entry by its original timestamp — first match wins.
    target_index: int | None = None
    for i, h in enumerate(history):
        if h.get("timestamp") == msg["original_timestamp"]:
            target_index = i
            break
    if target_index is None:
        connection.send_error(
            msg["id"], "not_found",
            f"No history entry with timestamp {msg['original_timestamp']!r}",
        )
        return

    patched = dict(history[target_index])

    # Apply patch — explicit None means "clear field" (drop the key entirely
    # so the dict stays minimal); explicit value sets it.
    PATCHABLE = ("timestamp", "notes", "cost", "duration", "completed_by")
    for field in PATCHABLE:
        if field not in msg:
            continue
        value = msg[field]
        if value is None:
            patched.pop(field, None)
        else:
            patched[field] = value

    history[target_index] = patched
    store.set_history(task_id, history)

    # Recompute last_performed if the edited entry is the latest lifecycle
    # entry. Lifecycle = anything that resets the maintenance cycle:
    # COMPLETED, RESET, SKIPPED. Trigger / trigger_replaced entries don't
    # affect last_performed.
    LIFECYCLE_TYPES = {
        HistoryEntryType.COMPLETED,
        HistoryEntryType.RESET,
        HistoryEntryType.SKIPPED,
    }
    lifecycle_entries = [
        h for h in history if h.get("type") in LIFECYCLE_TYPES
    ]
    if lifecycle_entries:
        # "Latest" by timestamp — sort defensively (entries are usually
        # already in append order, but a timestamp edit may have changed that).
        latest = max(
            lifecycle_entries,
            key=lambda h: h.get("timestamp", ""),
        )
        latest_ts = latest.get("timestamp")
        if latest_ts:
            new_lp = latest_ts[:10]  # YYYY-MM-DD prefix
            store.set_last_performed(task_id, new_lp)

    await store.async_save()

    # Refresh coordinator + budget cache so the UI reflects the change
    if rd and rd.coordinator:
        rd.coordinator._recalculate_budget_cache()
        await rd.coordinator.async_request_refresh()

    connection.send_result(
        msg["id"],
        {
            "success": True,
            "patched_index": target_index,
            "new_timestamp": patched.get("timestamp"),
        },
    )
