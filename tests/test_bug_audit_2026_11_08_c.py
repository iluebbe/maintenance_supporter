"""Bug audit 2026-11-08, tranche C: the Low findings left open after A and B.

One test (or a few) per finding; each fails without its fix.

- T8-5: a task its sensor triggered may be completed inside its completion
  window, whatever its safety interval says
- T8-6: a reset that finds the rule on the normal side has seen it there: a
  new firing right after the recovery's completion is a new episode
- O8-8: a compound demoted to its last condition keeps what it said itself
- N8-8: every item of a place's reminder carries its own task's facts
- N8-5: a buy reminder stays off the shopping list the shopping sync fills
- N8-6: a row that could not be removed keeps its record
- N8-3: a lead reminder leaves once the day it named is no longer the task's
- N8-7: a bundle and the quiet-hours summary leave once none of their tasks
  needs doing
- N8-9: an article is no name ("change a filter" does not pick "Filter A")
- O8-3: no update towards a duty the template does not create in this home
- O8-4 / O8-5: the device of the unit an object replaced counts as its old
  one, and the device-link repair moves the wiring like the settings do
- O8-7: the last entry to go still purges its reminders and its trace
- P8-3: a sensorless battery is judged by the cells it holds
- P8-4: an archived task takes no place among the tasks an object may have
- W8-3: the trace's "before" of Last performed comes from the Store
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    MAX_TASKS_PER_OBJECT,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers import template_updates as tu
from custom_components.maintenance_supporter.helpers.device_swap import predecessor_device_ids
from custom_components.maintenance_supporter.helpers.entry_tasks import MAX_STORED_TASKS_PER_OBJECT, task_room
from custom_components.maintenance_supporter.helpers.intent_match import match_rows
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager, task_key_of
from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_PLACE_ARRIVAL, notification_context
from custom_components.maintenance_supporter.helpers.task_apply import note_task_edit
from custom_components.maintenance_supporter.helpers.task_trace import get_trace
from custom_components.maintenance_supporter.helpers.todo_mirror import TodoMirror, lists_for
from custom_components.maintenance_supporter.repairs import DeviceLinkRepairFlow, MissingTriggerEntityRepairFlow

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_task_data,
    make_global_entry,
    make_object_entry,
    setup_integration,
)
from .test_battery_fleet import _set_type_note
from .test_template_updates import NORTH, _made, _tt

SENSOR = "sensor.tranche_c_reading"
NO_QUIET_HOURS = {CONF_QUIET_HOURS_ENABLED: False}


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _status(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    return str(_coordinator(hass, entry).data[CONF_TASKS][TASK_ID_1].status)


async def _reading(hass: HomeAssistant, value: str) -> None:
    hass.states.async_set(SENSOR, value, {"unit_of_measurement": "%"})
    await hass.async_block_till_done()


async def _sensor_task(hass: HomeAssistant, uid: str, **task_extra: Any) -> MockConfigEntry:
    hass.states.async_set(SENSOR, "40", {"unit_of_measurement": "%"})
    trigger = {"type": "threshold", "entity_id": SENSOR, "entity_ids": [SENSOR], "trigger_above": 80, **task_extra.pop("trigger", {})}
    task = build_task_data(name="Empty the tank", schedule_type="sensor_based", interval_days=None, trigger_config=trigger) | task_extra
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Tank", uid=uid)
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    return obj


# ─── T8-5 / T8-6: triggers ──────────────────────────────────────────────────


async def test_t8_5_a_triggered_task_may_be_completed_inside_its_window(hass: HomeAssistant) -> None:
    last = (dt_util.now().date() - timedelta(days=100)).isoformat()
    obj = await _sensor_task(hass, "t85", interval_days=365, last_performed=last, earliest_completion_days=30)
    coordinator = _coordinator(hass, obj)
    assert coordinator.completion_blocked(TASK_ID_1) is True, "not triggered, 265 days to go: too early"
    assert coordinator.unattended_refusal(TASK_ID_1, source="button") == "too_early"

    await _reading(hass, "85")
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    assert coordinator.completion_blocked(TASK_ID_1) is False, "its sensor says it is due"
    assert coordinator.unattended_refusal(TASK_ID_1, source="button") != "too_early"
    await coordinator.complete_maintenance(TASK_ID_1, notes="emptied")  # refused as too early before


async def test_t8_6_a_firing_right_after_the_recovery_is_a_new_episode(hass: HomeAssistant) -> None:
    obj = await _sensor_task(hass, "t86", trigger={"auto_complete_on_recovery": True})
    await _reading(hass, "85")
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    await _reading(hass, "10")  # the recovery records the completion (#53)
    assert _status(hass, obj) == MaintenanceStatus.OK
    history = _coordinator(hass, obj)._get_merged_tasks_data()[TASK_ID_1].get("history") or []
    assert [h["type"] for h in history if h["type"] == "completed"], "the recovery completed the task"
    await _reading(hass, "85")  # a sensor that reports only changes: 1, 0, 1
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED, "read OK for the completion cooldown although it had fired again"


async def test_t8_6_a_completion_while_still_over_the_limit_keeps_waiting(hass: HomeAssistant) -> None:
    """The other side: done by hand while the reading still stands is the old
    episode, not a new one."""
    obj = await _sensor_task(hass, "t86b")
    await _reading(hass, "85")
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1, notes="emptied")
    await hass.async_block_till_done()
    await _reading(hass, "86")
    assert _status(hass, obj) == MaintenanceStatus.OK


# ─── O8-8: the missing-trigger repair ───────────────────────────────────────


def test_o8_8_a_demoted_compound_keeps_what_it_said_itself() -> None:
    trigger = {
        "type": "compound",
        "compound_logic": "AND",
        "auto_complete_on_recovery": True,
        "detail_attribute": "low",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.gone", "entity_ids": ["sensor.gone"], "trigger_above": 5},
            {"type": "threshold", "entity_id": "sensor.kept", "entity_ids": ["sensor.kept"], "trigger_below": 3, "detail_attribute": "own"},
        ],
    }
    task: dict[str, Any] = {"id": "t", "trigger_config": trigger}
    note = MissingTriggerEntityRepairFlow._remove_from_compound(None, task, dict(trigger), "sensor.gone")  # type: ignore[arg-type]
    assert "demoted" in note
    single = task["trigger_config"]
    assert single["type"] == "threshold" and single["entity_ids"] == ["sensor.kept"]
    assert single["auto_complete_on_recovery"] is True, "the task stopped completing itself on recovery"
    assert single["detail_attribute"] == "own", "the condition's own value wins"
    assert "compound_logic" not in single and "conditions" not in single


# ─── N8-8: the place's reminder ─────────────────────────────────────────────


async def test_n8_8_a_places_reminder_carries_each_tasks_own_facts(hass: HomeAssistant) -> None:
    pool = make_object_entry(hass, tasks={"t1": build_task_data(task_id="t1", name="Chlorine") | {"priority": "high", "labels": ["water"]}}, name="Pool", uid="n88_pool")
    shed = make_object_entry(hass, tasks={"t2": build_task_data(task_id="t2", name="Oil") | {"notes": "SAE 30"}}, name="Shed", uid="n88_shed")
    ctx = notification_context(
        hass,
        KIND_PLACE_ARRIVAL,
        tasks=[
            {"entry_id": pool.entry_id, "task_id": "t1", "task_name": "Chlorine", "status": "overdue"},
            {"entry_id": shed.entry_id, "task_id": "t2", "task_name": "Oil", "status": "due_soon"},
        ],
    )
    first, second = ctx["tasks"]
    assert first["priority"] == "high" and first["labels"] == ["water"], first
    assert second["notes"] == "SAE 30" and second["priority"] == "normal"
    assert first["task_name"] == "Chlorine" and first["status"] == "overdue", "the caller's own fields win"
    # An item that names no object, or one that is gone, stays as it came.
    bare = notification_context(hass, KIND_PLACE_ARRIVAL, tasks=[{"task_id": "t1"}, {"entry_id": "nope", "task_id": "t1"}])["tasks"]
    assert all("priority" not in item for item in bare)


# ─── N8-5 / N8-6: the to-do mirror ──────────────────────────────────────────


def test_n8_5_a_buy_reminder_stays_off_the_shopping_list() -> None:
    family, chores = "todo.family", "todo.chores"
    buy = {"name": "Buy chlorine", "part_ref": {"part_id": "p1"}}
    plain = {"name": "Clean filter"}
    assert lists_for(buy, [family, chores], family) == [chores], "the shopping sync keeps its row there"
    assert lists_for(plain, [family, chores], family) == [family, chores]
    assert lists_for(buy, [family, chores], None) == [family, chores], "no shopping list: nothing to double"
    assert lists_for({**buy, "mirror_todo_entities": [family]}, [chores], family) == [], "its own list too"


async def test_n8_6_a_row_that_could_not_be_removed_keeps_its_record(hass: HomeAssistant) -> None:
    mirror = TodoMirror(hass)
    rec = {"uid": "u1", "summary": "Pool: Chlorine"}
    # A cloud list that is unavailable: still to do.
    hass.states.async_set("todo.cloud", "unavailable")
    assert await mirror._remove_item("todo.cloud", rec) is False
    # Not loaded yet at a start (registered, no state): still to do.
    er.async_get(hass).async_get_or_create("todo", "test", "late", suggested_object_id="late")
    assert hass.states.get("todo.late") is None
    assert await mirror._remove_item("todo.late", rec) is False
    # Gone entirely: nothing to do.
    assert await mirror._remove_item("todo.never_was", rec) is True

    # The call fails: the record goes only when the row is seen to be gone.
    hass.states.async_set("todo.list", "1")
    with patch("custom_components.maintenance_supporter.helpers.todo_mirror.async_todo_remove_item", AsyncMock(return_value=False)):
        mirror._get_items = AsyncMock(return_value=[{"uid": "u1", "summary": "Pool: Chlorine"}])  # type: ignore[method-assign]
        assert await mirror._remove_item("todo.list", rec) is False, "still on the list"
        mirror._get_items = AsyncMock(return_value=[{"uid": "other"}])  # type: ignore[method-assign]
        assert await mirror._remove_item("todo.list", rec) is True, "cleared by hand meanwhile"
        mirror._get_items = AsyncMock(return_value=None)  # type: ignore[method-assign]
        assert await mirror._remove_item("todo.list", rec) is False, "the list cannot be read"


# ─── N8-3 / N8-7: reminders that stayed on the phones ───────────────────────


def test_n8_3_a_lead_reminder_leaves_when_its_day_moved(hass: HomeAssistant) -> None:
    nm = NotificationManager(hass)
    key = task_key_of("e1", "t1")
    nm._on_phones[key] = "lead:2026-11-20"
    assert nm.take_outdated_off_phones("e1", "t1", inert=False, next_due="2026-11-20") is False, "it still says rightly that the task comes up"
    assert nm.take_outdated_off_phones("e1", "t1", inert=False) is False, "no date to compare"
    assert nm.take_outdated_off_phones("e1", "t1", inert=False, next_due="2026-12-04") is True, "postponed: the day it named is gone"
    assert key not in nm._on_phones
    # A lead reminder sent before this fix names no day and stays, as it did.
    nm._on_phones[key] = "lead"
    assert nm.take_outdated_off_phones("e1", "t1", inert=False, next_due="2026-12-04") is False
    assert nm.take_outdated_off_phones("e1", "t1", inert=True, next_due="2026-12-04") is True
    # A status reminder is outdated as before.
    nm._on_phones[key] = "status"
    assert nm.take_outdated_off_phones("e1", "t1", inert=False, next_due="2026-12-04") is True


async def test_n8_3_the_lead_reminder_remembers_the_day_it_named(hass: HomeAssistant) -> None:
    make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data=NO_QUIET_HOURS)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(name="Clean filter")}, name="Dishwasher", uid="n83")
    hass.services.async_register("notify", "test", AsyncMock())
    nm = NotificationManager(hass)
    await nm.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Clean filter", "Dishwasher", days=3, next_due="2026-11-20")
    await hass.async_block_till_done()
    assert nm._on_phones[task_key_of(obj.entry_id, TASK_ID_1)] == "lead:2026-11-20"


async def test_n8_7_a_bundle_leaves_once_none_of_its_tasks_needs_doing(hass: HomeAssistant) -> None:
    nm = NotificationManager(hass)
    first, second = task_key_of("e1", "t1"), task_key_of("e1", "t2")
    nm._note_group_push("maintenance_bundle_e1", [first, second], ["notify.mobile_app_phone", ""], replace=True)
    with patch.object(nm, "_async_dismiss_tag", AsyncMock()) as dismiss:
        nm.clear_task_state("e1", "t1")  # done
        await hass.async_block_till_done()
        dismiss.assert_not_awaited()
        assert nm._group_pushes["maintenance_bundle_e1"]["members"] == [second]
        assert nm.take_outdated_off_phones("e1", "t2", inert=False) is False  # the sensor recovered: no push of its own
        await hass.async_block_till_done()
        dismiss.assert_awaited_once_with("maintenance_bundle_e1", ["notify.mobile_app_phone"])
    assert nm._group_pushes == {}

    # The quiet-hours summary adds up over its recipients; a deleted object's tasks leave it.
    nm._note_group_push("quiet", [task_key_of("e1", "t1")], ["notify.a"], replace=False)
    nm._note_group_push("quiet", [task_key_of("e2", "t9")], ["notify.b"], replace=False)
    assert nm._group_pushes["quiet"] == {"members": [task_key_of("e1", "t1"), task_key_of("e2", "t9")], "targets": ["notify.a", "notify.b"]}
    restored = NotificationManager(hass)
    with patch.object(restored._store, "async_load", AsyncMock(return_value=nm._snapshot())):
        await restored.async_load()
    assert restored._group_pushes == nm._group_pushes, "kept over a restart"
    with patch.object(nm, "_async_dismiss_tag", AsyncMock()) as dismiss:
        nm.purge_entry("e1")
        nm.purge_entry("e2")
        await hass.async_block_till_done()
        dismiss.assert_awaited_once_with("quiet", ["notify.a", "notify.b"])


# ─── N8-9: voice ────────────────────────────────────────────────────────────


def test_n8_9_an_article_is_no_name() -> None:
    rows = [
        {"name": "Change filter", "object_name": "Filter A", "task_id": "a"},
        {"name": "Change filter", "object_name": "Filter B", "task_id": "b"},
    ]
    assert len(match_rows("change a filter", rows, "en")) == 2, "it picked Filter A and completed it"
    assert [r["task_id"] for r in match_rows("change filter a", rows, "en")] == ["a"], "as the last word it is the name"
    assert [r["task_id"] for r in match_rows("change filter b", rows, "en")] == ["b"]
    pumps = [
        {"name": "Pulire i filtri", "object_name": "Pompa I", "task_id": "1"},
        {"name": "Pulire i filtri", "object_name": "Pompa II", "task_id": "2"},
    ]
    assert len(match_rows("pulire i filtri pompa", pumps, "it")) == 2
    # A digit counts wherever it stands (bug audit 2026-10-17, N-7).
    detectors = [
        {"name": "Battery", "object_name": "Smoke detector 1", "task_id": "1"},
        {"name": "Battery", "object_name": "Smoke detector 2", "task_id": "2"},
    ]
    assert [r["task_id"] for r in match_rows("battery on smoke detector 2", detectors, "en")] == ["2"]


# ─── O8-3: the template review ──────────────────────────────────────────────


def test_o8_3_no_update_towards_a_duty_the_template_does_not_create_here() -> None:
    florida = tu.Home(hemisphere="north", has_winter=False, country="US", region="US-FL")
    task = _made("vehicle_car", "Roadworthiness Test")  # made where the test is due every two years
    assert task["interval_days"] > 0
    assert tu.built_task(_tt("vehicle_car", "Roadworthiness Test"), "en", florida).get("interval_days") == 0, "no such duty in Florida"
    assert tu.task_changes("t1", task, florida, "en") == [], "it offered to turn the reminder into a manual task"
    assert tu.task_changes("t1", task, NORTH, "en") == []


# ─── O8-4 / O8-5: the device of the unit an object replaced ─────────────────


async def test_o8_4_the_replaced_units_device_counts_while_the_object_has_none(hass: HomeAssistant) -> None:
    old = make_object_entry(hass, tasks={}, name="Old washer", uid="o84_old", object_data=build_object_data(name="Old washer", object_id="o84a") | {"ha_device_id": "dev_old"})
    new_obj = build_object_data(name="New washer", object_id="o84b") | {"predecessor_entry_id": old.entry_id, "ha_device_id": None}
    assert predecessor_device_ids(hass, new_obj, "dev_new") == {"dev_old"}, "chosen later, the device found nothing to move away from"
    assert predecessor_device_ids(hass, new_obj, "dev_old") == set(), "the same device is no move"
    assert predecessor_device_ids(hass, {**new_obj, "ha_device_id": "dev_mid"}, "dev_new") == set(), "its own link says where it is"
    assert predecessor_device_ids(hass, {**new_obj, "predecessor_entry_id": "gone"}, "dev_new") == set()
    assert predecessor_device_ids(hass, build_object_data(name="Plain", object_id="o84c"), "dev_new") == set()


async def test_o8_5_the_device_link_repair_moves_the_wiring(hass: HomeAssistant) -> None:
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: build_task_data()},
        name="Washer",
        uid="o85",
        object_data=build_object_data(name="Washer", object_id="o85") | {"ha_device_id": "dev_lost"},
    )
    flow = object.__new__(DeviceLinkRepairFlow)
    flow.hass = hass
    moved = {TASK_ID_1: {**obj.data[CONF_TASKS][TASK_ID_1], "notes": "moved"}}
    with (
        patch("custom_components.maintenance_supporter.repairs.move_tasks_to_device", return_value=(moved, None)) as move,
        patch.object(hass.config_entries, "async_schedule_reload"),
    ):
        flow._set_link(hass.config_entries.async_get_entry(obj.entry_id), "dev_back")
        assert move.call_args.args[2] == {"dev_lost"} and move.call_args.args[3] == "dev_back"
        assert move.call_args.kwargs == {"user_id": None}, "the actions keep their owner"
        live = hass.config_entries.async_get_entry(obj.entry_id)
        assert live.data[CONF_OBJECT]["ha_device_id"] == "dev_back"
        assert live.data[CONF_TASKS][TASK_ID_1]["notes"] == "moved", "only the link was written"

        move.reset_mock()
        flow._set_link(hass.config_entries.async_get_entry(obj.entry_id), None)  # "remove the link"
        move.assert_not_called()
        assert hass.config_entries.async_get_entry(obj.entry_id).data[CONF_OBJECT]["ha_device_id"] is None


# ─── O8-7: the last entry to go ─────────────────────────────────────────────


async def test_o8_7_the_last_entry_to_go_purges_its_reminders_and_trace(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.task_trace import TaskTrace

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, name="Last one", uid="o87")
    await setup_integration(hass, g, obj)
    await hass.config_entries.async_remove(g.entry_id)
    await hass.async_block_till_done()
    with (
        patch.object(NotificationManager, "purge_entry", autospec=True) as purge,
        patch.object(TaskTrace, "forget_entry", autospec=True) as forget,
    ):
        await hass.config_entries.async_remove(obj.entry_id)
        await hass.async_block_till_done()
    assert DOMAIN not in hass.data or NOTIFICATION_MANAGER_KEY not in hass.data.get(DOMAIN, {}), "the runtime data went with its unload"
    assert [call.args[1] for call in purge.call_args_list] == [obj.entry_id], "its held reminders stayed in .storage"
    assert [call.args[1] for call in forget.call_args_list] == [obj.entry_id], "and its trace"


# ─── P8-3 / P8-4: parts and batteries ───────────────────────────────────────


async def test_p8_3_a_sensorless_battery_is_judged_by_the_cells_it_holds(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet import read_batteries

    _set_type_note(hass, "hall_temp", last="2020-01-01T00:00:00+00:00")
    eid = "sensor.hall_temp_battery_type"
    bats = {b.entity_id: b for b in read_batteries(hass)}
    assert bats[eid].low is True, "a passed forecast on disposables is due"
    # The same note, with rechargeable cells put in at the last Replaced.
    with patch("custom_components.maintenance_supporter.helpers.battery_fleet.held_cells", return_value={eid: "AA NIMH"}):
        bats = {b.entity_id: b for b in read_batteries(hass)}
    assert bats[eid].low is False, "rechargeables get no table forecast: it came due like disposables"


def test_p8_4_an_archived_task_takes_no_place() -> None:
    live = {f"t{i}": {"name": "x"} for i in range(MAX_TASKS_PER_OBJECT)}
    done = {f"a{i}": {"name": "Buy salt", "archived_at": "2026-01-01T00:00:00+00:00"} for i in range(MAX_TASKS_PER_OBJECT)}
    assert task_room(None) == MAX_TASKS_PER_OBJECT and task_room({}) == MAX_TASKS_PER_OBJECT
    assert task_room(live) == 0
    assert task_room(done) == MAX_TASKS_PER_OBJECT, "three years of buy reminders filled the object"
    assert task_room({**done, "t1": {"name": "x"}}) == MAX_TASKS_PER_OBJECT - 1
    # The archive has its own, wider bound.
    many = {f"a{i}": {"archived_at": "x"} for i in range(MAX_STORED_TASKS_PER_OBJECT - 2)}
    assert task_room(many) == 2
    assert task_room({**many, "x": {}, "y": {}}) == 0


async def test_p8_4_a_new_task_fits_beside_archived_ones(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.entry_tasks import insert_new_task

    archived = {f"a{i}": build_task_data(task_id=f"a{i}") | {"archived_at": "2026-01-01T00:00:00+00:00"} for i in range(3)}
    obj = make_object_entry(hass, tasks=archived, name="Pool", uid="p84")
    await setup_integration(hass, make_global_entry(hass), obj)
    with patch("custom_components.maintenance_supporter.helpers.entry_tasks.MAX_TASKS_PER_OBJECT", 3):
        insert_new_task(hass, hass.config_entries.async_get_entry(obj.entry_id), build_task_data(task_id="new", name="New"))
    assert "new" in hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS]


# ─── W8-3: the trace ────────────────────────────────────────────────────────


async def test_w8_3_the_traces_before_of_last_performed_is_the_stores(hass: HomeAssistant) -> None:
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(last_performed="2026-10-01")}, name="Boiler", uid="w83")
    await setup_integration(hass, make_global_entry(hass), obj)
    live = hass.config_entries.async_get_entry(obj.entry_id)
    store = live.runtime_data.store
    assert store.get_last_performed(TASK_ID_1) == "2026-10-01"
    stored = {k: v for k, v in live.data[CONF_TASKS][TASK_ID_1].items() if k != "last_performed"}  # the entry holds no copy
    trace = get_trace(hass)
    assert trace is not None

    edited = note_task_edit(hass, obj.entry_id, TASK_ID_1, stored, {**stored, "last_performed": "2026-11-01"})
    assert "last_performed" in edited
    event = trace.events(obj.entry_id, TASK_ID_1)[-1]
    assert event["changes"]["last_performed"] == ["2026-10-01", "2026-11-01"], "it read: — → 1 Nov"

    # The date the Store has already is no change to tell.
    before = len(trace.events(obj.entry_id, TASK_ID_1))
    note_task_edit(hass, obj.entry_id, TASK_ID_1, stored, {**stored, "last_performed": "2026-10-01"})
    assert len(trace.events(obj.entry_id, TASK_ID_1)) == before
