"""Complete a task when another entity changes to a state (D#229).

A task may name one entity and a state in ``complete_when``: the washer's
door opening, a coffee machine's descaling program starting. That entity
changing INTO the state completes the task through the coordinator
(:meth:`MaintenanceCoordinator.async_auto_complete_from_entity`), which does
so only while the task is due and records an automatic completion
(``source="auto_entity"``): nobody is asked for completion details, an inert
task is left alone, and a completion moments ago is not repeated.

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
from typing import TYPE_CHECKING, Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.helpers.event import EventStateChangedData, async_track_state_change_event

from ..const import CONF_OBJECT, CONF_TASKS, UNAVAILABLE_STATES
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


def rules_by_entity(tasks: Mapping[str, Any], obj: dict[str, Any]) -> dict[str, list[tuple[str, str]]]:
    """``entity_id → [(task_id, to_state)]`` for the entry's tasks that are
    not archived, disabled or paused."""
    out: dict[str, list[tuple[str, str]]] = {}
    for task_id, task in tasks.items():
        if not isinstance(task, dict) or is_task_inert(task, obj):
            continue
        rule = sanitize_complete_when(task.get("complete_when"))
        if rule:
            out.setdefault(rule["entity_id"], []).append((task_id, rule["to_state"]))
    return out


@callback
def async_track_complete_when(hass: HomeAssistant, coordinator: MaintenanceCoordinator) -> CALLBACK_TYPE:
    """Listen to the entry's ``complete_when`` entities; returns the unsubscribe."""
    data = coordinator.entry.data
    rules = rules_by_entity(data.get(CONF_TASKS) or {}, data.get(CONF_OBJECT) or {})
    if not rules:
        return lambda: None

    @callback
    def _on_change(event: Event[EventStateChangedData]) -> None:
        old_state, new_state = event.data["old_state"], event.data["new_state"]
        for task_id, to_state in rules.get(event.data["entity_id"], ()):
            if new_state is not None and completes(to_state, old_state, new_state):
                hass.async_create_task(
                    coordinator.async_auto_complete_from_entity(task_id, new_state.name, new_state.state),
                    f"maintenance_supporter complete_when {task_id}",
                )

    return async_track_state_change_event(hass, list(rules), _on_change)
