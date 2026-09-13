"""The per-task notification gates, in one place.

Whether ONE task may be the subject of a notification of a given kind: the
global switch, the per-task mute (``notify_enabled`` — #173), the per-status
reminder toggles, the saved-view scope (v2.26), vacation mode (v1.2.0) and
an active snooze. Which of those apply to a kind is read from the kind's
``KindSpec.gates`` (``notify_hooks.NOTIFICATION_KINDS``), so every kind
honours exactly what the notification matrix declares — the coordinator's
pre-filter, the manager's per-task send paths, the lead-reminder tick and the
bundle all call :func:`task_may_notify` instead of each carrying its own
subset (DRY review 2026-09-12: ``notify_enabled`` was checked in three
files, the scope twice, and the bundle enforced none of its declared gates
itself but relied on the coordinator having pre-filtered its members).

Send-time gates that are not about one task — the notify target, quiet
hours, the daily cap and the repeat interval — stay in the manager.
"""

from __future__ import annotations

import logging
from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import (
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_SCOPE_VIEW_ID,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
)
from .global_options import get_global_options, global_option
from .notify_hooks import KIND_STATUS, NOTIFICATION_KINDS
from .settings_registry import setting_default

_LOGGER = logging.getLogger(__name__)

# The per-status reminder toggle behind each notifiable status.
STATUS_ENABLED_KEYS: dict[str, str] = {
    MaintenanceStatus.DUE_SOON: CONF_NOTIFY_DUE_SOON_ENABLED,
    MaintenanceStatus.OVERDUE: CONF_NOTIFY_OVERDUE_ENABLED,
    MaintenanceStatus.TRIGGERED: CONF_NOTIFY_TRIGGERED_ENABLED,
}


@dataclass(frozen=True)
class GateResult:
    """Outcome of :func:`task_may_notify` — truthy when the task may notify,
    otherwise ``blocked_by`` names the gate (for a debug line)."""

    allowed: bool
    blocked_by: str | None = None

    def __bool__(self) -> bool:
        return self.allowed


ALLOWED = GateResult(True)


def status_reminder_enabled(options: Mapping[str, Any], status: str) -> bool:
    """Is the reminder for ``status`` switched on? Unknown statuses are never
    notifiable."""
    key = STATUS_ENABLED_KEYS.get(status)
    if key is None:
        return False
    return bool(options.get(key, setting_default(key)))


def scope_view_matches(hass: HomeAssistant, task_data: Mapping[str, Any]) -> bool:
    """v2.26 notification routing: with a saved-view scope ("only notify
    about view X") a task must match the view's task-selecting filters. A
    stale view id (view deleted) means no scope — never "silence everything"."""
    scope_view_id = global_option(hass, CONF_NOTIFY_SCOPE_VIEW_ID) or ""
    if not scope_view_id:
        return True
    from .saved_views import list_saved_views, view_matches_task

    scope = next((v for v in list_saved_views(hass) if v["id"] == scope_view_id), None)
    return scope is None or view_matches_task(scope["filters"], task_data)


def task_may_notify(
    hass: HomeAssistant,
    entry_id: str,
    task_id: str,
    status: str,
    task_data: Mapping[str, Any],
    *,
    kind: str,
    manager: Any | None = None,
) -> GateResult:
    """May ``task_id`` be the subject of a ``kind`` notification right now?

    ``task_data`` is the task's config dict (it carries ``notify_enabled``,
    labels, responsible user, priority); the coordinator merges its computed
    payload over it. ``status`` is the notifiable status the reminder is
    about — for kinds that are not status-bound (lead-time reminders, the
    completion activity) pass the status whose snooze key applies
    (``due_soon``) or any notifiable status. ``manager`` is the
    NotificationManager (holds the snooze state); resolved from
    ``hass.data`` when not given, and without one the snooze and global
    gates pass (nothing to consult).

    Gates, in evaluation order, each only when the kind declares it:
    ``enabled`` (the global switch), ``task_mute`` (per-task
    ``notify_enabled is False``), ``kind_enabled`` (the per-status reminder
    toggle — for the status kind; the completion kind's mode needs the
    completion source and stays in the manager), ``scope`` (saved-view),
    ``vacation`` (silenced unless exempt) and ``snooze``.
    """
    gates = NOTIFICATION_KINDS[kind].gates
    nm = manager if manager is not None else hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if "enabled" in gates and nm is not None and not nm.enabled:
        return GateResult(False, "enabled")
    if "task_mute" in gates and task_data.get("notify_enabled") is False:
        return GateResult(False, "task_mute")
    if "kind_enabled" in gates and kind == KIND_STATUS and not status_reminder_enabled(get_global_options(hass), status):
        return GateResult(False, "kind_enabled")
    if "scope" in gates and not scope_view_matches(hass, task_data):
        return GateResult(False, "scope")
    if "vacation" in gates:
        from .vacation import get_vacation_state

        if get_vacation_state(hass).is_silent_for(task_id):
            return GateResult(False, "vacation")
    if "snooze" in gates and nm is not None and nm.is_snoozed(entry_id, task_id, status):
        return GateResult(False, "snooze")
    return ALLOWED
