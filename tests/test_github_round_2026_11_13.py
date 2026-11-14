"""GitHub round 2026-11-13: #266, D#267, D#253, D#264, #265, #262 (+D#256), #261, #255.

Pins, per item:

- #266: a weekdays task carries its coming dates from the schedule engine in
  the task summary; an interval task carries none (the frontend steps it)
- D#267: a battery row knows its area (the entity's, else the device's) and
  a line of text puts it in front of a device name that does not say it
- D#253: the history exports as CSV, one row per entry, narrowed by a date
  range, with people's names and formula cells defused
- D#264: the complete action books a backfilled completion's linked parts
  when asked to, and leaves them alone when not
- #265: a part can be ordered by e-mail: ``mailto:`` (or a bare address) is
  accepted, a script link is not, and the link carries what to order
- #262: a part moves to another object with its stock; the old owner's
  tasks borrow it, the new owner's own it, a third object follows; the
  battery fleet and an archived target refuse
- D#256: the delete preview names the parts that move and their heir
- #255: a rule's hold may last thirty days and survives a restart; the
  done-when wait stays a day at most
- #261: an ordered part is on order, its reminder waits for the delivery
  day, the receipt books the stock and closes the order, a cancel undoes it
"""

from __future__ import annotations

import csv
import io
from datetime import date, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.maintenance_supporter.const import (
    BATTERY_FLEET_OBJECT_FLAG,
    COMPLETE_WHEN_FOR_MINUTES_RANGE,
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASK_CONSUMES_PARTS,
    CONF_TASKS,
    DOMAIN,
    STORES_CACHE_KEY,
    TRIGGER_FIELD_RANGES,
)
from custom_components.maintenance_supporter.entity.triggers.threshold import ThresholdTrigger
from custom_components.maintenance_supporter.helpers.battery_fleet import battery_area_name, battery_label
from custom_components.maintenance_supporter.helpers.csv_handler import export_history_csv
from custom_components.maintenance_supporter.helpers.parts import (
    PART_REF_FIELD,
    PartValidationError,
    normalize_part,
    order_mail_url,
    resolve_shopping_url,
)
from custom_components.maintenance_supporter.helpers.sanitize import sanitize_complete_when
from custom_components.maintenance_supporter.helpers.schedule import upcoming_occurrences
from custom_components.maintenance_supporter.helpers.shared_parts import PartMoveError, async_move_part, pool_handover
from custom_components.maintenance_supporter.parts_runtime import (
    async_change_part_stock,
    async_part_order,
    async_part_order_cancel,
    open_buy_task_id,
)
from custom_components.maintenance_supporter.websocket import _build_task_summary
from custom_components.maintenance_supporter.websocket.io import ws_export_history_csv
from custom_components.maintenance_supporter.websocket.objects import ws_delete_object_preview
from custom_components.maintenance_supporter.websocket.parts import ws_move_part, ws_part_order, ws_part_order_cancel
from custom_components.maintenance_supporter.websocket.tasks import _validate_trigger_config

from .conftest import (
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

TASK = "task_1"
OIL = "part_oil"


def _live(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id)


def _store(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.data[STORES_CACHE_KEY][entry.entry_id]


def _object(
    hass: HomeAssistant,
    name: str,
    *,
    parts: dict[str, Any] | None = None,
    consumes: list[dict[str, Any]] | None = None,
    history: list[dict[str, Any]] | None = None,
    last_performed: str | None = "2020-01-01",
    object_extra: dict[str, Any] | None = None,
    created_at: str = "2026-01-01",
) -> MockConfigEntry:
    slug = name.lower().replace(" ", "_")
    obj = build_object_data(name=name, object_id=slug)
    obj["created_at"] = created_at
    obj.update(object_extra or {})
    task = build_task_data(interval_days=30, last_performed=last_performed, history=history)
    task["name"] = f"Service {name}"
    if consumes is not None:
        task[CONF_TASK_CONSUMES_PARTS] = consumes
    return make_object_entry(
        hass,
        tasks={TASK: task},
        name=name,
        uid=slug,
        object_data=obj,
        minor_version=4,
        extra_data={CONF_PARTS: {pid: normalize_part(p) for pid, p in parts.items()}} if parts else None,
    )


def _oil(**extra: Any) -> dict[str, Any]:
    return {"id": OIL, "name": "Engine oil", "unit": "l", "cost": 9, "reorder_threshold": 2, "restock_quantity": 5, **extra}


# ─── #266: coming dates of a calendar-kind schedule ──────────────────────


def test_a_weekdays_task_brings_its_coming_dates() -> None:
    today = date(2026, 11, 12)  # a Thursday
    task = {"schedule": {"kind": "weekdays", "weekdays": [0, 2, 4]}, "created_at": "2026-11-01"}
    dates = [date.fromisoformat(d) for d in upcoming_occurrences(task, today=today)]
    assert len(dates) == 5
    assert all(d.weekday() in (0, 2, 4) for d in dates)
    assert dates == sorted(set(dates)), "the dates must advance"
    assert dates[0] >= today


def test_an_interval_task_brings_no_coming_dates() -> None:
    """The frontend steps a flat interval itself; a manual task has no series."""
    today = date(2026, 11, 12)
    assert upcoming_occurrences({"schedule": {"kind": "interval", "every": 7, "unit": "days"}}, today=today) == []
    assert upcoming_occurrences({"schedule": {"kind": "manual"}}, today=today) == []


async def test_the_task_summary_carries_the_coming_dates(hass: HomeAssistant) -> None:
    task = {"id": "t", "name": "Water plants", "schedule": {"kind": "weekdays", "weekdays": [0, 3]}}
    summary = _build_task_summary(hass, "t", task, None)
    assert len(summary["upcoming_dates"]) == 5
    interval = {"id": "i", "name": "Filter", "schedule": {"kind": "interval", "every": 7, "unit": "days"}}
    assert _build_task_summary(hass, "i", interval, None)["upcoming_dates"] == []


# ─── D#267: the area of a battery row ────────────────────────────────────


async def test_a_battery_row_knows_its_area(hass: HomeAssistant) -> None:
    owner = MockConfigEntry(domain="test_batt")
    owner.add_to_hass(hass)
    living = ar.async_get(hass).async_create("Living room")
    office = ar.async_get(hass).async_create("Office")
    device = dr.async_get(hass).async_get_or_create(config_entry_id=owner.entry_id, identifiers={("test_batt", "valve1")}, name="Radiator valve")
    dr.async_get(hass).async_update_device(device.id, area_id=living.id)
    ent_reg = er.async_get(hass)
    by_device = ent_reg.async_get_or_create("sensor", "test_batt", "valve1_battery", device_id=device.id, config_entry=owner)
    assert battery_area_name(hass, by_device.entity_id) == "Living room"
    # The entity's own area wins over its device's (Home Assistant gives one
    # only to an entity with a name of its own).
    ent_reg.async_update_entity(by_device.entity_id, name="Spare valve battery", area_id=office.id)
    assert battery_area_name(hass, by_device.entity_id) == "Office"
    assert battery_area_name(hass, "sensor.not_registered") == ""


def test_a_battery_line_puts_the_area_in_front() -> None:
    assert battery_label({"device_name": "Radiator valve", "area_name": "Office"}) == "Office Radiator valve"
    # A name that already says the room is not doubled.
    assert battery_label({"device_name": "Office radiator valve", "area_name": "Office"}) == "Office radiator valve"
    assert battery_label({"device_name": "Radiator valve", "area_name": ""}) == "Radiator valve"
    assert battery_label({"device_name": "Radiator valve"}) == "Radiator valve"


# ─── D#253: history as CSV ───────────────────────────────────────────────


_HISTORY = [
    {"timestamp": "2026-03-10T09:30:00+00:00", "type": "completed", "ref_no": 7, "completed_by": "user-anna", "cost": 12.5,
     "parts_cost": 49, "duration": 30, "reading_value": 214570, "feedback": "ok", "notes": "=SUM(A1) low on oil"},
    {"timestamp": "2026-06-01T08:00:00+00:00", "type": "skipped", "notes": "away"},
    {"timestamp": "2026-09-15T10:00:00+00:00", "type": "completed", "cost": 20,
     "reading_values": [{"id": "km", "name": "Odometer", "unit": "km", "value": 220000}]},
]


def _rows(text: str) -> list[dict[str, str]]:
    return list(csv.DictReader(io.StringIO(text)))


async def test_the_history_exports_one_row_per_entry(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, minor_version=4)
    car = _object(hass, "Car", history=_HISTORY, last_performed="2026-09-15")
    await setup_integration(hass, g, car)

    rows = _rows(export_history_csv(hass, user_names={"user-anna": "Anna"}))
    assert [r["type"] for r in rows] == ["completed", "skipped", "completed"]
    first = rows[0]
    assert first["object"] == "Car" and first["task"] == "Service Car"
    assert first["completed_by"] == "Anna"
    assert first["ref_no"] == "7" and first["cost"] == "12.5" and first["parts_cost"] == "49" and first["duration"] == "30"
    assert first["reading"] == "214570"
    assert first["timestamp"] == dt_util.as_local(dt_util.parse_datetime("2026-03-10T09:30:00+00:00")).strftime("%Y-%m-%d %H:%M")
    # A cell a spreadsheet would run is defused.
    assert first["notes"].startswith("\t=SUM")
    assert rows[2]["reading"] == "Odometer: 220000 km"
    # An unknown user id stays as it is.
    assert _rows(export_history_csv(hass))[0]["completed_by"] == "user-anna"


async def test_the_history_export_takes_a_date_range_and_a_selection(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, minor_version=4)
    car = _object(hass, "Car", history=_HISTORY, last_performed="2026-09-15")
    bike = _object(hass, "Bike", history=[{"timestamp": "2026-07-01T10:00:00+00:00", "type": "completed"}], last_performed="2026-07-01")
    await setup_integration(hass, g, car, bike)

    ranged = _rows(export_history_csv(hass, date_from=date(2026, 5, 1), date_to=date(2026, 8, 1)))
    assert sorted((r["object"], r["type"]) for r in ranged) == [("Bike", "completed"), ("Car", "skipped")]
    assert {r["object"] for r in _rows(export_history_csv(hass, {bike.entry_id}))} == {"Bike"}

    conn = make_ws_connection()
    await call_ws_handler(ws_export_history_csv, hass, conn, {"id": 1, "type": "x", "entry_ids": [car.entry_id], "date_from": "2026-09-01"})
    assert [r["type"] for r in _rows(assert_ws_success(conn)["csv"])] == ["completed"]

    bad = make_ws_connection()
    await call_ws_handler(ws_export_history_csv, hass, bad, {"id": 1, "type": "x", "date_to": "next week"})
    assert_ws_error(bad, "invalid_date")


async def test_the_export_action_writes_the_history_file(hass: HomeAssistant, tmp_path: Any) -> None:
    g = make_global_entry(hass, minor_version=4)
    car = _object(hass, "Car", history=_HISTORY, last_performed="2026-09-15")
    await setup_integration(hass, g, car)
    hass.config.config_dir = str(tmp_path)
    events: list[Any] = []
    hass.bus.async_listen(f"{DOMAIN}_export_completed", events.append)

    await hass.services.async_call(DOMAIN, "export_data", {"format": "history_csv"}, blocking=True)
    await hass.async_block_till_done()

    written = tmp_path / "maintenance_history.csv"
    assert written.exists()
    assert len(_rows(written.read_text(encoding="utf-8"))) == 3
    assert events and events[0].data["format"] == "history_csv"


# ─── D#264: the complete action and a backfill's parts ───────────────────


def _sensor_id(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    ent_reg = er.async_get(hass)
    return next(
        e.entity_id
        for e in er.async_entries_for_config_entry(ent_reg, entry.entry_id)
        if e.domain == "sensor" and "_part_" not in (e.unique_id or "")
    )


@pytest.mark.parametrize(("consume", "left"), [(True, 8.0), (False, 10.0), (None, 10.0)])
async def test_a_backfilled_completion_books_its_parts_only_when_asked(hass: HomeAssistant, consume: bool | None, left: float) -> None:
    g = make_global_entry(hass, minor_version=4)
    car = _object(hass, "Car", parts={OIL: _oil(reorder_threshold=None)}, consumes=[{"part_id": OIL, "quantity": 2}], last_performed="2026-06-01")
    await setup_integration(hass, g, car)
    await async_change_part_stock(hass, _live(hass, car), OIL, absolute=10)
    await hass.async_block_till_done()

    data: dict[str, Any] = {"entity_id": _sensor_id(hass, car), "completed_at": "2025-04-03T12:00:00"}
    if consume is not None:
        data["consume_parts"] = consume
    await hass.services.async_call(DOMAIN, "complete", data, blocking=True)
    await hass.async_block_till_done()

    assert _live(hass, car).runtime_data.store.get_part_stock(OIL) == left
    entry = get_task_store_state(hass, car.entry_id, TASK)["history"][0]
    assert bool(entry.get("used_parts")) is bool(consume)


# ─── #265: a part ordered by e-mail ──────────────────────────────────────


def test_a_part_may_be_ordered_by_mail() -> None:
    assert normalize_part({"name": "Seal", "product_url": "mailto:orders@supplier.example"})["product_url"] == "mailto:orders@supplier.example"
    # A bare address is meant as one to write to.
    assert normalize_part({"name": "Seal", "product_url": "orders@supplier.example"})["product_url"] == "mailto:orders@supplier.example"
    assert normalize_part({"name": "Seal", "product_url": "https://shop.example/seal"})["product_url"] == "https://shop.example/seal"
    for bad in ("javascript:alert(1)", "mailto:", "mailto:nobody", "ftp://shop.example/seal", "data:text/html,x"):
        with pytest.raises(PartValidationError):
            normalize_part({"name": "Seal", "product_url": bad})


def test_the_order_mail_says_what_to_order() -> None:
    part = normalize_part({"name": "Shaft seal 30 mm", "product_url": "mailto:orders@supplier.example", "vendor": "Acme", "mpn": "SS-30", "restock_quantity": 4})
    url = order_mail_url(part)
    assert url is not None and url.startswith("mailto:orders@supplier.example?subject=Shaft%20seal%2030%20mm&body=")
    assert "SS-30" in url and "Acme" in url and "4" in url
    assert " " not in url and "\n" not in url
    assert resolve_shopping_url(part, None, "en") == url
    # The user's own subject stays the user's.
    own = normalize_part({"name": "Seal", "product_url": "mailto:orders@supplier.example?subject=Order"})
    assert order_mail_url(own) == "mailto:orders@supplier.example?subject=Order"
    assert order_mail_url(normalize_part({"name": "Seal", "product_url": "https://shop.example/seal"})) is None


# ─── #262: moving a part ─────────────────────────────────────────────────


async def _three(hass: HomeAssistant) -> tuple[MockConfigEntry, MockConfigEntry, MockConfigEntry]:
    """Floors owns the cleaner and uses it; Kitchen and Laundry borrow it."""
    g = make_global_entry(hass, minor_version=4)
    used = [{"timestamp": "2026-05-01T10:00:00+00:00", "type": "completed", "used_parts": [{"part_id": OIL, "quantity": 1, "name": "Engine oil"}]}]
    floors = _object(hass, "Floors", parts={OIL: _oil()}, consumes=[{"part_id": OIL, "quantity": 1}], history=used, last_performed="2026-05-01")
    kitchen = _object(hass, "Kitchen", consumes=[{"entry_id": floors.entry_id, "part_id": OIL, "quantity": 2}], created_at="2026-02-01")
    laundry = _object(hass, "Laundry", consumes=[{"entry_id": floors.entry_id, "part_id": OIL, "quantity": 3}], created_at="2026-03-01")
    await setup_integration(hass, g, floors, kitchen, laundry)
    await async_change_part_stock(hass, _live(hass, floors), OIL, absolute=7)
    await hass.async_block_till_done()
    return floors, kitchen, laundry


def _link(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    return dict(_live(hass, entry).data[CONF_TASKS][TASK][CONF_TASK_CONSUMES_PARTS][0])


async def test_a_part_moves_with_its_stock_links_and_history(hass: HomeAssistant) -> None:
    floors, kitchen, laundry = await _three(hass)
    before = [e.entity_id for e in er.async_entries_for_config_entry(er.async_get(hass), floors.entry_id) if (e.unique_id or "").endswith(f"_part_{OIL}")]
    assert len(before) == 1

    conn = make_ws_connection()
    await call_ws_handler(ws_move_part, hass, conn, {"id": 1, "type": "x", "entry_id": floors.entry_id, "part_id": OIL, "target_entry_id": kitchen.entry_id})
    await hass.async_block_till_done()
    result = assert_ws_success(conn)
    assert result["entry_id"] == kitchen.entry_id and result["part_id"] == OIL

    assert OIL not in (_live(hass, floors).data.get(CONF_PARTS) or {})
    assert _live(hass, kitchen).data[CONF_PARTS][OIL]["name"] == "Engine oil"
    assert _store(hass, kitchen).get_part_stock(OIL) == 7
    assert _store(hass, floors).get_part_stock(OIL) is None
    # The new owner owns it, the old owner and the third object borrow it.
    assert "entry_id" not in _link(hass, kitchen)
    assert _link(hass, floors) == {"part_id": OIL, "quantity": 1, "entry_id": kitchen.entry_id}
    assert _link(hass, laundry)["entry_id"] == kitchen.entry_id
    # The old owner's history names where its part lives now.
    used = get_task_store_state(hass, floors.entry_id, TASK)["history"][0]["used_parts"][0]
    assert used["entry_id"] == kitchen.entry_id
    # The old owner's stock sensor is the new owner's now.
    ent_reg = er.async_get(hass)
    assert not [e for e in er.async_entries_for_config_entry(ent_reg, floors.entry_id) if (e.unique_id or "").endswith(f"_part_{OIL}")]
    assert [e.entity_id for e in er.async_entries_for_config_entry(ent_reg, kitchen.entry_id) if (e.unique_id or "").endswith(f"_part_{OIL}")] == before


async def test_a_move_is_refused_where_it_makes_no_sense(hass: HomeAssistant) -> None:
    floors, kitchen, _laundry = await _three(hass)
    with pytest.raises(PartMoveError) as same:
        await async_move_part(hass, _live(hass, floors), _live(hass, floors), OIL)
    assert same.value.code == "invalid_target"
    with pytest.raises(PartMoveError) as missing:
        await async_move_part(hass, _live(hass, floors), _live(hass, kitchen), "no_such_part")
    assert missing.value.code == "not_found"

    live = _live(hass, kitchen)
    hass.config_entries.async_update_entry(live, data={**live.data, CONF_OBJECT: {**live.data[CONF_OBJECT], "archived_at": "2026-10-01T00:00:00+00:00"}})
    with pytest.raises(PartMoveError):
        await async_move_part(hass, _live(hass, floors), _live(hass, kitchen), OIL)
    hass.config_entries.async_update_entry(live, data={**live.data, CONF_OBJECT: {**live.data[CONF_OBJECT], "archived_at": None, BATTERY_FLEET_OBJECT_FLAG: True}})
    with pytest.raises(PartMoveError):
        await async_move_part(hass, _live(hass, floors), _live(hass, kitchen), OIL)
    # Nothing moved.
    assert OIL in _live(hass, floors).data[CONF_PARTS]
    assert _store(hass, floors).get_part_stock(OIL) == 7

    conn = make_ws_connection()
    await call_ws_handler(ws_move_part, hass, conn, {"id": 1, "type": "x", "entry_id": floors.entry_id, "part_id": OIL, "target_entry_id": "nope"})
    assert_ws_error(conn, "not_found")


# ─── D#256: the delete preview ───────────────────────────────────────────


async def test_the_delete_preview_names_what_moves_and_where(hass: HomeAssistant) -> None:
    floors, kitchen, laundry = await _three(hass)
    handover = pool_handover(hass, _live(hass, floors))
    assert handover == {"new_owner": "Kitchen", "new_owner_entry_id": kitchen.entry_id, "parts": ["Engine oil"]}
    # An object nobody borrows from hands nothing on.
    assert pool_handover(hass, _live(hass, laundry)) is None

    conn = make_ws_connection()
    await call_ws_handler(ws_delete_object_preview, hass, conn, {"id": 1, "type": "x", "entry_id": floors.entry_id})
    assert assert_ws_success(conn)["parts_handover"]["new_owner"] == "Kitchen"

    # The delete does what the preview said.
    await hass.config_entries.async_remove(floors.entry_id)
    await hass.async_block_till_done()
    assert OIL in _live(hass, kitchen).data[CONF_PARTS]


# ─── #261: ordered now, received later ───────────────────────────────────


async def _garage(hass: HomeAssistant, stock: float = 10) -> MockConfigEntry:
    g = make_global_entry(hass, minor_version=4)
    garage = _object(hass, "Garage", parts={OIL: _oil(auto_buy_task=True)})
    await setup_integration(hass, g, garage)
    await async_change_part_stock(hass, _live(hass, garage), OIL, absolute=stock)
    await hass.async_block_till_done()
    return garage


async def test_an_order_waits_for_the_delivery_day(hass: HomeAssistant) -> None:
    garage = await _garage(hass)
    assert open_buy_task_id(_live(hass, garage), OIL) is None, "not low: no reminder yet"
    due = dt_util.now().date() + timedelta(days=4)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_part_order, hass, conn, {"id": 1, "type": "x", "entry_id": garage.entry_id, "part_id": OIL, "quantity": 2, "expected_date": due.isoformat()}
    )
    await hass.async_block_till_done()
    result = assert_ws_success(conn)
    assert result["on_order"]["quantity"] == 2 and result["on_order"]["expected"] == due.isoformat()

    live = _live(hass, garage)
    store = live.runtime_data.store
    assert store.get_part_order(OIL)["quantity"] == 2
    assert store.get_part_stock(OIL) == 10, "ordered is not on the shelf"
    # The reminder exists although the part is not low, and waits for the day.
    task_id = open_buy_task_id(live, OIL)
    assert task_id is not None and task_id == result["task_id"]
    assert get_task_store_state(hass, garage.entry_id, task_id).get("due_override") == due.isoformat()
    # The reconcile leaves it alone while the order is open.
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks

    await async_reconcile_buy_tasks(hass, live)
    await hass.async_block_till_done()
    assert open_buy_task_id(_live(hass, garage), OIL) == task_id


async def test_the_receipt_books_the_stock_and_closes_the_order(hass: HomeAssistant) -> None:
    garage = await _garage(hass)
    result = await async_part_order(hass, _live(hass, garage), OIL, quantity=2, expected=dt_util.now().date() + timedelta(days=2))
    await hass.async_block_till_done()
    assert result is not None and result["task_id"]

    live = _live(hass, garage)
    await live.runtime_data.coordinator.complete_maintenance(result["task_id"], restock_quantity=2)
    await hass.async_block_till_done()

    store = _live(hass, garage).runtime_data.store
    assert store.get_part_stock(OIL) == 12
    assert store.get_part_order(OIL) is None
    # Done and no longer low: the reminder stays as a plain done task.
    assert open_buy_task_id(_live(hass, garage), OIL) is None
    assert PART_REF_FIELD not in _live(hass, garage).data[CONF_TASKS][result["task_id"]]


async def test_a_restock_is_a_receipt_too(hass: HomeAssistant) -> None:
    garage = await _garage(hass)
    await async_part_order(hass, _live(hass, garage), OIL)
    await hass.async_block_till_done()
    store = _live(hass, garage).runtime_data.store
    assert store.get_part_order(OIL)["quantity"] == 5, "the restock amount when none is given"

    # A correction of the count is not a delivery.
    await async_change_part_stock(hass, _live(hass, garage), OIL, absolute=9)
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is not None
    await async_change_part_stock(hass, _live(hass, garage), OIL, delta=5)
    await hass.async_block_till_done()
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is None
    assert open_buy_task_id(_live(hass, garage), OIL) is None, "the reminder of a part that is not low goes"


async def test_a_cancelled_order_is_due_again_when_low(hass: HomeAssistant) -> None:
    garage = await _garage(hass, stock=1)
    task_id = open_buy_task_id(_live(hass, garage), OIL)
    assert task_id is not None, "low: the reminder is there"
    due = dt_util.now().date() + timedelta(days=3)
    await async_part_order(hass, _live(hass, garage), OIL, expected=due)
    await hass.async_block_till_done()
    assert get_task_store_state(hass, garage.entry_id, task_id).get("due_override") == due.isoformat()

    conn = make_ws_connection()
    await call_ws_handler(ws_part_order_cancel, hass, conn, {"id": 1, "type": "x", "entry_id": garage.entry_id, "part_id": OIL})
    await hass.async_block_till_done()
    assert_ws_success(conn)
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is None
    assert open_buy_task_id(_live(hass, garage), OIL) == task_id, "still low: the reminder stays"
    assert get_task_store_state(hass, garage.entry_id, task_id).get("due_override") is None

    again = make_ws_connection()
    await call_ws_handler(ws_part_order_cancel, hass, again, {"id": 1, "type": "x", "entry_id": garage.entry_id, "part_id": OIL})
    assert_ws_error(again, "not_found")
    assert await async_part_order_cancel(hass, _live(hass, garage), OIL) is False


async def test_an_order_moves_with_its_part(hass: HomeAssistant) -> None:
    floors, kitchen, _laundry = await _three(hass)
    await async_part_order(hass, _live(hass, floors), OIL, quantity=3)
    await hass.async_block_till_done()
    await async_move_part(hass, _live(hass, floors), _live(hass, kitchen), OIL)
    assert _store(hass, kitchen).get_part_order(OIL)["quantity"] == 3


# ─── #255: a hold of days, not only of one day ───────────────────────────


def _frost_rule(**extra: Any) -> dict[str, Any]:
    """Above 3 degrees for 15 days: past the last frost."""
    return {"entity_id": "sensor.outdoor_temp", "attribute": None, "type": "threshold", "trigger_above": 3.0, "trigger_for_minutes": 21600, **extra}


def test_a_hold_may_last_thirty_days(hass: HomeAssistant) -> None:
    assert TRIGGER_FIELD_RANGES["trigger_for_minutes"] == (0, 43200)
    for minutes in (21600, 43200):
        errors, _ = _validate_trigger_config(hass, {"type": "threshold", "entity_id": "sensor.outdoor_temp", "trigger_above": 3, "trigger_for_minutes": minutes})
        assert errors == [], minutes
    errors, _ = _validate_trigger_config(hass, {"type": "threshold", "entity_id": "sensor.outdoor_temp", "trigger_above": 3, "trigger_for_minutes": 43201})
    assert errors == ["trigger_config.trigger_for_minutes must be a whole number between 0 and 43200, got 43201"]


def test_the_done_when_wait_stays_a_day_at_most() -> None:
    """It lives in memory and a restart starts it over: no place for a long hold."""
    rule = {"entity_id": "binary_sensor.door", "to_state": "on"}
    assert COMPLETE_WHEN_FOR_MINUTES_RANGE == (1, 1440)
    assert sanitize_complete_when({**rule, "for_minutes": 21600}) == {**rule, "for_minutes": 1440}


async def test_a_fifteen_day_hold_fires_after_fifteen_days(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.outdoor_temp", "6")
    trigger = ThresholdTrigger(hass, _trigger_entity(hass), _frost_rule())
    trigger._current_value = 6.0
    assert trigger.evaluate(6.0) is False
    assert trigger._for_timer.pending

    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(days=14, hours=23))
    await hass.async_block_till_done()
    assert trigger._triggered is False, "a day early"
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(days=15, minutes=1))
    await hass.async_block_till_done()
    assert trigger._triggered is True


async def test_a_long_hold_survives_a_restart(hass: HomeAssistant) -> None:
    """Fifteen days span more than one update: when the hold began is kept."""
    ten_days = (dt_util.utcnow() - timedelta(days=10)).isoformat()
    waiting = ThresholdTrigger(hass, _trigger_entity(hass), _frost_rule(trigger_threshold_exceeded_since=ten_days))
    assert waiting.evaluate(6.0) is False, "five days to go"
    assert waiting._for_timer.pending
    waiting._for_timer.cancel()

    sixteen_days = (dt_util.utcnow() - timedelta(days=16)).isoformat()
    over = ThresholdTrigger(hass, _trigger_entity(hass), _frost_rule(trigger_threshold_exceeded_since=sixteen_days))
    assert over.evaluate(6.0) is True

    # A frost night in between ends the hold: the next mild day starts over.
    frost = ThresholdTrigger(hass, _trigger_entity(hass), _frost_rule(trigger_threshold_exceeded_since=ten_days))
    assert frost.evaluate(1.0) is False
    assert frost.evaluate(6.0) is False
    assert frost._for_timer.pending and frost._triggered is False
    frost._for_timer.cancel()


def _trigger_entity(hass: HomeAssistant) -> MagicMock:
    entity = MagicMock()
    entity.hass = hass
    entity.entity_id = "sensor.maintenance_supporter_frost_task"
    entity._task_id = TASK
    entity.async_update_trigger_state = MagicMock()
    entity.async_write_ha_state = MagicMock()
    coordinator = AsyncMock()
    coordinator.async_persist_trigger_runtime = AsyncMock()
    coordinator.async_add_trigger_history_entry = AsyncMock()
    coordinator.note_trigger_edge = MagicMock()
    entity.coordinator = coordinator
    return entity


# ─── review 2026-11-14: what the critical read of this round found ───────


async def test_an_order_too_far_out_is_refused_before_anything_is_stored(hass: HomeAssistant) -> None:
    """The order was stored and its reminder created before the postpone
    refused the date: the panel showed an error and "On order" side by side."""
    from homeassistant.exceptions import ServiceValidationError

    garage = await _garage(hass)
    with pytest.raises(ServiceValidationError):
        await async_part_order(hass, _live(hass, garage), OIL, expected=dt_util.now().date() + timedelta(days=3651))
    await hass.async_block_till_done()
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is None
    assert open_buy_task_id(_live(hass, garage), OIL) is None

    conn = make_ws_connection()
    far = (dt_util.now().date() + timedelta(days=3651)).isoformat()
    await call_ws_handler(ws_part_order, hass, conn, {"id": 1, "type": "x", "entry_id": garage.entry_id, "part_id": OIL, "expected_date": far})
    assert_ws_error(conn)
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is None


async def test_a_cancel_keeps_a_day_the_user_postponed_the_reminder_to(hass: HomeAssistant) -> None:
    garage = await _garage(hass, stock=1)
    task_id = open_buy_task_id(_live(hass, garage), OIL)
    assert task_id is not None
    due = dt_util.now().date() + timedelta(days=3)
    await async_part_order(hass, _live(hass, garage), OIL, expected=due)
    await hass.async_block_till_done()
    own = due + timedelta(days=5)
    await _live(hass, garage).runtime_data.coordinator.async_postpone_task(task_id, own)
    await hass.async_block_till_done()

    assert await async_part_order_cancel(hass, _live(hass, garage), OIL) is True
    await hass.async_block_till_done()
    assert get_task_store_state(hass, garage.entry_id, task_id).get("due_override") == own.isoformat()


async def test_a_first_parcel_leaves_the_rest_on_order(hass: HomeAssistant) -> None:
    garage = await _garage(hass)
    await async_part_order(hass, _live(hass, garage), OIL, quantity=5)
    await hass.async_block_till_done()
    task_id = open_buy_task_id(_live(hass, garage), OIL)

    await async_change_part_stock(hass, _live(hass, garage), OIL, delta=2)
    await hass.async_block_till_done()
    store = _live(hass, garage).runtime_data.store
    assert store.get_part_stock(OIL) == 12
    assert store.get_part_order(OIL)["quantity"] == 3, "two of five arrived"
    assert open_buy_task_id(_live(hass, garage), OIL) == task_id, "the reminder keeps waiting for the rest"

    await async_change_part_stock(hass, _live(hass, garage), OIL, delta=3)
    await hass.async_block_till_done()
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is None


def test_a_parcel_comes_off_an_order_counted_in_packages() -> None:
    from custom_components.maintenance_supporter.parts_runtime import _receive_order

    class _Store:
        def __init__(self) -> None:
            self.order: dict[str, Any] | None = {"quantity": 3, "expected": "2026-12-01", "note": "ref 7"}

        def get_part_order(self, _pid: str) -> dict[str, Any] | None:
            return dict(self.order) if self.order else None

        def set_part_order(self, _pid: str, order: dict[str, Any] | None) -> None:
            self.order = order

    store = _Store()
    part = {"id": OIL, "name": "Engine oil", "package_size": 5, "restock_quantity": 1}
    _receive_order(store, part, 5)  # one bottle of five litres
    assert store.order == {"quantity": 2, "expected": "2026-12-01", "note": "ref 7"}
    _receive_order(store, part, 12)  # more than was left
    assert store.order is None
    _receive_order(store, part, 5)  # nothing on order: nothing to do
    assert store.order is None


async def test_a_part_without_reminders_is_on_order_without_one(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, minor_version=4)
    garage = _object(hass, "Garage", parts={OIL: _oil(auto_buy_task=False)})
    await setup_integration(hass, g, garage)
    await async_change_part_stock(hass, _live(hass, garage), OIL, absolute=10)
    await hass.async_block_till_done()

    result = await async_part_order(hass, _live(hass, garage), OIL, quantity=2, expected=dt_util.now().date() + timedelta(days=4))
    await hass.async_block_till_done()
    assert result is not None and result["task_id"] is None
    live = _live(hass, garage)
    assert live.runtime_data.store.get_part_order(OIL)["quantity"] == 2
    assert not [t for t in live.data[CONF_TASKS].values() if t.get(PART_REF_FIELD)], "its reminders are switched off"
    # Bought is the receipt.
    await async_change_part_stock(hass, live, OIL, delta=2)
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is None


async def test_a_moved_order_keeps_waiting_on_the_new_object(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks

    g = make_global_entry(hass, minor_version=4)
    garage = _object(hass, "Garage", parts={OIL: _oil(auto_buy_task=True)})
    shed = _object(hass, "Shed", created_at="2026-02-01")
    await setup_integration(hass, g, garage, shed)
    await async_change_part_stock(hass, _live(hass, garage), OIL, absolute=10)
    due = dt_util.now().date() + timedelta(days=4)
    await async_part_order(hass, _live(hass, garage), OIL, quantity=2, expected=due)
    await hass.async_block_till_done()
    ent_reg = er.async_get(hass)
    sensor = next(e for e in er.async_entries_for_config_entry(ent_reg, garage.entry_id) if (e.unique_id or "").endswith(f"_part_{OIL}"))

    conn = make_ws_connection()
    await call_ws_handler(ws_move_part, hass, conn, {"id": 1, "type": "x", "entry_id": garage.entry_id, "part_id": OIL, "target_entry_id": shed.entry_id})
    await hass.async_block_till_done()
    assert_ws_success(conn)
    await async_reconcile_buy_tasks(hass, _live(hass, shed))
    await async_reconcile_buy_tasks(hass, _live(hass, garage))
    await hass.async_block_till_done()

    task_id = open_buy_task_id(_live(hass, shed), OIL)
    assert task_id is not None, "the new owner has the reminder"
    assert get_task_store_state(hass, shed.entry_id, task_id).get("due_override") == due.isoformat(), "and it waits for the delivery"
    assert open_buy_task_id(_live(hass, garage), OIL) is None

    # The stock sensor moved with its part: same entity id, so its history
    # and every dashboard that names it stay.
    moved = ent_reg.async_get(sensor.entity_id)
    assert moved is not None and moved.config_entry_id == shed.entry_id
    assert moved.unique_id.endswith(f"_part_{OIL}") and moved.unique_id != sensor.unique_id
    state = hass.states.get(sensor.entity_id)
    assert state is not None and float(state.state) == 10
    assert len([e for e in er.async_entries_for_config_entry(ent_reg, shed.entry_id) if (e.unique_id or "").endswith(f"_part_{OIL}")]) == 1


async def test_an_unreadable_stamp_does_not_take_the_export_down(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.csv_handler import _history_stamp

    assert _history_stamp("not a date") == "not a date"
    assert _history_stamp("=cmd") == "\t=cmd", "as a cell, defused"
    readable = "2026-03-10T09:30:00+00:00"
    assert _history_stamp(readable) == dt_util.as_local(dt_util.parse_datetime(readable)).strftime("%Y-%m-%d %H:%M")

    # West of UTC the year 1 has no local time: the whole export raised.
    await hass.config.async_set_time_zone("America/Los_Angeles")
    g = make_global_entry(hass, minor_version=4)
    car = _object(hass, "Car", history=[*_HISTORY, {"timestamp": "sometime in May", "type": "completed", "notes": "from an old import"}], last_performed="2026-09-15")
    await setup_integration(hass, g, car)
    rows = _rows(export_history_csv(hass))
    assert len(rows) == 4
    assert rows[0]["timestamp"] == "sometime in May" and rows[0]["notes"] == "from an old import"


def test_the_options_flow_says_a_long_hold_in_days() -> None:
    from custom_components.maintenance_supporter.config_flow_options_task_trigger import _hold_text

    assert _hold_text(45) == "45min"
    assert _hold_text(119) == "119min"
    assert _hold_text(125) == "2h 5min"
    assert _hold_text(1500) == "25h"
    assert _hold_text(21600) == "15d"
    assert _hold_text(21605) == "15d 5min"
    assert _hold_text(3600) == "2d 12h"
