"""D#213: Replaced asks which cells went in (fleet opt-in).

A device takes whatever is in the drawer, disposable or rechargeable, while
Battery Notes names one type per device. With the option on, Replaced offers
the note's type and every fleet part of the same size, books the cells that
went in, remembers them for the device, and puts the cells taken out on
their own part's charging pile when they were rechargeable. Off, nothing
changes: the note's type is booked and a ``cells`` choice is ignored.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import assert_ws_success, build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration

REMOTE = "sensor.remote_battery_plus"
NIMH = "batt_aaa nimh"
AAA = "batt_aaa"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _battery(hass: HomeAssistant, name: str, btype: str, qty: int) -> None:
    hass.states.async_set(
        f"sensor.{name}_battery_plus", "8",
        {"device_class": "battery", "battery_type": btype, "battery_quantity": qty, "battery_low": True, "device_name": name},
    )
    hass.states.async_set(f"button.{name}_battery_replaced", "unknown")


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, {"id": 1, "type": "x", **msg})
    await hass.async_block_till_done()
    return assert_ws_success(conn)


async def _fleet(hass: HomeAssistant, global_entry: MockConfigEntry) -> Any:
    """A remote on disposable AAA, a clock on AAA NiMH: both parts exist,
    both counted (10 disposable, 4 charged)."""
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_entry
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    await setup_integration(hass, global_entry)
    _battery(hass, "remote", "AAA", 2)
    _battery(hass, "clock", "AAA NiMH", 2)
    await _ws(hass, ws_battery_fleet_setup, {})
    fleet = find_fleet_entry(hass)
    await async_change_part_stock(hass, fleet, AAA, absolute=10)
    await async_change_part_stock(hass, fleet, NIMH, absolute=4)
    async_mock_service(hass, "button", "press")
    return fleet


def _next_day(hass: HomeAssistant) -> None:
    """A swap of the same battery is booked once a day (S3): start a new one."""
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import RECORDED_REPLACEMENTS_KEY
    from custom_components.maintenance_supporter.helpers.battery_lifetime import fleet_store_and_task

    store, task = fleet_store_and_task(hass)
    store.update_task_state(task, **{RECORDED_REPLACEMENTS_KEY: {}})


def _stock(fleet: Any, pid: str) -> tuple[Any, Any]:
    store = fleet.runtime_data.store
    return store.get_part_stock(pid), store.get_part_restoring(pid)


async def _overview_row(hass: HomeAssistant, entity_id: str) -> tuple[dict[str, Any], dict[str, Any]]:
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_overview

    ov = await _ws(hass, ws_battery_fleet_overview, {})
    return ov, next(r for r in ov["all"] if r["entity_id"] == entity_id)


async def test_off_books_the_note_type_and_asks_nothing(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_mark_replaced

    fleet = await _fleet(hass, global_entry)
    ov, row = await _overview_row(hass, REMOTE)
    assert ov["ask_cells"] is False and "cell_choices" not in row
    res = await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], "cells": {REMOTE: "AAA NIMH"}})
    assert res["consumed"] == {AAA: 2}
    assert _stock(fleet, AAA) == (8, 0) and _stock(fleet, NIMH) == (4, 0)


async def test_on_the_cells_that_went_in_are_booked_and_remembered(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_set_ask_cells,
    )

    fleet = await _fleet(hass, global_entry)
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": True})
    ov, row = await _overview_row(hass, REMOTE)
    assert ov["ask_cells"] is True
    assert [c["type"] for c in row["cell_choices"]] == ["AAA", "AAA NIMH"]
    assert [c["rechargeable"] for c in row["cell_choices"]] == [False, True]
    assert row["cells_installed"] == "AAA"

    # Disposables out (thrown away), charged NiMH in.
    res = await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], "cells": {REMOTE: "AAA NIMH"}})
    assert res["consumed"] == {NIMH: 2}
    assert _stock(fleet, NIMH) == (2, 0) and _stock(fleet, AAA) == (10, 0)
    _ov, row = await _overview_row(hass, REMOTE)
    assert row["cells_installed"] == "AAA NIMH"

    # Back to disposables: the NiMH taken out wait to be charged.
    _next_day(hass)
    res = await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], "cells": {REMOTE: "AAA"}})
    assert res["consumed"] == {AAA: 2}
    assert _stock(fleet, AAA) == (8, 0) and _stock(fleet, NIMH) == (2, 2)

    # No choice sent (the bulk action), or one the battery cannot take:
    # it keeps the cells it holds.
    _next_day(hass)
    await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE]})
    _next_day(hass)
    await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], "cells": {REMOTE: "CR2032"}})
    assert _stock(fleet, AAA) == (4, 0) and _stock(fleet, NIMH) == (2, 2)


async def test_the_same_rechargeable_again_charges_the_old_ones(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_set_ask_cells,
    )

    fleet = await _fleet(hass, global_entry)
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": True})
    await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], "cells": {REMOTE: "AAA NIMH"}})
    _next_day(hass)
    await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], "cells": {REMOTE: "AAA NIMH"}})
    assert _stock(fleet, NIMH) == (0, 2)


async def test_a_recorded_swap_books_the_cells_the_battery_holds(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import async_record_replacement
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_set_ask_cells,
    )

    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    # Registered before its state appears, or the registry picks another id.
    device = dr.async_get(hass).async_get_or_create(config_entry_id=global_entry.entry_id, identifiers={("test", "remote")}, name="Remote")
    er.async_get(hass).async_get_or_create("sensor", "battery_notes", "remote_plus", suggested_object_id="remote_battery_plus", device_id=device.id)
    fleet = await _fleet(hass, global_entry)
    async_mock_service(hass, "battery_notes", "set_battery_replaced")
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": True})
    await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], "cells": {REMOTE: "AAA NIMH"}})
    _next_day(hass)
    res = await async_record_replacement(hass, REMOTE, "2026-10-10T09:00:00+00:00")
    assert res["consumed"] == {NIMH: 2}
    assert _stock(fleet, AAA) == (10, 0)


async def test_every_list_offers_the_choice(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Only the roster rows carried the choices: Replaced in the "low" list,
    the one people use, booked the note's type without asking."""
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_set_ask_cells

    await _fleet(hass, global_entry)
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": True})
    ov, _row = await _overview_row(hass, REMOTE)
    low = next(r for r in ov["low"] if r["entity_id"] == REMOTE)
    assert [c["type"] for c in low["cell_choices"]] == ["AAA", "AAA NIMH"]
    assert low["cells_installed"] == "AAA"


async def test_a_memory_the_battery_cannot_take_is_not_trusted(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Remembered cells it can no longer take (the part was deleted, the note
    now names another size) were booked, and nothing at all was consumed."""
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import INSTALLED_CELLS_KEY
    from custom_components.maintenance_supporter.helpers.battery_lifetime import fleet_store_and_task
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_set_ask_cells,
    )

    fleet = await _fleet(hass, global_entry)
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": True})
    store, task = fleet_store_and_task(hass)
    store.update_task_state(task, **{INSTALLED_CELLS_KEY: {REMOTE: "AA NIMH"}})
    _ov, row = await _overview_row(hass, REMOTE)
    assert row["cells_installed"] == "AAA"
    res = await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE]})
    assert res["consumed"] == {AAA: 2}
    assert _stock(fleet, AAA) == (8, 0) and _stock(fleet, NIMH) == (4, 0)


async def test_switched_off_the_cells_are_forgotten(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Off, Replaced books the note's type: the cells remembered from before
    claimed NiMH again once the option was back on."""
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_set_ask_cells,
    )

    fleet = await _fleet(hass, global_entry)
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": True})
    await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], "cells": {REMOTE: "AAA NIMH"}})
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": False})
    _next_day(hass)
    res = await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE]})
    assert res["consumed"] == {AAA: 2}
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": True})
    _ov, row = await _overview_row(hass, REMOTE)
    assert row["cells_installed"] == "AAA"
    assert _stock(fleet, NIMH) == (2, 0)


async def test_another_choice_the_same_day_corrects_the_first(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A second Replaced the same day was ignored: a slip in the chooser
    stayed booked and remembered, and later swaps booked the wrong cells."""
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_set_ask_cells,
    )

    fleet = await _fleet(hass, global_entry)
    await _ws(hass, ws_battery_fleet_set_ask_cells, {"enabled": True})

    async def mark(cells: str | None = None) -> Any:
        return await _ws(hass, ws_battery_fleet_mark_replaced, {"entity_ids": [REMOTE], **({"cells": {REMOTE: cells}} if cells else {})})

    await mark("AAA NIMH")
    assert _stock(fleet, NIMH) == (2, 0)
    # Disposables went in after all: the NiMH go back, the disposables leave.
    res = await mark("AAA")
    assert res["consumed"] == {AAA: 2}
    assert _stock(fleet, NIMH) == (4, 0) and _stock(fleet, AAA) == (8, 0)
    _ov, row = await _overview_row(hass, REMOTE)
    assert row["cells_installed"] == "AAA"
    # The same choice again, or none: nothing more.
    await mark("AAA")
    await mark()
    assert _stock(fleet, NIMH) == (4, 0) and _stock(fleet, AAA) == (8, 0)

    # NiMH in on another day; the next day disposables, corrected to NiMH:
    # the NiMH taken out wait to be charged either way.
    _next_day(hass)
    await mark("AAA NIMH")
    _next_day(hass)
    await mark("AAA")
    assert _stock(fleet, NIMH) == (2, 2) and _stock(fleet, AAA) == (6, 0)
    await mark("AAA NIMH")
    assert _stock(fleet, NIMH) == (0, 2) and _stock(fleet, AAA) == (8, 0)


async def test_two_records_of_one_swap_take_the_cells_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The memory was written after the consumption: the automatic record and
    a click on the chip for the same swap both took the cells. Off, the
    record also forgets the cells chosen while the option was on."""
    import asyncio

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import INSTALLED_CELLS_KEY, async_record_replacement
    from custom_components.maintenance_supporter.helpers.battery_lifetime import fleet_store_and_task

    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    device = dr.async_get(hass).async_get_or_create(config_entry_id=global_entry.entry_id, identifiers={("test", "remote")}, name="Remote")
    er.async_get(hass).async_get_or_create("sensor", "battery_notes", "remote_plus", suggested_object_id="remote_battery_plus", device_id=device.id)
    fleet = await _fleet(hass, global_entry)
    async_mock_service(hass, "battery_notes", "set_battery_replaced")
    store, task = fleet_store_and_task(hass)
    store.update_task_state(task, **{INSTALLED_CELLS_KEY: {REMOTE: "AAA NIMH"}})
    when = "2026-10-10T09:00:00+00:00"
    from custom_components.maintenance_supporter.helpers import battery_fleet_setup

    consume = battery_fleet_setup.async_consume_type_parts

    async def saving(*args: Any) -> Any:
        await asyncio.sleep(0)  # the Store write, which waits in real life
        return await consume(*args)

    with patch.object(battery_fleet_setup, "async_consume_type_parts", saving):
        results = await asyncio.gather(async_record_replacement(hass, REMOTE, when), async_record_replacement(hass, REMOTE, when))
    assert sorted(r["already_recorded"] for r in results) == [False, True]
    assert _stock(fleet, AAA) == (8, 0)
    assert REMOTE not in (store.get_task_state(task).get(INSTALLED_CELLS_KEY) or {})


def test_the_cells_ride_a_backup_and_a_rename() -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import INSTALLED_CELLS_KEY, sanitize_installed_cells
    from custom_components.maintenance_supporter.helpers.entity_rename import rewrite_store

    assert sanitize_installed_cells({REMOTE: "AAA NIMH", "not an id": "AAA", "sensor.x": 5, "sensor.y": ""}) == {REMOTE: "AAA NIMH"}
    assert sanitize_installed_cells(["x"]) == {}
    state = {INSTALLED_CELLS_KEY: {"sensor.old": "AA NIMH"}}
    store = MagicMock()
    store.all_task_states.return_value = {"fleet": state}
    assert rewrite_store(store, "sensor.old", "sensor.new")
    assert state[INSTALLED_CELLS_KEY] == {"sensor.new": "AA NIMH"}


async def test_the_option_needs_a_fleet(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_set_ask_cells

    await setup_integration(hass, global_entry)
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_set_ask_cells, hass, conn, {"id": 1, "type": "x", "enabled": True})
    assert conn.send_error.call_args[0][1] == "not_configured"
