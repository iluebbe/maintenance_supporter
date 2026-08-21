"""Saved filter views — named, shared combinations of the panel list's filters.

A "view" bundles the panel task-list's filter state (status / responsible user /
archived toggle) plus its sort + group-by mode under a user-given name, so a
household or team can reapply "Kitchen overdue" or "Unassigned this week" from
the toolbar in one tap instead of re-picking every control.

Views are **shared/global**: one list stored on the global config entry, listed
by any authenticated user (read) and created/deleted with write permission. A
view's ``id`` is a stable handle a later feature can reference (e.g. notification
routing — "only notify me about view X").

This module is the pure shape + sanitiser; the WS layer (``websocket/saved_views``)
reads/writes the global entry's options. Everything stored is re-sanitised on the
way in, so a hand-edited or legacy entry can never inject unknown keys/values.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant

from ..const import CONF_SAVED_FILTER_VIEWS, DEFAULT_TASK_PRIORITY, MAX_SAVED_VIEWS, MAX_VIEW_NAME_LENGTH, TaskPriority
from .global_options import get_global_options

# Closed value sets mirrored from the panel's filter controls. Anything outside
# these coerces to the permissive default ("" / "due_date" / "none"), so an
# unknown value degrades to "show all / natural order" rather than being stored.
VALID_STATUSES = frozenset({"", "ok", "due_soon", "overdue", "triggered", "paused", "archived"})
VALID_SORT_MODES = frozenset({"due_date", "object", "type", "task_name", "area", "assigned_user", "group"})
VALID_GROUP_BY = frozenset({"none", "area", "group", "user"})
# Priority filter (#134): "" = no filter, else one of the TaskPriority values.
VALID_PRIORITIES = frozenset({"", *(p.value for p in TaskPriority)})


def _clean_filters(raw: Any) -> dict[str, Any]:
    """Sanitise a view's ``filters`` sub-dict against the closed value sets."""
    src: Mapping[str, Any] = raw if isinstance(raw, Mapping) else {}

    status = src.get("status", "")
    status = status if isinstance(status, str) and status in VALID_STATUSES else ""

    sort_mode = src.get("sort_mode", "due_date")
    sort_mode = sort_mode if isinstance(sort_mode, str) and sort_mode in VALID_SORT_MODES else "due_date"

    group_by = src.get("group_by", "none")
    group_by = group_by if isinstance(group_by, str) and group_by in VALID_GROUP_BY else "none"

    user_id = src.get("user_id")
    user_id = user_id.strip() if isinstance(user_id, str) and user_id.strip() else None
    if isinstance(user_id, str) and len(user_id) > 64:
        user_id = None

    # v2.26: a label filter ("only tasks tagged 'garden'") — free text like the
    # labels themselves (capped to their length), None = no label filter.
    from ..const import MAX_LABEL_LENGTH

    label = src.get("label")
    label = label.strip() if isinstance(label, str) and label.strip() else None
    if isinstance(label, str) and len(label) > MAX_LABEL_LENGTH:
        label = None

    # #134: a priority filter ("only high-priority tasks") — closed set, "" =
    # no filter. Together with the notification view-scope this gives
    # priority-routed notifications without a dedicated setting.
    priority = src.get("priority", "")
    priority = priority if isinstance(priority, str) and priority in VALID_PRIORITIES else ""

    return {
        "status": status,
        "user_id": user_id,
        "label": label,
        "priority": priority,
        "archived": bool(src.get("archived")),
        "sort_mode": sort_mode,
        "group_by": group_by,
    }


def view_matches_task(filters: Mapping[str, Any], task: Mapping[str, Any]) -> bool:
    """Does a task match a view's TASK-SELECTING filters (label/user/priority)?

    Used by notification routing ("only notify about view X"). Deliberately
    ignores the DISPLAY dimensions: ``status`` (the per-status notify toggles
    own that), ``archived`` (archived tasks never notify anyway) and
    sort/group. A ``user_id`` of ``current_user`` is a client-side sentinel
    that cannot be resolved server-side — treated as "no user filter".
    """
    label = filters.get("label")
    if label and label not in (task.get("labels") or []):
        return False
    user_id = filters.get("user_id")
    if user_id and user_id != "current_user" and task.get("responsible_user_id") != user_id:
        return False
    # Tasks without an explicit priority are "normal" everywhere (the model
    # default) — the filter must see them the same way.
    priority = filters.get("priority")
    if priority and (task.get("priority") or DEFAULT_TASK_PRIORITY) != priority:
        return False
    return True


def sanitize_view(raw: Any, *, view_id: str | None = None) -> dict[str, Any] | None:
    """Return a clean view dict, or ``None`` if it has no usable name.

    ``view_id`` overrides the incoming id (used on save to preserve an existing
    id or mint a fresh one); otherwise the raw id is kept when valid.
    """
    if not isinstance(raw, Mapping):
        return None
    name = raw.get("name")
    if not isinstance(name, str) or not name.strip():
        return None
    resolved_id = view_id
    if resolved_id is None:
        rid = raw.get("id")
        resolved_id = rid if isinstance(rid, str) and rid.strip() else uuid4().hex
    return {
        "id": resolved_id,
        "name": name.strip()[:MAX_VIEW_NAME_LENGTH],
        "filters": _clean_filters(raw.get("filters")),
    }


def list_saved_views(hass: HomeAssistant) -> list[dict[str, Any]]:
    """The sanitised saved views stored on the global entry (empty if none)."""
    raw = get_global_options(hass).get(CONF_SAVED_FILTER_VIEWS)
    if not isinstance(raw, list):
        return []
    # Do NOT truncate here: save/delete re-persist this list, so truncating a
    # (hand-edited) >MAX list on read would permanently drop the tail on the
    # next write. Growth past the cap is prevented on the way IN by upsert_view.
    out: list[dict[str, Any]] = []
    for item in raw:
        clean = sanitize_view(item)
        if clean is not None:
            out.append(clean)
    return out


def upsert_view(views: list[dict[str, Any]], incoming: dict[str, Any]) -> tuple[list[dict[str, Any]], str]:
    """Insert or replace ``incoming`` (matched by id) in ``views``.

    Returns the new list and the saved view's id. A new view is rejected past
    ``MAX_SAVED_VIEWS`` by raising ``ValueError('too_many_views')``; updating an
    existing one is always allowed.
    """
    result = [dict(v) for v in views]
    for i, v in enumerate(result):
        if v.get("id") == incoming["id"]:
            result[i] = incoming
            return result, incoming["id"]
    if len(result) >= MAX_SAVED_VIEWS:
        raise ValueError("too_many_views")
    result.append(incoming)
    return result, incoming["id"]


def remove_view(views: list[dict[str, Any]], view_id: str) -> list[dict[str, Any]]:
    """Return ``views`` without the entry whose id is ``view_id``."""
    return [dict(v) for v in views if v.get("id") != view_id]
