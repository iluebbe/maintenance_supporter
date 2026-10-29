"""Complete a task when another entity changes to a state (D#229).

A task may name one entity and a state in ``complete_when``: the washer's
door opening, a coffee machine's descaling program starting. That entity
changing INTO the state completes the task through the coordinator
(:meth:`MaintenanceCoordinator.async_auto_complete_from_entity`), which does
so only while the task is due and records an automatic completion
(``source="auto_entity"``): nobody is asked for completion details, an inert
task is left alone, and a completion moments ago is not repeated.

Two options (D#240): ``any_time`` completes the task when it is not due as
well (every run of the robot vacuum counts, the weekly reminder comes only
when it has not run for a week), and ``for_minutes`` wants the state to hold
that long first. The change starts the wait, another state ends it (a
dropped connection in between does not); a restart during the wait starts
over with the next change.

Only a real change counts. The entity appearing (no old state) or coming
back from unavailable / unknown is no event (a door sensor reconnecting after
a restart must not complete anything), and neither is a change between two
other states. States compare like the state-change trigger's: trimmed and
case-insensitive.

One state listener per object entry, set up after its first refresh and
removed with it. Every task edit reloads the entry, so the listener always
follows the stored rules.
"""

from __future__ import annotations

from collections.abc import Mapping
from datetime import datetime
from typing import TYPE_CHECKING, Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.helpers.event import EventStateChangedData, async_call_later, async_track_state_change_event

from ..const import CONF_OBJECT, CONF_TASKS, UNAVAILABLE_STATES
from ..models.shapes import CompleteWhen
from .pause import is_task_inert
from .sanitize import sanitize_complete_when

if TYPE_CHECKING:
    from ..coordinator import MaintenanceCoordinator


def _norm(value: str) -> str:
    return value.strip().casefold()


def completes(to_state: str, old_state: State | None, new_state: State | None) -> bool:
    """Whether this state change is the entity changing INTO ``to_state``."""
    if old_state is None or new_state is None:
        return False
    if old_state.state in UNAVAILABLE_STATES or new_state.state in UNAVAILABLE_STATES:
        return False
    target = _norm(to_state)
    return _norm(new_state.state) == target and _norm(old_state.state) != target


def _left(to_state: str, new_state: State | None) -> bool:
    """Whether the entity left the state a rule waits on: removed, or in
    another real state. Unavailable or unknown in between is a dropped
    connection, not the vacuum docking: the wait goes on, and the state must
    be back when it ends."""
    if new_state is None:
        return True
    return new_state.state not in UNAVAILABLE_STATES and _norm(new_state.state) != _norm(to_state)


def rules_by_entity(tasks: Mapping[str, Any], obj: dict[str, Any]) -> dict[str, list[tuple[str, CompleteWhen]]]:
    """``entity_id → [(task_id, rule)]`` for the entry's tasks that are not
    archived, disabled or paused."""
    out: dict[str, list[tuple[str, CompleteWhen]]] = {}
    for task_id, task in tasks.items():
        if not isinstance(task, dict) or is_task_inert(task, obj):
            continue
        rule = sanitize_complete_when(task.get("complete_when"))
        if rule:
            out.setdefault(rule["entity_id"], []).append((task_id, rule))
    return out


@callback
def async_track_complete_when(hass: HomeAssistant, coordinator: MaintenanceCoordinator) -> CALLBACK_TYPE:
    """Listen to the entry's ``complete_when`` entities; returns the unsubscribe."""
    data = coordinator.entry.data
    rules = rules_by_entity(data.get(CONF_TASKS) or {}, data.get(CONF_OBJECT) or {})
    if not rules:
        return lambda: None
    # task_id → cancel of the wait for a rule's state to hold (D#240).
    waiting: dict[str, CALLBACK_TYPE] = {}

    @callback
    def _complete(task_id: str, rule: CompleteWhen, state: State) -> None:
        hass.async_create_task(
            coordinator.async_auto_complete_from_entity(task_id, state.name, state.state, any_time=rule.get("any_time", False)),
            f"maintenance_supporter complete_when {task_id}",
        )

    @callback
    def _wait(task_id: str, rule: CompleteWhen) -> None:
        @callback
        def _held(_now: datetime) -> None:
            waiting.pop(task_id, None)
            state = hass.states.get(rule["entity_id"])
            if state is not None and _norm(state.state) == _norm(rule["to_state"]):
                _complete(task_id, rule, state)

        if (cancel := waiting.pop(task_id, None)) is not None:
            cancel()
        waiting[task_id] = async_call_later(hass, rule.get("for_minutes", 0) * 60, _held)

    @callback
    def _on_change(event: Event[EventStateChangedData]) -> None:
        old_state, new_state = event.data["old_state"], event.data["new_state"]
        for task_id, rule in rules.get(event.data["entity_id"], ()):
            if new_state is not None and completes(rule["to_state"], old_state, new_state):
                if rule.get("for_minutes"):
                    _wait(task_id, rule)
                else:
                    _complete(task_id, rule, new_state)
            elif task_id in waiting and _left(rule["to_state"], new_state):
                waiting.pop(task_id)()

    unsubscribe = async_track_state_change_event(hass, list(rules), _on_change)

    @callback
    def _stop() -> None:
        unsubscribe()
        for cancel in waiting.values():
            cancel()
        waiting.clear()

    return _stop
