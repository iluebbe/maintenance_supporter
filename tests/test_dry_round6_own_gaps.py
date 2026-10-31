"""DRY audit round 6 (2026-10-30), tranche 1: the gaps v2.113 left itself.

The purchase (#238) had three doors with three sets of rules: the service
booked one total on every part it named, voice "bought …" without an open
reminder only moved the stock, and the date and the task limit were refused
in different words. The reminder clean-up (#239) depended on what a
coordinator had seen, and a pause or an archive reloads the object, so the
reminder of a paused task stayed on the phones; a deleted task's did too,
and so did a lead-time reminder after the completion.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
from custom_components.maintenance_supporter.helpers.parts import POOL_IN_USE_FIELD
from custom_components.maintenance_supporter.intent import INTENT_BOUGHT_PART, INTENT_UNDO, async_setup_intents
from custom_components.maintenance_supporter.parts_runtime import async_part_purchase
from custom_components.maintenance_supporter.websocket.objects import ws_delete_object
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_delete_task
from custom_components.maintenance_supporter.websocket.tasks_lifecycle import ws_pause_task

from .conftest import (
    TASK_ID_1,
    assert_ws_error,
    assert_ws_success,
    build_object_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)
from .test_part_purchase_238 import FILTER, FLUID, _buy, _buy_tasks, _completions, _live, _sensor, _shelf, _stock

PHONE = "notify.mobile_app_phone"
CLEAR = {"message": "clear_notification", "data": {"tag": f"maintenance_{TASK_ID_1}"}}
# Quiet hours are on by default and the test clock is US/Pacific.
NO_QUIET_HOURS = {CONF_QUIET_HOURS_ENABLED: False}


# ─── the purchase ───────────────────────────────────────────────────────────


async def test_one_total_is_not_booked_on_every_part(hass: HomeAssistant) -> None:
    """BI6-A1: the service took several parts and one ``cost``, and booked
    that total on each. A price each still applies to every part."""
    entry = await _shelf(hass)
    both = [_sensor(hass, entry, FLUID), _sensor(hass, entry, FILTER)]
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_purchase", {"entity_id": both, "cost": 30}, blocking=True)
    assert err.value.translation_key == "single_entity_only"
    assert (_stock(hass, entry, FLUID), _stock(hass, entry, FILTER)) == (12, 1), "nothing booked"

    resp = await hass.services.async_call(DOMAIN, "part_purchase", {"entity_id": both, "unit_price": 3}, blocking=True, return_response=True)
    await hass.async_block_till_done()
    assert [p["cost"] for p in resp["parts"]] == [6, 3], "2 jugs (the restock amount), 1 filter"


async def test_a_day_in_the_future_is_refused_before_a_reminder_is_made(hass: HomeAssistant) -> None:
    """BI6-B4/A10: the runtime itself refuses, in the WebSocket command's
    words; the completion refused only after the reminder existed."""
    entry = await _shelf(hass)
    with pytest.raises(ServiceValidationError) as err:
        await async_part_purchase(hass, entry, FILTER, day=dt_util.now().date() + timedelta(days=1))
    assert err.value.translation_key == "date_in_future"
    await hass.async_block_till_done()
    assert not _buy_tasks(hass, entry)
    assert _stock(hass, entry, FILTER) == 1


async def test_a_total_above_what_one_completion_books_is_refused(hass: HomeAssistant) -> None:
    """BI6-A6: price each × quantity could pass every field's bound and
    still exceed the cost a history entry holds."""
    entry = await _shelf(hass)
    code, _msg = assert_ws_error(await _buy(hass, entry, FILTER, quantity=20, unit_price=100_000))
    assert code == "purchase_cost_too_high"
    assert _stock(hass, entry, FILTER) == 1
    assert not _buy_tasks(hass, entry)


async def test_the_task_limit_is_said_in_words(hass: HomeAssistant) -> None:
    """BI6-A10: the service answered the task limit with an untranslated
    ``invalid_input``, the WebSocket command with another."""
    entry = await _shelf(hass)
    with patch("custom_components.maintenance_supporter.helpers.entry_tasks.MAX_TASKS_PER_OBJECT", 0):
        with pytest.raises(ServiceValidationError) as err:
            await hass.services.async_call(DOMAIN, "part_purchase", {"entity_id": _sensor(hass, entry, FILTER)}, blocking=True)
        code, _msg = assert_ws_error(await _buy(hass, entry, FILTER))
    assert err.value.translation_key == "task_limit" and code == "task_limit"
    assert _stock(hass, entry, FILTER) == 1


async def test_a_retired_owner_whose_pool_is_in_use_takes_a_purchase(hass: HomeAssistant) -> None:
    """BI6-A3: the reconcile keeps the buy reminder of a pool live objects
    still draw on, and the purchase refused it all the same."""
    entry = await _shelf(hass, object_extra={"archived_at": "2026-01-01T00:00:00+00:00"})
    task = {**build_task_data(object_id="kitchen_tap"), "consumes_parts": [{"part_id": FILTER, "entry_id": entry.entry_id, "quantity": 1}]}
    borrower = make_object_entry(
        hass, tasks={TASK_ID_1: task}, name="Kitchen tap", uid="kitchen_tap", object_data=build_object_data(name="Kitchen tap", object_id="kitchen_tap")
    )
    await hass.config_entries.async_setup(borrower.entry_id)
    await hass.async_block_till_done()

    result = assert_ws_success(await _buy(hass, entry, FILTER, quantity=2, unit_price=8))
    assert _stock(hass, entry, FILTER) == 3
    assert _buy_tasks(hass, entry)[result["task_id"]].get(POOL_IN_USE_FIELD) is True
    # The fluid nobody borrows stays refused.
    code, _msg = assert_ws_error(await _buy(hass, entry, FLUID))
    assert code == "part_owner_archived"


# ─── voice "bought …" ───────────────────────────────────────────────────────


async def _ask(hass: HomeAssistant, intent_type: str, slots: dict[str, Any] | None = None) -> intent.IntentResponse:
    return await intent.async_handle(
        hass, "test", intent_type, {k: {"value": v} for k, v in (slots or {}).items()}, language="en", context=Context()
    )


async def test_bought_by_voice_is_a_purchase_and_its_undo_takes_it_back(hass: HomeAssistant) -> None:
    """BI6-A2: with no reminder open, "bought …" only raised the stock: no
    history entry, nothing averaged, unlike *Bought…* in the panel."""
    await async_setup_intents(hass)
    entry = await _shelf(hass)
    await _ask(hass, INTENT_BOUGHT_PART, {"name": "water filter", "quantity": 4})
    await hass.async_block_till_done()
    assert _stock(hass, entry, FILTER) == 5
    [(task_id, task)] = _buy_tasks(hass, entry).items()
    assert task["name"] == "Buy Water filter"
    [done] = _completions(hass, entry, task_id)
    assert done.get("purchase") is True

    response = await _ask(hass, INTENT_UNDO)
    await hass.async_block_till_done()
    assert "back out of stock" in str(response.speech["plain"]["speech"])
    assert _stock(hass, entry, FILTER) == 1
    assert not _buy_tasks(hass, entry), "the reminder made for the purchase went with it"


# ─── the reminder on the phones ─────────────────────────────────────────────


async def _overdue(hass: HomeAssistant) -> tuple[MockConfigEntry, list[Any]]:
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=last)})
    await setup_integration(hass, g, obj)
    assert obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.OVERDUE
    return obj, phone


def _admin() -> Any:
    conn = make_ws_connection()
    conn.user.is_admin = True
    return conn


async def test_a_paused_task_takes_its_reminder_off_the_phones(hass: HomeAssistant) -> None:
    """BR6-A1: the pause reloads the object, the new coordinator had seen no
    status before, and the reminder stayed."""
    obj, phone = await _overdue(hass)
    conn = _admin()
    await call_ws_handler(ws_pause_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    assert [c.data for c in phone].count(CLEAR) == 1

    await _live(hass, obj).runtime_data.coordinator.async_refresh()
    assert [c.data for c in phone].count(CLEAR) == 1, "once"


async def test_what_is_on_the_phones_survives_a_restart(hass: HomeAssistant) -> None:
    nm = NotificationManager(hass)
    nm._on_phones["e1_t1"] = "status"
    saved = nm._snapshot()

    restarted = NotificationManager(hass)
    with patch.object(restarted._store, "async_load", AsyncMock(return_value=saved)):
        await restarted.async_load()
    assert restarted.was_reminded("e1", "t1")
    assert restarted.take_outdated_off_phones("e1", "t1", inert=False)
    assert not restarted.take_outdated_off_phones("e1", "t1", inert=False), "once"


async def test_a_deleted_task_takes_its_reminder_off_the_phones(hass: HomeAssistant) -> None:
    """BR6-A2: the delete only forgot the bookkeeping."""
    obj, phone = await _overdue(hass)
    conn = _admin()
    await call_ws_handler(ws_delete_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    assert [c.data for c in phone].count(CLEAR) == 1


async def test_a_deleted_object_takes_its_reminders_off_the_phones(hass: HomeAssistant) -> None:
    obj, phone = await _overdue(hass)
    conn = _admin()
    await call_ws_handler(ws_delete_object, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    assert [c.data for c in phone].count(CLEAR) == 1
    assert not hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]._on_phones


async def test_a_lead_reminder_stays_while_it_is_true_and_leaves_with_the_completion(hass: HomeAssistant) -> None:
    """BR6-A3: ``was_reminded`` knew the status reminders only, so a task
    completed after its "due in 3 days" push kept that push."""
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: {**build_task_data(interval_days=30, last_performed=last), "warning_days": 3}})
    await setup_integration(hass, g, obj)
    coordinator = obj.runtime_data.coordinator
    assert coordinator.data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.OK
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]

    await nm.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Filter Cleaning", "Test Object", 10)
    assert len(phone) == 1 and phone[0].data["data"]["tag"] == CLEAR["data"]["tag"]
    assert nm.was_reminded(obj.entry_id, TASK_ID_1)

    await coordinator.async_refresh()
    assert CLEAR not in [c.data for c in phone], "still due in ten days: the push is right"

    await coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    assert [c.data for c in phone].count(CLEAR) == 1


async def test_a_lead_reminder_leaves_when_the_task_is_paused(hass: HomeAssistant) -> None:
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=last)})
    await setup_integration(hass, g, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    await nm.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Filter Cleaning", "Test Object", 10)

    await call_ws_handler(ws_pause_task, hass, _admin(), {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    await hass.async_block_till_done()
    assert [c.data for c in phone].count(CLEAR) == 1
