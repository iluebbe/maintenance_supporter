"""#226: use some of a spare part outside a task.

A jug of washer fluid on the garage shelf is used for the oil change, and
in between when a car just needs some. The oil change books it through the
task's parts; the top-up in between had no action of its own: a task made up
for it, or the stock lowered by hand with *Adjust stock*. ``part/use`` (and
the ``part_use`` service) takes it off the stock like a completion's parts:
a reusable part's used ones wait to be ready again, the reorder threshold,
its events and the buy reminder follow, and nothing is valued, as there is
no completion to book a price on.
"""

from __future__ import annotations

from typing import Any

import pytest
import voluptuous as vol
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import ServiceValidationError, Unauthorized
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_capture_events

from custom_components.maintenance_supporter.const import (
    CONF_PARTS,
    CONF_PARTS_COST_MODE,
    CONF_TASKS,
    DOMAIN,
    EVENT_PART_STOCK_LOW,
    EVENT_PART_STOCK_OUT,
)
from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD, normalize_part
from custom_components.maintenance_supporter.websocket.parts import ws_part_use

from .conftest import (
    TASK_ID_1,
    assert_ws_error,
    assert_ws_success,
    build_object_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

FLUID = "fluid"
CELLS = "cells"
FILTER = "filter"


async def _shelf(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    """Garage shelf: washer fluid in 5 l jugs (counted in l), rechargeable
    cells, a filter nobody counts; the household counts parts when used."""
    g = make_global_entry(hass, options={CONF_PARTS_COST_MODE: "use", **options})
    parts = {
        FLUID: {"id": FLUID, "name": "Washer fluid", "unit": "l", "package_size": 5, "cost": 10,
                "reorder_threshold": 5, "auto_buy_task": True},
        CELLS: {"id": CELLS, "name": "AA Eneloop", "unit": "pcs", "reuse": "charge", "cost": 3},
        FILTER: {"id": FILTER, "name": "Cabin filter"},
    }
    task = build_task_data(task_id=TASK_ID_1, name="Oil change", last_performed="2026-01-01")
    task["consumes_parts"] = [{"part_id": FLUID, "quantity": 1}]
    entry = make_object_entry(
        hass,
        tasks={TASK_ID_1: task},
        name="Garage shelf",
        uid="garage_shelf",
        object_data=build_object_data(name="Garage shelf", object_id="garage_shelf"),
        extra_data={CONF_PARTS: {pid: normalize_part(p) for pid, p in parts.items()}},
    )
    await setup_integration(hass, g, entry)
    store = entry.runtime_data.store
    store.set_part_stock(FLUID, 12)
    store.set_part_stock(CELLS, 4)
    await store.async_save()
    return entry


async def _use(hass: HomeAssistant, entry: MockConfigEntry, part_id: str, **extra: Any) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(ws_part_use, hass, conn, {"id": 1, "type": "x", "entry_id": entry.entry_id, "part_id": part_id, **extra})
    return conn


def _sensor(hass: HomeAssistant, entry: MockConfigEntry, part_id: str) -> str:
    """The part's stock sensor (an uncounted part's reads unavailable, without attributes)."""
    reg = er.async_get(hass)
    return next(e.entity_id for e in er.async_entries_for_config_entry(reg, entry.entry_id) if e.unique_id.endswith(f"_part_{part_id}"))


# ─── part/use ───────────────────────────────────────────────────────────────


async def test_a_use_takes_it_off_the_stock(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    assert assert_ws_success(await _use(hass, entry, FLUID, quantity=1.5)) == {"stock": 10.5, "restoring": 0}
    assert entry.runtime_data.store.get_part_stock(FLUID) == 10.5
    # One when left out.
    assert assert_ws_success(await _use(hass, entry, FLUID)) == {"stock": 9.5, "restoring": 0}
    # More than is there empties it; the stock never goes below zero.
    assert assert_ws_success(await _use(hass, entry, FLUID, quantity=40)) == {"stock": 0, "restoring": 0}


async def test_a_reusable_part_goes_on_the_pile(hass: HomeAssistant) -> None:
    """Like a completion's parts: the used cells wait to be charged and
    still count as owned."""
    entry = await _shelf(hass)
    assert assert_ws_success(await _use(hass, entry, CELLS, quantity=2)) == {"stock": 2, "restoring": 2}


async def test_the_threshold_its_events_and_the_buy_reminder_follow(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    low = async_capture_events(hass, EVENT_PART_STOCK_LOW)
    out = async_capture_events(hass, EVENT_PART_STOCK_OUT)
    assert_ws_success(await _use(hass, entry, FLUID, quantity=7))  # 12 -> 5, at the threshold
    await hass.async_block_till_done()
    assert len(low) == 1 and low[0].data["part_id"] == FLUID
    current = hass.config_entries.async_get_entry(entry.entry_id)
    assert current is not None
    assert any((t.get(PART_REF_FIELD) or {}).get("part_id") == FLUID for t in current.data[CONF_TASKS].values()), "a buy reminder"
    assert_ws_success(await _use(hass, entry, FLUID, quantity=5))
    await hass.async_block_till_done()
    assert len(out) == 1


async def test_nothing_is_booked(hass: HomeAssistant) -> None:
    """There is no completion to value it on: no history entry, no cost,
    even where parts count when used."""
    entry = await _shelf(hass)
    before = list(get_task_store_state(hass, entry.entry_id, TASK_ID_1).get("history") or [])
    assert_ws_success(await _use(hass, entry, FLUID, quantity=2))
    await hass.async_block_till_done()
    assert list(get_task_store_state(hass, entry.entry_id, TASK_ID_1).get("history") or []) == before


async def test_only_a_counted_part(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    assert_ws_error(await _use(hass, entry, FILTER), "not_found")
    assert entry.runtime_data.store.get_part_stock(FILTER) is None, "an uncounted part stays uncounted"
    assert_ws_error(await _use(hass, entry, "nope"), "not_found")
    assert_ws_error(await _use(hass, entry, FLUID, entry_id="nope"))


def test_the_schema_wants_a_positive_quantity() -> None:
    base = {"id": 1, "type": "maintenance_supporter/part/use", "entry_id": "e", "part_id": "p"}
    ws_part_use._ws_schema({**base, "quantity": 0.5})  # type: ignore[attr-defined]
    ws_part_use._ws_schema(base)  # type: ignore[attr-defined]
    for bad in (0, -1, "x"):
        with pytest.raises(vol.Invalid):
            ws_part_use._ws_schema({**base, "quantity": bad})  # type: ignore[attr-defined]


# ─── the service ────────────────────────────────────────────────────────────


async def test_the_service(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    fluid, cells = _sensor(hass, entry, FLUID), _sensor(hass, entry, CELLS)
    resp = await hass.services.async_call(DOMAIN, "part_use", {"entity_id": [fluid, cells]}, blocking=True, return_response=True)
    assert resp == {"parts": [{"entity_id": fluid, "stock": 11, "restoring": 0}, {"entity_id": cells, "stock": 3, "restoring": 1}]}
    await hass.services.async_call(DOMAIN, "part_use", {"entity_id": fluid, "quantity": 2.5}, blocking=True)
    assert entry.runtime_data.store.get_part_stock(FLUID) == 8.5
    await hass.async_block_till_done()
    assert hass.states.get(fluid).state == "8.5"


async def test_the_service_refuses_before_it_books_anything(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    fluid, cabin = _sensor(hass, entry, FLUID), _sensor(hass, entry, FILTER)
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_use", {"entity_id": [fluid, cabin]}, blocking=True)
    assert err.value.translation_key == "part_not_counted"
    assert entry.runtime_data.store.get_part_stock(FLUID) == 12, "nothing booked before every target could be"
    task_sensor = entry.runtime_data.coordinator.task_sensor_entity_id(TASK_ID_1)
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_use", {"entity_id": [fluid, task_sensor]}, blocking=True)
    assert err.value.translation_key == "no_part_for_entity"
    with pytest.raises(vol.Invalid):
        await hass.services.async_call(DOMAIN, "part_use", {"entity_id": fluid, "quantity": 0}, blocking=True)
    assert entry.runtime_data.store.get_part_stock(FLUID) == 12


async def test_the_service_holds_a_calling_user_to_the_write_tier(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    fluid = _sensor(hass, entry, FLUID)
    await hass.auth.async_create_user("Parent", group_ids=["system-admin"])
    kid = await hass.auth.async_create_user("Kid")
    with pytest.raises(Unauthorized):
        await hass.services.async_call(DOMAIN, "part_use", {"entity_id": fluid}, blocking=True, context=Context(user_id=kid.id))
    assert entry.runtime_data.store.get_part_stock(FLUID) == 12
