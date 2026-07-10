"""Journey: the odometer counter that must not forget where it started (B6 depth).

Unlike a threshold trigger (stateless, re-evaluated each time), a delta-mode
counter accumulates: it fires when ``current - baseline >= target``, and
completing the task re-baselines to "now" so counting restarts. That baseline
is dynamic state — it has to survive a restart or the delta computation goes
wrong the moment HA reboots. This walks accumulate → fire → complete
(re-baseline) → restart → accumulate-again, pinning that the baseline both
resets on completion and persists across the reload.

See docs/design/user-journeys.md (B6 sensor-triggered flow — counter type).
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

_ODO = "sensor.car_odometer"


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




async def _read(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    conn = _conn()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    for obj in conn.send_result.call_args.args[1]["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return task
    raise AssertionError("task not found")


async def _set_odo(hass: HomeAssistant, km: int) -> None:
    hass.states.async_set(_ODO, str(km))
    await hass.async_block_till_done()


async def test_delta_counter_rebaselines_on_complete_and_persists(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # Oil change every 10 000 km: delta-mode counter over the odometer.
    hass.states.async_set(_ODO, "50000")
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "counter",
            "entity_id": _ODO,
            "entity_ids": [_ODO],
            "trigger_target_value": 10000,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 50000,
        },
    )
    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Family Car",
        data=build_object_entry_data(
            object_data=build_object_data(name="Family Car", object_id="objid_car"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_family_car",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()

    # Drive 6 000 km — under the 10 000 target, no trigger.
    await _set_odo(hass, 56000)
    assert (await _read(hass, obj.entry_id))["trigger_active"] is False, "6 000 km should not trigger a 10 000 counter"

    # Cross 10 000 km since the baseline → triggered.
    await _set_odo(hass, 60000)
    assert (await _read(hass, obj.entry_id))["trigger_active"] is True, "10 000 km delta must trigger"

    # Service the car → completion re-baselines to the current 60 000 km.
    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
    )
    await hass.async_block_till_done()
    await _set_odo(hass, 60000)
    assert (await _read(hass, obj.entry_id))["trigger_active"] is False, "re-baseline should clear the trigger"

    # Restart. The new baseline (60 000) must persist — otherwise the delta
    # recomputes against the OLD baseline and the car is wrongly "due" again.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    await _set_odo(hass, 64000)  # 4 000 km since service
    assert (await _read(hass, obj.entry_id))["trigger_active"] is False, (
        "post-service baseline lost across restart — 4 000 km wrongly reads as due"
    )

    # Another 10 000 km since the service → triggered again.
    await _set_odo(hass, 70000)
    assert (await _read(hass, obj.entry_id))["trigger_active"] is True, "second interval did not trigger"
