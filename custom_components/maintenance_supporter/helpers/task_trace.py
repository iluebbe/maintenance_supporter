"""Task traces (the new look): what happened to a task, cycle by cycle.

Home Assistant keeps a trace of every automation run; a task's run is a due
cycle, from one completion to the next. The task's history already holds the
completions, skips, resets and trigger episodes. This journal adds what the
history never stored: the status changes, the reminders sent and taken off
the phones, the snoozes, and the "Done when" changes that did not count, with
the reason why. The panel's trace view merges both.

Recorded while the new look is on (``advanced_beta_editor_visible``, the
default since 2026-11-01; off is the classic panel),
in one Store, at most :data:`MAX_EVENTS` per task (the oldest go first). A
deleted task or object takes its journal with it. Recording is best effort:
it never raises into the code it watches.
"""

from __future__ import annotations

import logging
from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import CONF_ADVANCED_BETA_EDITOR, DOMAIN
from .global_options import global_option

_LOGGER = logging.getLogger(__name__)

TRACE_STORE_KEY = f"{DOMAIN}.task_trace"
TRACE_STORE_VERSION = 1
TASK_TRACE_KEY = "_task_trace"
#: Events kept per task: several cycles of a task reminded every day.
MAX_EVENTS = 200
_SAVE_DELAY = 10

# The event kinds; the panel's trace view knows the same set.
KIND_STATUS = "status"  # {"from", "to"}
KIND_REMINDER = "reminder"  # {"reminder": "status"|"lead"|"bundle", "status"?, "days"?}
KIND_REMINDER_CLEARED = "reminder_cleared"  # {"reason": "done"|"status_left"|"inert"}
KIND_SNOOZED = "snoozed"  # {"until", "hours"}
KIND_DONE_WHEN = "done_when"  # {"entity", "state", "result", "minutes"?, "status"?}
KIND_EDITED = "edited"  # {"fields": [...]}
TRACE_KINDS = frozenset(
    {KIND_STATUS, KIND_REMINDER, KIND_REMINDER_CLEARED, KIND_SNOOZED, KIND_DONE_WHEN, KIND_EDITED}
)

# KIND_DONE_WHEN results: counted (completes the task), waiting (the state
# must hold for some minutes), left_early (it did not), not_due (the rule
# counts only while the task is due), inert (paused, archived or disabled),
# recent (a completion moments ago).
DONE_WHEN_RESULTS = frozenset({"counted", "waiting", "left_early", "not_due", "inert", "recent"})


def tracing_enabled(hass: HomeAssistant) -> bool:
    """Whether the beta editor, and with it the trace, is on."""
    return bool(global_option(hass, CONF_ADVANCED_BETA_EDITOR))


def _key(entry_id: str, task_id: str) -> str:
    return f"{entry_id}:{task_id}"


class TaskTrace:
    """The journal of every task, kept in one Store."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, TRACE_STORE_VERSION, TRACE_STORE_KEY)
        self._events: dict[str, list[dict[str, Any]]] = {}
        # The last status seen per task: a change against it is an event. A
        # task seen the first time (or after a restart without a stored
        # status) only sets it.
        self._last_status: dict[str, str] = {}

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        events = data.get("events")
        if isinstance(events, dict):
            self._events = {
                key: [e for e in items if isinstance(e, dict)][-MAX_EVENTS:]
                for key, items in events.items()
                if isinstance(key, str) and isinstance(items, list)
            }
        statuses = data.get("statuses")
        if isinstance(statuses, dict):
            self._last_status = {k: v for k, v in statuses.items() if isinstance(k, str) and isinstance(v, str)}

    def _data(self) -> dict[str, Any]:
        return {"events": self._events, "statuses": self._last_status}

    def _dirty(self) -> None:
        self._store.async_delay_save(self._data, _SAVE_DELAY)

    @callback
    def add(self, entry_id: str, task_id: str, kind: str, data: Mapping[str, Any]) -> None:
        events = self._events.setdefault(_key(entry_id, task_id), [])
        events.append({"at": dt_util.utcnow().isoformat(), "kind": kind, **data})
        if len(events) > MAX_EVENTS:
            del events[: len(events) - MAX_EVENTS]
        self._dirty()

    @callback
    def observe_status(self, entry_id: str, task_id: str, status: str) -> None:
        key = _key(entry_id, task_id)
        old = self._last_status.get(key)
        if old == status:
            return
        self._last_status[key] = status
        if old is None:
            self._dirty()
        else:
            self.add(entry_id, task_id, KIND_STATUS, {"from": old, "to": status})

    def events(self, entry_id: str, task_id: str) -> list[dict[str, Any]]:
        return [dict(e) for e in self._events.get(_key(entry_id, task_id), ())]

    @callback
    def forget_task(self, entry_id: str, task_id: str) -> None:
        key = _key(entry_id, task_id)
        had_events = self._events.pop(key, None) is not None
        had_status = self._last_status.pop(key, None) is not None
        if had_events or had_status:
            self._dirty()

    @callback
    def forget_entry(self, entry_id: str) -> None:
        prefix = f"{entry_id}:"
        gone = [k for k in {*self._events, *self._last_status} if k.startswith(prefix)]
        for key in gone:
            self._events.pop(key, None)
            self._last_status.pop(key, None)
        if gone:
            self._dirty()


def get_trace(hass: HomeAssistant) -> TaskTrace | None:
    trace = hass.data.get(DOMAIN, {}).get(TASK_TRACE_KEY)
    return trace if isinstance(trace, TaskTrace) else None


@callback
def record(hass: HomeAssistant, entry_id: str, task_id: str, kind: str, **data: Any) -> None:
    """Note one event about a task while the beta editor is on."""
    try:
        trace = get_trace(hass)
        if trace is None or not tracing_enabled(hass):
            return
        trace.add(entry_id, task_id, kind, data)
    except Exception:  # a trace must never break what it watches
        _LOGGER.debug("Could not trace %s of task %s", kind, task_id, exc_info=True)


@callback
def observe_statuses(hass: HomeAssistant, entry_id: str, statuses: Mapping[str, str]) -> None:
    """The coordinator's statuses after a refresh: a changed one is an event."""
    try:
        trace = get_trace(hass)
        if trace is None or not tracing_enabled(hass):
            return
        for task_id, status in statuses.items():
            trace.observe_status(entry_id, task_id, str(status))
    except Exception:  # see record()
        _LOGGER.debug("Could not trace the statuses of %s", entry_id, exc_info=True)


@callback
def forget_task(hass: HomeAssistant, entry_id: str, task_id: str) -> None:
    """A deleted task takes its journal with it (whether tracing is on or not)."""
    if (trace := get_trace(hass)) is not None:
        trace.forget_task(entry_id, task_id)


@callback
def forget_entry(hass: HomeAssistant, entry_id: str) -> None:
    """A deleted object takes its tasks' journals with it."""
    if (trace := get_trace(hass)) is not None:
        trace.forget_entry(entry_id)
