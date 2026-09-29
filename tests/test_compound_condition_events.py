"""A compound trigger announces the TASK, not each of its conditions.

Each condition runs an ordinary trigger internally. Those used to fire
``maintenance_supporter_trigger_activated`` / ``_deactivated`` with the task's
ids themselves: one half of an AND flipping looked like the task triggering to
every automation keyed on the task, and a real activation arrived three times
(bug audit 2026-09-29). The existing compound tests watched the task's state,
never the events on the bus.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    ScheduleType,
)

from .conftest import TASK_ID_1, build_object_data, build_object_entry_data, build_task_data, setup_integration
from .test_journey_compound_trigger import global_entry  # the fixture

_TEMP = "sensor.cellar_temp"
_HUM = "sensor.cellar_humidity"


async def test_only_the_compound_announces_the_task(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    hass.states.async_set(_TEMP, "15")
    hass.states.async_set(_HUM, "45")
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "compound",
            "compound_logic": "AND",
            "conditions": [
                {"type": "threshold", "entity_id": _TEMP, "entity_ids": [_TEMP], "trigger_above": 22.0},
                {"type": "threshold", "entity_id": _HUM, "entity_ids": [_HUM], "trigger_above": 65.0},
            ],
        },
    )
    obj = MockConfigEntry(
        domain=DOMAIN,
        title="Cellar",
        unique_id="maintenance_supporter_cellar",
        data=build_object_entry_data(object_data=build_object_data(name="Cellar", object_id="objid_cellar"), tasks={TASK_ID_1: task}),
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()

    fired: list[tuple[str, Any]] = []
    for event in (EVENT_TRIGGER_ACTIVATED, EVENT_TRIGGER_DEACTIVATED):
        hass.bus.async_listen(event, lambda e: fired.append((e.event_type, e.data.get("trigger_type"))))

    async def set_states(temp: str, hum: str) -> list[tuple[str, Any]]:
        fired.clear()
        hass.states.async_set(_TEMP, temp)
        hass.states.async_set(_HUM, hum)
        await hass.async_block_till_done()
        return list(fired)

    assert await set_states("26", "45") == [], "one condition of an AND is not the task triggering"
    assert await set_states("26", "75") == [(EVENT_TRIGGER_ACTIVATED, "compound")]
    assert await set_states("26", "45") == [(EVENT_TRIGGER_DEACTIVATED, "compound")]
