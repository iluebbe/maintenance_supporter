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

import asyncio
import logging
from collections.abc import Callable
from typing import Any

from homeassistant.core import Context, Event, EventOrigin, EventStateChangedData, HomeAssistant, callback

from ..const import (
    CONF_TASKS,
    DOMAIN,
    EVENT_TASK_COMPLETED,
    GLOBAL_UNIQUE_ID,
)
from .sanitize import _FORBIDDEN_ACTION_DOMAINS, ACTION_OWNER_KEY

_LOGGER = logging.getLogger(__name__)


def _resolve_task_action(hass: HomeAssistant, entry_id: str, task_id: str) -> dict[str, Any] | None:
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


# How long a completion action waits for a target entity that is enabled but
# not loaded yet (see _await_loaded_targets).
_LOAD_WAIT_S = 60


async def _await_loaded_targets(hass: HomeAssistant, target: dict[str, Any] | None) -> None:
    """Wait for target entities that are enabled but not loaded yet.

    Wiring a counter reset switches on a button the integration shipped
    disabled; Home Assistant only reloads that integration 30 s later, and
    until then the button has no state — pressing it was a silent no-op
    (HA logs "referenced entities are missing"). The typical first
    completion comes right after adopting (the brush IS worn out), so it
    lost its reset (found building the docs GIF, 2.95). Entities that are
    unknown or disabled are not waited for — that is a broken action, which
    the stale-action repair reports.
    """
    raw = (target or {}).get("entity_id")
    entity_ids = [raw] if isinstance(raw, str) else [e for e in (raw or []) if isinstance(e, str)]
    if not entity_ids:
        return
    from homeassistant.helpers import entity_registry as er
    from homeassistant.helpers.event import async_track_state_change_event

    ent_reg = er.async_get(hass)

    def _pending() -> list[str]:
        out = []
        for entity_id in entity_ids:
            entry = ent_reg.async_get(entity_id)
            if hass.states.get(entity_id) is None and entry is not None and entry.disabled_by is None:
                out.append(entity_id)
        return out

    waiting = _pending()
    if not waiting:
        return
    loaded = asyncio.Event()

    @callback
    def _on_change(_event: Event[EventStateChangedData]) -> None:
        if not _pending():
            loaded.set()

    unsub = async_track_state_change_event(hass, waiting, _on_change)
    try:
        await asyncio.wait_for(loaded.wait(), _LOAD_WAIT_S)
    except TimeoutError:
        _LOGGER.warning("on_complete_action: %s did not load within %s s — running it anyway", ", ".join(_pending()), _LOAD_WAIT_S)
    finally:
        unsub()


async def _dispatch_action(hass: HomeAssistant, action: dict[str, Any]) -> bool:
    """Run the configured service-call with HA's standard call signature.
    True when the call was issued."""
    parts = _split_service(action.get("service", ""))
    if parts is None:
        _LOGGER.warning(
            "on_complete_action.service must be 'domain.service', got %r",
            action.get("service"),
        )
        return False
    domain, name = parts
    # Defense-in-depth: refuse privileged domains at dispatch too, so an action
    # stored before the write-time denylist existed (or via any path that skips
    # cap_action_field) can never run shell/scripts/host control on completion.
    if domain in _FORBIDDEN_ACTION_DOMAINS:
        _LOGGER.warning("on_complete_action refused: %s is a privileged service domain", domain)
        return False
    data = action.get("data") if isinstance(action.get("data"), dict) else None
    target = action.get("target") if isinstance(action.get("target"), dict) else None
    # Run as the user who configured it: HA then refuses admin-only services
    # (cloud.remote_connect, downloader, …) to an operator. Without a user
    # the call ran with system rights (bug audit 2026-09-26). Actions saved
    # before the stamp existed (or by an import/admin flow) keep running as
    # before; a removed user's action is not run in their name.
    context: Context | None = None
    owner = action.get(ACTION_OWNER_KEY)
    if isinstance(owner, str) and owner:
        if await hass.auth.async_get_user(owner) is None:
            _LOGGER.warning(
                "on_complete_action %s.%s skipped: the user who configured it no longer exists — save the task again",
                domain,
                name,
            )
            return False
        context = Context(user_id=owner)
    await _await_loaded_targets(hass, target)
    try:
        await hass.services.async_call(domain, name, service_data=data, target=target, blocking=False, context=context)
    except Exception:
        _LOGGER.exception(
            "on_complete_action service-call failed: %s.%s data=%r target=%r",
            domain,
            name,
            data,
            target,
        )
        return False
    return True


@callback
def register_action_listener(hass: HomeAssistant) -> Callable[[], None]:
    """Register the EVENT_TASK_COMPLETED listener.

    Returns the unsubscribe callback so callers can clean up on integration
    teardown.
    """

    # entry_id → its pending post-action refresh (cancelled on unload; a
    # background task, so a stopping Home Assistant cancels it too)
    pending: dict[str, asyncio.Task[None]] = {}

    async def _on_task_completed(event: Event) -> None:
        # Only OUR completions: the coordinator fires the event locally. The
        # same event type can be fired from outside — the REST/WebSocket
        # fire_event API or a mobile_app webhook (any logged-in user's phone)
        # — and a forged payload naming a task ran its configured service
        # call without the task ever being completed (bug audit 2026-09-26,
        # SEC-7). Automations wired on the event itself are unaffected.
        if event.origin is not EventOrigin.local:
            _LOGGER.warning("Ignoring a %s event fired from outside Home Assistant (origin %s)", EVENT_TASK_COMPLETED, event.origin)
            return
        entry_id = event.data.get("entry_id")
        task_id = event.data.get("task_id")
        if not entry_id or not task_id:
            return
        # #133: a pure backfill records maintenance that happened long ago —
        # running the on_complete_action NOW (reset a device counter, toggle
        # a helper) would act on the live device for stale work.
        if event.data.get("backfill"):
            return
        action = _resolve_task_action(hass, entry_id, task_id)
        if action is None:
            return
        # 2.95: a counter reset is pointless when the task completed itself
        # because that counter recovered (reset in the vendor app).
        if action.get("skip_auto") and event.data.get("source") == "auto_recovery":
            return
        if not await _dispatch_action(hass, action):
            return
        # The action often changes what the task watches (a reset button puts
        # the counter back to full) — but the completion's own refresh ran
        # before it landed, so the task kept showing the old reading until the
        # next periodic update (found live, 2.95). Read it again shortly after.
        if (previous := pending.pop(entry_id, None)) is not None:
            previous.cancel()
        pending[entry_id] = hass.async_create_background_task(
            _refresh_entry(hass, pending, entry_id), f"{DOMAIN} refresh after completion action"
        )

    unsub_event = hass.bus.async_listen(EVENT_TASK_COMPLETED, _on_task_completed)

    @callback
    def _unsubscribe() -> None:
        unsub_event()
        for task in pending.values():
            task.cancel()
        pending.clear()

    return _unsubscribe


_POST_ACTION_REFRESH_S = 3


async def _refresh_entry(hass: HomeAssistant, pending: dict[str, asyncio.Task[None]], entry_id: str) -> None:
    await asyncio.sleep(_POST_ACTION_REFRESH_S)
    pending.pop(entry_id, None)
    entry = hass.config_entries.async_get_entry(entry_id)
    runtime = getattr(entry, "runtime_data", None) if entry is not None else None
    coordinator = getattr(runtime, "coordinator", None)
    if coordinator is not None:
        await coordinator.async_refresh_now()
