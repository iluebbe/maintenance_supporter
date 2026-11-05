"""The hub's battery count when the fleet's inputs change between its polls
(2026-10-05).

The hub's low-count sensor recounts on Battery Notes events and its 30-s
poll. The fleet task's trigger reads that count first when its object loads;
a count from before the fleet loaded (a move into a new instance, a hub that
counted first at a restart) read 0, which the trigger took for a recovery,
and the count catching up announced the same low battery again: a second
TRIGGERED entry and activation event. The hub now counts the moment a fleet
object has loaded its Store, and when the low/recovered percentages change.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, STORES_CACHE_KEY
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import LOW_COUNT_ENTITY_ID

from .conftest import make_global_entry, setup_integration
from .test_export_roundtrip import _make_fleet_entry
from .task_results import flat

GARAGE = "sensor.garage_remote_battery"


def _batteries(hass: HomeAssistant) -> None:
    """The garage remote at 35 %: above "low", below "recovered" — only a
    latch keeps it counted."""
    hass.states.async_set("sensor.hall_smoke_battery", "80", {"device_class": "battery", "unit_of_measurement": "%"})
    hass.states.async_set(GARAGE, "35", {"device_class": "battery", "unit_of_measurement": "%"})


async def _announced_fleet(hass: HomeAssistant) -> MockConfigEntry:
    """A fleet whose low garage remote is latched and already announced (as
    a move or a restart brings it)."""
    fleet = await _make_fleet_entry(hass)
    tid = next(iter(fleet.data[CONF_TASKS]))
    task = {
        **fleet.data[CONF_TASKS][tid],
        "history": [{"timestamp": "2026-10-01T08:00:00+00:00", "type": "triggered", "notes": "Sensor trigger activated", "trigger_value": 1.0}],
        "battery_low_latch": {GARAGE: {"at": "2026-09-20T08:00:00+00:00", "last_replaced": "2025-09-04"}},
    }
    hass.config_entries.async_update_entry(fleet, data={**fleet.data, CONF_TASKS: {tid: task}})
    return fleet


def _fleet_task(hass: HomeAssistant, fleet: MockConfigEntry) -> tuple[list[str], str | None]:
    tid = next(iter(fleet.data[CONF_TASKS]))
    history = [h.get("type") for h in hass.data[STORES_CACHE_KEY][fleet.entry_id].get_history(tid)]
    status = flat(((fleet.runtime_data.coordinator.data or {}).get(CONF_TASKS) or {}).get(tid)).get("_status")
    return history, status


async def test_a_fleet_loading_after_the_hub_counted_announces_nothing_again(hass: HomeAssistant) -> None:
    _batteries(hass)
    await setup_integration(hass, make_global_entry(hass))
    assert hass.states.get(LOW_COUNT_ENTITY_ID).state == "0", "the hub counted before the fleet loaded"
    activations: list[Event] = []

    @callback
    def _on(event: Event) -> None:
        activations.append(event)

    hass.bus.async_listen(f"{DOMAIN}_trigger_activated", _on)

    fleet = await _announced_fleet(hass)
    await hass.config_entries.async_setup(fleet.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get(LOW_COUNT_ENTITY_ID).state == "1", "counted the moment the fleet loaded"
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=31))  # the hub's next poll
    await hass.async_block_till_done()

    history, status = _fleet_task(hass, fleet)
    assert history == ["triggered"], "the low battery was announced once, before the move/restart"
    assert status == "triggered"
    assert activations == []


async def test_changed_percentages_are_counted_at_once(hass: HomeAssistant) -> None:
    _batteries(hass)
    g = make_global_entry(hass)
    await setup_integration(hass, g, await _make_fleet_entry(hass))
    assert hass.states.get(LOW_COUNT_ENTITY_ID).state == "0"
    hass.config_entries.async_update_entry(g, options={**g.options, "battery_low_percent": 40})
    await hass.async_block_till_done()
    assert hass.states.get(LOW_COUNT_ENTITY_ID).state == "1", "no wait for the next poll"

async def test_one_write_reads_the_fleet_once(hass: HomeAssistant) -> None:
    """The state and its attributes shared nothing: every write read the
    whole fleet twice (every sensor and binary sensor), on every 30-s poll.
    Now the attributes take the overview the state just read (2026-11-04)."""
    from unittest.mock import patch

    from custom_components.maintenance_supporter.helpers import battery_fleet
    from custom_components.maintenance_supporter.sensor import BatteryFleetLowSensor

    _batteries(hass)
    sensor = BatteryFleetLowSensor(hass)
    calls: list[int] = []
    real = battery_fleet.compute_overview

    def counting(h: HomeAssistant) -> object:
        calls.append(1)
        return real(h)

    with patch.object(battery_fleet, "compute_overview", side_effect=counting):
        assert sensor.native_value == 0
        assert sensor.extra_state_attributes["total_batteries"] == 2
        assert len(calls) == 1, "one write, one read of the fleet"
        hass.states.async_set(GARAGE, "5", {"device_class": "battery", "unit_of_measurement": "%"})
        assert sensor.native_value == 1, "the next write reads the fleet afresh"
        assert sensor.extra_state_attributes["batteries_due"], "and its attributes the same overview"
        assert len(calls) == 2
