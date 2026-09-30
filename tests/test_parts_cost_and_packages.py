"""Spare parts: bought in packages, used in units (#98), and what they cost (#104).

Discussion #98 asked to decouple the purchase unit from the consumption unit:
a 500 ml can bought at 4.99, used 30 ml at a time. Decimals alone (2.28)
could not price that — 30 ml is 0.06 cans, and 5 ml is below the two-decimal
precision. A part now has a package size: stock, use and the reorder
threshold count units, the restock amount and the price count packages.

Discussion #104 asked why a completion that used a €15 filter recorded no
cost. The answer was a discipline the owner had to keep (book the purchase
OR each use, never both). It is now one setting, and every completion
records the value of its parts and how it was booked — so switching the
setting never re-values history.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_PARTS,
    CONF_PARTS_COST_MODE,
    CONF_TASKS,
    EVENT_TASK_COMPLETED,
)
from custom_components.maintenance_supporter.helpers.budget import compute_spend
from custom_components.maintenance_supporter.helpers.parts import (
    PART_REF_FIELD,
    buy_task_notes,
    normalize_part,
    restock_units,
    unit_price,
)
from custom_components.maintenance_supporter.helpers.parts_cost import entry_spend, parts_value
from custom_components.maintenance_supporter.websocket.parts import ws_create_part, ws_restock_part

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_task_data,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    setup_integration,
)

# ─── #98: the package model ───────────────────────────────────────────────

SPRAY = {"id": "spray", "name": "Glass cleaner", "unit": "ml", "cost": 4.99, "package_size": 500, "restock_quantity": 2}


def test_a_package_size_splits_buying_from_using() -> None:
    part = normalize_part(SPRAY)
    assert part["package_size"] == 500
    # Two cans restock 1000 ml; a price per can becomes a price per ml.
    assert restock_units(part) == 1000
    assert restock_units(part, 3) == 1500
    assert unit_price(part) == pytest.approx(4.99 / 500)
    # Without a package size nothing changes.
    plain = normalize_part({"name": "Filter", "cost": 15, "restock_quantity": 2})
    assert plain["package_size"] is None
    assert restock_units(plain) == 2
    assert unit_price(plain) == 15


def test_a_zero_or_junk_package_size_means_none() -> None:
    assert normalize_part({"name": "X", "package_size": 0})["package_size"] is None
    assert normalize_part({"name": "X", "package_size": ""})["package_size"] is None
    with pytest.raises(ValueError):
        normalize_part({"name": "X", "package_size": "lots"})


def test_the_buy_reminder_names_packages() -> None:
    notes = buy_task_notes(normalize_part(SPRAY), 120, 2)
    assert notes.splitlines()[0] == "2 × Glass cleaner (500 ml)"
    assert "◎ 120 ml" in notes


def test_decimal_thresholds_and_stock_pass_the_part_schemas() -> None:
    """The WS schema said ``int`` for the reorder threshold and the absolute
    stock, and refused the 0.5 the panel sends — #98's decimals only worked
    where nobody used the panel."""
    ws_create_part._ws_schema(  # type: ignore[attr-defined]
        {"id": 1, "type": "maintenance_supporter/part/create", "entry_id": "e", "name": "Salt", "reorder_threshold": 0.5, "package_size": 500}
    )
    ws_restock_part._ws_schema(  # type: ignore[attr-defined]
        {"id": 2, "type": "maintenance_supporter/part/restock", "entry_id": "e", "part_id": "p", "absolute": 2.5}
    )


async def _object(hass: HomeAssistant, parts: dict[str, dict[str, Any]], tasks: dict[str, dict[str, Any]], **options: Any) -> MockConfigEntry:
    g = make_global_entry(hass, options=options or None)
    entry = make_object_entry(
        hass,
        tasks=tasks,
        name="Windows",
        uid="windows",
        object_data=build_object_data(name="Windows", object_id="windows"),
        extra_data={CONF_PARTS: {pid: normalize_part(p) for pid, p in parts.items()}},
    )
    await setup_integration(hass, g, entry)
    return entry


def _cleaning(qty: float = 30) -> dict[str, Any]:
    task = build_task_data(task_id=TASK_ID_1, name="Clean windows", last_performed="2026-01-01")
    task["consumes_parts"] = [{"part_id": "spray", "quantity": qty}]
    return task


# Low at 200 ml with an automatic buy reminder — the reconciler owns buy
# tasks and removes one it did not create.
BOUGHT = {**SPRAY, "reorder_threshold": 200, "auto_buy_task": True}


async def _open_buy_task(hass: HomeAssistant, entry: MockConfigEntry, stock: float) -> tuple[MockConfigEntry, str]:
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks

    entry.runtime_data.store.set_part_stock("spray", stock)
    await async_reconcile_buy_tasks(hass, entry)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    buy_id = next(tid for tid, t in entry.data[CONF_TASKS].items() if (t.get(PART_REF_FIELD) or {}).get("part_id") == "spray")
    return entry, buy_id


async def test_a_purchase_restocks_packages_times_size(hass: HomeAssistant) -> None:
    entry = await _object(hass, {"spray": BOUGHT}, {TASK_ID_1: _cleaning()})
    entry, buy_id = await _open_buy_task(hass, entry, 100)

    await entry.runtime_data.coordinator.complete_maintenance(buy_id, restock_quantity=1)
    await hass.async_block_till_done()

    assert hass.config_entries.async_get_entry(entry.entry_id).runtime_data.store.get_part_stock("spray") == 600


# ─── #104: what a completion's parts cost ─────────────────────────────────


def _last(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK_ID_1) -> dict[str, Any]:
    return get_task_store_state(hass, entry.entry_id, task_id)["history"][-1]


async def test_every_completion_records_the_value_of_its_parts(hass: HomeAssistant) -> None:
    """By default ("when bought") the value is information: shown, never in
    a total — the money counted when the cans were bought."""
    entry = await _object(hass, {"spray": SPRAY}, {TASK_ID_1: _cleaning(30)})
    entry.runtime_data.store.set_part_stock("spray", 1000)

    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, source="button")

    last = _last(hass, entry)
    assert last["used_parts"][0]["unit_cost"] == pytest.approx(4.99 / 500)
    assert last["parts_cost"] == 0.3  # 30 ml of a 4.99 / 500 ml can
    assert "cost_basis" not in last
    assert entry_spend(last) == 0
    assert entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]["_total_cost"] == 0


async def test_when_parts_count_when_used_every_surface_books_them(hass: HomeAssistant) -> None:
    """A button, an NFC tag, voice, an automation: nobody types the price —
    the completion books it, and the budget sees it."""
    entry = await _object(hass, {"spray": SPRAY}, {TASK_ID_1: _cleaning(60)}, **{CONF_PARTS_COST_MODE: "use"})
    entry.runtime_data.store.set_part_stock("spray", 1000)
    events = []
    hass.bus.async_listen(EVENT_TASK_COMPLETED, lambda e: events.append(e.data))

    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, cost=5, unattended=True, source="nfc")
    await hass.async_block_till_done()

    last = _last(hass, entry)
    assert last["cost_basis"] == "use" and last["parts_cost"] == 0.6
    assert entry_spend(last) == pytest.approx(5.6)
    assert entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]["_total_cost"] == pytest.approx(5.6)
    monthly, yearly = compute_spend(hass)
    assert monthly == pytest.approx(5.6) and yearly == pytest.approx(5.6)
    assert events[-1]["parts_cost"] == 0.6


async def test_a_purchase_is_stock_and_sets_the_price_when_parts_count_when_used(hass: HomeAssistant) -> None:
    """€30 for two cans: not spending yet — the cans are. The price paid
    becomes the part's price, so the next use is valued at 15 per can."""
    entry = await _object(hass, {"spray": BOUGHT}, {TASK_ID_1: _cleaning(500)}, **{CONF_PARTS_COST_MODE: "use"})
    entry, buy_id = await _open_buy_task(hass, entry, 0)

    await entry.runtime_data.coordinator.complete_maintenance(buy_id, cost=30, restock_quantity=2)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)

    bought = _last(hass, entry, buy_id)
    assert bought["purchase"] is True and bought["cost_basis"] == "use"
    assert entry_spend(bought) == 0
    assert entry.data[CONF_PARTS]["spray"]["cost"] == 15.0

    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    used = _last(hass, entry)
    assert used["parts_cost"] == 15.0  # one can used = one can's price
    assert compute_spend(hass)[1] == pytest.approx(15.0)


async def test_by_default_a_purchase_counts_and_keeps_the_price(hass: HomeAssistant) -> None:
    entry = await _object(hass, {"spray": BOUGHT}, {TASK_ID_1: _cleaning()})
    entry, buy_id = await _open_buy_task(hass, entry, 0)

    await entry.runtime_data.coordinator.complete_maintenance(buy_id, cost=30, restock_quantity=2)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)

    bought = _last(hass, entry, buy_id)
    assert bought["purchase"] is True and "cost_basis" not in bought
    assert entry_spend(bought) == 30
    assert entry.data[CONF_PARTS]["spray"]["cost"] == 4.99


def test_history_is_never_revalued() -> None:
    """The spend follows what each entry recorded, not today's setting: an
    entry someone booked by hand under "when bought" — cost typed from the
    parts — keeps counting once, whatever the setting says now."""
    by_hand = {"cost": 15.0, "parts_cost": 15.0}
    booked_on_use = {"cost": 0, "parts_cost": 15.0, "cost_basis": "use"}
    stock_purchase = {"cost": 30.0, "purchase": True, "cost_basis": "use"}
    old_purchase = {"cost": 30.0, "purchase": True}
    assert [entry_spend(e) for e in (by_hand, booked_on_use, stock_purchase, old_purchase)] == [15.0, 15.0, 0.0, 30.0]


def test_parts_value_counts_only_priced_parts() -> None:
    assert parts_value([{"quantity": 2, "unit_cost": 1.5}, {"quantity": 3}]) == 3.0
    assert parts_value([{"quantity": 3}]) is None
    assert parts_value(None) is None


async def test_a_corrected_selection_keeps_the_booked_price(hass: HomeAssistant) -> None:
    """Editing the parts of an old completion re-values it with the price it
    was booked at; a part added by the edit takes today's price."""
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_update_history_entry

    from .conftest import call_ws_handler, make_ws_connection

    parts = {"spray": SPRAY, "cloth": {"id": "cloth", "name": "Cloth", "cost": 2}}
    entry = await _object(hass, parts, {TASK_ID_1: _cleaning(100)})
    entry.runtime_data.store.set_part_stock("spray", 1000)
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    stamp = _last(hass, entry)["timestamp"]
    # The price changes afterwards.
    data = dict(entry.data)
    data[CONF_PARTS] = {**data[CONF_PARTS], "spray": {**data[CONF_PARTS]["spray"], "cost": 9.99}}
    hass.config_entries.async_update_entry(entry, data=data)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": stamp,
            "used_parts": [{"part_id": "spray", "quantity": 200}, {"part_id": "cloth", "quantity": 1}],
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    last = _last(hass, entry)
    # 200 ml at the BOOKED 4.99/500 + one cloth at today's 2.
    assert last["parts_cost"] == pytest.approx(round(200 * 4.99 / 500 + 2, 2))


def test_an_import_keeps_only_sound_bookkeeping() -> None:
    from custom_components.maintenance_supporter.websocket.io import _sanitize_history

    clean = _sanitize_history(
        [
            {"timestamp": "2026-01-01T00:00:00", "type": "completed", "parts_cost": 3.5, "purchase": True, "cost_basis": "use"},
            {"timestamp": "2026-01-02T00:00:00", "type": "completed", "parts_cost": float("inf"), "purchase": "yes", "cost_basis": "later"},
        ]
    )
    assert clean[0] == {"timestamp": "2026-01-01T00:00:00", "type": "completed", "parts_cost": 3.5, "purchase": True, "cost_basis": "use"}
    assert clean[1] == {"timestamp": "2026-01-02T00:00:00", "type": "completed"}


async def test_bought_by_voice_counts_packages(hass: HomeAssistant) -> None:
    """ "I bought two cans" adds two cans' worth of millilitres."""
    from homeassistant.helpers import intent

    from custom_components.maintenance_supporter.intent import INTENT_BOUGHT_PART, async_setup_intents

    entry = await _object(hass, {"spray": SPRAY}, {TASK_ID_1: _cleaning()})
    entry.runtime_data.store.set_part_stock("spray", 50)
    await async_setup_intents(hass)

    await intent.async_handle(hass, "test", INTENT_BOUGHT_PART, {"name": {"value": "glass cleaner"}, "quantity": {"value": 2}})

    assert entry.runtime_data.store.get_part_stock("spray") == 1050
