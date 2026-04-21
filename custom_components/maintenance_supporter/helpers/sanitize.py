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
}

_OBJECT_STR_LIMITS: dict[str, int] = {
    "name": MAX_NAME_LENGTH,
    "manufacturer": MAX_META_LENGTH,
    "model": MAX_META_LENGTH,
    "serial_number": MAX_META_LENGTH,
    "area_id": MAX_META_LENGTH,
    "installation_date": MAX_DATE_LENGTH,
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

    return task_data


def cap_object_fields(obj_data: dict[str, Any]) -> dict[str, Any]:
    """Truncate user-controllable strings on an object dict in-place."""
    _cap_strings(obj_data, _OBJECT_STR_LIMITS)
    return obj_data


def cap_group_fields(group_data: dict[str, Any]) -> dict[str, Any]:
    """Truncate user-controllable strings on a group dict in-place."""
    _cap_strings(group_data, _GROUP_STR_LIMITS)
    return group_data
