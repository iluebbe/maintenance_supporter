"""GitHub round 2026-11-19: #286, #280, D#282, D#283, D#275, D#277, #273, D#284."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_QUIET_HOURS_WEEKEND_DAYS,
    CONF_QUIET_HOURS_WEEKEND_ENABLED,
    CONF_QUIET_HOURS_WEEKEND_END,
    CONF_QUIET_HOURS_WEEKEND_START,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.battery_fleet import read_batteries
from custom_components.maintenance_supporter.helpers.notification_manager import (
    DUE_TODAY,
    NotificationManager,
    _bundled_line,
    reminder_kind,
)
from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry

# ─── #286: Garmin's "Body Battery" is not a battery ─────────────────────────


async def test_garmin_body_battery_stays_out_of_the_fleet(hass: HomeAssistant) -> None:
    """garmin_connect describes its Body Battery sensors with a % unit and no
    device class, so the name heuristic took all of them for battery levels."""
    garmin = (
        "sensor.body_battery_most_recent",
        "sensor.body_battery_highest",
        "sensor.body_battery_lowest",
        "sensor.body_battery_charged",
        "sensor.body_battery_drained",
        "sensor.sleep_body_battery_change",
        "sensor.yesterday_body_battery_highest",
        "sensor.jane_body_battery",  # has_entity_name with a device in front
    )
    for eid in garmin:
        hass.states.async_set(eid, "57", {"unit_of_measurement": "%", "state_class": "measurement"})
    # A real level without a device class, as Zigbee2MQTT and ESPHome send it.
    hass.states.async_set("sensor.hallway_remote_battery", "64", {"unit_of_measurement": "%"})
    assert {b.entity_id for b in read_batteries(hass)} == {"sensor.hallway_remote_battery"}


async def test_a_body_battery_with_the_battery_class_still_counts(hass: HomeAssistant) -> None:
    """The exclusion is part of the name heuristic only: a sensor its
    integration declares a battery stays one, whatever its name."""
    hass.states.async_set("sensor.body_battery_pack", "40", {"unit_of_measurement": "%", "device_class": "battery"})
    assert [b.entity_id for b in read_batteries(hass)] == ["sensor.body_battery_pack"]


# ─── #280 / D#283: the due date has a reminder of its own ───────────────────


def _days_ago(days: int) -> str:
    return (dt_util.now().date() - timedelta(days=days)).isoformat()


def test_a_zero_warning_is_due_soon_on_the_due_date_and_late_the_day_after() -> None:
    """#280 read the status ladder as overdue from midnight on the due date.
    Without a time of day the due date is due soon all day."""
    due_today = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=0, last_performed=_days_ago(30)))
    assert (due_today.days_until_due, due_today.status) == (0, MaintenanceStatus.DUE_SOON)
    late = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=0, last_performed=_days_ago(31)))
    assert late.status == MaintenanceStatus.OVERDUE
    tomorrow = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=0, last_performed=_days_ago(29)))
    assert tomorrow.status == MaintenanceStatus.OK


def test_the_reminder_kind_of_the_due_date() -> None:
    assert reminder_kind(MaintenanceStatus.DUE_SOON, 0) == DUE_TODAY
    assert reminder_kind(MaintenanceStatus.DUE_SOON, 1) == MaintenanceStatus.DUE_SOON
    assert reminder_kind(MaintenanceStatus.OVERDUE, 0) == MaintenanceStatus.OVERDUE, "a time of day passed"
    assert reminder_kind(MaintenanceStatus.TRIGGERED, 0) == MaintenanceStatus.TRIGGERED
    assert _bundled_line(MaintenanceStatus.DUE_SOON, "en", "Bins", None, 0) == "Bins (due today)"
    assert _bundled_line(MaintenanceStatus.DUE_SOON, "de", "Bins", None, 0) == "Bins (heute fällig)"
    assert _bundled_line(MaintenanceStatus.DUE_SOON, "en", "Bins", None, 2) == "Bins (due soon)"


def _notify_setup(hass: HomeAssistant, texts: dict[str, Any] | None = None, last: str | None = None, **options: Any) -> tuple[MockConfigEntry, AsyncMock]:
    make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_QUIET_HOURS_ENABLED: False, **options})
    task = build_task_data(task_id=TASK_ID_1, name="Bins", last_performed=last)
    if texts is not None:
        task["notification_texts"] = texts
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Kitchen", unique_id="ms_round_1119")
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    return obj, calls


async def _remind(hass: HomeAssistant, mgr: NotificationManager, obj: MockConfigEntry, status: str, days: int | None) -> None:
    await mgr.async_task_status_changed(
        entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Bins", object_name="Kitchen", new_status=status, days_until_due=days, next_due="2026-11-20"
    )
    await hass.async_block_till_done()


def _sent(calls: AsyncMock) -> list[tuple[str, str]]:
    return [(c[0][0].data["title"], c[0][0].data["message"]) for c in calls.call_args_list]


async def test_the_due_date_says_due_today(hass: HomeAssistant) -> None:
    obj, calls = _notify_setup(hass)
    await _remind(hass, NotificationManager(hass), obj, MaintenanceStatus.DUE_SOON, 0)
    assert _sent(calls) == [("Maintenance Due Today", "Bins for Kitchen is due today.")], "not 'due in 0 day(s)'"


async def test_the_due_date_is_reminded_of_once_whatever_the_interval(hass: HomeAssistant) -> None:
    """D#283: with "notify once" (or every three days) the due date passed
    without a word; now it gets one reminder, and only one."""
    obj, calls = _notify_setup(hass, **{CONF_NOTIFY_DUE_SOON_INTERVAL: 0})
    mgr = NotificationManager(hass)
    await _remind(hass, mgr, obj, MaintenanceStatus.DUE_SOON, 3)
    await _remind(hass, mgr, obj, MaintenanceStatus.DUE_SOON, 2)
    assert len(calls.call_args_list) == 1, "notify once"
    await _remind(hass, mgr, obj, MaintenanceStatus.DUE_SOON, 0)
    await _remind(hass, mgr, obj, MaintenanceStatus.DUE_SOON, 0)
    assert [title for title, _ in _sent(calls)] == ["Maintenance Due Soon", "Maintenance Due Today"]


async def test_a_lead_of_zero_days_and_the_due_today_reminder_ping_once(hass: HomeAssistant) -> None:
    """D#283: warning 0 plus a lead reminder of 0 days sent two pings on the
    due date. Whichever goes first, the other stays silent."""
    obj, calls = _notify_setup(hass)
    mgr = NotificationManager(hass)
    await _remind(hass, mgr, obj, MaintenanceStatus.DUE_SOON, 0)
    await mgr.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Bins", "Kitchen", days=0, next_due="2026-11-20")
    await hass.async_block_till_done()
    assert len(calls.call_args_list) == 1

    calls.reset_mock()
    mgr = NotificationManager(hass)
    await mgr.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Bins", "Kitchen", days=0, next_due="2026-11-20")
    await hass.async_block_till_done()
    await _remind(hass, mgr, obj, MaintenanceStatus.DUE_SOON, 0)
    assert _sent(calls) == [("Maintenance Due Today", "Bins for Kitchen is due today.")]


async def test_a_bundle_counts_as_the_due_today_reminder(hass: HomeAssistant) -> None:
    obj, calls = _notify_setup(hass)
    mgr = NotificationManager(hass)
    await mgr.async_send_bundled(
        obj.entry_id,
        "Kitchen",
        [
            {"task_id": TASK_ID_1, "task_name": "Bins", "status": "due_soon", "days_until_due": 0},
            {"task_id": "t2", "task_name": "Sink", "status": "overdue", "days_until_due": -2},
        ],
    )
    await hass.async_block_till_done()
    assert "Bins (due today)" in _sent(calls)[0][1]
    await _remind(hass, mgr, obj, MaintenanceStatus.DUE_SOON, 0)
    assert len(calls.call_args_list) == 1, "the bundle told it already"


async def test_the_due_today_mark_survives_a_restart(hass: HomeAssistant) -> None:
    obj, _calls = _notify_setup(hass)
    mgr = NotificationManager(hass)
    await _remind(hass, mgr, obj, MaintenanceStatus.DUE_SOON, 0)
    saved = mgr._snapshot()
    assert saved["due_today_sent"] == {f"{obj.entry_id}_{TASK_ID_1}": dt_util.now().date().isoformat()}
    again = NotificationManager(hass)
    again._store.async_load = AsyncMock(return_value=saved)  # type: ignore[method-assign]
    await again.async_load()
    assert not again.reminder_due(obj.entry_id, TASK_ID_1, MaintenanceStatus.DUE_SOON, 0)


async def test_the_due_date_has_its_own_text_or_takes_the_due_soon_one(hass: HomeAssistant) -> None:
    texts = {"due_today": {"title": "Bins today", "message": "Put the {task} out today, {days_since} days since."}}
    obj, calls = _notify_setup(hass, texts, last=_days_ago(7))
    await _remind(hass, NotificationManager(hass), obj, MaintenanceStatus.DUE_SOON, 0)
    assert _sent(calls) == [("Bins today", "Put the Bins out today, 7 days since.")]

    mgr = NotificationManager(hass)
    only_due_soon = {"notification_texts": {"due_soon": {"title": "Bins soon", "message": "{task} in {days} day(s)"}}}
    assert mgr._build_message(MaintenanceStatus.DUE_SOON, "en", "Bins", "Kitchen", 0, None, task=only_due_soon) == ("Bins soon", "Bins in 0 day(s)")
    assert mgr._build_message(MaintenanceStatus.DUE_SOON, "en", "Bins", "Kitchen", 2, None, task={"notification_texts": texts}) == (
        "Maintenance Due Soon",
        "Bins for Kitchen is due in 2 day(s) (Due: ?).",
    ), "a due-today text is for the due date only"


# ─── D#282: {days_since} ─────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("status", "days", "kind"),
    [(MaintenanceStatus.OVERDUE, -2, "overdue"), (MaintenanceStatus.DUE_SOON, 3, "due_soon"), (MaintenanceStatus.TRIGGERED, None, "triggered")],
)
def test_days_since_counts_from_the_last_time_it_was_done(hass: HomeAssistant, status: str, days: int | None, kind: str) -> None:
    """D#282: "It's been 8 days since you watered the plants" on a 6-day
    task: {days} counts the days late (2), {days_since} the days since."""
    mgr = NotificationManager(hass)
    task = {"last_performed": _days_ago(8), "notification_texts": {kind: {"message": "It's been {days_since} days ({days})"}}}
    _title, message = mgr._build_message(status, "en", "Plants", "Home", days, None, task=task)
    expected_days = {"overdue": "2", "due_soon": "3", "triggered": "{days}"}[kind]
    assert message == f"It's been 8 days ({expected_days})"


def test_days_since_of_a_task_never_done_reads_a_question_mark(hass: HomeAssistant) -> None:
    mgr = NotificationManager(hass)
    task: dict[str, Any] = {"notification_texts": {"overdue": {"message": "{days_since} days"}}}
    assert mgr._build_message(MaintenanceStatus.OVERDUE, "en", "Plants", "Home", -1, None, task=task)[1] == "? days"
    task["last_performed"] = "2026-13-45"
    assert mgr._build_message(MaintenanceStatus.OVERDUE, "en", "Plants", "Home", -1, None, task=task)[1] == "? days"


def test_a_completion_text_has_no_days_since() -> None:
    """On a completion the count is 0 by definition: the placeholder stays as written."""
    from custom_components.maintenance_supporter.helpers.notification_manager import fill_placeholders

    assert fill_placeholders("{days_since}", "completed", {"days_since": "4"}) == "{days_since}"


# ─── D#277: the weekend's own quiet hours ────────────────────────────────────


def _at(day: int, hour: int, minute: int = 0) -> datetime:
    """November 2026, the test instance's local time (built inside the test:
    at collection the time zone is not set yet). The 20th is a Friday."""
    return datetime(2026, 11, day, hour, minute, tzinfo=dt_util.get_default_time_zone())


@pytest.mark.parametrize(
    ("moment", "quiet"),
    [
        ((20, 21, 30), False),  # Friday evening, before the working days' 22:00
        ((20, 22, 30), True),  # Friday night: a working day's evening
        ((21, 9, 0), True),  # Saturday morning: the weekend sleeps until 10:00
        ((21, 10, 30), False),
        ((21, 22, 30), False),  # Saturday evening starts at 23:00
        ((21, 23, 30), True),
        ((22, 9, 30), True),  # Sunday morning
        ((22, 23, 15), True),  # Sunday night into Monday
        ((23, 7, 30), True),  # Monday morning: a working day again
        ((23, 8, 30), False),
    ],
)
async def test_weekend_quiet_hours(hass: HomeAssistant, freezer: Any, moment: tuple[int, int, int], quiet: bool) -> None:
    make_global_entry(
        hass,
        notifications_enabled=True,
        notify_service="notify.test",
        extra_data={
            CONF_QUIET_HOURS_ENABLED: True,
            CONF_QUIET_HOURS_START: "22:00",
            CONF_QUIET_HOURS_END: "08:00",
            CONF_QUIET_HOURS_WEEKEND_ENABLED: True,
            CONF_QUIET_HOURS_WEEKEND_START: "23:00",
            CONF_QUIET_HOURS_WEEKEND_END: "10:00",
            CONF_QUIET_HOURS_WEEKEND_DAYS: [5, 6],
        },
    )
    freezer.move_to(_at(*moment))
    assert NotificationManager(hass)._is_quiet_hours() is quiet


async def test_without_the_weekend_switch_every_day_is_the_same(hass: HomeAssistant, freezer: Any) -> None:
    make_global_entry(
        hass,
        notifications_enabled=True,
        notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: True, CONF_QUIET_HOURS_WEEKEND_END: "10:00", CONF_QUIET_HOURS_WEEKEND_DAYS: [5, 6]},
    )
    freezer.move_to(_at(21, 9, 0))
    assert NotificationManager(hass)._is_quiet_hours() is False, "the working days' 08:00"


async def test_other_weekend_days_and_the_period_a_morning_belongs_to(hass: HomeAssistant, freezer: Any) -> None:
    """Friday and Saturday as the weekend, as in much of the Middle East.
    The skip log keys a morning to the evening that started it."""
    make_global_entry(
        hass,
        notifications_enabled=True,
        notify_service="notify.test",
        extra_data={
            CONF_QUIET_HOURS_ENABLED: True,
            CONF_QUIET_HOURS_WEEKEND_ENABLED: True,
            CONF_QUIET_HOURS_WEEKEND_START: "23:30",
            CONF_QUIET_HOURS_WEEKEND_END: "11:00",
            CONF_QUIET_HOURS_WEEKEND_DAYS: [4, 5],
        },
    )
    mgr = NotificationManager(hass)
    freezer.move_to(_at(20, 10, 30))
    assert mgr._is_quiet_hours() is True, "Friday morning is the weekend's"
    assert mgr._quiet_period_id() == "2026-11-19T22:00", "it started on Thursday evening"
    freezer.move_to(_at(22, 10, 30))
    assert mgr._is_quiet_hours() is False, "Sunday is a working day"
    freezer.move_to(_at(21, 23, 45))
    assert mgr._quiet_period_id() == "2026-11-21T23:30"


def test_the_weekend_days_are_cleaned() -> None:
    from custom_components.maintenance_supporter.helpers.settings_sanitize import sanitize_settings_input

    cleaned, _error = sanitize_settings_input(
        {CONF_QUIET_HOURS_WEEKEND_DAYS: [6, 5, 5, 9, -1, True, "6"], CONF_QUIET_HOURS_WEEKEND_START: "25:00", CONF_QUIET_HOURS_WEEKEND_END: "09:30"}
    )
    assert cleaned[CONF_QUIET_HOURS_WEEKEND_DAYS] == [5, 6]
    assert CONF_QUIET_HOURS_WEEKEND_START not in cleaned, "not a time"
    assert cleaned[CONF_QUIET_HOURS_WEEKEND_END] == "09:30"


# ─── #273: an object's own to-do lists, a person's own list ──────────────────


def test_which_lists_a_task_goes_to() -> None:
    from custom_components.maintenance_supporter.helpers.todo_mirror import list_person, mirror_lists

    people = {"jane": "todo.jane", "john": "todo.john"}
    plain: dict[str, Any] = {}
    assert mirror_lists(plain, ["todo.family"]) == ["todo.family"]
    assert mirror_lists(plain, ["todo.family"], ["todo.garden"]) == ["todo.garden"], "the object's lists come before the default"
    own = {"mirror_todo_entities": ["todo.service"]}
    assert mirror_lists(own, ["todo.family"], ["todo.garden"]) == ["todo.service"], "the task's own lists come first"
    assert mirror_lists({"mirror_todo_use_default": False}, ["todo.family"], ["todo.garden"], people) == []
    janes = {"responsible_user_id": "jane"}
    assert mirror_lists(janes, ["todo.family"], (), people) == ["todo.family", "todo.jane"], "and on the person's own list"
    shared = {"assignee_pool": ["jane", "john"]}
    assert mirror_lists(shared, (), (), people) == ["todo.jane", "todo.john"], "shared: on each person's list"
    assert mirror_lists({"responsible_user_id": "jane", "mirror_todo_entities": ["todo.jane"]}, (), (), people) == ["todo.jane"], "once"
    assert list_person(people, "todo.jane") == "jane"
    assert list_person(people, "todo.family") is None
    assert list_person({"jane": "todo.family", "john": "todo.family"}, "todo.family") is None, "a list two people share says nothing about who"


def test_the_people_lists_are_cleaned() -> None:
    from custom_components.maintenance_supporter.helpers.sanitize import sanitize_todo_person_lists

    assert sanitize_todo_person_lists({" jane ": " todo.jane ", "john": "", "bob": "light.kitchen", 4: "todo.x", "amy": 7}) == {"jane": "todo.jane"}
    assert sanitize_todo_person_lists(["todo.jane"]) == {}


async def _todo_lists(hass: HomeAssistant, *names: str) -> list[Any]:
    from homeassistant.components.todo import DOMAIN as TODO_DOMAIN
    from homeassistant.setup import async_setup_component
    from pytest_homeassistant_custom_component.common import setup_test_component_platform

    from .test_todo_mirror import ListEntity

    lists = [ListEntity(name) for name in names]
    setup_test_component_platform(hass, TODO_DOMAIN, lists)
    assert await async_setup_component(hass, TODO_DOMAIN, {TODO_DOMAIN: {"platform": "test"}})
    await hass.async_block_till_done()
    return lists


async def _checked_off(hass: HomeAssistant, entry: Any) -> list[dict[str, Any]]:
    """Run the list check until the tick is booked: under load the debounced
    check of the list change may already be running, and a second call then
    returns at once (it only asks for another pass)."""
    from custom_components.maintenance_supporter.const import DOMAIN
    from custom_components.maintenance_supporter.helpers.todo_mirror import TODO_MIRROR_KEY

    mirror = hass.data[DOMAIN][TODO_MIRROR_KEY]
    done: list[dict[str, Any]] = []
    for _ in range(20):
        await mirror.async_check_lists()
        await hass.async_block_till_done()
        done = [h for h in entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]["history"] if h["type"] == "completed"]
        if done:
            break
        await asyncio.sleep(0.1)
    return done


async def test_the_object_lists_and_a_tick_on_a_persons_list(hass: HomeAssistant) -> None:
    """#273: an object names the lists for all its tasks, and a tick on
    Jane's own list completes the task as Jane."""
    from custom_components.maintenance_supporter.const import CONF_TODO_PERSON_LISTS, DOMAIN
    from custom_components.maintenance_supporter.helpers.todo_mirror import MIRROR_STATE_KEY, TODO_MIRROR_KEY

    from .conftest import build_object_data, setup_integration

    garden, jane = await _todo_lists(hass, "Garden", "Jane")
    # A real Home Assistant user: setup clears assignments of unknown ones.
    jane_id = (await hass.auth.async_create_user("Jane")).id
    make_global_entry(hass, extra_data={CONF_TODO_PERSON_LISTS: {jane_id: "todo.jane"}})
    task = build_task_data(interval_days=30, warning_days=3, last_performed=_days_ago(60))
    task["responsible_user_id"] = jane_id
    obj = make_object_entry(
        hass, tasks={TASK_ID_1: task}, object_data={**build_object_data(name="Hedge"), "mirror_todo_entities": ["todo.garden"]}, uid="todo_273"
    )
    await setup_integration(hass, hass.config_entries.async_entries(DOMAIN)[0], obj)
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None
    assert garden.summaries() == ["Hedge: Filter Cleaning"]
    assert jane.summaries() == ["Hedge: Filter Cleaning"]

    record = entry.runtime_data.store.get_task_state(TASK_ID_1).get(MIRROR_STATE_KEY)
    jane.check_off(record["todo.jane"]["uid"])
    done = await _checked_off(hass, entry)
    assert done and done[-1].get("completed_by") == jane_id
    assert garden.summaries() == [] and jane.summaries() == []


async def test_a_tick_on_a_shared_list_names_nobody(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_TODO_PERSON_LISTS, DOMAIN
    from custom_components.maintenance_supporter.helpers.todo_mirror import MIRROR_STATE_KEY, TODO_MIRROR_KEY

    from .conftest import setup_integration

    (family,) = await _todo_lists(hass, "Family")
    make_global_entry(hass, extra_data={CONF_TODO_PERSON_LISTS: {"user-jane": "todo.jane"}})
    task = build_task_data(interval_days=30, warning_days=3, last_performed=_days_ago(60))
    task["mirror_todo_entities"] = ["todo.family"]
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, uid="todo_273b")
    await setup_integration(hass, hass.config_entries.async_entries(DOMAIN)[0], obj)
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None
    record = entry.runtime_data.store.get_task_state(TASK_ID_1).get(MIRROR_STATE_KEY)
    family.check_off(record["todo.family"]["uid"])
    done = await _checked_off(hass, entry)
    assert done and not done[-1].get("completed_by")


async def test_the_object_lists_are_written_checked_and_follow_a_rename(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_OBJECT, DOMAIN
    from custom_components.maintenance_supporter.helpers.entity_rename import rewrite_object
    from custom_components.maintenance_supporter.websocket.objects import ws_update_object

    from .conftest import call_ws_handler, make_ws_connection, setup_integration

    obj = make_object_entry(hass, tasks={}, uid="todo_273c")
    await setup_integration(hass, make_global_entry(hass), obj)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/object/update", "entry_id": obj.entry_id, "mirror_todo_entities": [" todo.garden ", "todo.garden", "light.x"]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None
    assert entry.data[CONF_OBJECT]["mirror_todo_entities"] == ["todo.garden"]
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_object, hass, conn, {"id": 2, "type": "maintenance_supporter/object/update", "entry_id": obj.entry_id, "mirror_todo_entities": []}
    )
    assert "mirror_todo_entities" not in entry.data[CONF_OBJECT], "an empty list clears the field"
    renamed, changed = rewrite_object({"mirror_todo_entities": ["todo.a", "todo.garden"]}, "todo.garden", "todo.yard")
    assert changed and renamed["mirror_todo_entities"] == ["todo.a", "todo.yard"]
    assert hass.config_entries.async_entries(DOMAIN)


# ─── D#284: a rotation by weekday, and whose turn comes next ─────────────────


def _rotating(strategy: str, **extra: Any) -> dict[str, Any]:
    task = build_task_data(interval_days=1, warning_days=0, last_performed=_days_ago(1))
    task.update({"assignee_pool": ["jane", "john"], "rotation_strategy": strategy, "responsible_user_id": "jane", **extra})
    return task


def test_by_weekday_the_due_dates_weekday_decides() -> None:
    from custom_components.maintenance_supporter.helpers.rotation_turns import current_assignee

    today = dt_util.now().date()
    days: list[str | None] = [None] * 7
    days[today.weekday()] = "john"
    task = _rotating("by_weekday", weekday_assignees=days)
    model = MaintenanceTask.from_dict(task)
    assert model.next_due == today
    assert model.responsible_user_id == "john", "the stored jane gives way to the weekday's person"
    assert current_assignee(task, today) == "john"
    tomorrow_is_nobodys = MaintenanceTask.from_dict({**task, "last_performed": today.isoformat()})
    assert tomorrow_is_nobodys.responsible_user_id is None, "nobody's day: everyone it is shared with"
    # Completing it hands it to the next due date's person.
    days[(today + timedelta(days=1)).weekday()] = "jane"
    model = MaintenanceTask.from_dict({**task, "weekday_assignees": days})
    model.complete(notes="done")
    assert model.responsible_user_id == "jane"


def test_the_weekdays_are_cleaned_with_the_people() -> None:
    from custom_components.maintenance_supporter.helpers.sanitize import normalize_people

    task: dict[str, Any] = {"assignee_pool": ["jane", "john"], "rotation_strategy": "by_weekday", "weekday_assignees": ["jane", "bob", 4, "john"]}
    normalize_people(task)
    assert task["weekday_assignees"] == ["jane", None, None, "john", None, None, None], "padded, strangers dropped"
    assert "responsible_user_id" not in task, "no seeded person: the weekday decides"
    other: dict[str, Any] = {"assignee_pool": ["jane", "john"], "rotation_strategy": "round_robin", "weekday_assignees": ["jane"] * 7}
    normalize_people(other)
    assert other["weekday_assignees"] == ["jane"] * 7, "kept under another rotation: switching back finds the days"
    alone: dict[str, Any] = {"assignee_pool": ["jane"], "rotation_strategy": "by_weekday", "weekday_assignees": ["jane"] * 7}
    normalize_people(alone)
    assert "weekday_assignees" not in alone and "rotation_strategy" not in alone, "no rotation, no days"


def test_the_coming_turns_of_each_rotation() -> None:
    from custom_components.maintenance_supporter.helpers.rotation_turns import upcoming_turns

    today = dt_util.now().date()
    days: list[str | None] = [None] * 7
    days[today.weekday()] = "john"
    days[(today + timedelta(days=1)).weekday()] = "jane"
    by_day = upcoming_turns(_rotating("by_weekday", weekday_assignees=days), today=today, count=3)
    assert [t["date"] for t in by_day] == [(today + timedelta(days=i)).isoformat() for i in range(3)]
    assert [t["user_id"] for t in by_day][:2] == ["john", "jane"]
    robin = upcoming_turns(_rotating("round_robin"), today=today, count=4)
    assert [t["user_id"] for t in robin] == ["jane", "john", "jane", "john"]
    history = [{"type": "completed", "completed_by": "john", "timestamp": "2026-01-01T00:00:00+00:00"}] * 2
    least = upcoming_turns(_rotating("least_completed", history=history), today=today, count=4)
    assert [t["user_id"] for t in least] == ["jane", "jane", "jane", "john"], "jane catches up first"
    assert len(upcoming_turns(_rotating("random"), today=today)) == 1, "a random one says only the current turn"
    assert upcoming_turns(build_task_data(), today=today) == []


def test_the_turns_go_on_until_everybody_has_five() -> None:
    """The calendar draws a task five times for one viewer. Under a person's
    filter those are that person's own dates, so the summary's turns reach
    that far: the calendar used to cut at five dates and then drop the other
    person's, which left someone with one weekday a single date."""
    from custom_components.maintenance_supporter.helpers.rotation_turns import MAX_TURNS, TURNS_PER_PERSON, UPCOMING_TURNS, upcoming_turns

    today = dt_util.now().date()

    def far(task: dict[str, Any]) -> list[dict[str, Any]]:
        return upcoming_turns(task, today=today, per_person=TURNS_PER_PERSON)

    # A daily task: john has one weekday (in three days), jane the other six.
    days: list[str | None] = ["jane"] * 7
    days[(today + timedelta(days=3)).weekday()] = "john"
    task = _rotating("by_weekday", weekday_assignees=days)
    assert len(upcoming_turns(task, today=today)) == UPCOMING_TURNS, "without the calendar's wish: the task page's six"
    turns = far(task)
    assert [t["date"] for t in turns] == [(today + timedelta(days=i)).isoformat() for i in range(len(turns))]
    assert [i for i, t in enumerate(turns) if t["user_id"] == "john"] == [3, 10, 17, 24, 31], "it ends with his fifth day"
    # Taking turns: five each.
    assert [t["user_id"] for t in far(_rotating("round_robin"))] == ["jane", "john"] * TURNS_PER_PERSON
    # A day nobody has is everybody's, so six dates are five for each already.
    assert len(far(_rotating("by_weekday", weekday_assignees=[None] * 7))) == UPCOMING_TURNS
    # Someone the dates never reach does not stretch the list ...
    assert len(far(_rotating("by_weekday", weekday_assignees=["jane"] * 7))) == UPCOMING_TURNS
    # ... and someone they reach late ends it at the limit: john did it 30
    # times more, so jane catches up first.
    history = [{"type": "completed", "completed_by": "john", "timestamp": "2026-01-01T00:00:00+00:00"}] * 30
    late = far(_rotating("least_completed", history=history))
    assert len(late) == MAX_TURNS
    assert 0 < [t["user_id"] for t in late].count("john") < TURNS_PER_PERSON
    assert len(far(_rotating("random"))) == 1, "a random one still says only the current turn"


async def test_the_task_summary_carries_the_turns(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import DOMAIN
    from custom_components.maintenance_supporter.websocket.objects import ws_get_object

    from .conftest import call_ws_handler, make_ws_connection, setup_integration

    jane = (await hass.auth.async_create_user("Jane")).id
    john = (await hass.auth.async_create_user("John")).id
    today = dt_util.now().date()
    days: list[str | None] = [jane] * 7
    days[today.weekday()] = john
    task = _rotating("by_weekday", weekday_assignees=days)
    task.update({"assignee_pool": [jane, john], "responsible_user_id": jane})
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, uid="turns_284")
    await setup_integration(hass, make_global_entry(hass), obj)
    conn = make_ws_connection()
    await call_ws_handler(ws_get_object, hass, conn, {"id": 1, "type": "maintenance_supporter/object", "entry_id": obj.entry_id})
    summary = next(t for t in conn.send_result.call_args[0][1]["tasks"] if t["id"] == TASK_ID_1)
    assert summary["responsible_user_id"] == john, "the weekday's person, not the stored one"
    assert summary["weekday_assignees"][today.weekday()] == john
    assert summary["upcoming_turns"][0] == {"date": today.isoformat(), "user_id": john}
    # Far enough for the calendar to show john (one weekday) five of his days.
    assert [t["user_id"] for t in summary["upcoming_turns"]].count(john) == 5
    assert hass.config_entries.async_entries(DOMAIN)


# ─── D#275: nothing happened for N days ──────────────────────────────────────

LATCH = "binary_sensor.shed_latch"


def _idle_host(hass: HomeAssistant) -> Any:
    from unittest.mock import MagicMock

    host = MagicMock()
    host.hass = hass
    host.entity_id = "sensor.shed_latch_check"
    host._task_id = "task1"
    host.async_update_trigger_state = MagicMock(return_value=True)
    coordinator = AsyncMock()
    coordinator.note_trigger_edge = MagicMock()
    host.coordinator = coordinator
    return host


def _idle(**extra: Any) -> dict[str, Any]:
    return {"type": "idle", "entity_id": LATCH, "entity_ids": [LATCH], "trigger_idle_days": 7, **extra}


def _verdict(host: Any) -> bool:
    return host.async_update_trigger_state.call_args.kwargs["is_triggered"]


async def test_no_change_for_a_week_makes_it_due_and_a_change_starts_over(hass: HomeAssistant, freezer: Any) -> None:
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    from custom_components.maintenance_supporter.entity.triggers import create_triggers

    start = dt_util.utcnow()
    hass.states.async_set(LATCH, "off")
    host = _idle_host(hass)
    (trigger,) = create_triggers(hass, host, _idle())
    await trigger.async_setup()
    assert not trigger._triggered
    # Unavailable in between is no change: the count runs on.
    freezer.move_to(start + timedelta(days=3))
    hass.states.async_set(LATCH, "unavailable")
    hass.states.async_set(LATCH, "off")
    await hass.async_block_till_done()
    assert not trigger._triggered
    freezer.move_to(start + timedelta(days=7, minutes=1))
    async_fire_time_changed(hass, start + timedelta(days=7, minutes=1))
    await hass.async_block_till_done()
    assert trigger._triggered and _verdict(host) is True, "the timer woke it up after a quiet week"
    assert trigger._current_value is not None and trigger._current_value >= 7
    hass.states.async_set(LATCH, "on")
    await hass.async_block_till_done()
    assert not trigger._triggered, "a change starts the count again"
    await trigger.async_teardown()


async def test_the_quiet_survives_a_restart(hass: HomeAssistant) -> None:
    """Home Assistant's last_changed starts over at every restart; ours not."""
    from custom_components.maintenance_supporter.entity.triggers import create_triggers

    hass.states.async_set(LATCH, "off")
    ten_days_ago = (dt_util.utcnow() - timedelta(days=10)).isoformat()
    (trigger,) = create_triggers(hass, _idle_host(hass), {**_idle(), "_trigger_state": {LATCH: {"idle_since": ten_days_ago}}})
    await trigger.async_setup()
    assert trigger._triggered
    trigger.reset()
    assert not trigger._triggered and trigger._since is not None, "a completion starts the count again"
    await trigger.async_teardown()


async def test_unavailable_for_days_is_its_own_kind(hass: HomeAssistant, freezer: Any) -> None:
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    from custom_components.maintenance_supporter.entity.triggers import create_triggers

    start = dt_util.utcnow()
    hass.states.async_set(LATCH, "on")
    host = _idle_host(hass)
    (trigger,) = create_triggers(hass, host, _idle(trigger_idle_days=2, trigger_idle_mode="unavailable"))
    await trigger.async_setup()
    assert not trigger._triggered and trigger._since is None, "there and unchanged is fine here"
    hass.states.async_set(LATCH, "unavailable")
    await hass.async_block_till_done()
    freezer.move_to(start + timedelta(days=2, minutes=1))
    async_fire_time_changed(hass, start + timedelta(days=2, minutes=1))
    await hass.async_block_till_done()
    assert trigger._triggered
    hass.states.async_set(LATCH, "on")
    await hass.async_block_till_done()
    assert not trigger._triggered and trigger._since is None, "back again"
    await trigger.async_teardown()


def test_the_idle_rule_is_validated(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_validation import _validate_trigger_config

    ok = {"type": "idle", "entity_id": LATCH, "trigger_idle_days": 14, "trigger_idle_mode": "no_change"}
    errors, _warnings = _validate_trigger_config(hass, ok)
    assert errors == [] and "trigger_idle_mode" not in ok, "no change is the default, stored as absence"
    errors, _ = _validate_trigger_config(hass, {"type": "idle", "entity_id": LATCH, "trigger_idle_days": 3, "trigger_idle_mode": "asleep"})
    assert errors
    errors, _ = _validate_trigger_config(hass, {"type": "idle", "entity_id": LATCH})
    assert errors, "the days are required"
    errors, _ = _validate_trigger_config(hass, {"type": "idle", "entity_id": LATCH, "trigger_idle_days": 0})
    assert errors, "at least a day"
