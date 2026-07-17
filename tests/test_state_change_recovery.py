"""A single-shot state_change trigger (target_changes == 1) is a LATCH: it
activates while the entity sits in its alert state and recovers when the entity
leaves it. Opting into ``auto_complete_on_recovery`` then records a completion —
the same contract threshold triggers already honour. This covers adopted
problem sensors and appliance event sensors (Home Connect salt/rinse-aid), whose
recovery previously never fired (the counter-only path never deactivated).
"""

from __future__ import annotations

from typing import Any

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

_SENSOR = "sensor.dishwasher_salt_nearly_empty"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
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


def _build_obj(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "state_change",
            "entity_id": _SENSOR,
            "entity_ids": [_SENSOR],
            "trigger_to_state": "present",
            "trigger_target_changes": 1,
            "auto_complete_on_recovery": True,
        },
    )
    obj = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Dishwasher",
        data=build_object_entry_data(
            object_data=build_object_data(name="Dishwasher", object_id="objid_dw"),
            tasks={TASK_ID_1: task},
        ),
        source="user", unique_id="maintenance_supporter_dw",
    )
    obj.add_to_hass(hass)
    return obj


async def test_state_change_latch_recovers_and_auto_completes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    hass.states.async_set(_SENSOR, "off")
    obj = _build_obj(hass)
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        p0 = (await _read(hass, obj.entry_id))["times_performed"]

        # Appliance signals the event -> latch active.
        hass.states.async_set(_SENSOR, "present")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True

        # Refilled: the event clears -> latch recovers AND auto-completes once.
        hass.states.async_set(_SENSOR, "off")
        await hass.async_block_till_done()
        rec = await _read(hass, obj.entry_id)
        assert rec["trigger_active"] is False, "latch should clear when the alert state is left"
        assert rec["times_performed"] == p0 + 1, "recovery did not auto-complete exactly once"

    # A later cycle fires again (the counter reset on recovery).
    with freeze_time("2026-06-01 09:00:00"):
        hass.states.async_set(_SENSOR, "present")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True, "second occurrence must re-fire"
        hass.states.async_set(_SENSOR, "off")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["times_performed"] == p0 + 2


async def test_state_change_latch_entity_appears_after_setup(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The trigger entity may not exist yet when the task is set up (appliance
    added later). The listener is registered anyway; once the entity appears the
    latch fires on the next transition into 'present' and still recovers."""
    obj = _build_obj(hass)  # NB: sensor state deliberately NOT set -> entity absent
    assert hass.states.get(_SENSOR) is None
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is False

        # Entity appears (old_state=None) in the healthy state — captured, no fire.
        hass.states.async_set(_SENSOR, "off")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is False

        # Now the event fires, then clears -> activate then auto-complete.
        hass.states.async_set(_SENSOR, "present")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True
        hass.states.async_set(_SENSOR, "off")
        await hass.async_block_till_done()
        rec = await _read(hass, obj.entry_id)
        assert rec["trigger_active"] is False and rec["times_performed"] == 1


async def test_state_change_latch_recovered_during_downtime_clears_quietly(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Startup restore: a latch persisted as active (change_count == 1) whose
    entity is now OUT of its alert state (it cleared while HA was down) must be
    reconciled to inactive WITHOUT recording a completion for a recovery
    transition that was never observed live."""
    hass.states.async_set(_SENSOR, "off")  # already recovered before we start
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "state_change",
            "entity_id": _SENSOR,
            "entity_ids": [_SENSOR],
            "trigger_to_state": "present",
            "trigger_target_changes": 1,
            "trigger_change_count": 1,  # persisted as active from before the restart
            "auto_complete_on_recovery": True,
        },
    )
    obj = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Dishwasher",
        data=build_object_entry_data(
            object_data=build_object_data(name="Dishwasher", object_id="objid_dw"),
            tasks={TASK_ID_1: task},
        ),
        source="user", unique_id="maintenance_supporter_dw",
    )
    obj.add_to_hass(hass)
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        after = await _read(hass, obj.entry_id)
    assert after["trigger_active"] is False, "latch left its alert state during downtime -> inactive"
    assert after["times_performed"] == 0, "must not auto-complete an unobserved recovery"
