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

Because resume and unarchive make the same "fresh cycle" promise, the
per-task re-anchor itself lives here too (``reanchor_recurring_task``) and is
imported by the object- and task-unarchive handlers — it used to be three
hand-copied blocks that had each forgotten ``due_override``.
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


def clear_cycle_modifiers(task_state: dict[str, Any]) -> None:
    """Drop the previous cycle's per-occurrence modifiers from a task dict.

    ``last_planned_due`` is the drift-free anchor the next occurrence is
    computed from; ``due_override`` is a one-shot postpone that
    ``Schedule.next_due`` gives precedence over the cadence whenever it is
    later than ``last_performed``. Both describe the cycle being abandoned, so
    both must go when a task is re-anchored.
    """
    task_state.pop("last_planned_due", None)
    task_state.pop("due_override", None)


def reanchor_recurring_task(
    task_id: str,
    *,
    store: MaintenanceStore | None,
    today_iso: str,
    task_data: dict[str, Any] | None = None,
) -> None:
    """Re-anchor ONE recurring task to a fresh cycle starting today.

    The single implementation of the "fresh cycle" promise behind object
    unarchive, task unarchive and pause/resume. All three previously inlined
    ``last_performed`` + ``last_planned_due`` and all three forgot
    ``due_override`` — so a recurring task postponed to a FUTURE date and then
    archived/paused came back on that stale postponed date instead of
    today + interval, which is precisely what a fresh cycle promises not to do.

    Dynamic state lives in the Store when the entry has one; *task_data* is the
    static ConfigEntry dict. Pass both where available: the modifiers are
    cleared from BOTH because ``MaintenanceStore.merge_task_data`` lets a
    static value win when the Store has none, and an IMPORT (websocket/io.py)
    can still write ``due_override`` into static entry data after migration has
    already run. ``last_performed`` is only written to *task_data* in the
    legacy (no-Store) shape.

    Callers own the "is this task recurring?" test and the Store save.
    """
    if task_data is not None:
        clear_cycle_modifiers(task_data)
        if store is None:
            task_data["last_performed"] = today_iso
    if store is not None:
        store.set_last_performed(task_id, today_iso)
        clear_cycle_modifiers(store._ensure_task(task_id))


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
            reanchor_recurring_task(tid, store=store, today_iso=today_iso, task_data=td)
        new_tasks[tid] = td
    new_data[CONF_TASKS] = new_tasks
    return new_data
