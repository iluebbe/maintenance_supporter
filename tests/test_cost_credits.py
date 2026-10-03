"""Credits: a negative cost (#200).

The old washing machine sold for €150 after the replacement, a refund from
the shop: money that comes back. The cost field refused anything below zero,
so the totals could only overstate what a room or an appliance cost. A cost
may now be negative down to -MAX_COST: every total nets it — the task, the
budget, the areas — while the average cost per completion leaves them out
(a sale is no job).
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import CONF_TASKS, MAX_COST, MIN_COST
from custom_components.maintenance_supporter.helpers.area_costs import entry_cost
from custom_components.maintenance_supporter.helpers.budget import compute_spend
from custom_components.maintenance_supporter.helpers.history import finite_amount, signed_amount
from custom_components.maintenance_supporter.helpers.sanitize import cap_quick_complete_defaults_field
from custom_components.maintenance_supporter.websocket.io import _sanitize_history
from custom_components.maintenance_supporter.websocket.tasks_actions import ws_complete_task
from custom_components.maintenance_supporter.websocket.tasks_history import ws_update_history_entry

from .conftest import (
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


def _now_iso() -> str:
    return dt_util.now().isoformat()


def test_cost_reads_signed_and_duration_stays_non_negative() -> None:
    assert signed_amount(-150) == -150.0 and signed_amount("-12.5") == -12.5
    assert signed_amount(float("nan")) is None and signed_amount(True) is None
    assert finite_amount(-5) is None and finite_amount("30") == 30.0
    assert MIN_COST == -MAX_COST


def test_bounds_on_every_writer() -> None:
    base = {"type": "maintenance_supporter/task/complete", "id": 1, "entry_id": "e", "task_id": "t"}
    assert ws_complete_task._ws_schema({**base, "cost": MIN_COST})["cost"] == MIN_COST  # type: ignore[attr-defined]
    with pytest.raises(vol.Invalid):
        ws_complete_task._ws_schema({**base, "cost": MIN_COST - 1})  # type: ignore[attr-defined]
    patch = {"type": "maintenance_supporter/task/history/update", "id": 1, "entry_id": "e", "task_id": "t", "original_timestamp": "2026-01-01T00:00:00"}
    assert ws_update_history_entry._ws_schema({**patch, "cost": -20})["cost"] == -20  # type: ignore[attr-defined]
    data: dict[str, Any] = {"quick_complete_defaults": {"cost": -30}}
    cap_quick_complete_defaults_field(data)
    assert data["quick_complete_defaults"]["cost"] == -30.0
    kept = _sanitize_history([{"type": "completed", "cost": -150}, {"type": "completed", "cost": -2 * MAX_COST}])
    assert kept[0]["cost"] == -150 and "cost" not in kept[1]


async def _setup_washer(hass: HomeAssistant) -> Any:
    now = _now_iso()
    history = [
        {"type": "completed", "timestamp": now, "cost": 200.0, "notes": "repair"},
        {"type": "completed", "timestamp": now, "cost": -150.0, "notes": "old drum sold"},
    ]
    task = {**build_task_data(task_id="repair", name="Repair"), "history": history}
    entry = make_object_entry(hass, tasks={"repair": task}, name="Washer", uid="washer", object_data={"name": "Washer", "area_id": "laundry"})
    await setup_integration(hass, make_global_entry(hass), entry)
    return entry


async def test_totals_net_credits_and_the_payload_names_them(hass: HomeAssistant) -> None:
    entry = await _setup_washer(hass)
    coordinator = entry.runtime_data.coordinator
    task = coordinator.data[CONF_TASKS]["repair"]
    assert task["_total_cost"] == 50.0, "200 spent, 150 back"
    assert task["_average_cost"] == 200.0, "the credit is no job: one completion at 200"
    _month, year = compute_spend(hass)
    assert year == 50.0, "the budget counts the credit"
    area = entry_cost(hass, entry)
    assert area is not None and area.total == 50.0, "the area cost sensors (state class total) fall with it"

    from custom_components.maintenance_supporter.websocket import _build_task_summary

    payload = _build_task_summary(hass, "repair", dict(entry.data[CONF_TASKS]["repair"]), task)
    assert payload["total_cost"] == 50.0 and payload["average_cost"] == 200.0


async def test_a_credit_is_booked_from_the_panel_and_edited_in_the_history(hass: HomeAssistant) -> None:
    earlier = (dt_util.now() - timedelta(days=1)).isoformat()
    task = {**build_task_data(task_id="sell", name="Sell the old unit"), "history": [{"type": "completed", "timestamp": earlier, "cost": 10.0}]}
    entry = make_object_entry(hass, tasks={"sell": task}, name="Old washer", uid="old_washer")
    await setup_integration(hass, make_global_entry(hass), entry)

    conn = make_ws_connection()
    await call_ws_handler(ws_complete_task, hass, conn, {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": entry.entry_id, "task_id": "sell", "cost": -120.0})
    await hass.async_block_till_done()
    assert not conn.send_error.called, conn.send_error.call_args
    store = entry.runtime_data.store
    costs = [h.get("cost") for h in store.get_history("sell")]
    assert -120.0 in costs

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {"id": 2, "type": "maintenance_supporter/task/history/update", "entry_id": entry.entry_id, "task_id": "sell", "original_timestamp": earlier, "cost": -10.0},
    )
    await hass.async_block_till_done()
    assert not conn.send_error.called, conn.send_error.call_args
    assert [h.get("cost") for h in store.get_history("sell")].count(-10.0) == 1
