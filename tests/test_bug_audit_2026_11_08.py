"""Bug audit 2026-11-08: tranche A (the unreleased 2.121 work) and tranche B.

Pins, per finding:

- W8-1: a refused time-based update writes nothing (no new last performed date,
  the postpone stays) and says why in the user's language
- T8-7: ``time_based`` without an interval on an interval task keeps the interval
- T8-1: the first refresh after a reload keeps a triggered task's push and row
  when only the live trigger knows the verdict (a compound, a for-minutes
  window); a compound that recovered while nothing watched lets go quietly
- T8-2: a held rule holds a new episode, not the old reading still standing
  after the completion (live, and a latch only the sweep made)
- T8-3: an update installed while Home Assistant was down is recorded as done
- T8-4: a held date from a sensor wakes up for the next date after it is done
- O8-1: the battery fleet renamed into the server language keeps its entities
- N8-4: an own text that fills to nothing keeps the standard text
- N8-1: a completion, skip or reset keeps the push its refresh sent for the
  new cycle
- N8-2: a task handed to someone else takes the reminder off the old phones
- W8-2: the options flow takes only its own writes as its edits
- P8-1: the heir of a deleted pool owner gets the pool's stock sensor
- P8-2: a moved task's history keeps where its parts came from
- P8-5: a purchase of several parts books none when the cap refuses one
- P8-6: a part action on an object that is not running says so
- O8-6: deleting a task of an object that is not running cleans its Store
- O8-2: the retention sweep leaves objects that are not running alone
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import patch

import pytest

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_PARTS,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_update_task

from .conftest import (
    TASK_ID_1,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    set_sensor_state,
    setup_integration,
)
from .test_battery_fleet_setup import _battery, global_entry  # the fixture

PHONE = "notify.mobile_app_phone"
NO_QUIET_HOURS = {CONF_QUIET_HOURS_ENABLED: False}


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _store(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.store


def _status(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    return str(_coordinator(hass, entry).data[CONF_TASKS][TASK_ID_1].status)


def _entries(hass: HomeAssistant, entry: MockConfigEntry, kind: str) -> list[dict[str, Any]]:
    history = _coordinator(hass, entry)._get_merged_tasks_data()[TASK_ID_1].get("history") or []
    return [h for h in history if h.get("type") == kind]


def _wire(handler: Any, msg: dict[str, Any]) -> dict[str, Any]:
    """The message as the command's schema hands it over (defaults applied)."""
    out: dict[str, Any] = handler._ws_schema({"id": 1, **msg})
    return out


async def _refresh(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    await _coordinator(hass, entry).async_refresh()
    await hass.async_block_till_done()


# ─── W8-1 / T8-7: task/update with a flat time-based recurrence ─────────────


async def test_w8_1_a_refused_update_writes_nothing_and_is_translated(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(schedule_type=ScheduleType.MANUAL, interval_days=None)})
    await setup_integration(hass, g, obj)
    store = _store(hass, obj)
    store.update_task_state(TASK_ID_1, due_override="2026-12-24")
    before = store.get_last_performed(TASK_ID_1)
    conn = make_ws_connection()
    msg = _wire(
        ws_update_task,
        {"type": f"{DOMAIN}/task/update", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "schedule_type": "time_based", "interval_days": None, "last_performed": "2026-11-01"},
    )
    await call_ws_handler(ws_update_task, hass, conn, msg)
    await hass.async_block_till_done()
    assert conn.send_error.called, "expected the refusal"
    assert conn.send_error.call_args.kwargs.get("translation_key") == "time_based_needs_interval"
    assert store.get_last_performed(TASK_ID_1) == before, "refused, yet the new date was stored"
    assert store.get_task_state(TASK_ID_1).get("due_override") == "2026-12-24", "refused, yet the postpone went"


async def test_w8_1_a_create_without_an_interval_is_refused_translated(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={})
    await setup_integration(hass, g, obj)
    conn = make_ws_connection()
    msg = _wire(ws_create_task, {"type": f"{DOMAIN}/task/create", "entry_id": obj.entry_id, "name": "Descale", "schedule_type": "time_based"})
    await call_ws_handler(ws_create_task, hass, conn, msg)
    assert conn.send_error.called
    assert conn.send_error.call_args.kwargs.get("translation_key") == "time_based_needs_interval"


async def test_t8_7_time_based_without_interval_keeps_the_stored_interval(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=90)})
    await setup_integration(hass, g, obj)
    for extra in ({}, {"interval_days": None}):
        conn = make_ws_connection()
        msg = _wire(ws_update_task, {"type": f"{DOMAIN}/task/update", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "schedule_type": "time_based", **extra})
        await call_ws_handler(ws_update_task, hass, conn, msg)
        await hass.async_block_till_done()
        assert not conn.send_error.called, conn.send_error.call_args
        stored = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1]
        assert stored.get("schedule") == {"kind": "interval", "every": 90, "unit": "days", "anchor": "completion"} or (
            (stored.get("schedule") or {}).get("kind") == "interval" and stored["schedule"].get("every") == 90
        ), f"became {stored.get('schedule')} ({extra})"


async def test_t8_7_a_new_interval_with_time_based_still_applies(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=90)})
    await setup_integration(hass, g, obj)
    conn = make_ws_connection()
    msg = _wire(ws_update_task, {"type": f"{DOMAIN}/task/update", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "schedule_type": "time_based", "interval_days": 30})
    await call_ws_handler(ws_update_task, hass, conn, msg)
    await hass.async_block_till_done()
    stored = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert stored["schedule"]["every"] == 30


# ─── T8-1: the first refresh after a reload ───────────────────────────────────


def _compound_task() -> dict[str, Any]:
    return build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "compound",
            "compound_logic": "OR",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.a", "entity_ids": ["sensor.a"], "trigger_above": 10},
                {"type": "threshold", "entity_id": "sensor.b", "entity_ids": ["sensor.b"], "trigger_above": 10},
            ],
        },
    )


async def _triggered_compound(hass: HomeAssistant) -> tuple[MockConfigEntry, Any]:
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    set_sensor_state(hass, "sensor.a", "5")
    set_sensor_state(hass, "sensor.b", "5")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _compound_task()})
    await setup_integration(hass, g, obj)
    set_sensor_state(hass, "sensor.a", "50")
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    sent = [c.data.get("message") for c in phone]
    assert sent and "clear_notification" not in sent, sent
    return obj, phone


async def test_t8_1_a_reload_keeps_the_push_of_a_triggered_compound_task(hass: HomeAssistant) -> None:
    obj, phone = await _triggered_compound(hass)
    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    after = [c.data.get("message") for c in phone]
    assert "clear_notification" not in after, f"the reload took the push off the phone: {after}"
    assert len(_entries(hass, obj, "triggered")) == 1, "repainted, not announced again"


async def test_t8_1_a_compound_that_recovered_while_down_lets_go_quietly(hass: HomeAssistant) -> None:
    obj, _phone = await _triggered_compound(hass)
    await hass.config_entries.async_unload(obj.entry_id)
    await hass.async_block_till_done()
    set_sensor_state(hass, "sensor.a", "5")  # recovered while nothing watched
    await hass.config_entries.async_setup(obj.entry_id)
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.OK, "the latch from the record must not outlive the live verdict"
    assert not _coordinator(hass, obj).trigger_already_announced(TASK_ID_1), "the episode is closed on record"
    assert not _entries(hass, obj, "completed"), "quiet: no completion for a recovery nobody saw"
    # A new episode is announced again.
    set_sensor_state(hass, "sensor.b", "50")
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    assert len(_entries(hass, obj, "triggered")) == 2


async def test_t8_1_a_for_minutes_window_keeps_its_push_over_a_reload(hass: HomeAssistant) -> None:
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    set_sensor_state(hass, "sensor.a", "5")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": "sensor.a", "entity_ids": ["sensor.a"], "trigger_above": 10, "trigger_for_minutes": 5},
    )
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    set_sensor_state(hass, "sensor.a", "50")
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=6))
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    assert "clear_notification" not in [c.data.get("message") for c in phone]


# ─── T8-2: what a held rule holds ─────────────────────────────────────────────

DRAWER = "sensor.litter_robot_waste_drawer"


async def _drawer(hass: HomeAssistant) -> MockConfigEntry:
    hass.states.async_set(DRAWER, "40", {"unit_of_measurement": "%"})
    trigger = {"type": "threshold", "entity_id": DRAWER, "entity_ids": [DRAWER], "trigger_above": 80, "trigger_hold_until_done": True}
    task = build_task_data(name="Empty the drawer", schedule_type="sensor_based", interval_days=None, trigger_config=trigger)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Litter-Robot", uid="litter_t82")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    return obj


async def _reading(hass: HomeAssistant, value: str) -> None:
    hass.states.async_set(DRAWER, value, {"unit_of_measurement": "%"})
    await hass.async_block_till_done()


def _end_cooldown(hass: HomeAssistant, obj: MockConfigEntry) -> None:
    coordinator = _coordinator(hass, obj)
    coordinator._recently_completed[TASK_ID_1] = coordinator._recently_completed[TASK_ID_1] - 700


async def test_t8_2_the_old_reading_after_the_completion_is_not_held(hass: HomeAssistant) -> None:
    obj = await _drawer(hass)
    await _reading(hass, "85")
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1, notes="emptied")
    await hass.async_block_till_done()
    await _reading(hass, "86")  # the old fill, read once more
    await _reading(hass, "10")  # the drawer reads empty
    assert _status(hass, obj) == MaintenanceStatus.OK
    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    assert _status(hass, obj) == MaintenanceStatus.OK, "the emptied drawer re-latched on the reload"
    await _reading(hass, "85")
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED, "the next fill is a new episode"


async def test_t8_2_a_latch_only_the_sweep_made_after_the_completion_is_not_held(hass: HomeAssistant) -> None:
    obj = await _drawer(hass)
    await _reading(hass, "85")
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1, notes="emptied")
    await hass.async_block_till_done()
    _end_cooldown(hass, obj)
    await _refresh(hass, obj)  # the cloud sensor still reports the old fill
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    await _reading(hass, "10")  # its fresh reading comes in
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.OK, "held a latch that was never a new episode"


async def test_t8_2_a_new_episode_stays_held(hass: HomeAssistant) -> None:
    obj = await _drawer(hass)
    await _reading(hass, "85")
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1, notes="emptied")
    await hass.async_block_till_done()
    await _reading(hass, "10")
    _end_cooldown(hass, obj)
    await _reading(hass, "85")
    await _reading(hass, "70")
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED, "a new fill is held until it is done"


# ─── T8-3: an update installed while Home Assistant was down ────────────────

CORE = "update.home_assistant_core_update"


async def _update_task(hass: HomeAssistant, installed: str) -> MockConfigEntry:
    hass.states.async_set(CORE, "off", {"installed_version": installed, "latest_version": "2026.11.1"})
    trigger = {
        "type": "state_change",
        "entity_id": CORE,
        "entity_ids": [CORE],
        "trigger_from_state": "off",
        "trigger_to_state": "on",
        "trigger_target_changes": 1,
        "trigger_change_count": 1,
        "auto_complete_on_recovery": True,
    }
    fired = {
        "type": "triggered",
        "timestamp": (dt_util.utcnow() - timedelta(hours=2)).isoformat(),
        "trigger_value": 1.0,
        "trigger_change": {"from": "off", "to": "on", "installed": "2026.11.0", "latest": "2026.11.1"},
    }
    task = build_task_data(name="Update Home Assistant", schedule_type="sensor_based", interval_days=None, trigger_config=trigger, history=[fired])
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Home Assistant", uid="ha_update_t83")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    return obj


async def test_t8_3_an_update_installed_while_down_is_recorded_as_done(hass: HomeAssistant) -> None:
    obj = await _update_task(hass, installed="2026.11.1")
    assert _status(hass, obj) == MaintenanceStatus.OK
    assert len(_entries(hass, obj, "completed")) == 1, "the install while Home Assistant was down left nothing"


async def test_t8_3_a_skipped_update_still_clears_quietly(hass: HomeAssistant) -> None:
    obj = await _update_task(hass, installed="2026.11.0")
    assert _status(hass, obj) == MaintenanceStatus.OK
    assert not _entries(hass, obj, "completed"), "nothing was installed: no completion"


# ─── T8-4: a held date from a sensor after it is done ───────────────────────

FILTER_DUE = "sensor.purifier_filter_due"


async def test_t8_4_a_held_date_wakes_up_for_the_next_one(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    now = dt_util.utcnow()
    hass.states.async_set(FILTER_DUE, (now + timedelta(days=2)).isoformat(), {"device_class": "timestamp"})
    trigger = {"type": "due_date", "entity_id": FILTER_DUE, "entity_ids": [FILTER_DUE], "trigger_days_before": 7, "trigger_hold_until_done": True}
    task = build_task_data(name="Change the filter", schedule_type="sensor_based", interval_days=None, trigger_config=trigger)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Purifier", uid="purifier_t84")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    hass.states.async_set(FILTER_DUE, (now + timedelta(days=90)).isoformat(), {"device_class": "timestamp"})
    await hass.async_block_till_done()
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    assert _status(hass, obj) == MaintenanceStatus.OK
    freezer.move_to(now + timedelta(days=84))
    async_fire_time_changed(hass, now + timedelta(days=84))
    await hass.async_block_till_done()
    assert len(_entries(hass, obj, "triggered")) == 2, "the next date fired live, with its history entry"


# ─── O8-1: the battery fleet in the server language ───────────────────────────


async def test_o8_1_the_fleet_renamed_into_the_server_language_keeps_its_entities(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_entry
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    hass.config.language = "en"
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x", "language": "en"})
    await hass.async_block_till_done()
    entry = find_fleet_entry(hass)
    assert entry is not None and entry.data[CONF_OBJECT]["name"] == "Battery Fleet"
    reg = er.async_get(hass)
    before = {e.entity_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)}
    assert before

    hass.config.language = "de"
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.data[CONF_OBJECT]["name"] == "Batterie-Flotte"
    after = {e.entity_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)}
    assert after == before, f"new entities: {sorted(after - before)}"


# ─── N8-4: an own text that fills to nothing ─────────────────────────────────


async def test_n8_4_an_own_text_that_fills_to_nothing_keeps_the_standard_text(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()})
    await setup_integration(hass, g, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    task = {"notification_texts": {"triggered": {"title": "{detail}", "message": "{detail}"}}}
    standard = nm._build_message(MaintenanceStatus.TRIGGERED, "en", "Salt", "Dishwasher", None, None)
    own = nm._build_message(MaintenanceStatus.TRIGGERED, "en", "Salt", "Dishwasher", None, None, task=task, detail=None)
    assert own == standard, "an own text without its detail sent a push without a text"
    filled = nm._build_message(MaintenanceStatus.TRIGGERED, "en", "Salt", "Dishwasher", None, None, task=task, detail="Rinse aid low")
    assert filled == ("Rinse aid low", "Rinse aid low")


# ─── N8-1: the new cycle's push after a completion, skip or reset ───────────


async def _overdue_with_phone(hass: HomeAssistant) -> tuple[MockConfigEntry, Any]:
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, warning_days=7, last_performed=last)})
    await setup_integration(hass, g, obj)
    assert _status(hass, obj) == MaintenanceStatus.OVERDUE
    return obj, phone


async def test_n8_1_a_reset_that_is_due_soon_at_once_keeps_its_fresh_push(hass: HomeAssistant) -> None:
    obj, phone = await _overdue_with_phone(hass)
    await _coordinator(hass, obj).reset_maintenance(TASK_ID_1, date=dt_util.now().date() - timedelta(days=25))
    await hass.async_block_till_done()
    assert _status(hass, obj) == MaintenanceStatus.DUE_SOON
    messages = [c.data.get("message") for c in phone]
    pushes = [m for m in messages if m != "clear_notification"]
    assert len(pushes) == 1, messages
    assert messages[-1] != "clear_notification", f"the fresh push was taken off again: {messages}"
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    assert nm.was_reminded(obj.entry_id, TASK_ID_1), "its stamp was cleared with the old cycle's"
    await _refresh(hass, obj)
    assert len([c for c in phone if c.data.get("message") != "clear_notification"]) == 1, "sent again on the next refresh"


async def test_n8_1_a_reset_without_a_new_push_still_takes_the_old_one_off(hass: HomeAssistant) -> None:
    obj, phone = await _overdue_with_phone(hass)
    await _coordinator(hass, obj).reset_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    assert _status(hass, obj) == MaintenanceStatus.OK
    assert [c.data.get("message") for c in phone] == ["clear_notification"]


async def test_n8_1_a_completion_from_the_phone_keeps_the_next_cycles_push(hass: HomeAssistant) -> None:
    """A weekly task on its planned grid, done a day late: the next one is
    due in six days, inside the warning window at once."""
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    last = (dt_util.now().date() - timedelta(days=8)).isoformat()
    task = {**build_task_data(interval_days=7, warning_days=7, last_performed=last), "interval_anchor": "planned"}
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    assert _status(hass, obj) == MaintenanceStatus.OVERDUE
    hass.bus.async_fire("mobile_app_notification_action", {"action": f"MS_COMPLETE_{obj.entry_id}_{TASK_ID_1}"})
    await hass.async_block_till_done()
    assert _status(hass, obj) == MaintenanceStatus.DUE_SOON
    messages = [c.data.get("message") for c in phone]
    assert messages and messages[-1] != "clear_notification", f"the next cycle's push was taken off: {messages}"


# ─── N8-2: the reminder of a task handed to someone else ─────────────────────


async def test_n8_2_a_reassigned_task_takes_its_reminder_off_the_old_phones(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.task_trace import get_trace
    from custom_components.maintenance_supporter.websocket.users import ws_assign_user

    ann = await hass.auth.async_create_user("Ann")
    ben = await hass.auth.async_create_user("Ben")
    async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = {**build_task_data(interval_days=30, last_performed=last), "responsible_user_id": ann.id}
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    assert nm.was_reminded(obj.entry_id, TASK_ID_1)
    dismissed: list[list[str]] = []

    async def _dismiss(task_id: str, user_ids: Any = ()) -> None:
        dismissed.append(list(user_ids))

    with patch.object(nm, "async_dismiss_task_notification", _dismiss):
        conn = make_ws_connection()
        msg = {"id": 1, "type": f"{DOMAIN}/task/assign_user", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "user_id": ben.id}
        await call_ws_handler(ws_assign_user, hass, conn, msg)
        await hass.async_block_till_done()
    assert not conn.send_error.called
    assert dismissed == [[ann.id]], "the push stayed on the phone of the person it went to"
    trace = get_trace(hass)
    assert trace is not None
    reasons = [e.get("reason") for e in trace.events(obj.entry_id, TASK_ID_1) if e["kind"] == "reminder_cleared"]
    assert reasons == ["reassigned"]


# ─── W8-2: the options flow's own writes ─────────────────────────────────────


async def test_w8_2_done_does_not_take_what_others_wrote_meanwhile(hass: HomeAssistant) -> None:
    from homeassistant.data_entry_flow import FlowResultType

    from custom_components.maintenance_supporter.helpers.task_trace import get_trace

    g = make_global_entry(hass)
    parts = {"p1": {"id": "p1", "name": "Filter", "unit": "pcs"}}
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, extra_data={CONF_PARTS: parts}, minor_version=4)
    await setup_integration(hass, g, obj)
    r = await hass.config_entries.options.async_init(obj.entry_id)
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    # Meanwhile: a purchase price lands on the part, a panel edit on the task.
    new_parts = {"p1": {**entry.data[CONF_PARTS]["p1"], "unit_price": 4.5}}
    new_tasks = {TASK_ID_1: {**entry.data[CONF_TASKS][TASK_ID_1], "notes": "From the panel"}}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_PARTS: new_parts, CONF_TASKS: new_tasks})
    with patch.object(hass.config_entries, "async_reload") as reload, patch.object(hass.config_entries, "async_schedule_reload") as schedule:
        r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "done"})
        await hass.async_block_till_done()
    assert r["type"] == FlowResultType.CREATE_ENTRY
    assert not reload.called and not schedule.called, "a closed flow without a change reloaded the object"
    trace = get_trace(hass)
    assert trace is not None
    assert not [e for e in trace.events(obj.entry_id, TASK_ID_1) if e["kind"] == "edited"], "the panel's edit was traced as the flow's"


# ─── Spare parts: P8-1, P8-2, P8-5, P8-6 ─────────────────────────────────────

BAGS = "part_bags"


async def test_p8_1_the_heir_of_a_pool_gets_its_stock_sensor(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_TASK_CONSUMES_PARTS

    from .conftest import build_object_data

    g = make_global_entry(hass, minor_version=4)
    bags = {"id": BAGS, "name": "Dust bags", "unit": "pcs", "reorder_threshold": 2, "restock_quantity": 6}
    shelf_obj = {**build_object_data(name="Shelf", object_id="shelf"), "created_at": "2026-01-01"}
    shelf = make_object_entry(
        hass, tasks={TASK_ID_1: build_task_data()}, name="Shelf", uid="p81_shelf", object_data=shelf_obj, minor_version=4, extra_data={CONF_PARTS: {BAGS: bags}}
    )
    vac_task = {**build_task_data(), CONF_TASK_CONSUMES_PARTS: [{"entry_id": shelf.entry_id, "part_id": BAGS, "quantity": 1}]}
    vac_obj = {**build_object_data(name="Vacuum", object_id="vacuum"), "created_at": "2026-02-01"}
    vacuum = make_object_entry(hass, tasks={TASK_ID_1: vac_task}, name="Vacuum", uid="p81_vacuum", object_data=vac_obj, minor_version=4)
    await setup_integration(hass, g, shelf, vacuum)
    reg = er.async_get(hass)

    def _stock_sensor() -> list[str]:
        return [e.entity_id for e in er.async_entries_for_config_entry(reg, vacuum.entry_id) if e.unique_id.endswith(f"_part_{BAGS}")]

    assert not _stock_sensor()
    await hass.config_entries.async_remove(shelf.entry_id)
    await hass.async_block_till_done()
    assert _stock_sensor(), "the inherited pool had no stock sensor until a restart"


async def test_p8_2_a_moved_tasks_history_keeps_where_its_parts_came_from(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks import ws_move_task

    g = make_global_entry(hass, minor_version=4)
    seal = {"seal": {"id": "seal", "name": "Seal", "unit": "pcs"}}
    pump = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(name="Repair")}, name="Pump", uid="p82_pump", minor_version=4, extra_data={CONF_PARTS: seal})
    garage = make_object_entry(hass, tasks={}, name="Garage", uid="p82_garage", minor_version=4)
    await setup_integration(hass, g, pump, garage)
    store = _store(hass, pump)
    store.set_part_stock("seal", 3)
    await _coordinator(hass, pump).complete_maintenance(TASK_ID_1, used_parts=[{"part_id": "seal", "quantity": 1}])
    await hass.async_block_till_done()
    assert store.get_part_stock("seal") == 2
    conn = make_ws_connection()
    msg = {"id": 1, "type": "x", "entry_id": pump.entry_id, "task_id": TASK_ID_1, "target_entry_id": garage.entry_id}
    await call_ws_handler(ws_move_task, hass, conn, msg)
    await hass.async_block_till_done()
    assert not conn.send_error.called, conn.send_error.call_args
    history = _store(hass, garage).get_task_state(TASK_ID_1)["history"]
    used = [link for entry in history for link in entry.get("used_parts") or []]
    assert used and all(link.get("entry_id") == pump.entry_id for link in used), used


async def _two_parts(hass: HomeAssistant, uid: str) -> tuple[MockConfigEntry, list[str]]:
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock

    g = make_global_entry(hass)
    parts = {
        "p_salt": {"id": "p_salt", "name": "Salt", "unit": "kg", "restock_quantity": 1},
        "p_tabs": {"id": "p_tabs", "name": "Tabs", "unit": "pcs", "restock_quantity": 20},
    }
    tasks = {f"t{i}": build_task_data(task_id=f"t{i}", name=f"Task {i}") for i in range(2)}
    obj = make_object_entry(hass, tasks=tasks, name="Dishwasher", uid=uid, extra_data={CONF_PARTS: parts}, minor_version=4)
    await setup_integration(hass, g, obj)
    for part_id in parts:
        await async_change_part_stock(hass, obj, part_id, absolute=5)
    await hass.async_block_till_done()
    sensors = sorted(s.entity_id for s in hass.states.async_all("sensor") if s.attributes.get("part_name"))
    return obj, sensors


async def test_p8_5_a_purchase_of_two_parts_at_the_cap_books_none(hass: HomeAssistant) -> None:
    from homeassistant.exceptions import ServiceValidationError

    obj, sensors = await _two_parts(hass, "p85")
    with patch("custom_components.maintenance_supporter.parts_runtime.MAX_TASKS_PER_OBJECT", 3), pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_purchase", {"entity_id": sensors}, blocking=True)
    assert err.value.translation_key == "task_limit"
    store = _store(hass, obj)
    assert store.get_part_stock("p_salt") == 5 and store.get_part_stock("p_tabs") == 5, "the first part was booked"
    assert len(hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS]) == 2, "a buy reminder was made"


async def test_p8_6_a_part_action_on_an_object_not_running_says_so(hass: HomeAssistant) -> None:
    from homeassistant.exceptions import ServiceValidationError

    obj, sensors = await _two_parts(hass, "p86")
    await hass.config_entries.async_unload(obj.entry_id)
    await hass.async_block_till_done()
    for service in ("part_purchase", "part_use"):
        with pytest.raises(ServiceValidationError) as err:
            await hass.services.async_call(DOMAIN, service, {"entity_id": sensors[:1]}, blocking=True)
        assert err.value.translation_key == "part_owner_not_loaded", service


# ─── O8-6 / O8-2: an object that is not running ───────────────────────────────


async def test_o8_6_deleting_a_task_of_an_object_not_running_cleans_its_store(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.task_persist import async_delete_task
    from custom_components.maintenance_supporter.storage import MaintenanceStore

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(), "t2": build_task_data(task_id="t2", name="Other")})
    await setup_integration(hass, g, obj)
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    await _store(hass, obj).async_save()
    await hass.config_entries.async_unload(obj.entry_id)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert await async_delete_task(hass, entry, TASK_ID_1)
    disk = MaintenanceStore(hass, obj.entry_id)
    await disk.async_load()
    assert TASK_ID_1 not in disk.all_task_states(), "the Store kept the deleted task (and the record of its to-do rows)"


async def test_o8_2_the_retention_sweep_leaves_an_object_not_running_alone(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_DELETE_ARCHIVED_ONEOFF_DAYS
    from custom_components.maintenance_supporter.helpers.retention import async_run_retention_sweep

    g = make_global_entry(hass, extra_data={CONF_DELETE_ARCHIVED_ONEOFF_DAYS: 1})
    archived = (dt_util.now() - timedelta(days=30)).isoformat()
    task = {**build_task_data(schedule_type="one_time", interval_days=None), "due_date": "2026-01-01", "archived_at": archived, "archived_reason": "auto"}
    obj = make_object_entry(hass, tasks={TASK_ID_1: task, "t2": build_task_data(task_id="t2", name="Other")})
    await setup_integration(hass, g, obj)
    store = _store(hass, obj)
    store.set_history(TASK_ID_1, [{"type": "completed", "timestamp": (dt_util.now() - timedelta(days=40)).isoformat(), "cost": 120.0}])
    await store.async_save()
    await hass.config_entries.async_unload(obj.entry_id)
    await hass.async_block_till_done()
    await async_run_retention_sweep(hass)
    await hass.async_block_till_done()
    assert TASK_ID_1 in hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS], "a task with booked money was deleted"
