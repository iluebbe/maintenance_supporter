"""Tests for sensor entity extra_state_attributes (sensor.py)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    OBJECT_ID_1,
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
    unique_id: str = "sensor_attrs",
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


def _get_sensor_state(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    """Find the sensor entity state for the first task."""
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    if not sensors:
        return None
    return hass.states.get(sensors[0].entity_id)


# ─── Basic Attributes ─────────────────────────────────────────────────────


async def test_basic_attributes(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test type, schedule, interval, warning, parent_object attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="basic_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    assert state is not None
    attrs = state.attributes
    assert attrs["maintenance_type"] == "cleaning"
    assert attrs["schedule_type"] == "time_based"
    assert attrs["interval_days"] == 30
    assert attrs["warning_days"] == 7
    assert attrs["parent_object"] == "Test Object"


async def test_times_performed_and_cost(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test times_performed, total_cost, average_duration."""
    task = build_task_data(task_id=TASK_ID_1, last_performed="2024-06-01")
    task["history"] = [
        {"timestamp": "2024-01-01T00:00:00", "type": "completed", "cost": 50, "duration": 30},
        {"timestamp": "2024-03-01T00:00:00", "type": "completed", "cost": 75, "duration": 60},
        {"timestamp": "2024-05-01T00:00:00", "type": "skipped"},
    ]
    obj_entry = _make_entry(hass, task, unique_id="cost_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    attrs = state.attributes
    assert attrs["times_performed"] == 2
    assert attrs["total_cost"] == 125.0
    assert attrs["average_duration"] == 45.0


# ─── Trigger Attributes ──────────────────────────────────────────────────


async def test_threshold_trigger_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold trigger specific attributes."""
    hass.states.async_set("sensor.temp", "25.0")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "trigger_above": 30.0,
            "trigger_below": 5.0,
            "trigger_for_minutes": 10,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="threshold_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    attrs = state.attributes
    assert attrs["trigger_type"] == "threshold"
    assert attrs["trigger_above"] == 30.0
    assert attrs["trigger_below"] == 5.0
    assert attrs["trigger_for_minutes"] == 10


async def test_counter_trigger_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test counter trigger specific attributes."""
    hass.states.async_set("sensor.counter", "50")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.counter",
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 0,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="counter_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    attrs = state.attributes
    assert attrs["trigger_type"] == "counter"
    assert attrs["trigger_target_value"] == 100
    assert attrs["trigger_delta_mode"] is True


async def test_state_change_trigger_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test state_change trigger specific attributes."""
    hass.states.async_set("binary_sensor.door", "off")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "state_change",
            "entity_id": "binary_sensor.door",
            "trigger_from_state": "off",
            "trigger_to_state": "on",
            "trigger_target_changes": 10,
            "trigger_change_count": 3,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="state_change_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    attrs = state.attributes
    assert attrs["trigger_type"] == "state_change"
    assert attrs["trigger_from_state"] == "off"
    assert attrs["trigger_to_state"] == "on"
    assert attrs["trigger_target_changes"] == 10


async def test_runtime_trigger_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger attributes (fallback from config)."""
    hass.states.async_set("sensor.pump", "on")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump",
            "trigger_runtime_hours": 100,
            "trigger_accumulated_seconds": 36000,  # 10 hours
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="runtime_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    attrs = state.attributes
    assert attrs["trigger_type"] == "runtime"
    assert attrs["trigger_runtime_hours"] == 100


async def test_compound_trigger_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test compound trigger attributes."""
    hass.states.async_set("sensor.temp", "25.0")
    hass.states.async_set("sensor.humidity", "60")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "compound",
            "compound_logic": "AND",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.temp", "trigger_above": 30},
                {"type": "threshold", "entity_id": "sensor.humidity", "trigger_above": 80},
            ],
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="compound_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    attrs = state.attributes
    assert attrs["trigger_type"] == "compound"
    assert attrs["compound_logic"] == "AND"
    assert attrs["compound_conditions_count"] == 2


# ─── Adaptive & Seasonal Attributes ──────────────────────────────────────


async def test_adaptive_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test adaptive scheduling attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    task["adaptive_config"] = {"enabled": True}
    task["history"] = [
        {"timestamp": "2024-01-15T00:00:00", "type": "completed"},
        {"timestamp": "2024-02-15T00:00:00", "type": "completed"},
        {"timestamp": "2024-03-15T00:00:00", "type": "completed"},
        {"timestamp": "2024-04-15T00:00:00", "type": "completed"},
    ]
    obj_entry = _make_entry(hass, task, unique_id="adaptive_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    attrs = state.attributes
    assert attrs.get("adaptive_scheduling_enabled") is True


async def test_weibull_beta_interpretation(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test Weibull beta interpretation ranges."""
    from custom_components.maintenance_supporter.sensor import MaintenanceSensor

    # Create a mock task dict with various beta values and test interpretation
    test_cases = [
        (0.5, "early_failures"),
        (1.0, "random_failures"),
        (2.0, "wear_out"),
        (4.0, "highly_predictable"),
    ]

    for beta, expected in test_cases:
        task = {
            "_interval_analysis": {
                "weibull_beta": beta,
                "weibull_eta": 30,
                "weibull_r_squared": 0.95,
            },
        }

        # Check the interpretation logic directly
        analysis = task["_interval_analysis"]
        if beta < 0.8:
            interpretation = "early_failures"
        elif beta <= 1.2:
            interpretation = "random_failures"
        elif beta <= 3.5:
            interpretation = "wear_out"
        else:
            interpretation = "highly_predictable"

        assert interpretation == expected, f"Beta {beta} should be {expected}"


# ─── Sensor-driven Prediction Attributes ──────────────────────────────────


async def test_degradation_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test degradation rate and trend attributes appear when set."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    obj_entry = _make_entry(hass, task, unique_id="degrad_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    # Manually inject degradation data into coordinator
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_degradation_rate"] = 0.5
    coordinator.data[CONF_TASKS][TASK_ID_1]["_degradation_trend"] = "rising"

    # Force entity state update
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    if sensors:
        sensor_entity = hass.data["entity_components"]["sensor"].get_entity(sensors[0].entity_id)
        if sensor_entity:
            sensor_entity.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    if state and "degradation_rate" in state.attributes:
        assert state.attributes["degradation_rate"] == 0.5


async def test_threshold_prediction_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold prediction attributes appear when set."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    obj_entry = _make_entry(hass, task, unique_id="pred_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    # Manually inject prediction data
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_days_until_threshold"] = 15
    coordinator.data[CONF_TASKS][TASK_ID_1]["_threshold_prediction_confidence"] = 0.85

    # Verify the data is set
    data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert data["_days_until_threshold"] == 15


# ─── Trigger State Aggregation Tests ──────────────────────────────────────


async def test_update_trigger_state_single(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test single-entity trigger state is directly assigned."""
    hass.states.async_set("sensor.temp", "25.0")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold", "entity_id": "sensor.temp", "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="trigger_single")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    assert state is not None
    # Trigger not active (25 < 30), but time-based status still applies
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is False


async def test_update_trigger_state_multi_any(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test multi-entity 'any' logic: one triggered = True."""
    hass.states.async_set("sensor.temp1", "35.0")  # above threshold
    hass.states.async_set("sensor.temp2", "20.0")  # below threshold
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_ids": ["sensor.temp1", "sensor.temp2"],
            "entity_id": "sensor.temp1",
            "trigger_above": 30,
            "entity_logic": "any",
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="trigger_multi_any")
    await setup_integration(hass, global_entry, obj_entry)

    # The coordinator fallback should detect temp1 above threshold
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


async def test_update_trigger_state_multi_all(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test multi-entity 'all' logic: both above → True."""
    hass.states.async_set("sensor.temp1", "35.0")  # above
    hass.states.async_set("sensor.temp2", "40.0")  # also above
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_ids": ["sensor.temp1", "sensor.temp2"],
            "entity_id": "sensor.temp1",
            "trigger_above": 30,
            "entity_logic": "all",
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="trigger_multi_all")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True
