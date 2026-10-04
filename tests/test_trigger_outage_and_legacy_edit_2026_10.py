"""Regression tests for two trigger bugs found in a live installation
(2026-10-04).

1. A counter sensor that drops out (``unavailable``) while the coordinator
   refreshes was read by the refresh-time fallback as "target not reached":
   the task flipped from triggered to OK and back on every refresh, and the
   trigger episode counted as ended — so the next restart or reload (every
   task edit reloads the object) announced the same activation again: a
   second ``triggered`` history entry and a second activation event.
2. A trigger edit compared the validated new config (always carrying
   ``entity_ids``) with the raw stored one; an old task stores only the
   legacy ``entity_id``, so changing just the target read as "other
   entities" and wiped the counter baseline / runtime hours.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import patch

import pytest
from homeassistant.core import Event, HomeAssistant, State, callback
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    EVENT_TRIGGER_ACTIVATED,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.entity.triggers import trigger_runtime_stale
from custom_components.maintenance_supporter.helpers.trigger_fallback import (
    FallbackResult,
    evaluate_counter,
    evaluate_due_date,
    evaluate_threshold,
)

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

SENSOR = "sensor.cleanings"


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _triggered_entries(hass: HomeAssistant, entry: MockConfigEntry) -> int:
    merged = _coordinator(hass, entry)._get_merged_tasks_data()[TASK_ID_1]
    return [h.get("type") for h in merged.get("history") or []].count("triggered")


def _counter_task(trigger: dict[str, Any]) -> dict[str, Any]:
    return build_task_data(
        task_id=TASK_ID_1,
        name="Empty the bin",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config=trigger,
    )


def _states(values: dict[str, str | None]) -> Any:
    """A state lookup over plain values; None = the entity does not exist."""

    def get(entity_id: str) -> State | None:
        value = values.get(entity_id)
        return None if value is None else State(entity_id, value)

    return get


# ─── 1. The fallback evaluators: no reading, no verdict ─────────────────────

_FUTURE = (dt_util.utcnow() + timedelta(days=60)).isoformat()
_SOON = (dt_util.utcnow() + timedelta(days=2)).isoformat()

# Every evaluator that reads entity states, with a config that a reading
# would decide. (state_change / runtime read persisted counters, not states.)
_STATE_READERS = [
    pytest.param(evaluate_threshold, {"type": "threshold", "trigger_above": 10}, id="threshold"),
    pytest.param(evaluate_threshold, {"type": "threshold", "trigger_above": 10, "trigger_for_minutes": 5}, id="threshold-for-minutes"),
    pytest.param(evaluate_counter, {"type": "counter", "trigger_target_value": 3}, id="counter-absolute"),
    pytest.param(
        evaluate_counter,
        {"type": "counter", "trigger_target_value": 3, "trigger_delta_mode": True, "trigger_baseline_value": 100},
        id="counter-delta",
    ),
]


@pytest.mark.parametrize(("evaluate", "config"), _STATE_READERS)
@pytest.mark.parametrize("dropout", ["unavailable", "unknown", None])
@pytest.mark.parametrize("logic", ["any", "all"])
def test_a_sensor_without_a_reading_gives_no_verdict(evaluate: Any, config: dict[str, Any], dropout: str | None, logic: str) -> None:
    """The tripwire for the whole family: the threshold had this guard since
    2026-08-22, the counter twin did not — so this runs over every evaluator
    that reads a sensor, one entity and two, either logic."""
    for entity_ids in (["sensor.a"], ["sensor.a", "sensor.b"]):
        result = evaluate(_states({"sensor.a": dropout, "sensor.b": dropout}), {**config, "entity_logic": logic}, entity_ids)
        assert result.active is None, (entity_ids, result)


@pytest.mark.parametrize("dropout", ["unavailable", "unknown", None])
@pytest.mark.parametrize("logic", ["any", "all"])
def test_a_date_sensor_without_a_reading_gives_no_verdict(dropout: str | None, logic: str) -> None:
    config = {"type": "due_date", "trigger_days_before": 7, "entity_logic": logic}
    for entity_ids in (["sensor.a"], ["sensor.a", "sensor.b"]):
        result = evaluate_due_date(_states({"sensor.a": dropout, "sensor.b": dropout}), config, entity_ids)
        assert result.active is None, (entity_ids, result)


@pytest.mark.parametrize(
    ("logic", "other", "expected"),
    [
        ("any", "101", None),  # the dropped-out one may be the one that reached
        ("any", "104", True),  # one reached is enough
        ("all", "101", False),  # one that did not reach decides "all"
        ("all", "104", None),  # the dropped-out one may not have reached
    ],
)
def test_one_of_two_counters_dropping_out(logic: str, other: str, expected: bool | None) -> None:
    config = {"type": "counter", "trigger_target_value": 3, "trigger_delta_mode": True, "trigger_baseline_value": 100, "entity_logic": logic}
    result = evaluate_counter(_states({"sensor.a": "unavailable", "sensor.b": other}), config, ["sensor.a", "sensor.b"])
    assert result.active is expected


@pytest.mark.parametrize(
    ("logic", "other", "expected"),
    [("any", "5", None), ("any", "50", True), ("all", "5", False), ("all", "50", None)],
)
def test_one_of_two_thresholds_dropping_out(logic: str, other: str, expected: bool | None) -> None:
    config = {"type": "threshold", "trigger_above": 10, "entity_logic": logic}
    result = evaluate_threshold(_states({"sensor.a": "unavailable", "sensor.b": other}), config, ["sensor.a", "sensor.b"])
    assert result.active is expected


@pytest.mark.parametrize(
    ("logic", "other", "expected"),
    [("any", _FUTURE, None), ("any", _SOON, True), ("all", _FUTURE, False), ("all", _SOON, None)],
    ids=["any-far", "any-soon", "all-far", "all-soon"],  # fixed ids: the dates differ per xdist worker
)
def test_one_of_two_date_sensors_dropping_out(logic: str, other: str, expected: bool | None) -> None:
    config = {"type": "due_date", "trigger_days_before": 7, "entity_logic": logic}
    result = evaluate_due_date(_states({"sensor.a": "unavailable", "sensor.b": other}), config, ["sensor.a", "sensor.b"])
    assert result.active is expected


def test_readings_still_decide() -> None:
    """The verdicts with full readings are unchanged."""
    delta = {"type": "counter", "trigger_target_value": 3, "trigger_delta_mode": True, "trigger_baseline_value": 100}
    assert evaluate_counter(_states({"sensor.a": "104"}), delta, ["sensor.a"]).active is True
    assert evaluate_counter(_states({"sensor.a": "101"}), delta, ["sensor.a"]).active is False
    threshold = {"type": "threshold", "trigger_above": 10}
    assert evaluate_threshold(_states({"sensor.a": "50"}), threshold, ["sensor.a"]).active is True
    assert evaluate_threshold(_states({"sensor.a": "5"}), threshold, ["sensor.a"]).active is False
    assert evaluate_threshold(_states({}), threshold, []).active is False  # no entities: nothing can latch


# ─── 1. The coordinator: a dropout neither flips the task nor ends the episode


async def _triggered_counter(hass: HomeAssistant) -> MockConfigEntry:
    set_sensor_state(hass, SENSOR, "100")
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: _counter_task({"type": "counter", "entity_id": SENSOR, "entity_ids": [SENSOR], "trigger_delta_mode": True, "trigger_target_value": 3})},
    )
    await setup_integration(hass, g, obj)
    set_sensor_state(hass, SENSOR, "104")
    await hass.async_block_till_done()
    assert _triggered_entries(hass, obj) == 1
    return obj


async def test_a_counter_dropping_out_during_a_refresh_stays_triggered(hass: HomeAssistant) -> None:
    obj = await _triggered_counter(hass)
    coordinator = _coordinator(hass, obj)
    set_sensor_state(hass, SENSOR, "unavailable")
    await hass.async_block_till_done()
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    task = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task["_trigger_active"] is True
    assert task["_status"] == MaintenanceStatus.TRIGGERED
    assert coordinator._store.get_task_state(TASK_ID_1).get("trigger_cleared_at") is None


async def test_a_restart_after_a_dropout_does_not_announce_the_activation_again(hass: HomeAssistant) -> None:
    obj = await _triggered_counter(hass)
    activations: list[Event] = []

    @callback
    def _on_activation(event: Event) -> None:
        activations.append(event)

    hass.bus.async_listen(EVENT_TRIGGER_ACTIVATED, _on_activation)
    set_sensor_state(hass, SENSOR, "unavailable")
    await hass.async_block_till_done()
    await _coordinator(hass, obj).async_refresh()
    await hass.async_block_till_done()
    set_sensor_state(hass, SENSOR, "104")
    await hass.async_block_till_done()

    await hass.config_entries.async_unload(obj.entry_id)  # Home Assistant stops ...
    await hass.async_block_till_done()
    await hass.config_entries.async_setup(obj.entry_id)  # ... and starts again
    await hass.async_block_till_done()
    assert _triggered_entries(hass, obj) == 1
    assert activations == []
    assert _coordinator(hass, obj).data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.TRIGGERED


async def test_the_coordinator_never_ends_an_episode_without_a_reading(hass: HomeAssistant) -> None:
    """Defense in depth: even an evaluator that wrongly says "not reached"
    while every sensor of the trigger is offline cannot end the episode."""
    obj = await _triggered_counter(hass)
    coordinator = _coordinator(hass, obj)
    set_sensor_state(hass, SENSOR, "unavailable")
    await hass.async_block_till_done()
    with patch(
        "custom_components.maintenance_supporter.helpers.trigger_fallback.evaluate_counter",
        return_value=FallbackResult(current_value=None, active=False),
    ):
        await coordinator.async_refresh()
        await hass.async_block_till_done()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True
    assert coordinator._store.get_task_state(TASK_ID_1).get("trigger_cleared_at") is None


async def test_a_real_recovery_still_ends_the_episode(hass: HomeAssistant) -> None:
    """The counter sensor really went back (a device reset below the
    baseline): that is a reading, and it still clears the task."""
    obj = await _triggered_counter(hass)
    set_sensor_state(hass, SENSOR, "2")
    await hass.async_block_till_done()
    await _coordinator(hass, obj).async_refresh()
    await hass.async_block_till_done()
    coordinator = _coordinator(hass, obj)
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is False
    assert coordinator._store.get_task_state(TASK_ID_1).get("trigger_cleared_at") is not None


# ─── 2. A trigger edit keeps the runtime unless the trigger really changed ──


@pytest.mark.parametrize(
    ("old", "new", "stale"),
    [
        # The stored legacy form vs the validated edit of the same trigger.
        ({"type": "counter", "entity_id": "sensor.a"}, {"type": "counter", "entity_id": "sensor.a", "entity_ids": ["sensor.a"], "trigger_target_value": 4}, False),
        ({"type": "counter", "entity_ids": ["sensor.a"]}, {"type": "counter", "entity_id": "sensor.a"}, False),
        ({"type": "runtime", "entity_id": "sensor.a", "trigger_runtime_hours": 30}, {"type": "runtime", "entity_ids": ["sensor.a"], "trigger_runtime_hours": 60}, False),
        # Real changes still reset it.
        ({"type": "counter", "entity_id": "sensor.a"}, {"type": "counter", "entity_ids": ["sensor.b"]}, True),
        ({"type": "counter", "entity_id": "sensor.a"}, {"type": "runtime", "entity_id": "sensor.a"}, True),
        ({"type": "counter", "entity_id": "sensor.a"}, {"type": "counter", "entity_id": "sensor.a", "trigger_baseline_value": 5}, True),
        ({"type": "counter", "entity_id": "sensor.a"}, {}, True),
        ({}, {"type": "counter", "entity_id": "sensor.a"}, True),
        ({"type": "counter", "entity_ids": ["sensor.a", "sensor.b"]}, {"type": "counter", "entity_ids": ["sensor.a"]}, True),
        # A compound keeps its runtime per condition: only a type change resets it, as before.
        ({"type": "compound", "conditions": [{"type": "threshold", "entity_id": "sensor.a"}]}, {"type": "compound", "conditions": [{"type": "threshold", "entity_id": "sensor.b"}]}, False),
    ],
)
def test_which_trigger_edits_reset_the_runtime(old: dict[str, Any], new: dict[str, Any], stale: bool) -> None:
    assert trigger_runtime_stale(old, new) is stale
    assert trigger_runtime_stale(new, old) is stale


async def _legacy_counter(hass: HomeAssistant) -> MockConfigEntry:
    """A triggered counter task stored in the legacy form (no entity_ids),
    baseline 100, reading 104, target 3."""
    set_sensor_state(hass, SENSOR, "100")
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: _counter_task({"type": "counter", "entity_id": SENSOR, "trigger_delta_mode": True, "trigger_target_value": 3})},
    )
    await setup_integration(hass, g, obj)
    set_sensor_state(hass, SENSOR, "104")
    await hass.async_block_till_done()
    assert "entity_ids" not in obj.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert _coordinator(hass, obj)._store.get_trigger_runtime(TASK_ID_1, SENSOR).get("baseline_value") == 100
    return obj


async def _update_trigger(hass: HomeAssistant, entry: MockConfigEntry, trigger_config: dict[str, Any]) -> Any:
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 1, "type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": TASK_ID_1, "trigger_config": trigger_config},
    )
    await hass.async_block_till_done()
    conn.send_error.assert_not_called()
    return conn


@pytest.mark.parametrize(
    "sent",
    [
        # What an API client sends back: the stored form, target changed.
        {"type": "counter", "entity_id": SENSOR, "attribute": None, "trigger_delta_mode": True, "trigger_target_value": 4},
        # What the panel sends: both keys.
        {"type": "counter", "entity_id": SENSOR, "entity_ids": [SENSOR], "trigger_delta_mode": True, "trigger_target_value": 4},
    ],
    ids=["stored-form", "panel-form"],
)
async def test_changing_the_target_of_a_legacy_task_keeps_its_baseline(hass: HomeAssistant, sent: dict[str, Any]) -> None:
    obj = await _legacy_counter(hass)
    await _update_trigger(hass, obj, sent)

    coordinator = _coordinator(hass, obj)
    assert coordinator._store.get_trigger_runtime(TASK_ID_1, SENSOR).get("baseline_value") == 100
    task = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task["_status"] == MaintenanceStatus.TRIGGERED  # 104 - 100 >= 4


async def test_another_sensor_still_resets_the_baseline(hass: HomeAssistant) -> None:
    obj = await _legacy_counter(hass)
    set_sensor_state(hass, "sensor.other", "7")
    await _update_trigger(
        hass, obj, {"type": "counter", "entity_ids": ["sensor.other"], "trigger_delta_mode": True, "trigger_target_value": 3}
    )
    store = _coordinator(hass, obj)._store
    assert store.get_trigger_runtime(TASK_ID_1, SENSOR) == {}
    assert store.get_trigger_runtime(TASK_ID_1, "sensor.other").get("baseline_value") == 7


def test_the_options_flow_keeps_the_runtime_of_a_legacy_trigger() -> None:
    """The second copy of the rule (options flow) goes through the same helper."""
    from types import SimpleNamespace
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.config_flow_options_task_trigger import TriggerStepsMixin

    store = MagicMock()
    entry = MagicMock()
    entry.runtime_data = SimpleNamespace(store=store)
    fake = SimpleNamespace(config_entry=entry, _selected_task_id="task_x")
    TriggerStepsMixin._clear_stale_trigger_runtime(
        fake,
        {"type": "runtime", "entity_id": "input_boolean.washer", "trigger_runtime_hours": 30},
        {"type": "runtime", "entity_id": "input_boolean.washer", "entity_ids": ["input_boolean.washer"], "trigger_runtime_hours": 60},
    )
    store.clear_trigger_runtime.assert_not_called()
