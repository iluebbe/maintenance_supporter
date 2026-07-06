"""Object pause / seasonal mode (journey N3).

Seasonal equipment (pool, lawn mower, AC) is out of service for months at a
time. Vacation mode is global and archive retires the object entirely —
neither fits "paused until spring". A paused object keeps its tasks visible
(status ``paused``) but freezes schedules and fires nothing; resuming
re-anchors recurring tasks to a fresh cycle, exactly like an object
unarchive.

State lives on the object dict: ``paused_at`` (ISO timestamp marker; set =
paused) and ``paused_until`` (optional ISO date; the coordinator auto-resumes
on the first refresh on/after that day). The resume core is shared between
the ``object/resume`` WS command and the coordinator's auto-resume so the two
paths cannot drift.
"""

from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING, Any

from ..const import CONF_OBJECT, CONF_TASKS

if TYPE_CHECKING:
    from ..storage import MaintenanceStore


def is_object_paused(obj: dict[str, Any]) -> bool:
    """True when the object dict carries the pause marker."""
    return obj.get("paused_at") is not None


def pause_due_for_auto_resume(obj: dict[str, Any], today: date) -> bool:
    """True when a paused object's ``paused_until`` day has been reached."""
    until = obj.get("paused_until")
    if not is_object_paused(obj) or not until:
        return False
    try:
        return today >= date.fromisoformat(str(until))
    except (ValueError, TypeError):
        # An unparseable date must not pause the object forever — resume.
        return True


def build_resumed_entry_data(
    entry_data: dict[str, Any],
    store: MaintenanceStore | None,
    today_iso: str,
) -> dict[str, Any]:
    """Return new entry data with the pause cleared and schedules re-anchored.

    Mirrors the unarchive semantics: every ACTIVE recurring task gets a fresh
    cycle from today (the pool pump doesn't come back 5 months overdue) —
    one-time and manual tasks keep their dates. Mutates the Store's dynamic
    state when one is provided (the caller saves); falls back to the static
    dict otherwise (legacy shape). Archived tasks are untouched.
    """
    from .schedule import is_recurring

    new_data = dict(entry_data)
    obj = dict(new_data.get(CONF_OBJECT, {}))
    obj.pop("paused_at", None)
    obj.pop("paused_until", None)
    new_data[CONF_OBJECT] = obj

    new_tasks: dict[str, Any] = {}
    for tid, td in dict(new_data.get(CONF_TASKS, {})).items():
        td = dict(td)
        if td.get("archived_at") is None and is_recurring(td):
            if store is not None:
                store.set_last_performed(tid, today_iso)
                state = store._ensure_task(tid)
                state.pop("last_planned_due", None)
            else:
                td["last_performed"] = today_iso
                td.pop("last_planned_due", None)
        new_tasks[tid] = td
    new_data[CONF_TASKS] = new_tasks
    return new_data
