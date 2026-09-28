"""Regression tests for the reachability audit of 2026-09-28 — features the
docs promised that did not work the way they said (the #192 pattern).

One test (or a small group) per finding; the docstrings name the failure.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import Event, HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    ScheduleType,
)

from .conftest import build_object_data, build_task_data, make_global_entry, make_object_entry, setup_integration

TASK = "task_1"


async def _setup(hass: HomeAssistant, tasks: dict[str, dict[str, Any]]) -> MockConfigEntry:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks=tasks, name="Boiler", uid="reach", object_data=build_object_data(name="Boiler", object_id="reach"))
    await setup_integration(hass, g, obj)
    return obj


def _capture(hass: HomeAssistant, event_type: str) -> list[Event]:
    events: list[Event] = []
    hass.bus.async_listen(event_type, events.append)
    return events


def _task(trigger_config: dict[str, Any]) -> dict[str, Any]:
    return build_task_data(
        task_id=TASK, name="Filter", schedule_type=ScheduleType.SENSOR_BASED, interval_days=None, trigger_config=trigger_config
    )


async def test_trigger_events_carry_the_task_ids(hass: HomeAssistant) -> None:
    """EXAMPLES.md tells automations to deep-link with `trigger.event.data`
    ids, but `_trigger_activated` / `_deactivated` carried only the sensor
    entity — the link came out as `?entry_id=&task_id=`."""
    hass.states.async_set("sensor.pressure", "10")
    on, off = _capture(hass, EVENT_TRIGGER_ACTIVATED), _capture(hass, EVENT_TRIGGER_DEACTIVATED)
    entry = await _setup(hass, {TASK: _task({"type": "threshold", "entity_id": "sensor.pressure", "trigger_above": 30})})

    hass.states.async_set("sensor.pressure", "45")
    await hass.async_block_till_done()
    hass.states.async_set("sensor.pressure", "10")
    await hass.async_block_till_done()

    assert [(e.data["entry_id"], e.data["task_id"]) for e in on] == [(entry.entry_id, TASK)]
    assert [(e.data["entry_id"], e.data["task_id"]) for e in off] == [(entry.entry_id, TASK)]


async def test_compound_trigger_events_carry_the_task_ids(hass: HomeAssistant) -> None:
    """The compound trigger fires its own copies of the events — same gap."""
    hass.states.async_set("sensor.a", "10")
    hass.states.async_set("sensor.b", "10")
    on = _capture(hass, EVENT_TRIGGER_ACTIVATED)
    entry = await _setup(
        hass,
        {
            TASK: _task(
                {
                    "type": "compound",
                    "entity_id": "sensor.a",
                    "compound_logic": "OR",
                    "conditions": [
                        {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 30},
                        {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 30},
                    ],
                }
            )
        },
    )
    hass.states.async_set("sensor.b", "45")
    await hass.async_block_till_done()

    # Its conditions fire their own (threshold) events too; all carry the ids.
    compound = [e for e in on if e.data["trigger_type"] == "compound"]
    assert compound, "the compound trigger did not fire"
    assert {(e.data["entry_id"], e.data["task_id"]) for e in on} == {(entry.entry_id, TASK)}
