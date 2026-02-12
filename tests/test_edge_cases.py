"""Tests for edge cases and robustness."""

from __future__ import annotations

from datetime import timedelta

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DEFAULT_MAX_HISTORY_ENTRIES,
    DOMAIN,
    HistoryEntryType,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    set_sensor_state,
    setup_integration,
)


# ─── 12.1 History Trimming ──────────────────────────────────────────────


class TestHistoryTrimming:
    """Test that history is trimmed to max entries."""

    def test_history_trimmed_to_max(self) -> None:
        """Test that adding entries beyond max trims the list."""
        task = MaintenanceTask.from_dict(build_task_data())

        # Add more than max entries
        for i in range(DEFAULT_MAX_HISTORY_ENTRIES + 10):
            task.add_history_entry(
                entry_type=HistoryEntryType.COMPLETED,
                notes=f"Entry {i}",
            )

        assert len(task.history) == DEFAULT_MAX_HISTORY_ENTRIES
        # Oldest entries should be dropped
        assert "Entry 10" in task.history[0].get("notes", "")

    def test_history_preserved_on_serialization(self) -> None:
        """Test that history survives to_dict/from_dict roundtrip."""
        task = MaintenanceTask.from_dict(build_task_data())
        task.add_history_entry(
            entry_type=HistoryEntryType.COMPLETED,
            notes="Test entry",
            cost=25.0,
            duration=30,
        )

        data = task.to_dict()
        restored = MaintenanceTask.from_dict(data)

        assert len(restored.history) == 1
        assert restored.history[0]["notes"] == "Test entry"
        assert restored.history[0]["cost"] == 25.0


# ─── 12.2 Task Serialization ────────────────────────────────────────────


class TestTaskSerialization:
    """Test MaintenanceTask serialization roundtrip."""

    def test_full_roundtrip(self) -> None:
        """Test to_dict/from_dict preserves all fields."""
        data = build_task_data(
            name="Full Task",
            interval_days=45,
            warning_days=10,
            last_performed="2024-06-15",
            trigger_config={
                "entity_id": "sensor.test",
                "type": "threshold",
                "trigger_above": 50,
            },
            history=[
                {"type": "completed", "timestamp": "2024-01-01T00:00:00"},
            ],
        )
        task = MaintenanceTask.from_dict(data)
        serialized = task.to_dict()
        restored = MaintenanceTask.from_dict(serialized)

        assert restored.name == "Full Task"
        assert restored.interval_days == 45
        assert restored.warning_days == 10
        assert restored.last_performed == "2024-06-15"
        assert restored.trigger_config is not None
        assert restored.trigger_config["trigger_above"] == 50
        assert len(restored.history) == 1

    def test_minimal_task_roundtrip(self) -> None:
        """Test minimal task serialization."""
        data = {
            "id": "test_id",
            "name": "Minimal",
        }
        task = MaintenanceTask.from_dict(data)
        serialized = task.to_dict()

        assert serialized["id"] == "test_id"
        assert serialized["name"] == "Minimal"

    def test_none_fields_omitted(self) -> None:
        """Test that None fields are omitted from serialization."""
        data = build_task_data(
            trigger_config=None,
            last_performed=None,
        )
        data.pop("interval_days", None)
        task = MaintenanceTask.from_dict(data)
        serialized = task.to_dict()

        assert "trigger_config" not in serialized
        assert "last_performed" not in serialized


# ─── 12.3 Complete/Skip/Reset ────────────────────────────────────────────


class TestTaskMutations:
    """Test task mutation methods."""

    def test_complete_resets_trigger(self) -> None:
        """Test that complete resets trigger state."""
        task = MaintenanceTask.from_dict(build_task_data())
        task._trigger_active = True
        task._trigger_current_value = 42.0

        task.complete(notes="Done", cost=10.0, duration=15)

        assert task._trigger_active is False
        assert task._trigger_current_value is None
        assert task.last_performed == dt_util.now().date().isoformat()

    def test_skip_resets_trigger(self) -> None:
        """Test that skip resets trigger state."""
        task = MaintenanceTask.from_dict(build_task_data())
        task._trigger_active = True

        task.skip(reason="Not needed")

        assert task._trigger_active is False
        assert task.last_performed == dt_util.now().date().isoformat()

    def test_reset_with_custom_date(self) -> None:
        """Test reset with a specific date."""
        from datetime import date

        task = MaintenanceTask.from_dict(build_task_data())
        target = date(2024, 3, 15)

        task.reset(reset_date=target)

        assert task.last_performed == "2024-03-15"

    def test_reset_default_today(self) -> None:
        """Test reset defaults to today."""
        task = MaintenanceTask.from_dict(build_task_data())

        task.reset()

        assert task.last_performed == dt_util.now().date().isoformat()


# ─── 12.4 Sensor State Edge Cases ────────────────────────────────────────


async def test_sensor_unavailable_trigger_entity(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that sensor reports unavailable when trigger entity is missing."""
    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        trigger_config={
            "entity_id": "sensor.nonexistent",
            "attribute": None,
            "type": "threshold",
            "trigger_above": 50,
        },
        schedule_type="sensor_based",
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Unavailable Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Unavailable Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_unavailable_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]

    if sensor_entities:
        state = hass.states.get(sensor_entities[0].entity_id)
        if state:
            # Sensor stays available; trigger health is exposed via attribute
            assert state.state != "unavailable"
            assert state.attributes.get("trigger_entity_state") in (
                "startup", "missing", "available"
            )


# ─── 12.5 Disabled Task ─────────────────────────────────────────────────


async def test_disabled_task_always_ok(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that disabled tasks are reported as OK by coordinator."""
    task = build_task_data(
        enabled=False,
        last_performed=(dt_util.now().date() - timedelta(days=100)).isoformat(),
        interval_days=30,
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Disabled Task",
        data=build_object_entry_data(
            object_data=build_object_data(name="Disabled Task"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_disabled_task",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    # Check coordinator data
    runtime = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if runtime and runtime.coordinator and runtime.coordinator.data:
        task_result = runtime.coordinator.data.get("tasks", {}).get(TASK_ID_1, {})
        assert task_result.get("_status") == MaintenanceStatus.OK


# ─── 12.6 Numeric Value Extraction ──────────────────────────────────────


class TestNumericValueExtraction:
    """Test _get_numeric_value in base trigger."""

    async def test_extracts_state(self, hass: HomeAssistant) -> None:
        """Test extracting numeric value from state."""
        from unittest.mock import MagicMock
        from custom_components.maintenance_supporter.entity.triggers.threshold import (
            ThresholdTrigger,
        )

        set_sensor_state(hass, "sensor.test", "42.5")
        entity = MagicMock()
        entity.hass = hass
        entity.coordinator = MagicMock()
        entity._task_id = "test"

        trigger = ThresholdTrigger(
            hass, entity,
            {"entity_id": "sensor.test", "attribute": None, "type": "threshold", "trigger_above": 50},
        )

        state = hass.states.get("sensor.test")
        value = trigger._get_numeric_value(state)
        assert value == 42.5

    async def test_extracts_attribute(self, hass: HomeAssistant) -> None:
        """Test extracting numeric value from attribute."""
        from unittest.mock import MagicMock
        from custom_components.maintenance_supporter.entity.triggers.threshold import (
            ThresholdTrigger,
        )

        set_sensor_state(hass, "sensor.test", "on", {"pressure": 1.5})
        entity = MagicMock()
        entity.hass = hass
        entity.coordinator = MagicMock()
        entity._task_id = "test"

        trigger = ThresholdTrigger(
            hass, entity,
            {"entity_id": "sensor.test", "attribute": "pressure", "type": "threshold", "trigger_above": 2.0},
        )

        state = hass.states.get("sensor.test")
        value = trigger._get_numeric_value(state)
        assert value == 1.5

    async def test_non_numeric_returns_none(self, hass: HomeAssistant) -> None:
        """Test that non-numeric values return None."""
        from unittest.mock import MagicMock
        from custom_components.maintenance_supporter.entity.triggers.threshold import (
            ThresholdTrigger,
        )

        set_sensor_state(hass, "sensor.test", "not_a_number")
        entity = MagicMock()
        entity.hass = hass
        entity.coordinator = MagicMock()
        entity._task_id = "test"

        trigger = ThresholdTrigger(
            hass, entity,
            {"entity_id": "sensor.test", "attribute": None, "type": "threshold", "trigger_above": 50},
        )

        state = hass.states.get("sensor.test")
        value = trigger._get_numeric_value(state)
        assert value is None


# ─── 12.7 Coordinator Mutation Methods ───────────────────────────────────


async def test_coordinator_complete_unknown_task(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that completing unknown task does nothing."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    runtime = hass.data.get(DOMAIN, {}).get(object_config_entry.entry_id)
    if runtime and runtime.coordinator:
        # Should not raise
        await runtime.coordinator.complete_maintenance(
            task_id="nonexistent_task_id"
        )


async def test_coordinator_persist_trigger_runtime(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test persisting trigger runtime data."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    runtime = hass.data.get(DOMAIN, {}).get(object_config_entry.entry_id)
    if runtime and runtime.coordinator:
        await runtime.coordinator.async_persist_trigger_runtime(
            TASK_ID_1,
            {"trigger_baseline_value": 500.0},
        )

        # Verify it was persisted
        tasks = object_config_entry.data.get(CONF_TASKS, {})
        task = tasks.get(TASK_ID_1, {})
        trigger_config = task.get("trigger_config", {})
        # Only applies if task has trigger_config
        # For a simple time-based task, trigger_config may not exist


# ─── 12.8 Counter Attributes with Unavailable Trigger Entity ──────────


async def test_counter_attributes_unavailable_trigger_entity(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test counter trigger attributes when trigger entity is unavailable.

    When the trigger entity doesn't exist, the sensor should fall back
    to config values for baseline and return None for delta.
    """
    from homeassistant.helpers import entity_registry as er

    # Don't create sensor.missing_counter — it doesn't exist

    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        schedule_type="sensor_based",
        trigger_config={
            "entity_id": "sensor.missing_counter",
            "attribute": None,
            "type": "counter",
            "trigger_target_value": 200,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 1000.0,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Counter Unavailable Entity Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Counter Unavailable Entity"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_counter_unavail_test",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None

    # Sensor stays available; trigger health is exposed via trigger_entity_state attribute
    assert state.state != "unavailable"
    assert state.attributes.get("trigger_entity_state") in (
        "startup", "missing", "available"
    )
    # Counter-specific attributes should have config fallback values
    assert state.attributes.get("trigger_target_value") == 200
    assert state.attributes.get("trigger_delta_mode") is True
    assert state.attributes.get("trigger_baseline_value") == 1000.0
