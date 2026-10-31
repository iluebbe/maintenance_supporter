"""#238: record a spare part purchase, with what was paid and when.

A purchase could only be booked by completing the "Buy …" task, and that
exists once the stock is down to the reorder threshold: whoever bought on
sale before had the +/- buttons, which carry no price. ``part/purchase``
(and the ``part_purchase`` service) books one at any time, as the
completion of the part's buy task, the open one or a new one, so it lands
where a completed reminder's always has: the stock, the spending, the
budget and the history.

For a part that counts when used the purchase is stock, and its price went
into the part's price, replacing it: the stock still on the shelf was
revalued at the new price. It is averaged with that stock now.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

import pytest
import voluptuous as vol
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import ServiceValidationError, Unauthorized
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_PARTS,
    CONF_PARTS_COST_MODE,
    CONF_TASKS,
    DOMAIN,
)
from custom_components.maintenance_supporter.helpers.budget import compute_spend
from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD, POOL_IN_USE_FIELD, normalize_part
from custom_components.maintenance_supporter.helpers.parts_cost import averaged_price
from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock
from custom_components.maintenance_supporter.websocket.parts import ws_part_purchase

from .conftest import (
    assert_ws_error,
    assert_ws_success,
    build_object_data,
    call_ws_handler,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

FLUID = "fluid"
FILTER = "filter"


async def _shelf(hass: HomeAssistant, house: str = "purchase", *, fluid_stock: float = 12, object_extra: dict[str, Any] | None = None) -> MockConfigEntry:
    """Garage shelf: washer fluid in 5 l jugs at 10 a jug (counted in l,
    reorder at 5 l), and water filters at 8 each."""
    g = make_global_entry(hass, options={CONF_PARTS_COST_MODE: house})
    parts = {
        FLUID: {"id": FLUID, "name": "Washer fluid", "unit": "l", "package_size": 5, "cost": 10,
                "reorder_threshold": 5, "restock_quantity": 2, "auto_buy_task": True},
        FILTER: {"id": FILTER, "name": "Water filter", "cost": 8},
    }
    obj = build_object_data(name="Garage shelf", object_id="garage_shelf")
    obj.update(object_extra or {})
    entry = make_object_entry(
        hass,
        tasks={},
        name="Garage shelf",
        uid="garage_shelf",
        object_data=obj,
        extra_data={CONF_PARTS: {pid: normalize_part(p) for pid, p in parts.items()}},
    )
    await setup_integration(hass, g, entry)
    # Counted the way the panel counts: the buy reminder follows.
    await async_change_part_stock(hass, entry, FLUID, absolute=fluid_stock)
    await async_change_part_stock(hass, entry, FILTER, absolute=1)
    await hass.async_block_till_done()
    return entry


async def _buy(hass: HomeAssistant, entry: MockConfigEntry, part_id: str, **extra: Any) -> Any:
    conn = make_ws_connection()
    conn.user.is_admin = True
    await call_ws_handler(ws_part_purchase, hass, conn, {"id": 1, "type": "x", "entry_id": entry.entry_id, "part_id": part_id, **extra})
    await hass.async_block_till_done()
    return conn


def _live(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id)


def _stock(hass: HomeAssistant, entry: MockConfigEntry, part_id: str) -> float | None:
    return _live(hass, entry).runtime_data.store.get_part_stock(part_id)


def _buy_tasks(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, dict[str, Any]]:
    """The tasks named like a buy reminder (open ones carry part_ref)."""
    return {tid: t for tid, t in _live(hass, entry).data[CONF_TASKS].items() if str(t.get("name", "")).startswith("Buy ")}


def _completions(hass: HomeAssistant, entry: MockConfigEntry, task_id: str) -> list[dict[str, Any]]:
    return [h for h in get_task_store_state(hass, entry.entry_id, task_id).get("history") or [] if h.get("type") == "completed"]


def _price(hass: HomeAssistant, entry: MockConfigEntry, part_id: str) -> Any:
    return _live(hass, entry).data[CONF_PARTS][part_id]["cost"]


# ─── a purchase without a reminder ──────────────────────────────────────────


async def test_buying_ahead_books_the_purchase_without_a_reminder(hass: HomeAssistant) -> None:
    """The reported case: on sale, well above the threshold. The stock goes
    up by the packages bought, what was paid is spending (the part counts
    when bought), and it stays on record as a done "Buy …" task."""
    entry = await _shelf(hass)
    assert not _buy_tasks(hass, entry)
    result = assert_ws_success(await _buy(hass, entry, FLUID, quantity=3, unit_price=7.5, notes="Hardware store"))
    assert result["stock"] == 27 and result["cost"] == 22.5
    assert _stock(hass, entry, FLUID) == 27, "3 jugs of 5 l"

    tasks = _buy_tasks(hass, entry)
    assert list(tasks) == [result["task_id"]]
    task = tasks[result["task_id"]]
    assert task["name"] == "Buy Washer fluid"
    assert PART_REF_FIELD not in task, "not low: a plain done one-off, the next low episode starts fresh"
    [done] = _completions(hass, entry, result["task_id"])
    assert done["cost"] == 22.5 and done["notes"] == "Hardware store" and done.get("purchase") is True
    assert compute_spend(hass) == (22.5, 22.5)
    # The part's own price is left alone where purchases are spending.
    assert _price(hass, entry, FLUID) == 10


async def test_a_purchase_closes_the_open_reminder(hass: HomeAssistant) -> None:
    entry = await _shelf(hass, fluid_stock=4)
    [(reminder_id, reminder)] = _buy_tasks(hass, entry).items()
    assert reminder[PART_REF_FIELD] == {"part_id": FLUID}, "low: the reminder is open"

    result = assert_ws_success(await _buy(hass, entry, FLUID, quantity=1, cost=9))
    assert result["task_id"] == reminder_id, "the reminder itself is completed, no second task"
    assert _stock(hass, entry, FLUID) == 9
    assert list(_buy_tasks(hass, entry)) == [reminder_id]
    assert [c["cost"] for c in _completions(hass, entry, reminder_id)] == [9]


async def test_without_a_quantity_the_restock_amount_and_without_a_price_no_spending(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    result = assert_ws_success(await _buy(hass, entry, FLUID))
    assert _stock(hass, entry, FLUID) == 22, "the part's restock amount: 2 jugs"
    assert result["cost"] is None
    [done] = _completions(hass, entry, result["task_id"])
    assert "cost" not in done or done["cost"] is None
    assert compute_spend(hass) == (0, 0)


async def test_a_receipt_from_last_week_is_dated_that_day(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    day = dt_util.now().date() - timedelta(days=6)
    result = assert_ws_success(await _buy(hass, entry, FILTER, quantity=2, unit_price=8, date=day.isoformat()))
    [done] = _completions(hass, entry, result["task_id"])
    assert dt_util.as_local(dt_util.parse_datetime(done["timestamp"])).date() == day
    assert get_task_store_state(hass, entry.entry_id, result["task_id"]).get("last_performed") == day.isoformat()
    assert _stock(hass, entry, FILTER) == 3

    tomorrow = (dt_util.now().date() + timedelta(days=1)).isoformat()
    assert_ws_error(await _buy(hass, entry, FILTER, date=tomorrow), "invalid_date")
    assert_ws_error(await _buy(hass, entry, FILTER, date="last week"), "invalid_date")
    assert _stock(hass, entry, FILTER) == 3, "refused before anything was booked"


# ─── a part that counts when used ───────────────────────────────────────────


def test_the_price_is_averaged_with_the_stock_on_the_shelf() -> None:
    jug = {"cost": 10, "package_size": 5, "restock_quantity": 2}
    # 12 l at 10 a jug + 2 jugs (10 l) at 14 a jug = 22 l at 11.82 a jug.
    assert averaged_price(jug, 28, 2, owned_after=22) == 11.82
    # An empty shelf, or no price so far: what was paid.
    assert averaged_price(jug, 28, 2, owned_after=10) == 14
    assert averaged_price({**jug, "cost": None}, 28, 2, owned_after=22) == 14
    # Per unit without a package size; the restock amount when not given.
    assert averaged_price({"cost": 8}, 30, 3, owned_after=4) == 9.5
    assert averaged_price({"cost": 8, "restock_quantity": 2}, 20, None, owned_after=3) == 9.33
    assert averaged_price(jug, 0, 2, owned_after=22) is None, "nothing paid, nothing to learn"


async def test_counted_when_used_the_purchase_is_stock_at_the_average_price(hass: HomeAssistant) -> None:
    """The second problem of the report: buying at another price revalued
    the stock still there. 12 l at 10 a jug, 2 jugs bought at 14."""
    entry = await _shelf(hass, house="use")
    result = assert_ws_success(await _buy(hass, entry, FLUID, quantity=2, unit_price=14))
    assert result["cost"] == 28
    assert _price(hass, entry, FLUID) == 11.82
    assert compute_spend(hass) == (0, 0), "stock, not spending: it counts when used"
    [done] = _completions(hass, entry, result["task_id"])
    assert done["cost"] == 28 and done.get("cost_basis") == "use"


async def test_the_buy_reminder_averages_too(hass: HomeAssistant) -> None:
    """Completing the reminder itself is the same purchase."""
    entry = await _shelf(hass, house="use", fluid_stock=5)
    [reminder_id] = _buy_tasks(hass, entry)
    await _live(hass, entry).runtime_data.coordinator.complete_maintenance(reminder_id, cost=40, restock_quantity=2)
    await hass.async_block_till_done()
    # 5 l at 10 a jug + 10 l at 20 a jug = 15 l at 16.67 a jug.
    assert _price(hass, entry, FLUID) == 16.67


# ─── archived, paused ───────────────────────────────────────────────────────


async def test_an_archived_object_takes_no_purchase(hass: HomeAssistant) -> None:
    entry = await _shelf(hass, object_extra={"archived_at": "2026-01-01T00:00:00+00:00"})
    code, _msg = assert_ws_error(await _buy(hass, entry, FILTER, unit_price=8))
    assert code == "part_owner_archived"
    assert _stock(hass, entry, FILTER) == 1
    assert not _buy_tasks(hass, entry)


async def test_a_paused_object_still_takes_a_purchase(hass: HomeAssistant) -> None:
    """The pool's chlorine bought on sale in winter."""
    entry = await _shelf(hass, object_extra={"paused_at": "2026-01-01T00:00:00+00:00"})
    result = assert_ws_success(await _buy(hass, entry, FILTER, quantity=2, unit_price=8))
    assert _stock(hass, entry, FILTER) == 3
    assert _buy_tasks(hass, entry)[result["task_id"]].get(POOL_IN_USE_FIELD) is True
    assert [c["cost"] for c in _completions(hass, entry, result["task_id"])] == [16]
    assert _live(hass, entry).data[CONF_OBJECT].get("paused_at"), "still paused"


async def test_an_unknown_part_and_both_prices(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    assert_ws_error(await _buy(hass, entry, "nope"), "not_found")
    base = {"id": 1, "type": "maintenance_supporter/part/purchase", "entry_id": "e", "part_id": "p"}
    ws_part_purchase._ws_schema({**base, "quantity": 2, "unit_price": 3.5, "date": "2026-10-01", "notes": "x"})  # type: ignore[attr-defined]
    for bad in ({"unit_price": 3, "cost": 6}, {"quantity": 0}, {"unit_price": -1}, {"cost": "x"}):
        with pytest.raises(vol.Invalid):
            ws_part_purchase._ws_schema({**base, **bad})  # type: ignore[attr-defined]


# ─── the service ────────────────────────────────────────────────────────────


def _sensor(hass: HomeAssistant, entry: MockConfigEntry, part_id: str) -> str:
    reg = er.async_get(hass)
    return next(e.entity_id for e in er.async_entries_for_config_entry(reg, entry.entry_id) if e.unique_id.endswith(f"_part_{part_id}"))


async def test_the_service(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    fluid = _sensor(hass, entry, FLUID)
    day = dt_util.now().date() - timedelta(days=2)
    resp = await hass.services.async_call(
        DOMAIN, "part_purchase", {"entity_id": fluid, "quantity": 1, "cost": 9.5, "date": day.isoformat()}, blocking=True, return_response=True
    )
    await hass.async_block_till_done()
    [part] = resp["parts"]
    assert part["entity_id"] == fluid and part["stock"] == 17 and part["cost"] == 9.5
    [done] = _completions(hass, entry, part["task_id"])
    assert dt_util.as_local(dt_util.parse_datetime(done["timestamp"])).date() == day
    assert hass.states.get(fluid).state == "17"

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_purchase", {"entity_id": fluid, "date": date.max.isoformat()}, blocking=True)
    assert err.value.translation_key == "date_in_future", "the WebSocket command's words"
    with pytest.raises(vol.Invalid):
        await hass.services.async_call(DOMAIN, "part_purchase", {"entity_id": fluid, "unit_price": 1, "cost": 2}, blocking=True)
    assert _stock(hass, entry, FLUID) == 17


async def test_the_service_holds_a_calling_user_to_the_write_tier(hass: HomeAssistant) -> None:
    entry = await _shelf(hass)
    fluid = _sensor(hass, entry, FLUID)
    await hass.auth.async_create_user("Parent", group_ids=["system-admin"])
    kid = await hass.auth.async_create_user("Kid")
    with pytest.raises(Unauthorized):
        await hass.services.async_call(DOMAIN, "part_purchase", {"entity_id": fluid}, blocking=True, context=Context(user_id=kid.id))
    assert _stock(hass, entry, FLUID) == 12
