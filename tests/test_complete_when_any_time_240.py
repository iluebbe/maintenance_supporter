"""D#240: *Done when* also when the task is not due, and for at least some
minutes.

The robot vacuum runs every other day; the reminder to tidy up before it
should come only when it has not run for a week. A weekly task with *Done
when the vacuum changes to cleaning* completed only while it was due, so the
runs in between counted for nothing. ``any_time`` makes every run complete
it and start the next week. ``for_minutes`` wants the state to hold that
long first, like the sensor trigger's *for at least*: a vacuum that starts
and docks again at once is no run.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_capture_events, async_fire_time_changed

from custom_components.maintenance_supporter.const import CONF_TASKS, EVENT_TASK_COMPLETED
from custom_components.maintenance_supporter.helpers.complete_when import rules_by_entity
from custom_components.maintenance_supporter.helpers.sanitize import sanitize_complete_when

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry, setup_integration

VACUUM = "vacuum.robbie"
RULE = {"entity_id": VACUUM, "to_state": "cleaning"}


def test_the_options_shape() -> None:
    assert sanitize_complete_when({**RULE, "any_time": True, "for_minutes": 5}) == {**RULE, "any_time": True, "for_minutes": 5}
    assert sanitize_complete_when({**RULE, "for_minutes": 5.7}) == {**RULE, "for_minutes": 5}
    assert sanitize_complete_when({**RULE, "for_minutes": 99999}) == {**RULE, "for_minutes": 1440}, "capped at a day"
    for not_set in ({"any_time": False}, {"any_time": "yes"}, {"for_minutes": 0}, {"for_minutes": -3}, {"for_minutes": "5"}, {"for_minutes": True}):
        assert sanitize_complete_when({**RULE, **not_set}) == RULE, not_set
    assert rules_by_entity({"a": {"complete_when": {**RULE, "any_time": True}}}, {}) == {VACUUM: [("a", {**RULE, "any_time": True})]}


async def _vacuum(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    """A weekly tidy-up done two days ago: not due (one warning day)."""
    hass.states.async_set(VACUUM, "docked", {"friendly_name": "Robbie"})
    last = (dt_util.now().date() - timedelta(days=2)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, name="Tidy up for the vacuum", interval_days=7, warning_days=1, last_performed=last)
    obj = make_object_entry(hass, tasks={TASK_ID_1: {**task, "complete_when": {**RULE, **options}}}, name="Living room", uid="living_240")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    return obj


async def _set(hass: HomeAssistant, state: str) -> None:
    hass.states.async_set(VACUUM, state, {"friendly_name": "Robbie"})
    await hass.async_block_till_done()


def _completions(obj: MockConfigEntry) -> list[dict[str, Any]]:
    history = obj.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1].get("history") or []
    return [h for h in history if h.get("type") == "completed"]


def _status(obj: MockConfigEntry) -> str:
    return str(obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1].status)


async def _later(hass: HomeAssistant, minutes: float) -> None:
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=minutes))
    await hass.async_block_till_done()


async def test_without_the_option_a_run_between_counts_for_nothing(hass: HomeAssistant) -> None:
    obj = await _vacuum(hass)
    assert _status(obj) == "ok"
    await _set(hass, "cleaning")
    assert not _completions(obj)


async def test_any_time_every_run_completes_it_and_starts_the_week(hass: HomeAssistant) -> None:
    obj = await _vacuum(hass, any_time=True)
    assert _status(obj) == "ok"
    await _set(hass, "cleaning")
    assert [h["notes"] for h in _completions(obj)] == ["Auto-completed: Robbie changed to cleaning"]
    result = obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    assert result.next_due == (dt_util.now().date() + timedelta(days=7)).isoformat(), "a week from this run"


async def test_for_minutes_the_state_has_to_hold(hass: HomeAssistant) -> None:
    obj = await _vacuum(hass, any_time=True, for_minutes=5)
    await _set(hass, "cleaning")
    assert not _completions(obj), "not at once"
    await _later(hass, 3)
    assert not _completions(obj)
    await _set(hass, "returning")  # docked again before five minutes
    await _later(hass, 10)
    assert not _completions(obj), "a run that stopped at once is no run"

    await _set(hass, "cleaning")
    await _later(hass, 5.1)
    assert len(_completions(obj)) == 1, "five minutes in, it counts"


async def test_a_dropped_connection_keeps_the_wait(hass: HomeAssistant) -> None:
    """Wi-Fi drops mid-run and comes back: still the same run."""
    obj = await _vacuum(hass, any_time=True, for_minutes=5)
    await _set(hass, "cleaning")
    await _later(hass, 1)
    await _set(hass, "unavailable")
    await _set(hass, "cleaning")
    await _later(hass, 5)
    assert len(_completions(obj)) == 1


async def test_another_state_ends_the_wait(hass: HomeAssistant) -> None:
    """Docked, then back from a dropped connection in "cleaning": that is no
    change into the state, and the docking ended the wait."""
    obj = await _vacuum(hass, any_time=True, for_minutes=5)
    await _set(hass, "cleaning")
    await _later(hass, 1)
    await _set(hass, "docked")
    await _set(hass, "unavailable")
    await _set(hass, "cleaning")
    await _later(hass, 10)
    assert not _completions(obj)


async def test_a_state_held_but_not_due_waits_without_any_time(hass: HomeAssistant) -> None:
    """for_minutes alone keeps the rule's due-only rule."""
    obj = await _vacuum(hass, for_minutes=5)
    await _set(hass, "cleaning")
    await _later(hass, 6)
    assert not _completions(obj)


async def test_unloading_drops_a_wait(hass: HomeAssistant) -> None:
    obj = await _vacuum(hass, any_time=True, for_minutes=5)
    completed = async_capture_events(hass, EVENT_TASK_COMPLETED)
    await _set(hass, "cleaning")
    await hass.config_entries.async_unload(obj.entry_id)
    await hass.async_block_till_done()
    await _later(hass, 10)
    assert completed == []
