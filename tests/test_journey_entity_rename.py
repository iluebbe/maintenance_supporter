"""Journey: the sensor gets renamed under the task (C8 blind spot).

A sensor-driven task fires against sensor.old. The user renames that entity in
Home Assistant. The rewrite helpers are unit-tested, but the end-to-end story
isn't: after the rename the task's trigger must actually FOLLOW to the new
entity and fire against it (not the dead old id), and the rewritten reference
must survive a restart. This walks trigger-on-old → rename → trigger-on-new →
restart, closing the gap between "the stored string was rewritten" and "the
live trigger re-subscribed".

See docs/design/user-journeys.md (C8 trigger entity replaced / renamed).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID, ScheduleType
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import simulate_restart

_OLD = "sensor.pump_pressure_old"
_NEW = "sensor.pump_pressure_new"


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


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


async def _read(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    conn = _conn()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    for obj in conn.send_result.call_args.args[1]["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return task
    raise AssertionError("task not found")


def _trigger_entity(entry: MockConfigEntry) -> str | None:
    tc = entry.data[CONF_TASKS][TASK_ID_1].get("trigger_config") or {}
    return tc.get("entity_id")


async def test_trigger_follows_a_renamed_entity_and_survives_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    hass.states.async_set(_OLD, "10")
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": _OLD, "entity_ids": [_OLD], "trigger_above": 30},
    )
    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Well Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Well Pump", object_id="objid_rename"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_well_rename",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()

    # The OLD sensor drives the trigger: crossing the threshold fires it.
    hass.states.async_set(_OLD, "40")
    await hass.async_block_till_done()
    assert (await _read(hass, obj.entry_id))["trigger_active"] is True, "trigger should fire on the old entity"

    # Complete to reset, then recover the old sensor so nothing is latched.
    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
    )
    hass.states.async_set(_OLD, "10")
    await hass.async_block_till_done()

    # Rename the sensor in HA: fire the registry-update event the integration
    # listens for. It rewrites the stored refs and schedules a reload.
    hass.bus.async_fire(
        er.EVENT_ENTITY_REGISTRY_UPDATED,
        {"action": "update", "entity_id": _NEW, "changes": {"entity_id": _OLD}},
    )
    await hass.async_block_till_done()
    await hass.async_block_till_done()  # flush the scheduled reload

    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert _trigger_entity(obj) == _NEW, "trigger_config entity_id not rewritten to the new name"

    # The OLD id is now dead — poking it must NOT trigger anything.
    hass.states.async_set(_OLD, "99")
    await hass.async_block_till_done()
    assert (await _read(hass, obj.entry_id))["trigger_active"] is False, "old (renamed-away) id should be inert"

    # The NEW id drives the trigger — proof the live trigger re-subscribed.
    hass.states.async_set(_NEW, "45")
    await hass.async_block_till_done()
    assert (await _read(hass, obj.entry_id))["trigger_active"] is True, "trigger did not follow to the new entity"

    # The rewritten reference and the working trigger survive a restart.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert _trigger_entity(obj) == _NEW, "rewritten entity ref lost across restart"
    assert hass.states.get(_NEW).state == "45"
    await hass.async_block_till_done()
    assert (await _read(hass, obj.entry_id))["trigger_active"] is True, "trigger stopped working after restart"
