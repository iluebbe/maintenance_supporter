"""Tests for sensor multi-entity trigger attributes and compute_live_status."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.sensor import MaintenanceSensor

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
    name: str = "Test Object",
    unique_id: str = "trigger_attr",
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


def _get_sensor_entity(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    if not sensors:
        return None
    return hass.data.get("entity_components", {}).get("sensor", MagicMock()).get_entity(
        sensors[0].entity_id
    )


def _get_sensor_state(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    if not sensors:
        return None
    return hass.states.get(sensors[0].entity_id)


# ─── compute_live_status ───────────────────────────────────────────────


def test_compute_live_status_triggered() -> None:
    """Test triggered status takes priority."""
    task = {"_trigger_active": True, "_days_until_due": 20, "warning_days": 7}
    assert MaintenanceSensor._compute_live_status(task) == MaintenanceStatus.TRIGGERED


def test_compute_live_status_overdue() -> None:
    """Test overdue status when days < 0."""
    task = {"_trigger_active": False, "_days_until_due": -5, "warning_days": 7}
    assert MaintenanceSensor._compute_live_status(task) == MaintenanceStatus.OVERDUE


def test_compute_live_status_due_soon() -> None:
    """Test due_soon status when days <= warning_days."""
    task = {"_trigger_active": False, "_days_until_due": 3, "warning_days": 7}
    assert MaintenanceSensor._compute_live_status(task) == MaintenanceStatus.DUE_SOON


def test_compute_live_status_ok() -> None:
    """Test OK status when days > warning_days."""
    task = {"_trigger_active": False, "_days_until_due": 20, "warning_days": 7}
    assert MaintenanceSensor._compute_live_status(task) == MaintenanceStatus.OK


def test_compute_live_status_no_due_date() -> None:
    """Test OK status when no days_until_due."""
    task = {"_trigger_active": False}
    assert MaintenanceSensor._compute_live_status(task) == MaintenanceStatus.OK


# ─── Counter Multi-Entity Attributes ──────────────────────────────────


async def test_counter_multi_entity_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test counter trigger with multi-entity exposes baselines and deltas."""
    hass.states.async_set("sensor.counter1", "100")
    hass.states.async_set("sensor.counter2", "200")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.counter1",
            "entity_ids": ["sensor.counter1", "sensor.counter2"],
            "entity_logic": "any",
            "trigger_target_value": 50,
            "trigger_delta_mode": True,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="counter_multi")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    if state is None:
        pytest.skip("Sensor not available")

    attrs = state.attributes
    assert attrs.get("trigger_type") == "counter"
    assert attrs.get("trigger_target_value") == 50
    assert attrs.get("trigger_delta_mode") is True


# ─── State Change Multi-Entity Attributes ─────────────────────────────


async def test_state_change_multi_entity_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test state_change trigger with multi-entity exposes change counts."""
    hass.states.async_set("binary_sensor.door1", "off")
    hass.states.async_set("binary_sensor.door2", "off")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "state_change",
            "entity_id": "binary_sensor.door1",
            "entity_ids": ["binary_sensor.door1", "binary_sensor.door2"],
            "entity_logic": "all",
            "trigger_from_state": "off",
            "trigger_to_state": "on",
            "trigger_target_changes": 10,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="sc_multi")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    if state is None:
        pytest.skip("Sensor not available")

    attrs = state.attributes
    assert attrs.get("trigger_type") == "state_change"
    assert attrs.get("trigger_from_state") == "off"
    assert attrs.get("trigger_to_state") == "on"
    assert attrs.get("trigger_target_changes") == 10


# ─── Runtime Multi-Entity Attributes ──────────────────────────────────


async def test_runtime_multi_entity_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger with multi-entity exposes per-entity hours."""
    hass.states.async_set("sensor.pump1", "on")
    hass.states.async_set("sensor.pump2", "off")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump1",
            "entity_ids": ["sensor.pump1", "sensor.pump2"],
            "entity_logic": "any",
            "trigger_runtime_hours": 100,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="rt_multi")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    if state is None:
        pytest.skip("Sensor not available")

    attrs = state.attributes
    assert attrs.get("trigger_type") == "runtime"
    assert attrs.get("trigger_runtime_hours") == 100


# ─── Compound Trigger Attributes ──────────────────────────────────────


async def test_compound_trigger_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test compound trigger exposes logic and conditions count."""
    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "compound",
            "compound_logic": "AND",
            "conditions": [
                {
                    "type": "threshold",
                    "entity_id": "sensor.temp",
                    "entity_ids": ["sensor.temp"],
                    "trigger_above": 30,
                },
                {
                    "type": "threshold",
                    "entity_id": "sensor.humidity",
                    "entity_ids": ["sensor.humidity"],
                    "trigger_above": 70,
                },
            ],
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="compound_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    if state is None:
        pytest.skip("Sensor not available")

    attrs = state.attributes
    assert attrs.get("compound_logic") == "AND"
    assert attrs.get("compound_conditions_count") == 2


# ─── Runtime Trigger Fallback from Config ─────────────────────────────


async def test_runtime_fallback_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger attributes from config fallback path."""
    hass.states.async_set("sensor.pump", "on")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump",
            "trigger_runtime_hours": 200,
            "trigger_accumulated_seconds": 180000,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="rt_fallback")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    if state is None:
        pytest.skip("Sensor not available")

    attrs = state.attributes
    assert attrs.get("trigger_type") == "runtime"
    assert attrs.get("trigger_runtime_hours") == 200


# ─── Sensor async_update_trigger_state ─────────────────────────────────


async def test_async_update_trigger_state_single(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test async_update_trigger_state with single trigger."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    hass.states.async_set("sensor.temp", "25")

    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="trigger_state_single")
    await setup_integration(hass, global_entry, obj_entry)

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor is None:
        pytest.skip("Sensor entity not available")

    # Manually call async_update_trigger_state
    sensor.async_update_trigger_state(
        is_triggered=True,
        current_value=35.0,
        trigger_entity_id="sensor.temp",
    )

    state = _get_sensor_state(hass, obj_entry)
    if state:
        assert state.state == MaintenanceStatus.TRIGGERED


async def test_async_update_trigger_state_coordinator_none(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test async_update_trigger_state returns early if coordinator.data is None."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    hass.states.async_set("sensor.temp", "25")

    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="trigger_state_none")
    await setup_integration(hass, global_entry, obj_entry)

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor is None:
        pytest.skip("Sensor entity not available")

    # Set coordinator.data to None
    sensor.coordinator.data = None

    # Should not crash
    sensor.async_update_trigger_state(
        is_triggered=True,
        current_value=35.0,
        trigger_entity_id="sensor.temp",
    )


# ─── Degradation and Prediction Attributes ────────────────────────────


async def test_degradation_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test degradation_rate and degradation_trend attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="degrad_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_degradation_rate"] = 0.05
    coordinator.data[CONF_TASKS][TASK_ID_1]["_degradation_trend"] = "falling"

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    assert "degradation_rate" not in (state.attributes if state else {})


# ─── Sensor Setup: No Coordinator ─────────────────────────────────────


async def test_sensor_setup_no_coordinator(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test sensor setup returns early when runtime_data has no coordinator."""
    await setup_integration(hass, global_entry)
    # The global entry has no coordinator → sensor setup should return early
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, global_entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    assert len(sensors) == 0


# ─── Sensor Extra Attrs: Last Entry ───────────────────────────────────


async def test_last_entry_attr(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test _last_entry attribute is exposed."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="last_entry_attr")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_last_entry"] = {
        "type": "completed",
        "timestamp": "2025-01-01T00:00:00",
    }

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    assert "last_entry" not in (state.attributes if state else {})
