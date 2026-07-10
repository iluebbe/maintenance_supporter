"""Journey: the sensor that keeps crying wolf (B6 trigger-cycle blind spot).

A sensor-driven task: the value crosses the threshold → the task goes
TRIGGERED → the user completes it → it resets. The lifecycle question the
per-object trigger tests don't answer end-to-end: what happens across a
restart while the sensor is STILL above the threshold? The trigger runtime
state lives half in the Store, and the object-rename / rotation bugs all
lived in exactly this "looks fine live, wrong after reload" gap. This walks
threshold-cross → complete → restart-while-still-high and pins the observed
re-arm behaviour so it can't drift silently.

See docs/design/user-journeys.md (B6 sensor-triggered flow).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID, ScheduleType
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import simulate_restart

_SENSOR = "sensor.trig_cycle_pressure"


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




def _object(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": _SENSOR,
            "entity_ids": [_SENSOR],
            "trigger_above": 30,
        },
    )
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Well Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Well Pump", object_id="objid_well"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_well_pump",
    )
    entry.add_to_hass(hass)
    return entry


async def _read(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    """Read the task's computed status + trigger_active via the WS objects surface."""
    conn = _conn()
    await call_ws_handler(
        ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"}
    )
    payload = conn.send_result.call_args.args[1]
    for obj in payload["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return task
    raise AssertionError("task not found in objects response")


async def test_trigger_fires_completes_and_rearms_across_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    hass.states.async_set(_SENSOR, "20")  # below threshold
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()

    # Below threshold → not triggered.
    task = await _read(hass, obj.entry_id)
    assert task["trigger_active"] is False, "should not be triggered below the threshold"
    assert task["status"] != "triggered"

    # Cross the threshold → TRIGGERED.
    hass.states.async_set(_SENSOR, "35")
    await hass.async_block_till_done()
    task = await _read(hass, obj.entry_id)
    assert task["trigger_active"] is True, "threshold crossed but task not triggered"
    assert task["status"] == "triggered"

    # Complete it. The completion is recorded regardless of the sensor value.
    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
    )
    await hass.async_block_till_done()
    after = await _read(hass, obj.entry_id)
    assert after["times_performed"] >= 1, "completion not recorded"

    # Restart while the sensor is STILL above the threshold. Pin the observed
    # re-arm behaviour: a level (not edge) threshold that is still exceeded
    # re-triggers after the reload — the task shouldn't get stuck "ok" while the
    # pressure is genuinely still high.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert hass.states.get(_SENSOR).state == "35", "sensor should still be high after restart"
    await hass.async_block_till_done()
    rearmed = await _read(hass, obj.entry_id)
    assert rearmed["trigger_active"] is True, (
        "a still-exceeded threshold must re-arm after restart, not stay silently ok"
    )
    assert rearmed["status"] == "triggered"

    # Finally, the sensor recovers → the task drops back to a non-triggered state.
    hass.states.async_set(_SENSOR, "18")
    await hass.async_block_till_done()
    recovered = await _read(hass, obj.entry_id)
    assert recovered["trigger_active"] is False, "trigger should clear once the value recovers"
