"""Regression tests for the second bug audit of 2026-09-26 (fixed 2026-09-27),
tranche 4 — backend runtime: far-future dates, the calendar early-completion
rule, trigger races and episodes, entity renames, the cooldown across
reloads, quiet hours, document locks, climate data and object deletion.

One test (or a small group) per finding; the docstrings name the reported
failure so a red test says which bug came back.
"""

from __future__ import annotations

import asyncio
import io
import json
import zipfile
from datetime import date, timedelta
from typing import Any
from unittest.mock import patch

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    BATTERY_FLEET_EXCLUDED,
    BATTERY_FLEET_INCLUDED,
    CONF_OBJECT,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_START,
    CONF_TASKS,
    CONF_VACATION_BUFFER_DAYS,
    CONF_VACATION_ENABLED,
    CONF_VACATION_END,
    CONF_VACATION_EXEMPT_TASK_IDS,
    CONF_VACATION_START,
    DOCUMENT_STORE_KEY,
    DOCUMENT_TEXT_INDEX_KEY,
    DOMAIN,
    MAX_INTERVAL_DAYS,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_object_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    set_sensor_state,
    setup_integration,
)


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _history_types(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK_ID_1) -> list[str]:
    merged = _coordinator(hass, entry)._get_merged_tasks_data()[task_id]
    return [h.get("type") for h in merged.get("history") or []]


def _days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


def _threshold_task(entity_id: str, **trigger: Any) -> dict[str, Any]:
    return build_task_data(
        task_id=TASK_ID_1,
        name="Salt",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": entity_id, "entity_ids": [entity_id], **trigger},
    )


# ─── High 1: a vacation ending at the calendar's end ─────────────────────────


def test_a_vacation_ending_in_year_9999_never_overflows() -> None:
    """vacation_end 9999-12-31 plus the return buffer overflowed in
    window_end — is_silent_for runs inside every object's refresh, so the
    objects went unavailable for the whole vacation."""
    from custom_components.maintenance_supporter.helpers.vacation import VacationState

    state = VacationState.from_options(
        {CONF_VACATION_ENABLED: True, CONF_VACATION_START: "2026-09-01", CONF_VACATION_END: "9999-12-31", CONF_VACATION_BUFFER_DAYS: 3}
    )
    assert state.window_end == date.max
    assert state.is_silent_for("t1") is True
    assert state.as_wire_dict()["window_end"] == date.max.isoformat()


async def test_an_object_refresh_survives_a_stored_endless_vacation(hass: HomeAssistant) -> None:
    """The stored end date (from before the WS cap, an options flow or a
    restore) killed the refresh of every object with a due task."""
    async_mock_service(hass, "notify", "notify")
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.notify")
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=_days_ago(60))})
    await setup_integration(hass, g, obj)
    hass.config_entries.async_update_entry(
        g,
        options={
            **g.data,
            CONF_VACATION_ENABLED: True,
            CONF_VACATION_START: _days_ago(3),
            CONF_VACATION_END: "9999-12-31",
            CONF_VACATION_BUFFER_DAYS: 3,
        },
    )
    await hass.async_block_till_done()
    coordinator = _coordinator(hass, obj)
    await coordinator.async_refresh()
    assert coordinator.last_update_success is True
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.OVERDUE


async def test_the_vacation_command_refuses_an_absurd_end_date(hass: HomeAssistant) -> None:
    """vacation/update stored any YYYY-MM-DD — 9999-12-31 included."""
    from custom_components.maintenance_supporter.websocket.vacation import ws_vacation_update

    g = make_global_entry(hass)
    await setup_integration(hass, g)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_vacation_update,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/vacation/update", "enabled": True, "start": _days_ago(0), "end": "9999-12-31"},
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args.args[1] == "invalid_range"

    ok_end = (dt_util.now().date() + timedelta(days=21)).isoformat()
    conn = make_ws_connection()
    await call_ws_handler(
        ws_vacation_update,
        hass,
        conn,
        {"id": 2, "type": f"{DOMAIN}/vacation/update", "enabled": True, "start": _days_ago(0), "end": ok_end},
    )
    conn.send_error.assert_not_called()
    assert conn.send_result.call_args.args[1]["end"] == ok_end


# ─── High 2: far-future dates never crash a refresh ──────────────────────────


def test_the_schedule_reads_a_date_past_the_calendar_end_as_no_due_date() -> None:
    """add_interval raised OverflowError / ValueError from Schedule.next_due
    (a reset to 9999-12-20, a season roll in 9999, an offset near the end)
    and the exception escaped into the coordinator refresh."""
    from custom_components.maintenance_supporter.helpers.schedule import Schedule

    today = date(2026, 9, 27)
    far = date(9999, 12, 31)
    for sched in (
        {"kind": "interval", "every": 30},
        {"kind": "interval", "every": 6, "unit": "months"},
        {"kind": "interval", "every": 2, "unit": "years", "anchor": "planned"},
        {"kind": "weekdays", "weekdays": [0], "offset": 15},
        {"kind": "day_of_month", "day": 31, "season_months": [1]},
    ):
        s = Schedule.from_dict(sched)
        assert s.next_due(last_performed=far, created_at=today, last_planned_due=None, today=today) is None, sched

    from custom_components.maintenance_supporter.helpers.dates import interval_span_days, try_add_interval

    assert try_add_interval(far, 30) is None
    assert try_add_interval(far, 1, "years") is None
    assert try_add_interval(today, 30) == date(2026, 10, 27)
    assert interval_span_days(10**6, "years") == (date.max - date(2001, 1, 1)).days


async def test_a_task_with_a_far_future_anchor_does_not_take_its_object_down(hass: HomeAssistant) -> None:
    """A far-future last_performed (reset / import / history edit) made the
    refresh raise: every entity of the object went unavailable and the entry
    stayed in setup retry across restarts."""
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={
            TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30, last_performed=_days_ago(5)),
            TASK_ID_2: build_task_data(task_id=TASK_ID_2, name="Other", interval_days=30, last_performed=_days_ago(40)),
        },
    )
    await setup_integration(hass, g, obj)
    obj.runtime_data.store.set_last_performed(TASK_ID_1, "9999-12-20")
    coordinator = _coordinator(hass, obj)
    await coordinator.async_refresh()
    assert coordinator.last_update_success is True
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] is None
    assert coordinator.data[CONF_TASKS][TASK_ID_2]["_status"] == MaintenanceStatus.OVERDUE


async def test_one_failing_task_is_contained_to_that_task(hass: HomeAssistant) -> None:
    """Any exception in one task's status computation aborted the whole
    refresh — the object's other tasks went unavailable with it."""
    from custom_components.maintenance_supporter.helpers import calendar_source

    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={
            TASK_ID_1: build_task_data(task_id=TASK_ID_1, name="Broken", interval_days=30, last_performed=_days_ago(5)),
            TASK_ID_2: build_task_data(task_id=TASK_ID_2, name="Fine", interval_days=30, last_performed=_days_ago(40)),
        },
    )
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    real = calendar_source.next_event_titles
    calls: list[Any] = []

    def _boom(hass_: HomeAssistant, schedule: Any, due: Any) -> Any:
        calls.append(due)
        if len(calls) == 1:
            raise RuntimeError("corrupt task")
        return real(hass_, schedule, due)

    with patch("custom_components.maintenance_supporter.coordinator.next_event_titles", _boom):
        await coordinator.async_refresh()
    assert coordinator.last_update_success is True
    tasks = coordinator.data[CONF_TASKS]
    broken, fine = tasks[TASK_ID_1], tasks[TASK_ID_2]
    assert broken["_next_due"] is None and broken["_status"] == MaintenanceStatus.OK
    assert fine["_status"] == MaintenanceStatus.OVERDUE


async def test_a_reset_to_a_future_day_is_refused(hass: HomeAssistant) -> None:
    """reset (service, WS task/reset — read tier) accepted 9999-12-20 and
    the next due date overflowed inside the refresh; a reset records when
    the task was last done, which cannot be tomorrow."""
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=_days_ago(5))})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    with pytest.raises(ServiceValidationError) as err:
        await coordinator.reset_maintenance(TASK_ID_1, date(9999, 12, 20))
    assert err.value.translation_key == "completed_at_in_future"
    with pytest.raises(ServiceValidationError):
        await coordinator.reset_maintenance(TASK_ID_1, dt_util.now().date() + timedelta(days=1))
    assert obj.runtime_data.store.get_last_performed(TASK_ID_1) == _days_ago(5)
    await coordinator.reset_maintenance(TASK_ID_1, dt_util.now().date())
    assert obj.runtime_data.store.get_last_performed(TASK_ID_1) == _days_ago(0)


# ─── High 3: the nested interval is bounded ──────────────────────────────────


def test_the_nested_interval_is_clamped_and_its_unit_restricted() -> None:
    """schedule.every was only checked for >= 1 — "every 8000 years" reached
    the refresh and died on year 10026 — and any string (or a list) was
    accepted as the unit."""
    from custom_components.maintenance_supporter.helpers.schedule import Schedule

    today = date(2026, 9, 27)
    cases = {
        ("years", 8000): ("years", MAX_INTERVAL_DAYS // 365),
        ("months", 10**6): ("months", (MAX_INTERVAL_DAYS // 365) * 12),
        ("weeks", 5000): ("weeks", MAX_INTERVAL_DAYS // 7),
        ("days", 10**7): ("days", MAX_INTERVAL_DAYS),
        ("days", 30): ("days", 30),
    }
    for (unit, every), (want_unit, want_every) in cases.items():
        s = Schedule.from_dict({"kind": "interval", "every": every, "unit": unit})
        assert (s.unit, s.every) == (want_unit, want_every), (unit, every)
        assert s.next_due(last_performed=today, created_at=today, last_planned_due=None, today=today) is not None
        assert s.span_days() <= MAX_INTERVAL_DAYS + 3  # leap days of the 10 years
    for garbage in (["x"], "fortnights", None, 7):
        s = Schedule.from_dict({"kind": "interval", "every": 30, "unit": garbage})
        assert s.unit == "days"
        assert "unit" not in s.to_dict()
    legacy = Schedule.from_legacy(
        schedule_type="time_based", interval_days=10**6, interval_unit="decades", interval_anchor=None, due_date=None
    )
    assert (legacy.unit, legacy.every) == ("days", MAX_INTERVAL_DAYS)


async def test_a_stored_absurd_nested_interval_keeps_the_object_alive(hass: HomeAssistant) -> None:
    """Created through the WS / service / import paths the nested schedule
    was stored verbatim and every refresh raised ValueError."""
    g = make_global_entry(hass)
    task = build_task_data(interval_days=None, last_performed=_days_ago(1))
    task.pop("schedule_type", None)
    task["schedule"] = {"kind": "interval", "every": 8000, "unit": "years"}
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    assert coordinator.last_update_success is True
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] is not None


# ─── Medium 6 (R SCH-1): early completions of a calendar task ───────────────


def _monday_bins(**extra: Any) -> Any:
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    return MaintenanceTask.from_dict(
        {
            "id": "b",
            "object_id": "o",
            "name": "Bins out",
            "type": "custom",
            "enabled": True,
            "warning_days": 1,
            "created_at": "2026-09-01",
            "schedule": {"kind": "weekdays", "weekdays": [0]},
            "last_performed": "2026-09-21",
            **extra,
        }
    )


def test_a_second_early_completion_never_moves_the_due_date_back() -> None:
    """Saturday: done for Monday 28th (next due Oct 5). Sunday: skip the next
    Monday too — the task came back due on Monday 28th, the occurrence
    already covered, because only an EXACT match of last_planned_due counted
    as consumed."""
    with freeze_time("2026-09-26 10:00:00"):
        bins = _monday_bins()
        assert bins.next_due == date(2026, 9, 28)
        bins.complete()
        assert bins.next_due == date(2026, 10, 5)
    with freeze_time("2026-09-27 10:00:00"):
        bins.skip("away next week")
        assert bins.next_due == date(2026, 10, 12)
        bins.complete()
        assert bins.next_due == date(2026, 10, 19)

    with freeze_time("2026-09-26 10:00:00"):
        monthly = _monday_bins(schedule={"kind": "day_of_month", "day": 1}, last_performed="2026-09-01")
        monthly.complete()
        assert monthly.next_due == date(2026, 11, 1)
    with freeze_time("2026-09-27 10:00:00"):
        monthly.skip()
        assert monthly.next_due == date(2026, 12, 1)


def test_a_stale_planned_anchor_still_swallows_no_occurrence() -> None:
    """The stale-value protection stays: a last_planned_due that is not an
    occurrence of the current schedule (a former interval schedule, a changed
    weekday set) consumes nothing."""
    with freeze_time("2026-09-26 10:00:00"):
        # Wednesday Oct 7 is no Monday: the Monday 28th is still due.
        bins = _monday_bins(last_performed="2026-09-25", last_planned_due="2026-10-07")
        assert bins.next_due == date(2026, 9, 28)
        # A real covered Monday in the future consumes it and the one before.
        covered = _monday_bins(last_performed="2026-09-25", last_planned_due="2026-10-05")
        assert covered.next_due == date(2026, 10, 12)


# ─── Medium 9: a trigger flip during a refresh ───────────────────────────────


async def test_a_trigger_flip_during_a_refresh_is_not_lost(hass: HomeAssistant) -> None:
    """A flip that landed while the refresh awaited (the recorder query of
    a later task) was written into the OLD data and overwritten by the
    refresh's result — a for_minutes threshold never re-asserts it, so the
    latch was lost for good although the activation was in the history."""
    set_sensor_state(hass, "sensor.freezer", "-5")
    set_sensor_state(hass, "sensor.other", "1")
    t1 = build_task_data(
        task_id=TASK_ID_1,
        name="Freezer alarm",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": "sensor.freezer", "trigger_above": -10, "trigger_for_minutes": 30},
    )
    t2 = build_task_data(
        task_id=TASK_ID_2,
        name="Other",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": "sensor.other", "trigger_above": 100},
    )
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: t1, TASK_ID_2: t2})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    sensor = hass.data["entity_components"]["sensor"].get_entity(coordinator.task_sensor_entity_id(TASK_ID_1))
    trigger = sensor._triggers[0]
    assert trigger._threshold_exceeded and not trigger._triggered

    gate, entered = asyncio.Event(), asyncio.Event()

    async def fake_analyze(self: Any, task_result: dict[str, Any], cfg: Any) -> None:
        if task_result.get("name") == "Other":
            entered.set()
            await gate.wait()

    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor.async_analyze", fake_analyze
    ):
        refresh = hass.async_create_task(coordinator.async_refresh())
        await entered.wait()
        trigger._for_timer_fired(dt_util.utcnow())  # the 30-minute window elapses now
        gate.set()
        await refresh
        await hass.async_block_till_done()
        assert coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True
        assert coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.TRIGGERED
        await coordinator.async_refresh()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.TRIGGERED


# ─── Medium 11: entity renames reach every reference ─────────────────────────


async def test_an_entity_rename_follows_calendar_schedules_mirror_lists_and_fleet_lists(hass: HomeAssistant) -> None:
    """The rename listener rewrote trigger / environmental references only:
    a calendar-kind task (#187) kept the old calendar id (never due again
    after the reload), a to-do mirror (D#183) the old list (rows orphaned)
    and the battery fleet its include / exclude lists."""
    from custom_components.maintenance_supporter.helpers.todo_mirror import MIRROR_STATE_KEY, TODO_MIRROR_KEY

    task = build_task_data(interval_days=None)
    task.pop("schedule_type", None)
    task["schedule"] = {"kind": "calendar", "entity_id": "calendar.waste"}
    mirrored = build_task_data(task_id=TASK_ID_2, name="Descale", interval_days=30, last_performed=_days_ago(40))
    mirrored["mirror_todo_entities"] = ["todo.family", "todo.kids"]
    obj_data = build_object_data(name="Bins", object_id="bins")
    obj_data[BATTERY_FLEET_INCLUDED] = ["sensor.remote_battery"]
    obj_data[BATTERY_FLEET_EXCLUDED] = ["sensor.phone_battery", "sensor.zz"]
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task, TASK_ID_2: mirrored}, name="Bins", uid="bins", object_data=obj_data)
    await setup_integration(hass, g, obj)
    store = obj.runtime_data.store
    store.update_task_state(TASK_ID_2, **{MIRROR_STATE_KEY: {"todo.family": {"summary": "Bins: Descale", "uid": "u1"}}})

    for old, new in (
        ("calendar.waste", "calendar.waste_collection"),
        ("todo.family", "todo.household"),
        ("sensor.remote_battery", "sensor.remote_cell"),
        ("sensor.phone_battery", "sensor.phone_cell"),
    ):
        hass.bus.async_fire(er.EVENT_ENTITY_REGISTRY_UPDATED, {"action": "update", "entity_id": new, "changes": {"entity_id": old}})
        await hass.async_block_till_done()
        await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry.data[CONF_TASKS][TASK_ID_1]["schedule"]["entity_id"] == "calendar.waste_collection"
    assert entry.data[CONF_TASKS][TASK_ID_2]["mirror_todo_entities"] == ["todo.household", "todo.kids"]
    assert entry.data[CONF_OBJECT][BATTERY_FLEET_INCLUDED] == ["sensor.remote_cell"]
    assert entry.data[CONF_OBJECT][BATTERY_FLEET_EXCLUDED] == ["sensor.phone_cell", "sensor.zz"]
    record = entry.runtime_data.store.get_task_state(TASK_ID_2).get(MIRROR_STATE_KEY)
    assert set(record) == {"todo.household"} and record["todo.household"]["uid"] == "u1"
    assert hass.data[DOMAIN][TODO_MIRROR_KEY].listening_to == {"todo.household", "todo.kids"}


# ─── Low (concurrency) ───────────────────────────────────────────────────────


async def test_the_post_completion_cooldown_survives_a_reload(hass: HomeAssistant) -> None:
    """The cooldown lived on the coordinator instance: a task edit (reload)
    within ten minutes of "Complete" re-triggered the task at once while the
    sensor was still on the triggering side, and pushed a reminder."""
    set_sensor_state(hass, "sensor.salt", "5")
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _threshold_task("sensor.salt", trigger_below=10)})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.TRIGGERED
    await coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.OK

    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    fresh = _coordinator(hass, obj)
    assert fresh is not coordinator
    await fresh.async_refresh()
    assert fresh.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.OK
    assert fresh.in_completion_cooldown(TASK_ID_1) is True


async def test_a_hub_reload_keeps_the_shared_text_index_alive(hass: HomeAssistant) -> None:
    """Unloading the global entry cancelled the shared full-text index, which
    only the (once-per-boot) shared setup creates: after any hub reload new
    uploads were never indexed again."""
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()})
    await setup_integration(hass, g, obj)
    index = hass.data[DOMAIN][DOCUMENT_TEXT_INDEX_KEY]
    await hass.config_entries.async_reload(g.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DOCUMENT_TEXT_INDEX_KEY] is index
    assert index._timer.closed is False


async def test_a_held_quiet_hours_reminder_is_dropped_when_the_task_leaves_the_status(hass: HomeAssistant) -> None:
    """A reminder held for the quiet-hours summary was still announced after
    the task had been postponed (or completed elsewhere) during the night."""
    calls: list[ServiceCall] = []

    async def _svc(call: ServiceCall) -> None:
        calls.append(call)

    hass.services.async_register("notify", "test", _svc)
    now = dt_util.now()
    quiet = {
        CONF_QUIET_HOURS_ENABLED: True,
        CONF_QUIET_HOURS_START: (now - timedelta(hours=1)).strftime("%H:%M"),
        CONF_QUIET_HOURS_END: (now + timedelta(hours=1)).strftime("%H:%M"),
    }
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data=quiet)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=_days_ago(60))})
    await setup_integration(hass, g, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    coordinator = _coordinator(hass, obj)
    nm.clear_task_state(obj.entry_id, TASK_ID_1)  # drop the startup seed
    await coordinator.async_refresh()
    assert nm._quiet_held, "the overdue reminder is held for the summary"

    await coordinator.async_postpone_task(TASK_ID_1, now.date() + timedelta(days=10))
    await coordinator.async_refresh()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.OK
    assert not nm._quiet_held

    hass.config_entries.async_update_entry(g, options={**g.data, **quiet, CONF_QUIET_HOURS_ENABLED: False})
    await hass.async_block_till_done()
    assert await nm.async_flush_quiet_held() is False
    assert calls == []


async def test_a_compound_trigger_does_not_reannounce_on_reload(hass: HomeAssistant) -> None:
    """Each condition's sub-trigger wrote its own TRIGGERED entry through the
    coordinator proxy (which had no trigger_already_announced), and the
    compound announced again on every reload and restart."""
    set_sensor_state(hass, "sensor.a", "50")
    set_sensor_state(hass, "sensor.b", "50")
    tc = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
            {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 10},
        ],
    }
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass, tasks={TASK_ID_1: build_task_data(schedule_type=ScheduleType.SENSOR_BASED, interval_days=None, trigger_config=tc)}
    )
    await setup_integration(hass, g, obj)
    assert _history_types(hass, obj).count("triggered") == 1, "one activation of the TASK, not one per condition"
    for _ in range(3):
        await hass.config_entries.async_reload(obj.entry_id)
        await hass.async_block_till_done()
    assert _history_types(hass, obj).count("triggered") == 1
    coordinator = _coordinator(hass, obj)
    await coordinator.async_refresh()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.TRIGGERED

    # A real new episode is still announced: recover, then trigger again.
    set_sensor_state(hass, "sensor.a", "1")
    await hass.async_block_till_done()
    set_sensor_state(hass, "sensor.a", "60")
    await hass.async_block_till_done()
    assert _history_types(hass, obj).count("triggered") == 2


async def test_a_new_episode_that_began_while_home_assistant_was_down_is_recorded(hass: HomeAssistant) -> None:
    """The recovery of an announced episode left no trace, so a NEW episode
    starting while HA was down read as the old one on the next start and was
    only repainted — no history entry, no activation event."""
    set_sensor_state(hass, "sensor.pressure", "50")
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _threshold_task("sensor.pressure", trigger_above=10)})
    await setup_integration(hass, g, obj)
    assert _history_types(hass, obj).count("triggered") == 1
    set_sensor_state(hass, "sensor.pressure", "5")  # recovers (observed)
    await hass.async_block_till_done()

    await hass.config_entries.async_unload(obj.entry_id)  # HA goes down ...
    await hass.async_block_till_done()
    set_sensor_state(hass, "sensor.pressure", "70")  # ... a new episode starts meanwhile
    await hass.config_entries.async_setup(obj.entry_id)
    await hass.async_block_till_done()
    assert _history_types(hass, obj).count("triggered") == 2

    # Still the SCH-10 rule: a reload inside the episode only repaints.
    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    assert _history_types(hass, obj).count("triggered") == 2


async def test_document_cleanup_does_not_delete_a_blob_an_upload_is_registering(hass: HomeAssistant) -> None:
    """The cleanup's scan and deletes ran without the blob lock: content an
    upload had just written (registry entry still pending) looked like an
    orphan and was deleted under the fresh document."""
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    content = b"%PDF-1.4 manual"
    digest, wrote = await hass.async_add_executor_job(store._store_blob_sync, content)
    assert wrote

    async def _scan() -> dict[str, list[str]]:
        return {"orphan_blobs": [digest], "zero_refcount": [], "dangling_docs": []}

    await store._blob_lock.acquire()  # an upload is between its write and its registration
    try:
        with patch.object(store, "async_find_issues", _scan):
            cleanup = hass.async_create_task(store.async_cleanup_issues())
            for _ in range(5):
                await asyncio.sleep(0)
            store.blobs[digest] = {"size": len(content), "mime": "application/pdf", "refcount": 1}
    finally:
        store._blob_lock.release()
    result = await cleanup
    assert result["orphans_deleted"] == 0
    assert await hass.async_add_executor_job(store.blob_path(digest).is_file)


def _archive(manifest: Any, blobs: dict[str, bytes] | None = None) -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr("manifest.json", json.dumps(manifest))
        for digest, content in (blobs or {}).items():
            zf.writestr(f"blobs/{digest}", content)
    return buf.getvalue()


async def test_the_documents_archive_restore_waits_for_the_blob_lock(hass: HomeAssistant) -> None:
    """The archive restore wrote blobs and registered their documents without
    the blob lock, so a concurrent last-reference delete could remove a
    blob the restore had just written."""
    import hashlib

    from custom_components.maintenance_supporter.helpers.doc_archive import import_documents_archive

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, name="Boiler", uid="boiler", object_id="boiler")
    await setup_integration(hass, g, obj)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    content = b"%PDF-1.4 restore me"
    digest = hashlib.sha256(content).hexdigest()
    manifest = {
        "objects": [
            {
                "object_id": "boiler",
                "object_name": "Boiler",
                "documents": [{"kind": "file", "hash": digest, "filename": "m.pdf", "mime": "application/pdf", "size": len(content)}],
            }
        ]
    }
    await store._blob_lock.acquire()
    try:
        restore = hass.async_create_task(import_documents_archive(hass, _archive(manifest, {digest: content})))
        done, _ = await asyncio.wait({restore}, timeout=0.5)
        assert not done, "the restore must wait for the blob lock"
        assert digest not in store.blobs
    finally:
        store._blob_lock.release()
    result = await restore
    assert result["documents_created"] == 1 and result["blobs_written"] == 1
    assert store.blobs[digest]["refcount"] == 1


async def test_a_malformed_archive_manifest_is_a_clean_error(hass: HomeAssistant) -> None:
    """A manifest that is a list, documents that are a number or a URL that
    is a list raised AttributeError / TypeError past the handler — a bare
    500 instead of an error the panel can show."""
    from custom_components.maintenance_supporter.helpers.doc_archive import import_documents_archive

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, name="Boiler", uid="boiler", object_id="boiler")
    await setup_integration(hass, g, obj)

    result = await import_documents_archive(hass, _archive([]))
    assert "error" in result
    result = await import_documents_archive(hass, _archive({"objects": 5}))
    assert result["documents_created"] == 0
    result = await import_documents_archive(hass, _archive({"objects": [{"object_id": "boiler", "documents": 5}]}))
    assert result["documents_created"] == 0
    result = await import_documents_archive(
        hass, _archive({"objects": [{"object_id": "boiler", "documents": [{"kind": "weblink", "url": ["x"]}]}]})
    )
    assert result["documents_created"] == 0


async def test_completion_photos_are_linked_after_the_task_is_persisted(hass: HomeAssistant) -> None:
    """complete_maintenance took its task snapshot, awaited the photo link
    (a document-store write) and then persisted the snapshot — a history
    edit saved during that await was overwritten by the stale list."""
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=_days_ago(40))})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    store = obj.runtime_data.store

    async def _racing_edit(photo_doc_id: str, task_id: str) -> None:
        # What a history edit / delete does meanwhile: replace the list.
        edited = {"type": "triggered", "timestamp": dt_util.now().isoformat(), "notes": "saved meanwhile"}
        store.set_history(task_id, [*store.get_history(task_id), edited])

    with patch.object(coordinator, "_link_completion_photo", _racing_edit):
        await coordinator.complete_maintenance(TASK_ID_1, photo_doc_ids=["photo1"])
    history = store.get_history(TASK_ID_1)
    assert [h.get("type") for h in history].count("completed") == 1
    assert any(h.get("notes") == "saved meanwhile" for h in history), "the concurrent edit was overwritten"


# ─── Low (data) ──────────────────────────────────────────────────────────────


def test_tropical_islands_without_a_temperature_cell_have_no_winter() -> None:
    """Small islands have no cell in the 1° temperature grid; unknown read as
    "has a winter", so the Maldives were planned around frost."""
    from custom_components.maintenance_supporter.helpers.climate import ClimateInfo

    assert ClimateInfo(koppen="Af", coldest_c=None, warmest_c=None, hemisphere="north", traits=frozenset()).has_winter is False
    assert ClimateInfo(koppen="Cfb", coldest_c=None, warmest_c=None, hemisphere="north", traits=frozenset()).has_winter is True
    assert ClimateInfo(koppen=None, coldest_c=None, warmest_c=None, hemisphere="north", traits=frozenset()).has_winter is True


def test_cyclone_islands_east_of_the_antimeridian_get_the_trait() -> None:
    """The south-west Pacific box stopped at 180°, so Tonga and Samoa
    (lon -175 / -172) had no cyclone trait."""
    from custom_components.maintenance_supporter.helpers.climate import TRAIT_CYCLONE, _traits

    for lat, lon in ((-21.1, -175.2), (-13.8, -171.8), (-18.1, 178.4)):
        assert TRAIT_CYCLONE in set(_traits(lat, lon, "Af", 22, 27)), (lat, lon)
    assert TRAIT_CYCLONE not in set(_traits(-21.1, -140.0, "Af", 22, 27))


def test_non_string_history_timestamps_do_not_break_a_completion() -> None:
    """An imported history with an epoch-number timestamp made max() compare
    int with str: every completion of the task raised TypeError."""
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    task = MaintenanceTask.from_dict(
        {
            "id": "t",
            "object_id": "o",
            "name": "x",
            "type": "custom",
            "enabled": True,
            "warning_days": 7,
            "schedule": {"kind": "interval", "every": 30},
            "history": [{"type": "completed", "timestamp": 1695000000, "cost": 5}],
        }
    )
    assert task.complete() is True
    assert task.times_performed == 2


def test_the_store_repairs_and_tolerates_non_string_timestamps() -> None:
    """The loaded Store kept an epoch-number timestamp (and the history
    edit's re-anchor compared it with strings)."""
    from custom_components.maintenance_supporter.storage import MaintenanceStore, reanchor_from_history

    loaded = MaintenanceStore._sanitize_loaded(
        {
            "tasks": {
                "t": {
                    "history": [
                        {"type": "completed", "timestamp": 1695000000},
                        {"type": "completed", "timestamp": ["junk"]},
                        {"type": "completed", "timestamp": "2026-09-01T10:00:00+00:00"},
                    ]
                }
            }
        }
    )
    history = loaded["tasks"]["t"]["history"]
    assert history[0]["timestamp"].startswith("2023-09-18T")
    assert "timestamp" not in history[1]
    assert history[2]["timestamp"] == "2026-09-01T10:00:00+00:00"

    class _Store:
        anchor: Any = "unset"

        def get_last_performed(self, task_id: str) -> str | None:
            return None

        def set_anchor(self, task_id: str, anchor: str | None, *, clear_modifiers: bool) -> None:
            self.anchor = anchor

    fake = _Store()
    raw = [{"type": "completed", "timestamp": 1695000000}, {"type": "completed", "timestamp": "2026-09-01T10:00:00"}]
    assert reanchor_from_history(fake, "t", raw) == "2026-09-01"  # type: ignore[arg-type]


# ─── Low (journeys): deleting an object ──────────────────────────────────────


async def test_deleting_an_object_cleans_its_mirror_rows_exempt_ids_and_notification_state(hass: HomeAssistant) -> None:
    """An object delete left its tasks' rows on the family's to-do lists
    (the Store record naming them went with the object), their ids on the
    persistent vacation exempt list and the notification bookkeeping (a held
    quiet-hours reminder of the deleted object still went out)."""
    from tests.test_todo_mirror import SUMMARY, _refresh
    from tests.test_todo_mirror import _setup as mirror_setup

    family, kids, entry, _mirror = await mirror_setup(hass)
    await _refresh(hass, entry)
    assert SUMMARY in family.summaries() and SUMMARY in kids.summaries()

    from custom_components.maintenance_supporter.helpers.global_options import get_global_entry

    ge = get_global_entry(hass)
    hass.config_entries.async_update_entry(ge, options={**ge.data, CONF_VACATION_EXEMPT_TASK_IDS: [TASK_ID_1, "keep_me"]})
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    prefix = f"{entry.entry_id}_{TASK_ID_1}"
    nm._quiet_held[f"{prefix}_overdue"] = {"entry_id": entry.entry_id, "task_id": TASK_ID_1, "status": "overdue"}
    nm._last_notified[f"{prefix}_overdue"] = dt_util.now()
    nm._starved.add(prefix)
    nm._lead_sent[f"{prefix}_3"] = dt_util.now().date().isoformat()

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    assert SUMMARY not in family.summaries() and SUMMARY not in kids.summaries()
    assert get_global_entry(hass).options[CONF_VACATION_EXEMPT_TASK_IDS] == ["keep_me"]
    for mapping in (nm._quiet_held, nm._last_notified, nm._lead_sent):
        assert not [k for k in mapping if k.startswith(entry.entry_id)]
    assert prefix not in nm._starved
