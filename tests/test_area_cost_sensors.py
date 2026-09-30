"""Maintenance cost per Home Assistant area as sensors (#191).

The area page answers "what did the kitchen cost" on screen; a user who shows
that next to the room's other entities, or charts the cost per year with the
statistics graph card, needs it as an entity with long-term statistics — a
monetary ``total`` per area, created for every area that holds objects and
placed in that area.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import STATE_UNAVAILABLE
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.entity.area_cost import AreaCostSensorManager, area_cost_unique_id
from custom_components.maintenance_supporter.helpers.area_costs import entry_cost

from .conftest import build_object_data, build_task_data, make_global_entry, make_object_entry, setup_integration


def _completed(days_ago: int, cost: float, **extra: Any) -> dict[str, Any]:
    when = dt_util.now() - timedelta(days=days_ago)
    return {"type": "completed", "timestamp": when.isoformat(), "cost": cost, **extra}


def _object(hass: HomeAssistant, name: str, area_id: str | None, history: list[dict[str, Any]], **obj: Any) -> MockConfigEntry:
    task = build_task_data(task_id=f"t_{name}", name="Service", history=history)
    data = build_object_data(name=name, object_id=f"o_{name}", area_id=area_id)
    data.update(obj)
    return make_object_entry(hass, tasks={task["id"]: task}, name=name, uid=name, object_data=data)


async def _setup(hass: HomeAssistant, *objects: MockConfigEntry) -> MockConfigEntry:
    glob = make_global_entry(hass)
    await setup_integration(hass, glob, *objects)
    await hass.async_block_till_done()
    return glob


def _value(hass: HomeAssistant, entity_id: str) -> float:
    state = hass.states.get(entity_id)
    assert state is not None, entity_id
    return float(state.state)


async def test_every_area_with_objects_gets_its_cost(hass: HomeAssistant) -> None:
    areas = ar.async_get(hass)
    kitchen = areas.async_create("Kitchen")
    cellar = areas.async_create("Cellar")
    dishwasher = _object(hass, "dishwasher", kitchen.id, [_completed(10, 30.0), _completed(400, 50.0)])
    # A retired machine's repairs were still spent in that room.
    old_fridge = _object(hass, "fridge", kitchen.id, [_completed(5, 12.5)], archived_at="2026-01-01T00:00:00+00:00")
    heating = _object(hass, "heating", cellar.id, [_completed(3, 200.0), {"type": "skipped", "timestamp": dt_util.now().isoformat()}])
    loose = _object(hass, "bike", None, [_completed(1, 99.0)])
    await _setup(hass, dishwasher, old_fridge, heating, loose)

    total = hass.states.get(f"sensor.{kitchen.id}_maintenance_cost")
    assert total is not None
    assert float(total.state) == 92.5
    assert total.attributes["unit_of_measurement"] == "EUR"
    assert total.attributes["device_class"] == "monetary"
    assert total.attributes["state_class"] == "total"
    assert total.attributes["friendly_name"] == "Kitchen maintenance cost"
    assert _value(hass, f"sensor.{cellar.id}_maintenance_cost") == 200.0
    # Objects without an area belong to no sensor.
    ent_reg = er.async_get(hass)
    assert not [e for e in ent_reg.entities.values() if e.unique_id.endswith("_None")]

    # This year's sensor exists, disabled by default.
    year_id = ent_reg.async_get_entity_id("sensor", "maintenance_supporter", area_cost_unique_id(kitchen.id, "year"))
    assert year_id == f"sensor.{kitchen.id}_maintenance_cost_this_year"
    assert ent_reg.async_get(year_id).disabled_by is er.RegistryEntryDisabler.INTEGRATION


async def test_this_year_resets_on_new_year(hass: HomeAssistant) -> None:
    areas = ar.async_get(hass)
    garden = areas.async_create("Garden")
    mower = _object(hass, "mower", garden.id, [_completed(1, 40.0), _completed(800, 60.0)])
    await _setup(hass, mower)
    ent_reg = er.async_get(hass)
    year_id = f"sensor.{garden.id}_maintenance_cost_this_year"
    ent_reg.async_update_entity(year_id, disabled_by=None)
    await hass.config_entries.async_reload(next(e for e in hass.config_entries.async_entries("maintenance_supporter") if e.unique_id == GLOBAL_UNIQUE_ID).entry_id)
    await hass.async_block_till_done()

    state = hass.states.get(year_id)
    assert state is not None
    this_year_entry = dt_util.now() - timedelta(days=1)
    expected = 40.0 if this_year_entry.year == dt_util.now().year else 0.0
    assert float(state.state) == expected
    assert state.attributes["last_reset"].startswith(f"{dt_util.now().year}-01-01")
    assert _value(hass, f"sensor.{garden.id}_maintenance_cost") == 100.0


async def test_the_sensor_lands_in_its_area_once(hass: HomeAssistant) -> None:
    """Placed in the area when created — a user who moves it keeps the move."""
    areas = ar.async_get(hass)
    bath = areas.async_create("Bathroom")
    hall = areas.async_create("Hall")
    boiler = _object(hass, "boiler", bath.id, [_completed(2, 80.0)])
    glob = await _setup(hass, boiler)
    ent_reg = er.async_get(hass)
    entity_id = f"sensor.{bath.id}_maintenance_cost"
    assert ent_reg.async_get(entity_id).area_id == bath.id

    ent_reg.async_update_entity(entity_id, area_id=hall.id)
    await hass.config_entries.async_reload(glob.entry_id)
    await hass.async_block_till_done()
    assert ent_reg.async_get(entity_id).area_id == hall.id


async def test_a_new_area_and_a_rename_follow_live(hass: HomeAssistant) -> None:
    areas = ar.async_get(hass)
    office = areas.async_create("Office")
    printer = _object(hass, "printer", None, [_completed(4, 25.0)])
    await _setup(hass, printer)
    assert hass.states.get(f"sensor.{office.id}_maintenance_cost") is None

    # The object moves into the office: a sensor appears on the next refresh.
    data = dict(printer.data)
    data[CONF_OBJECT] = {**data[CONF_OBJECT], "area_id": office.id}
    hass.config_entries.async_update_entry(printer, data=data)
    await hass.config_entries.async_reload(printer.entry_id)
    await hass.async_block_till_done()
    assert _value(hass, f"sensor.{office.id}_maintenance_cost") == 25.0

    areas.async_update(office.id, name="Study")
    await hass.async_block_till_done()
    assert hass.states.get(f"sensor.{office.id}_maintenance_cost").attributes["friendly_name"] == "Study maintenance cost"


async def test_a_completion_updates_the_area(hass: HomeAssistant) -> None:
    areas = ar.async_get(hass)
    garage = areas.async_create("Garage")
    car = _object(hass, "car", garage.id, [_completed(30, 100.0)])
    await _setup(hass, car)
    coordinator = car.runtime_data.coordinator
    task_id = next(iter(car.data[CONF_TASKS]))

    await coordinator.complete_maintenance(task_id, cost=45.5)
    await hass.async_block_till_done()

    assert _value(hass, f"sensor.{garage.id}_maintenance_cost") == 145.5


async def test_sensors_of_a_deleted_area_without_objects_are_removed(hass: HomeAssistant) -> None:
    glob = make_global_entry(hass)
    ent_reg = er.async_get(hass)
    orphan = ent_reg.async_get_or_create(
        "sensor",
        "maintenance_supporter",
        area_cost_unique_id("attic", "total"),
        config_entry=glob,
        suggested_object_id="attic_maintenance_cost",
    )
    await setup_integration(hass, glob)
    await hass.async_block_till_done()
    assert ent_reg.async_get(orphan.entity_id) is None


async def test_unavailable_until_every_object_was_read(hass: HomeAssistant) -> None:
    """A sum that dropped to zero while objects load would be recorded as a
    negative cost and a positive one right after it."""
    areas = ar.async_get(hass)
    lab = areas.async_create("Lab")
    loaded = _object(hass, "scope", lab.id, [_completed(2, 10.0)])
    glob = make_global_entry(hass)
    await setup_integration(hass, glob, loaded)
    # Added after the integration came up: it waits, NOT_LOADED.
    waiting = _object(hass, "centrifuge", lab.id, [_completed(2, 20.0)])
    assert waiting.state is ConfigEntryState.NOT_LOADED

    added: list[Any] = []
    manager = AreaCostSensorManager(hass, glob.entry_id, lambda entities, *_a: added.extend(entities))
    manager._refresh()
    assert manager.ready is False
    assert added and all(not sensor.available for sensor in added)

    await hass.config_entries.async_setup(waiting.entry_id)
    await hass.async_block_till_done()
    manager._refresh()
    assert manager.ready is True
    total = next(s for s in added if s.unique_id == area_cost_unique_id(lab.id, "total"))
    assert total.available and total.native_value == 30.0

    # Mid-reload the last known spending stands in — no dip.
    await hass.config_entries.async_unload(loaded.entry_id)
    await hass.async_block_till_done()
    assert entry_cost(hass, loaded) is None
    manager._refresh()
    assert total.native_value == 30.0 and manager.ready
    # A deleted object's spending leaves the area.
    await hass.config_entries.async_remove(loaded.entry_id)
    await hass.async_block_till_done()
    manager._refresh()
    assert total.native_value == 20.0
