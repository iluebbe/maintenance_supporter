"""Bug audit 2026-10-16, tranche 2 — the medium findings, backend half.

- W1: a history edit or delete re-derived ``last_performed`` from the newest
  entry: it threw away a reset to an earlier day (stamped when recorded), the
  dialog's "last performed" and a postpone.
- W2: applying a suggested interval dropped the seasonal window and the end.
- W3: an object nested under a deleted parent could not be saved any more.
- N1: a reminder's buttons acted on the next cycle once the task was closed
  elsewhere; closing it elsewhere left the reminder on the phones.
- N2: the dismissal posted the text "clear_notification" to Telegram & co.
- T1: an AND/OR condition over several sensors kept their pre-completion
  states. T4: "complete when it recovers" never fired on an AND/OR trigger.
- T2: a hold-window start restored after a restart outlived the value
  returning to normal. T5: one reading under the delta baseline re-based it.
- G2-G5: the options flow's trigger steps forgot the stored settings, wiped a
  one-time due date, the warning days, and could not remove the interval.
- C-D: deleting one of two people dissolved their shared task.
- C-E: a tag scan stopped at the first (retired) task carrying the tag.
- F3: completion photos counted toward the 100-documents cap. F4: a missing
  file was recorded as unreadable for good. F5/F9: the archive restore held
  everything in memory; an encrypted archive was a 500.
- S1: a pool's buy task froze with its paused owner. S2: an archived
  predecessor's parts were counted. S3: one swap consumed spare cells twice.

Each docstring names the failure, so a red test says which bug came back.
"""

from __future__ import annotations

import io
import json
import zipfile
from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, PropertyMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_CHECKLISTS,
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DOCUMENT_STORE_KEY,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
    HistoryEntryType,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)
TASK = "task_1"


def _days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


async def _setup(
    hass: HomeAssistant,
    tasks: dict[str, dict[str, Any]],
    *,
    name: str = "Boiler",
    uid: str = "t2b",
    object_extra: dict[str, Any] | None = None,
    entry_extra: dict[str, Any] | None = None,
    global_entry: MockConfigEntry | None = None,
) -> MockConfigEntry:
    g = global_entry or make_global_entry(hass)
    obj_data = build_object_data(name=name, object_id=uid)
    obj_data.update(object_extra or {})
    obj = make_object_entry(hass, tasks=tasks, name=name, uid=uid, object_data=obj_data, extra_data=entry_extra)
    await setup_integration(hass, g, obj)
    return obj


def _live(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id)


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return _live(hass, entry).runtime_data.coordinator


def _merged(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK) -> dict[str, Any]:
    return dict(_coordinator(hass, entry)._get_merged_tasks_data()[task_id])


def _state(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK) -> dict[str, Any]:
    return dict(_live(hass, entry).runtime_data.store.get_task_state(task_id))


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    conn.user.is_admin = True
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return conn


def _task(**over: Any) -> dict[str, Any]:
    task = build_task_data(task_id=TASK, name="Service", interval_days=30, last_performed=_days_ago(40))
    task.update(over)
    return task


# ─── W1: the history edit keeps what the history does not explain ─────────


async def test_a_note_fixed_on_a_completion_keeps_a_reset_to_an_earlier_day(hass: HomeAssistant) -> None:
    """The reset entry is stamped when it was recorded: re-derived from that
    stamp, the anchor jumped from the reset day to today on a note edit."""
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_reset_task
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_update_history_entry

    done_at = f"{_days_ago(40)}T09:00:00+00:00"
    entry = await _setup(hass, {TASK: _task(history=[{"timestamp": done_at, "type": "completed"}])})
    await _ws(hass, ws_reset_task, {"type": "maintenance_supporter/task/reset", "entry_id": entry.entry_id, "task_id": TASK, "date": _days_ago(10)})
    assert _merged(hass, entry)["last_performed"] == _days_ago(10)
    reset = next(h for h in _merged(hass, entry)["history"] if h["type"] == HistoryEntryType.RESET)
    assert reset["reset_date"] == _days_ago(10)

    await _ws(
        hass,
        ws_update_history_entry,
        {"type": "maintenance_supporter/task/history/update", "entry_id": entry.entry_id, "task_id": TASK, "original_timestamp": done_at, "notes": "new filter"},
    )
    assert _merged(hass, entry)["last_performed"] == _days_ago(10)


async def test_a_note_edit_keeps_the_dialogs_last_performed_and_a_postpone(hass: HomeAssistant) -> None:
    """The dialog's "last performed" writes no history entry: a note fixed
    on the last completion moved the anchor back to it and dropped the
    postponed occurrence."""
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_postpone_task
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_update_history_entry

    done_at = f"{_days_ago(40)}T09:00:00+00:00"
    entry = await _setup(hass, {TASK: _task(history=[{"timestamp": done_at, "type": "completed"}])})
    base = {"entry_id": entry.entry_id, "task_id": TASK}
    await _ws(hass, ws_update_task, {"type": "maintenance_supporter/task/update", **base, "last_performed": _days_ago(5)})
    until = (dt_util.now().date() + timedelta(days=40)).isoformat()
    await _ws(hass, ws_postpone_task, {"type": "maintenance_supporter/task/postpone", **base, "until": until})
    assert _state(hass, entry).get("due_override") == until

    await _ws(hass, ws_update_history_entry, {"type": "maintenance_supporter/task/history/update", **base, "original_timestamp": done_at, "notes": "x"})
    assert _merged(hass, entry)["last_performed"] == _days_ago(5)
    assert _state(hass, entry).get("due_override") == until


async def test_deleting_the_latest_completion_keeps_a_later_dialog_anchor(hass: HomeAssistant) -> None:
    """A last-performed day set in the dialog after the latest completion is
    newer than anything the history says: deleting that completion must not
    send the task back to the one before."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_delete_history_entry

    older, newer = f"{_days_ago(60)}T09:00:00+00:00", f"{_days_ago(30)}T09:00:00+00:00"
    history = [{"timestamp": older, "type": "completed"}, {"timestamp": newer, "type": "completed"}]
    entry = await _setup(hass, {TASK: _task(history=history, last_performed=_days_ago(30))})
    base = {"entry_id": entry.entry_id, "task_id": TASK}
    await _ws(hass, ws_update_task, {"type": "maintenance_supporter/task/update", **base, "last_performed": _days_ago(5)})
    await _ws(hass, ws_delete_history_entry, {"type": "maintenance_supporter/task/history/delete", **base, "timestamp": newer})
    assert _merged(hass, entry)["last_performed"] == _days_ago(5)


async def test_deleting_the_reset_returns_to_the_completion_before_it(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_reset_task
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_delete_history_entry

    done_at = f"{_days_ago(40)}T09:00:00+00:00"
    entry = await _setup(hass, {TASK: _task(history=[{"timestamp": done_at, "type": "completed"}])})
    base = {"entry_id": entry.entry_id, "task_id": TASK}
    await _ws(hass, ws_reset_task, {"type": "maintenance_supporter/task/reset", **base, "date": _days_ago(10)})
    reset = next(h for h in _merged(hass, entry)["history"] if h["type"] == HistoryEntryType.RESET)
    await _ws(hass, ws_delete_history_entry, {"type": "maintenance_supporter/task/history/delete", **base, "timestamp": reset["timestamp"]})
    assert _merged(hass, entry)["last_performed"] == _days_ago(40)


async def test_a_completion_logged_after_a_past_reset_is_the_latest(hass: HomeAssistant) -> None:
    """After "reset to 20 days ago" (recorded today), a completion dated 10
    days ago counted as an old backfill: the anchor stayed on the reset day."""
    from datetime import datetime, time

    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_reset_task

    entry = await _setup(hass, {TASK: _task()})
    await _ws(hass, ws_reset_task, {"type": "maintenance_supporter/task/reset", "entry_id": entry.entry_id, "task_id": TASK, "date": _days_ago(20)})
    ten_days_ago = datetime.combine(dt_util.now().date() - timedelta(days=10), time(9, 0), tzinfo=dt_util.DEFAULT_TIME_ZONE)
    await _coordinator(hass, entry).complete_maintenance(TASK, completed_at=ten_days_ago)
    await hass.async_block_till_done()
    assert _merged(hass, entry)["last_performed"] == _days_ago(10)


def test_a_legacy_reset_entry_anchors_on_the_day_its_note_names() -> None:
    from custom_components.maintenance_supporter.helpers.history import anchor_stamp, latest_anchor_stamp

    legacy = {"type": "reset", "timestamp": "2026-10-16T10:00:00+00:00", "notes": "Reset to 2026-10-01"}
    assert anchor_stamp(legacy) == "2026-10-01"
    assert anchor_stamp({**legacy, "notes": "edited"}) == "2026-10-16T10:00:00+00:00"
    assert anchor_stamp({"type": "triggered", "timestamp": "2026-10-16T10:00:00"}) is None
    done = {"type": "completed", "timestamp": "2026-10-05T08:00:00+00:00"}
    assert latest_anchor_stamp([done, legacy]) == "2026-10-05T08:00:00+00:00"


# ─── W2: a suggested interval keeps the season and the end ────────────────


async def test_applying_a_suggested_interval_keeps_season_and_end(hass: HomeAssistant) -> None:
    schedule = {"kind": "interval", "every": 30, "season_months": [4, 5, 6, 7, 8, 9], "ends": {"count": 6}}
    task = _task(schedule=schedule)
    for key in ("interval_days", "schedule_type"):
        task.pop(key, None)
    entry = await _setup(hass, {TASK: task})
    await _coordinator(hass, entry).async_apply_suggested_interval(TASK, 21)
    stored = _live(hass, entry).data[CONF_TASKS][TASK]["schedule"]
    assert stored == {"kind": "interval", "every": 21, "season_months": [4, 5, 6, 7, 8, 9], "ends": {"count": 6}}


# ─── W3: a deleted parent object ────────────────────────────────────────


async def test_deleting_a_parent_frees_its_children(hass: HomeAssistant) -> None:
    """The child kept the pointer; the dialog re-sends it on every save and
    the update refused it: no change to the child could be saved."""
    from custom_components.maintenance_supporter.websocket.objects import ws_update_object

    g = make_global_entry(hass)
    parent = make_object_entry(hass, tasks={}, name="Heating", uid="heating")
    child = make_object_entry(
        hass, tasks={}, name="Pump", uid="pump", object_data={**build_object_data(name="Pump", object_id="pump"), "parent_entry_id": parent.entry_id}
    )
    await setup_integration(hass, g, parent, child)
    await hass.config_entries.async_remove(parent.entry_id)
    await hass.async_block_till_done()
    assert _live(hass, child).data[CONF_OBJECT].get("parent_entry_id") is None

    # A pointer left over from before the fix is cleared by the next save.
    obj = dict(_live(hass, child).data[CONF_OBJECT])
    hass.config_entries.async_update_entry(_live(hass, child), data={**_live(hass, child).data, CONF_OBJECT: {**obj, "parent_entry_id": "gone"}})
    conn = await _ws(
        hass,
        ws_update_object,
        {"type": "maintenance_supporter/object/update", "entry_id": child.entry_id, "notes": "x", "parent_entry_id": "gone"},
    )
    assert conn.send_result.called, conn.send_error.call_args
    assert _live(hass, child).data[CONF_OBJECT].get("parent_entry_id") is None


# ─── N1 / N2: outdated reminders, dismissal ─────────────────────────────


async def test_an_outdated_reminders_complete_button_does_nothing(hass: HomeAssistant) -> None:
    """Completed in the panel, the reminder's Complete on a phone completed
    the NEXT cycle: a second history entry, the rotation handed on twice."""
    from custom_components.maintenance_supporter.helpers.history import cycle_token
    from custom_components.maintenance_supporter.helpers.notification_ids import action_cycle, action_id, parse_action_id

    entry = await _setup(hass, {TASK: _task()})
    coordinator = _coordinator(hass, entry)
    sent = action_id("COMPLETE", entry.entry_id, TASK, cycle_token(_merged(hass, entry).get("history")))
    assert parse_action_id(sent) == ("complete", entry.entry_id, TASK)
    assert action_cycle(sent) and action_cycle(f"MS_COMPLETE_{entry.entry_id}_{TASK}") is None
    assert action_cycle("OTHER_COMPLETE@x") is None and action_cycle(None) is None

    await coordinator.complete_maintenance(TASK)
    await hass.async_block_till_done()
    count = sum(1 for h in _merged(hass, entry)["history"] if h["type"] == "completed")
    hass.bus.async_fire("mobile_app_notification_action", {"action": sent})
    await hass.async_block_till_done()
    assert sum(1 for h in _merged(hass, entry)["history"] if h["type"] == "completed") == count

    # The current cycle's button still works.
    fresh = action_id("COMPLETE", entry.entry_id, TASK, cycle_token(_merged(hass, entry).get("history")))
    coordinator._recent_manual_completions.clear()
    hass.bus.async_fire("mobile_app_notification_action", {"action": fresh})
    await hass.async_block_till_done()
    assert sum(1 for h in _merged(hass, entry)["history"] if h["type"] == "completed") == count + 1


async def test_closing_a_reminded_task_elsewhere_clears_the_phones_only(hass: HomeAssistant) -> None:
    """Completed in the panel, the reminder stayed on the phones (N1). The
    dismissal went to every service, and Telegram or a persistent
    notification showed the text "clear_notification" (N2)."""
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    telegram = async_mock_service(hass, "notify", "telegram_family")
    entry = await _setup(hass, {TASK: _task()})
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    with (
        patch.object(type(nm), "notify_service", new_callable=PropertyMock, return_value="notify.telegram_family"),
        patch.object(nm, "_user_services", AsyncMock(return_value=["notify.mobile_app_phone"])),
    ):
        nm._last_notified[f"{entry.entry_id}_{TASK}_overdue"] = dt_util.now()
        assert nm.was_reminded(entry.entry_id, TASK)
        await _coordinator(hass, entry).complete_maintenance(TASK)
        await hass.async_block_till_done()
    assert [c.data for c in phone] == [{"message": "clear_notification", "data": {"tag": f"maintenance_{TASK}"}}]
    assert telegram == []
    assert not nm.was_reminded(entry.entry_id, TASK)


# ─── T1 / T4: AND/OR triggers ───────────────────────────────────────────


def _compound_task(**extra: Any) -> dict[str, Any]:
    return build_task_data(
        task_id=TASK,
        name="Filter",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "compound",
            "compound_logic": "OR",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.a", "entity_ids": ["sensor.a", "sensor.b"], "entity_logic": "all", "trigger_above": 30}
            ],
            **extra,
        },
    )


async def test_a_completed_and_or_condition_over_two_sensors_needs_both_again(hass: HomeAssistant) -> None:
    """The condition kept "both above" from before the completion: one sensor
    crossing again made it true while the other had long recovered."""
    hass.states.async_set("sensor.a", "40")
    hass.states.async_set("sensor.b", "40")
    entry = await _setup(hass, {TASK: _compound_task()})
    await hass.async_block_till_done()
    assert _coordinator(hass, entry).data[CONF_TASKS][TASK].trigger_active is True
    await _coordinator(hass, entry).complete_maintenance(TASK)
    await hass.async_block_till_done()
    hass.states.async_set("sensor.b", "10")
    await hass.async_block_till_done()
    hass.states.async_set("sensor.a", "41")
    await hass.async_block_till_done()
    await _coordinator(hass, entry).async_refresh_now()
    assert _coordinator(hass, entry).data[CONF_TASKS][TASK].trigger_active is False


async def test_an_and_or_trigger_completes_itself_when_it_recovers(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.a", "40")
    hass.states.async_set("sensor.b", "40")
    entry = await _setup(hass, {TASK: _compound_task(auto_complete_on_recovery=True)})
    await hass.async_block_till_done()
    coordinator = _coordinator(hass, entry)
    with patch.object(coordinator, "async_auto_complete_on_recovery", AsyncMock()) as auto:
        hass.states.async_set("sensor.a", "10")
        await hass.async_block_till_done()
        auto.assert_awaited_once_with(TASK, None)


async def test_the_compound_auto_completion_note_has_no_value(hass: HomeAssistant) -> None:
    entry = await _setup(hass, {TASK: _task()})
    await _coordinator(hass, entry).async_auto_complete_on_recovery(TASK, None)
    await hass.async_block_till_done()
    last = _merged(hass, entry)["history"][-1]
    assert last["type"] == "completed" and last["notes"] == "Auto-completed: sensor recovered"


# ─── T2: a restored hold-window start ───────────────────────────────────


async def test_a_restored_hold_start_ends_when_the_value_is_back_in_range(hass: HomeAssistant) -> None:
    """The first reading after a restart was in range, the start stayed —
    days later the next crossing activated at once, without the hold."""
    from custom_components.maintenance_supporter.entity.triggers.threshold import ThresholdTrigger

    hass.states.async_set("sensor.p", "10")
    host = MagicMock()
    host._task_id = TASK
    host.coordinator = MagicMock()
    host.coordinator.async_persist_trigger_runtime = AsyncMock()
    long_ago = (dt_util.utcnow() - timedelta(days=3)).isoformat()
    trigger = ThresholdTrigger(
        hass, host, {"entity_id": "sensor.p", "trigger_above": 30, "trigger_for_minutes": 5, "trigger_threshold_exceeded_since": long_ago}
    )
    assert trigger.evaluate(10.0) is False
    await hass.async_block_till_done()
    host.coordinator.async_persist_trigger_runtime.assert_awaited_with(TASK, {"threshold_exceeded_since": None}, entity_id="sensor.p")
    assert trigger.evaluate(40.0) is False, "a fresh hold, not the restored start"
    trigger._for_timer.close()


async def test_a_runtime_write_at_boot_waits_for_the_start(hass: HomeAssistant) -> None:
    """Gated on "running", a write at boot (integrations set up before Home
    Assistant starts) was dropped; it now runs once it has started."""
    from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
    from homeassistant.core import CoreState

    from custom_components.maintenance_supporter.entity.triggers.threshold import ThresholdTrigger

    host = MagicMock()
    host._task_id = TASK
    host.coordinator = MagicMock()
    host.coordinator.async_persist_trigger_runtime = AsyncMock()
    trigger = ThresholdTrigger(hass, host, {"entity_id": "sensor.p", "trigger_above": 30, "trigger_for_minutes": 5})
    hass.set_state(CoreState.not_running)
    try:
        trigger._persist_soon(trigger._persist_exceeded_since)
        await hass.async_block_till_done()
        host.coordinator.async_persist_trigger_runtime.assert_not_awaited()
        hass.set_state(CoreState.stopping)
        trigger._persist_soon(trigger._persist_exceeded_since)
    finally:
        hass.set_state(CoreState.running)
    hass.bus.async_fire(EVENT_HOMEASSISTANT_STARTED)
    await hass.async_block_till_done()
    host.coordinator.async_persist_trigger_runtime.assert_awaited_once()
    trigger._for_timer.close()


# ─── T5: one reading under the delta baseline ───────────────────────────


async def test_a_glitch_under_the_delta_baseline_changes_nothing(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.entity.triggers.counter import CounterTrigger

    host = MagicMock()
    host._task_id = TASK
    host.coordinator = MagicMock()
    host.coordinator.async_persist_trigger_runtime = AsyncMock()
    host.coordinator.async_request_refresh = AsyncMock()
    trigger = CounterTrigger(hass, host, {"entity_id": "sensor.odo", "trigger_delta_mode": True, "trigger_target_value": 500, "trigger_baseline_value": 1000})
    assert trigger.evaluate(1400) is False
    # One reading of 0: a glitch — the next real reading counts from 1000.
    assert trigger.evaluate(0) is False
    assert trigger.evaluate(1401) is False
    assert trigger._baseline_value == 1000
    # A triggered task stays triggered through a glitch.
    trigger._triggered = True
    assert trigger.evaluate(0) is True
    assert trigger.evaluate(1601) is True
    # A real reset: a second reading under the baseline. Counting starts
    # from the first one (the device's own reset is the maintenance).
    assert trigger.evaluate(0) is True
    assert trigger.evaluate(3) is False
    assert trigger._baseline_value == 0
    # Or no reading back above it in time: the timer confirms the reset.
    trigger._triggered = False
    trigger._baseline_value = 50
    assert trigger.evaluate(1) is False
    hass.states.async_set("sensor.odo", "1")
    with patch.object(trigger, "_evaluate_and_update", wraps=trigger.evaluate) as update:
        trigger._drop_timer_fired(dt_util.utcnow())
    update.assert_called_once_with(1.0)
    assert trigger._baseline_value == 1
    # The timer finds the value back up (or nothing pending): no reset.
    assert trigger.evaluate(0) is False
    hass.states.async_set("sensor.odo", "7")
    trigger._drop_timer_fired(dt_util.utcnow())
    assert trigger._baseline_value == 1 and trigger._drop_low is None
    trigger._drop_timer_fired(dt_util.utcnow())
    trigger._drop_timer.close()
    await hass.async_block_till_done()


# ─── G2-G5: the options flow's trigger steps ────────────────────────────


def _advanced_global(hass: HomeAssistant) -> MockConfigEntry:
    data = build_global_entry_data()
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={**data, CONF_ADVANCED_CHECKLISTS: True, CONF_ADVANCED_ADAPTIVE: True},
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


async def _open_trigger_edit(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"selected_task": TASK, "go_back": False})
    return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_trigger"})


def _default(result: dict[str, Any], key: str) -> Any:
    for marker in result["data_schema"].schema:
        if str(marker) == key:
            default = marker.default() if callable(marker.default) else None
            suggested = (marker.description or {}).get("suggested_value")
            return suggested if suggested is not None else default
    raise KeyError(key)


async def test_editing_a_trigger_starts_from_its_stored_settings(hass: HomeAssistant) -> None:
    """Every step showed blank or default values: saving the form unchanged
    reset the on-states, the attribute, the type and the entity logic."""
    hass.states.async_set("sensor.pump", "on", {"power": 5})
    hass.states.async_set("sensor.pump2", "on")
    tc = {
        "type": "runtime",
        "entity_id": "sensor.pump",
        "entity_ids": ["sensor.pump", "sensor.pump2"],
        "attribute": "power",
        "entity_logic": "all",
        "trigger_runtime_hours": 100,
        "trigger_on_states": ["heating"],
    }
    task = build_task_data(task_id=TASK, name="Pump", schedule_type=ScheduleType.SENSOR_BASED, interval_days=None, trigger_config=tc)
    entry = await _setup(hass, {TASK: task}, global_entry=_advanced_global(hass))
    result = await _open_trigger_edit(hass, entry)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_trigger_proceed"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_entity": ["sensor.pump", "sensor.pump2"]})
    assert _default(result, "trigger_attribute") == "power"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_attribute": "power"})
    assert _default(result, "trigger_type") == "runtime"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_type": "runtime"})
    assert _default(result, "trigger_runtime_hours") == 100
    assert _default(result, "trigger_on_states") == ["heating"]
    assert _default(result, "entity_logic") == "all"


async def test_the_threshold_step_pre_fills_the_stored_limits(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.config_flow_trigger import _days_before_field, _for_minutes_field, _limit_fields

    stored = {"trigger_above": 70, "trigger_below": 10, "trigger_for_minutes": 15, "trigger_days_before": 3}
    limits = {str(m): (m.description or {}).get("suggested_value") for m in _limit_fields(stored)}
    assert limits["trigger_above"] == 70 and limits["trigger_below"] == 10 and limits["trigger_equals"] is None
    assert next(iter(_for_minutes_field(stored))).default() == 15
    assert next(iter(_days_before_field(stored))).default() == 3
    assert next(iter(_for_minutes_field({"trigger_for_minutes": 10**9}))).default() == 0, "out of range: the plain default"


async def test_adding_a_trigger_to_a_one_time_task_keeps_its_due_date_and_warning_days(hass: HomeAssistant) -> None:
    """The type step always wrote "sensor_based" and the global warning
    days: a one-time task lost its due date (G3), any task its warning days
    (G4)."""
    hass.states.async_set("sensor.level", "50", {"unit_of_measurement": "%"})
    due = (dt_util.now().date() + timedelta(days=30)).isoformat()
    task = build_task_data(task_id=TASK, name="Inspect", interval_days=None, warning_days=21)
    task.pop("schedule_type", None)
    task["schedule"] = {"kind": "one_time", "due_date": due}
    entry = await _setup(hass, {TASK: task}, global_entry=_advanced_global(hass))
    result = await _open_trigger_edit(hass, entry)
    assert result["step_id"] == "opt_sensor_select"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_entity": ["sensor.level"]})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_attribute": "_state"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_type": "threshold"})
    assert _default(result, "warning_days") == 21
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_below": 10, "warning_days": 21})
    assert result["type"] == FlowResultType.MENU
    stored = _live(hass, entry).data[CONF_TASKS][TASK]
    assert stored["schedule"] == {"kind": "one_time", "due_date": due}
    assert stored["warning_days"] == 21
    assert stored["trigger_config"]["trigger_below"] == 10


async def test_clearing_the_shown_interval_removes_it(hass: HomeAssistant) -> None:
    """The flow could not remove a safety interval (G5)."""
    hass.states.async_set("sensor.level", "50")
    tc = {"type": "threshold", "entity_id": "sensor.level", "entity_ids": ["sensor.level"], "trigger_below": 10}
    task = build_task_data(task_id=TASK, name="Salt", schedule_type=ScheduleType.SENSOR_BASED, interval_days=60, trigger_config=tc)
    entry = await _setup(hass, {TASK: task}, global_entry=_advanced_global(hass))
    result = await _open_trigger_edit(hass, entry)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_trigger_proceed"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_entity": ["sensor.level"]})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_attribute": "_state"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_type": "threshold"})
    assert _default(result, "interval_days") == 60
    assert _default(result, "trigger_below") == 10
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"trigger_below": 10})
    assert result["type"] == FlowResultType.MENU
    assert _live(hass, entry).data[CONF_TASKS][TASK]["schedule"] == {"kind": "manual"}


# ─── C-D / C-E ──────────────────────────────────────────────────────────


async def test_the_last_person_of_a_shared_task_keeps_it(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.user_orphans import async_prune_task_user_orphans

    alice = await hass.auth.async_create_user("Alice")
    task = _task(responsible_user_id="deleted-user", assignee_pool=["deleted-user", alice.id])
    entry = await _setup(hass, {TASK: task})
    await async_prune_task_user_orphans(hass)
    stored = _live(hass, entry).data[CONF_TASKS][TASK]
    assert stored.get("responsible_user_id") == alice.id
    assert "assignee_pool" not in stored


async def test_a_tag_moved_on_from_a_retired_task_completes_the_new_one(hass: HomeAssistant) -> None:
    old = build_task_data(task_id="old", name="Old filter", interval_days=30, last_performed=_days_ago(40))
    old.update(nfc_tag_id="tag-1", archived_at="2026-01-01T00:00:00+00:00")
    new = build_task_data(task_id="new", name="Filter", interval_days=30, last_performed=_days_ago(40))
    new["nfc_tag_id"] = "tag-1"
    entry = await _setup(hass, {"old": old, "new": new})
    hass.bus.async_fire("tag_scanned", {"tag_id": "tag-1"})
    await hass.async_block_till_done()
    assert _merged(hass, entry, "new")["last_performed"] == dt_util.now().date().isoformat()


# ─── F3 / F4 / F5 / F9: documents ───────────────────────────────────────


async def test_photos_of_completions_do_not_fill_the_document_cap(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.documents import counts_toward_cap

    assert counts_toward_cap({"tags": ["photo"], "completion_photo": True, "task_ids": [TASK]}) is False
    assert counts_toward_cap({"tags": ["photo"], "task_ids": [TASK]}) is False, "from before the marker"
    assert counts_toward_cap({"tags": ["photo"], "completion_photo": True}) is True, "still waiting to be attached"
    assert counts_toward_cap({"tags": ["manual"], "task_ids": [TASK]}) is True

    entry = await _setup(hass, {TASK: _task()})
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    object_id = _live(hass, entry).data[CONF_OBJECT]["id"]
    with patch("custom_components.maintenance_supporter.helpers.documents.MAX_DOCS_PER_OBJECT", 2):
        for n in range(3):
            doc = await store.async_add_file(object_id, content=f"photo {n}".encode(), filename="p.jpg", mime="image/jpeg", tags=["photo"], completion_photo=True)
            store.documents[doc["id"]]["task_ids"] = [TASK]


async def test_a_missing_file_is_not_recorded_as_unreadable(hass: HomeAssistant, tmp_path: Any) -> None:
    from custom_components.maintenance_supporter.helpers.document_text import STATUS_ERROR, DocumentTextIndex

    store = MagicMock()
    store.blobs = {"ab" * 32: {"mime": "application/pdf"}}
    store.blob_path.return_value = tmp_path / "missing.pdf"
    index = DocumentTextIndex(hass, store)
    index._async_save_meta = AsyncMock()
    assert await index.async_extract("ab" * 32) is None
    assert "ab" * 32 not in index._meta
    # An error recorded before the file check is tried once more.
    index._meta["ab" * 32] = {"status": STATUS_ERROR, "v": 1}
    assert index._needs_extraction("ab" * 32) is True
    index._meta["ab" * 32] = {"status": STATUS_ERROR, "v": 1, "seen": True}
    assert index._needs_extraction("ab" * 32) is False


def _archive(files: dict[str, bytes], manifest: Any) -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr("manifest.json", json.dumps(manifest))
        for name, data in files.items():
            zf.writestr(name, data)
    return buf.getvalue()


async def test_the_archive_restore_reads_from_the_upload_file(hass: HomeAssistant) -> None:
    """The view read the upload into memory whole, the restore every file in
    it again (F5); only manifest files are written, the rest skipped."""
    import hashlib

    from custom_components.maintenance_supporter.helpers.doc_archive import import_documents_archive

    entry = await _setup(hass, {TASK: _task()})
    obj = _live(hass, entry).data[CONF_OBJECT]
    content = b"%PDF-1.4 manual"
    digest = hashlib.sha256(content).hexdigest()
    manifest = {
        "version": 2,
        "objects": [{"object_id": obj["id"], "object_name": obj["name"], "documents": [{"id": "d1", "kind": "file", "hash": digest, "path": "Boiler/Manuals/m.pdf", "filename": "m.pdf", "mime": "application/pdf"}]}],
    }
    data = _archive({"Boiler/Manuals/m.pdf": content, "blobs/" + "0" * 64: b"stray"}, manifest)
    result = await import_documents_archive(hass, io.BytesIO(data))
    assert result["blobs_written"] == 1 and result["documents_created"] == 1
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    assert not await hass.async_add_executor_job(store.blob_path("0" * 64).exists)


async def test_an_encrypted_archive_is_refused_cleanly(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.doc_archive import import_documents_archive

    await _setup(hass, {TASK: _task()})
    data = _archive({}, {"version": 2, "objects": []})
    with patch("zipfile.ZipFile.open", side_effect=RuntimeError("File is encrypted, password required")):
        result = await import_documents_archive(hass, data)
    assert result["error"].startswith("invalid archive")


# ─── S1 / S2 / S3: parts ────────────────────────────────────────────────


async def test_a_pools_buy_task_on_a_paused_owner_stays_live(hass: HomeAssistant) -> None:
    """Kept for the pool other objects still draw on, the buy task froze with
    its paused owner: no reminder, no shopping-list row, no completion."""
    from custom_components.maintenance_supporter.helpers.pause import is_task_inert
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks
    from custom_components.maintenance_supporter.websocket.objects import ws_pause_object

    part = {"id": "p1", "name": "Chlorine tabs", "reorder_threshold": 2, "auto_buy_task": True}
    owner = await _setup(hass, {TASK: _task()}, name="Pool", uid="pool", entry_extra={CONF_PARTS: {"p1": part}})
    shock = build_task_data(task_id="b1", name="Shock", interval_days=7, last_performed=_days_ago(1))
    shock["consumes_parts"] = [{"part_id": "p1", "quantity": 1, "entry_id": owner.entry_id}]
    spa = make_object_entry(hass, tasks={"b1": shock}, name="Spa", uid="spa")
    await hass.config_entries.async_setup(spa.entry_id)
    await hass.async_block_till_done()
    _live(hass, owner).runtime_data.store.set_part_stock("p1", 1)
    await async_reconcile_buy_tasks(hass, _live(hass, owner))
    await hass.async_block_till_done()
    buy = next(tid for tid, t in _live(hass, owner).data[CONF_TASKS].items() if t.get("part_ref"))

    await _ws(hass, ws_pause_object, {"type": "maintenance_supporter/object/pause", "entry_id": owner.entry_id})
    live = _live(hass, owner)
    assert live.data[CONF_TASKS][buy].get("pool_in_use") is True
    assert not is_task_inert(live.data[CONF_TASKS][buy], live.data[CONF_OBJECT])
    data = _coordinator(hass, owner).data[CONF_TASKS]
    assert data[buy].status != MaintenanceStatus.PAUSED
    assert data[TASK].status == MaintenanceStatus.PAUSED


async def test_an_archived_objects_parts_are_not_counted(hass: HomeAssistant) -> None:
    """A replaced object's parts live on as copies on its successor: counted
    twice, the reorder count stayed up for good and voice asked "which one?"."""
    from custom_components.maintenance_supporter.helpers.shared_parts import live_parts

    parts = {"p1": {"id": "p1", "name": "Salt", "reorder_threshold": 2}}
    g = make_global_entry(hass)
    old = make_object_entry(
        hass, tasks={}, name="Softener", uid="old", object_data={**build_object_data(name="Softener", object_id="old"), "archived_at": "2026-10-01T00:00:00+00:00"}, extra_data={CONF_PARTS: parts}
    )
    new = make_object_entry(hass, tasks={}, name="Softener 2", uid="new", extra_data={CONF_PARTS: parts})
    await setup_integration(hass, g, old, new)
    assert live_parts(hass, _live(hass, old)) == {}
    assert set(live_parts(hass, _live(hass, new))) == {"p1"}


async def test_one_swap_takes_its_cells_once(hass: HomeAssistant) -> None:
    """A second press of Replaced on the same day — or a press after the
    automatic record — took the spare cells again."""
    from custom_components.maintenance_supporter.helpers import battery_fleet_setup as setup_mod

    bat = MagicMock(entity_id="sensor.remote_battery_plus", battery_type="AAA", quantity=2, low=True, last_replaced=None)
    store = MagicMock()
    state: dict[str, Any] = {}
    store.get_task_state.side_effect = lambda _tid: state
    store.update_task_state.side_effect = lambda _tid, **kw: state.update(kw)
    hass.states.async_set("button.remote_battery_replaced", "unknown")
    async_mock_service(hass, "button", "press")
    with (
        patch.object(setup_mod, "read_batteries", return_value=[bat]),
        patch.object(setup_mod, "release_low_latch"),
        patch("custom_components.maintenance_supporter.helpers.battery_lifetime.fleet_store_and_task", return_value=(store, "fleet")),
        patch.object(setup_mod, "async_consume_type_parts", AsyncMock(return_value={})) as consume,
    ):
        await setup_mod.async_mark_replaced(hass, ["sensor.remote_battery_plus"])
        await setup_mod.async_mark_replaced(hass, ["sensor.remote_battery_plus"])
    assert [c.args[1] for c in consume.await_args_list] == [{"AAA": 2}, {}]


def test_a_jump_before_the_recorded_replacement_is_not_offered() -> None:
    """A swap recorded late (the date after the jump) was offered again —
    recording it took the cells a second time and moved the date back."""
    from datetime import date

    from custom_components.maintenance_supporter.helpers.battery_fleet import _detect_unrecorded_jump

    jump_at = dt_util.as_utc(dt_util.start_of_local_day(date(2026, 9, 1))).timestamp() + 3600
    points = [(jump_at - 43200, 15.0), (jump_at, 100.0)]
    assert _detect_unrecorded_jump(points, date(2026, 10, 1)) is None
    assert _detect_unrecorded_jump(points, date(2025, 1, 1)) is not None
