"""Regression tests for the bug audit of 2026-10-17, tranche 1 (v2.105.0).

One test (or a small group) per finding; the docstrings name the reported
failure so a red test says which bug came back. N-2 (voice matching) lives in
test_intent_match.py, N-3 (the quiet-hours summary) in
test_notification_state_persist_quiet.py.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import Event, HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    HistoryEntryType,
    ScheduleType,
)

from .conftest import build_object_data, build_task_data, make_global_entry, make_object_entry, setup_integration

TASK = "task_1"


async def _setup(hass: HomeAssistant, tasks: dict[str, dict[str, Any]]) -> MockConfigEntry:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks=tasks, name="Boiler", uid="t1a17", object_data=build_object_data(name="Boiler", object_id="t1a17"))
    await setup_integration(hass, g, obj)
    return obj


def _history_types(hass: HomeAssistant, entry: MockConfigEntry) -> list[str]:
    coordinator = hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator
    return [h.get("type") for h in coordinator._get_merged_tasks_data()[TASK].get("history") or []]


def _capture(hass: HomeAssistant, event_type: str) -> list[Event]:
    events: list[Event] = []
    hass.bus.async_listen(event_type, events.append)
    return events


def _threshold_task(*entity_ids: str, **trigger: Any) -> dict[str, Any]:
    return build_task_data(
        task_id=TASK,
        name="Filter",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": entity_ids[0], "entity_ids": list(entity_ids), "trigger_above": 30, **trigger},
    )


async def _set(hass: HomeAssistant, entity_id: str, value: str) -> None:
    hass.states.async_set(entity_id, value)
    await hass.async_block_till_done()


# ─── T-2: a multi-entity trigger announces the TASK, not each sensor ─────


async def test_an_all_task_is_announced_once_its_set_is_complete(hass: HomeAssistant) -> None:
    """Every sensor of an "all" trigger announced its own crossing as the
    task's: one sensor over its limit wrote a TRIGGERED history entry and
    fired the activation event while the task itself stayed OK."""
    for eid in ("sensor.p1", "sensor.p2"):
        hass.states.async_set(eid, "10")
    activations = _capture(hass, EVENT_TRIGGER_ACTIVATED)
    entry = await _setup(hass, {TASK: _threshold_task("sensor.p1", "sensor.p2", entity_logic="all")})
    await hass.async_block_till_done()

    await _set(hass, "sensor.p1", "40")
    assert HistoryEntryType.TRIGGERED not in _history_types(hass, entry)
    assert activations == []

    await _set(hass, "sensor.p2", "40")
    assert _history_types(hass, entry).count(HistoryEntryType.TRIGGERED) == 1
    assert len(activations) == 1 and activations[0].data["trigger_entity"] == "sensor.p2"


async def test_an_any_task_is_announced_by_its_first_sensor_only(hass: HomeAssistant) -> None:
    """With "any", every further sensor crossing wrote one more TRIGGERED
    entry and event, and each sensor clearing fired the deactivation event
    while a sibling still held the task."""
    for eid in ("sensor.p1", "sensor.p2"):
        hass.states.async_set(eid, "10")
    activations = _capture(hass, EVENT_TRIGGER_ACTIVATED)
    deactivations = _capture(hass, EVENT_TRIGGER_DEACTIVATED)
    entry = await _setup(hass, {TASK: _threshold_task("sensor.p1", "sensor.p2", entity_logic="any")})
    await hass.async_block_till_done()

    await _set(hass, "sensor.p1", "40")
    await _set(hass, "sensor.p2", "40")
    assert _history_types(hass, entry).count(HistoryEntryType.TRIGGERED) == 1
    assert len(activations) == 1

    await _set(hass, "sensor.p1", "10")
    assert deactivations == [], "sensor.p2 still holds the task"
    await _set(hass, "sensor.p2", "10")
    assert len(deactivations) == 1 and deactivations[0].data["trigger_entity"] == "sensor.p2"


async def test_a_single_sensor_task_announces_as_before(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.p1", "10")
    activations = _capture(hass, EVENT_TRIGGER_ACTIVATED)
    deactivations = _capture(hass, EVENT_TRIGGER_DEACTIVATED)
    entry = await _setup(hass, {TASK: _threshold_task("sensor.p1")})
    await hass.async_block_till_done()
    await _set(hass, "sensor.p1", "40")
    await _set(hass, "sensor.p1", "10")
    assert _history_types(hass, entry).count(HistoryEntryType.TRIGGERED) == 1
    assert len(activations) == 1 and len(deactivations) == 1


class _Shelf:
    """A store holding one part's stock and waiting pile."""

    def __init__(self, stock: float, pile: float) -> None:
        self.stock, self.pile = stock, pile

    def get_part_stock(self, _pid: str) -> float:
        return self.stock

    def set_part_stock(self, _pid: str, value: float) -> None:
        self.stock = value

    def get_part_restoring(self, _pid: str) -> float:
        return self.pile

    def set_part_restoring(self, _pid: str, value: float) -> None:
        self.pile = value


# ─── S-2: a use never adds to what is owned ──────────────────────────────


def test_a_use_takes_from_the_stock_then_from_the_waiting_pile() -> None:
    """The stock was clamped at 0 but the pile grew by the full quantity:
    with nobody pressing "ready again", every swap of two cells added two
    to what the household owns (0 + 2, 0 + 4, ...), a "restocked" event
    could fire on a use and a needed buy task was removed."""
    from custom_components.maintenance_supporter.parts_runtime import _book_use

    cells = {"id": "batt_aa nimh", "reuse": "charge"}
    shelf = _Shelf(0, 2)
    for _ in range(3):
        assert _book_use(shelf, cells, 2) == (2, 2)
        assert (shelf.stock, shelf.pile) == (0, 2)
    for start, after in (((5, 0), (3, 2)), ((1, 3), (0, 4)), ((0, 0), (0, 2))):
        shelf = _Shelf(*start)
        _book_use(shelf, cells, 2)
        assert (shelf.stock, shelf.pile) == after, start
    # Other cells came out of the device (D#213): this pile only gives.
    shelf = _Shelf(1, 2)
    _book_use(shelf, cells, 2, keeps_used=False)
    assert (shelf.stock, shelf.pile) == (0, 1)
    # A part that is not reusable is simply used up.
    shelf = _Shelf(1, 0)
    _book_use(shelf, {"id": "filter"}, 2)
    assert (shelf.stock, shelf.pile) == (0, 0)
