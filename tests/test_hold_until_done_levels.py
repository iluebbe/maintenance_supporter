"""D#229 follow-up: a threshold and a date from a sensor can hold the task
until it is done (``trigger_hold_until_done``), like the state-change latch.

A Litter-Robot's waste drawer reads lower again by measurement error, and a
frost forecast turns milder, before the job is done; the task should stay.
Pins:

- held: back in range keeps the task triggered, over again is the same
  episode (one TRIGGERED entry), a completion ends it
- without the hold the task goes back to OK, as before
- a held task survives a reload with the value back in range, and is only
  repainted (no second TRIGGERED entry)
- with a "for at least" window, going back and over again for the window is
  no second activation
- a date from a sensor: a later date reported keeps a held task
- the validator refuses the hold together with auto-complete on recovery on
  these triggers too, and keeps it where the engine ignores it
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.maintenance_supporter.const import CONF_TASKS
from custom_components.maintenance_supporter.websocket.tasks_validation import _validate_trigger_config

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry, setup_integration

DRAWER = "sensor.litter_robot_waste_drawer"
FILTER_DUE = "sensor.purifier_filter_due"


async def _task(hass: HomeAssistant, trigger: dict[str, Any], uid: str) -> MockConfigEntry:
    task = build_task_data(name="Empty the drawer", schedule_type="sensor_based", interval_days=None, trigger_config=trigger)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Litter-Robot", uid=uid)
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    return obj


async def _drawer(hass: HomeAssistant, **extra: Any) -> MockConfigEntry:
    hass.states.async_set(DRAWER, "40", {"unit_of_measurement": "%"})
    trigger = {"type": "threshold", "entity_id": DRAWER, "entity_ids": [DRAWER], "trigger_above": 80, **extra}
    return await _task(hass, trigger, "litter_hold")


async def _set(hass: HomeAssistant, entity_id: str, state: str) -> None:
    hass.states.async_set(entity_id, state, {"unit_of_measurement": "%"} if entity_id == DRAWER else {"device_class": "timestamp"})
    await hass.async_block_till_done()


def _status(obj: MockConfigEntry) -> str:
    return str(obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1].status)


def _entries(obj: MockConfigEntry, kind: str) -> list[dict[str, Any]]:
    history = obj.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1].get("history") or []
    return [h for h in history if h.get("type") == kind]


async def test_a_held_threshold_stays_until_it_is_done(hass: HomeAssistant) -> None:
    obj = await _drawer(hass, trigger_hold_until_done=True)
    await _set(hass, DRAWER, "85")
    assert _status(obj) == "triggered"
    await _set(hass, DRAWER, "70")
    assert _status(obj) == "triggered", "held: the drawer reads lower, it is not emptied"
    # The coordinator's own sweep reads the value too; it must not end it.
    await obj.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert _status(obj) == "triggered", "held through a refresh"
    await _set(hass, DRAWER, "90")
    await _set(hass, DRAWER, "70")
    assert len(_entries(obj, "triggered")) == 1, "over again while held is the same episode"
    assert not _entries(obj, "completed")

    await obj.runtime_data.coordinator.complete_maintenance(TASK_ID_1, notes="emptied")
    await hass.async_block_till_done()
    assert _status(obj) == "ok"
    await _set(hass, DRAWER, "60")
    assert _status(obj) == "ok", "a completion ends the hold"
    await _set(hass, DRAWER, "85")
    assert _status(obj) == "triggered", "the next fill is a new episode"
    assert len(_entries(obj, "triggered")) == 2


async def test_without_the_hold_the_threshold_ends_by_itself(hass: HomeAssistant) -> None:
    obj = await _drawer(hass)
    await _set(hass, DRAWER, "85")
    assert _status(obj) == "triggered"
    await _set(hass, DRAWER, "70")
    assert _status(obj) == "ok"


async def test_a_held_threshold_survives_a_reload_and_is_only_repainted(hass: HomeAssistant) -> None:
    obj = await _drawer(hass, trigger_hold_until_done=True)
    await _set(hass, DRAWER, "85")
    await _set(hass, DRAWER, "70")
    assert _status(obj) == "triggered"
    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    assert _status(obj) == "triggered", "the activation on record holds although the drawer reads 70"
    assert len(_entries(obj, "triggered")) == 1, "repainted, not announced again"


async def test_a_reload_without_the_hold_lets_it_go(hass: HomeAssistant) -> None:
    """The control for the reload above: with the value back in range and no
    hold, a fresh instance has nothing to hold."""
    obj = await _drawer(hass)
    await _set(hass, DRAWER, "85")
    await _set(hass, DRAWER, "70")
    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    assert _status(obj) == "ok"


async def test_a_for_window_while_held_is_no_second_activation(hass: HomeAssistant) -> None:
    obj = await _drawer(hass, trigger_hold_until_done=True, trigger_for_minutes=5)
    await _set(hass, DRAWER, "85")
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=6))
    await hass.async_block_till_done()
    assert _status(obj) == "triggered"
    await _set(hass, DRAWER, "70")
    await _set(hass, DRAWER, "88")
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=12))
    await hass.async_block_till_done()
    assert _status(obj) == "triggered"
    assert len(_entries(obj, "triggered")) == 1


async def test_a_held_date_from_a_sensor_stays_when_a_later_date_comes(hass: HomeAssistant) -> None:
    soon = (dt_util.utcnow() + timedelta(days=2)).isoformat()
    later = (dt_util.utcnow() + timedelta(days=90)).isoformat()
    hass.states.async_set(FILTER_DUE, soon, {"device_class": "timestamp"})
    trigger = {"type": "due_date", "entity_id": FILTER_DUE, "entity_ids": [FILTER_DUE], "trigger_days_before": 7, "trigger_hold_until_done": True}
    obj = await _task(hass, trigger, "purifier_hold")
    assert _status(obj) == "triggered"
    await _set(hass, FILTER_DUE, later)
    assert _status(obj) == "triggered", "held: a later date is not a changed filter"
    await obj.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    assert _status(obj) == "ok"


async def test_without_the_hold_a_later_date_ends_it(hass: HomeAssistant) -> None:
    soon = (dt_util.utcnow() + timedelta(days=2)).isoformat()
    hass.states.async_set(FILTER_DUE, soon, {"device_class": "timestamp"})
    trigger = {"type": "due_date", "entity_id": FILTER_DUE, "entity_ids": [FILTER_DUE], "trigger_days_before": 7}
    obj = await _task(hass, trigger, "purifier_plain")
    assert _status(obj) == "triggered"
    await _set(hass, FILTER_DUE, (dt_util.utcnow() + timedelta(days=90)).isoformat())
    assert _status(obj) == "ok"


def test_the_validator_takes_the_hold_on_these_triggers_and_refuses_it_with_auto_complete(hass: HomeAssistant) -> None:
    threshold = {"type": "threshold", "entity_id": DRAWER, "trigger_above": 80}
    due = {"type": "due_date", "entity_id": FILTER_DUE, "trigger_days_before": 7}
    for base in (threshold, due):
        tc = {**base, "trigger_hold_until_done": True}
        errors, _ = _validate_trigger_config(hass, tc)
        assert not errors and tc["trigger_hold_until_done"] is True, base
        tc = {**base, "trigger_hold_until_done": True, "auto_complete_on_recovery": True}
        errors, _ = _validate_trigger_config(hass, tc)
        assert any("trigger_hold_until_done" in e for e in errors), base
    # A counter only ends with a completion: the engine ignores the key, the
    # validator keeps it like other type-specific keys and refuses nothing.
    counter = {"type": "counter", "entity_id": "sensor.cycles", "trigger_target_value": 30, "trigger_hold_until_done": True, "auto_complete_on_recovery": True}
    errors, _ = _validate_trigger_config(hass, counter)
    assert not any("trigger_hold_until_done" in e for e in errors)
