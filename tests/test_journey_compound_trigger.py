"""Journey: two conditions that must agree, across a restart (B6 depth).

A compound AND trigger fires only when BOTH sub-conditions hold (mould risk =
warm AND humid). The per-condition, per-entity runtime state is flattened into
``_compound_N_*`` keys in the Store and reconstructed into nested conditions on
load — one of the most restart-sensitive pieces in the integration. This walks
neither→one→both (fires) → restart (state must round-trip) → one drops (clears),
pinning that the compound state survives the reload and the AND logic holds.

See docs/design/user-journeys.md (B6 sensor-triggered flow — compound type).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
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

_TEMP = "sensor.cellar_temp"
_HUM = "sensor.cellar_humidity"


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




async def _active(hass: HomeAssistant, entry_id: str) -> bool:
    conn = _conn()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    for obj in conn.send_result.call_args.args[1]["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return bool(task["trigger_active"])
    raise AssertionError("task not found")


async def _set(hass: HomeAssistant, temp: float, hum: float) -> None:
    hass.states.async_set(_TEMP, str(temp))
    hass.states.async_set(_HUM, str(hum))
    await hass.async_block_till_done()


async def test_compound_and_holds_and_survives_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
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
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Cellar",
        data=build_object_entry_data(
            object_data=build_object_data(name="Cellar", object_id="objid_cellar"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_cellar",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()

    # Neither condition met → not triggered.
    await _set(hass, temp=15, hum=45)
    assert await _active(hass, obj.entry_id) is False, "cold + dry should not trigger"

    # Only ONE condition met (warm but dry) → AND stays quiet.
    await _set(hass, temp=26, hum=45)
    assert await _active(hass, obj.entry_id) is False, "AND must not fire on one condition"

    # BOTH met (warm AND humid) → triggered.
    await _set(hass, temp=26, hum=75)
    assert await _active(hass, obj.entry_id) is True, "warm AND humid must trigger"

    # Restart with both conditions still met: the compound runtime state must
    # round-trip through the Store's _compound_N reconstruction and stay active.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get(_TEMP).state == "26" and hass.states.get(_HUM).state == "75"
    assert await _active(hass, obj.entry_id) is True, "compound AND state lost across restart"

    # One condition drops (dehumidifier kicks in) → the AND clears.
    await _set(hass, temp=26, hum=40)
    assert await _active(hass, obj.entry_id) is False, "AND should clear when one condition drops"

    # Both again → fires again (no stuck state after the restart round-trip).
    await _set(hass, temp=27, hum=80)
    assert await _active(hass, obj.entry_id) is True, "compound trigger stuck after restart round-trip"
