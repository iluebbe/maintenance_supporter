"""DRY audit round 7 (2026-11-07): copies of one rule that behaved differently.

* BI7-A2: a template's new tasks were refused after its field changes were
  stored, as an unknown error; task/duplicate let the 200-task cap through
  the same way.
* BI7-A4 / BR7-A1: the template apply and the options flow's "Done" reloaded
  the object whatever they changed. A reload sets every entity up again, and
  on a home where each button write blocks for a second it froze Home
  Assistant (2026-11-04). A task's edits now take effect like the dialog's.
* BI7-A3 / BR7-A5: only the dialog's edits reached the task trace; a bulk
  edit, the update_task action, the options flow and the template apply
  recorded nothing.
* BR7-A2: a field the dialog sends as its default (priority "normal", no tag
  scan) read as an edit on a task's first save ("Priority: — → Normal").
* BR7-B4: a task delete and an object delete each kept their own copy of
  the cleanup (the trace forget had to be added to both), each with its own
  read and write of the vacation exempt list.
* BI7-B2: a task edit stored "no part links" as [], everything else as
  absence.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, CONF_VACATION_EXEMPT_TASK_IDS, DOMAIN
from custom_components.maintenance_supporter.helpers import task_apply, task_origin
from custom_components.maintenance_supporter.helpers.global_options import get_global_options
from custom_components.maintenance_supporter.helpers.task_apply import edited_fields
from custom_components.maintenance_supporter.helpers.task_trace import get_trace
from custom_components.maintenance_supporter.websocket.tasks import ws_duplicate_task, ws_update_task
from custom_components.maintenance_supporter.websocket.tasks_bulk import ws_update_many_tasks
from custom_components.maintenance_supporter.websocket.template_updates import ws_apply_template_updates

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)
# _home_north is a fixture: imported, pytest finds it here.
from .test_template_updates import _car, _home_north, _old_mowing


def _entry(hass: HomeAssistant, entry_id: str) -> Any:
    return hass.config_entries.async_get_entry(entry_id)


def _edits(hass: HomeAssistant, entry_id: str, task_id: str = TASK_ID_1) -> list[dict[str, Any]]:
    trace = get_trace(hass)
    assert trace is not None
    return [e for e in trace.events(entry_id, task_id) if e["kind"] == "edited"]


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return conn


def _error_code(conn: Any) -> str | None:
    return conn.send_error.call_args[0][1] if conn.send_error.called else None


async def _car_object(hass: HomeAssistant, **object_extra: Any) -> MockConfigEntry:
    g = make_global_entry(hass)
    data = _car("2026-08-01")
    obj = make_object_entry(
        hass,
        tasks=data[CONF_TASKS],
        name="Car",
        unique_id="ms_dry7_car",
        object_data={**data[CONF_OBJECT], "task_ids": list(data[CONF_TASKS]), **object_extra},
    )
    await setup_integration(hass, g, obj)
    return obj


def _apply(entry_id: str, **decisions: Any) -> dict[str, Any]:
    return {"type": "maintenance_supporter/template_updates/apply", "entry_id": entry_id, **decisions}


# ─── BI7-A2: refusals before anything is written ──────────────────────────


async def test_a_new_template_task_on_an_archived_object_is_refused_before_writing(hass: HomeAssistant, _home_north: None) -> None:
    obj = await _car_object(hass, archived_at="2026-11-01T10:00:00+00:00")
    before = _entry(hass, obj.entry_id).data
    conn = await _ws(
        hass,
        ws_apply_template_updates,
        _apply(obj.entry_id, new_tasks=[{"key": "Cabin Air Filter", "accept": True}, {"key": "Roadworthiness Test", "accept": False}]),
    )
    assert _error_code(conn) == "archived"
    assert conn.send_error.call_args.kwargs["translation_key"] == "archived_no_new_tasks"
    assert _entry(hass, obj.entry_id).data is before, "nothing written, not even the no"


async def test_new_template_tasks_past_the_cap_are_refused_before_writing(hass: HomeAssistant, _home_north: None) -> None:
    obj = await _car_object(hass)
    before = _entry(hass, obj.entry_id).data
    with patch("custom_components.maintenance_supporter.websocket.template_updates.MAX_TASKS_PER_OBJECT", 2):
        conn = await _ws(hass, ws_apply_template_updates, _apply(obj.entry_id, new_tasks=[{"key": "Cabin Air Filter", "accept": True}]))
    assert _error_code(conn) == "limit_reached"
    assert conn.send_error.call_args.kwargs["translation_key"] == "task_limit"
    assert _entry(hass, obj.entry_id).data is before


async def test_a_duplicate_past_the_cap_is_refused_in_words(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()})
    await setup_integration(hass, g, obj)
    with patch("custom_components.maintenance_supporter.helpers.entry_tasks.MAX_TASKS_PER_OBJECT", 1):
        conn = await _ws(hass, ws_duplicate_task, {"type": "maintenance_supporter/task/duplicate", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert _error_code(conn) == "limit_reached"
    assert conn.send_error.call_args.kwargs["translation_key"] == "task_limit"
    assert list(_entry(hass, obj.entry_id).data[CONF_TASKS]) == [TASK_ID_1]


# ─── BI7-A4: a template's field changes take effect without a reload ──────


async def _lawn(hass: HomeAssistant) -> MockConfigEntry:
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={"t1": _old_mowing()},
        name="Lawn",
        unique_id="ms_dry7_lawn",
        object_data={"id": "o1", "name": "Lawn", "template_id": "garden_lawn", "task_ids": ["t1"]},
    )
    await setup_integration(hass, g, obj)
    return obj


async def test_a_template_change_is_a_refresh_and_reaches_the_trace(hass: HomeAssistant, _home_north: None) -> None:
    obj = await _lawn(hass)
    with patch.object(hass.config_entries, "async_reload", wraps=hass.config_entries.async_reload) as reload:
        conn = await _ws(hass, ws_apply_template_updates, _apply(obj.entry_id, changes=[{"task_id": "t1", "field": "recurrence", "accept": True}]))
    assert not conn.send_error.called
    assert not reload.called, "a new schedule is a refresh"
    coordinator = _entry(hass, obj.entry_id).runtime_data.coordinator
    assert coordinator.entry.data[CONF_TASKS]["t1"]["schedule"]["season_months"] == [4, 5, 6, 7, 8, 9, 10]
    (edit,) = _edits(hass, obj.entry_id, "t1")
    assert edit["fields"] == ["schedule"], "the template's own bookkeeping (origin) is no edit to tell"


async def test_a_template_no_alone_changes_nothing_anyone_sees(hass: HomeAssistant, _home_north: None) -> None:
    obj = await _lawn(hass)
    with patch.object(hass.config_entries, "async_reload", wraps=hass.config_entries.async_reload) as reload:
        await _ws(hass, ws_apply_template_updates, _apply(obj.entry_id, changes=[{"task_id": "t1", "field": "recurrence", "accept": False}]))
    assert not reload.called
    assert _edits(hass, obj.entry_id, "t1") == []


async def test_a_new_template_task_still_sets_the_object_up(hass: HomeAssistant, _home_north: None) -> None:
    obj = await _car_object(hass)
    with patch.object(hass.config_entries, "async_reload", wraps=hass.config_entries.async_reload) as reload:
        await _ws(hass, ws_apply_template_updates, _apply(obj.entry_id, new_tasks=[{"key": "Cabin Air Filter", "accept": True}]))
    reload.assert_called_once_with(obj.entry_id)


# ─── BR7-A1: the options flow's Done ───────────────────────────────────────


async def _object(hass: HomeAssistant, **task: Any) -> MockConfigEntry:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: {**build_task_data(), **task}})
    await setup_integration(hass, g, obj)
    return obj


async def _edit_in_the_flow(hass: HomeAssistant, entry_id: str, fields: dict[str, Any]) -> str:
    r = await hass.config_entries.options.async_init(entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "manage_tasks"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"selected_task": TASK_ID_1})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "edit_task"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"name": "Filter Cleaning", "type": "cleaning", **fields})
    assert r["type"] == FlowResultType.MENU and r["step_id"] == "task_action"
    return str(r["flow_id"])


async def _done(hass: HomeAssistant, flow_id: str) -> None:
    r = await hass.config_entries.options.async_configure(flow_id, {"next_step_id": "manage_tasks"})
    r = await hass.config_entries.options.async_configure(flow_id, {"selected_task": TASK_ID_1, "go_back": True})
    r = await hass.config_entries.options.async_configure(flow_id, {"next_step_id": "done"})
    assert r["type"] == FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()


async def test_done_after_a_new_note_is_a_refresh_and_reaches_the_trace(hass: HomeAssistant) -> None:
    obj = await _object(hass)
    flow_id = await _edit_in_the_flow(hass, obj.entry_id, {"notes": "Use the soft brush."})
    with patch.object(hass.config_entries, "async_reload", wraps=hass.config_entries.async_reload) as reload, patch.object(
        hass.config_entries, "async_schedule_reload", wraps=hass.config_entries.async_schedule_reload
    ) as schedule:
        await _done(hass, flow_id)
    assert not reload.called and not schedule.called
    assert _entry(hass, obj.entry_id).data[CONF_TASKS][TASK_ID_1]["notes"] == "Use the soft brush."
    (edit,) = _edits(hass, obj.entry_id)
    assert edit["fields"] == ["notes"]


async def test_done_without_a_change_reloads_nothing(hass: HomeAssistant) -> None:
    obj = await _object(hass)
    r = await hass.config_entries.options.async_init(obj.entry_id)
    with patch.object(hass.config_entries, "async_reload") as reload, patch.object(hass.config_entries, "async_schedule_reload") as schedule:
        r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "done"})
        await hass.async_block_till_done()
    assert r["type"] == FlowResultType.CREATE_ENTRY
    assert not reload.called and not schedule.called


async def test_done_after_a_rename_sets_the_object_up(hass: HomeAssistant) -> None:
    obj = await _object(hass)
    flow_id = await _edit_in_the_flow(hass, obj.entry_id, {"name": "Clean the filter"})
    with patch.object(hass.config_entries, "async_schedule_reload") as schedule, patch.object(hass.config_entries, "async_reload") as reload:
        await _done(hass, flow_id)
    assert schedule.called or reload.called, "a new name renames the entities"


async def test_closing_the_flow_after_a_note_is_a_refresh_too(hass: HomeAssistant) -> None:
    obj = await _object(hass)
    flow_id = await _edit_in_the_flow(hass, obj.entry_id, {"notes": "Soft brush."})
    with patch.object(hass.config_entries, "async_schedule_reload") as schedule:
        hass.config_entries.options.async_abort(flow_id)
        await hass.async_block_till_done()
    assert not schedule.called
    assert [e["fields"] for e in _edits(hass, obj.entry_id)] == [["notes"]]


# ─── BI7-A3: every way of editing reaches the trace ────────────────────────


async def test_a_bulk_edit_reaches_the_trace(hass: HomeAssistant) -> None:
    obj = await _object(hass)
    conn = await _ws(
        hass,
        ws_update_many_tasks,
        {"type": "maintenance_supporter/tasks/update_many", "items": [{"entry_id": obj.entry_id, "task_id": TASK_ID_1}], "changes": {"priority": "high"}},
    )
    assert not conn.send_error.called
    (edit,) = _edits(hass, obj.entry_id)
    assert edit["fields"] == ["priority"]
    assert edit["changes"]["priority"] == ["normal", "high"], "the unstored priority reads as what it means"


async def test_the_update_task_action_reaches_the_trace(hass: HomeAssistant) -> None:
    obj = await _object(hass)
    await hass.services.async_call(DOMAIN, "update_task", {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "warning_days": 3}, blocking=True)
    await hass.async_block_till_done()
    (edit,) = _edits(hass, obj.entry_id)
    assert edit["fields"] == ["warning_days"]


def test_the_origin_is_the_one_task_origin_stores() -> None:
    assert task_apply.ORIGIN_KEY == task_origin.ORIGIN_KEY
    assert task_origin.ORIGIN_KEY in task_apply.LIVE_FIELDS


# ─── BR7-A2: what the dialog sends as a default is no edit ─────────────────


def test_a_field_sent_as_its_default_is_no_edit() -> None:
    stored = {"id": "t", "name": "Filter", "type": "cleaning", "schedule": {"kind": "interval", "every": 30}}
    sent = {**stored, "priority": "normal", "enabled": True, "allow_skip": True, "notify_enabled": True, "require_tag_scan": False}
    assert edited_fields(stored, sent) == set()
    assert edited_fields(stored, {**sent, "priority": "high"}) == {"priority"}
    assert edited_fields(stored, {**sent, "enabled": False}) == {"enabled"}


async def test_the_dialogs_first_save_traces_and_reloads_nothing(hass: HomeAssistant) -> None:
    obj = await _object(hass)
    task = _entry(hass, obj.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert "priority" not in task and "require_tag_scan" not in task
    with patch.object(hass.config_entries, "async_reload", wraps=hass.config_entries.async_reload) as reload:
        conn = await _ws(
            hass,
            ws_update_task,
            {
                "type": "maintenance_supporter/task/update",
                "entry_id": obj.entry_id,
                "task_id": TASK_ID_1,
                "priority": "normal",
                "require_tag_scan": False,
                "allow_skip": True,
                "notify_enabled": True,
                "enabled": True,
            },
        )
    assert not conn.send_error.called
    assert not reload.called, "nothing changed"
    assert _edits(hass, obj.entry_id) == []


# ─── BI7-B4: the language a request asks for, else Home Assistant's ───────


async def test_a_request_language_wins_over_home_assistants(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.i18n import request_language

    hass.config.language = "fr"
    assert request_language(hass, "pt-BR") == "pt-br"
    assert request_language(hass, "de") == "de"
    assert request_language(hass, None) == "fr"
    assert request_language(hass, "") == "fr"


# ─── BR7-B4: what a deleted task leaves behind, cleaned up in one place ───


async def test_an_object_delete_takes_its_tasks_off_the_exempt_list(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, extra_data={CONF_VACATION_EXEMPT_TASK_IDS: [TASK_ID_1, "other-task"]})
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()})
    await setup_integration(hass, g, obj)
    before = dict(get_global_options(hass))
    await hass.config_entries.async_remove(obj.entry_id)
    await hass.async_block_till_done()
    settings = get_global_options(hass)
    assert settings[CONF_VACATION_EXEMPT_TASK_IDS] == ["other-task"]
    assert {k: v for k, v in settings.items() if k != CONF_VACATION_EXEMPT_TASK_IDS} == {
        k: v for k, v in before.items() if k != CONF_VACATION_EXEMPT_TASK_IDS
    }, "every other setting stays"


async def test_a_task_delete_and_an_object_delete_clean_up_through_one_function(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers import task_persist

    g = make_global_entry(hass)
    one = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, name="One", uid="dry7_one")
    two = make_object_entry(hass, tasks={TASK_ID_2: build_task_data()}, name="Two", uid="dry7_two")
    await setup_integration(hass, g, one, two)
    real = task_persist.async_forget_tasks
    seen: list[tuple[str, list[str]]] = []

    async def spy(hass_: HomeAssistant, entry_id: str, store: Any, tasks: Any) -> None:
        seen.append((entry_id, sorted(tasks)))
        await real(hass_, entry_id, store, tasks)

    with patch.object(task_persist, "async_forget_tasks", spy), patch(
        "custom_components.maintenance_supporter.async_forget_tasks", spy
    ):
        assert await task_persist.async_delete_task(hass, _entry(hass, one.entry_id), TASK_ID_1)
        await hass.config_entries.async_remove(two.entry_id)
        await hass.async_block_till_done()
    assert seen == [(one.entry_id, [TASK_ID_1]), (two.entry_id, [TASK_ID_2])]


# ─── BR7-B2: a rule letting go of its task, announced in one place ────────


async def test_a_recovery_only_the_sweep_saw_ends_the_episode_and_announces_nothing(hass: HomeAssistant) -> None:
    """The live trigger announces a recovery and would do it again on its
    next reading; a reading only the sweep saw is no proof of the work."""
    from custom_components.maintenance_supporter.const import EVENT_TRIGGER_DEACTIVATED, ScheduleType

    hass.states.async_set("sensor.dry7_salt", "20")
    obj = await _object(
        hass,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.dry7_salt", "trigger_above": 30, "auto_complete_on_recovery": True},
    )
    coord = obj.runtime_data.coordinator
    task_obj = coord.tasks[TASK_ID_1]
    task_obj._trigger_active = True
    events: list[Any] = []
    hass.bus.async_listen(EVENT_TRIGGER_DEACTIVATED, events.append)
    with patch.object(coord, "async_auto_complete_on_recovery") as complete:
        await coord._evaluate_trigger_fallback(task_obj, TASK_ID_1)
        await hass.async_block_till_done()
    assert task_obj._trigger_active is False
    assert coord._store.get_task_state(TASK_ID_1).get("trigger_cleared_at"), "the episode is closed on record"
    assert events == [] and not complete.called
    trace = get_trace(hass)
    assert trace is not None and not [e for e in trace.events(obj.entry_id, TASK_ID_1) if e["kind"] == "trigger_cleared"]


def test_the_triggers_announce_a_recovery_in_one_place() -> None:
    """The single rule and the compound had a copy each of the event, the
    trace's step and the #53 opt-in."""
    import re

    from .test_trigger_surface_parity import COMPONENT

    hits = {
        path.name: len(re.findall(r"async_fire\(\s*EVENT_TRIGGER_DEACTIVATED|KIND_TRIGGER_CLEARED,|_coordinator\.async_auto_complete_on_recovery\(", path.read_text(encoding="utf-8")))
        for path in (COMPONENT / "entity" / "triggers").glob("*.py")
    }
    assert {name: n for name, n in hits.items() if n} == {"base_trigger.py": 3}, hits


def test_one_reading_of_hold_until_done() -> None:
    """BI6-B7: the WS kept the flag on a rule that cannot hold, the options
    flow dropped it, the sweep read it by type."""
    from custom_components.maintenance_supporter.helpers.completes_itself import holds_until_done

    hold = {"trigger_hold_until_done": True}
    assert holds_until_done({"type": "threshold", **hold})
    assert holds_until_done({"type": "due_date", **hold})
    assert holds_until_done({"type": "state_change", "trigger_to_state": "finished", **hold})
    assert not holds_until_done({"type": "state_change", "trigger_to_state": "finished", "trigger_target_changes": 3, **hold})
    assert not holds_until_done({"type": "counter", **hold})
    assert not holds_until_done({"type": "threshold"})
    assert not holds_until_done(None)


# ─── BR6-B7: the reminder's Complete button asks the choke point's gates ──


_TODAY = "2026-11-07"


@pytest.mark.parametrize(
    ("task", "refusal"),
    [
        ({}, None),
        ({"required_completion_fields": ["notes"]}, "completion_details_required"),
        ({"required_completion_fields": ["notes"], "quick_complete_defaults": {"notes": "Filter rinsed"}}, None),
        ({"require_tag_scan": True}, "tag_scan_required"),
        ({"enabled": False}, "task_inactive"),
        ({"last_performed": _TODAY, "interval_days": 30, "earliest_completion_days": 5}, "too_early"),
    ],
    ids=["plain", "details", "details_prefilled", "tag_scan", "disabled", "too_early"],
)
async def test_the_buttons_refusal_is_the_one_completing_raises(hass: HomeAssistant, task: dict[str, Any], refusal: str | None) -> None:
    from homeassistant.exceptions import ServiceValidationError

    obj = await _object(hass, **task)
    coord = obj.runtime_data.coordinator
    predicted = coord.unattended_refusal(TASK_ID_1, source="notification_action")
    raised = None
    try:
        await coord.complete_maintenance(task_id=TASK_ID_1, unattended=True, source="notification_action")
    except ServiceValidationError as err:
        raised = err.translation_key
    assert predicted == raised == refusal


# ─── BI6-B8..B12: the last write rules of round 6 ─────────────────────────


async def test_a_flat_recurrence_reads_as_the_services_read_it(hass: HomeAssistant) -> None:
    """BI6-B8: task/create took "time_based" without an interval and made a
    manual task of it; the services refused it, and read a missing type
    from the fields."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task

    obj = await _object(hass)

    async def create(**fields: Any) -> Any:
        # Through the command's schema: its defaults are part of the rule.
        msg = ws_create_task._ws_schema({"id": 1, "type": f"{DOMAIN}/task/create", "entry_id": obj.entry_id, "name": "Probe", **fields})  # type: ignore[attr-defined]
        msg.pop("id")
        return await _ws(hass, ws_create_task, msg)

    refused = await create(schedule_type="time_based")
    assert _error_code(refused) == "invalid_input"
    for fields, kind in (({"interval_days": 30}, "time_based"), ({"due_date": "2026-12-24"}, "one_time"), ({}, "manual")):
        conn = await create(**fields)
        assert not conn.send_error.called, conn.send_error.call_args
        task_id = conn.send_result.call_args[0][1]["task_id"]
        stored = _entry(hass, obj.entry_id).data[CONF_TASKS][task_id]
        from custom_components.maintenance_supporter.helpers.schedule import Schedule

        assert Schedule.parse(stored).kind == {"time_based": "interval"}.get(kind, kind), (fields, stored)


async def test_a_postpone_too_far_is_refused_by_the_one_rule(hass: HomeAssistant) -> None:
    """BI6-B10: the command and the coordinator each checked the limit."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    from custom_components.maintenance_supporter.const import MAX_INTERVAL_DAYS
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_postpone_task

    obj = await _object(hass)
    far = (dt_util.now().date() + timedelta(days=MAX_INTERVAL_DAYS + 1)).isoformat()
    conn = await _ws(hass, ws_postpone_task, {"type": f"{DOMAIN}/task/postpone", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "until": far})
    assert _error_code(conn) == "postpone_too_far"
    assert not obj.runtime_data.store.get_task_state(TASK_ID_1).get("due_override")


async def test_an_inactive_tasks_tag_is_no_duplicate(hass: HomeAssistant) -> None:
    """BI6-B11: a scan completes the active task with the tag, so a sticker
    can move on from a switched-off one; the panel warned and the options
    flow refused."""
    from custom_components.maintenance_supporter.helpers.aggregate import check_nfc_tag_duplicate

    g = make_global_entry(hass)
    obj = make_object_entry(
        hass, tasks={TASK_ID_1: {**build_task_data(), "nfc_tag_id": "tag-1"}, TASK_ID_2: {**build_task_data(name="Old"), "nfc_tag_id": "tag-2", "enabled": False}}
    )
    await setup_integration(hass, g, obj)
    assert check_nfc_tag_duplicate(hass, "tag-1")
    assert check_nfc_tag_duplicate(hass, "tag-2") is None, "the switched-off task hands its tag over"


async def test_nobody_responsible_is_absence(hass: HomeAssistant) -> None:
    """BI6-B12: task/assign_user stored "" where the services leave it out."""
    from custom_components.maintenance_supporter.websocket.users import ws_assign_user

    obj = await _object(hass, responsible_user_id="someone")
    conn = await _ws(hass, ws_assign_user, {"type": f"{DOMAIN}/task/assign_user", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "user_id": ""})
    assert not conn.send_error.called, conn.send_error.call_args
    assert "responsible_user_id" not in _entry(hass, obj.entry_id).data[CONF_TASKS][TASK_ID_1]


# ─── BI6-B3: a part service checks every part before it books any ─────────


async def _two_parts(hass: HomeAssistant, parts: dict[str, dict[str, Any]], stock: dict[str, float]) -> tuple[MockConfigEntry, dict[str, str]]:
    from custom_components.maintenance_supporter.const import CONF_PARTS

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, name="Shelf", uid="dry7_parts", extra_data={CONF_PARTS: parts}, minor_version=4)
    await setup_integration(hass, g, obj)
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock

    for part_id, count in stock.items():
        await async_change_part_stock(hass, obj, part_id, absolute=count)
    await hass.async_block_till_done()
    sensors = {s.attributes["part_name"]: s.entity_id for s in hass.states.async_all("sensor") if s.attributes.get("part_name")}
    return obj, sensors


async def test_dispose_books_nothing_when_one_part_is_not_reusable(hass: HomeAssistant) -> None:
    from homeassistant.exceptions import ServiceValidationError

    obj, sensors = await _two_parts(
        hass,
        {"p_cells": {"id": "p_cells", "name": "AAA Eneloop", "unit": "pcs", "reuse": "charge"}, "p_filter": {"id": "p_filter", "name": "Water filter", "unit": "pcs"}},
        {"p_cells": 2, "p_filter": 3},
    )
    store = obj.runtime_data.store
    store.set_part_restoring("p_cells", 2)
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "part_dispose", {"entity_id": [sensors["AAA Eneloop"], sensors["Water filter"]]}, blocking=True)
    assert err.value.translation_key == "part_not_reusable"
    assert store.get_part_restoring("p_cells") == 2, "the reusable one was not disposed of first"


async def test_a_purchase_books_nothing_when_one_part_is_refused(hass: HomeAssistant) -> None:
    from homeassistant.exceptions import ServiceValidationError

    from custom_components.maintenance_supporter.const import MAX_COST

    obj, sensors = await _two_parts(
        hass,
        {
            "p_salt": {"id": "p_salt", "name": "Salt", "unit": "kg", "restock_quantity": 1},
            "p_tabs": {"id": "p_tabs", "name": "Tabs", "unit": "pcs", "restock_quantity": 20},
        },
        {"p_salt": 0, "p_tabs": 0},
    )
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN, "part_purchase", {"entity_id": [sensors["Salt"], sensors["Tabs"]], "unit_price": MAX_COST / 10}, blocking=True
        )
    assert err.value.translation_key == "purchase_cost_too_high"
    assert obj.runtime_data.store.get_part_stock("p_salt") == 0, "the salt was not bought first"
    assert set(_entry(hass, obj.entry_id).data[CONF_TASKS]) == {TASK_ID_1}, "no buy reminder was made"


# ─── BI7-B3: a duplicated object keeps its template review ────────────────


async def test_a_duplicated_object_keeps_its_tasks_template_origin(hass: HomeAssistant) -> None:
    """The copy keeps the object's template. A task still named as the
    template names it got its origin back from the setup's backfill; a
    renamed one never does (nothing is guessed), and lost it for good. A
    duty's fingerprint (a sensor of the original's device) still goes, as on
    task/duplicate."""
    from custom_components.maintenance_supporter.helpers import template_updates as tu
    from custom_components.maintenance_supporter.helpers.task_origin import ORIGIN_KEY, problem_sensor_origin
    from custom_components.maintenance_supporter.websocket.objects import ws_duplicate_object

    from .test_template_updates import NORTH

    g = make_global_entry(hass)
    data = _car("2026-08-01")
    data[CONF_TASKS]["t0"]["name"] = "Motor oil, the way we do it"
    tasks = {**data[CONF_TASKS], "t9": {**build_task_data(name="Engine fault"), "id": "t9", ORIGIN_KEY: problem_sensor_origin("binary_sensor.car_fault")}}
    obj = make_object_entry(hass, tasks=tasks, name="Car", unique_id="ms_dry7_dup_car", object_data={**data[CONF_OBJECT], "task_ids": list(tasks)})
    await setup_integration(hass, g, obj)
    conn = await _ws(hass, ws_duplicate_object, {"type": f"{DOMAIN}/object/duplicate", "entry_id": obj.entry_id})
    copy = _entry(hass, conn.send_result.call_args[0][1]["entry_id"]).data
    origins = sorted((t.get(ORIGIN_KEY) or {}).get("task", "-") for t in copy[CONF_TASKS].values())
    assert origins == ["-", "Brake Fluid", "Oil Change"], "the template's tasks keep theirs, the duty's goes"
    by_key = {t[ORIGIN_KEY]["task"]: t[ORIGIN_KEY] for t in data[CONF_TASKS].values()}
    assert all(t[ORIGIN_KEY] == by_key[t[ORIGIN_KEY]["task"]] for t in copy[CONF_TASKS].values() if t.get(ORIGIN_KEY))
    assert [tt.key for tt in tu.new_tasks(copy, NORTH)] == [tt.key for tt in tu.new_tasks(_entry(hass, obj.entry_id).data, NORTH)], "the same review"


# ─── BI7-B2: no part links is absence ─────────────────────────────────────


async def test_an_edit_that_unlinks_every_part_stores_no_links_at_all(hass: HomeAssistant) -> None:
    obj = await _object(hass, consumes_parts=[{"part_id": "gone", "quantity": 1}])
    await _ws(hass, ws_update_task, {"type": f"{DOMAIN}/task/update", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "consumes_parts": []})
    assert "consumes_parts" not in _entry(hass, obj.entry_id).data[CONF_TASKS][TASK_ID_1], "as on create, in a phase and after a part's removal"
