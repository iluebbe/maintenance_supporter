"""Tests for coordinator.py sensor prediction integration and mutation error paths."""

from __future__ import annotations

import time
from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MISSING_ENTITY_THRESHOLD_REFRESHES,
    MaintenanceStatus,
    ScheduleType,
    TriggerEntityState,
)
from custom_components.maintenance_supporter.helpers.notification_manager import (
    NotificationManager,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
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
    tasks: dict[str, dict[str, Any]],
    name: str = "Test Object",
    unique_id: str = "coord_pred",
) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks=tasks,
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Sensor Prediction Integration in _async_update_data ─────────────


async def test_update_data_with_degradation(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test _async_update_data sets degradation attributes from SensorPredictor."""
    hass.states.async_set("sensor.temp", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30,
        },
    )
    task["adaptive_config"] = {"sensor_prediction_enabled": True}
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="pred_deg")
    await setup_integration(hass, global_entry, obj_entry)

    mock_deg = MagicMock()
    mock_deg.slope_per_day = 0.5
    mock_deg.trend = "rising"
    mock_deg.r_squared = 0.85
    mock_deg.data_points = 50

    mock_result = MagicMock()
    mock_result.degradation = mock_deg
    mock_result.threshold_prediction = None
    mock_result.environmental = None

    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor"
    ) as MockSP:
        MockSP.return_value.async_analyze = AsyncMock(return_value=mock_result)
        entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
        assert entry is not None
        coordinator = entry.runtime_data.coordinator
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert data.get("_degradation_rate") == 0.5
    assert data.get("_degradation_trend") == "rising"
    assert data.get("_degradation_r_squared") == 0.85
    assert data.get("_degradation_data_points") == 50


async def test_update_data_with_threshold_prediction_urgency(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test _async_update_data: threshold prediction triggers urgency override."""
    hass.states.async_set("sensor.temp", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        interval_days=30,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30,
        },
    )
    task["adaptive_config"] = {"sensor_prediction_enabled": True}
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="pred_urgency")
    await setup_integration(hass, global_entry, obj_entry)

    mock_deg = MagicMock()
    mock_deg.slope_per_day = 0.5
    mock_deg.trend = "rising"
    mock_deg.r_squared = 0.85
    mock_deg.data_points = 50

    mock_tp = MagicMock()
    mock_tp.days_until_threshold = 10  # 10 < 30*0.9=27 → urgency
    mock_tp.predicted_date = "2026-04-01"
    mock_tp.confidence = "high"

    mock_result = MagicMock()
    mock_result.degradation = mock_deg
    mock_result.threshold_prediction = mock_tp
    mock_result.environmental = None

    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor"
    ) as MockSP:
        MockSP.return_value.async_analyze = AsyncMock(return_value=mock_result)
        entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
        assert entry is not None
        coordinator = entry.runtime_data.coordinator
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert data.get("_days_until_threshold") == 10
    assert data.get("_threshold_prediction_date") == "2026-04-01"
    assert data.get("_threshold_prediction_confidence") == "high"
    assert data.get("_sensor_prediction_urgency") is True
    assert data.get("_suggested_interval") == 9  # max(1, int(10*0.9))


async def test_update_data_with_environmental_factor(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test _async_update_data: environmental factor adjusts suggested interval."""
    hass.states.async_set("sensor.temp", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        interval_days=30,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30,
        },
    )
    task["adaptive_config"] = {
        "enabled": True,
        "sensor_prediction_enabled": True,
        "environmental_entity": "sensor.humidity",
    }
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="pred_env")
    await setup_integration(hass, global_entry, obj_entry)

    mock_env = MagicMock()
    mock_env.adjustment_factor = 0.8
    mock_env.entity_id = "sensor.humidity"
    mock_env.correlation = 0.7
    mock_env.has_sufficient_data = True

    mock_result = MagicMock()
    mock_result.degradation = None
    mock_result.threshold_prediction = None
    mock_result.environmental = mock_env

    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor"
    ) as MockSP:
        MockSP.return_value.async_analyze = AsyncMock(return_value=mock_result)
        entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
        assert entry is not None
        coordinator = entry.runtime_data.coordinator
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert data.get("_environmental_factor") == 0.8
    assert data.get("_environmental_entity") == "sensor.humidity"
    assert data.get("_environmental_correlation") == 0.7


async def test_update_data_prediction_exception(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test _async_update_data catches SensorPredictor exceptions gracefully."""
    hass.states.async_set("sensor.temp", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30,
        },
    )
    task["adaptive_config"] = {"sensor_prediction_enabled": True}
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="pred_err")
    await setup_integration(hass, global_entry, obj_entry)

    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor"
    ) as MockSP:
        MockSP.return_value.async_analyze = AsyncMock(side_effect=RuntimeError("boom"))
        entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
        assert entry is not None
        coordinator = entry.runtime_data.coordinator
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    # Should not crash — data still valid
    assert "_status" in coordinator.data[CONF_TASKS][TASK_ID_1]


async def test_update_data_prediction_returns_none(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test _async_update_data handles SensorPredictor returning None."""
    hass.states.async_set("sensor.temp", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30,
        },
    )
    task["adaptive_config"] = {"sensor_prediction_enabled": True}
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="pred_none")
    await setup_integration(hass, global_entry, obj_entry)

    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor"
    ) as MockSP:
        MockSP.return_value.async_analyze = AsyncMock(return_value=None)
        entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
        assert entry is not None
        coordinator = entry.runtime_data.coordinator
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert "_degradation_rate" not in data


# ─── Fallback Counter: per-entity baseline from _trigger_state ───────


async def test_fallback_counter_per_entity_baseline(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test counter fallback uses per-entity baseline from _trigger_state."""
    hass.states.async_set("sensor.counter", "160")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.counter",
            "entity_ids": ["sensor.counter"],
            "trigger_target_value": 50,
            "trigger_delta_mode": True,
            "_trigger_state": {
                "sensor.counter": {"baseline_value": 100},
            },
        },
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="fb_per_ent")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    # delta=160-100=60 >= 50 → triggered
    assert data.get("_trigger_active") is True


async def test_fallback_counter_attribute(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test counter fallback reads from attribute."""
    hass.states.async_set("sensor.device", "ok", {"usage_count": 200})
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.device",
            "entity_ids": ["sensor.device"],
            "attribute": "usage_count",
            "trigger_target_value": 100,
            "trigger_delta_mode": False,
        },
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="fb_ctr_attr")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    # 200 >= 100 → triggered
    assert data.get("_trigger_active") is True


async def test_fallback_threshold_below(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold fallback: trigger_below fires when value < threshold."""
    hass.states.async_set("sensor.water_level", "3")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.water_level",
            "entity_ids": ["sensor.water_level"],
            "trigger_below": 5.0,
        },
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="fb_below")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    # 3 < 5 → triggered
    assert data.get("_trigger_active") is True


async def test_fallback_threshold_multi_all(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold fallback: multi-entity with 'all' logic, both below."""
    hass.states.async_set("sensor.temp1", "20")  # Below threshold
    hass.states.async_set("sensor.temp2", "20")  # Below threshold
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp1",
            "entity_ids": ["sensor.temp1", "sensor.temp2"],
            "entity_logic": "all",
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="fb_all")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    # Both below threshold → all=False
    assert data.get("_trigger_active") is False


async def test_fallback_non_numeric_value(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test threshold fallback: non-numeric value → not triggered."""
    hass.states.async_set("sensor.temp", "not_a_number")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="fb_nan")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    assert data.get("_trigger_active") is False


# ─── Issue Checking ──────────────────────────────────────────────────


async def test_check_issues_unavailable_logs_once(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test unavailable entity logs warning only once."""
    hass.states.async_set("sensor.temp", "unavailable")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="issue_log_once")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    # First refresh already happened during setup
    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.UNAVAILABLE
    # Second refresh — should not log again
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.UNAVAILABLE


async def test_check_issues_missing_past_threshold(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test missing entity past refresh threshold creates repair issue."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.ghost",
            "entity_ids": ["sensor.ghost"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="issue_missing")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    # Move past startup grace
    coordinator._startup_time = time.monotonic() - 999

    for _ in range(MISSING_ENTITY_THRESHOLD_REFRESHES + 1):
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.MISSING
    issue_reg = ir.async_get(hass)
    issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.ghost"
    issues = [i for i in issue_reg.issues.values() if i.issue_id == issue_id]
    assert len(issues) == 1


async def test_check_issues_cleared_when_available(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test available entity clears previous unavailable tracking."""
    hass.states.async_set("sensor.temp", "25")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="issue_clear")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.AVAILABLE


# ─── Mutation Method Error Paths ─────────────────────────────────────


async def test_complete_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test complete_maintenance returns early for unknown task_id."""
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="mut_complete_nf")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator.complete_maintenance("nonexistent")  # no crash


async def test_reset_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test reset_maintenance returns early for unknown task_id."""
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="mut_reset_nf")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator.reset_maintenance("nonexistent")  # no crash


async def test_skip_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test skip_maintenance returns early for unknown task_id."""
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="mut_skip_nf")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator.skip_maintenance("nonexistent")  # no crash


async def test_apply_suggested_interval_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test async_apply_suggested_interval returns early for unknown task_id."""
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="mut_apply_nf")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator.async_apply_suggested_interval("nonexistent", 15)  # no crash


async def test_add_trigger_history_entry_success(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test async_add_trigger_history_entry adds TRIGGERED entry."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(last_performed=last)
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="trigger_hist")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator.async_add_trigger_history_entry(TASK_ID_1, trigger_value=35.0)

    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    history = state.get("history", [])
    triggered = [h for h in history if h.get("type") == "triggered"]
    assert len(triggered) >= 1


async def test_add_trigger_history_entry_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test async_add_trigger_history_entry with missing task → no-op."""
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="trigger_hist_nf")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator.async_add_trigger_history_entry("nonexistent", trigger_value=10.0)


async def test_complete_with_adaptive_config(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test complete_maintenance updates adaptive scheduling config."""
    last = (dt_util.now().date() - timedelta(days=25)).isoformat()
    task = build_task_data(last_performed=last, interval_days=30)
    task["adaptive_config"] = {"enabled": True}
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="complete_adaptive")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1, notes="Done")

    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    adaptive = state.get("adaptive_config", {})
    assert "base_interval" in adaptive
    assert "hemisphere" in adaptive


async def test_complete_with_invalid_last_performed(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test complete_maintenance handles invalid last_performed format."""
    task = build_task_data(last_performed="not-a-date", interval_days=30)
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="complete_bad_date")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    # Should not crash despite invalid date
    await coordinator.complete_maintenance(TASK_ID_1)


async def test_register_calendar_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test register_calendar_entity stores reference."""
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="reg_cal")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    mock_cal = MagicMock()
    coordinator.register_calendar_entity(mock_cal)
    assert coordinator._calendar_entity is mock_cal


async def test_disabled_task_status_ok(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test disabled task always gets status=OK."""
    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=60)).isoformat(),
        interval_days=30,
        enabled=False,
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="disabled_ok")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    assert data["_status"] == MaintenanceStatus.OK


# ─── Budget Check with Monthly Alert ────────────────────────────────


async def test_budget_monthly_alert(hass: HomeAssistant) -> None:
    """Test _async_check_budget fires monthly alert when threshold exceeded."""
    now_iso = datetime.now().isoformat()
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data={
            "default_warning_days": 7,
            CONF_NOTIFICATIONS_ENABLED: False,
            CONF_NOTIFY_SERVICE: "",
            CONF_BUDGET_ALERTS_ENABLED: True,
            CONF_BUDGET_ALERT_THRESHOLD: 80,
            CONF_BUDGET_MONTHLY: 100,
            CONF_BUDGET_YEARLY: 0,
        },
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        history=[{"type": "completed", "timestamp": now_iso, "cost": 90}],
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="budget_m")

    await setup_integration(hass, global_entry, obj_entry)

    # Replace NM after setup with spec so isinstance() passes
    mock_nm = MagicMock(spec=NotificationManager)
    mock_nm.enabled = True
    mock_nm.async_budget_alert = AsyncMock()
    hass.data[DOMAIN]["_notification_manager"] = mock_nm

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator._async_check_budget({})
    mock_nm.async_budget_alert.assert_called_once_with("monthly", 90.0, 100.0, "€")


async def test_budget_yearly_alert(hass: HomeAssistant) -> None:
    """Test _async_check_budget fires yearly alert when threshold exceeded."""
    now_iso = datetime.now().isoformat()
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data={
            "default_warning_days": 7,
            CONF_NOTIFICATIONS_ENABLED: False,
            CONF_NOTIFY_SERVICE: "",
            CONF_BUDGET_ALERTS_ENABLED: True,
            CONF_BUDGET_ALERT_THRESHOLD: 80,
            CONF_BUDGET_MONTHLY: 0,
            CONF_BUDGET_YEARLY: 500,
        },
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        history=[{"type": "completed", "timestamp": now_iso, "cost": 450}],
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="budget_y")

    mock_nm = MagicMock(spec=NotificationManager)
    mock_nm.enabled = True
    mock_nm.async_budget_alert = AsyncMock()

    await setup_integration(hass, global_entry, obj_entry)

    hass.data[DOMAIN]["_notification_manager"] = mock_nm

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    await coordinator._async_check_budget({})
    mock_nm.async_budget_alert.assert_called_once_with("yearly", 450.0, 500.0, "€")
