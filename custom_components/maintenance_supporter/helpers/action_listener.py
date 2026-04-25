"""On-complete action listener (v1.3.0).

Subscribes to the integration's own EVENT_TASK_COMPLETED event bus topic
and dispatches the per-task `on_complete_action` service-call when set.

This is deliberately implemented as an event listener rather than a
direct call from the coordinator — that way Layer A (the event) is the
single source of truth, and Layer B (this listener) is just one of many
possible subscribers (other subscribers being user-written automations).
Adding more action-points later (skip, reset) is one extra listener
each, no coordinator changes.

Errors during the service-call are logged but do not propagate — a
broken `on_complete_action` config must not block the task from being
recorded as completed.
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from homeassistant.core import Event, HomeAssistant, callback

from ..const import (
    CONF_TASKS,
    DOMAIN,
    EVENT_TASK_COMPLETED,
    GLOBAL_UNIQUE_ID,
)

_LOGGER = logging.getLogger(__name__)


def _resolve_task_action(
    hass: HomeAssistant, entry_id: str, task_id: str
) -> dict[str, Any] | None:
    """Look up `on_complete_action` from the task's config entry.

    Returns the action dict or None if the entry/task/action isn't there.
    """
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        return None
    task = entry.data.get(CONF_TASKS, {}).get(task_id) or {}
    action = task.get("on_complete_action")
    if not isinstance(action, dict) or not action.get("service"):
        return None
    return action


def _split_service(spec: str) -> tuple[str, str] | None:
    """Split `domain.service` into a tuple, or None if malformed."""
    if not isinstance(spec, str) or "." not in spec:
        return None
    domain, name = spec.split(".", 1)
    if not domain or not name:
        return None
    return domain, name


async def _dispatch_action(hass: HomeAssistant, action: dict[str, Any]) -> None:
    """Run the configured service-call with HA's standard call signature."""
    parts = _split_service(action.get("service", ""))
    if parts is None:
        _LOGGER.warning(
            "on_complete_action.service must be 'domain.service', got %r",
            action.get("service"),
        )
        return
    domain, name = parts
    data = action.get("data") if isinstance(action.get("data"), dict) else None
    target = action.get("target") if isinstance(action.get("target"), dict) else None
    try:
        await hass.services.async_call(
            domain, name, service_data=data, target=target, blocking=False
        )
    except Exception:
        _LOGGER.exception(
            "on_complete_action service-call failed: %s.%s data=%r target=%r",
            domain, name, data, target,
        )


@callback
def register_action_listener(hass: HomeAssistant) -> Callable[[], None]:
    """Register the EVENT_TASK_COMPLETED listener.

    Returns the unsubscribe callback so callers can clean up on integration
    teardown.
    """
    async def _on_task_completed(event: Event) -> None:
        entry_id = event.data.get("entry_id")
        task_id = event.data.get("task_id")
        if not entry_id or not task_id:
            return
        action = _resolve_task_action(hass, entry_id, task_id)
        if action is None:
            return
        await _dispatch_action(hass, action)

    return hass.bus.async_listen(EVENT_TASK_COMPLETED, _on_task_completed)
