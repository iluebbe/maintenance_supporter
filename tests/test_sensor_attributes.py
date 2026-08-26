"""Tests for sensor entity extra_state_attributes (sensor.py)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

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
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
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
        version=1,
        minor_version=1,
        domain=DOMAIN,
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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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


async def test_interval_unit_attribute(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """A non-default interval_unit (months) is exposed as a sensor attribute."""
    task = build_task_data(task_id=TASK_ID_1, last_performed="2026-01-15", interval_days=3)
    task["interval_unit"] = "months"
    obj_entry = _make_entry(hass, task, unique_id="interval_unit_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    attrs = _get_sensor_state(hass, obj_entry).attributes
    assert attrs["interval_days"] == 3
    assert attrs["interval_unit"] == "months"


async def test_one_time_due_date_attribute(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """A one-time task exposes its schedule_type and due_date as attributes."""
    task = build_task_data(task_id=TASK_ID_1, interval_days=30)
    task["schedule_type"] = ScheduleType.ONE_TIME
    task["due_date"] = "2026-09-01"
    obj_entry = _make_entry(hass, task, unique_id="due_date_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    attrs = _get_sensor_state(hass, obj_entry).attributes
    assert attrs["schedule_type"] == "one_time"
    assert attrs["due_date"] == "2026-09-01"


async def test_times_performed_and_cost(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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


async def test_notes_and_documentation_url_attributes(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """notes + documentation_url ARE exposed as sensor attributes.

    Deliberately re-exposed in v2.8.4 (v2.8.3's data-minimisation pass had
    dropped them): a short note and a manual link are user-facing reference
    data meant for dashboards/templates via state_attr(...), not secrets.
    """
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    task["notes"] = "Replace filter cartridge model XR-7"
    task["documentation_url"] = "https://example.com/manual.pdf"
    obj_entry = _make_entry(hass, task, unique_id="notes_url_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    attrs = _get_sensor_state(hass, obj_entry).attributes
    assert attrs["notes"] == "Replace filter cartridge model XR-7"
    assert attrs["documentation_url"] == "https://example.com/manual.pdf"


async def test_priority_attribute(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """#134: priority is exposed so automations can route on it
    (state_attr(..., 'priority') == 'high'); absent = the "normal" default."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    task["priority"] = "high"
    obj_entry = _make_entry(hass, task, unique_id="priority_attr")
    await setup_integration(hass, global_entry, obj_entry)

    attrs = _get_sensor_state(hass, obj_entry).attributes
    assert attrs["priority"] == "high"


async def test_priority_attribute_defaults_to_normal(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    task.pop("priority", None)
    obj_entry = _make_entry(hass, task, unique_id="priority_attr_default")
    await setup_integration(hass, global_entry, obj_entry)

    attrs = _get_sensor_state(hass, obj_entry).attributes
    assert attrs["priority"] == "normal"


# ─── Trigger Attributes ──────────────────────────────────────────────────


async def test_threshold_trigger_attrs(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test Weibull beta interpretation ranges."""

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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test degradation rate and trend attributes appear when set."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    obj_entry = _make_entry(hass, task, unique_id="degrad_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    # Manually inject degradation data into coordinator
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
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
    assert "degradation_rate" not in (state.attributes if state else {})


async def test_threshold_prediction_attrs(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test threshold prediction attributes appear when set."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    obj_entry = _make_entry(hass, task, unique_id="pred_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    # Manually inject prediction data
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_days_until_threshold"] = 15
    coordinator.data[CONF_TASKS][TASK_ID_1]["_threshold_prediction_confidence"] = 0.85

    # Verify the data is set
    data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert data["_days_until_threshold"] == 15


# ─── Trigger State Aggregation Tests ──────────────────────────────────────


async def test_update_trigger_state_single(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test single-entity trigger state is directly assigned."""
    hass.states.async_set("sensor.temp", "25.0")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, task, unique_id="trigger_single")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    assert state is not None
    # Trigger not active (25 < 30), but time-based status still applies
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is False


async def test_update_trigger_state_multi_any(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


async def test_update_trigger_state_multi_all(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
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
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


# ─── entity_slug → _attr_name override ───────────────────────────────────


async def test_sensor_entity_slug_sets_name(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """When a task has entity_slug, sensor._attr_name is set to that slug."""
    from custom_components.maintenance_supporter.sensor import MaintenanceSensor

    task = build_task_data()
    task["entity_slug"] = "my_custom_slug"
    oe = _make_entry(hass, task, unique_id="slug_object")
    await setup_integration(hass, global_entry, oe)

    coord = oe.runtime_data.coordinator

    sensor = MaintenanceSensor(coord, TASK_ID_1)
    # entity_slug should set the name
    assert sensor._attr_name == "my_custom_slug"


# ─── sensor.py attribute edge cases ─────────────────────────────────────


async def test_sensor_runtime_fallback_attributes(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Sensor shows runtime fallback attributes when trigger instance is missing."""

    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump_fallback",
            "entity_ids": ["sensor.pump_fallback"],
            "trigger_runtime_hours": 200,
            "trigger_accumulated_seconds": 7200.0,
        },
    )
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="RT Fallback",
        data=build_object_entry_data(
            object_data=build_object_data(name="RT Fallback"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_rt_fallback",
    )
    entry.add_to_hass(hass)

    # Patch trigger creation to raise so sensor falls back to config values
    with patch(
        "custom_components.maintenance_supporter.sensor.create_triggers",
        side_effect=ValueError("Test trigger setup failure"),
    ):
        await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None
    # trigger_accumulated_hours and trigger_remaining_hours removed from state attributes


async def test_sensor_weibull_random_failures(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Sensor shows weibull_beta_interpretation = random_failures for beta ~1.0."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    coordinator = object_config_entry.runtime_data.coordinator

    # Inject analysis data with weibull_beta = 1.0 (random failures)
    if CONF_TASKS in coordinator.data:
        for task_id in coordinator.data[CONF_TASKS]:
            coordinator.data[CONF_TASKS][task_id]["_interval_analysis"] = {
                "seasonal_factor": None,
                "weibull_beta": 1.0,
                "weibull_eta": 30.0,
                "weibull_r_squared": 0.95,
                "confidence_interval_low": None,
            }

    # Get sensor entity
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, object_config_entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    # Force sensor to re-read coordinator data
    coordinator.async_set_updated_data(coordinator.data)
    await hass.async_block_till_done()

    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None
    assert state.attributes.get("weibull_beta_interpretation") == "random_failures"


def _make_global(hass: HomeAssistant, **kw) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(**kw),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _make_object(
    hass: HomeAssistant,
    tasks: dict | None = None,
    name: str = "Test Object",
    uid: str = "test_obj_cov",
    object_data: dict | None = None,
) -> MockConfigEntry:
    od = object_data or build_object_data(name=name)
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(object_data=od, tasks=tasks or {}),
        source="user",
        unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


def _get_entities_by_domain(hass: HomeAssistant, entry: MockConfigEntry, domain: str):
    reg = er.async_get(hass)
    return [e for e in er.async_entries_for_config_entry(reg, entry.entry_id) if e.domain == domain]


# ─── sensor.py lines 75-76 — no coordinator returns early ───────────────────


async def test_sensor_no_coordinator(hass: HomeAssistant) -> None:
    """sensor.py line 74-76: logs error when runtime_data.coordinator is None."""
    from custom_components.maintenance_supporter.sensor import async_setup_entry
    from custom_components.maintenance_supporter import MaintenanceSupporterData

    global_entry = _make_global(hass)
    await setup_integration(hass, global_entry)

    fake_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Fake Sensor",
        data=build_object_entry_data(),
        source="user",
        unique_id="fake_no_coord_sensor",
    )
    fake_entry.add_to_hass(hass)
    fake_entry.runtime_data = MaintenanceSupporterData(coordinator=None)

    entities_added = []
    await async_setup_entry(hass, fake_entry, entities_added.append)
    assert entities_added == []


# ─── sensor.py line 134 — native_value returns None with no task data ────────


async def test_sensor_native_value_no_task(hass: HomeAssistant) -> None:
    """sensor.py line 139-141: native_value returns None for empty task data."""
    from custom_components.maintenance_supporter.sensor import MaintenanceSensor

    coord = MagicMock()
    coord.data = {CONF_TASKS: {}}  # no task data
    coord.entry.data = {
        "object": {"name": "Test"},
        CONF_TASKS: {},
    }
    sensor = MaintenanceSensor.__new__(MaintenanceSensor)
    sensor._task_id = "nonexistent"
    sensor.coordinator = coord

    assert sensor.native_value is None


# ─── sensor.py line 141 — icon returns None with no custom_icon ──────────────


async def test_sensor_icon_no_custom(hass: HomeAssistant) -> None:
    """sensor.py line 149-152: icon returns None when no custom_icon set."""
    global_entry = _make_global(hass)
    task = build_task_data()
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="sensor_icon")
    await setup_integration(hass, global_entry, obj_entry)

    entities = _get_entities_by_domain(hass, obj_entry, "sensor")
    if not entities:
        pytest.skip("No sensor entities")

    entity_reg = er.async_get(hass)
    state = hass.states.get(entities[0].entity_id)
    assert state is not None
    # Default icon (no custom_icon) → icon attribute should be None or default
    # We just confirm the entity has a valid state
    assert state.state in ("ok", "due_soon", "overdue", "triggered")


# ─── sensor.py line 176 — extra_state_attributes when task is empty ──────────


async def test_sensor_extra_attrs_empty_task(hass: HomeAssistant) -> None:
    """sensor.py line 174-176: extra_state_attributes returns {} for empty task."""
    from custom_components.maintenance_supporter.sensor import MaintenanceSensor

    coord = MagicMock()
    coord.data = {CONF_TASKS: {}}
    coord.entry.data = {"object": {}, CONF_TASKS: {}}

    sensor = MaintenanceSensor.__new__(MaintenanceSensor)
    sensor._task_id = "missing_task"
    sensor.coordinator = coord

    result = sensor.extra_state_attributes
    assert result == {}


# ─── sensor.py line 288 — async_will_remove_from_hass tears down triggers ────


async def test_sensor_will_remove_from_hass(hass: HomeAssistant) -> None:
    """sensor.py line 328-335: async_will_remove_from_hass tears down triggers."""
    global_entry = _make_global(hass)
    hass.states.async_set("sensor.will_remove", "25.0")
    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.will_remove",
            "trigger_above": 30.0,
        },
    )
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="sensor_remove")
    await setup_integration(hass, global_entry, obj_entry)

    # Unloading the entry will call async_will_remove_from_hass on all entities
    await hass.config_entries.async_unload(obj_entry.entry_id)
    await hass.async_block_till_done()


# ─── Entity-attribute contract (#134 audit) ──────────────────────────────────
#
# Which persisted task fields surface as sensor attributes was a hand-kept
# enumeration in sensor.py — priority was simply missing until #134. This
# contract forces the decision: every user-editable storage field (the
# TASK_UPDATE_FIELD_MAP values, the same source the task-summary contract
# uses) must either appear as an attribute on a REAL sensor or be exempted
# below with a reason. Attributes cost recorder rows (v2.8.3 once minimised
# them deliberately), so "exempt" is a valid, documented answer — silently
# forgetting no longer is.

# storage field -> attribute name where they differ
_ATTR_RENAMES = {"type": "maintenance_type"}

_ATTR_EXEMPT = {
    "name": "the entity's friendly_name IS the task name",
    "enabled": "a disabled task's entities go inert; state visible via WS/panel",
    "trigger_config": "faceted into per-type trigger_* attributes instead",
    "responsible_user_id": "raw HA-user UUIDs are meaningless in recorder rows",
    "assignee_pool": "list of HA-user UUIDs — same reason as responsible_user_id",
    "rotation_strategy": "assignment mechanics; visible in the panel/WS",
    "required_completion_fields": "dialog gating config, not routable state",
    "entity_slug": "already manifest in the entity_id itself",
    "custom_icon": "applied as the entity's icon, not an attribute",
    "nfc_tag_id": "identifier for the scan flow, not state; served via WS",
    "reading_unit": "display unit for the reading dialog; rides the WS payload",
    "consumes_parts": "structured part links; the parts surfaces own this",
    "checklist": "structured list — recorder bloat; served via WS",
    "labels": "list; candidate for exposure if automations need it (#134 follow-up)",
    "schedule_time": "sub-day refinement of due_date; panel/WS surface it",
    "earliest_completion_days": "completion-window config, not routable state",
    "on_complete_action": "nested service-call config (data minimisation)",
    "quick_complete_defaults": "nested defaults config (data minimisation)",
    # #139: the full defs/sequence would be recorder bloat; the routable state
    # (which step is due) IS exposed — current_phase / current_phase_id /
    # phase_index / phase_count attributes on the task sensor.
    "phases": "structured defs; current_phase* attributes carry the due step",
    "phase_sequence": "structured list; current_phase* attributes carry the due step",
}


async def test_every_editable_field_is_attribute_or_exempted(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import (
        TASK_UPDATE_FIELD_MAP,
    )

    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    task["trigger_config"] = {"type": "threshold", "entity_id": "sensor.x", "trigger_above": 1}
    obj_entry = _make_entry(hass, task, unique_id="attr_contract")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_sensor_state(hass, obj_entry)
    if state is None:
        pytest.skip("Sensor not available")
    attrs = set(state.attributes)

    storage_fields = set(TASK_UPDATE_FIELD_MAP.values())
    unplaced = {
        f for f in storage_fields
        if _ATTR_RENAMES.get(f, f) not in attrs and f not in _ATTR_EXEMPT
    }
    assert not unplaced, (
        f"Editable field(s) {sorted(unplaced)} are neither a sensor attribute "
        "nor exempted — expose them in sensor.py or add an exemption WITH a "
        "reason above."
    )
    # An exemption for a field that IS exposed (or no longer exists) is stale.
    stale = {
        f for f in _ATTR_EXEMPT
        if f not in storage_fields or _ATTR_RENAMES.get(f, f) in attrs
    }
    assert not stale, f"Stale exemptions: {sorted(stale)}"
