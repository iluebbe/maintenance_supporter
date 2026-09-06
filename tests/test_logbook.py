"""Logbook (activity timeline) descriptions for lifecycle events.

The describe callbacks turn raw bus events into readable, localized entries
attached to the task's sensor entity. Tested unit-level against the
callbacks themselves — no logbook component needed.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import Event, HomeAssistant

from custom_components.maintenance_supporter.const import (
    EVENT_TASK_COMPLETED,
    EVENT_TASK_RESET,
    EVENT_TASK_SKIPPED,
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
)
from custom_components.maintenance_supporter.logbook import async_describe_events

Describer = Any


def _collect(hass: HomeAssistant) -> dict[str, Describer]:
    callbacks: dict[str, Describer] = {}

    def register(domain: str, event_type: str, describe: Describer) -> None:
        callbacks[event_type] = describe

    async_describe_events(hass, register)
    return callbacks


async def test_all_lifecycle_events_are_described(hass: HomeAssistant) -> None:
    callbacks = _collect(hass)
    assert set(callbacks) == {
        EVENT_TASK_COMPLETED,
        EVENT_TASK_SKIPPED,
        EVENT_TASK_RESET,
        EVENT_TRIGGER_ACTIVATED,
        EVENT_TRIGGER_DEACTIVATED,
    }


async def test_completed_entry_carries_details(hass: HomeAssistant) -> None:
    callbacks = _collect(hass)
    entry = callbacks[EVENT_TASK_COMPLETED](
        Event(
            EVENT_TASK_COMPLETED,
            {
                "entry_id": "e1",
                "task_id": "t1",
                "task_name": "Oil Change",
                "object_name": "Family Car",
                "cost": 95.0,
                "duration": 45,
                "notes": "OEM filter",
            },
        )
    )
    assert entry["name"] == "Oil Change (Family Car)"
    assert entry["message"] == "was completed — 95.0, 45 min, OEM filter"
    assert entry["icon"] == "mdi:check-circle"
    # No entity_id in the payload and no registry entry → no attribution.
    assert "entity_id" not in entry


async def test_completed_entry_uses_the_carried_entity_id(hass: HomeAssistant) -> None:
    """Since 2.75 the event carries the sensor's entity_id — the logbook keeps
    the attribution even after the task (and its registry entry) is gone."""
    callbacks = _collect(hass)
    entry = callbacks[EVENT_TASK_COMPLETED](
        Event(
            EVENT_TASK_COMPLETED,
            {
                "entry_id": "e1",
                "task_id": "t1",
                "task_name": "Oil Change",
                "object_name": "Family Car",
                "entity_id": "sensor.family_car_oil_change",
            },
        )
    )
    assert entry["entity_id"] == "sensor.family_car_oil_change"


async def test_completed_entry_is_localized(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    callbacks = _collect(hass)
    entry = callbacks[EVENT_TASK_COMPLETED](
        Event(
            EVENT_TASK_COMPLETED,
            {"task_id": "t1", "task_name": "Ölwechsel", "object_name": "Auto"},
        )
    )
    assert entry["message"] == "wurde erledigt"


async def test_skipped_and_reset_messages(hass: HomeAssistant) -> None:
    callbacks = _collect(hass)
    skipped = callbacks[EVENT_TASK_SKIPPED](
        Event(
            EVENT_TASK_SKIPPED,
            {"task_name": "Descaling", "object_name": "Espresso", "reason": "on vacation"},
        )
    )
    assert skipped["message"] == "was skipped — on vacation"

    reset = callbacks[EVENT_TASK_RESET](
        Event(
            EVENT_TASK_RESET,
            {"task_name": "Descaling", "object_name": "Espresso", "date": "2026-07-01"},
        )
    )
    assert reset["message"] == "was reset to 2026-07-01"


async def test_trigger_events_attach_to_entity(hass: HomeAssistant) -> None:
    callbacks = _collect(hass)
    on = callbacks[EVENT_TRIGGER_ACTIVATED](
        Event(
            EVENT_TRIGGER_ACTIVATED,
            {
                "entity_id": "sensor.hvac_filter",
                "trigger_entity": "sensor.hvac_airflow",
                "trigger_value": 54.2,
            },
        )
    )
    assert on["entity_id"] == "sensor.hvac_filter"
    assert on["message"] == "sensor trigger activated (sensor.hvac_airflow: 54.2)"

    off = callbacks[EVENT_TRIGGER_DEACTIVATED](Event(EVENT_TRIGGER_DEACTIVATED, {"entity_id": "sensor.hvac_filter"}))
    assert off["message"] == "sensor trigger cleared"


async def test_entries_attach_to_the_task_sensor_entity(hass: HomeAssistant) -> None:
    """When the task's sensor exists in the registry, entries attach to it —
    landing the event on the entity's (and its device's) own timeline."""
    from homeassistant.helpers import entity_registry as er

    reg = er.async_get(hass)
    entry = reg.async_get_or_create(
        "sensor",
        "maintenance_supporter",
        "maintenance_supporter_family_car_t1",
        suggested_object_id="family_car_oil_change",
    )

    callbacks = _collect(hass)
    for event_type in (EVENT_TASK_COMPLETED, EVENT_TASK_SKIPPED, EVENT_TASK_RESET):
        out = callbacks[event_type](
            Event(
                event_type,
                {"task_id": "t1", "task_name": "Oil Change", "object_name": "Family Car", "date": "2026-01-01"},
            )
        )
        assert out["entity_id"] == entry.entity_id, event_type
