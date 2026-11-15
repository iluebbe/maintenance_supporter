"""Which sensor of a state rule fired, and what ended it.

Found on a live rule over nine routers' update entities: the history said
"8.51 available, 8.25 installed" twice for two different routers, and the
completion the rule recorded by itself said only "sensor recovered". A
firing now names its sensor (``trigger_change.entity``), and an automatic
completion of a state rule keeps the sensor, the state it went back to and
an update's versions. The panel draws the rule as a timeline from these and
from the recorder (frontend: state-timeline-2026-11-15.test.ts).
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_ADVANCED_BETA_EDITOR, CONF_QUIET_HOURS_ENABLED
from custom_components.maintenance_supporter.websocket.io import _sanitize_history
from custom_components.maintenance_supporter.websocket.tasks import ws_task_trace

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

ROUTER_A = "update.router_a_firmware"
ROUTER_B = "update.router_b_firmware"
PRESSURE = "sensor.tyre_pressure"


async def _setup(hass: HomeAssistant, task: dict[str, Any]) -> MockConfigEntry:
    g = make_global_entry(hass, extra_data={CONF_ADVANCED_BETA_EDITOR: True, CONF_QUIET_HOURS_ENABLED: False})
    obj = make_object_entry(hass, tasks={TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    return obj


async def _history(hass: HomeAssistant, obj: MockConfigEntry) -> list[dict[str, Any]]:
    conn = make_ws_connection()
    await call_ws_handler(
        ws_task_trace, hass, conn, {"id": 1, "type": "maintenance_supporter/task/trace", "entry_id": obj.entry_id, "task_id": TASK_ID_1}
    )
    history: list[dict[str, Any]] = conn.send_result.call_args[0][1]["history"]
    return history


def _router(hass: HomeAssistant, entity_id: str, state: str, installed: str, latest: str) -> None:
    set_sensor_state(hass, entity_id, state, {"installed_version": installed, "latest_version": latest})


def _update_rule(*, auto: bool) -> dict[str, Any]:
    rule: dict[str, Any] = {
        "type": "state_change",
        "entity_id": ROUTER_A,
        "entity_ids": [ROUTER_A, ROUTER_B],
        "trigger_from_state": "off",
        "trigger_to_state": "on",
        "trigger_target_changes": 1,
    }
    if auto:
        rule["auto_complete_on_recovery"] = True
    return build_task_data(schedule_type="sensor_based", interval_days=None, trigger_config=rule)


async def test_a_firing_names_the_sensor_of_a_rule_on_several(hass: HomeAssistant) -> None:
    _router(hass, ROUTER_A, "off", "8.25", "8.25")
    _router(hass, ROUTER_B, "off", "8.25", "8.25")
    obj = await _setup(hass, _update_rule(auto=False))

    _router(hass, ROUTER_B, "on", "8.25", "8.51")
    await hass.async_block_till_done()
    fired = [h for h in await _history(hass, obj) if h["type"] == "triggered"]
    assert fired, "the second router did not fire the rule"
    assert fired[-1]["trigger_change"]["entity"] == ROUTER_B
    assert (fired[-1]["trigger_change"]["installed"], fired[-1]["trigger_change"]["latest"]) == ("8.25", "8.51")


async def test_an_automatic_completion_keeps_what_ended_it(hass: HomeAssistant) -> None:
    _router(hass, ROUTER_A, "off", "8.25", "8.25")
    _router(hass, ROUTER_B, "off", "8.25", "8.25")
    obj = await _setup(hass, _update_rule(auto=True))

    _router(hass, ROUTER_B, "on", "8.25", "8.51")
    await hass.async_block_till_done()
    # The router reboots to install, then reports the new version.
    set_sensor_state(hass, ROUTER_B, "unavailable")
    await hass.async_block_till_done()
    _router(hass, ROUTER_B, "off", "8.51", "8.51")
    await hass.async_block_till_done()

    done = [h for h in await _history(hass, obj) if h["type"] == "completed"]
    assert len(done) == 1, "the install did not complete the task"
    assert done[0].get("auto") is True
    assert done[0]["trigger_change"] == {"entity": ROUTER_B, "state": "off", "installed": "8.51", "latest": "8.51"}


async def test_a_reading_rule_completion_carries_no_change(hass: HomeAssistant) -> None:
    """A threshold rule's reading is in its note already."""
    set_sensor_state(hass, PRESSURE, "42.0")
    obj = await _setup(
        hass,
        build_task_data(
            schedule_type="sensor_based",
            interval_days=None,
            trigger_config={
                "type": "threshold",
                "entity_id": PRESSURE,
                "entity_ids": [PRESSURE],
                "trigger_below": 40.6,
                "auto_complete_on_recovery": True,
            },
        ),
    )
    set_sensor_state(hass, PRESSURE, "39.5")
    await hass.async_block_till_done()
    set_sensor_state(hass, PRESSURE, "41.2")
    await hass.async_block_till_done()
    done = [h for h in await _history(hass, obj) if h["type"] == "completed"]
    assert done, "the recovery did not complete the task"
    assert "trigger_change" not in done[-1]
    assert "41.2" in done[-1]["notes"]


async def test_the_trace_says_the_day_the_task_began(hass: HomeAssistant) -> None:
    """The recorder keeps a few days; the timeline fills in from the task's
    own record, which reaches back to its first day."""
    task = build_task_data(interval_days=30)
    task["created_at"] = "2026-08-01"
    obj = await _setup(hass, task)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_task_trace, hass, conn, {"id": 1, "type": "maintenance_supporter/task/trace", "entry_id": obj.entry_id, "task_id": TASK_ID_1}
    )
    assert conn.send_result.call_args[0][1]["created_at"] == "2026-08-01"


def test_an_import_keeps_the_sensor_and_the_state() -> None:
    history = [
        {"timestamp": "2026-11-15T13:14:45+01:00", "type": "triggered", "trigger_change": {"to": "on", "entity": ROUTER_B, "latest": "8.51"}},
        {"timestamp": "2026-11-15T13:18:23+01:00", "type": "completed", "trigger_change": {"entity": ROUTER_B, "state": "off", "installed": "8.51"}},
    ]
    clean = _sanitize_history(history)
    assert clean[0]["trigger_change"] == {"to": "on", "entity": ROUTER_B, "latest": "8.51"}
    assert clean[1]["trigger_change"] == {"entity": ROUTER_B, "state": "off", "installed": "8.51"}
