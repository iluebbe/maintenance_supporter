"""Journey: the task that completes itself when the sensor recovers (B6 variant).

A trigger task opted into ``auto_complete_on_recovery``: the sensor going back
to healthy IS the maintenance (salt refilled, filter swapped), so the task
records a completion on its own. This is a distinct completion path from a user
tap; the journey walks trigger-fires → sensor-recovers → auto-completed, and
asserts the recovery does NOT double-record across a restart (the 120 s race
guard plus persisted history).

See docs/design/user-journeys.md (B6 ... or auto-complete on recovery).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID, ScheduleType
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects

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

_SENSOR = "sensor.softener_salt"


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


async def test_trigger_recovery_auto_completes_once_across_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # Salt low = trigger fires; below/healthy = recovered. trigger_below models
    # "alert when salt drops under 20", recovery = value climbs back above.
    hass.states.async_set(_SENSOR, "80")
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": _SENSOR,
            "entity_ids": [_SENSOR],
            "trigger_below": 20,
            "auto_complete_on_recovery": True,
        },
    )
    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Water Softener",
        data=build_object_entry_data(
            object_data=build_object_data(name="Water Softener", object_id="objid_soft"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_softener",
    )
    obj.add_to_hass(hass)
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()

        before = await _read(hass, obj.entry_id)
        assert before["trigger_active"] is False
        performed0 = before["times_performed"]

        # Salt drops below 20 → the task triggers.
        hass.states.async_set(_SENSOR, "8")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True, "low salt should trigger"

        # Salt refilled (recovery) → the task auto-completes: one new completion.
        hass.states.async_set(_SENSOR, "95")
        await hass.async_block_till_done()
        recovered = await _read(hass, obj.entry_id)
        assert recovered["trigger_active"] is False, "trigger should clear on recovery"
        assert recovered["times_performed"] == performed0 + 1, "recovery did not auto-complete exactly once"

    # The auto-completion persisted; a restart must not replay or double-count it.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    await hass.async_block_till_done()
    assert (await _read(hass, obj.entry_id))["times_performed"] == performed0 + 1, "restart double-counted the auto-completion"

    # A genuine LATER low→recover cycle (past the 120 s race guard) records a
    # second completion — the guard only collapses near-simultaneous recoveries.
    with freeze_time("2026-05-01 09:10:00"):
        hass.states.async_set(_SENSOR, "5")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True
        hass.states.async_set(_SENSOR, "90")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["times_performed"] == performed0 + 2, "second recovery not recorded"
