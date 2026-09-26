"""Regression tests for the bug audit of 2026-09-26 (tranche 1).

One test (or a small group) per finding; the docstrings name the reported
failure so a red test says which bug came back.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
    SIGNAL_TASK_RESET,
)
from custom_components.maintenance_supporter.helpers.notification_manager import notification_key

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

TASK = "task_1"


async def _setup(hass: HomeAssistant, *, global_kwargs: dict[str, Any] | None = None, **task_overrides: Any) -> MockConfigEntry:
    g = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(**(global_kwargs or {})),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    g.add_to_hass(hass)
    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2020-01-01")
    task["name"] = "Change Filter"
    task.update(task_overrides)
    obj = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Boiler",
        data=build_object_entry_data(
            object_data=build_object_data(name="Boiler", object_id="boiler"),
            tasks={TASK: task},
        ),
        source="user",
        unique_id="maintenance_supporter_boiler",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    return obj


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


# ─── SCH-2: postpone must not reset the triggers ─────────────────────────


async def test_postpone_keeps_the_trigger_progress(hass: HomeAssistant) -> None:
    """A runtime task at 90 of 100 h dropped to 0 h when its due date was
    postponed: postpone sent the same reset signal as a completion."""
    entry = await _setup(hass)
    signals: list[int] = []
    async_dispatcher_connect(
        hass, SIGNAL_TASK_RESET.format(entry_id=entry.entry_id, task_id=TASK), lambda: signals.append(1)
    )
    coordinator = _coordinator(hass, entry)
    until = dt_util.now().date() + timedelta(days=14)

    await coordinator.async_postpone_task(TASK, until)
    await hass.async_block_till_done()
    assert signals == [], "postpone reset the sensor triggers"
    assert coordinator.data[CONF_TASKS][TASK]["_next_due"][:10] == until.isoformat()

    await coordinator.reset_maintenance(TASK)
    await hass.async_block_till_done()
    assert signals == [1], "a real reset still resets the triggers"


# ─── SCH-3: "notify once" re-arms when the task leaves the status ────────


async def test_a_notify_once_status_is_announced_again_after_the_task_left_it(hass: HomeAssistant, freezer: Any) -> None:
    """The freezer alarm fired once, ever: the first TRIGGERED push stamped
    "sent once" and only a completion cleared it — a recovery did not."""
    entry = await _setup(hass)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    key = notification_key(entry.entry_id, TASK, "triggered")
    nm._stamp_status_sent(key, 0)
    assert not nm._status_due(key, 0)
    nm.rearm_left_statuses(entry.entry_id, TASK, "triggered")
    assert not nm._status_due(key, 0), "still triggered: stays silent"
    nm.rearm_left_statuses(entry.entry_id, TASK, "ok")
    assert not nm._status_due(key, 0), "a sensor flapping around its limit must not re-push at once"
    freezer.tick(timedelta(hours=1, seconds=1))
    assert nm._status_due(key, 0)


async def test_the_refresh_re_arms_a_status_the_task_left(hass: HomeAssistant) -> None:
    """Checked on every refresh, so a status left while HA was down re-arms too."""
    entry = await _setup(hass, global_kwargs={"notifications_enabled": True})
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    key = notification_key(entry.entry_id, TASK, "triggered")
    nm._stamp_status_sent(key, 0)
    await _coordinator(hass, entry).async_refresh_now()
    assert nm._last_notified[key] != datetime.max, "the task is overdue, not triggered: the stamp re-arms"


# ─── SCH-7: seasonal overrides survive the JSON round trip ───────────────


def test_manual_seasonal_overrides_work_after_a_restart() -> None:
    """ws_seasonal_overrides stores int month keys; the JSON store returns
    strings — the analysis then raised on every refresh (swallowed), so
    adaptive scheduling silently died for the task."""
    from homeassistant.helpers.json import json_bytes
    from homeassistant.util.json import json_loads

    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer, month_overrides

    adaptive = {"enabled": True, "feedback_count": 6, "smoothed_interval": 30.0, "seasonal_overrides": {7: 0.5, 1: 2.0}}
    restored = json_loads(json_bytes({"adaptive_config": adaptive}))["adaptive_config"]
    assert list(restored["seasonal_overrides"]) == ["7", "1"]
    task = {"schedule": {"kind": "interval", "every": 30}, "history": []}
    before = IntervalAnalyzer().analyze(task, dict(adaptive, _current_month=7))
    after = IntervalAnalyzer().analyze(task, dict(restored, _current_month=7))
    assert after.seasonal_factor == before.seasonal_factor == 0.5
    assert month_overrides({"13": 1.0, "x": 2.0, "2": "nan"}) is None


# ─── BR-A7: a text duration must not break the object's refresh ──────────


def test_history_numbers_are_read_defensively() -> None:
    """An imported ``"duration": "30"`` made ``sum()`` raise inside the
    coordinator's update — the whole object stopped refreshing. NaN costs
    poisoned the statistics total."""
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    task = MaintenanceTask.from_dict(
        build_task_data(
            interval_days=30,
            history=[
                {"type": "completed", "timestamp": "2026-01-01T10:00:00+00:00", "duration": "30", "cost": "12.5"},
                {"type": "completed", "timestamp": "2026-02-01T10:00:00+00:00", "duration": 20, "cost": float("nan")},
                {"type": "completed", "timestamp": "2026-03-01T10:00:00+00:00", "duration": "abc", "cost": float("inf")},
                {"type": "skipped", "timestamp": "2026-04-01T10:00:00+00:00", "duration": 999},
            ],
        )
    )
    assert task.average_duration == 25.0
    assert task.total_cost == 12.5


def test_import_keeps_numeric_durations_and_drops_the_rest() -> None:
    from custom_components.maintenance_supporter.websocket.io import _sanitize_history

    out = _sanitize_history(
        [
            {"type": "completed", "timestamp": "2026-01-01T10:00:00+00:00", "duration": "30"},
            {"type": "completed", "timestamp": "2026-02-01T10:00:00+00:00", "duration": float("nan")},
            {"type": "completed", "timestamp": "2026-03-01T10:00:00+00:00", "duration": 12.5},
        ]
    )
    assert out[0]["duration"] == 30 and "duration" not in out[1] and out[2]["duration"] == 12.5


# ─── SEC-1: content services hold a calling user to the WS tier ──────────


async def test_content_services_hold_a_calling_user_to_the_write_tier(hass: HomeAssistant) -> None:
    """Any account could delete tasks through ``maintenance_supporter.delete_task``
    (WS call_service / REST) although the panel's commands refuse it."""
    import pytest
    from homeassistant.core import Context
    from homeassistant.exceptions import Unauthorized

    entry = await _setup(hass)
    # The first user of an instance becomes its owner (an admin) — create the admin first.
    admin = await hass.auth.async_create_user("Parent", group_ids=["system-admin"])
    kid = await hass.auth.async_create_user("Kid")
    assert not kid.is_admin
    target = {"entry_id": entry.entry_id, "task_id": TASK}

    with pytest.raises(Unauthorized):
        await hass.services.async_call(DOMAIN, "delete_task", target, blocking=True, context=Context(user_id=kid.id))
    with pytest.raises(Unauthorized):
        await hass.services.async_call(DOMAIN, "update_task", {**target, "name": "X"}, blocking=True, context=Context(user_id=kid.id))
    with pytest.raises(Unauthorized):
        await hass.services.async_call(DOMAIN, "export_data", {}, blocking=True, context=Context(user_id=kid.id))
    assert TASK in hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS]

    # Completing stays open to everyone, like the panel action.
    coordinator = _coordinator(hass, entry)
    sensor = coordinator.task_sensor_entity_id(TASK)
    assert sensor
    await hass.services.async_call(DOMAIN, "complete", {"entity_id": sensor}, blocking=True, context=Context(user_id=kid.id))
    # Admins and automations (no user in the context) may write.
    await hass.services.async_call(DOMAIN, "update_task", {**target, "name": "Renamed"}, blocking=True, context=Context(user_id=admin.id))
    await hass.services.async_call(DOMAIN, "update_task", {**target, "name": "By automation"}, blocking=True)
    await hass.async_block_till_done()
    assert hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][TASK]["name"] == "By automation"


# ─── BI-A1: object names — one rule, current names ───────────────────────


async def test_replacing_an_object_under_its_own_name_works(hass: HomeAssistant) -> None:
    """The panel pre-fills the current name; with a production-shaped
    unique id (the slug of that name) the replacement failed with
    ``replace_failed / already_configured``."""
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    from .conftest import assert_ws_success, call_ws_handler, make_ws_connection

    entry = await _setup(hass)
    assert entry.unique_id == "maintenance_supporter_boiler"
    conn = make_ws_connection()
    await call_ws_handler(
        ws_replace_object,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/object/replace", "entry_id": entry.entry_id, "name": "Boiler"},
    )
    new_id = assert_ws_success(conn)["entry_id"]
    await hass.async_block_till_done()
    successor = hass.config_entries.async_get_entry(new_id)
    assert successor.data["object"]["name"] == "Boiler"
    assert successor.unique_id == "maintenance_supporter_boiler_2"


async def test_a_renamed_object_frees_its_old_name(hass: HomeAssistant) -> None:
    """After "Boiler" was renamed, a new "Boiler" passed the setup form's
    name check but was refused at the last step (the old unique id is the
    slug of the old name) — and the tasks just entered were lost. A name in
    use is still refused, also when it only differs in spelling."""
    import pytest

    from custom_components.maintenance_supporter.websocket.objects import async_create_object

    entry = await _setup(hass)
    hass.config_entries.async_update_entry(entry, data={**entry.data, "object": {**entry.data["object"], "name": "Heater"}})
    new_id = await async_create_object(hass, name="Boiler")
    assert hass.config_entries.async_get_entry(new_id).unique_id == "maintenance_supporter_boiler_2"
    with pytest.raises(ValueError, match="already_configured"):
        await async_create_object(hass, name="heater")
    with pytest.raises(ValueError, match="already_configured"):
        await async_create_object(hass, name="BOILER!")


# ─── BI-A6: unsafe links stop on every create path ───────────────────────


async def test_unsafe_links_are_dropped_on_the_flow_and_import_paths(hass: HomeAssistant) -> None:
    """The setup/options flows and the JSON/CSV imports stored ``javascript:``
    links unchecked; they reach automations through the sensor attribute."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv
    from custom_components.maintenance_supporter.helpers.sanitize import cap_object_fields, cap_task_fields

    assert cap_task_fields({"documentation_url": "javascript:alert(1)"})["documentation_url"] is None
    assert cap_object_fields({"documentation_url": " //evil.example/x"})["documentation_url"] is None
    assert cap_task_fields({"documentation_url": "https://example.com/manual.pdf"})["documentation_url"] == "https://example.com/manual.pdf"

    await _setup(hass)
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "websocket"},
        data={
            "object": {"id": "imp", "name": "Imported", "documentation_url": "javascript:alert(1)", "task_ids": ["t1"]},
            CONF_TASKS: {"t1": {"id": "t1", "object_id": "imp", "name": "T", "type": "custom", "schedule_type": "time_based", "interval_days": 30, "documentation_url": "data:text/html,x"}},
        },
    )
    assert result["type"] == "create_entry"
    data = result["result"].data
    assert data["object"]["documentation_url"] is None
    assert data[CONF_TASKS]["t1"]["documentation_url"] is None

    rows = "object_name,task_name,task_type,schedule_type,interval_days,documentation_url\nPump,Clean,cleaning,time_based,30,//evil.example\n"
    parsed = import_objects_csv(rows)
    task = next(iter(parsed[0]["tasks"].values()))
    assert "documentation_url" not in task


# ─── SEC-2: a completion action runs with its author's rights ────────────


async def test_a_completion_action_runs_with_the_rights_of_whoever_configured_it(hass: HomeAssistant) -> None:
    """The action ran without a user context — with system rights — so an
    operator could schedule admin-only services (cloud.remote_connect,
    downloader, …) and have them run on the next completion."""
    from homeassistant.helpers.service import async_register_admin_service

    from custom_components.maintenance_supporter.helpers.action_listener import _dispatch_action
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field, stamp_action_owner

    await _setup(hass)
    admin = await hass.auth.async_create_user("Parent", group_ids=["system-admin"])
    operator = await hass.auth.async_create_user("Operator")
    calls: list[str | None] = []

    async def _admin_only(call: Any) -> None:
        calls.append(call.context.user_id)

    async_register_admin_service(hass, "testdom", "admin_only", _admin_only)

    await _dispatch_action(hass, {"service": "testdom.admin_only", "configured_by": operator.id})
    await hass.async_block_till_done()
    assert calls == [], "an operator's action ran an admin-only service"
    await _dispatch_action(hass, {"service": "testdom.admin_only", "configured_by": admin.id})
    await _dispatch_action(hass, {"service": "testdom.admin_only"})  # stored before the stamp: as before
    await hass.async_block_till_done()
    assert calls == [admin.id, None]
    await _dispatch_action(hass, {"service": "testdom.admin_only", "configured_by": "removed-user"})
    await hass.async_block_till_done()
    assert calls == [admin.id, None], "a removed user's action must not run"

    # The stamp is server-side: a client or an import cannot bring its own.
    task: dict[str, Any] = {"on_complete_action": {"service": "light.turn_on", "configured_by": admin.id}}
    cap_action_field(task)
    assert "configured_by" not in task["on_complete_action"]
    stamp_action_owner(task, operator.id)
    cap_action_field(task, keep_owner=True)
    assert task["on_complete_action"]["configured_by"] == operator.id


async def test_an_unchanged_completion_action_keeps_its_author(hass: HomeAssistant) -> None:
    """The dialog sends the action back on every save: an operator editing
    the notes must not re-author (and so switch off) an admin's action."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    from .conftest import call_ws_handler, make_ws_connection

    action = {"service": "light.turn_on", "target": {"entity_id": "light.workshop"}}
    entry = await _setup(hass, on_complete_action={**action, "configured_by": "the-admin"})

    async def _update(extra: dict[str, Any]) -> dict[str, Any]:
        conn = make_ws_connection()
        await call_ws_handler(
            ws_update_task, hass, conn, {"id": 1, "type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": TASK, **extra}
        )
        assert conn.send_error.call_count == 0, conn.send_error.call_args
        await hass.async_block_till_done()
        return hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][TASK]["on_complete_action"]

    kept = await _update({"notes": "new note", "on_complete_action": dict(action)})
    assert kept["configured_by"] == "the-admin"
    changed = await _update({"on_complete_action": {**action, "data": {"brightness": 10}}})
    assert changed["configured_by"] == "mock-ws-user"


# ─── SCH-1: completing a calendar task early covers that occurrence ──────


async def test_a_calendar_task_completed_early_covers_its_date(hass: HomeAssistant, freezer: Any) -> None:
    """A Monday task done on Saturday was due again two days later and
    overdue on Tuesday; a "1st of the month" task skipped on the 29th was
    overdue on the 2nd."""
    from custom_components.maintenance_supporter.const import MaintenanceStatus
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    freezer.move_to("2026-09-26 12:00:00")  # a Saturday
    bins = MaintenanceTask.from_dict(
        {"id": "b", "name": "Bins out", "warning_days": 7, "schedule": {"kind": "weekdays", "weekdays": [0]},
         "created_at": "2026-01-01", "last_performed": "2026-09-21"}
    )
    assert bins.next_due.isoformat() == "2026-09-28"
    bins.complete()
    assert bins.next_due.isoformat() == "2026-10-05"
    freezer.move_to("2026-09-29 09:00:00")
    assert bins.status != MaintenanceStatus.OVERDUE

    freezer.move_to("2026-09-29 09:00:00")
    monthly = MaintenanceTask.from_dict(
        {"id": "m", "name": "Meter", "schedule": {"kind": "day_of_month", "day": 1},
         "created_at": "2026-01-01", "last_performed": "2026-09-01"}
    )
    monthly.skip()
    freezer.move_to("2026-10-02 09:00:00")
    assert monthly.next_due.isoformat() == "2026-11-01"
    assert monthly.status == MaintenanceStatus.OK


async def test_a_late_completion_leaves_the_next_occurrence_due(hass: HomeAssistant, freezer: Any) -> None:
    """Done on Saturday for last Monday: next Monday is still due — and a
    stale planned date (from a former interval schedule) swallows nothing."""
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    freezer.move_to("2026-09-26 12:00:00")
    late = MaintenanceTask.from_dict(
        {"id": "l", "name": "Bins out", "schedule": {"kind": "weekdays", "weekdays": [0]},
         "created_at": "2026-01-01", "last_performed": "2026-09-14"}
    )
    assert late.next_due.isoformat() == "2026-09-21"  # overdue
    late.complete()
    assert late.next_due.isoformat() == "2026-09-28"

    stale = MaintenanceTask.from_dict(
        {"id": "s", "name": "Bins out", "schedule": {"kind": "weekdays", "weekdays": [0]},
         "created_at": "2026-01-01", "last_performed": "2026-09-21", "last_planned_due": "2026-10-01"}
    )
    assert stale.next_due.isoformat() == "2026-09-28"
