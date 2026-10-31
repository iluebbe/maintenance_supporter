"""DRY audit round 6 (2026-10-30), tranche 2: the drift outside v2.113.

Each section names its finding; the audit's notes are in the round's
memory file.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.helpers.parts import round_qty
from custom_components.maintenance_supporter.helpers.parts_cost import parts_value, purchase_unit_price
from custom_components.maintenance_supporter.helpers.rounding import round2

_VECTORS = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
    / "__tests__"
    / "fixtures"
    / "rounding-vectors.json"
)


# ─── X6-A1: one rounding rule for money and quantities ──────────────────────


def test_round2_gives_what_the_panel_gives() -> None:
    """frontend-src/__tests__/rounding-vectors.test.ts checks the same pairs
    against Math.round."""
    vectors = json.loads(_VECTORS.read_text(encoding="utf-8"))["vectors"]
    assert len(vectors) > 10
    for value, expected in vectors:
        assert round2(value) == expected, value


def test_a_half_goes_up_where_the_panel_shows_it() -> None:
    """4.50 for four: the purchase dialog shows 1.13 each, and 1.13 is what
    the purchase books as the price paid."""
    assert purchase_unit_price({"restock_quantity": 1}, 4.5, 4) == 1.13
    assert round_qty(0.125) == 0.13
    assert parts_value([{"part_id": "p", "unit_cost": 0.25, "quantity": 0.5}]) == 0.13
    assert round_qty(2.0) == 2 and isinstance(round_qty(2.0), int)
    assert round2(float("inf")) == float("inf")


# ─── BR6-A9: the battery fleet's cells count when bought, everywhere ────────


async def test_a_fleet_cell_taken_through_a_pool_is_not_booked_when_used(hass: HomeAssistant) -> None:
    """Under "count when used" the fleet's purchase counts (S-6); a pool
    link from another object booked the cell's value a second time."""
    from custom_components.maintenance_supporter.const import BATTERY_FLEET_OBJECT_FLAG, CONF_PARTS_COST_MODE, DOMAIN
    from custom_components.maintenance_supporter.helpers.parts import normalize_part
    from custom_components.maintenance_supporter.helpers.parts_cost import entry_spend

    from .conftest import build_object_data, build_object_entry_data, build_task_data, make_global_entry, make_object_entry, setup_integration

    obj_data = build_object_data(name="Battery Fleet", object_id="battery_fleet")
    obj_data[BATTERY_FLEET_OBJECT_FLAG] = True
    data = build_object_entry_data(object_data=obj_data, tasks={})
    data["parts"] = {"batt_aa": normalize_part({"id": "batt_aa", "name": "AA battery", "cost": 0.5})}
    fleet = MockConfigEntry(version=1, minor_version=4, domain=DOMAIN, title="Battery Fleet", data=data, source="user", unique_id="ms_r6_fleet")
    fleet.add_to_hass(hass)
    task = {**build_task_data(task_id="swap", object_id="remote"), "consumes_parts": [{"part_id": "batt_aa", "entry_id": fleet.entry_id, "quantity": 2}]}
    remote = make_object_entry(hass, tasks={"swap": task}, name="Remote", uid="remote", object_data=build_object_data(name="Remote", object_id="remote"))
    await setup_integration(hass, make_global_entry(hass, options={CONF_PARTS_COST_MODE: "use"}), fleet, remote)
    fleet.runtime_data.store.set_part_stock("batt_aa", 10)

    await remote.runtime_data.coordinator.complete_maintenance("swap")
    await hass.async_block_till_done()
    done = remote.runtime_data.store.get_history("swap")[-1]
    assert done.get("cost_basis") != "use"
    assert entry_spend(done) == 0, "the cells were spending when the fleet bought them"
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 8, "still taken off the shelf"


# ─── BI6-A4: one rule for who a task is for ─────────────────────────────────


def test_normalize_people_is_the_one_stored_shape() -> None:
    from custom_components.maintenance_supporter.helpers.sanitize import normalize_people

    task: dict[str, Any] = {"assignee_pool": [], "rotation_strategy": None}
    normalize_people(task)
    assert task == {}, "no pool and no rotation are absent, not [] and None"

    task = {"assignee_pool": ["ann"], "rotation_strategy": "round_robin", "responsible_user_id": "bob"}
    normalize_people(task)
    assert task == {"assignee_pool": ["ann"], "responsible_user_id": "ann"}, "a rotation of one hands nothing on; the one left is on duty"

    task = {"assignee_pool": [" ann ", "ben", "ann"], "rotation_strategy": "round_robin"}
    normalize_people(task)
    assert task == {"assignee_pool": ["ann", "ben"], "rotation_strategy": "round_robin", "responsible_user_id": "ann"}

    task = {"assignee_pool": ["ann", "ben"], "rotation_strategy": "sideways"}
    normalize_people(task)
    assert "rotation_strategy" not in task


async def test_emptying_shared_with_ends_the_rotation_as_the_action_says(hass: HomeAssistant) -> None:
    """The service refused it: "A rotation needs at least two people"."""
    from .test_shared_assignees import _household, _update

    _ann, _ben, _bob, entry = await _household(hass)
    task = await _update(hass, entry, "rota", shared_with=[])
    assert "assignee_pool" not in task and "rotation_strategy" not in task


async def test_the_websocket_update_stores_no_empty_pool_and_no_rotation_of_one(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    from .conftest import assert_ws_success, call_ws_handler, make_ws_connection
    from .test_shared_assignees import _household

    ann, _ben, _bob, entry = await _household(hass)
    conn = make_ws_connection()
    conn.user.is_admin = True
    msg = {"id": 1, "type": "x", "entry_id": entry.entry_id, "task_id": "rota", "assignee_pool": [ann.id], "rotation_strategy": "round_robin"}
    await call_ws_handler(ws_update_task, hass, conn, msg)
    assert_ws_success(conn)
    await hass.async_block_till_done()
    task = hass.config_entries.async_get_entry(entry.entry_id).data["tasks"]["rota"]
    assert task["assignee_pool"] == [ann.id] and "rotation_strategy" not in task and task["responsible_user_id"] == ann.id

    conn = make_ws_connection()
    conn.user.is_admin = True
    await call_ws_handler(ws_update_task, hass, conn, {**msg, "assignee_pool": [], "rotation_strategy": None})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    assert "assignee_pool" not in hass.config_entries.async_get_entry(entry.entry_id).data["tasks"]["rota"]


# ─── BR6-A4: the cells a battery holds decide it everywhere ─────────────────


def test_the_overview_goes_by_the_cells_the_battery_holds() -> None:
    """D#213: the note names disposables, NiMH cells went in at the last
    Replaced. Only the auto-record knew: the shopping list said to buy AA."""
    from datetime import date

    from custom_components.maintenance_supporter.helpers.battery_fleet import Battery, build_overview

    lock = Battery(entity_id="sensor.lock_battery_plus", device_name="Lock", battery_type="AA", quantity=4, low=True, level=10, last_replaced=None)
    by_note = build_overview([lock], today=date(2026, 10, 30))
    assert by_note.needs_now == {"AA": 4}
    held = build_overview([lock], today=date(2026, 10, 30), held={lock.entity_id: "AA NIMH"})
    assert held.needs_now == {}, "charged, not bought"
    assert held.low[0]["rechargeable"] is True


# ─── BR6-A5: the trigger detail rides on a triggered reminder only ──────────


async def test_the_event_carries_the_trigger_detail_only_while_triggered(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_LEAD_TIME, KIND_STATUS, notification_context

    from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry, set_sensor_state, setup_integration

    set_sensor_state(hass, "sensor.pills", "2", {"low": "Trulicity: 3 left"})
    task = build_task_data(task_id=TASK_ID_1, schedule_type="sensor_based", interval_days=None, trigger_config={
        "type": "threshold", "entity_id": "sensor.pills", "entity_ids": ["sensor.pills"], "trigger_below": 5, "detail_attribute": "low",
    })
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, make_global_entry(hass), obj)

    def detail(kind: str, status: str | None) -> Any:
        return notification_context(hass, kind, status=status, entry_id=obj.entry_id, task_id=TASK_ID_1)["trigger_detail"]

    assert detail(KIND_STATUS, "triggered") == "Trulicity: 3 left"
    assert detail(KIND_STATUS, "overdue") is None
    assert detail(KIND_LEAD_TIME, "due_soon") is None
    bundle = notification_context(hass, KIND_STATUS, entry_id=obj.entry_id, tasks=[{"task_id": TASK_ID_1, "status": "due_soon"}])
    assert bundle["tasks"][0]["trigger_detail"] is None


# ─── BR6-A6: a person's tick on a list takes the prefill ────────────────────


async def test_a_shopping_list_tick_records_the_prefill_like_a_to_do_tick(hass: HomeAssistant) -> None:
    from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry, setup_integration

    task = {**build_task_data(task_id=TASK_ID_1), "quick_complete_defaults": {"cost": 4.5, "notes": "Corner shop"}}
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, make_global_entry(hass), obj)
    coordinator = obj.runtime_data.coordinator
    for source in ("shopping_list", "todo_mirror"):
        await coordinator.complete_maintenance(TASK_ID_1, unattended=True, source=source)
        await hass.async_block_till_done()
        last = obj.runtime_data.store.get_history(TASK_ID_1)[-1]
        assert (last.get("cost"), last.get("notes")) == (4.5, "Corner shop"), source
        coordinator._recently_completed.clear()
    await coordinator.complete_maintenance(TASK_ID_1, unattended=True, source="service")
    await hass.async_block_till_done()
    assert obj.runtime_data.store.get_history(TASK_ID_1)[-1].get("cost") is None, "an automation did no work"


# ─── BI6-A8: a replaced object hands on what sits inside it ─────────────────


async def test_the_successor_holds_the_sub_objects(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_OBJECT, DOMAIN
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    from .conftest import assert_ws_success
    from .test_audit_2026_09_27_t4_interfaces import _add_object, _live, _setup, _ws

    car = await _setup(hass, name="Car", uid="car")
    box = await _add_object(hass, name="Roof box", uid="roof_box")
    obj = dict(box.data[CONF_OBJECT])
    hass.config_entries.async_update_entry(box, data={**box.data, CONF_OBJECT: {**obj, "parent_entry_id": car.entry_id}})

    new_id = assert_ws_success(await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": car.entry_id}))["entry_id"]
    assert _live(hass, box.entry_id).data[CONF_OBJECT]["parent_entry_id"] == new_id
    assert _live(hass, new_id).data[CONF_OBJECT].get("parent_entry_id") is None, "the successor sits where the car sat"


# ─── BI6-A7: the CSV keeps what sits inside what ────────────────────────────


async def test_the_csv_carries_the_parent(hass: HomeAssistant) -> None:
    """The import remaps it to the new entry ids like the predecessor
    (_ImportLineage); without the column every object came back on its own."""
    from custom_components.maintenance_supporter.const import CONF_OBJECT
    from custom_components.maintenance_supporter.helpers.csv_handler import export_objects_csv, import_objects_csv

    from .test_audit_2026_09_27_t4_interfaces import _add_object, _setup

    car = await _setup(hass, name="Car", uid="car")
    box = await _add_object(hass, name="Roof box", uid="roof_box")
    hass.config_entries.async_update_entry(box, data={**box.data, CONF_OBJECT: {**box.data[CONF_OBJECT], "parent_entry_id": car.entry_id}})

    parsed = {o["object"]["name"]: o for o in import_objects_csv(export_objects_csv(hass), hass=hass)}
    assert parsed["Roof box"]["object"]["parent_entry_id"] == car.entry_id
    assert parsed["Roof box"]["entry_id"] == box.entry_id
    assert parsed["Car"]["object"]["parent_entry_id"] is None


# ─── T3: one walker for the entities a trigger names ────────────────────────


async def test_a_swapped_device_moves_a_compound_conditions_nested_trigger(hass: HomeAssistant) -> None:
    """The rename walked ``conditions[].trigger_config``, the device swap
    did not: a condition stored that way kept watching the old device."""
    from custom_components.maintenance_supporter.helpers.device_swap import move_tasks_to_device

    from .conftest import build_task_data
    from .test_device_swap import _vacuum

    old_dev, old = _vacuum(hass, "q7_old", "Robot Old")
    new_dev, new = _vacuum(hass, "q7_new", "Robot New")
    task = build_task_data(task_id="t", name="Brush")
    task["trigger_config"] = {
        "type": "compound",
        "conditions": [{"trigger_config": {"type": "threshold", "entity_id": old["main_brush_time_left"], "trigger_below": 5}}],
        "_trigger_state": {old["main_brush_time_left"]: {"since": 1}},
    }
    moved, report = move_tasks_to_device(hass, {"t": task}, {old_dev.id}, new_dev.id, user_id=None)
    trigger = moved["t"]["trigger_config"]
    assert trigger["conditions"][0]["trigger_config"]["entity_id"] == new["main_brush_time_left"]
    assert trigger["_trigger_state"] == {old["main_brush_time_left"]: {"since": 1}}, "a new device starts fresh"
    assert report.moved == 1
