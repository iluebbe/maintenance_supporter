"""The task-status ladder — ONE implementation for the model and the twin.

:pyattr:`MaintenanceTask.status` (the coordinator's per-refresh computation)
and :func:`compute_live_status` (the per-task ``sensor`` /
``binary_sensor`` recomputation right after a live trigger update, from the
coordinator's published :class:`TaskResult`) used to be two hand-kept
ladders; the twin silently lacked the span-capped warning window (issue #58)
and the sub-day ``schedule_time`` refinement, and neither knew that a
disabled task reads OK (only the coordinator's short-circuit did). Both now
delegate to :func:`compute_status`; the coordinator publishes the inputs the
twin cannot derive itself (``warning_days_effective``) alongside
``days_until_due`` / ``trigger_active`` / ``paused``.
``tests/test_status_twin.py`` pins the two callers to each other.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.util import dt as dt_util

from ..const import DEFAULT_WARNING_DAYS, MaintenanceStatus
from .dates import parse_hhmm

if TYPE_CHECKING:
    from ..models.task_result import TaskResult


def effective_warning_days(warning_days: int, span_days: int | None) -> int:
    """The warning window, capped below one interval measured in real days
    (issue #58: a 6-*month* task must not collapse a 14-day warning to
    ``min(14, 6)``). The cap is ``span - 1``: a weekly task with the default
    7-day warning was "due soon" from the day it was completed — for its
    whole cycle, with a due-soon push right after the completion (bug audit
    2026-09-26). ``span_days`` ``None``/0 = no cap (manual, one-off)."""
    return min(warning_days, max(span_days - 1, 0)) if span_days else warning_days


def is_past_schedule_time(schedule_time: str | None) -> bool:
    """True iff a ``schedule_time`` is set AND the current local time is past it.

    The sub-day refinement of the OVERDUE transition: when ``days_until_due``
    is exactly 0 the task counts as overdue once the configured HH:MM has
    passed (in HA's configured TZ). ``None``/blank keeps the historical
    "due at midnight" semantic; "HH:MM" (panel/WS) and "HH:MM:SS" (HA
    TimeSelector) parse alike.
    """
    if not schedule_time:
        return False
    target = parse_hhmm(schedule_time)
    if target is None:
        return False
    return dt_util.now().time() >= target


def compute_status(
    *,
    archived: bool,
    paused: bool = False,
    enabled: bool = True,
    days_until_due: int | None,
    trigger_active: bool,
    all_mode: bool,
    warning_days: int,
    past_schedule_time: bool,
) -> MaintenanceStatus:
    """The status ladder, precedence top to bottom.

    * disabled → OK (a switched-off task is inert: no due, nothing to notify —
      the coordinator's short-circuit rule, folded in here);
    * archived → ARCHIVED (v2.10.0: retired but retained);
    * paused → PAUSED (v2.20, N3: the object's schedules are frozen);
    * trigger ∧/∨ safety interval: with the ``"all"`` combinator BOTH legs
      must be met — the trigger fired AND the due date reached (the interval
      is a minimum age, not a deadline); default ``"any"`` is whichever-first;
    * no schedule (``days_until_due`` None) → OK unless triggered;
    * past due, or due today past ``schedule_time`` → OVERDUE;
    * within the (span-capped) warning window → DUE_SOON; else OK.
    """
    if not enabled:
        return MaintenanceStatus.OK
    if archived:
        return MaintenanceStatus.ARCHIVED
    if paused:
        return MaintenanceStatus.PAUSED

    days = days_until_due
    time_met = days is None or days <= 0
    if trigger_active and (not all_mode or time_met):
        return MaintenanceStatus.TRIGGERED
    if days is None:
        return MaintenanceStatus.OK
    if all_mode and not trigger_active:
        # The elapsed interval alone never actions an "all" task.
        return MaintenanceStatus.OK
    if days < 0 or (days == 0 and past_schedule_time):
        return MaintenanceStatus.OVERDUE
    if days <= warning_days:
        return MaintenanceStatus.DUE_SOON
    return MaintenanceStatus.OK


def compute_live_status(result: TaskResult) -> str:
    """Compute a task's status from its published result.

    ``trigger_active``, ``days_until_due``, ``paused`` and
    ``warning_days_effective`` are the coordinator-computed live fields (the
    last falls back to the raw ``warning_days`` on the inert and degraded
    results, which carry none); ``schedule_time`` is only present when the
    feature is enabled (the coordinator strips it otherwise), so the sub-day
    check is safe here.
    """
    task = result.task
    warning_days = result.warning_days_effective
    return compute_status(
        archived=task.get("archived_at") is not None,
        paused=result.paused,
        enabled=task.get("enabled", True) is not False,
        days_until_due=result.days_until_due,
        trigger_active=result.trigger_active,
        all_mode=(task.get("trigger_config") or {}).get("trigger_combinator") == "all",
        warning_days=warning_days if warning_days is not None else task.get("warning_days", DEFAULT_WARNING_DAYS),
        past_schedule_time=is_past_schedule_time(task.get("schedule_time")),
    )
