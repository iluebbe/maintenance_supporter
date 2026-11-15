"""Bug audit 2026-11-14: the findings fixed in the backend.

One test (or a few) per finding; each fails without its fix.

- N9-1: a reminder of the new cycle that quiet hours only held replaced
  nothing: the old push leaves the phones
- R9-2: a completion that hands the task on clears what the previous person
  was told
- N9-3: the completion notice stays after the phone's Complete button
- N9-2: a snooze that ends brings the reminder back
- N9-5 / N9-6: each morning's summary lists only its own tasks; a place's
  message leaves once its tasks are done
- R9-1: the to-do mirror keeps a buy reminder off the shopping list
- L9-1: the tasks of a copied or replaced object start today
- L9-2: an open order survives replace, the hand-over at delete and a backup
- S9-1: the shopping list follows an order
- S9-2: the receipt of an order books the ordered amount
- S9-3: a part's documents go where the part goes
- S9-9: a delivery booked by a restock ends the wait for it
- L9-3: undo of a completed buy reminder brings the order back
- L9-5: a part move re-points a link that names its own object
- S9-8: a shopping row whose removal failed keeps its record
- D9-1 / D9-4 / D9-7: the cycle of a pattern, the preview of a task never done
- D9-2: a calendar is read back to the event a task waits for
- F9-3 / I9-4: a nested schedule that can never come due is refused
- N9-7: the calendar's range ends before its end
- I9-3: a note and a purchase by voice keep the tier of the panel
- N9-4: whole words before parts of words in a spoken name
- I9-6: a negative reading is a number in the history CSV
- N9-9: a spoken list says that more follow
"""

from __future__ import annotations

import csv
import io
from datetime import date, timedelta
from types import SimpleNamespace
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFY_COMPLETED,
    CONF_OBJECT,
    CONF_PARTS,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers import voice_undo
from custom_components.maintenance_supporter.helpers.calendar_source import CALENDAR_WINDOW_PAST_MAX_DAYS, _past_days
from custom_components.maintenance_supporter.helpers.csv_handler import export_history_csv
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.helpers.intent_match import match_rows
from custom_components.maintenance_supporter.helpers.notification_ids import QUIET_END_TAG, place_tag
from custom_components.maintenance_supporter.helpers.notification_manager import (
    _SENT_ONCE,
    NotificationManager,
    notification_key,
    task_key_of,
)
from custom_components.maintenance_supporter.helpers.parts import normalize_part, portable_order
from custom_components.maintenance_supporter.helpers.schedule import Schedule, nested_schedule_refusal, preview_occurrences
from custom_components.maintenance_supporter.helpers.shared_parts import async_move_part
from custom_components.maintenance_supporter.helpers.status import effective_warning_days
from custom_components.maintenance_supporter.helpers.todo_mirror import TodoMirror
from custom_components.maintenance_supporter.intent import INTENT_ADD_NOTE, INTENT_BOUGHT_PART, _spoken_list, async_setup_intents
from custom_components.maintenance_supporter.parts_runtime import (
    async_change_part_stock,
    async_part_order,
    open_buy_task_id,
)
from custom_components.maintenance_supporter.shopping_sync import ShoppingListSync
from custom_components.maintenance_supporter.websocket.objects import ws_duplicate_object, ws_replace_object
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_update_task

from .conftest import (
    TASK_ID_1,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)
from .test_github_round_2026_11_13 import OIL, TASK, _garage, _live, _object, _oil, _store, _three

PHONE = "notify.mobile_app_phone"
NO_QUIET_HOURS = {CONF_QUIET_HOURS_ENABLED: False}
NM_MODULE = "custom_components.maintenance_supporter.helpers.notification_manager"


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _status(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    return str(_coordinator(hass, entry).data[CONF_TASKS][TASK_ID_1].status)


def _messages(phone: Any) -> list[Any]:
    return [c.data.get("message") for c in phone]


async def _late_weekly(hass: HomeAssistant, *, extra: dict[str, Any] | None = None, **task_extra: Any) -> tuple[MockConfigEntry, Any]:
    """A weekly task on its planned grid, a day late: done, the next one is
    due in six days, inside the warning window at once."""
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data={**NO_QUIET_HOURS, **(extra or {})})
    last = (dt_util.now().date() - timedelta(days=8)).isoformat()
    task = {**build_task_data(interval_days=7, warning_days=7, last_performed=last), "interval_anchor": "planned", **task_extra}
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    assert _status(hass, obj) == MaintenanceStatus.OVERDUE
    return obj, phone


# ─── N9-1 / R9-2 / N9-3: what stays on the phones after a completion ────────


async def test_n9_1_a_reminder_held_for_quiet_hours_takes_the_old_push_off(hass: HomeAssistant) -> None:
    obj, phone = await _late_weekly(hass)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    assert nm.was_reminded(obj.entry_id, TASK_ID_1), "the overdue push stands on the phones"
    with patch.object(nm, "_is_quiet_hours", return_value=True):
        await _coordinator(hass, obj).complete_maintenance(TASK_ID_1, notes="done")
        await hass.async_block_till_done()
    assert _status(hass, obj) == MaintenanceStatus.DUE_SOON
    assert nm._quiet_held, "the new cycle's reminder waits for the morning"
    assert _messages(phone)[-1] == "clear_notification", f"the overdue push stayed on the phone: {_messages(phone)}"


async def test_n9_1_a_push_of_the_new_cycle_still_stays(hass: HomeAssistant) -> None:
    """The N8-1 case is unchanged: a push under the task's tag replaced the
    old one, and is not taken off."""
    obj, phone = await _late_weekly(hass)
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1, notes="done")
    await hass.async_block_till_done()
    assert _messages(phone)[-1] != "clear_notification", _messages(phone)


async def test_r9_2_a_rotation_clears_what_the_previous_person_was_told(hass: HomeAssistant) -> None:
    ann = await hass.auth.async_create_user("Ann")
    ben = await hass.auth.async_create_user("Ben")
    obj, _phone = await _late_weekly(hass, assignee_pool=[ann.id, ben.id], rotation_strategy="round_robin", responsible_user_id=ann.id)
    coordinator = _coordinator(hass, obj)
    with patch.object(coordinator, "_clear_notification_state", wraps=coordinator._clear_notification_state) as clear:
        await coordinator.complete_maintenance(TASK_ID_1, notes="mowed")
        await hass.async_block_till_done()
    assert _live(hass, obj).data[CONF_TASKS][TASK_ID_1]["responsible_user_id"] == ben.id
    assert clear.call_args.kwargs["since"] is None, "the previous person kept the reminder of the next person's turn"


async def test_r9_2_no_rotation_keeps_the_marks(hass: HomeAssistant) -> None:
    obj, _phone = await _late_weekly(hass)
    coordinator = _coordinator(hass, obj)
    with patch.object(coordinator, "_clear_notification_state", wraps=coordinator._clear_notification_state) as clear:
        await coordinator.complete_maintenance(TASK_ID_1, notes="done")
    assert clear.call_args.kwargs["since"] is not None


async def test_n9_3_the_completion_notice_stays_after_the_phones_button(hass: HomeAssistant) -> None:
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data={**NO_QUIET_HOURS, CONF_NOTIFY_COMPLETED: "all"})
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=last)})
    await setup_integration(hass, g, obj)
    assert _status(hass, obj) == MaintenanceStatus.OVERDUE
    hass.bus.async_fire("mobile_app_notification_action", {"action": f"MS_COMPLETE_{obj.entry_id}_{TASK_ID_1}"})
    await hass.async_block_till_done()
    assert _status(hass, obj) == MaintenanceStatus.OK
    messages = _messages(phone)
    assert messages[-1] != "clear_notification", f"the completion notice was taken off right after it went out: {messages}"


# ─── N9-2 / N9-5 / N9-6: the manager ────────────────────────────────────────


async def test_n9_2_a_snooze_that_ends_brings_the_reminder_back(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    nm = NotificationManager(hass)
    once = notification_key("e1", "t1", "triggered")
    repeat = notification_key("e1", "t1", "overdue")
    nm._last_notified[once] = _SENT_ONCE
    nm._last_notified[repeat] = dt_util.now()
    nm.snooze_task("e1", "t1")
    assert nm._is_snoozed(once) and nm._is_snoozed(repeat)
    freezer.tick(timedelta(hours=30))
    assert not nm._is_snoozed(once) and not nm._is_snoozed(repeat)
    assert nm._status_due(once, 0), "a status told once stayed silent after the snooze"
    assert nm._status_due(repeat, 24), "the repeat interval counted from the first push"
    # A reminder sent after the snooze ended keeps its stamp.
    nm._last_notified[repeat] = dt_util.now()
    nm.snooze_task("e1", "t1")
    nm._snoozed_until[repeat] = dt_util.now() - timedelta(minutes=1)
    nm._last_notified[repeat] = dt_util.now()
    assert not nm._is_snoozed(repeat)
    assert repeat in nm._last_notified


async def test_n9_5_each_mornings_summary_lists_only_its_own_tasks(hass: HomeAssistant) -> None:
    nm = NotificationManager(hass)

    def facts(task_id: str) -> dict[str, Any]:
        return {"entry_id": "e1", "task_id": task_id, "status": "overdue", "task_name": task_id, "object_name": "Pool"}

    with patch(f"{NM_MODULE}.async_emit_and_dispatch", AsyncMock(return_value=True)):
        assert await nm._send_quiet_summary((PHONE,), {"k_a": facts("a")})
        assert await nm._send_quiet_summary((PHONE,), {"k_c": facts("c")})
        assert nm._group_pushes[QUIET_END_TAG]["members"] == [task_key_of("e1", "c")], "yesterday's summary held it"
        # The same morning, another recipient's summary adds up.
        assert await nm._send_quiet_summary(("notify.mobile_app_other",), {"k_d": facts("d")}, first=False)
    assert nm._group_pushes[QUIET_END_TAG]["members"] == [task_key_of("e1", "c"), task_key_of("e1", "d")]


async def test_n9_6_a_places_message_leaves_once_its_tasks_are_done(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()})
    await setup_integration(hass, g, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    tasks = [{"entry_id": obj.entry_id, "task_id": TASK_ID_1, "task_name": "Filter", "object_name": "Boat", "status": "overdue"}]
    with (
        patch(f"{NM_MODULE}.task_may_notify", return_value=True),
        patch(f"{NM_MODULE}.get_user_notify_services", AsyncMock(return_value=[PHONE])),
        patch(f"{NM_MODULE}.async_emit_and_dispatch", AsyncMock(return_value=True)),
    ):
        assert await nm.async_place_arrival(user_id="u1", zone_id="zone.cabin", place_name="Cabin", tasks=tasks)
    tag = place_tag("zone.cabin")
    assert nm._group_pushes[tag]["members"] == [task_key_of(obj.entry_id, TASK_ID_1)]
    with patch.object(nm, "_async_dismiss_tag", AsyncMock()) as dismiss:
        nm.clear_task_state(obj.entry_id, TASK_ID_1)
        await hass.async_block_till_done()
    dismiss.assert_awaited_once()
    assert dismiss.await_args.args[0] == tag


# ─── R9-1: the to-do mirror and the shopping list ───────────────────────────


async def test_r9_1_the_mirror_keeps_a_buy_reminder_off_the_shopping_list(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_OBJECT: {"id": "o1", "name": "Garage"}, CONF_TASKS: {"buy": {"name": "Buy oil", "part_ref": {"part_id": OIL}}, "plain": {"name": "Sweep"}}},
    )
    entry.add_to_hass(hass)
    mirror = TodoMirror(hass)
    # What the coordinator hands over: the task model, which has no part.
    results = {tid: SimpleNamespace(task={"id": tid, "name": name}, status="overdue") for tid, name in (("buy", "Buy oil"), ("plain", "Sweep"))}
    store = MagicMock()
    store.get_task_state.return_value = {}
    with (
        patch("custom_components.maintenance_supporter.helpers.todo_mirror.default_lists", return_value=["todo.family"]),
        patch.object(mirror, "_shopping_list", return_value="todo.family"),
        patch.object(mirror, "_arm_listeners"),
        patch.object(mirror, "_configured_lists", return_value=set()),
        patch.object(mirror, "_sync_entry_locked", AsyncMock()) as sync,
    ):
        await mirror.async_sync_entry(entry.entry_id, results, store=store, object_name="Garage")  # type: ignore[arg-type]
    lists = sync.await_args.args[3]
    assert lists == {"buy": [], "plain": ["todo.family"]}, "the buy reminder stood twice on the shared list"


# ─── L9-1 / L9-2: copies, replace, hand-over, backup ────────────────────────


async def test_l9_1_a_copy_and_a_successor_start_their_tasks_today(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, minor_version=4)
    pump = _object(hass, "Pump")
    hass.config_entries.async_update_entry(pump, data={**pump.data, CONF_TASKS: {TASK: {**pump.data[CONF_TASKS][TASK], "created_at": "2025-01-10"}}})
    await setup_integration(hass, g, pump)
    today = dt_util.now().date().isoformat()

    conn = make_ws_connection()
    await call_ws_handler(ws_duplicate_object, hass, conn, {"id": 1, "type": "maintenance_supporter/object/duplicate", "entry_id": pump.entry_id})
    await hass.async_block_till_done()
    copy = hass.config_entries.async_get_entry(conn.send_result.call_args[0][1]["entry_id"])
    assert {t["created_at"] for t in copy.data[CONF_TASKS].values()} == {today}

    conn = make_ws_connection()
    await call_ws_handler(ws_replace_object, hass, conn, {"id": 2, "type": "maintenance_supporter/object/replace", "entry_id": pump.entry_id, "name": "Pump 2"})
    await hass.async_block_till_done()
    successor = hass.config_entries.async_get_entry(conn.send_result.call_args[0][1]["entry_id"])
    (task_id,) = successor.data[CONF_TASKS]
    assert successor.data[CONF_TASKS][task_id]["created_at"] == today
    assert successor.runtime_data.coordinator.data[CONF_TASKS][task_id].status == MaintenanceStatus.OK, "the new unit read overdue"


async def test_l9_2_a_successor_gets_what_is_on_order(hass: HomeAssistant) -> None:
    garage = await _garage(hass, stock=1)
    await async_part_order(hass, _live(hass, garage), OIL, quantity=2)
    await hass.async_block_till_done()
    conn = make_ws_connection()
    await call_ws_handler(ws_replace_object, hass, conn, {"id": 1, "type": "maintenance_supporter/object/replace", "entry_id": garage.entry_id, "name": "Garage 2"})
    await hass.async_block_till_done()
    successor = hass.config_entries.async_get_entry(conn.send_result.call_args[0][1]["entry_id"])
    (new_pid,) = successor.data[CONF_PARTS]
    assert successor.runtime_data.store.get_part_order(new_pid)["quantity"] == 2
    assert _store(hass, garage).get_part_order(OIL) is None, "the order stayed with the archived predecessor too"


async def test_l9_2_the_heir_of_a_pool_gets_what_is_on_order(hass: HomeAssistant) -> None:
    floors, kitchen, _laundry = await _three(hass)
    await async_part_order(hass, _live(hass, floors), OIL, quantity=3)
    await hass.async_block_till_done()
    await hass.config_entries.async_remove(floors.entry_id)
    await hass.async_block_till_done()
    assert _store(hass, kitchen).get_part_order(OIL)["quantity"] == 3


async def test_l9_2_an_order_rides_the_backup(hass: HomeAssistant) -> None:
    garage = await _garage(hass)
    due = (dt_util.now().date() + timedelta(days=4)).isoformat()
    await async_part_order(hass, _live(hass, garage), OIL, quantity=2, expected=date.fromisoformat(due), note="  from the shop ")
    await hass.async_block_till_done()
    (exported,) = [o for o in build_export_data(hass)["objects"] if o["entry_id"] == garage.entry_id]
    (part,) = exported["parts"]
    assert part["on_order"]["quantity"] == 2 and part["on_order"]["expected"] == due

    assert portable_order(part) == {"on_order": {"quantity": 2.0, "expected": due, "ordered_at": part["on_order"]["ordered_at"], "note": "from the shop"}}
    assert portable_order({"on_order": {"quantity": 0}}) == {}
    assert portable_order({"on_order": {"quantity": True}}) == {}
    assert portable_order({"on_order": {"quantity": 1, "expected": "soon"}})["on_order"]["expected"] is None
    assert portable_order({}) == {}


async def test_l9_2_an_imported_order_lands_in_the_store(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, minor_version=4)
    order = {"quantity": 2.0, "expected": None, "ordered_at": "2026-11-01T10:00:00+00:00", "note": None}
    part = {**normalize_part(_oil(auto_buy_task=True)), "stock": 3, "on_order": order}
    obj = make_object_entry(hass, tasks={TASK: build_task_data(task_id=TASK)}, name="Shed", uid="l92_shed", minor_version=4, extra_data={CONF_PARTS: {OIL: part}})
    await setup_integration(hass, g, obj)
    live = _live(hass, obj)
    assert live.runtime_data.store.get_part_order(OIL) == order
    assert "on_order" not in live.data[CONF_PARTS][OIL]


# ─── S9-1 / S9-2 / S9-9 / L9-3: orders ──────────────────────────────────────


async def test_s9_1_the_shopping_list_follows_an_order(hass: HomeAssistant) -> None:
    garage = await _garage(hass, stock=1)
    assert open_buy_task_id(_live(hass, garage), OIL) is not None
    with patch("custom_components.maintenance_supporter.parts_runtime.schedule_resync") as resync:
        await async_part_order(hass, _live(hass, garage), OIL, quantity=2)
        await hass.async_block_till_done()
        assert resync.called, "the reminder was there already: nothing asked the list to drop the row"
        resync.reset_mock()
        from custom_components.maintenance_supporter.parts_runtime import async_part_order_cancel

        assert await async_part_order_cancel(hass, _live(hass, garage), OIL)
        await hass.async_block_till_done()
        assert resync.called


async def test_s9_2_the_receipt_books_the_ordered_amount(hass: HomeAssistant) -> None:
    garage = await _garage(hass, stock=1)
    result = await async_part_order(hass, _live(hass, garage), OIL, quantity=2)
    await hass.async_block_till_done()
    assert result is not None and result["task_id"]
    await _live(hass, garage).runtime_data.coordinator.complete_maintenance(result["task_id"])
    await hass.async_block_till_done()
    store = _live(hass, garage).runtime_data.store
    assert store.get_part_stock(OIL) == 3, "the usual 5 were booked for an order of 2"
    assert store.get_part_order(OIL) is None


async def test_s9_9_a_delivery_by_restock_ends_the_wait(hass: HomeAssistant) -> None:
    garage = await _garage(hass, stock=0)
    task_id = open_buy_task_id(_live(hass, garage), OIL)
    assert task_id is not None
    due = dt_util.now().date() + timedelta(days=5)
    await async_part_order(hass, _live(hass, garage), OIL, quantity=1, expected=due)
    await hass.async_block_till_done()
    assert get_task_store_state(hass, garage.entry_id, task_id).get("due_override") == due.isoformat()
    await async_change_part_stock(hass, _live(hass, garage), OIL, delta=1)
    await hass.async_block_till_done()
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is None
    assert open_buy_task_id(_live(hass, garage), OIL) == task_id, "still low"
    assert get_task_store_state(hass, garage.entry_id, task_id).get("due_override") is None, "hidden until the day the parcel was expected"


async def test_l9_3_undo_of_a_completed_buy_reminder_brings_the_order_back(hass: HomeAssistant) -> None:
    garage = await _garage(hass, stock=0)
    result = await async_part_order(hass, _live(hass, garage), OIL, quantity=1)
    await hass.async_block_till_done()
    order = _live(hass, garage).runtime_data.store.get_part_order(OIL)
    before = voice_undo.capture(hass, garage.entry_id, result["task_id"])
    await _live(hass, garage).runtime_data.coordinator.complete_maintenance(result["task_id"])
    await hass.async_block_till_done()
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) is None
    after = voice_undo.capture(hass, garage.entry_id, result["task_id"])
    record = voice_undo.UndoRecord(kind="complete", at=dt_util.now(), before=before, after=after, speech={})
    await voice_undo.async_restore(hass, record)
    await hass.async_block_till_done()
    assert _live(hass, garage).runtime_data.store.get_part_order(OIL) == order


# ─── S9-3 / L9-5: moving a part ─────────────────────────────────────────────


async def test_s9_3_a_parts_documents_go_where_the_part_goes(hass: HomeAssistant) -> None:
    docs = DocumentStore(hass)
    docs._data["documents"] = {
        "manual": {"object_id": "floors", "kind": "weblink", "url": "https://example.com/m.pdf", "title": "Manual", "tags": [], "task_ids": [], "part_ids": [OIL]},
        "shared": {"object_id": "floors", "kind": "weblink", "url": "https://example.com/s.pdf", "title": "Sheet", "tags": [], "task_ids": ["t1"], "part_ids": [OIL, "other"]},
        "elsewhere": {"object_id": "garage", "kind": "weblink", "url": "https://example.com/e.pdf", "title": "E", "tags": [], "task_ids": [], "part_ids": [OIL]},
    }
    with patch.object(docs, "_async_save", AsyncMock()):
        assert await docs.async_follow_parts("floors", "kitchen", {OIL: "oil_new"}) == 2
    assert docs.documents["manual"]["object_id"] == "kitchen" and docs.documents["manual"]["part_ids"] == ["oil_new"]
    # Still used where it is: it stays, and the part gets its own record.
    assert docs.documents["shared"]["object_id"] == "floors" and docs.documents["shared"]["part_ids"] == ["other"]
    copies = [d for d in docs.documents.values() if d["object_id"] == "kitchen" and d.get("url") == "https://example.com/s.pdf"]
    assert len(copies) == 1 and copies[0]["part_ids"] == ["oil_new"] and copies[0]["task_ids"] == []
    assert docs.documents["elsewhere"]["object_id"] == "garage"


async def test_s9_3_a_move_takes_the_panels_part_documents_along(hass: HomeAssistant) -> None:
    floors, kitchen, _laundry = await _three(hass)
    with patch.object(DocumentStore, "async_follow_parts", AsyncMock(return_value=0)) as follow:
        await async_move_part(hass, _live(hass, floors), _live(hass, kitchen), OIL)
    follow.assert_awaited_once()
    assert follow.await_args.args[2] == {OIL: OIL}


async def test_l9_5_a_part_move_repoints_a_link_naming_its_own_object(hass: HomeAssistant) -> None:
    floors, kitchen, _laundry = await _three(hass)
    live = _live(hass, floors)
    task = dict(live.data[CONF_TASKS][TASK])
    task["consumes_parts"] = [{"part_id": OIL, "quantity": 1, "entry_id": floors.entry_id}]
    hass.config_entries.async_update_entry(live, data={**live.data, CONF_TASKS: {**live.data[CONF_TASKS], TASK: task}})
    await async_move_part(hass, _live(hass, floors), _live(hass, kitchen), OIL)
    link = _live(hass, floors).data[CONF_TASKS][TASK]["consumes_parts"][0]
    assert link["entry_id"] == kitchen.entry_id, "the link pointed at a part that was gone"


# ─── S9-8: the shopping sync ────────────────────────────────────────────────


async def test_s9_8_a_row_whose_removal_failed_keeps_its_record(hass: HomeAssistant) -> None:
    sync = ShoppingListSync(hass)
    hass.states.async_set("todo.shop", "1")
    sync._data = {"entity_id": "todo.shop", "items": {"e1:p1": {"uid": "u1", "summary": "Garage: Buy oil"}}}
    listed = [{"uid": "u1", "summary": "Garage: Buy oil", "status": "needs_action"}]
    with (
        patch.object(sync, "configured_entity", return_value="todo.shop"),
        patch.object(sync, "_arm_listener"),
        patch.object(sync, "_get_items", AsyncMock(return_value=listed)),
        patch.object(sync, "_desired", return_value={}),
        patch.object(sync, "_unloaded_entry_ids", return_value=set()),
        patch.object(sync, "_save", AsyncMock()),
        patch.object(sync, "_remove_item", AsyncMock(return_value=False)),
    ):
        await sync._resync_locked()
        assert "e1:p1" in sync._data["items"], "forgotten while it still stood on the list"
        with patch.object(sync, "_remove_item", AsyncMock(return_value=True)):
            await sync._resync_locked()
    assert "e1:p1" not in sync._data["items"]


# ─── D9-1 / D9-4 / D9-7: schedules ──────────────────────────────────────────


def test_d9_1_several_weekdays_are_a_shorter_cycle() -> None:
    def span(**d: Any) -> int:
        return Schedule.from_dict(d).span_days()

    assert span(kind="weekdays", weekdays=[0, 2, 4]) == 2
    assert effective_warning_days(7, span(kind="weekdays", weekdays=[0, 2, 4])) == 1, "due soon for good"
    assert span(kind="weekdays", weekdays=[0, 1, 2, 3, 4, 5, 6]) == 1
    assert span(kind="weekdays", weekdays=[1]) == 7
    assert span(kind="weekdays", weekdays=[0, 4]) == 3, "Fri to Mon"


def test_d9_4_a_pattern_on_some_months_is_that_long() -> None:
    def span(**d: Any) -> int:
        return Schedule.from_dict(d).span_days()

    assert span(kind="day_of_month", day=1, months=[9]) == 365
    assert effective_warning_days(60, span(kind="day_of_month", day=1, months=[9])) == 60
    assert span(kind="day_of_month", day=1, months=[3, 9]) == 182
    assert span(kind="nth_weekday", nth=1, weekday=5, months=[4, 5, 6]) == 30
    assert span(kind="day_of_month", day=1) == 30


def test_d9_7_a_planned_task_never_done_previews_from_its_day_of_creation() -> None:
    sched = Schedule.from_dict({"kind": "interval", "every": 1, "unit": "months", "anchor": "planned"})
    dates, _ = preview_occurrences(sched, last_performed=None, today=date(2026, 11, 15), created_at=date(2026, 8, 31), count=4)
    assert [d.isoformat() for d in dates] == ["2026-09-30", "2026-10-31", "2026-11-30", "2026-12-31"]


# ─── D9-2: the calendar's window ────────────────────────────────────────────


async def test_d9_2_a_calendar_is_read_back_to_the_event_a_task_waits_for(hass: HomeAssistant) -> None:
    today = dt_util.now().date()
    sweep = build_task_data(task_id="sweep", name="Chimney", interval_days=None, last_performed=(today - timedelta(days=300)).isoformat())
    sweep["schedule"] = {"kind": "calendar", "entity_id": "calendar.sweep"}
    sweep.pop("schedule_type", None)
    fresh = build_task_data(task_id="fresh", name="Bins", interval_days=None)
    fresh["schedule"] = {"kind": "calendar", "entity_id": "calendar.bins"}
    fresh["created_at"] = (today - timedelta(days=5)).isoformat()
    fresh.pop("schedule_type", None)
    obj = make_object_entry(hass, tasks={"sweep": sweep, "fresh": fresh}, name="House", uid="d92")
    await setup_integration(hass, make_global_entry(hass), obj)
    assert _past_days(hass, "calendar.sweep", today) >= 301
    assert _past_days(hass, "calendar.bins", today) == 60
    ancient = {**sweep, "id": "ancient", "created_at": (today - timedelta(days=4000)).isoformat()}
    ancient.pop("last_performed", None)
    live = _live(hass, obj)
    hass.config_entries.async_update_entry(live, data={**live.data, CONF_TASKS: {**live.data[CONF_TASKS], "ancient": ancient}})
    assert _past_days(hass, "calendar.sweep", today) == CALENDAR_WINDOW_PAST_MAX_DAYS


# ─── F9-3 / I9-4: a schedule that never comes due ───────────────────────────


def test_f9_3_a_schedule_that_names_no_date_is_refused() -> None:
    def refusal(d: dict[str, Any], **kw: Any) -> str | None:
        return nested_schedule_refusal(Schedule.from_dict(d), **kw)

    assert refusal({"kind": "weekdays", "weekdays": []})
    assert refusal({"kind": "weekdays", "weekdays": [2]}) is None
    assert refusal({"kind": "day_of_month"})
    assert refusal({"kind": "nth_weekday", "nth": 1})
    assert refusal({"kind": "calendar"})
    assert refusal({"kind": "one_time"})
    assert refusal({"kind": "one_time", "due_date": "2026-12-01"}) is None
    assert refusal({"kind": "interval"})
    assert refusal({"kind": "interval"}, interval_days=30) is None, "the carrier of the flat interval"
    assert refusal({"kind": "interval"}, stored_kind="interval") is None


async def test_f9_3_the_task_commands_refuse_an_empty_weekday_set(hass: HomeAssistant) -> None:
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()})
    await setup_integration(hass, make_global_entry(hass), obj)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task, hass, conn, {"id": 1, "type": "maintenance_supporter/task/create", "entry_id": obj.entry_id, "name": "Bins", "schedule": {"kind": "weekdays", "weekdays": []}}
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args.kwargs.get("translation_key") == "weekdays_need_a_day"
    assert len(_live(hass, obj).data[CONF_TASKS]) == 1, "stored although it never comes due"

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task, hass, conn, {"id": 2, "type": "maintenance_supporter/task/update", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "schedule": {"kind": "weekdays", "weekdays": []}}
    )
    conn.send_error.assert_called_once()


async def test_i9_4_a_one_time_date_beside_the_schedule_is_kept(hass: HomeAssistant) -> None:
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()})
    await setup_integration(hass, make_global_entry(hass), obj)
    due = (dt_util.now().date() + timedelta(days=20)).isoformat()
    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/create", "entry_id": obj.entry_id, "name": "Descale", "schedule": {"kind": "one_time"}, "due_date": due},
    )
    conn.send_error.assert_not_called()
    task_id = conn.send_result.call_args[0][1]["task_id"]
    assert _live(hass, obj).data[CONF_TASKS][task_id]["schedule"]["due_date"] == due


# ─── N9-7: the calendar's range ─────────────────────────────────────────────


async def test_n9_7_the_calendar_range_ends_before_its_end(hass: HomeAssistant) -> None:
    last = (dt_util.now().date() - timedelta(days=29)).isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, warning_days=0, last_performed=last)})
    await setup_integration(hass, make_global_entry(hass), obj)
    calendar = hass.data[DOMAIN]["_calendar_entity"]
    today = dt_util.start_of_local_day()
    assert await calendar.async_get_events(hass, today, today + timedelta(days=1)) == [], "tomorrow's task was due today"
    assert len(await calendar.async_get_events(hass, today, today + timedelta(days=2))) == 1
    assert len(await calendar.async_get_events(hass, today + timedelta(days=1), today + timedelta(days=1, hours=1))) == 1


# ─── I9-3: voice writes keep the tier ───────────────────────────────────────


async def test_i9_3_a_note_and_a_purchase_by_voice_keep_the_panels_tier(hass: HomeAssistant) -> None:
    await async_setup_intents(hass)
    garage = await _garage(hass)
    # The first user is the owner, and the owner is an admin.
    admin = await hass.auth.async_create_user("Parent", group_ids=["system-admin"])
    plain = await hass.auth.async_create_user("Kid", group_ids=["system-users"])
    assert not plain.is_admin

    async def ask(intent_type: str, slots: dict[str, str], user_id: str | None) -> intent.IntentResponse:
        return await intent.async_handle(hass, "test", intent_type, {k: {"value": v} for k, v in slots.items()}, language="en", context=Context(user_id=user_id))

    note = {"name": "service garage", "note": "drained"}
    refused = await ask(INTENT_ADD_NOTE, note, plain.id)
    assert refused.error_code is not None
    assert "administrator" in str(refused.speech["plain"]["speech"])
    assert "notes" not in _live(hass, garage).data[CONF_TASKS][TASK]
    assert (await ask(INTENT_BOUGHT_PART, {"name": "engine oil", "quantity": "2"}, plain.id)).error_code is not None
    assert _store(hass, garage).get_part_stock(OIL) == 10

    assert (await ask(INTENT_ADD_NOTE, note, admin.id)).error_code is None
    assert (await ask(INTENT_ADD_NOTE, note, None)).error_code is None, "a satellite without a user"


# ─── N9-4 / N9-9: voice ─────────────────────────────────────────────────────


def test_n9_4_whole_words_before_parts_of_words() -> None:
    rows = [
        {"name": "Descale", "object_name": "Washer", "task_id": "w"},
        {"name": "Descale", "object_name": "Dishwasher", "task_id": "d"},
    ]
    assert [r["task_id"] for r in match_rows("descale on the washer", rows, "en")] == ["w"]
    assert [r["task_id"] for r in match_rows("Descale on Washer", rows, "en")] == ["w"], "the suggested phrase was ambiguous again"
    assert [r["task_id"] for r in match_rows("descale dishwasher", rows, "en")] == ["d"]
    pools = [
        {"name": "Filter cleaning", "object_name": "Pool", "task_id": "p"},
        {"name": "Filter", "object_name": "Whirlpool", "task_id": "wp"},
    ]
    assert [r["task_id"] for r in match_rows("pool filter", pools, "en")] == ["p"]


def test_n9_9_a_spoken_list_says_that_more_follow() -> None:
    items = [f"task {n}" for n in range(12)]
    spoken = _spoken_list(items, "en")
    assert spoken.startswith("task 0, task 1") and "task 8" not in spoken and spoken.endswith("and more")
    assert _spoken_list(items[:3], "en") == "task 0, task 1, task 2"
    assert _spoken_list(items, "de").endswith("und weitere")


# ─── A9-8: the Store cache ──────────────────────────────────────────────────


async def test_a9_8_a_store_that_failed_to_load_is_not_cached(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import STORES_CACHE_KEY
    from custom_components.maintenance_supporter.storage import MaintenanceStore

    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, name="Shed", uid="a98")
    with patch.object(MaintenanceStore, "async_load", AsyncMock(side_effect=OSError("disk"))):
        await setup_integration(hass, make_global_entry(hass), obj)
    assert obj.entry_id not in hass.data.get(STORES_CACHE_KEY, {}), "the next setup took the empty instance for loaded"


# ─── I9-6: the history CSV ──────────────────────────────────────────────────


async def test_i9_6_a_negative_reading_is_a_number(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, minor_version=4)
    history = [{"timestamp": "2026-03-10T09:30:00+00:00", "type": "completed", "reading_value": -5}]
    freezer_box = _object(hass, "Freezer", history=history, last_performed="2026-03-10")
    await setup_integration(hass, g, freezer_box)
    (row,) = list(csv.DictReader(io.StringIO(export_history_csv(hass))))
    assert row["reading"] == "-5", "written as text a sheet leaves out of sums"
