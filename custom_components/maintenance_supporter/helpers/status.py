"""Shared task-status derivation from a coordinator data dict.

The per-task ``sensor`` and ``binary_sensor`` entities both need to recompute a
task's status from the coordinator's plain data dict (e.g. right after a live
trigger update) without rebuilding a full :class:`MaintenanceTask`. They used to
carry byte-identical ``_compute_live_status`` copies; this is the single source.

This is the *dict* status ladder — a lightweight mirror of
:pyattr:`MaintenanceTask.status`. It intentionally omits the model's sub-day
``schedule_time`` refinement and the span-capped warning window (issue #58),
which require the live ``Schedule`` object; those are applied by the next
coordinator refresh. Keep the trigger / overdue / due-soon precedence here in
sync with the model property.
"""

from __future__ import annotations

from typing import Any

from ..const import DEFAULT_WARNING_DAYS, MaintenanceStatus


def compute_status_from_task_dict(task: dict[str, Any]) -> str:
    """Compute task status from a coordinator data dict.

    Mirrors :pyattr:`MaintenanceTask.status` for the archived / trigger /
    overdue / due-soon / ok ladder. ``_trigger_active`` and ``_days_until_due``
    are the coordinator-computed live fields.
    """
    # Archived takes precedence over everything (v2.10.0) — see the model twin.
    if task.get("archived_at") is not None:
        return MaintenanceStatus.ARCHIVED
    # Seasonal pause (v2.20, N3): object-wide, injected by the coordinator.
    # Keeps a live trigger event from flipping a frozen task to TRIGGERED
    # between refreshes.
    if task.get("_paused"):
        return MaintenanceStatus.PAUSED
    days = task.get("_days_until_due")

    # "all" combinator: trigger AND elapsed safety interval must both be met
    # before the task actions (model twin: MaintenanceTask.status).
    all_mode = (task.get("trigger_config") or {}).get("trigger_combinator") == "all"
    time_met = days is None or days <= 0
    trigger_active = task.get("_trigger_active", False)

    if trigger_active and (not all_mode or time_met):
        return MaintenanceStatus.TRIGGERED

    if days is None:
        return MaintenanceStatus.OK

    if all_mode and not trigger_active:
        return MaintenanceStatus.OK

    warning_days = task.get("warning_days", DEFAULT_WARNING_DAYS)
    if days < 0:
        return MaintenanceStatus.OVERDUE
    if days <= warning_days:
        return MaintenanceStatus.DUE_SOON
    return MaintenanceStatus.OK
