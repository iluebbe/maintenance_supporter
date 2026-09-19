"""Notification icons (#185): a sensible default per maintenance type, a
per-kind default for task-less notifications, and a per-task override.

The Home Assistant Companion app on Android renders ``data.notification_icon``
(an ``mdi:`` name) on the push notification; iOS ignores the key. Every
notification the integration sends carries one — resolved here, injected by
:func:`helpers.notify_hooks.async_emit_and_dispatch` — unless the user's
``notify_extra_data`` template already sets ``notification_icon``.

Precedence (:func:`notify_icon_for`): the task's own ``notify_icon`` field →
the battery-fleet task's icon → the maintenance type's default → the
notification kind's default → :data:`FALLBACK_NOTIFY_ICON`.
"""

from __future__ import annotations

import re
from collections.abc import Mapping
from typing import Any

from ..const import BATTERY_FLEET_TASK_FLAG, MAX_NOTIFY_ICON_LENGTH, MaintenanceTypeEnum

#: Default icon when neither the task nor the kind says anything.
FALLBACK_NOTIFY_ICON = "mdi:wrench-clock"

#: Per maintenance type (``MaintenanceTypeEnum`` values) — reminders about a
#: task (status, lead-time, completed) take the icon of the task's type.
DEFAULT_NOTIFY_ICONS: dict[str, str] = {
    MaintenanceTypeEnum.CLEANING.value: "mdi:broom",
    MaintenanceTypeEnum.INSPECTION.value: "mdi:magnify",
    MaintenanceTypeEnum.REPLACEMENT.value: "mdi:swap-horizontal",
    MaintenanceTypeEnum.CALIBRATION.value: "mdi:tune",
    MaintenanceTypeEnum.SERVICE.value: "mdi:wrench",
    MaintenanceTypeEnum.READING.value: "mdi:counter",
    MaintenanceTypeEnum.CUSTOM.value: FALLBACK_NOTIFY_ICON,
}

#: The single battery-fleet task (``battery_fleet_task`` marker) is a
#: "replacement" by type but reads better with a battery icon.
BATTERY_FLEET_NOTIFY_ICON = "mdi:battery-alert-variant-outline"

#: Per notification kind (``helpers.notify_hooks.NOTIFICATION_KINDS`` keys) —
#: used when the notification is not about one task (summaries, alerts, the
#: Settings test button). Kinds that always carry a task (status, lead_time,
#: completed) resolve through the type table first; ``completed`` keeps its
#: own icon because it is news, not a reminder.
KIND_NOTIFY_ICONS: dict[str, str] = {
    "bundle": "mdi:clipboard-list-outline",
    "digest": "mdi:clipboard-list-outline",
    "quiet_end": "mdi:weather-sunset-up",
    "warranty": "mdi:shield-check-outline",
    "budget": "mdi:piggy-bank-outline",
    "completed": "mdi:check-circle-outline",
    "test": "mdi:bell-ring-outline",
}

#: Kinds whose icon is decided by the kind even when a task is attached.
_KIND_WINS_OVER_TYPE = frozenset({"completed"})

#: ``^mdi:[a-z0-9]+(-[a-z0-9]+)*$`` — applied with ``fullmatch`` (a ``$``
#: anchor alone would still accept a trailing newline).
_ICON_RE = re.compile(r"mdi:[a-z0-9]+(-[a-z0-9]+)*")


def is_valid_icon(value: Any) -> bool:
    """True for a well-formed ``mdi:`` icon name (lower-case words joined by
    single dashes, at most ``MAX_NOTIFY_ICON_LENGTH`` characters)."""
    return isinstance(value, str) and len(value) <= MAX_NOTIFY_ICON_LENGTH and _ICON_RE.fullmatch(value) is not None


def normalize_icon(value: Any) -> str | None:
    """The stripped icon when valid, else ``None`` (empty = "no override")."""
    if not isinstance(value, str):
        return None
    stripped = value.strip()
    return stripped if is_valid_icon(stripped) else None


def notify_icon_for(task_data: Mapping[str, Any] | None, kind: str | None) -> str:
    """The icon a notification about ``task_data`` (or a task-less ``kind``)
    should carry — see the module docstring for the precedence."""
    task = task_data or {}
    override = normalize_icon(task.get("notify_icon"))
    if override:
        return override
    if kind in _KIND_WINS_OVER_TYPE:
        return KIND_NOTIFY_ICONS[kind]
    if task.get(BATTERY_FLEET_TASK_FLAG) is True:
        return BATTERY_FLEET_NOTIFY_ICON
    task_type = task.get("type")
    type_key = getattr(task_type, "value", task_type)
    if isinstance(type_key, str) and type_key in DEFAULT_NOTIFY_ICONS:
        return DEFAULT_NOTIFY_ICONS[type_key]
    if kind and kind in KIND_NOTIFY_ICONS:
        return KIND_NOTIFY_ICONS[kind]
    return FALLBACK_NOTIFY_ICON
