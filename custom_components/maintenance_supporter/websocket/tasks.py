"""WebSocket handlers for task CRUD, validation, and actions."""

from __future__ import annotations

import re
from datetime import date
from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_CHECKLIST_ITEM_LENGTH,
    MAX_CHECKLIST_ITEMS,
    MAX_DATE_LENGTH,
    MAX_ENTITY_SLUG_LENGTH,
    MAX_ICON_LENGTH,
    MAX_ID_LENGTH,
    MAX_INTERVAL_DAYS,
    MAX_META_LENGTH,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_TYPE_LENGTH,
    MAX_URL_LENGTH,
    HistoryEntryType,
)
from ..helpers.dates import INTERVAL_UNITS
from ..helpers.schedule import (
    FLAT_RECURRENCE_KEYS,
    Schedule,
    normalize_task_storage,
)
from . import (
    _build_task_summary,
    _get_merged_tasks,
    _get_object_entries,
    _get_runtime_data,
    _load_object_entry,
    cleanup_group_refs,
)

# ---------------------------------------------------------------------------
# Validation helpers
# ---------------------------------------------------------------------------

_SAFE_URL_SCHEMES = {"http", "https", ""}


def _is_safe_url(url: str | None) -> bool:
    """Reject javascript:, data:, protocol-relative, and other dangerous URL schemes."""
    if not url:
        return True
    # Block protocol-relative URLs like //evil.com
    if url.startswith("//"):
        return False
    try:
        from urllib.parse import urlparse
        scheme = urlparse(url).scheme.lower()
        return scheme in _SAFE_URL_SCHEMES
    except Exception:  # noqa: BLE001 - any malformed URL is rejected as unsafe
        return False


# ---------------------------------------------------------------------------
# NFC tag uniqueness check
# ---------------------------------------------------------------------------


def _check_nfc_tag_duplicate(
    hass: HomeAssistant, nfc_tag_id: str, exclude_task_id: str | None = None
) -> str | None:
    """Check if an NFC tag ID is already in use by another task.

    Returns a warning message if duplicate, or None.
    """
    for entry in _get_object_entries(hass):
        tasks = entry.data.get(CONF_TASKS, {})
        obj_name = entry.data.get(CONF_OBJECT, {}).get(CONF_OBJECT_NAME, "")
        for tid, tdata in tasks.items():
            if tid == exclude_task_id:
                continue
            if tdata.get("nfc_tag_id") == nfc_tag_id:
                return (
                    f"NFC tag '{nfc_tag_id}' is already linked to task "
                    f"'{tdata.get('name', tid)}' on object '{obj_name}'"
                )
    return None


# ---------------------------------------------------------------------------
# Trigger config validation
# ---------------------------------------------------------------------------

_VALID_TRIGGER_TYPES = {"threshold", "counter", "state_change", "runtime", "compound"}

_TRIGGER_REQUIRED_FIELDS: dict[str, list[str]] = {
    "threshold": [],  # at least one of trigger_above/trigger_below checked below
    "counter": ["trigger_target_value"],
    "state_change": [],
    "runtime": ["trigger_runtime_hours"],
    "compound": [],  # conditions validated separately
}

_TRIGGER_ALLOWED_KEYS: set[str] = {
    "type", "entity_id", "entity_ids", "entity_logic", "attribute",
    # threshold
    "trigger_above", "trigger_below", "trigger_for_minutes",
    # counter
    "trigger_target_value", "trigger_delta_mode",
    # runtime
    "trigger_runtime_hours", "trigger_on_states",
    # state_change
    "trigger_from_state", "trigger_to_state", "trigger_target_changes",
    # compound
    "compound_logic", "conditions",
}


def _validate_trigger_config(
    hass: HomeAssistant,
    trigger_config: dict[str, Any],
) -> tuple[list[str], list[str]]:
    """Validate trigger_config structure.

    Returns (errors, warnings).
    Accepts both ``entity_id`` (str) and ``entity_ids`` (list[str]).
    """
    from ..entity.triggers import normalize_entity_ids

    errors: list[str] = []
    warnings: list[str] = []

    # Trigger type
    trigger_type = trigger_config.get("type", "threshold")
    if trigger_type not in _VALID_TRIGGER_TYPES:
        errors.append(
            f"Invalid trigger type '{trigger_type}'. "
            f"Must be one of: {', '.join(sorted(_VALID_TRIGGER_TYPES))}"
        )
        return errors, warnings

    # --- Compound triggers ---
    if trigger_type == "compound":
        return _validate_compound_trigger(hass, trigger_config)

    # --- Non-compound: entity validation ---
    entity_ids = normalize_entity_ids(trigger_config)
    if not entity_ids:
        errors.append("trigger_config requires entity_id or entity_ids")
    else:
        for eid in entity_ids:
            state = hass.states.get(eid)
            if state is None:
                warnings.append(f"Entity {eid} does not exist (yet)")
            elif state.state in ("unavailable", "unknown"):
                warnings.append(
                    f"Entity {eid} is currently '{state.state}'"
                )
        # Ensure entity_id is set for backwards compat
        if not trigger_config.get("entity_id"):
            trigger_config["entity_id"] = entity_ids[0]
        # Always store entity_ids list
        trigger_config["entity_ids"] = entity_ids

    # Validate entity_logic
    entity_logic = trigger_config.get("entity_logic")
    if entity_logic is not None and entity_logic not in ("any", "all"):
        errors.append(
            f"trigger_config.entity_logic must be 'any' or 'all', "
            f"got '{entity_logic}'"
        )

    # Required fields per type
    for field in _TRIGGER_REQUIRED_FIELDS[trigger_type]:
        if trigger_config.get(field) is None:
            errors.append(f"trigger_config.{field} is required for type '{trigger_type}'")

    # Threshold: at least one of trigger_above or trigger_below
    if trigger_type == "threshold":
        if trigger_config.get("trigger_above") is None and trigger_config.get("trigger_below") is None:
            errors.append(
                "trigger_config requires at least one of "
                "'trigger_above' or 'trigger_below' for type 'threshold'"
            )

    # Runtime: validate trigger_on_states if provided
    if trigger_type == "runtime":
        on_states = trigger_config.get("trigger_on_states")
        if on_states is not None:
            if not isinstance(on_states, list) or not all(
                isinstance(s, str) and s.strip() for s in on_states
            ):
                errors.append(
                    "trigger_config.trigger_on_states must be a list of "
                    "non-empty strings"
                )
            elif len(on_states) == 0:
                errors.append(
                    "trigger_config.trigger_on_states must not be empty "
                    "when provided"
                )

    # Strip unknown keys to prevent data pollution
    unknown = set(trigger_config) - _TRIGGER_ALLOWED_KEYS
    for key in unknown:
        del trigger_config[key]

    # Normalise state_change from/to: HA's state machine stores values lowercase
    # ("on"/"off"/"home"/...). Users typing "ON"/"OFF" expect a match — same
    # forgiving treatment as the runtime trigger, which lowercases trigger_on_states.
    if trigger_type == "state_change":
        for key in ("trigger_from_state", "trigger_to_state"):
            val = trigger_config.get(key)
            if isinstance(val, str):
                stripped = val.strip().lower()
                if stripped:
                    trigger_config[key] = stripped
                else:
                    trigger_config.pop(key, None)

    return errors, warnings


def _validate_compound_trigger(
    hass: HomeAssistant,
    trigger_config: dict[str, Any],
) -> tuple[list[str], list[str]]:
    """Validate a compound trigger config."""
    errors: list[str] = []
    warnings: list[str] = []

    compound_logic = trigger_config.get("compound_logic", "AND").upper()
    if compound_logic not in ("AND", "OR"):
        errors.append(
            f"compound_logic must be 'AND' or 'OR', got '{compound_logic}'"
        )

    conditions = trigger_config.get("conditions")
    if not isinstance(conditions, list) or len(conditions) < 2:
        errors.append(
            "Compound trigger requires 'conditions' list with at least 2 entries"
        )
        return errors, warnings

    for idx, condition in enumerate(conditions):
        if not isinstance(condition, dict):
            errors.append(f"Condition {idx} must be a dict")
            continue
        cond_type = condition.get("type", "threshold")
        if cond_type == "compound":
            errors.append(
                f"Condition {idx}: nested compound triggers are not allowed"
            )
            continue
        # Validate each condition as a regular trigger
        cond_errors, cond_warnings = _validate_trigger_config(hass, condition)
        for err in cond_errors:
            errors.append(f"Condition {idx}: {err}")
        for warn in cond_warnings:
            warnings.append(f"Condition {idx}: {warn}")

    return errors, warnings


# ---------------------------------------------------------------------------
# Task CRUD
# ---------------------------------------------------------------------------


async def async_persist_task(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: dict[str, Any],
    *,
    last_performed: str | None = None,
    history: list[dict[str, Any]] | None = None,
) -> None:
    """Persist a freshly-built task into an object entry and reload it.

    Shared by the ``task/create`` WS command and the ``add_task`` service
    (DRY): updates ConfigEntry.data + the object's task_ids, initializes the
    Store dynamic state, and reloads the entry so the task's entities
    (sensor / binary_sensor / buttons) are created.
    """
    # Store recurrence in the canonical nested `schedule` shape (schedule-model v2).
    task_data = normalize_task_storage(task_data)
    task_id = task_data["id"]
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    new_tasks[task_id] = task_data
    new_data[CONF_TASKS] = new_tasks

    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = list(obj.get("task_ids", []))
    task_ids.append(task_id)
    obj["task_ids"] = task_ids
    new_data[CONF_OBJECT] = obj

    hass.config_entries.async_update_entry(entry, data=new_data)

    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        store.init_task(task_id, last_performed=last_performed)
        if history:
            store.set_history(task_id, history)
        await store.async_save()
    else:
        # Legacy: dynamic fields live in ConfigEntry.data
        task_data["last_performed"] = last_performed
        task_data["history"] = history or []
        new_tasks[task_id] = task_data
        new_data[CONF_TASKS] = new_tasks
        hass.config_entries.async_update_entry(entry, data=new_data)

    await hass.config_entries.async_reload(entry.entry_id)


async def async_create_task_simple(
    hass: HomeAssistant,
    *,
    entry_id: str,
    name: str,
    task_type: str = "custom",
    schedule_type: str = "time_based",
    interval_days: int | None = None,
    interval_unit: str = "days",
    due_date: str | None = None,
    warning_days: int = 7,
    enabled: bool = True,
    notes: str | None = None,
) -> str:
    """Create a task with the common fields and persist it; return task_id.

    The service-facing creation path — a focused subset of ws_create_task's
    field set — sharing :func:`async_persist_task` with the WS handler (DRY).
    For the full field set (triggers, checklists, completion actions, …) use
    the panel / card dialogs or the ``task/create`` WS command.

    Raises ValueError if the entry_id is not a maintenance object or the name
    is empty.
    """
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        raise ValueError(f"No maintenance object found for entry_id {entry_id!r}")
    name = (name or "").strip()
    if not name:
        raise ValueError("Name must not be empty")
    task_data: dict[str, Any] = {
        "id": uuid4().hex,
        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
        "name": name,
        "type": task_type,
        "enabled": enabled,
        "schedule_type": schedule_type,
        "warning_days": warning_days,
        "created_at": dt_util.now().date().isoformat(),
    }
    if interval_days is not None:
        task_data["interval_days"] = interval_days
    if interval_unit and interval_unit != "days":
        task_data["interval_unit"] = interval_unit
    if due_date:
        task_data["due_date"] = due_date
    if notes:
        task_data["notes"] = notes
    await async_persist_task(hass, entry, task_data)
    return task_data["id"]


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/create",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("task_type", default="custom"): vol.All(str, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("schedule_type", default="time_based"): vol.All(str, vol.Length(max=MAX_TYPE_LENGTH)),
        vol.Optional("interval_days"): vol.Any(vol.All(int, vol.Range(min=1, max=MAX_INTERVAL_DAYS)), None),
        vol.Optional("interval_unit", default="days"): vol.In(INTERVAL_UNITS),
        vol.Optional("due_date"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
        vol.Optional("interval_anchor", default="completion"): vol.In(["completion", "planned"]),
        # Nested recurrence (calendar kinds: weekdays / nth_weekday / day_of_month).
        # Validated/canonicalized in the handler via Schedule.from_dict.
        vol.Optional("schedule"): vol.Any(dict, None),
        vol.Optional("warning_days", default=7): vol.All(int, vol.Range(min=0, max=365)),
        vol.Optional("last_performed"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
        vol.Optional("trigger_config"): vol.Any(dict, None),
        vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        vol.Optional("documentation_url"): vol.Any(vol.All(str, vol.Length(max=MAX_URL_LENGTH)), None),
        vol.Optional("responsible_user_id"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        vol.Optional("entity_slug"): vol.Any(vol.All(str, vol.Length(max=MAX_ENTITY_SLUG_LENGTH)), None),
        vol.Optional("custom_icon"): vol.Any(vol.All(str, vol.Length(max=MAX_ICON_LENGTH)), None),
        vol.Optional("nfc_tag_id"): vol.Any(vol.All(str, vol.Length(max=256)), None),
        vol.Optional("checklist"): vol.Any(vol.All([vol.All(str, vol.Length(max=MAX_CHECKLIST_ITEM_LENGTH))], vol.Length(max=MAX_CHECKLIST_ITEMS)), None),
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
@websocket_api.require_admin
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
        "warning_days": msg.get("warning_days", 7),
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
        initial_history.append({
            "timestamp": lp_dt.isoformat(),
            "type": HistoryEntryType.COMPLETED,
            "notes": "Initial value set during task creation",
        })
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
    if msg.get("nfc_tag_id") is not None:
        nfc_val = (msg["nfc_tag_id"] or "").strip() or None  # normalise ""/ whitespace → None
        task_data["nfc_tag_id"] = nfc_val
        if nfc_val:
            nfc_warn = _check_nfc_tag_duplicate(hass, nfc_val)
            if nfc_warn:
                tc_warnings.append(nfc_warn)
    if msg.get("checklist"):
        task_data["checklist"] = msg["checklist"]
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
        vol.Optional("interval_days"): vol.Any(vol.All(int, vol.Range(min=1, max=MAX_INTERVAL_DAYS)), None),
        vol.Optional("interval_unit"): vol.In(INTERVAL_UNITS),
        vol.Optional("due_date"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
        vol.Optional("interval_anchor"): vol.In(["completion", "planned"]),
        # Nested recurrence (calendar kinds); see create schema.
        vol.Optional("schedule"): vol.Any(dict, None),
        vol.Optional("warning_days"): vol.All(int, vol.Range(min=0, max=365)),
        vol.Optional("last_performed"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
        vol.Optional("trigger_config"): vol.Any(dict, None),
        vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        vol.Optional("documentation_url"): vol.Any(vol.All(str, vol.Length(max=MAX_URL_LENGTH)), None),
        vol.Optional("responsible_user_id"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        vol.Optional("entity_slug"): vol.Any(vol.All(str, vol.Length(max=MAX_ENTITY_SLUG_LENGTH)), None),
        vol.Optional("custom_icon"): vol.Any(vol.All(str, vol.Length(max=MAX_ICON_LENGTH)), None),
        vol.Optional("nfc_tag_id"): vol.Any(vol.All(str, vol.Length(max=256)), None),
        vol.Optional("checklist"): vol.Any(vol.All([vol.All(str, vol.Length(max=MAX_CHECKLIST_ITEM_LENGTH))], vol.Length(max=MAX_CHECKLIST_ITEMS)), None),
        vol.Optional("schedule_time"): vol.Any(
            vol.All(str, vol.Match(r"^([01]\d|2[0-3]):[0-5]\d$")),
            None,
        ),
        # v1.3.0: same loose schema as create. Sanitize layer enforces shape.
        vol.Optional("on_complete_action"): vol.Any(dict, None),
        vol.Optional("quick_complete_defaults"): vol.Any(dict, None),
    }
)
@websocket_api.require_admin
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

    # Update provided fields
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
        "last_performed": "last_performed",
        "trigger_config": "trigger_config",
        "notes": "notes",
        "documentation_url": "documentation_url",
        "responsible_user_id": "responsible_user_id",
        "entity_slug": "entity_slug",
        "custom_icon": "custom_icon",
        "nfc_tag_id": "nfc_tag_id",
        "checklist": "checklist",
        "schedule_time": "schedule_time",
        # v1.3.0
        "on_complete_action": "on_complete_action",
        "quick_complete_defaults": "quick_complete_defaults",
    }
    for msg_key, data_key in field_map.items():
        if msg_key in msg:
            task[data_key] = msg[msg_key]

    # Recurrence resolution: an explicit nested `schedule` wins (calendar kinds
    # and kind-switches); otherwise flat recurrence fields drive it — drop any
    # stale nested schedule so normalize_task_storage rebuilds from the flat view.
    if msg.get("schedule"):
        for key in FLAT_RECURRENCE_KEYS:
            task.pop(key, None)
        task["schedule"] = Schedule.from_dict(msg["schedule"]).to_dict()
    elif any(key in msg for key in FLAT_RECURRENCE_KEYS):
        task.pop("schedule", None)

    # Validate/cap newly-applied v1.3.0 fields. cap_task_fields runs the
    # full task sanitize (caches, lengths, action shape) so update-path
    # behaves identically to create-path.
    from ..helpers.sanitize import cap_action_field, cap_quick_complete_defaults_field
    cap_action_field(task)
    cap_quick_complete_defaults_field(task)

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
@websocket_api.require_admin
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

    task_id = msg["task_id"]
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    if task_id not in new_tasks:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    old_trigger_config = new_tasks[task_id].get("trigger_config")
    del new_tasks[task_id]
    new_data[CONF_TASKS] = new_tasks

    # Remove from task_ids
    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = [tid for tid in obj.get("task_ids", []) if tid != task_id]
    obj["task_ids"] = task_ids
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

    # Clean up any repair issues referencing this task
    if old_trigger_config:
        from ..entity.triggers import normalize_entity_ids

        for eid in normalize_entity_ids(old_trigger_config):
            ir.async_delete_issue(
                hass, DOMAIN,
                f"missing_trigger_{entry.entry_id}_{task_id}_{eid}",
            )

    # Reload to re-create remaining entities
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Task List
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/list",
        vol.Optional("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@callback
def ws_list_tasks(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List tasks, optionally filtered by entry_id (object)."""
    entries = _get_object_entries(hass)
    filter_entry_id = msg.get("entry_id")

    tasks: list[dict[str, Any]] = []
    for entry in entries:
        if filter_entry_id and entry.entry_id != filter_entry_id:
            continue
        entry_tasks = _get_merged_tasks(entry)
        obj_data = entry.data.get(CONF_OBJECT, {})
        rd = _get_runtime_data(hass, entry.entry_id)
        coordinator_data = (
            rd.coordinator.data if rd and rd.coordinator else None
        )
        ct_tasks = (coordinator_data or {}).get(CONF_TASKS, {})
        for task_id, task_data in entry_tasks.items():
            summary = _build_task_summary(
                hass, task_id, task_data, ct_tasks.get(task_id)
            )
            summary["task_id"] = task_id
            summary["entry_id"] = entry.entry_id
            summary["object_name"] = obj_data.get(CONF_OBJECT_NAME, "")
            tasks.append(summary)

    connection.send_result(msg["id"], {"tasks": tasks})


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
@websocket_api.require_admin
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
