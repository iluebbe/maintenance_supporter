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
    MAX_TIMESTAMP_LENGTH,
)
from ..helpers.completion_photos import (
    MAX_COMPLETION_PHOTOS,
    history_photo_ids,
    normalize_photo_doc_ids,
)
from ..helpers.permissions import require_write
from ..storage import reanchor_from_history
from . import (
    READING_VALUES_FIELD,
    USED_PARTS_FIELD,
    _load_object_task,
    async_commit_store,
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
        vol.Required("original_timestamp"): vol.All(str, vol.Length(max=MAX_TIMESTAMP_LENGTH)),
        # Patch fields — all optional; absent fields stay unchanged.
        vol.Optional("timestamp"): vol.All(str, vol.Length(max=MAX_TIMESTAMP_LENGTH)),
        vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        vol.Optional("cost"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=0, max=MAX_COST)), None),
        vol.Optional("duration"): vol.Any(vol.All(vol.Coerce(int), vol.Range(min=0, max=MAX_DURATION_MINUTES)), None),
        vol.Optional("completed_by"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        # Recorded readings (#161 phase 2): a typo among nine meter values is
        # likely, and nothing downstream depends on the entry being frozen.
        # The scalar patches like the other fields; the slot map REPLACES the
        # snapshot (None value = that meter unread), ids validated in the handler.
        vol.Optional("reading_value"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=-1e12, max=1e12)), None),
        vol.Optional("reading_values"): READING_VALUES_FIELD,
        # #130: edit the entry's part consumption. The stock is reconciled by
        # the per-part DELTA against the entry's previous used_parts; None (or
        # []) clears the consumption and returns the old quantities to stock.
        # Same shape + cap as the live completion path (websocket.USED_PARTS_FIELD).
        vol.Optional("used_parts"): USED_PARTS_FIELD,
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
    ctx = _load_object_task(hass, connection, msg, merged=True, need_store=True)
    if ctx is None:
        return
    entry, rd, slot_task = ctx
    store = rd.store

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

    # #161 phase 2: "never both" — the scalar cannot be set on an entry that
    # carries a slot snapshot, nor on a task that records slots.
    if msg.get("reading_value") is not None:
        if patched.get("reading_values") or slot_task.get("readings"):
            connection.send_error(
                msg["id"], "invalid_input", "This entry records named readings — patch reading_values instead"
            )
            return

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

        try:
            new_values = resolve_reading_values(
                slot_task.get("readings") or [],
                msg["reading_values"],
                keep=history_reading_values(patched),
                default_unit=slot_task.get("reading_unit"),
            )
        except ValueError as err:
            connection.send_error(msg["id"], "invalid_input", str(err))
            return
        if new_values:
            patched["reading_values"] = new_values
            # The snapshot supersedes a scalar from the pre-slot era.
            patched.pop("reading_value", None)
        else:
            patched.pop("reading_values", None)

    # #130: part consumption on the entry. The stock is adjusted by the
    # per-part delta between the stored and the submitted selection, so
    # corrections and backfills keep the shelf honest. Best-effort like the
    # live completion path — a vanished part skips its stock math.
    if "used_parts" in msg:
        from ..parts_runtime import async_apply_history_parts_edit

        old_used = patched.get("used_parts") or []
        # Deliberately NOT sanitize_consumes_parts here: an edited entry may
        # reference a part that has since been deleted, and that link must
        # stay RECORDED (stock math skips it) — dropping unknown ids would
        # rewrite history. Field validation (ids, quantity range, list cap)
        # is the schema's job above.
        new_used = msg["used_parts"] or []
        enriched = await async_apply_history_parts_edit(hass, entry, slot_task, old_used, new_used)
        if enriched:
            patched["used_parts"] = enriched
        else:
            patched.pop("used_parts", None)

    # #161: completion photos on the entry. A new id is linked to the task
    # like a live completion does (best-effort); a removed id keeps its
    # document and its links — only the entry forgets it. The legacy
    # scalar is folded into the list the moment the entry is edited.
    if "photo_doc_ids" in msg:
        from ..helpers.completion_requirements import own_photo_doc_ids
        from . import object_id_for_entry

        old_photos = history_photo_ids(patched)
        requested = normalize_photo_doc_ids(msg["photo_doc_ids"])
        # A NEW photo must be a file of this object (bug audit 2026-09-26,
        # same rule as task/complete); one the entry already carries stays
        # even when it lives elsewhere now (a shared photo of a moved task).
        own = set(own_photo_doc_ids(hass, object_id_for_entry(entry), [d for d in requested if d not in old_photos]))
        new_photos = [d for d in requested if d in old_photos or d in own]
        patched.pop("photo_doc_id", None)
        if new_photos:
            patched["photo_doc_ids"] = new_photos
        else:
            patched.pop("photo_doc_ids", None)
        if rd.coordinator:
            for doc_id in new_photos:
                if doc_id not in old_photos:
                    await rd.coordinator._link_completion_photo(doc_id, task_id)

    # The parts / photo steps above await: a completion (or another edit)
    # that landed meanwhile would be wiped by writing back the snapshot read
    # at the top. Patch the entry into the CURRENT history, found again by
    # its timestamp (bug audit 2026-09-26).
    history = list(store.get_history(task_id))
    target_index = next(
        (i for i, h in enumerate(history) if h.get("timestamp") == msg["original_timestamp"]),
        None,
    )
    if target_index is None:
        connection.send_error(msg["id"], "not_found", f"No history entry with timestamp {msg['original_timestamp']!r}")
        return
    history[target_index] = patched
    store.set_history(task_id, history)

    # Re-derive last_performed from the (possibly re-dated) lifecycle
    # entries — the same rule the delete command applies, so a timestamp edit
    # that moves the anchor also drops a stale postpone. Only the patchable
    # fields change here (never an entry's type), so a task whose only
    # lifecycle entry is the seed keeps its anchor.
    if any(h.get("type") in LIFECYCLE_HISTORY_TYPES for h in history):
        reanchor_from_history(store, task_id, history)

    # Save + budget cache + immediate refresh so the UI reflects the change.
    await async_commit_store(rd, budget=True)

    connection.send_result(
        msg["id"],
        {
            "success": True,
            "patched_index": target_index,
            "new_timestamp": patched.get("timestamp"),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/history/delete",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("timestamp"): vol.All(str, vol.Length(max=MAX_TIMESTAMP_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_delete_history_entry(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Remove one history entry (#170): a completion recorded by mistake, a
    skip that means nothing on paper. The entry is identified by its
    timestamp (unique within a task's history); the task's last-performed
    anchor is re-derived from what remains, so removing the latest completion
    moves the schedule back to the previous one. Photos stay in the object's
    documents and consumed parts are not restocked — a bookkeeping
    correction, not an undo."""
    ctx = _load_object_task(hass, connection, msg, need_store=True)
    if ctx is None:
        return
    _entry, rd, _task = ctx
    store = rd.store
    task_id = msg["task_id"]
    history = list(store.get_history(task_id))
    remaining = [h for h in history if h.get("timestamp") != msg["timestamp"]]
    if len(remaining) == len(history):
        connection.send_error(msg["id"], "not_found", f"No history entry with timestamp {msg['timestamp']!r}")
        return
    store.set_history(task_id, remaining)
    # Nothing left to anchor the cycle on → the task reads as never performed
    # until its next completion (the static config's own last_performed, if
    # any, shows through the merge). A moved anchor drops a stale postpone.
    reanchor_from_history(store, task_id, remaining)
    await async_commit_store(rd, budget=True)
    connection.send_result(msg["id"], {"success": True, "remaining": len(remaining)})

