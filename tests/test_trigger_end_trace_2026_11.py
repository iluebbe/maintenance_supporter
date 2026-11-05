"""A sensor rule's firing and its end, as the history and the trace tell them.

Found on a live update task (an update entity, a state rule off → on): the
history said "Trigger value: 1" twice (the change count), the install of the
update left nothing behind, and the trace kept one cycle "still running" from
July on. Now a state rule's firing records the transition it counted (with an
update entity's versions), and the rule letting go of the task by itself is a
trace event with the sensor's state or reading. Also: a save that changed
nothing on a task stored with an empty "Shared with" no longer reads as an
edit.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_ADVANCED_BETA_EDITOR, CONF_QUIET_HOURS_ENABLED
from custom_components.maintenance_supporter.helpers.task_trace import KIND_TRIGGER_CLEARED, get_trace
from custom_components.maintenance_supporter.websocket.io import _sanitize_history
from custom_components.maintenance_supporter.websocket.tasks import ws_task_trace, ws_update_task

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

UPDATE = "update.wallbox_firmware"
PRESSURE = "sensor.tyre_pressure"


async def _setup(hass: HomeAssistant, task: dict[str, Any]) -> MockConfigEntry:
    g = make_global_entry(hass, extra_data={CONF_ADVANCED_BETA_EDITOR: True, CONF_QUIET_HOURS_ENABLED: False})
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    return obj


async def _trace(hass: HomeAssistant, obj: MockConfigEntry) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(
        ws_task_trace, hass, conn, {"id": 1, "type": "maintenance_supporter/task/trace", "entry_id": obj.entry_id, "task_id": TASK_ID_1}
    )
    result: dict[str, Any] = conn.send_result.call_args[0][1]
    return result


def _update_state(hass: HomeAssistant, state: str, installed: str, latest: str) -> None:
    set_sensor_state(hass, UPDATE, state, {"installed_version": installed, "latest_version": latest, "friendly_name": "Wallbox Firmware"})


async def test_an_update_rule_records_the_versions_and_its_end(hass: HomeAssistant) -> None:
    _update_state(hass, "off", "v0.9.74", "v0.9.74")
    obj = await _setup(
        hass,
        build_task_data(
            schedule_type="sensor_based",
            interval_days=None,
            trigger_config={
                "type": "state_change",
                "entity_id": UPDATE,
                "entity_ids": [UPDATE],
                "trigger_from_state": "off",
                "trigger_to_state": "on",
                "trigger_target_changes": 1,
            },
        ),
    )

    _update_state(hass, "on", "v0.9.74", "v2026.11.0")
    await hass.async_block_till_done()
    fired = [h for h in (await _trace(hass, obj))["history"] if h["type"] == "triggered"]
    assert fired, "the update did not fire the rule"
    # The transition it counted and the versions, not just the count.
    assert fired[-1]["trigger_change"] == {"from": "off", "to": "on", "installed": "v0.9.74", "latest": "v2026.11.0"}

    _update_state(hass, "off", "v2026.11.0", "v2026.11.0")
    await hass.async_block_till_done()
    cleared = [e for e in (await _trace(hass, obj))["events"] if e["kind"] == KIND_TRIGGER_CLEARED]
    assert len(cleared) == 1
    assert {k: cleared[0][k] for k in ("entity", "state", "installed", "latest")} == {
        "entity": UPDATE,
        "state": "off",
        "installed": "v2026.11.0",
        "latest": "v2026.11.0",
    }


async def test_a_threshold_rule_letting_go_records_the_reading(hass: HomeAssistant) -> None:
    set_sensor_state(hass, PRESSURE, "42.0")
    obj = await _setup(
        hass,
        build_task_data(
            schedule_type="sensor_based",
            interval_days=None,
            trigger_config={"type": "threshold", "entity_id": PRESSURE, "entity_ids": [PRESSURE], "trigger_below": 40.6},
        ),
    )

    set_sensor_state(hass, PRESSURE, "39.9")
    await hass.async_block_till_done()
    fired = [h for h in (await _trace(hass, obj))["history"] if h["type"] == "triggered"]
    # A reading needs no transition: its value says it.
    assert fired and fired[-1]["trigger_value"] == 39.9 and "trigger_change" not in fired[-1]

    set_sensor_state(hass, PRESSURE, "41.2")
    await hass.async_block_till_done()
    cleared = [e for e in (await _trace(hass, obj))["events"] if e["kind"] == KIND_TRIGGER_CLEARED]
    assert len(cleared) == 1
    assert (cleared[0]["entity"], cleared[0]["value"]) == (PRESSURE, 41.2)
    assert "installed" not in cleared[0], "versions belong to update entities only"


async def test_a_manual_completion_is_no_end_of_the_rule(hass: HomeAssistant) -> None:
    """The rule letting go by itself is the event; a completion resets the
    trigger instead, and the trace has the completion for that."""
    set_sensor_state(hass, PRESSURE, "39.0")
    obj = await _setup(
        hass,
        build_task_data(
            schedule_type="sensor_based",
            interval_days=None,
            trigger_config={"type": "threshold", "entity_id": PRESSURE, "entity_ids": [PRESSURE], "trigger_below": 40.6},
        ),
    )
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    assert not [e for e in (await _trace(hass, obj))["events"] if e["kind"] == KIND_TRIGGER_CLEARED]


async def test_a_save_without_a_change_is_no_edit_for_an_old_empty_pool(hass: HomeAssistant) -> None:
    task = build_task_data(interval_days=30)
    task["assignee_pool"] = []  # how tasks were stored before normalize_people
    obj = await _setup(hass, task)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
            "interval_days": 30,
            "assignee_pool": None,
        },
    )
    await hass.async_block_till_done()
    trace = get_trace(hass)
    assert trace is not None
    assert [e for e in trace.events(obj.entry_id, TASK_ID_1) if e["kind"] == "edited"] == []


def test_an_import_keeps_a_firings_transition_and_drops_junk() -> None:
    history = [
        {"timestamp": "2026-11-04T13:28:24+01:00", "type": "triggered", "trigger_value": 1, "trigger_change": {"from": "off", "to": "on", "x": "y"}},
        {"timestamp": "2026-11-04T13:29:00+01:00", "type": "triggered", "trigger_change": {"to": 5}},
        {"timestamp": "2026-11-04T13:30:00+01:00", "type": "triggered", "trigger_change": "on"},
        {"timestamp": "2026-11-04T13:31:00+01:00", "type": "triggered", "trigger_change": {"latest": "v" * 500}},
    ]
    clean = _sanitize_history(history)
    assert clean[0]["trigger_change"] == {"from": "off", "to": "on"}
    assert "trigger_change" not in clean[1]
    assert "trigger_change" not in clean[2]
    assert len(clean[3]["trigger_change"]["latest"]) == 100
