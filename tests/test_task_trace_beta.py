"""Task traces (2026-10 beta): what happened to a task, cycle by cycle.

The history keeps completions, skips, resets and trigger episodes. The trace
journal adds the rest, while the beta editor is on: status changes, reminders
sent and taken off the phones, snoozes, the "Done when" changes that did not
count (and why), and which settings an edit changed. ``task/trace`` hands the
panel the journal and the full history in one answer.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_BETA_EDITOR,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import task_key_of
from custom_components.maintenance_supporter.helpers.task_trace import (
    MAX_EVENTS,
    TASK_TRACE_KEY,
    TaskTrace,
    get_trace,
    record,
)
from custom_components.maintenance_supporter.websocket.tasks import ws_delete_task, ws_task_trace, ws_update_task

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

BETA_ON = {CONF_ADVANCED_BETA_EDITOR: True, CONF_QUIET_HOURS_ENABLED: False}
DOOR = "binary_sensor.washer_door"


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _events(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK_ID_1) -> list[dict[str, Any]]:
    trace = get_trace(hass)
    assert trace is not None
    return trace.events(entry.entry_id, task_id)


def _kinds(hass: HomeAssistant, entry: MockConfigEntry) -> list[str]:
    return [e["kind"] for e in _events(hass, entry)]


async def _setup(hass: HomeAssistant, task: dict[str, Any], *, beta: bool = True) -> MockConfigEntry:
    # Switched off explicitly: the new look is the default since 2026-11-01.
    g = make_global_entry(hass, extra_data=BETA_ON if beta else {CONF_ADVANCED_BETA_EDITOR: False, CONF_QUIET_HOURS_ENABLED: False})
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    return obj


def _overdue_task(**kw: Any) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    return build_task_data(interval_days=30, last_performed=last, **kw)


async def test_nothing_is_recorded_while_the_beta_is_off(hass: HomeAssistant) -> None:
    obj = await _setup(hass, _overdue_task(), beta=False)
    coordinator = _coordinator(hass, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]

    nm.snooze_task(obj.entry_id, TASK_ID_1)
    await coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()

    assert _events(hass, obj) == []


async def test_a_status_change_is_traced_but_not_the_first_status_seen(hass: HomeAssistant) -> None:
    obj = await _setup(hass, _overdue_task())
    coordinator = _coordinator(hass, obj)
    assert coordinator.data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.OVERDUE
    assert _kinds(hass, obj) == [], "the status at start-up is where the trace begins, no change"

    await coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()

    status = [e for e in _events(hass, obj) if e["kind"] == "status"]
    assert [(e["from"], e["to"]) for e in status] == [("overdue", "ok")]
    # A refresh without a change adds nothing.
    await coordinator.async_refresh()
    assert len([e for e in _events(hass, obj) if e["kind"] == "status"]) == 1


async def test_snooze_and_reminders_on_and_off_the_phones_are_traced(hass: HomeAssistant) -> None:
    obj = await _setup(hass, _overdue_task())
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]

    nm.snooze_task(obj.entry_id, TASK_ID_1)
    snoozed = _events(hass, obj)[-1]
    assert snoozed["kind"] == "snoozed"
    assert snoozed["hours"] > 0 and snoozed["until"]

    # A status reminder on the phones leaves when the status needs none.
    nm._on_phones[task_key_of(obj.entry_id, TASK_ID_1)] = "status"
    assert nm.take_outdated_off_phones(obj.entry_id, TASK_ID_1, inert=False)
    cleared = _events(hass, obj)[-1]
    assert (cleared["kind"], cleared["reason"]) == ("reminder_cleared", "status_left")

    # A paused task takes even a lead-time reminder off: traced as "inert".
    nm._on_phones[task_key_of(obj.entry_id, TASK_ID_1)] = "lead"
    assert nm.take_outdated_off_phones(obj.entry_id, TASK_ID_1, inert=True)
    assert _events(hass, obj)[-1]["reason"] == "inert"

    # A completion takes this cycle's reminder off: traced as "done".
    nm._on_phones[task_key_of(obj.entry_id, TASK_ID_1)] = "status"
    nm.clear_and_dismiss(obj.entry_id, TASK_ID_1, {})
    await hass.async_block_till_done()
    cleared = _events(hass, obj)[-1]
    assert (cleared["kind"], cleared["reason"]) == ("reminder_cleared", "done")


async def test_a_sent_status_reminder_is_traced(hass: HomeAssistant) -> None:
    async_mock_service(hass, "notify", "mobile_app_phone")
    set_sensor_state(hass, "sensor.moisture", "50")
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.mobile_app_phone", extra_data=BETA_ON)
    task = build_task_data(
        schedule_type="sensor_based",
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": "sensor.moisture", "entity_ids": ["sensor.moisture"], "trigger_below": 20},
    )
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)

    set_sensor_state(hass, "sensor.moisture", "10")
    await hass.async_block_till_done()
    await coordinator.async_refresh()

    events = _events(hass, obj)
    assert ("ok", "triggered") in [(e.get("from"), e.get("to")) for e in events if e["kind"] == "status"]
    sent = [e for e in events if e["kind"] == "reminder"]
    assert sent and (sent[-1]["reminder"], sent[-1]["status"]) == ("status", "triggered")


async def test_done_when_outside_the_due_window_is_traced_as_not_due(hass: HomeAssistant) -> None:
    set_sensor_state(hass, DOOR, "off")
    task = build_task_data(interval_days=30, last_performed=dt_util.now().date().isoformat())
    task["complete_when"] = {"entity_id": DOOR, "to_state": "on"}
    obj = await _setup(hass, task)

    set_sensor_state(hass, DOOR, "on", {"friendly_name": "Washer door"})
    await hass.async_block_till_done()

    done_when = [e for e in _events(hass, obj) if e["kind"] == "done_when"]
    assert done_when[-1]["result"] == "not_due"
    assert done_when[-1]["entity"] == "Washer door"
    assert done_when[-1]["state"] == "on"


async def test_done_when_on_a_due_task_counts_and_a_repeat_is_traced_as_recent(hass: HomeAssistant) -> None:
    set_sensor_state(hass, DOOR, "off")
    task = _overdue_task()
    task["complete_when"] = {"entity_id": DOOR, "to_state": "on", "any_time": True}
    obj = await _setup(hass, task)

    set_sensor_state(hass, DOOR, "on", {"friendly_name": "Washer door"})
    await hass.async_block_till_done()
    set_sensor_state(hass, DOOR, "off", {"friendly_name": "Washer door"})
    await hass.async_block_till_done()
    set_sensor_state(hass, DOOR, "on", {"friendly_name": "Washer door"})
    await hass.async_block_till_done()

    results = [e["result"] for e in _events(hass, obj) if e["kind"] == "done_when"]
    assert results[:2] == ["counted", "recent"]


async def test_a_held_done_when_traces_the_wait_and_the_early_leave(hass: HomeAssistant) -> None:
    set_sensor_state(hass, DOOR, "off")
    task = _overdue_task()
    task["complete_when"] = {"entity_id": DOOR, "to_state": "on", "for_minutes": 2}
    obj = await _setup(hass, task)

    set_sensor_state(hass, DOOR, "on", {"friendly_name": "Washer door"})
    await hass.async_block_till_done()
    set_sensor_state(hass, DOOR, "off", {"friendly_name": "Washer door"})
    await hass.async_block_till_done()

    done_when = [e for e in _events(hass, obj) if e["kind"] == "done_when"]
    assert [e["result"] for e in done_when] == ["waiting", "left_early"]
    assert done_when[0]["minutes"] == 2
    assert _coordinator(hass, obj).data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.OVERDUE


async def test_an_edit_traces_which_settings_changed(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/update", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "interval_days": 45},
    )
    await hass.async_block_till_done()
    edited = [e for e in _events(hass, obj) if e["kind"] == "edited"]
    assert edited and "interval_days" in edited[-1]["fields"]


async def test_task_trace_ws_returns_the_journal_and_the_full_history(hass: HomeAssistant) -> None:
    history = [{"timestamp": "2026-09-27T18:05:00+00:00", "type": "completed", "notes": "x"}]
    obj = await _setup(hass, build_task_data(interval_days=30, history=history))
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    nm.snooze_task(obj.entry_id, TASK_ID_1)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_task_trace, hass, conn, {"id": 1, "type": "maintenance_supporter/task/trace", "entry_id": obj.entry_id, "task_id": TASK_ID_1}
    )
    payload = conn.send_result.call_args[0][1]
    assert payload["enabled"] is True
    assert [e["kind"] for e in payload["events"]] == ["snoozed"]
    assert payload["history"][0]["type"] == "completed"


async def test_task_trace_ws_refuses_an_unknown_task(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    conn = make_ws_connection()
    await call_ws_handler(
        ws_task_trace, hass, conn, {"id": 1, "type": "maintenance_supporter/task/trace", "entry_id": obj.entry_id, "task_id": "nope"}
    )
    conn.send_result.assert_not_called()
    conn.send_error.assert_called_once()


async def test_a_deleted_task_and_a_removed_object_take_their_trace_with_them(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    nm.snooze_task(obj.entry_id, TASK_ID_1)
    assert _events(hass, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_task, hass, conn, {"id": 1, "type": "maintenance_supporter/task/delete", "entry_id": obj.entry_id, "task_id": TASK_ID_1}
    )
    await hass.async_block_till_done()
    assert _events(hass, obj) == []

    trace = get_trace(hass)
    assert trace is not None
    trace.add(obj.entry_id, "other", "snoozed", {})
    await hass.config_entries.async_remove(obj.entry_id)
    await hass.async_block_till_done()
    assert trace.events(obj.entry_id, "other") == []


async def test_the_journal_keeps_the_newest_events_per_task(hass: HomeAssistant) -> None:
    trace = TaskTrace(hass)
    for i in range(MAX_EVENTS + 5):
        trace.add("e", "t", "snoozed", {"n": i})
    events = trace.events("e", "t")
    assert len(events) == MAX_EVENTS
    assert events[0]["n"] == 5 and events[-1]["n"] == MAX_EVENTS + 4


async def test_the_journal_survives_a_restart_and_ignores_junk(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    hass_storage["maintenance_supporter.task_trace"] = {
        "version": 1,
        "key": "maintenance_supporter.task_trace",
        "data": {
            "events": {"e:t": [{"at": "2026-10-31T10:00:00+00:00", "kind": "snoozed"}, "junk"], 5: []},
            "statuses": {"e:t": "overdue", "e:u": 3},
        },
    }
    trace = TaskTrace(hass)
    await trace.async_load()
    assert [e["kind"] for e in trace.events("e", "t")] == ["snoozed"]
    # The stored status is the baseline: the same status adds nothing, a new one is a change.
    trace.observe_status("e", "t", "overdue")
    trace.observe_status("e", "t", "ok")
    assert [(e.get("from"), e.get("to")) for e in trace.events("e", "t")][-1] == ("overdue", "ok")
    trace.observe_status("e", "u", "ok")
    assert trace.events("e", "u") == []


async def test_recording_never_raises_into_the_caller(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    trace = hass.data[DOMAIN][TASK_TRACE_KEY]
    with patch.object(trace, "add", side_effect=RuntimeError("boom")):
        record(hass, obj.entry_id, TASK_ID_1, "snoozed")
        nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
        nm.snooze_task(obj.entry_id, TASK_ID_1)  # still works


async def test_a_template_creates_only_the_tasks_ticked_in_its_preview(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.io import ws_get_templates
    from custom_components.maintenance_supporter.websocket.objects import ws_create_from_template

    g = make_global_entry(hass, extra_data=BETA_ON)
    await setup_integration(hass, g)
    conn = make_ws_connection()
    await call_ws_handler(ws_get_templates, hass, conn, {"id": 1, "type": "maintenance_supporter/templates", "language": "en"})
    templates = conn.send_result.call_args[0][1]["templates"]
    tpl = next(t for t in templates if len(t["tasks"]) >= 3)
    names = [t["name"] for t in tpl["tasks"]]

    conn = make_ws_connection()
    msg = {"id": 2, "type": "maintenance_supporter/object/from_template", "template_id": tpl["id"], "language": "en", "task_names": names[:2]}
    await call_ws_handler(ws_create_from_template, hass, conn, msg)
    entry_id = conn.send_result.call_args[0][1]["entry_id"]
    await hass.async_block_till_done()
    created = sorted(t["name"] for t in hass.config_entries.async_get_entry(entry_id).data[CONF_TASKS].values())
    assert created == sorted(names[:2])

    # Names that are not the template's: refused, nothing created.
    conn = make_ws_connection()
    msg = {**msg, "id": 3, "task_names": ["Not a task of it"]}
    await call_ws_handler(ws_create_from_template, hass, conn, msg)
    conn.send_result.assert_not_called()
    assert conn.send_error.call_args[0][1] == "invalid_input"


@pytest.mark.parametrize(
    ("language", "country", "latitude"),
    [("en", "US", 40.7), ("de", "DE", 52.5), ("en", "SG", 1.35)],
)
async def test_every_template_lists_the_task_names_it_builds(
    hass: HomeAssistant, language: str, country: str, latitude: float
) -> None:
    """The beta preview ticks every task and sends their names: that creates
    what the classic card click creates only while the gallery lists, for
    every template, exactly the names the build makes (same language, the
    same winter / country / region filter)."""
    from custom_components.maintenance_supporter.templates import async_build_template_tasks, get_template_by_id
    from custom_components.maintenance_supporter.websocket.io import ws_get_templates

    hass.config.country = country
    hass.config.latitude = latitude
    g = make_global_entry(hass, extra_data=BETA_ON)
    await setup_integration(hass, g)
    conn = make_ws_connection()
    await call_ws_handler(ws_get_templates, hass, conn, {"id": 1, "type": "maintenance_supporter/templates", "language": language})
    listed = conn.send_result.call_args[0][1]["templates"]
    assert len(listed) > 50
    drift = []
    for tpl in listed:
        built = await async_build_template_tasks(hass, get_template_by_id(tpl["id"]), language, "obj")
        shown = sorted(t["name"] for t in tpl["tasks"])
        made = sorted(t["name"] for t in built.values())
        if shown != made:
            drift.append(f"{tpl['id']}: shown {shown} built {made}")
    assert not drift, "\n".join(drift)
