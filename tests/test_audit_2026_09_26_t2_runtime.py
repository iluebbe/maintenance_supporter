"""Regression tests for the bug audit of 2026-09-26, tranche 2 — backend
runtime and notifications (DRY BR-A1…A10, SCH-5/8/9/10/11/12, SEC-6/7/10/11).

One test (or a small group) per finding; the docstrings name the reported
failure so a red test says which bug came back.
"""

from __future__ import annotations

import asyncio
from datetime import date, datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import Event, EventOrigin, HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFY_COMPLETED,
    CONF_OBJECT,
    CONF_PARTS,
    CONF_QUIET_HOURS_ENABLED,
    CONF_REMINDER_LEAD_DAYS,
    CONF_TASK_CONSUMES_PARTS,
    CONF_TASKS,
    CONF_VACATION_ENABLED,
    CONF_VACATION_END,
    CONF_VACATION_START,
    CONF_WARRANTY_REMINDER_DAYS,
    CONF_WARRANTY_REMINDER_ENABLED,
    DOCUMENT_STORE_KEY,
    DOMAIN,
    EVENT_NOTIFICATION,
    EVENT_TASK_COMPLETED,
    EVENT_TRIGGER_ACTIVATED,
    NOTIFICATION_MANAGER_KEY,
    STORES_CACHE_KEY,
    HistoryEntryType,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    build_object_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)
from .journey import simulate_restart

TASK = "task_1"
TASK_2 = "task_2"


def _iso_days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


async def _setup(
    hass: HomeAssistant,
    tasks: dict[str, dict[str, Any]],
    *,
    name: str = "Boiler",
    uid: str = "t2rt",
    object_extra: dict[str, Any] | None = None,
    global_extra: dict[str, Any] | None = None,
    global_kw: dict[str, Any] | None = None,
    entry_extra: dict[str, Any] | None = None,
) -> MockConfigEntry:
    g = make_global_entry(hass, extra_data=global_extra, **(global_kw or {}))
    obj_data = build_object_data(name=name, object_id=uid)
    obj_data.update(object_extra or {})
    obj = make_object_entry(hass, tasks=tasks, name=name, uid=uid, object_data=obj_data, extra_data=entry_extra)
    await setup_integration(hass, g, obj)
    return obj


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _history_types(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK) -> list[str]:
    merged = _coordinator(hass, entry)._get_merged_tasks_data()[task_id]
    return [h.get("type") for h in merged.get("history") or []]


def _capture(hass: HomeAssistant, event_type: str) -> list[Event]:
    events: list[Event] = []
    hass.bus.async_listen(event_type, events.append)
    return events


def _threshold_task(*entity_ids: str, **trigger: Any) -> dict[str, Any]:
    task = build_task_data(
        task_id=TASK,
        name="Filter",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": entity_ids[0],
            "entity_ids": list(entity_ids),
            "trigger_above": 30,
            **trigger,
        },
    )
    return task


# ─── BR-A1: the vacation preview follows the task model ──────────────────


def test_the_vacation_preview_projects_what_the_task_model_says() -> None:
    """The preview re-derived the due date from the flat interval fields: a
    postponed task previewed on its OLD date, a seasonal one inside its off
    season, a one-time task never appeared, an archived one did, and a weekly
    task with a 14-day warning read "due soon" two weeks ahead."""
    from custom_components.maintenance_supporter.helpers.vacation import VacationState, compute_preview

    state = VacationState(enabled=True, start=date(2026, 6, 10), end=date(2026, 6, 30), buffer_days=0)
    base = {"entry_id": "e", "object_name": "Home", "enabled": True}
    interval = {"schedule_type": "time_based", "interval_days": 30, "warning_days": 0, "last_performed": "2026-05-15"}
    tasks = [
        {**base, **interval, "task_id": "postponed", "task_name": "P", "due_override": "2026-06-25"},
        {**base, "task_id": "oneoff", "task_name": "O", "schedule_type": "one_time", "due_date": "2026-06-20", "warning_days": 0},
        {**base, **interval, "task_id": "archived", "task_name": "A", "archived_at": "2026-05-20T00:00:00+00:00"},
        {
            **base,
            "task_id": "seasonal",
            "task_name": "S",
            "schedule": {"kind": "interval", "every": 30, "season_months": [9, 10]},
            "warning_days": 0,
            "last_performed": "2026-05-15",
        },
        {**base, "task_id": "weekly", "task_name": "W", "schedule_type": "time_based", "interval_days": 7, "warning_days": 14, "last_performed": "2026-06-15"},
    ]
    rows = {r["task_id"]: r for r in compute_preview(state, tasks, today=date(2026, 6, 1))}

    assert [e["date"] for e in rows["postponed"]["events"] if e["status"] == "overdue"] == ["2026-06-25"]
    assert rows["oneoff"]["kind"] == "one_time"
    assert {"date": "2026-06-20", "status": "overdue"} in rows["oneoff"]["events"]
    assert "archived" not in rows, "an archived task fires nothing"
    assert "seasonal" not in rows, "due 1 September (season start), not inside the vacation"
    # Due 22 June; the warning is capped below one cycle (6 days) like the status.
    assert {"date": "2026-06-16", "status": "due_soon"} in rows["weekly"]["events"]


def test_the_vacation_preview_date_is_the_model_next_due() -> None:
    """Parity: the preview's due date is ``MaintenanceTask.next_due`` (today
    injectable) — postpone, planned anchor, one-off, season, finite series,
    calendar kind and a malformed anchor alike."""
    from custom_components.maintenance_supporter.helpers.vacation import task_next_due
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    today = dt_util.now().date()
    past = (today - timedelta(days=40)).isoformat()
    samples: list[dict[str, Any]] = [
        {"schedule_type": "time_based", "interval_days": 30, "last_performed": past, "due_override": (today + timedelta(days=3)).isoformat()},
        {"schedule_type": "time_based", "interval_days": 30, "interval_anchor": "planned", "last_performed": past, "last_planned_due": past},
        {"schedule_type": "one_time", "due_date": (today + timedelta(days=9)).isoformat()},
        {"schedule": {"kind": "interval", "every": 2, "unit": "months", "season_months": [1, 2]}, "last_performed": past},
        {"schedule": {"kind": "interval", "every": 10, "ends": {"count": 1}}, "last_performed": past, "history": [{"type": "completed", "timestamp": past}]},
        {"schedule": {"kind": "weekdays", "weekdays": [0, 3]}, "created_at": past},
        {"schedule_type": "time_based", "interval_days": 30, "last_performed": "not-a-date"},
        {"schedule_type": "manual"},
    ]
    for data in samples:
        task = MaintenanceTask.from_dict(data)
        assert task_next_due(task, today) == task.next_due, data


async def test_the_vacation_preview_leaves_out_paused_and_disabled_tasks(hass: HomeAssistant) -> None:
    """A paused object (and a disabled task) fires nothing during the absence,
    but the preview listed them as coming due."""
    from custom_components.maintenance_supporter.websocket.vacation import ws_vacation_preview

    today = dt_util.now().date()
    vacation = {
        CONF_VACATION_ENABLED: True,
        CONF_VACATION_START: (today + timedelta(days=1)).isoformat(),
        CONF_VACATION_END: (today + timedelta(days=20)).isoformat(),
    }
    due_in_5 = {"interval_days": 30, "last_performed": _iso_days_ago(25)}
    live = await _setup(
        hass,
        {TASK: build_task_data(task_id=TASK, name="Live", **due_in_5), TASK_2: build_task_data(task_id=TASK_2, name="Off", enabled=False, **due_in_5)},
        global_extra=vacation,
    )
    paused = make_object_entry(
        hass,
        tasks={"task_p": build_task_data(task_id="task_p", name="Frozen", **due_in_5)},
        name="Pool",
        uid="t2rt_pool",
        object_data={**build_object_data(name="Pool", object_id="pool"), "paused_at": "2026-01-01T00:00:00+00:00"},
    )
    await hass.config_entries.async_setup(paused.entry_id)
    await hass.async_block_till_done()

    conn = make_ws_connection()
    await call_ws_handler(ws_vacation_preview, hass, conn, {"id": 1, "type": f"{DOMAIN}/vacation/preview"})
    rows = conn.send_result.call_args[0][1]["rows"]
    assert [(r["entry_id"], r["task_id"]) for r in rows] == [(live.entry_id, TASK)]


# ─── BR-A2: one inert predicate everywhere ───────────────────────────────


async def test_a_disabled_task_records_no_trigger_activation(hass: HomeAssistant) -> None:
    """A disabled task's triggers were still wired: a sensor over its limit
    wrote a TRIGGERED history entry and fired the activation event for a
    task that reads OK."""
    hass.states.async_set("sensor.pressure", "45")
    activations = _capture(hass, EVENT_TRIGGER_ACTIVATED)
    task = _threshold_task("sensor.pressure")
    task["enabled"] = False
    entry = await _setup(hass, {TASK: task})
    await hass.async_block_till_done()
    assert activations == []
    assert HistoryEntryType.TRIGGERED not in _history_types(hass, entry)

    # The coordinator's own guard (a trigger outliving a disable until reload).
    await _coordinator(hass, entry).async_add_trigger_history_entry(TASK, trigger_value=50.0)
    assert HistoryEntryType.TRIGGERED not in _history_types(hass, entry)


async def test_a_paused_objects_buttons_are_unavailable(hass: HomeAssistant) -> None:
    """The buttons of a paused object looked usable and only raised on press."""
    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK)}, object_extra={"paused_at": "2026-01-01T00:00:00+00:00"})
    buttons = [e.entity_id for e in er.async_entries_for_config_entry(er.async_get(hass), entry.entry_id) if e.domain == "button"]
    assert buttons
    assert {hass.states.get(b).state for b in buttons} == {"unavailable"}


async def test_an_inert_task_raises_no_stale_action_issue_and_drops_old_ones(hass: HomeAssistant) -> None:
    """The stale-action scan flagged the missing target of a DISABLED task,
    and an issue raised before the task went inert stayed."""
    from custom_components.maintenance_supporter.helpers.issues import stale_action_issue_id

    task = build_task_data(task_id=TASK, enabled=False)
    task["on_complete_action"] = {"service": "light.turn_on", "target": {"entity_id": "light.gone"}}
    entry = await _setup(hass, {TASK: task})
    issue_id = stale_action_issue_id(entry.entry_id, TASK, "light.gone")
    ir.async_create_issue(hass, DOMAIN, issue_id, is_fixable=True, severity=ir.IssueSeverity.WARNING, translation_key="stale_action_entity", data={"task_id": TASK})
    coordinator = _coordinator(hass, entry)
    with patch.object(coordinator, "_in_startup_grace_period", return_value=False):
        await coordinator.async_refresh_now()
    assert ir.async_get(hass).async_get_issue(DOMAIN, issue_id) is None


async def test_warranty_reminders_skip_archived_objects(hass: HomeAssistant) -> None:
    """A retired object's warranty was still announced (the lead reminders
    already skipped archived objects)."""
    from custom_components.maintenance_supporter import async_maybe_send_warranty_reminders

    expiry = (dt_util.now().date() + timedelta(days=10)).isoformat()
    await _setup(
        hass,
        {TASK: build_task_data(task_id=TASK)},
        name="Live",
        uid="t2rt_live",
        object_extra={"warranty_expiry": expiry},
        global_extra={CONF_WARRANTY_REMINDER_ENABLED: True, CONF_WARRANTY_REMINDER_DAYS: 30},
    )
    retired = make_object_entry(
        hass,
        tasks={},
        name="Retired",
        uid="t2rt_retired",
        object_data={**build_object_data(name="Retired", object_id="retired"), "warranty_expiry": expiry, "archived_at": "2026-01-01T00:00:00+00:00"},
    )
    await hass.config_entries.async_setup(retired.entry_id)
    await hass.async_block_till_done()
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    with patch.object(nm, "async_send_warranty_reminder", AsyncMock()) as send:
        await async_maybe_send_warranty_reminders(hass, force=True)
    send.assert_awaited_once()
    assert send.call_args[0][0] == ["Live"]


async def test_a_paused_objects_buy_task_is_not_shopping(hass: HomeAssistant) -> None:
    """The shopping sync put a paused object's buy reminder on the list."""
    from custom_components.maintenance_supporter.shopping_sync import ShoppingListSync

    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK)})
    tasks = dict(entry.data[CONF_TASKS])
    tasks["buy"] = {"id": "buy", "name": "Buy filter", "enabled": True, "part_ref": {"part_id": "p1"}}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})
    sync = ShoppingListSync(hass)
    assert sync._desired() == {f"{entry.entry_id}:buy": "Boiler: Buy filter"}

    obj = {**entry.data[CONF_OBJECT], "paused_at": "2026-01-01T00:00:00+00:00"}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_OBJECT: obj})
    assert sync._desired() == {}


# ─── BR-A3: prediction urgency in real days ──────────────────────────────


def test_only_a_day_interval_takes_a_day_suggestion() -> None:
    """A suggestion is a day count; a months/weeks interval or a calendar
    kind has none to overwrite."""
    from custom_components.maintenance_supporter.coordinator import _takes_day_suggestion
    from custom_components.maintenance_supporter.helpers.schedule import Schedule

    assert _takes_day_suggestion(Schedule.from_dict({"kind": "interval", "every": 30}))
    assert _takes_day_suggestion(Schedule.from_dict({"kind": "manual"}))
    assert not _takes_day_suggestion(Schedule.from_dict({"kind": "interval", "every": 6, "unit": "months"}))
    assert not _takes_day_suggestion(Schedule.from_dict({"kind": "interval", "every": 2, "unit": "weeks"}))
    assert not _takes_day_suggestion(Schedule.from_dict({"kind": "weekdays", "weekdays": [0]}))


async def test_prediction_urgency_measures_a_months_task_in_days(hass: HomeAssistant) -> None:
    """The urgency check compared the forecast against the raw count (6 for
    a 6-month task, so a threshold 20 days out was never urgent) and wrote a
    DAY suggestion that applying turned the task into a 20-day interval."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import (
        SensorPredictionResult,
        ThresholdPrediction,
    )

    hass.states.async_set("sensor.salt", "50")
    task = build_task_data(
        task_id=TASK,
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=6,
        last_performed=_iso_days_ago(1),
        trigger_config={"type": "threshold", "entity_id": "sensor.salt", "trigger_below": 10},
    )
    task["interval_unit"] = "months"
    prediction = SensorPredictionResult(
        degradation=None,
        threshold_prediction=ThresholdPrediction(
            days_until_threshold=20.0,
            predicted_date=(dt_util.now().date() + timedelta(days=20)).isoformat(),
            threshold_value=10.0,
            threshold_direction="below",
            current_value=50.0,
            rate_per_day=-2.0,
            confidence="high",
        ),
        environmental=None,
    )
    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor.async_analyze",
        AsyncMock(return_value=prediction),
    ):
        entry = await _setup(hass, {TASK: task})
        result = _coordinator(hass, entry).data[CONF_TASKS][TASK]
    assert result.get("_sensor_prediction_urgency") is True
    assert result.get("_suggested_interval") is None

    before = dict(entry.data[CONF_TASKS][TASK])
    await _coordinator(hass, entry).async_apply_suggested_interval(TASK, 18)
    assert entry.data[CONF_TASKS][TASK].get("schedule") == before.get("schedule")
    assert entry.data[CONF_TASKS][TASK].get("interval_unit") == before.get("interval_unit")


async def test_the_notification_interval_is_in_days(hass: HomeAssistant) -> None:
    """The notification facts said interval_days: 6 for a 6-month task."""
    from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_STATUS, notification_context

    task = build_task_data(task_id=TASK, interval_days=6)
    task["interval_unit"] = "months"
    entry = await _setup(hass, {TASK: task})
    ctx = notification_context(hass, KIND_STATUS, entry_id=entry.entry_id, task_id=TASK)
    assert 180 <= ctx["interval_days"] <= 184


# ─── BR-A4: the add_task service follows the warning setting ─────────────


async def test_the_add_task_service_uses_the_default_warning_setting(hass: HomeAssistant) -> None:
    """The service wrote the bare constant 7 instead of the configured
    default warning window."""
    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK)}, global_kw={"warning_days": 3})
    resp = await hass.services.async_call(
        DOMAIN, "add_task", {"entry_id": entry.entry_id, "name": "New", "interval_days": 30}, blocking=True, return_response=True
    )
    assert hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][resp["task_id"]]["warning_days"] == 3


# ─── BR-A5: one task label for every surface ─────────────────────────────


_PHASES = {
    "phases": {"swap": {"name": "Swap disks"}, "replace": {"name": "Replace blades"}},
    "phase_sequence": ["swap", "replace"],
}


def test_the_task_label_names_phase_and_events() -> None:
    from custom_components.maintenance_supporter.helpers.phases import task_label
    from custom_components.maintenance_supporter.helpers.todo_mirror import mirror_summary

    assert task_label({"name": "Blades", **_PHASES}) == "Blades · Swap disks"
    assert task_label({"name": "Blades", **_PHASES, "phase_cursor": 1, "_next_event_titles": ["x"]}) == "Blades · Replace blades · x"
    assert task_label({"name": "Bins", "_next_event_titles": ["Paper"]}, None) == "Bins", "explicit None = no titles"
    # A phase-less task's to-do row text is unchanged — mirrored rows keep matching.
    assert mirror_summary("Home", {"name": "Filter"}) == "Home: Filter"


async def test_every_reminder_names_the_due_phase(hass: HomeAssistant) -> None:
    """Lead reminders (with their own title, ignoring the #44 title style),
    the completion notification and the to-do rows sent the bare task name;
    only the status push said which cycle step is due (#139)."""
    from custom_components.maintenance_supporter import async_maybe_send_lead_reminders
    from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_COMPLETED, KIND_LEAD_TIME

    async_mock_service(hass, "notify", "test")
    task = build_task_data(task_id=TASK, name="Mower blades", interval_days=30, last_performed=_iso_days_ago(27))
    task.update(_PHASES)
    entry = await _setup(
        hass,
        {TASK: task},
        global_kw={"notifications_enabled": True, "notify_service": "notify.test"},
        global_extra={
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_NOTIFY_COMPLETED: "all",
            CONF_REMINDER_LEAD_DAYS: [3],
            CONF_NOTIFICATION_TITLE_STYLE: "task_name",
        },
    )
    events = _capture(hass, EVENT_NOTIFICATION)

    await async_maybe_send_lead_reminders(hass)
    await hass.async_block_till_done()
    (lead,) = [e.data for e in events if e.data["kind"] == KIND_LEAD_TIME]
    assert lead["task_name"] == "Mower blades · Swap disks"
    assert lead["title"] == "Mower blades · Swap disks", "the #44 title style applies to lead reminders too"

    await _coordinator(hass, entry).complete_maintenance(TASK, notes="done", source="panel")
    await hass.async_block_till_done()
    (done,) = [e.data for e in events if e.data["kind"] == KIND_COMPLETED]
    assert "Mower blades · Swap disks" in done["message"], "names the step that was done"

    todo_id = next(e.entity_id for e in er.async_get(hass).entities.values() if e.domain == "todo" and e.platform == DOMAIN)
    items = await hass.services.async_call("todo", "get_items", {"entity_id": todo_id}, blocking=True, return_response=True)
    assert [i["summary"] for i in items[todo_id]["items"]] == ["Boiler: Mower blades · Replace blades"]


# ─── BR-A6: one formatter, values verbatim ───────────────────────────────


def test_notification_text_keeps_braces_verbatim() -> None:
    """A task named "Filter {A}" arrived as "Filter {{A}}" on the phone."""
    from custom_components.maintenance_supporter.helpers.i18n import format_text
    from custom_components.maintenance_supporter.helpers.notification_manager import _notif_t

    msg = _notif_t("overdue_message", "en", task="Filter {A}", object="Pump {1}", days="2")
    assert "Filter {A}" in msg and "Pump {1}" in msg and "{{" not in msg

    tables = {"en": {"k": "Hello {name}"}, "de": {"k": "Hallo {nme}"}}
    assert format_text(tables, "de", "k", name="X") == "Hello X", "a malformed translation falls back to English"
    assert format_text(tables, "fr", "k", name="{Y}") == "Hello {Y}"
    assert format_text(tables, "en", "missing") == "missing"


# ─── BR-A8: repair issues go with what they are about ────────────────────


async def test_deleting_a_task_or_object_takes_its_repair_issues_along(hass: HomeAssistant) -> None:
    """Only missing_trigger_* went with a deleted task and only
    device_link_lost_* with a deleted object: stale-action, broken-part-link
    and missing-trigger issues stayed in Repairs with nothing left to fix."""
    from custom_components.maintenance_supporter.helpers.issues import (
        async_purge_task_issues,
        broken_part_link_issue_id,
        device_link_lost_issue_id,
        missing_trigger_issue_id,
        stale_action_issue_id,
    )

    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK), TASK_2: build_task_data(task_id=TASK_2)})
    eid = entry.entry_id

    def issue(issue_id: str, **data: str) -> str:
        ir.async_create_issue(hass, DOMAIN, issue_id, is_fixable=False, severity=ir.IssueSeverity.WARNING, translation_key="broken_part_link", data=data or None)
        return issue_id

    t1 = [issue(missing_trigger_issue_id(eid, TASK, "sensor.a"), task_id=TASK), issue(stale_action_issue_id(eid, TASK, "light.a"), task_id=TASK)]
    # "task_1_2…" starts with "task_1_" — its own data keeps it apart.
    lookalike = issue(missing_trigger_issue_id(eid, f"{TASK}_2", "sensor.b"), task_id=f"{TASK}_2")
    entry_wide = [issue(broken_part_link_issue_id(eid)), issue(device_link_lost_issue_id(eid)), issue(missing_trigger_issue_id(eid, TASK_2, "sensor.c"), task_id=TASK_2)]
    foreign = issue(missing_trigger_issue_id("OTHERENTRY", TASK, "sensor.a"), task_id=TASK)

    def present() -> set[str]:
        return {iid for (dom, iid) in ir.async_get(hass).issues if dom == DOMAIN}

    assert async_purge_task_issues(hass, eid, TASK) == 2
    assert not present() & set(t1)
    assert {lookalike, foreign, *entry_wide} <= present()

    await hass.config_entries.async_remove(eid)
    await hass.async_block_till_done()
    assert not present() & {lookalike, *entry_wide}
    assert foreign in present()


# ─── BR-A9: the calendar prefix is the sensor's status ───────────────────


async def test_the_calendar_prefix_follows_the_sensor_with_schedule_time_off(hass: HomeAssistant, freezer: Any) -> None:
    """With time-of-day scheduling switched off, a task due today with a
    stored schedule_time read OVERDUE in the calendar after that hour while
    its sensor said due soon."""
    from custom_components.maintenance_supporter.calendar import STATUS_PREFIX, MaintenanceCalendar

    freezer.move_to(dt_util.now().replace(hour=12, minute=0, second=0, microsecond=0))
    entry = await _setup(
        hass,
        {TASK: build_task_data(task_id=TASK, interval_days=10, last_performed=_iso_days_ago(10), schedule_time="00:01")},
        # Flags present = no first-start auto-detection (which would switch
        # the feature ON for a task that carries a schedule_time).
        global_extra={CONF_ADVANCED_ADAPTIVE: False, CONF_ADVANCED_SCHEDULE_TIME: False},
    )
    assert _coordinator(hass, entry).data[CONF_TASKS][TASK]["_status"] == MaintenanceStatus.DUE_SOON
    calendar = hass.data[DOMAIN]["_calendar_entity"]
    assert isinstance(calendar, MaintenanceCalendar)
    today = dt_util.now().date()
    (event,) = calendar._get_all_events(today, today + timedelta(days=1))
    assert event.summary.startswith(STATUS_PREFIX[MaintenanceStatus.DUE_SOON])
    assert isinstance(event.start, date) and not isinstance(event.start, datetime), "all-day while the feature is off"


# ─── BR-A10 / SCH-8: one counter baseline ────────────────────────────────


def test_counter_progress_pairs_a_reading_with_its_own_baseline() -> None:
    """The coordinator subtracted the FIRST entity's baseline from the LAST
    entity's reading on a multi-entity delta counter."""
    from custom_components.maintenance_supporter.helpers.trigger_fallback import (
        counter_baseline,
        counter_progress,
        evaluate_counter,
    )

    states = {"sensor.a": MagicMock(state="1000", attributes={}), "sensor.b": MagicMock(state="50", attributes={})}
    cfg = {
        "trigger_target_value": 500,
        "trigger_delta_mode": True,
        "trigger_baseline_value": 0,
        "_trigger_state": {"sensor.a": {"baseline_value": 900}, "sensor.b": {"baseline_value": 0}},
    }
    assert counter_baseline(cfg, "sensor.a") == 900
    assert counter_baseline(cfg, "sensor.unknown") == 0, "the configured initial baseline"
    assert counter_progress(states.get, cfg, ["sensor.a", "sensor.b"]) == (1000.0, 900.0)
    assert evaluate_counter(states.get, cfg, ["sensor.a", "sensor.b"]).current_value == 1000.0


async def test_the_coordinator_shows_one_entitys_counter_progress(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.odo_a", "1000")
    hass.states.async_set("sensor.odo_b", "50")
    task = build_task_data(
        task_id=TASK,
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.odo_a",
            "entity_ids": ["sensor.odo_a", "sensor.odo_b"],
            "trigger_target_value": 500,
            "trigger_delta_mode": True,
        },
    )
    entry = await _setup(hass, {TASK: task})
    await hass.async_block_till_done()
    coordinator = _coordinator(hass, entry)
    coordinator._store.set_trigger_runtime(TASK, "sensor.odo_a", {"baseline_value": 900.0})
    coordinator._store.set_trigger_runtime(TASK, "sensor.odo_b", {"baseline_value": 0.0})
    await coordinator.async_refresh_now()
    result = coordinator.data[CONF_TASKS][TASK]
    assert result["_trigger_baseline_value"] == 900.0
    assert result["_trigger_current_value"] == 1000.0
    assert result["_trigger_current_delta"] == 100.0


def test_the_counter_forecast_uses_the_living_baseline() -> None:
    """The predictor measured a delta counter from the configured initial
    baseline, not the one moved by the last service — a serviced odometer
    task read "due now"."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import DegradationAnalysis, SensorPredictor

    degradation = DegradationAnalysis(
        entity_id="sensor.odo", slope_per_day=10.0, trend="rising", r_squared=0.9, current_value=1000.0, data_points=30, lookback_days=30
    )
    cfg = {
        "type": "counter",
        "trigger_target_value": 500,
        "trigger_delta_mode": True,
        "trigger_baseline_value": 0,
        "_trigger_state": {"sensor.odo": {"baseline_value": 900.0}},
    }
    prediction = SensorPredictor._compute_threshold_prediction(degradation, cfg)
    assert prediction is not None
    assert prediction.days_until_threshold == pytest.approx(40.0)


# ─── SCH-9: catalog tasks with entity_ids only are predicted ─────────────


async def test_a_task_naming_its_sensor_in_entity_ids_only_is_predicted(hass: HomeAssistant) -> None:
    """Catalog-adopted threshold tasks carry only ``entity_ids`` and never
    got a prediction."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import DegradationAnalysis, SensorPredictor

    predictor = SensorPredictor(hass)
    degradation = DegradationAnalysis(
        entity_id="sensor.salt", slope_per_day=-2.0, trend="falling", r_squared=0.9, current_value=50.0, data_points=30, lookback_days=30
    )
    task = {"schedule_type": "sensor_based", "trigger_config": {"type": "threshold", "entity_ids": ["sensor.salt"], "trigger_below": 10}}
    with (
        patch.object(predictor, "_async_fetch_statistics_points", AsyncMock(return_value=[])) as fetch,
        patch.object(predictor, "_compute_cycle_aware_degradation", return_value=degradation),
    ):
        result = await predictor.async_analyze(task, {})
    assert result is not None and result.threshold_prediction is not None
    assert fetch.call_args[0][0] == "sensor.salt"


# ─── SCH-5: entity_logic "all" ───────────────────────────────────────────


def _sensor_entity(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    entity_id = _coordinator(hass, entry).task_sensor_entity_id(TASK)
    return hass.data["entity_components"]["sensor"].get_entity(entity_id)


async def test_a_completed_all_task_needs_every_sensor_again(hass: HomeAssistant) -> None:
    """A reset CLEARED the per-entity map instead of re-seeding it: the first
    sensor to cross its limit after a completion satisfied all({one: True})
    and the "all" task read triggered while its sibling was fine."""
    hass.states.async_set("sensor.p1", "10")
    hass.states.async_set("sensor.p2", "10")
    entry = await _setup(hass, {TASK: _threshold_task("sensor.p1", "sensor.p2", entity_logic="all")})
    await hass.async_block_till_done()
    sensor = _sensor_entity(hass, entry)
    sensor._handle_task_reset()
    assert sensor._trigger_states == {"sensor.p1": False, "sensor.p2": False}
    sensor.async_update_trigger_state(True, 35.0, "sensor.p1")
    assert _coordinator(hass, entry).data[CONF_TASKS][TASK]["_trigger_active"] is False


async def test_auto_complete_waits_for_the_task_to_recover(hass: HomeAssistant) -> None:
    """Auto-complete-on-recovery fired when ONE of several sensors cleared —
    with "any" while another still held the task."""
    hass.states.async_set("sensor.p1", "40")
    hass.states.async_set("sensor.p2", "40")
    entry = await _setup(hass, {TASK: _threshold_task("sensor.p1", "sensor.p2", entity_logic="any", auto_complete_on_recovery=True)})
    await hass.async_block_till_done()
    coordinator = _coordinator(hass, entry)
    with patch.object(coordinator, "async_auto_complete_on_recovery", AsyncMock()) as auto:
        hass.states.async_set("sensor.p1", "10")
        await hass.async_block_till_done()
        auto.assert_not_awaited()
        hass.states.async_set("sensor.p2", "10")
        await hass.async_block_till_done()
        auto.assert_awaited_once()


async def test_an_all_task_that_never_triggered_does_not_auto_complete(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.p1", "40")
    hass.states.async_set("sensor.p2", "10")
    entry = await _setup(hass, {TASK: _threshold_task("sensor.p1", "sensor.p2", entity_logic="all", auto_complete_on_recovery=True)})
    await hass.async_block_till_done()
    coordinator = _coordinator(hass, entry)
    with patch.object(coordinator, "async_auto_complete_on_recovery", AsyncMock()) as auto:
        hass.states.async_set("sensor.p1", "10")
        await hass.async_block_till_done()
        auto.assert_not_awaited()


# ─── SCH-10: a restart restores, it does not re-announce ─────────────────


async def test_a_restart_does_not_re_announce_a_standing_trigger(hass: HomeAssistant) -> None:
    """A threshold task still over its limit wrote a new TRIGGERED history
    entry and fired the activation event again on every restart and every
    task edit (entry reload); the state-change latch only repainted."""
    hass.states.async_set("sensor.pressure", "45")
    activations = _capture(hass, EVENT_TRIGGER_ACTIVATED)
    entry = await _setup(hass, {TASK: _threshold_task("sensor.pressure")})
    await hass.async_block_till_done()
    assert _history_types(hass, entry).count(HistoryEntryType.TRIGGERED) == 1
    assert len(activations) == 1

    await simulate_restart(hass, entry)
    await hass.async_block_till_done()
    assert _history_types(hass, entry).count(HistoryEntryType.TRIGGERED) == 1
    assert len(activations) == 1
    assert _coordinator(hass, entry).data[CONF_TASKS][TASK]["_trigger_active"] is True, "restored, not dropped"

    # After a completion the standing value IS news again.
    await _coordinator(hass, entry).complete_maintenance(TASK, notes="done")
    await simulate_restart(hass, entry)
    await hass.async_block_till_done()
    assert _history_types(hass, entry).count(HistoryEntryType.TRIGGERED) == 2


# ─── SCH-11: a completion time from another zone is a local day ──────────


async def test_a_completion_time_with_a_foreign_offset_records_the_local_day(hass: HomeAssistant) -> None:
    """``completed_at`` with a UTC offset recorded the UTC day: 03:30 UTC is
    the previous evening in Home Assistant's time zone."""
    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK, last_performed=_iso_days_ago(60))})
    moment = (dt_util.utcnow() - timedelta(days=5)).replace(hour=3, minute=30, second=0, microsecond=0)
    local_day = dt_util.as_local(moment).date()
    assert local_day != moment.date(), "the test zone (US/Pacific) puts 03:30 UTC on the previous day"
    await _coordinator(hass, entry).complete_maintenance(TASK, notes="late", completed_at=moment)
    assert _coordinator(hass, entry)._get_merged_tasks_data()[TASK]["last_performed"] == local_day.isoformat()


# ─── SCH-12: Workday "exclude nothing" ───────────────────────────────────


def test_an_empty_workday_exclude_list_counts_holidays_as_working_days(monkeypatch: pytest.MonkeyPatch) -> None:
    """``excludes: []`` was read as the default (sat/sun/holiday) through an
    ``or`` fallback, so holidays were skipped although the user excluded
    nothing."""
    import sys
    from types import ModuleType

    from custom_components.maintenance_supporter.helpers.workday import build_provider_from_workday_options

    holiday = date(2027, 12, 24)  # a Friday
    mod = ModuleType("holidays")
    mod.country_holidays = lambda country, subdiv=None: {holiday: "Christmas Eve"}  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "holidays", mod)

    explicit = build_provider_from_workday_options({"country": "DE", "workdays": ["mon", "tue", "wed", "thu", "fri"], "excludes": []})
    default = build_provider_from_workday_options({"country": "DE", "workdays": ["mon", "tue", "wed", "thu", "fri"]})
    assert explicit is not None and explicit(holiday) is True
    assert default is not None and default(holiday) is False


# ─── SEC-6: documents under concurrency ──────────────────────────────────


@pytest.mark.usefixtures("isolated_docs_dir")
async def test_two_writers_never_share_a_temp_file(hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch) -> None:
    """Two uploads of the same content shared "<digest>.tmp"; the second
    os.replace found it already moved away and the upload failed with a 500."""
    import os

    from custom_components.maintenance_supporter.helpers import documents as docmod
    from custom_components.maintenance_supporter.helpers.documents import DocumentStore

    store = DocumentStore(hass)
    await store.async_load()
    sources: list[str] = []
    real_replace = os.replace

    def spy(src: Any, dst: Any) -> None:
        sources.append(str(src))
        real_replace(src, dst)

    monkeypatch.setattr(docmod.os, "replace", spy)
    digest, _ = store._store_blob_sync(b"same bytes")
    store.blob_path(digest).unlink()
    store._store_blob_sync(b"same bytes")
    assert len(sources) == 2 and sources[0] != sources[1]
    assert not [p for p in store._blobs_dir.iterdir() if p.name.endswith(".tmp")]


@pytest.mark.usefixtures("isolated_docs_dir")
async def test_an_upload_racing_the_last_delete_keeps_its_file(hass: HomeAssistant) -> None:
    """An upload of content whose last document was being deleted at the
    same moment registered the blob while the delete removed the file — a
    document pointing at nothing."""
    from custom_components.maintenance_supporter.helpers.documents import DocumentStore

    store = DocumentStore(hass)
    await store.async_load()
    for _ in range(5):
        old = await store.async_add_file("obj", content=b"manual", filename="m.pdf", mime="application/pdf")
        _, new = await asyncio.gather(
            store.async_remove(old["id"]),
            store.async_add_file("obj", content=b"manual", filename="m.pdf", mime="application/pdf"),
        )
        assert store.blob_path(new["hash"]).exists()
        assert store.blobs[new["hash"]]["refcount"] == 1
        await store.async_remove(new["id"])


# ─── SEC-7: forged completion events ─────────────────────────────────────


async def test_a_completion_event_from_outside_runs_no_action(hass: HomeAssistant) -> None:
    """The completed event can be fired through the REST/WebSocket API or a
    mobile_app webhook; a forged payload ran the task's configured service
    call without any completion."""
    calls = async_mock_service(hass, "light", "turn_on")
    task = build_task_data(task_id=TASK)
    task["on_complete_action"] = {"service": "light.turn_on", "target": {"entity_id": "light.porch"}}
    entry = await _setup(hass, {TASK: task})
    payload = {"entry_id": entry.entry_id, "task_id": TASK}

    hass.bus.async_fire(EVENT_TASK_COMPLETED, payload, origin=EventOrigin.remote)
    await hass.async_block_till_done()
    assert calls == []

    hass.bus.async_fire(EVENT_TASK_COMPLETED, payload)
    await hass.async_block_till_done()
    assert len(calls) == 1


# ─── SEC-10: deleting an object forgets its documents everywhere ─────────


@pytest.mark.usefixtures("isolated_docs_dir")
async def test_deleting_an_object_leaves_no_dangling_document_links(hass: HomeAssistant) -> None:
    """An object delete removed its documents but left other objects'
    references — a moved task's completion photo, a spare part's manual —
    pointing at nothing; a shared pool's manual went down with its owner."""
    g = make_global_entry(hass, minor_version=4)
    shelf_obj = {**build_object_data(name="Shelf", object_id="shelf"), "created_at": "2026-01-01"}
    vac_obj = {**build_object_data(name="Vacuum", object_id="vacuum"), "created_at": "2026-02-01"}
    part = {"id": "bags", "name": "Dust bags", "unit": "pcs", "reorder_threshold": 2, "restock_quantity": 6, "auto_buy_task": False}
    shelf = make_object_entry(hass, tasks={TASK: build_task_data(task_id=TASK)}, name="Shelf", uid="shelf", object_data=shelf_obj, minor_version=4, extra_data={CONF_PARTS: {"bags": part}})
    vac_task = build_task_data(task_id=TASK_2)
    vac_task[CONF_TASK_CONSUMES_PARTS] = [{"entry_id": shelf.entry_id, "part_id": "bags", "quantity": 1}]
    vacuum = make_object_entry(
        hass, tasks={TASK_2: vac_task}, name="Vacuum", uid="vacuum", object_data=vac_obj, minor_version=4,
        extra_data={CONF_PARTS: {"filter": {**part, "id": "filter", "name": "Filter"}}},
    )
    await setup_integration(hass, g, shelf, vacuum)
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    manual = await docs.async_add_file("shelf", content=b"bag manual", filename="bags.pdf", mime="application/pdf")
    photo = await docs.async_add_file("shelf", content=b"photo", filename="p.jpg", mime="image/jpeg")
    hass.config_entries.async_update_entry(shelf, data={**shelf.data, CONF_PARTS: {"bags": {**part, "doc_id": manual["id"]}}})
    # The vacuum's own part points at the shelf's photo; its history too (a moved task).
    vac_parts = dict(vacuum.data[CONF_PARTS])
    vac_parts["filter"] = {**vac_parts["filter"], "doc_id": photo["id"]}
    hass.config_entries.async_update_entry(vacuum, data={**vacuum.data, CONF_PARTS: vac_parts})
    vac_store = hass.data[STORES_CACHE_KEY][vacuum.entry_id]
    vac_store.set_history(TASK_2, [{"type": "completed", "timestamp": "2026-09-01T10:00:00+00:00", "photo_doc_ids": [photo["id"]]}])
    await vac_store.async_save()

    await hass.config_entries.async_remove(shelf.entry_id)
    await hass.async_block_till_done()

    survivor = hass.config_entries.async_get_entry(vacuum.entry_id)
    assert survivor.data[CONF_PARTS]["bags"]["doc_id"] == manual["id"], "the pool keeps its manual"
    assert docs.get(manual["id"])["object_id"] == "vacuum", "re-homed with the pool"
    assert docs.get(photo["id"]) is None
    assert "doc_id" not in survivor.data[CONF_PARTS]["filter"] or survivor.data[CONF_PARTS]["filter"]["doc_id"] is None
    assert all(photo["id"] not in (h.get("photo_doc_ids") or []) for h in vac_store.get_history(TASK_2))


# ─── SEC-11: diagnostics redact what identifies ──────────────────────────


async def test_diagnostics_redact_object_name_members_and_action_payloads(hass: HomeAssistant) -> None:
    """The object's name went out as the entry title (and slug unique id),
    member_display overrides and the free-form data of a completion action
    were not redacted."""
    from custom_components.maintenance_supporter.diagnostics import async_get_config_entry_diagnostics

    task = build_task_data(task_id=TASK)
    task["on_complete_action"] = {
        "service": "notify.mobile_app_phone",
        "data": {"message": "Call Anna at +49 170 1234567"},
        "configured_by": "user-uuid-secret",
    }
    entry = await _setup(hass, {TASK: task}, name="Anna's Aquarium", uid="obj_4711", global_extra={"member_display": {"user-uuid-2": {"initials": "AB"}}})
    diag = await async_get_config_entry_diagnostics(hass, entry)
    text = str(diag)
    assert "Anna" not in text and str(entry.unique_id) not in text
    assert "1234567" not in text and "user-uuid-secret" not in text
    assert diag["data"][CONF_TASKS][TASK]["on_complete_action"]["service"] == "notify.mobile_app_phone", "the service stays for debugging"

    g = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.entry_id != entry.entry_id)
    gdiag = await async_get_config_entry_diagnostics(hass, g)
    assert "user-uuid-2" not in str(gdiag)
    assert gdiag["data"]["member_display"] == "**REDACTED**"
    assert gdiag["entry"]["title"] == "Maintenance Supporter"

