"""#222: each spare part says when it counts as spending.

The household setting (*Spare parts count as spending*) decided for every
part at once. A house that books batteries, bulbs and bicycle parts in the
room where they went in, but the pool chemicals, the vacuum filter and the
ink in the year they were bought, had to pick one. A part now carries its
own ``cost_mode`` (``purchase`` / ``use``; absent = the setting):

* a completion is booked "when used" as soon as one of its parts counts when
  used; a part in it that counts at purchase is marked on its link and left
  out of the entry's ``parts_cost``;
* a purchase follows the part it buys (it counts when bought, or it is stock
  whose price becomes the part's price);
* history keeps how each entry and link was booked.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_PARTS, CONF_PARTS_COST_MODE, CONF_TASKS
from custom_components.maintenance_supporter.helpers.budget import compute_spend
from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD, PartValidationError, normalize_part
from custom_components.maintenance_supporter.helpers.parts_cost import entry_spend, part_cost_mode, parts_value
from custom_components.maintenance_supporter.websocket.parts import ws_create_part, ws_update_part

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

# 10 € a bulb, counted where it goes in; 2 € a cloth, counted when bought.
BULB = {"id": "bulb", "name": "Bulb", "cost": 10, "cost_mode": "use"}
CLOTH = {"id": "cloth", "name": "Cloth", "cost": 2}
INK = {"id": "ink", "name": "Ink", "cost": 30, "cost_mode": "purchase", "reorder_threshold": 1, "auto_buy_task": True}


async def _object(hass: HomeAssistant, parts: dict[str, dict[str, Any]], tasks: dict[str, dict[str, Any]], **options: Any) -> MockConfigEntry:
    g = make_global_entry(hass, options=options or None)
    entry = make_object_entry(
        hass,
        tasks=tasks,
        name="Hall",
        uid="hall",
        object_data=build_object_data(name="Hall", object_id="hall"),
        extra_data={CONF_PARTS: {pid: normalize_part(p) for pid, p in parts.items()}},
    )
    await setup_integration(hass, g, entry)
    for pid in parts:
        entry.runtime_data.store.set_part_stock(pid, 10)
    return entry


def _task(*links: tuple[str, float]) -> dict[str, Any]:
    task = build_task_data(task_id=TASK_ID_1, name="Lamp service", last_performed="2026-01-01")
    task["consumes_parts"] = [{"part_id": pid, "quantity": qty} for pid, qty in links]
    return task


def _last(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK_ID_1) -> dict[str, Any]:
    return get_task_store_state(hass, entry.entry_id, task_id)["history"][-1]


def _links(entry: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {link["part_id"]: link for link in entry["used_parts"]}


# ─── the field ────────────────────────────────────────────────────────────


def test_a_part_keeps_its_cost_mode_or_follows_the_house() -> None:
    assert normalize_part({"name": "X", "cost_mode": "use"})["cost_mode"] == "use"
    assert normalize_part({"name": "X", "cost_mode": "purchase"})["cost_mode"] == "purchase"
    assert normalize_part({"name": "X"})["cost_mode"] is None
    assert normalize_part({"name": "X", "cost_mode": ""})["cost_mode"] is None
    with pytest.raises(PartValidationError):
        normalize_part({"name": "X", "cost_mode": "sometimes"})
    assert part_cost_mode({"cost_mode": "use"}, "purchase") == "use"
    assert part_cost_mode({"cost_mode": "purchase"}, "use") == "purchase"
    assert part_cost_mode({"cost_mode": None}, "use") == "use"
    assert part_cost_mode({"cost_mode": "junk"}, "purchase") == "purchase"
    assert part_cost_mode(None, "use") == "use"


def test_the_part_schemas_take_the_mode() -> None:
    import voluptuous as vol

    base = {"id": 1, "type": "maintenance_supporter/part/create", "entry_id": "e", "name": "Bulb"}
    for mode in ("purchase", "use", None):
        ws_create_part._ws_schema({**base, "cost_mode": mode})  # type: ignore[attr-defined]
    with pytest.raises(vol.Invalid):
        ws_create_part._ws_schema({**base, "cost_mode": "later"})  # type: ignore[attr-defined]


def test_a_link_counted_at_purchase_is_not_in_the_parts_value() -> None:
    links = [{"quantity": 2, "unit_cost": 10}, {"quantity": 1, "unit_cost": 2, "cost_basis": "purchase"}]
    assert parts_value(links) == 20
    assert parts_value(links[1:]) is None


# ─── completions ──────────────────────────────────────────────────────────


async def test_a_part_counted_when_used_books_in_a_house_that_counts_purchases(hass: HomeAssistant) -> None:
    """The house counts at purchase; the bulb says "when used". The bulb's
    value is booked with the completion, the cloth's stays information."""
    entry = await _object(hass, {"bulb": BULB, "cloth": CLOTH}, {TASK_ID_1: _task(("bulb", 2), ("cloth", 1))})

    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, cost=5)

    last = _last(hass, entry)
    assert last["cost_basis"] == "use"
    links = _links(last)
    assert "cost_basis" not in links["bulb"]
    assert links["cloth"]["cost_basis"] == "purchase"
    assert last["parts_cost"] == 20.0  # two bulbs, not the cloth
    assert entry_spend(last) == pytest.approx(25.0)
    assert compute_spend(hass)[1] == pytest.approx(25.0)


async def test_a_part_counted_at_purchase_stays_information_in_a_house_that_counts_use(hass: HomeAssistant) -> None:
    ink = {**INK, "auto_buy_task": False}
    entry = await _object(hass, {"ink": ink}, {TASK_ID_1: _task(("ink", 1))}, **{CONF_PARTS_COST_MODE: "use"})

    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)

    last = _last(hass, entry)
    assert "cost_basis" not in last, "no part counts when used — nothing to book"
    assert "cost_basis" not in _links(last)["ink"]
    assert last["parts_cost"] == 30.0  # shown as information
    assert entry_spend(last) == 0


async def test_parts_without_a_mode_follow_the_house(hass: HomeAssistant) -> None:
    """Nothing changes for a household that never sets a part's mode."""
    entry = await _object(hass, {"cloth": CLOTH}, {TASK_ID_1: _task(("cloth", 3))}, **{CONF_PARTS_COST_MODE: "use"})
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    last = _last(hass, entry)
    assert last["cost_basis"] == "use" and last["parts_cost"] == 6.0
    assert "cost_basis" not in _links(last)["cloth"]
    assert entry_spend(last) == 6.0


async def test_a_completion_without_parts_follows_the_house(hass: HomeAssistant) -> None:
    entry = await _object(hass, {"bulb": BULB}, {TASK_ID_1: _task()}, **{CONF_PARTS_COST_MODE: "use"})
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, cost=4)
    last = _last(hass, entry)
    assert last["cost_basis"] == "use" and entry_spend(last) == 4


# ─── purchases ────────────────────────────────────────────────────────────


async def _bought(hass: HomeAssistant, entry: MockConfigEntry, part_id: str, cost: float) -> tuple[MockConfigEntry, dict[str, Any]]:
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks

    entry.runtime_data.store.set_part_stock(part_id, 0)
    await async_reconcile_buy_tasks(hass, entry)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    buy_id = next(tid for tid, t in entry.data[CONF_TASKS].items() if (t.get(PART_REF_FIELD) or {}).get("part_id") == part_id)
    await entry.runtime_data.coordinator.complete_maintenance(buy_id, cost=cost, restock_quantity=2)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    return entry, _last(hass, entry, buy_id)


async def test_ink_bought_counts_in_the_year_it_was_bought(hass: HomeAssistant) -> None:
    """The house counts on use; the ink counts at purchase — the 64 € paid
    are spending now, and the price stays as typed."""
    entry = await _object(hass, {"ink": INK}, {TASK_ID_1: _task(("ink", 1))}, **{CONF_PARTS_COST_MODE: "use"})
    entry, bought = await _bought(hass, entry, "ink", 64)
    assert bought["purchase"] is True and "cost_basis" not in bought
    assert entry_spend(bought) == 64
    assert compute_spend(hass)[1] == pytest.approx(64)
    assert entry.data[CONF_PARTS]["ink"]["cost"] == 30


async def test_bulbs_bought_are_stock_in_a_house_that_counts_purchases(hass: HomeAssistant) -> None:
    """The house counts at purchase; the bulb counts on use — the purchase
    is stock, and what was paid becomes the bulb's price."""
    bulb = {**BULB, "reorder_threshold": 1, "auto_buy_task": True}
    entry = await _object(hass, {"bulb": bulb}, {TASK_ID_1: _task(("bulb", 1))})
    entry, bought = await _bought(hass, entry, "bulb", 24)
    assert bought["purchase"] is True and bought["cost_basis"] == "use"
    assert entry_spend(bought) == 0
    assert entry.data[CONF_PARTS]["bulb"]["cost"] == 12.0  # 24 € for two

    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    used = _last(hass, entry)
    assert used["cost_basis"] == "use" and used["parts_cost"] == 12.0
    assert compute_spend(hass)[1] == pytest.approx(12.0)


# ─── history, the part dialog, imports ────────────────────────────────────


async def test_an_edit_keeps_how_each_part_was_booked(hass: HomeAssistant) -> None:
    """A part on the entry keeps its booking when the part's mode changes
    later; a part the edit adds is judged by its mode today."""
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_update_history_entry

    parts = {"bulb": BULB, "cloth": CLOTH, "fuse": {"id": "fuse", "name": "Fuse", "cost": 1}}
    entry = await _object(hass, parts, {TASK_ID_1: _task(("bulb", 1), ("cloth", 1))})
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    stamp = _last(hass, entry)["timestamp"]
    # The cloth switches to "when used" afterwards: the old entry keeps it
    # counted at purchase. The fuse (house mode, at purchase) is added.
    data = dict(entry.data)
    data[CONF_PARTS] = {**data[CONF_PARTS], "cloth": {**data[CONF_PARTS]["cloth"], "cost_mode": "use"}}
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
            "used_parts": [{"part_id": "bulb", "quantity": 2}, {"part_id": "cloth", "quantity": 1}, {"part_id": "fuse", "quantity": 3}],
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    last = _last(hass, entry)
    links = _links(last)
    assert links["cloth"]["cost_basis"] == "purchase", "booked at purchase, stays so"
    assert links["fuse"]["cost_basis"] == "purchase", "added: today's mode (the house's)"
    assert "cost_basis" not in links["bulb"]
    assert last["parts_cost"] == 20.0


async def test_the_part_dialog_sets_and_clears_the_mode(hass: HomeAssistant) -> None:
    entry = await _object(hass, {"cloth": CLOTH}, {TASK_ID_1: _task(("cloth", 1))})

    conn = make_ws_connection()
    msg = {"id": 1, "type": "maintenance_supporter/part/update", "entry_id": entry.entry_id, "part_id": "cloth", "name": "Cloth", "cost_mode": "use"}
    await call_ws_handler(ws_update_part, hass, conn, msg)
    assert not conn.send_error.called, conn.send_error.call_args
    assert hass.config_entries.async_get_entry(entry.entry_id).data[CONF_PARTS]["cloth"]["cost_mode"] == "use"

    # An edit without the field keeps it; None hands it back to the house.
    await call_ws_handler(ws_update_part, hass, conn, {**msg, "id": 2, "cost_mode": None} | {"name": "Cloth"})
    assert hass.config_entries.async_get_entry(entry.entry_id).data[CONF_PARTS]["cloth"]["cost_mode"] is None
    await call_ws_handler(ws_update_part, hass, conn, {**msg, "id": 3})
    keep = {k: v for k, v in msg.items() if k != "cost_mode"}
    await call_ws_handler(ws_update_part, hass, conn, {**keep, "id": 4, "notes": "box"})
    assert hass.config_entries.async_get_entry(entry.entry_id).data[CONF_PARTS]["cloth"]["cost_mode"] == "use"


async def test_an_import_keeps_a_sound_mode_and_drops_a_junk_one(hass: HomeAssistant) -> None:
    """A junk mode in a backup must not cost the part: it follows the house."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    g = make_global_entry(hass)
    await setup_integration(hass, g)
    payload = {
        "version": 1,
        "objects": [
            {
                "object": {"name": "Garage"},
                "tasks": [{"name": "Lamp"}],
                "parts": [
                    {"id": "a", "name": "Bulb", "cost_mode": "use"},
                    {"id": "b", "name": "Fuse", "cost_mode": "whenever"},
                ],
            }
        ],
    }
    import json

    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(payload)})
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1, result
    garage = hass.config_entries.async_get_entry(result["imported"][0]["entry_id"])
    modes = {p["name"]: p.get("cost_mode") for p in garage.data[CONF_PARTS].values()}
    assert modes == {"Bulb": "use", "Fuse": None}
