"""A task edit takes effect without reloading the object where it can.

Found live (2026-11-04): saving one task froze Home Assistant for a minute.
Something on that home blocked a second on every button state change, and
the reload behind every save took each of the object's 27 buttons to
unavailable and back. Now an edit of what every refresh reads (the schedule,
the notes, the people) is a refresh, a new sensor rule rebuilds that task's
triggers, and only an edit of the entities or a listener the setup wired (a
name, enabled, Done when) reloads.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, patch

from homeassistant.const import EVENT_STATE_CHANGED
from homeassistant.core import Event, HomeAssistant, callback
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_PARTS, CONF_TASKS, MaintenanceStatus
from custom_components.maintenance_supporter.helpers.task_apply import async_apply_task_edits, edited_fields, needs_reload
from custom_components.maintenance_supporter.helpers.task_persist import async_update_task_simple
from custom_components.maintenance_supporter.helpers.task_trace import get_trace
from custom_components.maintenance_supporter.websocket.tasks import ws_update_task

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

LEVEL = "sensor.salt_level"


async def _setup(hass: HomeAssistant, task: dict[str, Any]) -> MockConfigEntry:
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, make_global_entry(hass), obj)
    return obj


def _published(obj: MockConfigEntry) -> Any:
    return obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]


async def _update(hass: HomeAssistant, obj: MockConfigEntry, **fields: Any) -> tuple[list[str], list[str]]:
    """task/update with ``fields``; the reloads it ran and the button states
    it wrote."""
    reloads: list[str] = []
    buttons: list[str] = []
    original = hass.config_entries.async_reload

    async def counting(entry_id: str) -> bool:
        reloads.append(entry_id)
        return await original(entry_id)

    @callback
    def _changed(event: Event[Any]) -> None:
        if event.data["entity_id"].startswith("button."):
            buttons.append(event.data["entity_id"])

    unsub = hass.bus.async_listen(EVENT_STATE_CHANGED, _changed)
    conn = make_ws_connection()
    with patch.object(hass.config_entries, "async_reload", side_effect=counting):
        await call_ws_handler(
            ws_update_task,
            hass,
            conn,
            {"id": 1, "type": "maintenance_supporter/task/update", "entry_id": obj.entry_id, "task_id": TASK_ID_1, **fields},
        )
        await hass.async_block_till_done()
    unsub()
    assert not conn.send_error.called, conn.send_error.call_args
    return reloads, buttons


async def test_a_new_interval_is_a_refresh_and_no_button_flickers(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    reloads, buttons = await _update(hass, obj, interval_days=90, notes="Descale with citric acid", warning_days=10)
    assert reloads == []
    assert buttons == [], "no button went unavailable and back"
    task = _published(obj).task
    assert (task["warning_days"], task["notes"]) == (10, "Descale with citric acid")
    assert _published(obj).days_until_due is not None


async def test_a_new_name_still_reloads(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    reloads, _ = await _update(hass, obj, name="Descale the machine")
    assert reloads == [obj.entry_id], "the entities are named after the task"


async def test_a_new_sensor_rule_rebuilds_the_trigger_without_a_reload(hass: HomeAssistant) -> None:
    set_sensor_state(hass, LEVEL, "15")
    obj = await _setup(
        hass,
        build_task_data(
            schedule_type="sensor_based",
            interval_days=None,
            trigger_config={"type": "threshold", "entity_id": LEVEL, "entity_ids": [LEVEL], "trigger_below": 20},
        ),
    )
    assert _published(obj).status == MaintenanceStatus.TRIGGERED

    reloads, buttons = await _update(
        hass, obj, trigger_config={"type": "threshold", "entity_id": LEVEL, "entity_ids": [LEVEL], "trigger_below": 10}
    )
    assert reloads == [] and buttons == []
    assert _published(obj).status == MaintenanceStatus.OK, "the old latch went with the old rule"

    # The new rule watches the sensor: below 10 it fires, the old limit is gone.
    set_sensor_state(hass, LEVEL, "8")
    await hass.async_block_till_done()
    await obj.runtime_data.coordinator.async_refresh_now()
    assert _published(obj).status == MaintenanceStatus.TRIGGERED


#: What the task dialog sends on every save besides the edit (task-dialog
#: _savePayload): each list, and null for each rule it does not set.
DIALOG_EXTRAS: dict[str, Any] = {
    "labels": [],
    "consumes_parts": [],
    "required_completion_fields": [],
    "assignee_pool": [],
    "readings": [],
    "mirror_todo_entities": [],
    "phases": None,
    "phase_sequence": None,
    "rotation_strategy": None,
    "nfc_tag_id": None,
    "complete_when": None,
    "trigger_config": None,
}


async def test_the_first_save_from_the_dialog_is_a_refresh(hass: HomeAssistant) -> None:
    """Found live (2026-11-06): 133 of 163 tasks on one home had never stored
    consumes_parts. The dialog sends [] on every save, so the first save of
    each still reloaded its object and froze that home for 13 s."""
    task = build_task_data(interval_days=30)
    assert "consumes_parts" not in task and "labels" not in task
    obj = await _setup(hass, task)
    reloads, buttons = await _update(hass, obj, notes="Descale with citric acid", **DIALOG_EXTRAS)
    assert (reloads, buttons) == ([], [])
    assert _published(obj).task["notes"] == "Descale with citric acid"
    # The trace tells the edit, not the lists that went from nothing to [].
    events = [e for e in get_trace(hass).events(obj.entry_id, TASK_ID_1) if e["kind"] == "edited"]
    assert events and events[-1]["fields"] == ["notes"]


async def test_new_part_links_need_no_reload(hass: HomeAssistant) -> None:
    obj = make_object_entry(
        hass, tasks={TASK_ID_1: build_task_data(interval_days=30)}, extra_data={CONF_PARTS: {"filter": {"id": "filter", "name": "Filter"}}}
    )
    await setup_integration(hass, make_global_entry(hass), obj)
    reloads, buttons = await _update(hass, obj, consumes_parts=[{"part_id": "filter", "quantity": 2}])
    assert (reloads, buttons) == ([], [])
    assert obj.data[CONF_TASKS][TASK_ID_1]["consumes_parts"] == [{"part_id": "filter", "quantity": 2}]


async def test_a_save_without_a_change_reloads_nothing(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    reloads, buttons = await _update(hass, obj, interval_days=30)
    assert (reloads, buttons) == ([], [])


async def test_the_service_edit_takes_the_same_way(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    with patch.object(hass.config_entries, "async_reload", AsyncMock(return_value=True)) as reload:
        await async_update_task_simple(hass, entry_id=obj.entry_id, task_id=TASK_ID_1, updates={"notes": "Every quarter"})
        assert not reload.called
        await async_update_task_simple(hass, entry_id=obj.entry_id, task_id=TASK_ID_1, updates={"enabled": False})
        assert reload.called, "enabled decides whether the task's entities run"
    assert _published(obj).task["notes"] == "Every quarter"


async def test_a_rule_without_a_running_sensor_falls_back_to_the_reload(hass: HomeAssistant) -> None:
    obj = await _setup(hass, build_task_data(interval_days=30))
    coordinator = obj.runtime_data.coordinator
    with (
        patch.object(coordinator, "async_rebuild_triggers", AsyncMock(return_value=False)),
        patch.object(hass.config_entries, "async_reload", AsyncMock(return_value=True)) as reload,
    ):
        await async_apply_task_edits(hass, obj, {TASK_ID_1: {"trigger_config"}})
    reload.assert_awaited_once_with(obj.entry_id)


def test_which_edits_need_the_object_set_up_again() -> None:
    assert not needs_reload({"schedule", "notes", "warning_days", "responsible_user_id", "priority"})
    assert not needs_reload({"trigger_config"}), "rebuilt on the task's sensor"
    assert not needs_reload({"consumes_parts"}), "a completion reads the links, the setup wires none"
    for field in ("name", "entity_slug", "enabled", "complete_when", "mirror_todo_entities", "phases"):
        assert needs_reload({field}), field
    # Compared as stored: a flat interval is the nested schedule, runtime keys are no edit.
    before = build_task_data(interval_days=30)
    after = {**before, "interval_days": 60, "_trigger_state": {"x": 1}}
    assert edited_fields(before, after) == {"schedule"}
