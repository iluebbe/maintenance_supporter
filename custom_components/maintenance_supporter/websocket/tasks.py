"""WebSocket handlers for task CRUD, validation, and actions."""

from __future__ import annotations

import re
from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from . import _build_task_summary, _get_merged_tasks, _get_object_entries, _get_runtime_data


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
        from urllib.parse import urlparse  # noqa: PLC0415
        scheme = urlparse(url).scheme.lower()
        return scheme in _SAFE_URL_SCHEMES
    except Exception:
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/create",
        vol.Required("entry_id"): str,
        vol.Required("name"): str,
        vol.Optional("task_type", default="custom"): str,
        vol.Optional("schedule_type", default="time_based"): str,
        vol.Optional("interval_days"): vol.Any(vol.All(int, vol.Range(min=1)), None),
        vol.Optional("interval_anchor", default="completion"): vol.In(["completion", "planned"]),
        vol.Optional("warning_days", default=7): int,
        vol.Optional("last_performed"): vol.Any(str, None),
        vol.Optional("trigger_config"): vol.Any(dict, None),
        vol.Optional("notes"): vol.Any(str, None),
        vol.Optional("documentation_url"): vol.Any(str, None),
        vol.Optional("responsible_user_id"): vol.Any(str, None),
        vol.Optional("entity_slug"): vol.Any(str, None),
        vol.Optional("custom_icon"): vol.Any(str, None),
        vol.Optional("nfc_tag_id"): vol.Any(str, None),
        vol.Optional("checklist"): vol.Any([str], None),
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
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    task_id = uuid4().hex
    task_data: dict[str, Any] = {
        "id": task_id,
        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
        "name": msg["name"],
        "type": msg.get("task_type", "custom"),
        "enabled": True,
        "schedule_type": msg.get("schedule_type", "time_based"),
        "warning_days": msg.get("warning_days", 7),
    }

    # Dynamic state (last_performed, history) for Store initialization
    initial_last_performed: str | None = None
    initial_history: list[dict[str, Any]] = []

    if msg.get("interval_days") is not None:
        task_data["interval_days"] = msg["interval_days"]
    if msg.get("interval_anchor", "completion") != "completion":
        task_data["interval_anchor"] = msg["interval_anchor"]
    if msg.get("last_performed") is not None:
        initial_last_performed = msg["last_performed"]
        # Add initial history entry so times_performed reflects the value
        initial_history.append({
            "timestamp": msg["last_performed"] + "T00:00:00",
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
        task_data["nfc_tag_id"] = msg["nfc_tag_id"]
        if msg["nfc_tag_id"]:
            nfc_warn = _check_nfc_tag_duplicate(hass, msg["nfc_tag_id"])
            if nfc_warn:
                tc_warnings.append(nfc_warn)
    if msg.get("checklist"):
        task_data["checklist"] = msg["checklist"]

    # Dry-run mode: validate only, do not persist
    if msg.get("dry_run"):
        result: dict[str, Any] = {"valid": True, "task_id": None}
        if tc_warnings:
            result["warnings"] = tc_warnings
        connection.send_result(msg["id"], result)
        return

    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    new_tasks[task_id] = task_data
    new_data[CONF_TASKS] = new_tasks

    # Update task_ids on object
    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = list(obj.get("task_ids", []))
    task_ids.append(task_id)
    obj["task_ids"] = task_ids
    new_data[CONF_OBJECT] = obj

    hass.config_entries.async_update_entry(entry, data=new_data)

    # Initialize dynamic state in Store
    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        store.init_task(task_id, last_performed=initial_last_performed)
        if initial_history:
            store.set_history(task_id, initial_history)
        await store.async_save()
    else:
        # Legacy: put dynamic fields in ConfigEntry.data
        task_data["last_performed"] = initial_last_performed
        task_data["history"] = initial_history
        new_tasks[task_id] = task_data
        new_data[CONF_TASKS] = new_tasks
        hass.config_entries.async_update_entry(entry, data=new_data)

    # Reload entry to pick up new task entities
    await hass.config_entries.async_reload(entry.entry_id)

    result = {"task_id": task_id}
    if tc_warnings:
        result["warnings"] = tc_warnings
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/update",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("name"): str,
        vol.Optional("task_type"): str,
        vol.Optional("enabled"): bool,
        vol.Optional("schedule_type"): str,
        vol.Optional("interval_days"): vol.Any(vol.All(int, vol.Range(min=1)), None),
        vol.Optional("interval_anchor"): vol.In(["completion", "planned"]),
        vol.Optional("warning_days"): int,
        vol.Optional("trigger_config"): vol.Any(dict, None),
        vol.Optional("notes"): vol.Any(str, None),
        vol.Optional("documentation_url"): vol.Any(str, None),
        vol.Optional("responsible_user_id"): vol.Any(str, None),
        vol.Optional("entity_slug"): vol.Any(str, None),
        vol.Optional("custom_icon"): vol.Any(str, None),
        vol.Optional("nfc_tag_id"): vol.Any(str, None),
        vol.Optional("checklist"): vol.Any([str], None),
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
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    task_id = msg["task_id"]
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    task = dict(tasks_data[task_id])

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

    # Check NFC tag uniqueness if provided
    if "nfc_tag_id" in msg and msg["nfc_tag_id"]:
        nfc_warn = _check_nfc_tag_duplicate(hass, msg["nfc_tag_id"], exclude_task_id=task_id)
        if nfc_warn:
            tc_warnings.append(nfc_warn)

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
        "interval_anchor": "interval_anchor",
        "warning_days": "warning_days",
        "trigger_config": "trigger_config",
        "notes": "notes",
        "documentation_url": "documentation_url",
        "responsible_user_id": "responsible_user_id",
        "entity_slug": "entity_slug",
        "custom_icon": "custom_icon",
        "nfc_tag_id": "nfc_tag_id",
        "checklist": "checklist",
    }
    for msg_key, data_key in field_map.items():
        if msg_key in msg:
            task[data_key] = msg[msg_key]

    # Clear stale trigger runtime in Store when trigger config changes
    if "trigger_config" in msg:
        rd = _get_runtime_data(hass, msg["entry_id"])
        if rd and rd.store:
            rd.store.clear_trigger_runtime(task_id)
            rd.store.async_delay_save()

    tasks_data[task_id] = task
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
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
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
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    task_id = msg["task_id"]
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    if task_id not in new_tasks:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

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

    # Remove orphaned entity registry entries for the deleted task
    ent_reg = er.async_get(hass)
    for ent_entry in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        if ent_entry.unique_id and task_id in ent_entry.unique_id:
            ent_reg.async_remove(ent_entry.entity_id)

    # Reload to re-create remaining entities
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Task List
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/list",
        vol.Optional("entry_id"): str,
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
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("notes"): vol.Any(str, None),
        vol.Optional("cost"): vol.Any(vol.Coerce(float), None),
        vol.Optional("duration"): vol.Any(vol.Coerce(int), None),
        vol.Optional("checklist_state"): vol.Any(dict, None),
        vol.Optional("feedback"): vol.Any(str, None),
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/skip",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("reason"): vol.Any(str, None),
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
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("date"): vol.Any(str, None),
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
