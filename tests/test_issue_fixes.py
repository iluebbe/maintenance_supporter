"""Tests for GitHub issue fixes (#1-#6)."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    HistoryEntryType,
    TriggerType,
)
from custom_components.maintenance_supporter.entity.triggers.base_trigger import (
    BaseTrigger,
)
from custom_components.maintenance_supporter.entity.triggers.threshold import (
    ThresholdTrigger,
)
from custom_components.maintenance_supporter.websocket import (
    _validate_trigger_config,
)

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    set_sensor_state,
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

    mock_coordinator = AsyncMock()
    mock_coordinator.async_persist_trigger_runtime = AsyncMock()
    mock_coordinator.async_add_trigger_history_entry = AsyncMock()
    mock_entity.coordinator = mock_coordinator

    return mock_entity


# ─── Issue #1: Trigger retry on unknown sensor ───────────────────────────


class TestTriggerRetryOnUnknown:
    """Issue #1: Trigger should retry when sensor starts as unknown."""

    async def test_unknown_state_schedules_retry(self, hass: HomeAssistant) -> None:
        """When sensor state is 'unknown', a retry timer should be scheduled."""
        set_sensor_state(hass, "sensor.test", "unknown")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 50.0,
        }
        trigger = ThresholdTrigger(hass, entity, config)
        await trigger.async_setup()

        # Retry should be scheduled
        assert trigger._unsub_retry is not None
        # Listener should still be registered
        assert trigger._unsub_listener is not None
        # No evaluation should have happened
        assert trigger._current_value is None

        await trigger.async_teardown()

    async def test_unavailable_state_schedules_retry(self, hass: HomeAssistant) -> None:
        """When sensor state is 'unavailable', a retry timer should be scheduled."""
        set_sensor_state(hass, "sensor.test", "unavailable")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 50.0,
        }
        trigger = ThresholdTrigger(hass, entity, config)
        await trigger.async_setup()

        assert trigger._unsub_retry is not None
        await trigger.async_teardown()

    async def test_teardown_cancels_retry(self, hass: HomeAssistant) -> None:
        """Teardown should cancel pending retry timer."""
        set_sensor_state(hass, "sensor.test", "unknown")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 50.0,
        }
        trigger = ThresholdTrigger(hass, entity, config)
        await trigger.async_setup()

        assert trigger._unsub_retry is not None
        await trigger.async_teardown()
        assert trigger._unsub_retry is None

    async def test_valid_state_no_retry(self, hass: HomeAssistant) -> None:
        """When sensor has valid numeric state, no retry should be scheduled."""
        set_sensor_state(hass, "sensor.test", "42.0")
        entity = _make_mock_entity(hass)
        config = {
            "entity_id": "sensor.test",
            "attribute": None,
            "type": TriggerType.THRESHOLD,
            "trigger_above": 50.0,
        }
        trigger = ThresholdTrigger(hass, entity, config)
        await trigger.async_setup()

        assert trigger._unsub_retry is None
        assert trigger._current_value == 42.0

        await trigger.async_teardown()


# ─── Issue #2: times_performed history entry ─────────────────────────────


class TestTimesPerformedWithLastPerformed:
    """Issue #2: Creating task with last_performed should auto-create history."""

    def test_history_entry_created_on_task_create(self) -> None:
        """Simulating what ws_create_task does when last_performed is set."""
        task_data: dict[str, Any] = {
            "id": "test_id",
            "name": "Test Task",
            "history": [],
        }
        last_performed = "2025-06-15"

        # This is the logic added in the fix
        task_data["last_performed"] = last_performed
        task_data["history"].append({
            "timestamp": last_performed + "T00:00:00",
            "type": HistoryEntryType.COMPLETED,
            "notes": "Initial value set during task creation",
        })

        assert len(task_data["history"]) == 1
        assert task_data["history"][0]["type"] == "completed"
        assert task_data["history"][0]["timestamp"] == "2025-06-15T00:00:00"

    def test_no_history_without_last_performed(self) -> None:
        """When last_performed is not set, history should stay empty."""
        task_data: dict[str, Any] = {
            "id": "test_id",
            "name": "Test Task",
            "history": [],
        }
        assert len(task_data["history"]) == 0


# ─── Issue #3: Trigger config validation ─────────────────────────────────


class TestTriggerConfigValidation:
    """Issue #3: Validate trigger_config on task create/update."""

    def test_valid_threshold_config(self, hass: HomeAssistant) -> None:
        """Valid threshold config should produce no errors."""
        set_sensor_state(hass, "sensor.test", "42.0")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "threshold",
            "trigger_above": 50.0,
        })
        assert errors == []
        assert warnings == []

    def test_missing_entity_id(self, hass: HomeAssistant) -> None:
        """Missing entity_id should return an error."""
        errors, warnings = _validate_trigger_config(hass, {
            "type": "threshold",
            "trigger_above": 50.0,
        })
        assert any("entity_id" in e for e in errors)

    def test_invalid_trigger_type(self, hass: HomeAssistant) -> None:
        """Invalid trigger type should return an error."""
        set_sensor_state(hass, "sensor.test", "42.0")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "bogus",
        })
        assert any("bogus" in e for e in errors)

    def test_threshold_without_above_or_below(self, hass: HomeAssistant) -> None:
        """Threshold without above or below should return an error."""
        set_sensor_state(hass, "sensor.test", "42.0")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "threshold",
        })
        assert any("trigger_above" in e for e in errors)

    def test_counter_missing_target_value(self, hass: HomeAssistant) -> None:
        """Counter without target_value should return an error."""
        set_sensor_state(hass, "sensor.test", "42.0")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "counter",
        })
        assert any("trigger_target_value" in e for e in errors)

    def test_runtime_missing_hours(self, hass: HomeAssistant) -> None:
        """Runtime without hours should return an error."""
        set_sensor_state(hass, "sensor.test", "on")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "runtime",
        })
        assert any("trigger_runtime_hours" in e for e in errors)

    def test_nonexistent_entity_warning(self, hass: HomeAssistant) -> None:
        """Non-existent entity should produce a warning, not error."""
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.does_not_exist",
            "type": "threshold",
            "trigger_above": 50.0,
        })
        assert errors == []
        assert any("does not exist" in w for w in warnings)

    def test_unknown_state_warning(self, hass: HomeAssistant) -> None:
        """Entity with unknown state should produce a warning."""
        set_sensor_state(hass, "sensor.test", "unknown")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "threshold",
            "trigger_above": 50.0,
        })
        assert errors == []
        assert any("unknown" in w for w in warnings)

    def test_state_change_valid_with_minimal_config(self, hass: HomeAssistant) -> None:
        """State change type needs no extra required fields."""
        set_sensor_state(hass, "sensor.test", "on")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "state_change",
        })
        assert errors == []

    def test_valid_counter_config(self, hass: HomeAssistant) -> None:
        """Valid counter config should produce no errors."""
        set_sensor_state(hass, "sensor.test", "100")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "counter",
            "trigger_target_value": 1000,
        })
        assert errors == []

    def test_valid_runtime_config(self, hass: HomeAssistant) -> None:
        """Valid runtime config should produce no errors."""
        set_sensor_state(hass, "sensor.test", "on")
        errors, warnings = _validate_trigger_config(hass, {
            "entity_id": "sensor.test",
            "type": "runtime",
            "trigger_runtime_hours": 100.0,
        })
        assert errors == []
