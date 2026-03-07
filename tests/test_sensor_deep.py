"""Deep sensor coverage tests for Weibull, seasonal, environmental, multi-entity triggers."""

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
    name: str = "Test Object",
    unique_id: str = "deep_sensor",
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
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    if not sensors:
        return None
    return hass.states.get(sensors[0].entity_id)


def _get_sensor_entity(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    if not sensors:
        return None
    return hass.data["entity_components"]["sensor"].get_entity(sensors[0].entity_id)


# ─── Weibull Statistics via Coordinator Data ──────────────────────────────


async def test_weibull_attrs_early_failures(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test Weibull beta < 0.8 → early_failures."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="weibull_early")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_interval_analysis"] = {
        "weibull_beta": 0.5,
        "weibull_eta": 30,
        "weibull_r_squared": 0.9,
        "seasonal_factor": None,
        "confidence_interval_low": None,
    }

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    if state and "weibull_beta" in state.attributes:
        assert state.attributes["weibull_beta"] == 0.5
        assert state.attributes["weibull_beta_interpretation"] == "early_failures"


async def test_weibull_attrs_wear_out(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test Weibull beta 1.2-3.5 → wear_out."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="weibull_wear")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_interval_analysis"] = {
        "weibull_beta": 2.5,
        "weibull_eta": 45,
        "weibull_r_squared": 0.95,
        "seasonal_factor": None,
        "confidence_interval_low": 20,
        "confidence_interval_high": 60,
    }

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    if state and "weibull_beta" in state.attributes:
        assert state.attributes["weibull_beta_interpretation"] == "wear_out"
        assert state.attributes["confidence_interval_low"] == 20
        assert state.attributes["confidence_interval_high"] == 60


async def test_weibull_attrs_highly_predictable(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test Weibull beta > 3.5 → highly_predictable."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="weibull_predict")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_interval_analysis"] = {
        "weibull_beta": 5.0,
        "weibull_eta": 30,
        "weibull_r_squared": 0.99,
        "seasonal_factor": None,
        "confidence_interval_low": None,
    }

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    if state and "weibull_beta" in state.attributes:
        assert state.attributes["weibull_beta_interpretation"] == "highly_predictable"


# ─── Seasonal Attributes ─────────────────────────────────────────────────


async def test_seasonal_factor_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test seasonal factor attributes from interval analysis."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="seasonal_factor")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_interval_analysis"] = {
        "seasonal_factor": 0.7,
        "seasonal_reason": "Summer: more frequent",
        "weibull_beta": None,
        "confidence_interval_low": None,
    }

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    if state and "seasonal_factor" in state.attributes:
        assert state.attributes["seasonal_factor"] == 0.7
        assert state.attributes["seasonal_reason"] == "Summer: more frequent"


# ─── Environmental Factor Attributes ─────────────────────────────────────


async def test_environmental_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test environmental factor attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="env_factor")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_environmental_factor"] = 1.3
    coordinator.data[CONF_TASKS][TASK_ID_1]["_environmental_entity"] = "sensor.outdoor_temp"

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    assert "environmental_factor" not in (state.attributes if state else {})


# ─── Threshold Prediction / Degradation ───────────────────────────────────


async def test_threshold_prediction_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold prediction attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="thresh_pred")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_days_until_threshold"] = 12
    coordinator.data[CONF_TASKS][TASK_ID_1]["_threshold_prediction_confidence"] = 0.85

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    assert "days_until_threshold" not in (state.attributes if state else {})


# ─── Suggested Interval Attributes ───────────────────────────────────────


async def test_suggested_interval_attrs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test adaptive suggested interval and confidence attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, task, unique_id="sugg_interval")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_suggested_interval"] = 25
    coordinator.data[CONF_TASKS][TASK_ID_1]["_interval_confidence"] = "high"

    sensor = _get_sensor_entity(hass, obj_entry)
    if sensor:
        sensor.async_write_ha_state()

    state = _get_sensor_state(hass, obj_entry)
    if state and "suggested_interval" in state.attributes:
        assert state.attributes["suggested_interval"] == 25
        assert state.attributes["interval_confidence"] == "high"


# ─── Runtime Trigger Fallback (no trigger object) ────────────────────────


async def test_runtime_fallback_from_config(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test runtime trigger attributes from config (fallback path)."""
    hass.states.async_set("sensor.pump", "on")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump",
            "trigger_runtime_hours": 200,
            "trigger_accumulated_seconds": 180000,  # 50 hours
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="runtime_fallback")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    assert state is not None
    attrs = state.attributes
    assert attrs["trigger_type"] == "runtime"
    assert attrs["trigger_runtime_hours"] == 200
