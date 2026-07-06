"""Task create / update / delete / duplicate WS handlers."""

from __future__ import annotations

import re
from copy import deepcopy
from datetime import date
from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    FLAT_SCHEDULE_TYPES,
    GLOBAL_UNIQUE_ID,
    MAX_ASSIGNEE_POOL,
    MAX_CHECKLIST_ITEM_LENGTH,
    MAX_CHECKLIST_ITEMS,
    MAX_DATE_LENGTH,
    MAX_ENTITY_SLUG_LENGTH,
    MAX_ICON_LENGTH,
    MAX_ID_LENGTH,
    MAX_LABEL_LENGTH,
    MAX_LABELS,
    MAX_META_LENGTH,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_TYPE_LENGTH,
    MAX_URL_LENGTH,
    HistoryEntryType,
)
from ..helpers.dates import INTERVAL_UNITS
from ..helpers.permissions import require_write
from ..helpers.schedule import (
    FLAT_RECURRENCE_KEYS,
    Schedule,
    normalize_task_storage,
)
from ..helpers.task_fields import (
    EARLIEST_COMPLETION_RANGE,
    INTERVAL_ANCHORS,
    INTERVAL_DAYS_RANGE,
    ROTATION_STRATEGY_VALUES,
    TASK_PRIORITIES,
    WARNING_DAYS_RANGE,
)
from . import (
    _get_runtime_data,
    _load_object_entry,
    cleanup_group_refs,
)
from .tasks_persist import async_persist_task
from .tasks_validation import (
    _check_nfc_tag_duplicate,
    _is_safe_url,
    _validate_trigger_config,
)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/create",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("task_type", default="custom"): vol.All(str, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("schedule_type", default="time_based"): vol.All(str, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("interval_days"): vol.Any(
            vol.All(int, vol.Range(min=INTERVAL_DAYS_RANGE[0], max=INTERVAL_DAYS_RANGE[1])), None
        ),
        vol.Optional("interval_unit", default="days"): vol.In(INTERVAL_UNITS),
        vol.Optional("due_date"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
        vol.Optional("interval_anchor", default="completion"): vol.In(INTERVAL_ANCHORS),
        # Nested recurrence (calendar kinds: weekdays / nth_weekday / day_of_month).
        # Validated/canonicalized in the handler via Schedule.from_dict.
        vol.Optional("schedule"): vol.Any(dict, None),
        vol.Optional("warning_days", default=DEFAULT_WARNING_DAYS): vol.All(
            int, vol.Range(min=WARNING_DAYS_RANGE[0], max=WARNING_DAYS_RANGE[1])
        ),
        vol.Optional("earliest_completion_days"): vol.Any(
            vol.All(int, vol.Range(min=EARLIEST_COMPLETION_RANGE[0], max=EARLIEST_COMPLETION_RANGE[1])), None
        ),
        vol.Optional("last_performed"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
        vol.Optional("trigger_config"): vol.Any(dict, None),
        vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        vol.Optional("documentation_url"): vol.Any(vol.All(str, vol.Length(max=MAX_URL_LENGTH)), None),
        vol.Optional("responsible_user_id"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        vol.Optional("assignee_pool"): vol.Any(
            vol.All([vol.All(str, vol.Length(max=MAX_META_LENGTH))], vol.Length(max=MAX_ASSIGNEE_POOL)), None
        ),
        vol.Optional("rotation_strategy"): vol.Any(vol.In(ROTATION_STRATEGY_VALUES), None),
        vol.Optional("entity_slug"): vol.Any(vol.All(str, vol.Length(max=MAX_ENTITY_SLUG_LENGTH)), None),
        vol.Optional("custom_icon"): vol.Any(vol.All(str, vol.Length(max=MAX_ICON_LENGTH)), None),
        vol.Optional("nfc_tag_id"): vol.Any(vol.All(str, vol.Length(max=256)), None),
        # v2.20 (#83): unit for `reading`-type tasks ("kWh", "m³", ...).
        vol.Optional("reading_unit"): vol.Any(vol.All(str, vol.Length(max=32)), None),
        vol.Optional("priority"): vol.In(TASK_PRIORITIES),
        vol.Optional("checklist"): vol.Any(
            vol.All([vol.All(str, vol.Length(max=MAX_CHECKLIST_ITEM_LENGTH))], vol.Length(max=MAX_CHECKLIST_ITEMS)), None
        ),
        vol.Optional("labels"): vol.Any(
            vol.All([vol.All(str, vol.Length(max=MAX_LABEL_LENGTH))], vol.Length(max=MAX_LABELS)), None
        ),
        # HH:MM strict (00–23 : 00–59). None clears the time → midnight semantic.
        vol.Optional("schedule_time"): vol.Any(
            vol.All(str, vol.Match(r"^([01]\d|2[0-3]):[0-5]\d$")),
            None,
        ),
        # v1.3.0: per-task on_complete_action + quick_complete_defaults.
        # Both kept loose at the schema level (vol.Any(dict, None)); strict
        # field-by-field validation lives in helpers/sanitize.py so the
        # config-flow path (which doesn't go through this schema) gets
        # identical validation behaviour.
        vol.Optional("on_complete_action"): vol.Any(dict, None),
        vol.Optional("quick_complete_defaults"): vol.Any(dict, None),
        vol.Optional("enabled", default=True): bool,
        vol.Optional("dry_run", default=False): bool,
    }
)
@require_write
@websocket_api.async_response
async def ws_create_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Add a new task to an existing maintenance object."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    task_id = uuid4().hex
    name = msg["name"].strip()
    if not name:
        connection.send_error(msg["id"], "invalid_input", "Name must not be empty")
        return

    task_data: dict[str, Any] = {
        "id": task_id,
        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
        "name": name,
        "type": msg.get("task_type", "custom"),
        "enabled": msg.get("enabled", True),
        "warning_days": msg.get("warning_days", DEFAULT_WARNING_DAYS),
        # Anchor for next_due fallback when last_performed is None (issue #30).
        # Use HA's timezone-aware "today" to match next_due computation.
        "created_at": dt_util.now().date().isoformat(),
    }

    # Dynamic state (last_performed, history) for Store initialization
    initial_last_performed: str | None = None
    initial_history: list[dict[str, Any]] = []

    # Recurrence: an explicit nested `schedule` (calendar kinds) takes
    # precedence; otherwise build from the flat v2.6.x fields.
    if msg.get("schedule"):
        task_data["schedule"] = Schedule.from_dict(msg["schedule"]).to_dict()
    else:
        task_data["schedule_type"] = msg.get("schedule_type", "time_based")
        if msg.get("interval_days") is not None:
            task_data["interval_days"] = msg["interval_days"]
        if msg.get("interval_unit", "days") != "days":
            task_data["interval_unit"] = msg["interval_unit"]
        if msg.get("due_date") is not None:
            task_data["due_date"] = msg["due_date"]
        if msg.get("interval_anchor", "completion") != "completion":
            task_data["interval_anchor"] = msg["interval_anchor"]
    if msg.get("last_performed") is not None:
        try:
            date.fromisoformat(msg["last_performed"])
        except (ValueError, TypeError):
            connection.send_error(msg["id"], "invalid_format", "last_performed must be a valid date (YYYY-MM-DD)")
            return
        initial_last_performed = msg["last_performed"]
        # Add initial history entry so times_performed reflects the value.
        # Use HA-TZ-aware midnight to keep interval_analyzer consistent.
        from datetime import datetime, time

        lp_date = date.fromisoformat(msg["last_performed"])
        lp_dt = datetime.combine(lp_date, time.min, tzinfo=dt_util.DEFAULT_TIME_ZONE)
        initial_history.append(
            {
                "timestamp": lp_dt.isoformat(),
                "type": HistoryEntryType.COMPLETED,
                "notes": "Initial value set during task creation",
            }
        )
    trigger_config = msg.get("trigger_config")
    tc_errors: list[str] = []
    tc_warnings: list[str] = []
    if trigger_config is not None:
        tc_errors, tc_warnings = _validate_trigger_config(hass, trigger_config)
        if tc_errors:
            connection.send_error(
                msg["id"],
                "invalid_trigger_config",
                "; ".join(tc_errors),
            )
            return
        task_data["trigger_config"] = trigger_config
    if msg.get("notes") is not None:
        task_data["notes"] = msg["notes"]
    if msg.get("documentation_url") is not None:
        if not _is_safe_url(msg["documentation_url"]):
            connection.send_error(msg["id"], "invalid_url", "Only http/https URLs are allowed")
            return
        task_data["documentation_url"] = msg["documentation_url"]
    if msg.get("responsible_user_id") is not None:
        task_data["responsible_user_id"] = msg["responsible_user_id"]
    if msg.get("earliest_completion_days") is not None:
        task_data["earliest_completion_days"] = msg["earliest_completion_days"]
    if msg.get("assignee_pool"):
        from ..helpers.sanitize import sanitize_assignee_pool

        task_data["assignee_pool"] = sanitize_assignee_pool(msg["assignee_pool"])
    if msg.get("rotation_strategy"):
        task_data["rotation_strategy"] = msg["rotation_strategy"]
    if msg.get("entity_slug") is not None:
        slug = msg["entity_slug"]
        if not re.fullmatch(r"[a-z0-9_]+", slug):
            connection.send_error(
                msg["id"],
                "invalid_entity_slug",
                "entity_slug must match [a-z0-9_]+ (lowercase, digits, underscores only)",
            )
            return
        task_data["entity_slug"] = slug
    if msg.get("custom_icon") is not None:
        task_data["custom_icon"] = msg["custom_icon"]
    if msg.get("priority") is not None:
        task_data["priority"] = msg["priority"]
    if msg.get("nfc_tag_id") is not None:
        nfc_val = (msg["nfc_tag_id"] or "").strip() or None  # normalise ""/ whitespace → None
        task_data["nfc_tag_id"] = nfc_val
        if nfc_val:
            nfc_warn = _check_nfc_tag_duplicate(hass, nfc_val)
            if nfc_warn:
                tc_warnings.append(nfc_warn)
    # v2.20 (#83): unit for `reading`-type tasks.
    if msg.get("reading_unit") is not None:
        task_data["reading_unit"] = (msg["reading_unit"] or "").strip() or None
    if msg.get("checklist"):
        task_data["checklist"] = msg["checklist"]
    if msg.get("labels"):
        from ..helpers.sanitize import sanitize_labels

        task_data["labels"] = sanitize_labels(msg["labels"])
    if msg.get("schedule_time"):
        task_data["schedule_time"] = msg["schedule_time"]
    # v1.3.0: optional completion-action + quick-defaults. Strict shape
    # validated by sanitize.cap_action_field / cap_quick_complete_defaults_field
    # below — accepted loosely here, dropped if malformed.
    if msg.get("on_complete_action"):
        task_data["on_complete_action"] = msg["on_complete_action"]
    if msg.get("quick_complete_defaults"):
        task_data["quick_complete_defaults"] = msg["quick_complete_defaults"]
    from ..helpers.sanitize import cap_action_field, cap_quick_complete_defaults_field

    cap_action_field(task_data)
    cap_quick_complete_defaults_field(task_data)

    # Dry-run mode: validate only, do not persist
    if msg.get("dry_run"):
        result: dict[str, Any] = {"valid": True, "task_id": None}
        if tc_warnings:
            result["warnings"] = tc_warnings
        connection.send_result(msg["id"], result)
        return

    await async_persist_task(
        hass,
        entry,
        task_data,
        last_performed=initial_last_performed,
        history=initial_history,
    )

    result = {"task_id": task_id}
    if tc_warnings:
        result["warnings"] = tc_warnings
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/update",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("task_type"): vol.All(str, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("enabled"): bool,
        vol.Optional("schedule_type"): vol.All(str, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("interval_days"): vol.Any(
            vol.All(int, vol.Range(min=INTERVAL_DAYS_RANGE[0], max=INTERVAL_DAYS_RANGE[1])), None
        ),
        vol.Optional("interval_unit"): vol.In(INTERVAL_UNITS),
        vol.Optional("due_date"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
        vol.Optional("interval_anchor"): vol.In(INTERVAL_ANCHORS),
        # Nested recurrence (calendar kinds); see create schema.
        vol.Optional("schedule"): vol.Any(dict, None),
        vol.Optional("warning_days"): vol.All(int, vol.Range(min=WARNING_DAYS_RANGE[0], max=WARNING_DAYS_RANGE[1])),
        vol.Optional("earliest_completion_days"): vol.Any(
            vol.All(int, vol.Range(min=EARLIEST_COMPLETION_RANGE[0], max=EARLIEST_COMPLETION_RANGE[1])), None
        ),
        vol.Optional("last_performed"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
        vol.Optional("trigger_config"): vol.Any(dict, None),
        vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        vol.Optional("documentation_url"): vol.Any(vol.All(str, vol.Length(max=MAX_URL_LENGTH)), None),
        vol.Optional("responsible_user_id"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        vol.Optional("assignee_pool"): vol.Any(
            vol.All([vol.All(str, vol.Length(max=MAX_META_LENGTH))], vol.Length(max=MAX_ASSIGNEE_POOL)), None
        ),
        vol.Optional("rotation_strategy"): vol.Any(vol.In(ROTATION_STRATEGY_VALUES), None),
        vol.Optional("entity_slug"): vol.Any(vol.All(str, vol.Length(max=MAX_ENTITY_SLUG_LENGTH)), None),
        vol.Optional("custom_icon"): vol.Any(vol.All(str, vol.Length(max=MAX_ICON_LENGTH)), None),
        vol.Optional("nfc_tag_id"): vol.Any(vol.All(str, vol.Length(max=256)), None),
        # v2.20 (#83): unit for `reading`-type tasks ("kWh", "m³", ...).
        vol.Optional("reading_unit"): vol.Any(vol.All(str, vol.Length(max=32)), None),
        vol.Optional("priority"): vol.In(TASK_PRIORITIES),
        vol.Optional("checklist"): vol.Any(
            vol.All([vol.All(str, vol.Length(max=MAX_CHECKLIST_ITEM_LENGTH))], vol.Length(max=MAX_CHECKLIST_ITEMS)), None
        ),
        vol.Optional("labels"): vol.Any(
            vol.All([vol.All(str, vol.Length(max=MAX_LABEL_LENGTH))], vol.Length(max=MAX_LABELS)), None
        ),
        vol.Optional("schedule_time"): vol.Any(
            vol.All(str, vol.Match(r"^([01]\d|2[0-3]):[0-5]\d$")),
            None,
        ),
        # v1.3.0: same loose schema as create. Sanitize layer enforces shape.
        vol.Optional("on_complete_action"): vol.Any(dict, None),
        vol.Optional("quick_complete_defaults"): vol.Any(dict, None),
    }
)
@require_write
@websocket_api.async_response
async def ws_update_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update an existing task."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    task_id = msg["task_id"]
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    task = dict(tasks_data[task_id])

    # Strip and validate name if provided
    if "name" in msg:
        msg["name"] = msg["name"].strip()
        if not msg["name"]:
            connection.send_error(msg["id"], "invalid_input", "Name must not be empty")
            return

    # Validate trigger_config if provided
    tc_warnings: list[str] = []
    if "trigger_config" in msg and msg["trigger_config"] is not None:
        tc_errors, tc_warnings = _validate_trigger_config(hass, msg["trigger_config"])
        if tc_errors:
            connection.send_error(
                msg["id"],
                "invalid_trigger_config",
                "; ".join(tc_errors),
            )
            return

    # Validate entity_slug if provided
    if "entity_slug" in msg and msg["entity_slug"] is not None:
        slug = msg["entity_slug"]
        if not re.fullmatch(r"[a-z0-9_]+", slug):
            connection.send_error(
                msg["id"],
                "invalid_entity_slug",
                "entity_slug must match [a-z0-9_]+ (lowercase, digits, underscores only)",
            )
            return

    # Normalise empty NFC tag to None and check uniqueness
    if "nfc_tag_id" in msg:
        msg["nfc_tag_id"] = (msg["nfc_tag_id"] or "").strip() or None
        if msg["nfc_tag_id"]:
            nfc_warn = _check_nfc_tag_duplicate(hass, msg["nfc_tag_id"], exclude_task_id=task_id)
            if nfc_warn:
                tc_warnings.append(nfc_warn)

    # Validate last_performed date format if provided
    if "last_performed" in msg and msg["last_performed"] is not None:
        try:
            date.fromisoformat(msg["last_performed"])
        except (ValueError, TypeError):
            connection.send_error(msg["id"], "invalid_format", "last_performed must be a valid date (YYYY-MM-DD)")
            return

    # Validate documentation_url if provided
    if "documentation_url" in msg and not _is_safe_url(msg["documentation_url"]):
        connection.send_error(msg["id"], "invalid_url", "Only http/https URLs are allowed")
        return

    # Update provided fields. Wire key -> storage key. Almost all are identity;
    # the one rename is deliberate and load-bearing: the WS message envelope
    # reserves "type" for command routing ({"type": "maintenance_supporter/
    # task/update"}), so a task's own type must travel as "task_type" on the
    # wire and is stored as "type". Do NOT "simplify" this to "type": "type"
    # — it would collide with the routing key. The panel↔config-flow parity
    # test (test_parity_task_fields) encodes the same task_type->type alias.
    field_map = {
        "name": "name",
        "task_type": "type",
        "enabled": "enabled",
        "schedule_type": "schedule_type",
        "interval_days": "interval_days",
        "interval_unit": "interval_unit",
        "due_date": "due_date",
        "interval_anchor": "interval_anchor",
        "warning_days": "warning_days",
        "earliest_completion_days": "earliest_completion_days",
        "last_performed": "last_performed",
        "trigger_config": "trigger_config",
        "notes": "notes",
        "documentation_url": "documentation_url",
        "responsible_user_id": "responsible_user_id",
        "assignee_pool": "assignee_pool",
        "rotation_strategy": "rotation_strategy",
        "entity_slug": "entity_slug",
        "custom_icon": "custom_icon",
        "nfc_tag_id": "nfc_tag_id",
        "reading_unit": "reading_unit",
        "priority": "priority",
        "checklist": "checklist",
        "labels": "labels",
        "schedule_time": "schedule_time",
        # v1.3.0
        "on_complete_action": "on_complete_action",
        "quick_complete_defaults": "quick_complete_defaults",
    }
    for msg_key, data_key in field_map.items():
        if msg_key in msg:
            task[data_key] = msg[msg_key]

    # Recurrence resolution: an explicit nested `schedule` wins (calendar kinds
    # and kind-switches). Otherwise rebuild from the flat view ONLY when a real
    # legacy recurrence signal is present — a flat interval/due field, or a legacy
    # schedule_type. A bare calendar-kind schedule_type (e.g. a client echoing
    # the derived "nth_weekday" the payload exposed) is NOT a flat rebuild signal
    # and must not collapse the calendar schedule to manual (the #58/#42 class).
    _flat_recurrence_edit = (
        any(k in msg for k in ("interval_days", "interval_unit", "interval_anchor", "due_date"))
        or msg.get("schedule_type") in FLAT_SCHEDULE_TYPES
    )
    if msg.get("schedule"):
        for key in FLAT_RECURRENCE_KEYS:
            task.pop(key, None)
        task["schedule"] = Schedule.from_dict(msg["schedule"]).to_dict()
    elif _flat_recurrence_edit:
        task.pop("schedule", None)
    elif "schedule_type" in msg:
        # Calendar-kind schedule_type echo with no schedule → keep the nested
        # schedule; drop the stray flat schedule_type so normalize stays clean.
        task.pop("schedule_type", None)

    # Validate/cap newly-applied v1.3.0 fields. cap_task_fields runs the
    # full task sanitize (caches, lengths, action shape) so update-path
    # behaves identically to create-path.
    from ..helpers.sanitize import (
        cap_action_field,
        cap_quick_complete_defaults_field,
        sanitize_assignee_pool,
        sanitize_labels,
    )

    cap_action_field(task)
    cap_quick_complete_defaults_field(task)
    if "labels" in task:
        task["labels"] = sanitize_labels(task["labels"])
    if "assignee_pool" in task:
        task["assignee_pool"] = sanitize_assignee_pool(task["assignee_pool"])

    # Clear stale trigger runtime in Store only when trigger fundamentally changes
    if "trigger_config" in msg:
        old_tc = tasks_data.get(task_id, {}).get("trigger_config") or {}
        new_tc = msg["trigger_config"] or {}
        if (
            old_tc.get("type") != new_tc.get("type")
            or old_tc.get("entity_id") != new_tc.get("entity_id")
            or old_tc.get("entity_ids") != new_tc.get("entity_ids")
        ):
            rd = _get_runtime_data(hass, msg["entry_id"])
            if rd and rd.store:
                rd.store.clear_trigger_runtime(task_id)
                rd.store.async_delay_save()

    tasks_data[task_id] = normalize_task_storage(task)
    new_data = dict(entry.data)
    new_data[CONF_TASKS] = tasks_data
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Reload entry to pick up changed task config (triggers, schedule, etc.)
    await hass.config_entries.async_reload(entry.entry_id)

    result: dict[str, Any] = {"success": True}
    if tc_warnings:
        result["warnings"] = tc_warnings
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/delete",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_delete_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a task from a maintenance object."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    if not await async_delete_task(hass, entry, msg["task_id"]):
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    # Reload to re-create remaining entities
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


async def async_delete_task(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_id: str,
) -> bool:
    """Remove a task and all its side-state from an object entry.

    Shared by the ``task/delete`` WS command and the retention auto-delete sweep
    (helpers/retention). Does the ConfigEntry write plus the Store / notification
    / entity-registry / group-ref / repair-issue cleanup, but NOT the entry
    reload and NOT any WS reply — the caller reloads (once, even for a batch) and
    replies. Returns False when ``task_id`` isn't in the entry.
    """
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    if task_id not in new_tasks:
        return False

    old_trigger_config = new_tasks[task_id].get("trigger_config")
    del new_tasks[task_id]
    new_data[CONF_TASKS] = new_tasks

    # Remove from task_ids
    obj = dict(new_data.get(CONF_OBJECT, {}))
    obj["task_ids"] = [tid for tid in obj.get("task_ids", []) if tid != task_id]
    new_data[CONF_OBJECT] = obj

    hass.config_entries.async_update_entry(entry, data=new_data)

    # Clean up Store
    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        store.remove_task(task_id)
        await store.async_save()

    # Clean up notification state for deleted task
    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    if nm is not None:
        nm.clear_task_state(entry.entry_id, task_id)

    # Remove orphaned entity registry entries for the deleted task. Match any
    # per-task entity — sensor (`_{task_id}`), binary_sensor (`_{task_id}_overdue`),
    # action buttons (`_{task_id}_complete/skip/reset`) and any future platform.
    # task_id is a UUID, so the contained-segment check is unambiguous.
    ent_reg = er.async_get(hass)
    for ent_entry in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        if ent_entry.unique_id and f"_{task_id}" in ent_entry.unique_id:
            ent_reg.async_remove(ent_entry.entity_id)

    # Clean up group references
    cleanup_group_refs(hass, task_id=task_id)

    # Clean up the global vacation exempt list (journey L1): the list is
    # persistent and task-id keyed — without this, deleted ids accumulate
    # there forever and confuse the vacation preview UI.
    from ..const import CONF_VACATION_EXEMPT_TASK_IDS

    for ge in hass.config_entries.async_entries(DOMAIN):
        if ge.unique_id != GLOBAL_UNIQUE_ID:
            continue
        exempt = ge.options.get(CONF_VACATION_EXEMPT_TASK_IDS) or []
        if isinstance(exempt, list) and task_id in exempt:
            hass.config_entries.async_update_entry(
                ge,
                options={
                    **dict(ge.options),
                    CONF_VACATION_EXEMPT_TASK_IDS: [t for t in exempt if t != task_id],
                },
            )
        break

    # Clean up any repair issues referencing this task
    if old_trigger_config:
        from ..entity.triggers import normalize_entity_ids

        for eid in normalize_entity_ids(old_trigger_config):
            ir.async_delete_issue(
                hass,
                DOMAIN,
                f"missing_trigger_{entry.entry_id}_{task_id}_{eid}",
            )

    return True


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/duplicate",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_duplicate_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Clone a task within the same object as a fresh, un-started copy.

    Copies the source task's *configuration* (schedule, trigger, checklist,
    completion actions, …) — which lives in ConfigEntry.data — into a new task
    with a new id and a "… (copy)" name. Dynamic state (history, last_performed,
    trigger runtime) is not copied: the copy starts clean. Fields that must be
    unique per task (entity_slug, nfc_tag_id) are dropped so the copy gets its
    own auto-generated slug and no colliding tag.
    """
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    source = entry.data.get(CONF_TASKS, {}).get(msg["task_id"])
    if source is None:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    new_task = deepcopy(dict(source))
    new_task["id"] = uuid4().hex
    base_name = str(source.get("name", "")).strip() or "Task"
    new_task["name"] = f"{base_name} (copy)"[:MAX_NAME_LENGTH]
    new_task["created_at"] = dt_util.now().date().isoformat()
    # Never carry over per-task-unique keys or any stray dynamic state.
    for key in ("entity_slug", "nfc_tag_id", "history", "last_performed", "last_planned_due", "adaptive_config"):
        new_task.pop(key, None)
    if isinstance(new_task.get("trigger_config"), dict):
        new_task["trigger_config"].pop("_trigger_state", None)

    await async_persist_task(hass, entry, new_task)

    connection.send_result(msg["id"], {"task_id": new_task["id"]})
