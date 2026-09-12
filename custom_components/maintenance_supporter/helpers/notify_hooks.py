"""Your own notification rule (#165): an event per notification, and extra
notify data from a template.

Every notification the integration sends passes through
:func:`async_emit_and_dispatch`, which — before the notify call —

1. renders the optional **extra data template** (global setting
   ``notify_extra_data``, Jinja, rendered with the notification's context)
   and merges the result into the payload's ``data`` (the user's keys win),
   so a routing layer such as Ticker gets its ``category`` / ``critical``
   / ``navigate_to``, Pushover its ``priority``, Telegram its
   ``parse_mode`` — without a special case per notifier; and
2. fires ``maintenance_supporter_notification`` with the full context, so
   an automation can do the routing itself — with the global setting
   ``notify_event_only`` the integration then sends nothing on its own and
   the automation is the whole delivery.

Both are opt-in; with neither configured the send is exactly what it was.
"""

from __future__ import annotations

import json
import logging
from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, TemplateError
from homeassistant.helpers.template import Template
from homeassistant.util.yaml import parse_yaml

from ..const import (
    CONF_NOTIFY_EVENT_ONLY,
    CONF_NOTIFY_EXTRA_DATA,
    CONF_OBJECT,
    CONF_TASKS,
    EVENT_NOTIFICATION,
    GLOBAL_UNIQUE_ID,
)
from .global_options import get_global_options
from .reference_numbers import format_task_ref

_LOGGER = logging.getLogger(__name__)

#: Kinds a notification context can carry — what an automation switches on.
KIND_STATUS = "status"  # due_soon / overdue / triggered status change or repeat
KIND_LEAD_TIME = "lead_time"  # N days before due (reminder_lead_days)
KIND_BUNDLE = "bundle"  # several tasks of one object in one message
KIND_DIGEST = "digest"  # the weekly digest
KIND_WARRANTY = "warranty"  # warranty-expiry reminder
KIND_BUDGET = "budget"  # budget alert
KIND_TEST = "test"  # the Settings "Send test" button
KIND_COMPLETED = "completed"  # #173 follow-up: a task was completed (activity, opt-in)


@dataclass(frozen=True)
class KindSpec:
    """One row of the notification matrix (docs/ARCHITECTURE.md → Notification
    model): what a kind IS, which setting switches it on and which of the
    manager's gates apply. The tripwire test keeps the docs table and this
    matrix in step, so a new kind cannot ship undocumented or ungated.

    Categories: ``reminder`` = personal + actionable (routed to the responsible
    person's devices, else the household service; complete/skip/snooze
    buttons); ``summary`` = a household overview; ``alert`` = household,
    informational with urgency; ``activity`` = household news, nothing to do.
    """

    kind: str
    category: str
    setting: str
    gates: frozenset[str]
    routing: str  # "personal" | "household"


_GATES_REMINDER = frozenset({"enabled", "target", "kind_enabled", "task_mute", "snooze", "vacation", "scope", "quiet_hours", "daily_cap", "repeat"})
NOTIFICATION_KINDS: dict[str, KindSpec] = {
    KIND_STATUS: KindSpec(KIND_STATUS, "reminder", "notify_<status>_enabled + interval", _GATES_REMINDER, "personal"),
    KIND_LEAD_TIME: KindSpec(KIND_LEAD_TIME, "reminder", "reminder_lead_days", frozenset({"enabled", "target", "task_mute", "snooze", "vacation", "quiet_hours", "daily_cap"}), "personal"),
    KIND_BUNDLE: KindSpec(KIND_BUNDLE, "summary", "notification_bundling_enabled + threshold", frozenset({"enabled", "target", "task_mute", "snooze", "vacation", "scope", "quiet_hours", "daily_cap"}), "household"),
    KIND_DIGEST: KindSpec(KIND_DIGEST, "summary", "weekly_digest_enabled", frozenset({"enabled", "target"}), "household"),
    # Fires once from the 08:00 tick (no retry) - like the digest it must not
    # be lost to quiet hours or the cap (the matrix claimed both; bug audit 2026-09-12).
    KIND_WARRANTY: KindSpec(KIND_WARRANTY, "alert", "warranty_reminder_enabled + days", frozenset({"enabled", "target"}), "household"),
    KIND_BUDGET: KindSpec(KIND_BUDGET, "alert", "budget_alerts_enabled + threshold", frozenset({"enabled", "target", "quiet_hours", "daily_cap"}), "household"),
    KIND_COMPLETED: KindSpec(KIND_COMPLETED, "activity", "notify_completed (off | automatic | all)", frozenset({"enabled", "target", "kind_enabled", "task_mute", "scope", "quiet_hours", "daily_cap"}), "household"),
    KIND_TEST: KindSpec(KIND_TEST, "test", "—", frozenset({"target"}), "household"),
}

# The last template text that failed to render — logged once, not on every
# notification while the user is still fixing it.
_last_failed_template: str | None = None


def notification_context(
    hass: HomeAssistant,
    kind: str,
    *,
    status: str | None = None,
    entry_id: str | None = None,
    task_id: str | None = None,
    task_name: str | None = None,
    object_name: str | None = None,
    days_until_due: int | None = None,
    next_due: str | None = None,
    responsible_user_id: str | None = None,
    tasks: list[dict[str, Any]] | None = None,
    **extra: Any,
) -> dict[str, Any]:
    """The facts a notification is about — the event's data and the
    template's variables. Object/task reference numbers and the task's
    priority are looked up from the entry (cheap, and the send paths only
    carry names)."""
    object_ref: str | None = None
    task_ref: str | None = None
    priority: str | None = None
    if entry_id:
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is not None and entry.unique_id != GLOBAL_UNIQUE_ID:
            obj = entry.data.get(CONF_OBJECT) or {}
            oref = obj.get("ref_no")
            object_ref = str(oref) if isinstance(oref, int) and oref > 0 else None
            if task_id:
                td = (entry.data.get(CONF_TASKS) or {}).get(task_id) or {}
                task_ref = format_task_ref(oref if isinstance(oref, int) else None, td.get("ref_no"))
                priority = td.get("priority") or "normal"
    url = "/maintenance-supporter"
    if entry_id and task_id:
        url = f"/maintenance-supporter?entry_id={entry_id}&task_id={task_id}"
    elif entry_id:
        url = f"/maintenance-supporter?entry_id={entry_id}"
    return {
        "kind": kind,
        "status": status,
        "entry_id": entry_id,
        "task_id": task_id,
        "task_name": task_name,
        "object_name": object_name,
        "object_ref": object_ref,
        "task_ref": task_ref,
        "priority": priority,
        "days_until_due": days_until_due,
        "next_due": next_due,
        "responsible_user_id": responsible_user_id,
        "url": url,
        "tasks": tasks or [],
        **extra,
    }


def render_extra_data(hass: HomeAssistant, template_text: str, variables: Mapping[str, Any]) -> dict[str, Any] | None:
    """Render the extra-data template into a dict, or None (logged once per
    failing text). A JSON/YAML-looking result is parsed; anything that is
    not a mapping is refused — ``data`` must stay a mapping."""
    global _last_failed_template
    text = template_text.strip()
    if not text:
        return None
    try:
        rendered = Template(text, hass).async_render(dict(variables), parse_result=True)
    except TemplateError as err:
        if _last_failed_template != text:
            _last_failed_template = text
            _LOGGER.warning("Extra notification data template failed to render: %s", err)
        return None
    if isinstance(rendered, str):
        try:
            rendered = json.loads(rendered)
        except ValueError:
            try:
                rendered = parse_yaml(rendered)
            except HomeAssistantError:  # not JSON, not YAML: refused below
                rendered = None
    if not isinstance(rendered, dict):
        if _last_failed_template != text:
            _last_failed_template = text
            _LOGGER.warning("Extra notification data template must render to a mapping (got %s)", type(rendered).__name__)
        return None
    _last_failed_template = None
    return {str(k): v for k, v in rendered.items()}


async def async_emit_and_dispatch(
    hass: HomeAssistant,
    target: str,
    service_data: dict[str, Any],
    context: Mapping[str, Any],
    *,
    blocking: bool = False,
) -> bool:
    """Fire the notification event, merge the extra data, then send — unless
    the user routes everything themselves (``notify_event_only``)."""
    from .notification_manager import async_dispatch_notify

    options = get_global_options(hass)
    payload = dict(service_data)
    data = dict(payload.get("data") or {})
    template_text = options.get(CONF_NOTIFY_EXTRA_DATA)
    if isinstance(template_text, str) and template_text.strip():
        variables = {**context, "target": target or None, "title": payload.get("title"), "message": payload.get("message")}
        extra = render_extra_data(hass, template_text, variables)
        if extra:
            data = {**data, **extra}
    if data:
        payload["data"] = data
    spec = NOTIFICATION_KINDS.get(str(context.get("kind") or ""))
    hass.bus.async_fire(
        EVENT_NOTIFICATION,
        {**context, "category": spec.category if spec else None, "target": target or None, "title": payload.get("title"), "message": payload.get("message"), "data": data},
    )
    if options.get(CONF_NOTIFY_EVENT_ONLY, False):
        _LOGGER.debug("notify_event_only: event fired, nothing sent to %s", target or "(no service)")
        return True
    if not target:
        return False
    return await async_dispatch_notify(hass, target, payload, blocking=blocking)
