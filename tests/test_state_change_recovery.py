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


# ─── #167: from-only pattern ("from ok to any") ──────────────────────────

_DOCK = "sensor.robot_dock_error"


def _build_from_only(hass: HomeAssistant, *, persisted_count: int = 0) -> MockConfigEntry:
    """A dock-error sensor with a dozen fault states: the user can only name
    the healthy state, so the pattern is `from: ok` → `to: (any)`."""
    trigger_config: dict[str, Any] = {
        "type": "state_change",
        "entity_id": _DOCK,
        "entity_ids": [_DOCK],
        "trigger_from_state": "ok",
        "trigger_target_changes": 1,
        "auto_complete_on_recovery": True,
    }
    if persisted_count:
        trigger_config["trigger_change_count"] = persisted_count
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config=trigger_config,
    )
    obj = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Robot vacuum",
        data=build_object_entry_data(
            object_data=build_object_data(name="Robot vacuum", object_id="objid_rv"),
            tasks={TASK_ID_1: task},
        ),
        source="user", unique_id="maintenance_supporter_rv",
    )
    obj.add_to_hass(hass)
    return obj


async def test_from_only_latch_recovers_when_the_entity_returns_to_the_from_state(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#167: `from ok → any` fires on the first fault, does NOT re-fire while
    the sensor moves between fault states, and recovers (auto-completing once)
    the moment it is back to `ok`. Before the fix the recovery was hard-wired
    to a To-state, so this latch never cleared."""
    hass.states.async_set(_DOCK, "ok")
    obj = _build_from_only(hass)
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        p0 = (await _read(hass, obj.entry_id))["times_performed"]

        hass.states.async_set(_DOCK, "duct_blockage")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True

        # Another fault is not a recovery — and not a second trigger either.
        hass.states.async_set(_DOCK, "water_empty")
        await hass.async_block_till_done()
        mid = await _read(hass, obj.entry_id)
        assert mid["trigger_active"] is True
        assert mid["times_performed"] == p0

        hass.states.async_set(_DOCK, "ok")
        await hass.async_block_till_done()
        rec = await _read(hass, obj.entry_id)
        assert rec["trigger_active"] is False, "back to the From-state must clear the latch"
        assert rec["times_performed"] == p0 + 1, "recovery did not auto-complete exactly once"

    with freeze_time("2026-06-01 09:00:00"):
        hass.states.async_set(_DOCK, "no_dustbin")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True, "next fault must re-fire"
        hass.states.async_set(_DOCK, "ok")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["times_performed"] == p0 + 2


@pytest.mark.parametrize(
    ("live_state", "expect_active"),
    [("ok", False), ("duct_blockage", True)],
)
async def test_from_only_latch_restart_reconcile(
    hass: HomeAssistant, global_entry: MockConfigEntry, live_state: str, expect_active: bool
) -> None:
    """Startup restore for the from-only pattern: a latch persisted as active
    clears QUIETLY when the entity is back in its From-state, and stays active
    while it still reports a fault."""
    hass.states.async_set(_DOCK, live_state)
    obj = _build_from_only(hass, persisted_count=1)
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        after = await _read(hass, obj.entry_id)
    assert after["trigger_active"] is expect_active
    assert after["times_performed"] == 0, "an unobserved recovery must not auto-complete"


async def test_counter_without_pattern_keeps_counting(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Neither From nor To set: a pure change counter — no latch semantics
    sneak in through the new predicate (target 3 → third change fires)."""
    hass.states.async_set(_DOCK, "a")
    task = build_task_data(
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "state_change", "entity_id": _DOCK, "entity_ids": [_DOCK], "trigger_target_changes": 3},
    )
    obj = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Counter",
        data=build_object_entry_data(object_data=build_object_data(name="Counter", object_id="objid_ct"), tasks={TASK_ID_1: task}),
        source="user", unique_id="maintenance_supporter_ct",
    )
    obj.add_to_hass(hass)
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        for state in ("b", "a"):
            hass.states.async_set(_DOCK, state)
            await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is False
        hass.states.async_set(_DOCK, "c")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True
        # Still counting, not a latch: moving on does not clear it.
        hass.states.async_set(_DOCK, "a")
        await hass.async_block_till_done()
        assert (await _read(hass, obj.entry_id))["trigger_active"] is True
