"""An AND/OR rule seen clear after a completion takes its next problem at once.

Found by the faketime year of 2026-11-01 and reproduced live: a dehumidifier
whose OR rule was completed while the basement humidity still read high; the
humidity came down, then the tank filled. The tank's activation was held back
for the ten-minute post-completion cooldown (as if it were the old problem the
user completed before fixing), then repainted without a history entry or a
notification. A plain sensor rule tells its coordinator when it sees its
sensor back on the normal side after a completion (note_trigger_recovered);
a condition's sub-trigger told the compound's coordinator proxy, which
dropped it, and the compound itself only noticed "clear" on a falling edge
of its own, which a reset had already taken away.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import HistoryEntryType, ScheduleType

from .conftest import build_task_data, make_global_entry, make_object_entry, setup_integration


def _task(logic: str) -> dict[str, Any]:
    return build_task_data(
        task_id="task_1",
        name="Empty the tank or ventilate",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "compound",
            "compound_logic": logic,
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.tank", "entity_ids": ["sensor.tank"], "trigger_above": 90},
                {"type": "threshold", "entity_id": "sensor.humidity", "entity_ids": ["sensor.humidity"], "trigger_above": 72},
            ],
        },
    )


async def _setup(hass: HomeAssistant, logic: str, tank: str, humidity: str) -> Any:
    hass.states.async_set("sensor.tank", tank)
    hass.states.async_set("sensor.humidity", humidity)
    obj = make_object_entry(hass, tasks={"task_1": _task(logic)}, name="Dehumidifier", uid="cmp-rec")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    coordinator = obj.runtime_data.coordinator
    assert coordinator.data["tasks"]["task_1"].trigger_active is True
    return coordinator


async def _read(hass: HomeAssistant, entity_id: str, value: str) -> None:
    hass.states.async_set(entity_id, value)
    await hass.async_block_till_done()


def _triggered_entries(coordinator: Any) -> int:
    merged = coordinator._get_merged_tasks_data()["task_1"]
    return sum(1 for e in merged.get("history") or [] if e.get("type") == HistoryEntryType.TRIGGERED)


async def test_or_rule_cleared_after_completion_takes_a_new_problem_at_once(hass: HomeAssistant) -> None:
    """Completed while the humidity held; the humidity comes down (the tank
    was fine all along), then the tank fills: a new problem, applied at once
    and recorded, not held for the cooldown."""
    coordinator = await _setup(hass, "OR", tank="50", humidity="85")
    before = _triggered_entries(coordinator)
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is False

    await _read(hass, "sensor.humidity", "60")
    await _read(hass, "sensor.tank", "95")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is True, "a new problem after the old one cleared"
    assert not coordinator.in_completion_cooldown("task_1")
    assert _triggered_entries(coordinator) == before + 1, "the new activation is on record"


async def test_or_rule_still_holding_after_completion_stays_held(hass: HomeAssistant) -> None:
    """The guard the cooldown is for stays: completed while the humidity
    held, and it still holds when the tank fills too — the user completed
    before fixing it, nothing new to announce inside the cooldown."""
    coordinator = await _setup(hass, "OR", tank="50", humidity="85")
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await _read(hass, "sensor.humidity", "86")
    await _read(hass, "sensor.tank", "95")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is False, "held back inside the cooldown"
    assert coordinator.in_completion_cooldown("task_1")


async def test_and_rule_one_condition_cleared_is_recovered(hass: HomeAssistant) -> None:
    """An AND rule is clear as soon as one of its conditions is: completed
    while both held, the humidity comes down — recovered, the cooldown is
    lifted — and when both read high again it is a new problem, applied at
    once."""
    coordinator = await _setup(hass, "AND", tank="95", humidity="85")
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await _read(hass, "sensor.humidity", "60")
    assert not coordinator.in_completion_cooldown("task_1"), "one clear condition clears an AND rule"
    await _read(hass, "sensor.humidity", "80")
    await _read(hass, "sensor.tank", "96")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is True


async def test_and_rule_remembers_the_sensor_that_never_moved(hass: HomeAssistant) -> None:
    """Completed while both held; the humidity comes down and goes up again,
    the tank reads 95 the whole time and never reports. The reset forgot the
    tank, so the AND rule read it as fine and kept quiet until the tank's
    sensor changed."""
    coordinator = await _setup(hass, "AND", tank="95", humidity="85")
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await _read(hass, "sensor.humidity", "60")
    before = _triggered_entries(coordinator)
    await _read(hass, "sensor.humidity", "85")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is True, "the tank still reads 95"
    assert _triggered_entries(coordinator) == before + 1


async def test_and_rule_completed_while_clear_takes_the_next_crossing_at_once(hass: HomeAssistant) -> None:
    """Completed while the AND rule was clear (the humidity was down, the
    tank high): the humidity crossing later is a new problem, applied at once.
    The humidity was no condition that held at the completion, and only those
    counted as the rule being clear."""
    coordinator = await _setup(hass, "AND", tank="95", humidity="85")
    await _read(hass, "sensor.humidity", "60")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is False
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await _read(hass, "sensor.humidity", "85")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is True
    assert not coordinator.in_completion_cooldown("task_1")


async def test_and_rule_still_holding_comes_back_after_the_cooldown_without_a_reading(hass: HomeAssistant) -> None:
    """Completed while both held, and neither sensor reports again: held back
    for the cooldown, then back on and recorded, as a sensor rule re-latches.
    Without a new reading the compound never noticed."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    from custom_components.maintenance_supporter.const import TRIGGER_COMPLETION_COOLDOWN_SECONDS

    coordinator = await _setup(hass, "AND", tank="95", humidity="85")
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is False, "held back inside the cooldown"
    before = _triggered_entries(coordinator)

    coordinator._recently_completed["task_1"] -= TRIGGER_COMPLETION_COOLDOWN_SECONDS + 5
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=TRIGGER_COMPLETION_COOLDOWN_SECONDS + 5))
    await hass.async_block_till_done()
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"].trigger_active is True
    assert _triggered_entries(coordinator) == before + 1


async def test_or_rule_one_of_two_held_conditions_cleared_is_not_recovered(hass: HomeAssistant) -> None:
    """Both conditions of an OR rule held at the completion; only one comes
    down: the other still holds the old problem — no recovery yet."""
    coordinator = await _setup(hass, "OR", tank="95", humidity="85")
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await _read(hass, "sensor.humidity", "60")
    assert coordinator.in_completion_cooldown("task_1"), "the tank still holds"
    await _read(hass, "sensor.tank", "50")
    assert not coordinator.in_completion_cooldown("task_1"), "both seen clear"
