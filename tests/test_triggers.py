"""Tests for trigger behavior (threshold, counter, state_change, runtime)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    MaintenanceStatus,
    ScheduleType,
    TriggerType,
)
from custom_components.maintenance_supporter.entity.triggers import create_trigger
from custom_components.maintenance_supporter.entity.triggers.counter import (
    CounterTrigger,
)
from custom_components.maintenance_supporter.entity.triggers.runtime import (
    RuntimeTrigger,
)
from custom_components.maintenance_supporter.entity.triggers.state_change import (
    StateChangeTrigger,
)
from custom_components.maintenance_supporter.entity.triggers.threshold import (
    ThresholdTrigger,
)

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    set_sensor_state,
    setup_integration,
)


# ─── Helpers ─────────────────────────────────────────────────────────────


def _make_mock_entity(hass: HomeAssistant, task_id: str = TASK_ID_1):
    """Create a mock entity for trigger tests."""
    mock_entity = MagicMock()
    mock_entity.hass = hass
    mock_entity.entity_id = "sensor.maintenance_supporter_test_task"
    mock_entity._task_id = task_id
    mock_entity.async_update_trigger_state = MagicMock()
    mock_entity.async_write_ha_state = MagicMock()

    # Mock coordinator
    mock_coordinator = AsyncMock()
    mock_coordinator.async_persist_trigger_runtime = AsyncMock()
    mock_coordinator.async_add_trigger_history_entry = AsyncMock()
    mock_entity.coordinator = mock_coordinator

    return mock_entity


# ─── 7.1 Threshold Trigger ──────────────────────────────────────────────


class TestThresholdTrigger:
    """Tests for ThresholdTrigger."""

    async def test_above_threshold_triggers(self, hass: HomeAssistant) -> None:
        """Test that exceeding above threshold triggers."""
        set_sensor_state(hass, "sensor.pressure", "1.0")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.pressure",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 1.5,
        }
        trigger = ThresholdTrigger(hass, entity, config)

        assert trigger.evaluate(1.0) is False
        assert trigger.evaluate(1.5) is False  # not > 1.5
        assert trigger.evaluate(1.6) is True

    async def test_below_threshold_triggers(self, hass: HomeAssistant) -> None:
        """Test that going below threshold triggers."""
        set_sensor_state(hass, "sensor.temp", "25.0")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.temp",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_below": 10.0,
        }
        trigger = ThresholdTrigger(hass, entity, config)

        assert trigger.evaluate(25.0) is False
        assert trigger.evaluate(10.0) is False  # not < 10.0
        assert trigger.evaluate(9.9) is True

    async def test_both_thresholds(self, hass: HomeAssistant) -> None:
        """Test both above and below thresholds."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 80.0,
            "trigger_below": 20.0,
        }
        trigger = ThresholdTrigger(hass, entity, config)

        assert trigger.evaluate(50.0) is False
        assert trigger.evaluate(81.0) is True
        assert trigger.evaluate(19.0) is True
        assert trigger.evaluate(50.0) is False  # back to normal

    async def test_threshold_with_for_minutes(self, hass: HomeAssistant) -> None:
        """Test threshold with duration requirement doesn't trigger immediately."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 50.0,
            "trigger_for_minutes": 5,
        }
        trigger = ThresholdTrigger(hass, entity, config)

        # Exceed threshold - should NOT trigger immediately
        assert trigger.evaluate(60.0) is False
        # Timer started but not fired yet
        assert trigger._threshold_exceeded is True

    async def test_threshold_reset_on_normal(self, hass: HomeAssistant) -> None:
        """Test threshold resets when value returns to normal."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 50.0,
        }
        trigger = ThresholdTrigger(hass, entity, config)

        assert trigger.evaluate(60.0) is True
        assert trigger.evaluate(40.0) is False

    async def test_threshold_setup_and_teardown(self, hass: HomeAssistant) -> None:
        """Test trigger setup registers listener and teardown removes it."""
        set_sensor_state(hass, "sensor.pressure", "1.0", {"unit_of_measurement": "bar"})
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.pressure",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 2.0,
        }
        trigger = ThresholdTrigger(hass, entity, config)

        await trigger.async_setup()
        assert trigger._unsub_listener is not None

        await trigger.async_teardown()
        assert trigger._unsub_listener is None


# ─── 7.2 Counter Trigger ────────────────────────────────────────────────


class TestCounterTrigger:
    """Tests for CounterTrigger."""

    async def test_absolute_mode(self, hass: HomeAssistant) -> None:
        """Test counter in absolute mode."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.counter",
            "attribute": None,
            "type": TriggerType.COUNTER,
            "trigger_target_value": 1000,
            "trigger_delta_mode": False,
        }
        trigger = CounterTrigger(hass, entity, config)

        assert trigger.evaluate(500) is False
        assert trigger.evaluate(999) is False
        assert trigger.evaluate(1000) is True
        assert trigger.evaluate(1500) is True

    async def test_delta_mode(self, hass: HomeAssistant) -> None:
        """Test counter in delta mode."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.counter",
            "attribute": None,
            "type": TriggerType.COUNTER,
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 500,
        }
        trigger = CounterTrigger(hass, entity, config)

        assert trigger.evaluate(550) is False  # delta=50
        assert trigger.evaluate(599) is False  # delta=99
        assert trigger.evaluate(600) is True  # delta=100

    async def test_delta_mode_initializes_baseline(
        self, hass: HomeAssistant
    ) -> None:
        """Test that delta mode sets baseline on first value."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.counter",
            "attribute": None,
            "type": TriggerType.COUNTER,
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
        }
        trigger = CounterTrigger(hass, entity, config)

        # First value initializes baseline
        assert trigger.evaluate(500) is False
        assert trigger._baseline_value == 500
        assert trigger.evaluate(600) is True

    async def test_current_delta(self, hass: HomeAssistant) -> None:
        """Test current_delta property."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.counter",
            "attribute": None,
            "type": TriggerType.COUNTER,
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 500,
        }
        trigger = CounterTrigger(hass, entity, config)
        trigger._current_value = 575

        assert trigger.current_delta == 75.0

    async def test_reset_baseline(self, hass: HomeAssistant) -> None:
        """Test resetting the baseline."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.counter",
            "attribute": None,
            "type": TriggerType.COUNTER,
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 500,
        }
        trigger = CounterTrigger(hass, entity, config)
        trigger._current_value = 600

        trigger.reset_baseline()
        assert trigger._baseline_value == 600

    async def test_counter_setup_persists_baseline(
        self, hass: HomeAssistant
    ) -> None:
        """Test that setup initializes baseline for delta mode.

        During async_setup, BaseTrigger.async_setup() calls _evaluate_and_update
        which calls evaluate(). In evaluate(), if delta mode has no baseline,
        it initializes from the current value. The async_setup in CounterTrigger
        then checks if baseline is still None (it isn't), so _persist_baseline
        is not called directly. The baseline is still correctly initialized.
        """
        set_sensor_state(hass, "sensor.runtime", "500")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.runtime",
            "attribute": None,
            "type": TriggerType.COUNTER,
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
        }
        trigger = CounterTrigger(hass, entity, config)
        await trigger.async_setup()

        # Baseline should be initialized from the initial sensor value
        assert trigger._baseline_value == 500.0
        # The _unsub_listener should be set (listener registered)
        assert trigger._unsub_listener is not None

        await trigger.async_teardown()


# ─── 7.3 State Change Trigger ───────────────────────────────────────────


class TestStateChangeTrigger:
    """Tests for StateChangeTrigger."""

    async def test_counts_matching_transitions(
        self, hass: HomeAssistant
    ) -> None:
        """Test counting state transitions."""
        set_sensor_state(hass, "binary_sensor.door", "off")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "binary_sensor.door",
            "attribute": None,
            "type": TriggerType.STATE_CHANGE,
            "trigger_from_state": "off",
            "trigger_to_state": "on",
            "trigger_target_changes": 3,
        }
        trigger = StateChangeTrigger(hass, entity, config)
        await trigger.async_setup()

        assert trigger.change_count == 0

        # Simulate transitions
        hass.states.async_set("binary_sensor.door", "on")
        await hass.async_block_till_done()
        assert trigger.change_count == 1

        hass.states.async_set("binary_sensor.door", "off")
        await hass.async_block_till_done()
        # off→off doesn't match from_state=off to_state=on...
        # Actually off→off won't fire (same state), but off→on does

        hass.states.async_set("binary_sensor.door", "on")
        await hass.async_block_till_done()
        assert trigger.change_count == 2

        hass.states.async_set("binary_sensor.door", "off")
        await hass.async_block_till_done()

        hass.states.async_set("binary_sensor.door", "on")
        await hass.async_block_till_done()
        assert trigger.change_count == 3

        # Should be triggered now
        assert trigger._triggered is True

        await trigger.async_teardown()

    async def test_ignores_non_matching_transitions(
        self, hass: HomeAssistant
    ) -> None:
        """Test that non-matching transitions are ignored."""
        set_sensor_state(hass, "binary_sensor.door", "off")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "binary_sensor.door",
            "attribute": None,
            "type": TriggerType.STATE_CHANGE,
            "trigger_from_state": "on",
            "trigger_to_state": "off",
            "trigger_target_changes": 1,
        }
        trigger = StateChangeTrigger(hass, entity, config)
        await trigger.async_setup()

        # off → on doesn't match from_state=on → to_state=off
        hass.states.async_set("binary_sensor.door", "on")
        await hass.async_block_till_done()
        assert trigger.change_count == 0

        # on → off DOES match
        hass.states.async_set("binary_sensor.door", "off")
        await hass.async_block_till_done()
        assert trigger.change_count == 1
        assert trigger._triggered is True

        await trigger.async_teardown()

    async def test_reset_count(self, hass: HomeAssistant) -> None:
        """Test resetting the change counter."""
        set_sensor_state(hass, "sensor.test", "a")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.STATE_CHANGE,
            "trigger_target_changes": 5,
            "trigger_change_count": 3,
        }
        trigger = StateChangeTrigger(hass, entity, config)
        assert trigger.change_count == 3

        trigger.reset_count()
        assert trigger.change_count == 0

    async def test_restores_count_from_config(
        self, hass: HomeAssistant
    ) -> None:
        """Test that change count is restored from config."""
        set_sensor_state(hass, "sensor.test", "a")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.STATE_CHANGE,
            "trigger_target_changes": 3,
            "trigger_change_count": 3,
        }
        trigger = StateChangeTrigger(hass, entity, config)
        await trigger.async_setup()

        # Should be triggered because count >= target
        assert trigger._triggered is True
        entity.async_update_trigger_state.assert_called_with(
            is_triggered=True, current_value=3.0
        )

        await trigger.async_teardown()

    async def test_ignores_unavailable_states(
        self, hass: HomeAssistant
    ) -> None:
        """Test that unavailable states don't count."""
        set_sensor_state(hass, "sensor.test", "a")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.STATE_CHANGE,
            "trigger_target_changes": 5,
        }
        trigger = StateChangeTrigger(hass, entity, config)
        await trigger.async_setup()

        hass.states.async_set("sensor.test", "unavailable")
        await hass.async_block_till_done()
        assert trigger.change_count == 0

        await trigger.async_teardown()


# ─── 7.4 Runtime Trigger ───────────────────────────────────────────────


class TestRuntimeTrigger:
    """Tests for RuntimeTrigger."""

    async def test_evaluate_threshold(self, hass: HomeAssistant) -> None:
        """Test basic evaluate logic."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "input_boolean.machine",
            "attribute": None,
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 10.0,
        }
        trigger = RuntimeTrigger(hass, entity, config)

        assert trigger.evaluate(0.0) is False
        assert trigger.evaluate(9.9) is False
        assert trigger.evaluate(10.0) is True
        assert trigger.evaluate(100.0) is True

    async def test_accumulation_on_off(self, hass: HomeAssistant) -> None:
        """Test runtime accumulates when entity transitions ON→OFF."""
        set_sensor_state(hass, "input_boolean.washer", "off")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "input_boolean.washer",
            "attribute": None,
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 100.0,
        }
        trigger = RuntimeTrigger(hass, entity, config)
        await trigger.async_setup()

        # Initially OFF → no runtime
        assert trigger.accumulated_hours == 0.0
        assert trigger._on_since_dt is None

        # Turn ON
        t_on = dt_util.utcnow()
        with patch(
            "custom_components.maintenance_supporter.entity.triggers.runtime.dt_util.utcnow",
            return_value=t_on,
        ):
            hass.states.async_set("input_boolean.washer", "on")
            await hass.async_block_till_done()

        assert trigger._on_since_dt is not None

        # Turn OFF 2 hours later
        t_off = t_on + timedelta(hours=2)
        with patch(
            "custom_components.maintenance_supporter.entity.triggers.runtime.dt_util.utcnow",
            return_value=t_off,
        ):
            hass.states.async_set("input_boolean.washer", "off")
            await hass.async_block_till_done()

        assert trigger._on_since_dt is None
        assert 1.99 < trigger.accumulated_hours < 2.01

        # Persistence was called
        coord = entity.coordinator
        assert coord.async_persist_trigger_runtime.call_count >= 2

        await trigger.async_teardown()

    async def test_trigger_fires_at_threshold(self, hass: HomeAssistant) -> None:
        """Test trigger activates when accumulated hours reach threshold."""
        set_sensor_state(hass, "input_boolean.pump", "off")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "input_boolean.pump",
            "attribute": None,
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 1.0,
            "trigger_accumulated_seconds": 3500.0,  # ~0.97 hours
        }
        trigger = RuntimeTrigger(hass, entity, config)
        await trigger.async_setup()

        # Not triggered yet (0.97h < 1.0h)
        assert trigger._triggered is False

        # Turn ON
        t_on = dt_util.utcnow()
        with patch(
            "custom_components.maintenance_supporter.entity.triggers.runtime.dt_util.utcnow",
            return_value=t_on,
        ):
            hass.states.async_set("input_boolean.pump", "on")
            await hass.async_block_till_done()

        # Turn OFF 5 minutes later (accumulated ~1.05h total)
        t_off = t_on + timedelta(minutes=5)
        with patch(
            "custom_components.maintenance_supporter.entity.triggers.runtime.dt_util.utcnow",
            return_value=t_off,
        ):
            hass.states.async_set("input_boolean.pump", "off")
            await hass.async_block_till_done()

        # Should now be triggered
        assert trigger._triggered is True
        entity.async_update_trigger_state.assert_called_with(
            is_triggered=True, current_value=pytest.approx(1.0139, abs=0.01)
        )

        await trigger.async_teardown()

    async def test_reset_clears_accumulation(self, hass: HomeAssistant) -> None:
        """Test reset clears accumulated hours."""
        set_sensor_state(hass, "input_boolean.heater", "on")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "input_boolean.heater",
            "attribute": None,
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 100.0,
            "trigger_accumulated_seconds": 7200.0,  # 2 hours
        }
        trigger = RuntimeTrigger(hass, entity, config)
        await trigger.async_setup()

        assert trigger.accumulated_hours == 2.0

        # Reset
        trigger.reset()
        await hass.async_block_till_done()

        assert trigger.accumulated_hours == 0.0
        # Should still be tracking since entity is ON
        assert trigger._on_since_dt is not None

        await trigger.async_teardown()

    async def test_unavailable_pauses_accumulation(
        self, hass: HomeAssistant
    ) -> None:
        """Test runtime pauses when entity becomes unavailable."""
        set_sensor_state(hass, "switch.pump", "on")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "switch.pump",
            "attribute": None,
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 50.0,
        }

        t0 = dt_util.utcnow()
        with patch(
            "custom_components.maintenance_supporter.entity.triggers.runtime.dt_util.utcnow",
            return_value=t0,
        ):
            trigger = RuntimeTrigger(hass, entity, config)
            await trigger.async_setup()

        # Entity is ON, tracking started
        assert trigger._on_since_dt is not None

        # 1 hour later, becomes unavailable
        t1 = t0 + timedelta(hours=1)
        with patch(
            "custom_components.maintenance_supporter.entity.triggers.runtime.dt_util.utcnow",
            return_value=t1,
        ):
            hass.states.async_set("switch.pump", "unavailable")
            await hass.async_block_till_done()

        # Runtime persisted at ~1 hour, tracking stopped
        assert 0.99 < trigger.accumulated_hours < 1.01
        assert trigger._on_since_dt is None

        # Comes back as OFF
        hass.states.async_set("switch.pump", "off")
        await hass.async_block_till_done()
        assert 0.99 < trigger.accumulated_hours < 1.01

        await trigger.async_teardown()

    async def test_restart_recovery(self, hass: HomeAssistant) -> None:
        """Test accumulated runtime is restored from config after HA restart."""
        on_since_time = dt_util.utcnow() - timedelta(hours=1)
        set_sensor_state(hass, "switch.heater", "on")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "switch.heater",
            "attribute": None,
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 100.0,
            "trigger_accumulated_seconds": 3600.0,  # 1 hour before restart
            "trigger_on_since": on_since_time.isoformat(),
        }
        trigger = RuntimeTrigger(hass, entity, config)
        await trigger.async_setup()

        # Should restore accumulated hours
        assert trigger.accumulated_hours == 1.0
        # Should restore on_since (entity is still ON)
        assert trigger._on_since_dt is not None

        # Current runtime includes ongoing session
        current = trigger.current_runtime_hours
        assert current >= 1.0

        await trigger.async_teardown()

    async def test_properties(self, hass: HomeAssistant) -> None:
        """Test accumulated_hours, current_runtime_hours, remaining_hours."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "input_boolean.test",
            "attribute": None,
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 100.0,
            "trigger_accumulated_seconds": 36000.0,  # 10 hours
        }
        trigger = RuntimeTrigger(hass, entity, config)

        assert trigger.accumulated_hours == 10.0
        assert trigger.remaining_hours == 90.0

    async def test_is_on_states(self, hass: HomeAssistant) -> None:
        """Test _is_on recognizes various on-states."""
        assert RuntimeTrigger._is_on("on") is True
        assert RuntimeTrigger._is_on("On") is True
        assert RuntimeTrigger._is_on("ON") is True
        assert RuntimeTrigger._is_on("true") is True
        assert RuntimeTrigger._is_on("True") is True
        assert RuntimeTrigger._is_on("1") is True
        assert RuntimeTrigger._is_on("off") is False
        assert RuntimeTrigger._is_on("false") is False
        assert RuntimeTrigger._is_on("0") is False
        assert RuntimeTrigger._is_on("unavailable") is False

    async def test_setup_and_teardown(self, hass: HomeAssistant) -> None:
        """Test trigger setup registers listener and teardown removes it."""
        set_sensor_state(hass, "input_boolean.test_setup", "off")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "input_boolean.test_setup",
            "attribute": None,
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 100.0,
        }
        trigger = RuntimeTrigger(hass, entity, config)

        await trigger.async_setup()
        assert trigger._unsub_listener is not None
        assert trigger._unsub_periodic is not None

        await trigger.async_teardown()
        assert trigger._unsub_listener is None
        assert trigger._unsub_periodic is None


# ─── 7.5 Trigger Factory ────────────────────────────────────────────────


class TestTriggerFactory:
    """Test the create_trigger factory function."""

    def test_creates_threshold(self, hass: HomeAssistant) -> None:
        """Test factory creates ThresholdTrigger."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "type": TriggerType.THRESHOLD,
            "trigger_above": 50,
        }
        trigger = create_trigger(hass, entity, config)
        assert isinstance(trigger, ThresholdTrigger)

    def test_creates_counter(self, hass: HomeAssistant) -> None:
        """Test factory creates CounterTrigger."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "type": TriggerType.COUNTER,
            "trigger_target_value": 100,
        }
        trigger = create_trigger(hass, entity, config)
        assert isinstance(trigger, CounterTrigger)

    def test_creates_state_change(self, hass: HomeAssistant) -> None:
        """Test factory creates StateChangeTrigger."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "type": TriggerType.STATE_CHANGE,
            "trigger_target_changes": 5,
        }
        trigger = create_trigger(hass, entity, config)
        assert isinstance(trigger, StateChangeTrigger)

    def test_creates_runtime(self, hass: HomeAssistant) -> None:
        """Test factory creates RuntimeTrigger."""
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "input_boolean.machine",
            "type": TriggerType.RUNTIME,
            "trigger_runtime_hours": 500,
        }
        trigger = create_trigger(hass, entity, config)
        assert isinstance(trigger, RuntimeTrigger)

    def test_unknown_type_raises(self, hass: HomeAssistant) -> None:
        """Test factory raises on unknown type."""
        entity = _make_mock_entity(hass)
        config = {"entity_id": "sensor.test", "type": "unknown"}
        with pytest.raises(ValueError):
            create_trigger(hass, entity, config)


# ─── 7.5 Events ─────────────────────────────────────────────────────────


async def test_trigger_fires_activation_event(
    hass: HomeAssistant,
) -> None:
    """Test that trigger activation fires an HA event."""
    set_sensor_state(hass, "sensor.pressure", "1.0")
    entity = _make_mock_entity(hass)
    config = {
        "entity_id": "sensor.pressure",
        "attribute": None,
        "type": TriggerType.THRESHOLD,
        "trigger_above": 1.5,
    }
    trigger = ThresholdTrigger(hass, entity, config)
    await trigger.async_setup()

    events = []
    hass.bus.async_listen(EVENT_TRIGGER_ACTIVATED, lambda e: events.append(e))

    # Trigger by setting value above threshold
    hass.states.async_set("sensor.pressure", "2.0")
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data["trigger_entity"] == "sensor.pressure"

    await trigger.async_teardown()


async def test_trigger_fires_deactivation_event(
    hass: HomeAssistant,
) -> None:
    """Test that trigger deactivation fires an HA event."""
    set_sensor_state(hass, "sensor.pressure", "2.0")
    entity = _make_mock_entity(hass)
    config = {
        "entity_id": "sensor.pressure",
        "attribute": None,
        "type": TriggerType.THRESHOLD,
        "trigger_above": 1.5,
    }
    trigger = ThresholdTrigger(hass, entity, config)
    await trigger.async_setup()

    events = []
    hass.bus.async_listen(EVENT_TRIGGER_DEACTIVATED, lambda e: events.append(e))

    # Go back below threshold
    hass.states.async_set("sensor.pressure", "1.0")
    await hass.async_block_till_done()

    assert len(events) == 1

    await trigger.async_teardown()


# ─── 7.6 Sensor Attribute Exposure ─────────────────────────────────────


async def test_counter_sensor_exposes_baseline_and_delta(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that counter trigger sensor exposes baseline_value and current_delta."""
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Set up a monitored sensor at 575
    set_sensor_state(hass, "sensor.runtime_hours", "575")

    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        schedule_type="sensor_based",
        trigger_config={
            "entity_id": "sensor.runtime_hours",
            "attribute": None,
            "type": "counter",
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 500,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Counter Baseline Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Counter Baseline Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_counter_baseline_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None

    # Baseline should be exposed (from config or live trigger)
    assert "trigger_baseline_value" in state.attributes
    assert state.attributes["trigger_baseline_value"] == 500.0

    # Current delta should be exposed (575 - 500 = 75)
    assert "trigger_current_delta" in state.attributes
    assert state.attributes["trigger_current_delta"] == 75.0


async def test_counter_sensor_fallback_when_trigger_entity_missing(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test counter attributes fall back to config when trigger entity doesn't exist."""
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Don't create sensor.nonexistent — trigger entity won't be found

    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        schedule_type="sensor_based",
        trigger_config={
            "entity_id": "sensor.nonexistent_counter",
            "attribute": None,
            "type": "counter",
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 250.0,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Counter Fallback Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Counter Fallback Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_counter_fallback_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    state = hass.states.get(sensor_entities[0].entity_id)
    # Entity may be unavailable because trigger entity is missing
    # But we can still check: if the state is available, check attributes
    if state and state.state != "unavailable":
        assert state.attributes.get("trigger_baseline_value") == 250.0
        assert state.attributes.get("trigger_current_delta") is None


async def test_state_change_sensor_exposes_change_count(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that state_change trigger sensor exposes trigger_change_count."""
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Set up a binary sensor to monitor
    set_sensor_state(hass, "binary_sensor.door_trigger", "off")

    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        schedule_type="sensor_based",
        trigger_config={
            "entity_id": "binary_sensor.door_trigger",
            "attribute": None,
            "type": "state_change",
            "trigger_from_state": "off",
            "trigger_to_state": "on",
            "trigger_target_changes": 5,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="State Change Count Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="State Change Count Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_state_change_count_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None

    # change_count should start at 0
    assert "trigger_change_count" in state.attributes
    assert state.attributes["trigger_change_count"] == 0

    # Simulate 2 transitions: off→on, on→off, off→on
    hass.states.async_set("binary_sensor.door_trigger", "on")
    await hass.async_block_till_done()
    hass.states.async_set("binary_sensor.door_trigger", "off")
    await hass.async_block_till_done()
    hass.states.async_set("binary_sensor.door_trigger", "on")
    await hass.async_block_till_done()

    # Force coordinator refresh so entity state gets updated
    runtime = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if runtime and runtime.coordinator:
        await runtime.coordinator.async_refresh()
        await hass.async_block_till_done()

    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None
    assert state.attributes["trigger_change_count"] == 2


async def test_state_change_sensor_fallback_when_trigger_entity_missing(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test state_change attributes fall back to config when trigger entity missing."""
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Don't create the trigger entity

    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        schedule_type="sensor_based",
        trigger_config={
            "entity_id": "sensor.nonexistent_state_change",
            "attribute": None,
            "type": "state_change",
            "trigger_from_state": "off",
            "trigger_to_state": "on",
            "trigger_target_changes": 5,
            "trigger_change_count": 3,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="State Change Fallback Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="State Change Fallback Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_state_change_fallback_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    state = hass.states.get(sensor_entities[0].entity_id)
    # Entity may be unavailable because trigger entity is missing
    if state and state.state != "unavailable":
        # Should fall back to config value
        assert state.attributes.get("trigger_change_count") == 3


# ─── 7.7 Bug Fixes: Status recomputation on trigger callback ──────────


async def test_status_updates_immediately_on_trigger_activation(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that sensor status changes to 'triggered' immediately when trigger fires.

    Bug: async_update_trigger_state set _trigger_active but did not recompute _status,
    so native_value stayed at the old status until the next coordinator refresh.
    """
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Threshold trigger with trigger_for_minutes=0 (immediate)
    set_sensor_state(hass, "sensor.test_pressure", "1.0")

    task = build_task_data(
        schedule_type="sensor_based",
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        trigger_config={
            "entity_id": "sensor.test_pressure",
            "attribute": None,
            "type": "threshold",
            "trigger_above": 2.0,
            "trigger_for_minutes": 0,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Immediate Status Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Immediate Status Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_immediate_status_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1
    entity_id = sensor_entities[0].entity_id

    # Initial state should not be triggered (1.0 < 2.0)
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state != MaintenanceStatus.TRIGGERED

    # Push value above threshold → trigger fires
    set_sensor_state(hass, "sensor.test_pressure", "3.0")
    await hass.async_block_till_done()

    # Status should be 'triggered' IMMEDIATELY without coordinator refresh
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state == MaintenanceStatus.TRIGGERED
    assert state.attributes.get("trigger_active") is True


async def test_status_updates_immediately_on_trigger_deactivation(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that sensor status reverts when trigger deactivates.

    After trigger was active and value returns to normal, the status should
    change back from 'triggered' without waiting for coordinator refresh.
    """
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Start with value above threshold (already triggered)
    set_sensor_state(hass, "sensor.test_deactivate", "5.0")

    task = build_task_data(
        schedule_type="sensor_based",
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        interval_days=90,
        trigger_config={
            "entity_id": "sensor.test_deactivate",
            "attribute": None,
            "type": "threshold",
            "trigger_above": 2.0,
            "trigger_for_minutes": 0,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Deactivation Status Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Deactivation Status Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_deactivation_status_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1
    entity_id = sensor_entities[0].entity_id

    # Should start as triggered (5.0 > 2.0)
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state == MaintenanceStatus.TRIGGERED

    # Push value below threshold → trigger deactivates
    set_sensor_state(hass, "sensor.test_deactivate", "1.0")
    await hass.async_block_till_done()

    # Status should change back immediately
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state != MaintenanceStatus.TRIGGERED
    assert state.attributes.get("trigger_active") is False


# ─── 7.8 Bug Fixes: Coordinator fallback trigger evaluation ───────────


async def test_coordinator_fallback_evaluates_threshold(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that coordinator _evaluate_trigger_fallback evaluates threshold conditions.

    Bug: The fallback only read the current value but did not check if the threshold
    condition was met, so _trigger_active was never set by the coordinator.
    """
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Set sensor below threshold
    set_sensor_state(hass, "sensor.fallback_pressure", "0.5")

    task = build_task_data(
        schedule_type="sensor_based",
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        interval_days=90,
        trigger_config={
            "entity_id": "sensor.fallback_pressure",
            "attribute": None,
            "type": "threshold",
            "trigger_below": 1.0,
            "trigger_for_minutes": 0,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Fallback Threshold Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Fallback Threshold Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_fallback_threshold_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1
    entity_id = sensor_entities[0].entity_id

    # After coordinator refresh, trigger should be active via fallback
    runtime = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if runtime and runtime.coordinator:
        await runtime.coordinator.async_refresh()
        await hass.async_block_till_done()

    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state == MaintenanceStatus.TRIGGERED
    assert state.attributes.get("trigger_active") is True


async def test_coordinator_fallback_evaluates_counter_delta(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that coordinator fallback evaluates counter delta condition."""
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Value 600, baseline 500, delta_mode with target 50 → delta=100 >= 50 → triggered
    set_sensor_state(hass, "sensor.fallback_counter", "600")

    task = build_task_data(
        schedule_type="sensor_based",
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        interval_days=365,
        trigger_config={
            "entity_id": "sensor.fallback_counter",
            "attribute": None,
            "type": "counter",
            "trigger_target_value": 50,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 500,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Fallback Counter Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Fallback Counter Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_fallback_counter_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1
    entity_id = sensor_entities[0].entity_id

    # After coordinator refresh, counter condition should be evaluated
    runtime = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if runtime and runtime.coordinator:
        await runtime.coordinator.async_refresh()
        await hass.async_block_till_done()

    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state == MaintenanceStatus.TRIGGERED
    assert state.attributes.get("trigger_active") is True


async def test_coordinator_fallback_threshold_with_for_minutes_skips_activation(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that coordinator fallback does NOT activate threshold with for_minutes > 0.

    The timer-based activation must be handled by the event-driven trigger,
    not by the coordinator fallback which has no timer concept.
    """
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # Value below threshold, but for_minutes=30 means coordinator can't activate
    set_sensor_state(hass, "sensor.fallback_timed", "0.5")

    task = build_task_data(
        schedule_type="sensor_based",
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        interval_days=90,
        trigger_config={
            "entity_id": "sensor.fallback_timed",
            "attribute": None,
            "type": "threshold",
            "trigger_below": 1.0,
            "trigger_for_minutes": 30,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Fallback Timer Skip Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Fallback Timer Skip Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_fallback_timer_skip_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1
    entity_id = sensor_entities[0].entity_id

    # Coordinator should NOT activate trigger (for_minutes > 0)
    runtime = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if runtime and runtime.coordinator:
        await runtime.coordinator.async_refresh()
        await hass.async_block_till_done()

    state = hass.states.get(entity_id)
    assert state is not None
    # Should NOT be triggered (timer handling is event-driven only)
    assert state.state != MaintenanceStatus.TRIGGERED
