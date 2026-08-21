"""Journey: the state-change hold filter (#136), end to end.

lurisin's report: vacuum problem sensors flip to "problem" for a couple of
seconds at night and every flicker fired the adopted task + notification.
This journey walks the REAL path — problem-sensor adoption with the dialog's
new flicker filter, live state events, the event-driven hold timer — and
asserts on the coordinator's task state, not on trigger internals:

* a brief flicker leaves the task un-triggered,
* the problem persisting through the window triggers it,
* recovery afterwards auto-completes it (the adopted default).
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    build_global_entry_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


async def test_journey_adopted_problem_sensor_with_flicker_filter(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    await setup_integration(hass, global_entry)
    hass.states.async_set(
        "binary_sensor.vacuum_problem",
        "off",
        {"device_class": "problem", "friendly_name": "Vacuum problem"},
    )

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [
                {
                    "entity_id": "binary_sensor.vacuum_problem",
                    "name": "Vacuum problem",
                    "object_name": "Vacuum Cleaner",
                    "for_minutes": 10,
                }
            ],
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args

    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Vacuum Cleaner"
    )
    await hass.async_block_till_done()
    coordinator = obj.runtime_data.coordinator
    (task_id,) = obj.data[CONF_TASKS].keys()

    def trigger_active() -> bool:
        return bool(coordinator.data[CONF_TASKS][task_id]["_trigger_active"])

    # Night-time flicker: problem for a moment, then gone. Never triggers.
    hass.states.async_set("binary_sensor.vacuum_problem", "on", {"device_class": "problem"})
    await hass.async_block_till_done()
    assert trigger_active() is False
    hass.states.async_set("binary_sensor.vacuum_problem", "off", {"device_class": "problem"})
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=15))
    await hass.async_block_till_done()
    assert trigger_active() is False

    # A REAL problem persists through the window: the task triggers.
    hass.states.async_set("binary_sensor.vacuum_problem", "on", {"device_class": "problem"})
    await hass.async_block_till_done()
    assert trigger_active() is False  # still inside the hold window
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=11))
    await hass.async_block_till_done()
    assert trigger_active() is True

    # Recovery clears it again (adopted tasks auto-complete on recovery).
    hass.states.async_set("binary_sensor.vacuum_problem", "off", {"device_class": "problem"})
    await hass.async_block_till_done()
    assert trigger_active() is False
    merged = coordinator._get_merged_tasks_data()[task_id]
    completions = [e for e in merged.get("history", []) if e["type"] == "completed"]
    assert len(completions) == 1 and completions[0].get("auto") is True
