"""Task history-entry edit WS handler."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import (
    LIFECYCLE_HISTORY_TYPES,
    MAX_COST,
    MAX_DURATION_MINUTES,
    MAX_ID_LENGTH,
    MAX_META_LENGTH,
    MAX_TEXT_LENGTH,
)
from ..helpers.completion_photos import (
    MAX_COMPLETION_PHOTOS,
    history_photo_ids,
    normalize_photo_doc_ids,
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
# Patchable fields: timestamp, notes, cost, duration, completed_by, since
# #130 used_parts (stock reconciled by the per-part delta) and since #161
# photo_doc_ids (add/remove completion photos after the fact). Anything else
# (type, trigger_value, checklist_state, feedback) is intentionally read-only —
# those carry semantic meaning that shouldn't be silently rewritten.
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
        vol.Optional("cost"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=0, max=MAX_COST)), None),
        vol.Optional("duration"): vol.Any(vol.All(vol.Coerce(int), vol.Range(min=0, max=MAX_DURATION_MINUTES)), None),
        vol.Optional("completed_by"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        # Recorded readings (#161 phase 2): a typo among nine meter values is
        # likely, and nothing downstream depends on the entry being frozen.
        # The scalar patches like the other fields; the slot map REPLACES the
        # snapshot (None value = that meter unread), ids validated in the handler.
        vol.Optional("reading_value"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=-1e12, max=1e12)), None),
        vol.Optional("reading_values"): vol.Any(
            {str: vol.Any(vol.All(vol.Coerce(float), vol.Range(min=-1e12, max=1e12)), None)},
            None,
        ),
        # #130: edit the entry's part consumption. The stock is reconciled by
        # the per-part DELTA against the entry's previous used_parts; None (or
        # []) clears the consumption and returns the old quantities to stock.
        vol.Optional("used_parts"): vol.Any(
            vol.All(
                [
                    {
                        vol.Required("part_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
                        vol.Optional("quantity"): vol.All(vol.Coerce(float), vol.Range(min=0.01, max=999)),
                        vol.Optional("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
                    }
                ],
                # Same cap as the live completion path (tasks_actions.py) —
                # the edit path must not accept what completion refuses.
                vol.Length(max=10),
            ),
            None,
        ),
        # #161: the entry's completion photos. Replaces the whole list; None
        # (or []) detaches every photo from the entry. The documents
        # themselves are never deleted here — they stay in the object's
        # documents, the entry merely stops pointing at them.
        vol.Optional("photo_doc_ids"): vol.Any(
            vol.All([vol.All(str, vol.Length(max=MAX_ID_LENGTH))], vol.Length(max=MAX_COMPLETION_PHOTOS)),
            None,
        ),
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
        parsed_ts = dt_util.parse_datetime(msg["timestamp"])
        if parsed_ts is None:
            connection.send_error(
                msg["id"],
                "invalid_date",
                "timestamp must be an ISO datetime string",
            )
            return
        # Mirror the completed_at choke point (coordinator): a naive value
        # means local time, and a FUTURE moment is refused — the anchor
        # recompute below would otherwise push next_due into the future
        # (bug audit 2026-08-22; the backfill path already rejected this).
        if parsed_ts.tzinfo is None:
            parsed_ts = parsed_ts.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
        if parsed_ts > dt_util.now():
            connection.send_error(
                msg["id"],
                "invalid_date",
                "timestamp cannot be in the future",
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
            msg["id"],
            "not_found",
            f"No history entry with timestamp {msg['original_timestamp']!r}",
        )
        return

    patched = dict(history[target_index])

    # Apply patch — explicit None means "clear field" (drop the key entirely
    # so the dict stays minimal); explicit value sets it.
    PATCHABLE = ("timestamp", "notes", "cost", "duration", "completed_by", "reading_value")
    for field in PATCHABLE:
        if field not in msg:
            continue
        value = msg[field]
        if value is None:
            patched.pop(field, None)
        else:
            patched[field] = value

    # #161 phase 2: the slot snapshot. Ids resolve against the task's current
    # slots OR the entry's own snapshot (a slot deleted since the completion
    # stays editable); anything else is refused rather than guessed.
    if "reading_values" in msg:
        from ..helpers.reading_slots import history_reading_values, resolve_reading_values
        from . import _get_merged_tasks

        slots = (_get_merged_tasks(entry).get(task_id) or {}).get("readings") or []
        try:
            new_values = resolve_reading_values(slots, msg["reading_values"], keep=history_reading_values(patched))
        except ValueError as err:
            connection.send_error(msg["id"], "invalid_input", str(err))
            return
        if new_values:
            patched["reading_values"] = new_values
        else:
            patched.pop("reading_values", None)

    # #130: part consumption on the entry. The stock is adjusted by the
    # per-part delta between the stored and the submitted selection, so
    # corrections and backfills keep the shelf honest. Best-effort like the
    # live completion path — a vanished part skips its stock math.
    if "used_parts" in msg:
        from ..parts_runtime import async_apply_history_parts_edit
        from . import _get_merged_tasks

        old_used = patched.get("used_parts") or []
        # Deliberately NOT sanitize_consumes_parts here: an edited entry may
        # reference a part that has since been deleted, and that link must
        # stay RECORDED (stock math skips it) — dropping unknown ids would
        # rewrite history. Field validation (ids, quantity range, list cap)
        # is the schema's job above.
        new_used = msg["used_parts"] or []
        task_data = _get_merged_tasks(entry).get(task_id) or {}
        enriched = await async_apply_history_parts_edit(hass, entry, task_data, old_used, new_used)
        if enriched:
            patched["used_parts"] = enriched
        else:
            patched.pop("used_parts", None)

    # #161: completion photos on the entry. A new id is linked to the task
    # like a live completion does (best-effort); a removed id keeps its
    # document and its links — only the entry forgets it. The legacy
    # scalar is folded into the list the moment the entry is edited.
    if "photo_doc_ids" in msg:
        old_photos = history_photo_ids(patched)
        new_photos = normalize_photo_doc_ids(msg["photo_doc_ids"])
        patched.pop("photo_doc_id", None)
        if new_photos:
            patched["photo_doc_ids"] = new_photos
        else:
            patched.pop("photo_doc_ids", None)
        if rd and rd.coordinator:
            for doc_id in new_photos:
                if doc_id not in old_photos:
                    await rd.coordinator._link_completion_photo(doc_id, task_id)

    history[target_index] = patched
    store.set_history(task_id, history)

    # Recompute last_performed if the edited entry is the latest lifecycle
    # entry. Lifecycle = anything that resets the maintenance cycle (shared
    # set with the backdated-completion path, #133). Trigger /
    # trigger_replaced entries don't affect last_performed.
    lifecycle_entries = [h for h in history if h.get("type") in LIFECYCLE_HISTORY_TYPES]
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
        await rd.coordinator.async_refresh_now()

    connection.send_result(
        msg["id"],
        {
            "success": True,
            "patched_index": target_index,
            "new_timestamp": patched.get("timestamp"),
        },
    )
