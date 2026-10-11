"""Reusable parts (#208): a used one is not gone but waits to be ready again.

Rechargeable cells are charged, mower blades sharpened, washable filters
cleaned, desiccant dried, gas bottles refilled. A part marked ``reuse`` books
a use as stock -> "waiting" (the Store's ``restoring`` count) instead of
using it up; *Ready again* moves them back. What is owned (stock + waiting)
is what buying, the reorder threshold and the low/out events read, so cells
that only wait to be charged are never bought again. The battery fleet gives
a swappable rechargeable cell type ("AAA NiMH", "18650") such a part.
"""

from __future__ import annotations

import json
from datetime import timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_capture_events, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    EVENT_PART_STOCK_LOW,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers.battery_lifetime import is_swappable_cell
from custom_components.maintenance_supporter.helpers.parts import PartValidationError, normalize_part, on_hand, part_is_low
from custom_components.maintenance_supporter.parts_runtime import PART_REF_FIELD
from custom_components.maintenance_supporter.websocket.io import ws_import_json
from custom_components.maintenance_supporter.websocket.parts import ws_part_ready_again, ws_update_part
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_complete_task,
    ws_delete_history_entry,
    ws_undo_completion,
)

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


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


CELLS = "p_cells"


def _object(*, reuse: str | None = "charge", threshold: float | None = None, auto_buy: bool = False) -> MockConfigEntry:
    last = (dt_util.now() - timedelta(days=40)).date().isoformat()
    task = build_task_data(last_performed=last, name="Swap remote batteries")
    task["consumes_parts"] = [{"part_id": CELLS, "quantity": 2}]
    data = build_object_entry_data(object_data=build_object_data(name="TV remote"), tasks={TASK_ID_1: task})
    part: dict[str, Any] = {"id": CELLS, "name": "AAA Eneloop", "unit": "pcs", "auto_buy_task": auto_buy, "reuse": reuse}
    if threshold is not None:
        part["reorder_threshold"] = threshold
    data["parts"] = {CELLS: part}
    return MockConfigEntry(version=1, minor_version=4, domain=DOMAIN, title="TV remote", data=data, source="user", unique_id="ms_reuse_obj")


async def _setup(hass: HomeAssistant, global_entry: MockConfigEntry, obj: MockConfigEntry, stock: float = 4) -> Any:
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    store = obj.runtime_data.store
    store.set_part_stock(CELLS, stock)
    await store.async_save()
    return store


async def _complete(hass: HomeAssistant, obj: MockConfigEntry) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(ws_complete_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    return assert_ws_success(conn)


async def _ready_again(hass: HomeAssistant, obj: MockConfigEntry, **extra: Any) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(ws_part_ready_again, hass, conn, {"id": 2, "type": "x", "entry_id": obj.entry_id, "part_id": CELLS, **extra})
    return conn


# ─── the rule ───────────────────────────────────────────────────────────────


def test_reuse_is_one_of_the_kinds() -> None:
    assert normalize_part({"name": "Blades", "reuse": "sharpen"})["reuse"] == "sharpen"
    assert normalize_part({"name": "Filter"})["reuse"] is None
    with pytest.raises(PartValidationError):
        normalize_part({"name": "x", "reuse": "recycle"})


def test_waiting_ones_still_count_as_owned() -> None:
    reusable = {"reuse": "charge", "reorder_threshold": 3}
    used_up = {"reorder_threshold": 3}
    assert on_hand(reusable, 1, 4) == 5 and not part_is_low(reusable, on_hand(reusable, 1, 4))
    assert on_hand(used_up, 1, 4) == 1 and part_is_low(used_up, on_hand(used_up, 1, 4))
    assert on_hand(reusable, None, 4) is None


# ─── a use, and its way back ────────────────────────────────────────────────


async def test_a_use_moves_the_cells_to_the_charging_pile(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj)
    assert (store.get_part_stock(CELLS), store.get_part_restoring(CELLS)) == (2, 2)


async def test_a_used_up_part_has_no_pile(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object(reuse=None)
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj)
    assert (store.get_part_stock(CELLS), store.get_part_restoring(CELLS)) == (2, 0)


async def test_ready_again_moves_them_back(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj)

    assert assert_ws_success(await _ready_again(hass, obj, quantity=1)) == {"moved": 1, "stock": 3, "restoring": 1}
    assert assert_ws_success(await _ready_again(hass, obj, quantity=9)) == {"moved": 1, "stock": 4, "restoring": 0}
    assert (store.get_part_stock(CELLS), store.get_part_restoring(CELLS)) == (4, 0)


async def test_ready_again_is_only_for_a_counted_reusable_part(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object(reuse=None)
    await _setup(hass, global_entry, obj)
    assert_ws_error(await _ready_again(hass, obj), "not_found")


async def test_undo_and_deleting_the_completion_take_the_use_back(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)

    assert (await _complete(hass, obj))["undo"] is True
    conn = make_ws_connection()
    await call_ws_handler(ws_undo_completion, hass, conn, {"id": 3, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert_ws_success(conn)
    assert (store.get_part_stock(CELLS), store.get_part_restoring(CELLS)) == (4, 0)

    await _complete(hass, obj)
    done = next(h for h in store.get_history(TASK_ID_1) if h.get("type") == HistoryEntryType.COMPLETED)
    conn = make_ws_connection()
    await call_ws_handler(ws_delete_history_entry, hass, conn, {"id": 4, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "timestamp": done["timestamp"]})
    assert assert_ws_success(conn)["parts_returned"] is True
    assert (store.get_part_stock(CELLS), store.get_part_restoring(CELLS)) == (4, 0)


# ─── buying reads what is owned ─────────────────────────────────────────────


async def test_charging_cells_are_not_bought_again(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object(threshold=3, auto_buy=True)
    store = await _setup(hass, global_entry, obj)
    low_events = async_capture_events(hass, EVENT_PART_STOCK_LOW)

    await _complete(hass, obj)  # 2 ready + 2 waiting = 4 owned, above 3
    await hass.async_block_till_done()
    assert low_events == []
    assert not any(t.get(PART_REF_FIELD) for t in obj.data[CONF_TASKS].values())

    # Two cells died: thrown away, the pile set to 0 — now 2 owned, low.
    conn = make_ws_connection()
    await call_ws_handler(ws_update_part, hass, conn, {"id": 5, "type": "x", "entry_id": obj.entry_id, "part_id": CELLS, "name": "AAA Eneloop", "restoring": 0})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    assert store.get_part_restoring(CELLS) == 0
    assert len(low_events) == 1
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None and any(t.get(PART_REF_FIELD) for t in entry.data[CONF_TASKS].values())


async def test_turning_reuse_off_drops_the_pile(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj)
    conn = make_ws_connection()
    await call_ws_handler(ws_update_part, hass, conn, {"id": 6, "type": "x", "entry_id": obj.entry_id, "part_id": CELLS, "name": "AAA Eneloop", "reuse": None})
    assert_ws_success(conn)
    assert store.get_part_restoring(CELLS) == 0


async def test_the_part_sensor_shows_the_pile(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object(threshold=3)
    await _setup(hass, global_entry, obj)
    await _complete(hass, obj)
    await hass.async_block_till_done()
    state = next(s for s in hass.states.async_all("sensor") if s.attributes.get("part_name") == "AAA Eneloop")
    assert state.state == "2"
    assert state.attributes["reuse"] == "charge" and state.attributes["restoring"] == 2
    assert state.attributes["is_low"] is False  # 4 owned


# ─── the pile survives a move ───────────────────────────────────────────────


async def test_export_and_import_keep_the_pile(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    await _setup(hass, global_entry, obj)
    await _complete(hass, obj)

    payload = json.loads(json.dumps(build_export_data(hass)))
    exported = payload["objects"][0]["parts"][0]
    assert (exported["stock"], exported["restoring"], exported["reuse"]) == (2, 2, "charge")
    payload["objects"][0]["object"]["name"] = "TV remote copy"
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 7, "type": "x", "json_content": json.dumps(payload)})
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()

    copy = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.title == "TV remote copy")
    (pid,) = copy.data["parts"]
    assert copy.data["parts"][pid]["reuse"] == "charge"
    assert (copy.runtime_data.store.get_part_stock(pid), copy.runtime_data.store.get_part_restoring(pid)) == (2, 2)


# ─── the battery fleet: rechargeable cells ──────────────────────────────────


def test_a_swappable_cell_is_told_from_a_built_in_pack() -> None:
    for cell in ("AAA NiMH", "AA Eneloop", "18650", "9V NiMH", "2x AA Akku", "Li-ion 18650"):
        assert is_swappable_cell(cell), cell
    for pack in ("Rechargeable", "Nuki Battery Pack", "Li-ion", "Built-in", "AA", "CR2032"):
        assert not is_swappable_cell(pack), pack


def _battery(hass: HomeAssistant, name: str, btype: str, qty: int) -> None:
    hass.states.async_set(
        f"sensor.{name}_battery_plus", "8",
        {"device_class": "battery", "battery_type": btype, "battery_quantity": qty, "battery_low": True, "device_name": name},
    )
    hass.states.async_set(f"button.{name}_battery_replaced", "unknown")


async def test_the_fleet_charges_rechargeable_cells(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_entry
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_overview,
        ws_battery_fleet_setup,
    )

    await setup_integration(hass, global_entry)
    _battery(hass, "remote", "AAA NiMH", 2)
    _battery(hass, "lock", "AA", 4)
    _battery(hass, "vacuum", "Rechargeable", 1)

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = find_fleet_entry(hass)
    assert fleet is not None
    parts = fleet.data["parts"]
    cell = parts["batt_aaa nimh"]
    assert cell["reuse"] == "charge" and cell.get("reorder_threshold") is None and not cell["auto_buy_task"]
    assert "batt_rechargeable" not in parts, "a pack built into a device gets no part"
    store = fleet.runtime_data.store
    assert store.get_part_stock("batt_aaa nimh") is None, "untracked until someone counts the charged ones"
    assert store.get_part_stock("batt_aa") == 0

    calls = async_mock_service(hass, "button", "press")
    # Untracked: a swap consumes nothing and grows no pile.
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_mark_replaced, hass, conn, {"id": 2, "type": "x", "entity_ids": ["sensor.remote_battery_plus"]})
    assert conn.send_result.call_args[0][1]["consumed"] == {}
    assert store.get_part_restoring("batt_aaa nimh") == 0

    # Counted: four charged cells; a swap takes two, two wait to be charged.
    await async_change_part_stock(hass, fleet, "batt_aaa nimh", absolute=4)
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_mark_replaced, hass, conn, {"id": 3, "type": "x", "entity_ids": ["sensor.remote_battery_plus"]})
    assert conn.send_result.call_args[0][1]["consumed"] == {"batt_aaa nimh": 2}
    assert (store.get_part_stock("batt_aaa nimh"), store.get_part_restoring("batt_aaa nimh")) == (2, 2)
    assert len(calls) == 2

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn, {"id": 4, "type": "x"})
    ov = conn.send_result.call_args[0][1]
    assert ov["charging"] == [{"part_id": "batt_aaa nimh", "name": cell["name"], "reuse": "charge", "stock": 2, "restoring": 2}]
    assert "AAA NIMH" not in ov["needs_now"], "a rechargeable is charged, not bought"
