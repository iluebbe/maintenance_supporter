"""#218: dispose of used ones of a reusable part, and the part actions as
services.

A cell on the "to charge" pile that is dead had no quick action: the part had
to be edited and its *Used, not ready yet* lowered by hand, so the pile grew
and the reorder threshold never saw the cells were gone. *Dispose* takes them
off the pile without putting them back in stock. Restock, ready again and
dispose existed only as WebSocket commands; automations and dashboard buttons
now have ``part_restock``, ``part_ready_again`` and ``part_dispose``,
addressed by the part's stock sensor.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import ServiceValidationError, Unauthorized
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_capture_events

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, EVENT_PART_STOCK_LOW, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.parts_runtime import PART_REF_FIELD
from custom_components.maintenance_supporter.websocket.parts import ws_part_dispose
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task

from .conftest import (
    TASK_ID_1,
    assert_ws_error,
    assert_ws_success,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

CELLS = "p_cells"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(*, reuse: str | None = "charge", threshold: float | None = None, auto_buy: bool = False) -> MockConfigEntry:
    last = (dt_util.now() - timedelta(days=40)).date().isoformat()
    task = build_task_data(last_performed=last, name="Swap remote batteries")
    task["consumes_parts"] = [{"part_id": CELLS, "quantity": 2}]
    data = build_object_entry_data(object_data=build_object_data(name="TV remote"), tasks={TASK_ID_1: task})
    part: dict[str, Any] = {"id": CELLS, "name": "AAA Eneloop", "unit": "pcs", "auto_buy_task": auto_buy, "reuse": reuse}
    if threshold is not None:
        part["reorder_threshold"] = threshold
    data["parts"] = {CELLS: part}
    return MockConfigEntry(version=1, minor_version=4, domain=DOMAIN, title="TV remote", data=data, source="user", unique_id="ms_dispose_obj")


async def _setup(hass: HomeAssistant, global_entry: MockConfigEntry, obj: MockConfigEntry, stock: float = 4) -> Any:
    """Stock 4, then one swap of two: 2 ready, 2 waiting to be charged."""
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    store = obj.runtime_data.store
    store.set_part_stock(CELLS, stock)
    await store.async_save()
    conn = make_ws_connection()
    await call_ws_handler(ws_complete_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    return store


async def _dispose(hass: HomeAssistant, obj: MockConfigEntry, **extra: Any) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(ws_part_dispose, hass, conn, {"id": 2, "type": "x", "entry_id": obj.entry_id, "part_id": CELLS, **extra})
    return conn


def _part_sensor(hass: HomeAssistant) -> str:
    return next(s.entity_id for s in hass.states.async_all("sensor") if s.attributes.get("part_name") == "AAA Eneloop")


def _counts(store: Any) -> tuple[float, float]:
    return store.get_part_stock(CELLS), store.get_part_restoring(CELLS)


# ─── dispose ────────────────────────────────────────────────────────────────


async def test_dispose_takes_them_off_the_pile_not_back_to_the_stock(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    assert _counts(store) == (2, 2)
    assert assert_ws_success(await _dispose(hass, obj)) == {"disposed": 1, "stock": 2, "restoring": 1}
    assert assert_ws_success(await _dispose(hass, obj, quantity=5)) == {"disposed": 1, "stock": 2, "restoring": 0}
    assert _counts(store) == (2, 0)


async def test_the_threshold_sees_them_gone(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object(threshold=3, auto_buy=True)
    await _setup(hass, global_entry, obj)  # 2 ready + 2 waiting = 4 owned, above 3
    low = async_capture_events(hass, EVENT_PART_STOCK_LOW)
    assert_ws_success(await _dispose(hass, obj, quantity=2))
    await hass.async_block_till_done()
    assert len(low) == 1
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None and any(t.get(PART_REF_FIELD) for t in entry.data[CONF_TASKS].values()), "a buy task"


async def test_dispose_is_only_for_a_counted_reusable_part(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object(reuse=None)
    await _setup(hass, global_entry, obj)
    assert_ws_error(await _dispose(hass, obj), "not_found")
    # An unknown object is refused before anything is looked up.
    assert_ws_error(await _dispose(hass, obj, entry_id="nope"))


# ─── the services ───────────────────────────────────────────────────────────


async def test_the_part_actions_as_services(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    sensor = _part_sensor(hass)

    resp = await hass.services.async_call(DOMAIN, "part_dispose", {"entity_id": sensor}, blocking=True, return_response=True)
    assert resp == {"parts": [{"entity_id": sensor, "disposed": 1, "stock": 2, "restoring": 1}]}
    await hass.services.async_call(DOMAIN, "part_ready_again", {"entity_id": sensor}, blocking=True)
    assert _counts(store) == (3, 0)
    await hass.services.async_call(DOMAIN, "part_restock", {"entity_id": sensor, "delta": 4}, blocking=True)
    assert _counts(store) == (7, 0)
    resp = await hass.services.async_call(DOMAIN, "part_restock", {"entity_id": [sensor], "absolute": 10}, blocking=True, return_response=True)
    assert resp == {"parts": [{"entity_id": sensor, "stock": 10}]}
    await hass.async_block_till_done()
    assert hass.states.get(sensor).state == "10"


async def test_the_services_refuse_what_they_cannot_book(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object(reuse=None)
    await _setup(hass, global_entry, obj)
    sensor = _part_sensor(hass)
    task_sensor = obj.runtime_data.coordinator.task_sensor_entity_id(TASK_ID_1)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_dispose", {"entity_id": [sensor]}, blocking=True)
    assert err.value.translation_key == "part_not_reusable"
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_restock", {"entity_id": [sensor, task_sensor], "delta": 1}, blocking=True)
    assert err.value.translation_key == "no_part_for_entity"
    assert obj.runtime_data.store.get_part_stock(CELLS) == 2, "nothing booked before every target resolved"
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_restock", {"entity_id": sensor}, blocking=True)
    assert err.value.translation_key == "invalid_input"


async def test_the_services_hold_a_calling_user_to_the_write_tier(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    sensor = _part_sensor(hass)
    await hass.auth.async_create_user("Parent", group_ids=["system-admin"])
    kid = await hass.auth.async_create_user("Kid")
    for service, data in (("part_restock", {"delta": 1}), ("part_ready_again", {}), ("part_dispose", {})):
        with pytest.raises(Unauthorized):
            await hass.services.async_call(DOMAIN, service, {"entity_id": sensor, **data}, blocking=True, context=Context(user_id=kid.id))
    assert _counts(store) == (2, 2)
