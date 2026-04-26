"""Defensive sanitization for config-flow input.

The WebSocket schemas enforce length and range caps on every str/int field at
the boundary. Config-flow forms accept arbitrary lengths because HA's selectors
don't enforce them. To keep both paths at parity (and prevent a malicious or
buggy programmatic config-flow caller from bloating ConfigEntry.data), every
config-flow save handler runs the relevant cap helper below right before
persisting.
"""

from __future__ import annotations

from typing import Any

from ..const import (
    MAX_DATE_LENGTH,
    MAX_ENTITY_SLUG_LENGTH,
    MAX_ICON_LENGTH,
    MAX_INTERVAL_DAYS,
    MAX_META_LENGTH,
    MAX_NAME_LENGTH,
    MAX_SCHEDULE_TIME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_TYPE_LENGTH,
    MAX_URL_LENGTH,
)

# Per-field cap for task dicts. Values mirror the voluptuous schemas in
# websocket/tasks.py so an admin who reaches the same field through the UI
# can't smuggle past a longer string than they could over the WS API.
_TASK_STR_LIMITS: dict[str, int] = {
    "name": MAX_NAME_LENGTH,
    "type": MAX_TYPE_LENGTH,
    "schedule_type": MAX_TYPE_LENGTH,
    "interval_anchor": MAX_TYPE_LENGTH,
    "last_performed": MAX_DATE_LENGTH,
    "notes": MAX_TEXT_LENGTH,
    "documentation_url": MAX_URL_LENGTH,
    "custom_icon": MAX_ICON_LENGTH,
    "nfc_tag_id": 256,
    "responsible_user_id": MAX_META_LENGTH,
    "entity_slug": MAX_ENTITY_SLUG_LENGTH,
    "created_at": MAX_DATE_LENGTH,
    "schedule_time": MAX_SCHEDULE_TIME_LENGTH,
}

_OBJECT_STR_LIMITS: dict[str, int] = {
    "name": MAX_NAME_LENGTH,
    "manufacturer": MAX_META_LENGTH,
    "model": MAX_META_LENGTH,
    "serial_number": MAX_META_LENGTH,
    "area_id": MAX_META_LENGTH,
    "installation_date": MAX_DATE_LENGTH,
    "documentation_url": MAX_URL_LENGTH,  # v1.4.0 #43
}

_GROUP_STR_LIMITS: dict[str, int] = {
    "name": MAX_NAME_LENGTH,
    "description": MAX_TEXT_LENGTH,
}


def _cap_strings(d: dict[str, Any], limits: dict[str, int]) -> None:
    """Truncate string fields in-place to their per-field max length."""
    for field, max_len in limits.items():
        v = d.get(field)
        if isinstance(v, str) and len(v) > max_len:
            d[field] = v[:max_len]


def cap_task_fields(task_data: dict[str, Any]) -> dict[str, Any]:
    """Truncate user-controllable strings + numerics on a task dict in-place.

    Returns the same dict for fluent use. Mirrors the WS schema caps:
    - String fields → individual length caps from `_TASK_STR_LIMITS`
    - `interval_days` → 1..MAX_INTERVAL_DAYS (negative/zero coerced to 1)
    - `warning_days` → 0..365
    - `checklist` → list of strings, each ≤ 500 chars, list ≤ 100 items
    """
    _cap_strings(task_data, _TASK_STR_LIMITS)

    iv = task_data.get("interval_days")
    if isinstance(iv, int):
        if iv < 1:
            task_data["interval_days"] = 1
        elif iv > MAX_INTERVAL_DAYS:
            task_data["interval_days"] = MAX_INTERVAL_DAYS

    wd = task_data.get("warning_days")
    if isinstance(wd, int):
        if wd < 0:
            task_data["warning_days"] = 0
        elif wd > 365:
            task_data["warning_days"] = 365

    cl = task_data.get("checklist")
    if cl is not None:
        if not isinstance(cl, list):
            task_data.pop("checklist", None)
        else:
            from ..const import MAX_CHECKLIST_ITEM_LENGTH, MAX_CHECKLIST_ITEMS
            cleaned = [
                item.strip()[:MAX_CHECKLIST_ITEM_LENGTH]
                for item in cl
                if isinstance(item, str)
            ]
            cleaned = [c for c in cleaned if c]
            task_data["checklist"] = cleaned[:MAX_CHECKLIST_ITEMS]

    # v1.3.0: per-task on_complete_action — embedded HA service-call config.
    # Strict shape: {service: "domain.name", target?: dict, data?: dict}.
    # Drops the field entirely on any structural problem; the action layer
    # treats absence as "no action configured" (not an error).
    cap_action_field(task_data)

    # v1.3.0: per-task quick_complete_defaults — pre-fill values used when
    # the user scans the "quick complete" QR code. Schema mirrors the
    # complete_maintenance kwargs.
    cap_quick_complete_defaults_field(task_data)

    return task_data


# ─── v1.3.0: completion-action helpers ──────────────────────────────────

# Hard caps. service names rarely exceed 64 chars; data dicts intended
# for built-in HA services rarely exceed 1 KB serialised.
_MAX_SERVICE_NAME_LENGTH = 100
_MAX_ACTION_DATA_BYTES = 1024
_MAX_TARGET_FIELD_LENGTH = 200


def cap_action_field(task_data: dict[str, Any]) -> None:
    """Validate + truncate task_data['on_complete_action'] in-place.

    Drops the entire field on any structural problem. Passes silently when
    not present (it's optional).
    """
    import re

    action = task_data.get("on_complete_action")
    if action is None:
        return
    if not isinstance(action, dict):
        task_data.pop("on_complete_action", None)
        return

    service = action.get("service")
    if (
        not isinstance(service, str)
        or len(service) > _MAX_SERVICE_NAME_LENGTH
        or not re.fullmatch(r"[a-z][a-z0-9_]*\.[a-z0-9_]+", service)
    ):
        task_data.pop("on_complete_action", None)
        return

    cleaned: dict[str, Any] = {"service": service}

    target = action.get("target")
    if isinstance(target, dict):
        cleaned_target: dict[str, Any] = {}
        for key in ("entity_id", "device_id", "area_id", "label_id", "floor_id"):
            v = target.get(key)
            if isinstance(v, str) and 0 < len(v) <= _MAX_TARGET_FIELD_LENGTH:
                cleaned_target[key] = v
            elif isinstance(v, list):
                cleaned_list = [
                    s for s in v
                    if isinstance(s, str) and 0 < len(s) <= _MAX_TARGET_FIELD_LENGTH
                ]
                if cleaned_list:
                    cleaned_target[key] = cleaned_list[:50]  # cap target list length
        if cleaned_target:
            cleaned["target"] = cleaned_target

    data = action.get("data")
    if isinstance(data, dict):
        # Cheap size guard via JSON serialisation
        import json
        try:
            serialised = json.dumps(data)
        except (TypeError, ValueError):
            serialised = None
        if serialised is not None and len(serialised) <= _MAX_ACTION_DATA_BYTES:
            cleaned["data"] = data

    task_data["on_complete_action"] = cleaned


def cap_quick_complete_defaults_field(task_data: dict[str, Any]) -> None:
    """Validate + truncate task_data['quick_complete_defaults'] in-place.

    Drops malformed entries silently (per-field), preserves the rest.
    """
    defaults = task_data.get("quick_complete_defaults")
    if defaults is None:
        return
    if not isinstance(defaults, dict):
        task_data.pop("quick_complete_defaults", None)
        return

    cleaned: dict[str, Any] = {}

    notes = defaults.get("notes")
    if isinstance(notes, str) and notes:
        cleaned["notes"] = notes[:MAX_TEXT_LENGTH]

    cost = defaults.get("cost")
    if isinstance(cost, (int, float)) and 0 <= cost <= 1_000_000:
        cleaned["cost"] = float(cost)

    duration = defaults.get("duration")
    if isinstance(duration, int) and 0 <= duration <= 525_600:
        cleaned["duration"] = duration

    feedback = defaults.get("feedback")
    if feedback in ("needed", "not_needed"):
        cleaned["feedback"] = feedback

    if cleaned:
        task_data["quick_complete_defaults"] = cleaned
    else:
        task_data.pop("quick_complete_defaults", None)


def cap_object_fields(obj_data: dict[str, Any]) -> dict[str, Any]:
    """Truncate user-controllable strings on an object dict in-place."""
    _cap_strings(obj_data, _OBJECT_STR_LIMITS)
    return obj_data


def cap_group_fields(group_data: dict[str, Any]) -> dict[str, Any]:
    """Truncate user-controllable strings on a group dict in-place."""
    _cap_strings(group_data, _GROUP_STR_LIMITS)
    return group_data
