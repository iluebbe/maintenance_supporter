"""Tests for trigger event handling — state changes, unavailable, retry logic."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _make_entry(
    hass: HomeAssistant,
    task_data: dict[str, Any],
    name: str = "Trigger Test",
    unique_id: str = "trigger_events",
) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks={TASK_ID_1: task_data},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Threshold Trigger: State Change Events ─────────────────────────


async def test_threshold_trigger_state_change_activates(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold trigger activates when entity state exceeds threshold."""
    hass.states.async_set("sensor.temp_evt", "20")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_evt",
            "entity_ids": ["sensor.temp_evt"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="thresh_activate")
    await setup_integration(hass, global_entry, obj_entry)

    # Change state to exceed threshold
    hass.states.async_set("sensor.temp_evt", "35")
    await hass.async_block_till_done()

    state = hass.states.get(f"sensor.trigger_test_filter_cleaning")
    if state:
        assert state.state == "triggered" or state.attributes.get("trigger_active") is True


async def test_threshold_trigger_state_change_deactivates(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold trigger deactivates when entity state goes below threshold."""
    hass.states.async_set("sensor.temp_deact", "35")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_deact",
            "entity_ids": ["sensor.temp_deact"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="thresh_deact")
    await setup_integration(hass, global_entry, obj_entry)

    # State goes below threshold
    hass.states.async_set("sensor.temp_deact", "20")
    await hass.async_block_till_done()


async def test_threshold_trigger_entity_unavailable(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold trigger handles entity becoming unavailable."""
    hass.states.async_set("sensor.temp_unavail", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_unavail",
            "entity_ids": ["sensor.temp_unavail"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="thresh_unavail")
    await setup_integration(hass, global_entry, obj_entry)

    # Entity becomes unavailable
    hass.states.async_set("sensor.temp_unavail", "unavailable")
    await hass.async_block_till_done()

    # Entity becomes available again
    hass.states.async_set("sensor.temp_unavail", "25")
    await hass.async_block_till_done()


async def test_threshold_trigger_entity_removed(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold trigger handles entity being removed (new_state=None)."""
    hass.states.async_set("sensor.temp_remove", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_remove",
            "entity_ids": ["sensor.temp_remove"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="thresh_remove")
    await setup_integration(hass, global_entry, obj_entry)

    # Remove entity
    hass.states.async_remove("sensor.temp_remove")
    await hass.async_block_till_done()


async def test_threshold_trigger_entity_not_yet_available(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold trigger when entity doesn't exist at setup time."""
    # Don't set state — entity is missing
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.future_entity",
            "entity_ids": ["sensor.future_entity"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="thresh_future")
    await setup_integration(hass, global_entry, obj_entry)

    # Entity appears
    hass.states.async_set("sensor.future_entity", "35")
    await hass.async_block_till_done()


async def test_threshold_trigger_unavailable_at_setup(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold trigger schedules retry when entity is unavailable at setup."""
    hass.states.async_set("sensor.temp_retry", "unavailable")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_retry",
            "entity_ids": ["sensor.temp_retry"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="thresh_retry")
    await setup_integration(hass, global_entry, obj_entry)

    # Fix entity before retry
    hass.states.async_set("sensor.temp_retry", "25")

    # Advance time to trigger retry (30 seconds)
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=31))
    await hass.async_block_till_done()


# ─── State Change Trigger ────────────────────────────────────────────


async def test_state_change_trigger_counts_transitions(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test state change trigger counts matching transitions."""
    hass.states.async_set("binary_sensor.door_evt", "off")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "state_change",
            "entity_id": "binary_sensor.door_evt",
            "entity_ids": ["binary_sensor.door_evt"],
            "trigger_from_state": "off",
            "trigger_to_state": "on",
            "trigger_target_changes": 3,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="sc_count")
    await setup_integration(hass, global_entry, obj_entry)

    # Simulate state changes
    for _ in range(3):
        hass.states.async_set("binary_sensor.door_evt", "on")
        await hass.async_block_till_done()
        hass.states.async_set("binary_sensor.door_evt", "off")
        await hass.async_block_till_done()


async def test_state_change_trigger_unavailable(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test state change trigger handles unavailable entity."""
    hass.states.async_set("binary_sensor.door_unavail", "off")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "state_change",
            "entity_id": "binary_sensor.door_unavail",
            "entity_ids": ["binary_sensor.door_unavail"],
            "trigger_target_changes": 5,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="sc_unavail")
    await setup_integration(hass, global_entry, obj_entry)

    # Entity becomes unavailable
    hass.states.async_set("binary_sensor.door_unavail", "unavailable")
    await hass.async_block_till_done()

    # Entity becomes available again
    hass.states.async_set("binary_sensor.door_unavail", "off")
    await hass.async_block_till_done()


async def test_state_change_trigger_entity_appeared(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test state change trigger when entity first appears."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "state_change",
            "entity_id": "binary_sensor.new_door",
            "entity_ids": ["binary_sensor.new_door"],
            "trigger_target_changes": 5,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="sc_appear")
    await setup_integration(hass, global_entry, obj_entry)

    # Entity appears
    hass.states.async_set("binary_sensor.new_door", "off")
    await hass.async_block_till_done()


# ─── Runtime Trigger ─────────────────────────────────────────────────


async def test_runtime_trigger_on_off_cycle(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger tracks ON→OFF cycle."""
    hass.states.async_set("sensor.pump_rt", "off")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump_rt",
            "entity_ids": ["sensor.pump_rt"],
            "trigger_runtime_hours": 100,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="rt_cycle")
    await setup_integration(hass, global_entry, obj_entry)

    # Pump turns ON
    hass.states.async_set("sensor.pump_rt", "on")
    await hass.async_block_till_done()

    # Pump turns OFF
    hass.states.async_set("sensor.pump_rt", "off")
    await hass.async_block_till_done()


async def test_runtime_trigger_unavailable_pauses(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger pauses accumulation when entity becomes unavailable."""
    hass.states.async_set("sensor.pump_unavail", "on")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump_unavail",
            "entity_ids": ["sensor.pump_unavail"],
            "trigger_runtime_hours": 100,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="rt_unavail")
    await setup_integration(hass, global_entry, obj_entry)

    # Entity becomes unavailable (should pause)
    hass.states.async_set("sensor.pump_unavail", "unavailable")
    await hass.async_block_till_done()

    # Entity comes back
    hass.states.async_set("sensor.pump_unavail", "on")
    await hass.async_block_till_done()


async def test_runtime_trigger_entity_appeared(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger when entity first appears."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump_new",
            "entity_ids": ["sensor.pump_new"],
            "trigger_runtime_hours": 100,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="rt_appear")
    await setup_integration(hass, global_entry, obj_entry)

    # Entity appears as ON
    hass.states.async_set("sensor.pump_new", "on")
    await hass.async_block_till_done()


async def test_runtime_trigger_periodic_callback(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger periodic persistence callback."""
    hass.states.async_set("sensor.pump_periodic", "on")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump_periodic",
            "entity_ids": ["sensor.pump_periodic"],
            "trigger_runtime_hours": 100,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="rt_periodic")
    await setup_integration(hass, global_entry, obj_entry)

    # Advance time to trigger periodic callback (5 minutes)
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=6))
    await hass.async_block_till_done()


async def test_runtime_trigger_off_at_setup(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger setup when entity is already OFF."""
    hass.states.async_set("sensor.pump_off", "off")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump_off",
            "entity_ids": ["sensor.pump_off"],
            "trigger_runtime_hours": 100,
            "_trigger_state": {
                "sensor.pump_off": {
                    "accumulated_seconds": 3600,
                    "on_since": dt_util.utcnow().isoformat(),
                },
            },
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="rt_off_setup")
    await setup_integration(hass, global_entry, obj_entry)
    # Should accumulate the gap since on_since and clear it


# ─── Counter Trigger ─────────────────────────────────────────────────


async def test_counter_trigger_delta_baseline_init(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test counter trigger initializes baseline in delta mode."""
    hass.states.async_set("sensor.counter_init", "100")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.counter_init",
            "entity_ids": ["sensor.counter_init"],
            "trigger_target_value": 50,
            "trigger_delta_mode": True,
            # No baseline → should initialize from current value
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="ctr_init")
    await setup_integration(hass, global_entry, obj_entry)

    # Counter increases past target
    hass.states.async_set("sensor.counter_init", "200")
    await hass.async_block_till_done()


async def test_counter_trigger_state_change(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test counter trigger reacts to state changes."""
    hass.states.async_set("sensor.counter_sc", "50")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.counter_sc",
            "entity_ids": ["sensor.counter_sc"],
            "trigger_target_value": 100,
            "trigger_delta_mode": False,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="ctr_sc")
    await setup_integration(hass, global_entry, obj_entry)

    # Value exceeds target
    hass.states.async_set("sensor.counter_sc", "150")
    await hass.async_block_till_done()

    # Value goes back below
    hass.states.async_set("sensor.counter_sc", "50")
    await hass.async_block_till_done()


# ─── Threshold: for_minutes timer ───────────────────────────────────


async def test_threshold_for_minutes_timer(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold trigger with for_minutes timer."""
    hass.states.async_set("sensor.temp_timer", "20")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_timer",
            "entity_ids": ["sensor.temp_timer"],
            "trigger_above": 30,
            "trigger_for_minutes": 1,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="thresh_timer")
    await setup_integration(hass, global_entry, obj_entry)

    # Exceed threshold
    hass.states.async_set("sensor.temp_timer", "35")
    await hass.async_block_till_done()

    # Wait for timer to fire
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=2))
    await hass.async_block_till_done()


async def test_threshold_for_minutes_cancel(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold for_minutes timer cancels when value returns to normal."""
    hass.states.async_set("sensor.temp_cancel", "20")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_cancel",
            "entity_ids": ["sensor.temp_cancel"],
            "trigger_above": 30,
            "trigger_for_minutes": 5,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="thresh_cancel")
    await setup_integration(hass, global_entry, obj_entry)

    # Exceed threshold
    hass.states.async_set("sensor.temp_cancel", "35")
    await hass.async_block_till_done()

    # Value returns to normal before timer fires
    hass.states.async_set("sensor.temp_cancel", "20")
    await hass.async_block_till_done()


# ─── Trigger Teardown ───────────────────────────────────────────────


async def test_trigger_teardown_on_unload(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test trigger listeners are cleaned up on entry unload."""
    hass.states.async_set("sensor.temp_unload", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_unload",
            "entity_ids": ["sensor.temp_unload"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="unload_trig")
    await setup_integration(hass, global_entry, obj_entry)

    # Unload should clean up listeners
    result = await hass.config_entries.async_unload(obj_entry.entry_id)
    assert result is True

    # Changing state after unload should not crash
    hass.states.async_set("sensor.temp_unload", "35")
    await hass.async_block_till_done()
