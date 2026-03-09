"""Tests for sensor_predictor.py — degradation, threshold prediction, environmental."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.helpers.sensor_predictor import (
    DegradationAnalysis,
    EnvironmentalAnalysis,
    SensorPredictor,
    ThresholdPrediction,
)


# ─── SensorPredictor._linear_regression ──────────────────────────────


def test_linear_regression_basic() -> None:
    """Test linear regression with clear linear data."""
    points = [(0.0, 0.0), (1.0, 2.0), (2.0, 4.0), (3.0, 6.0)]
    result = SensorPredictor._linear_regression(points)
    assert result is not None
    slope, intercept, r_squared = result
    assert abs(slope - 2.0) < 1e-6
    assert abs(intercept - 0.0) < 1e-6
    assert abs(r_squared - 1.0) < 1e-6


def test_linear_regression_insufficient_data() -> None:
    """Test linear regression with less than 2 points."""
    assert SensorPredictor._linear_regression([(1.0, 2.0)]) is None
    assert SensorPredictor._linear_regression([]) is None


def test_linear_regression_constant_x() -> None:
    """Test linear regression with same x values → None (denom=0)."""
    points = [(1.0, 1.0), (1.0, 2.0), (1.0, 3.0)]
    assert SensorPredictor._linear_regression(points) is None


def test_linear_regression_constant_y() -> None:
    """Test linear regression with constant y values → slope=0, r²=1."""
    points = [(1.0, 5.0), (2.0, 5.0), (3.0, 5.0)]
    result = SensorPredictor._linear_regression(points)
    assert result is not None
    slope, _intercept, r_squared = result
    assert abs(slope) < 1e-10
    assert abs(r_squared - 1.0) < 1e-6


# ─── SensorPredictor._pearson_correlation ────────────────────────────


def test_pearson_correlation_perfect_positive() -> None:
    """Test Pearson correlation with perfect positive correlation."""
    x = [1.0, 2.0, 3.0, 4.0]
    y = [2.0, 4.0, 6.0, 8.0]
    result = SensorPredictor._pearson_correlation(x, y)
    assert result is not None
    assert abs(result - 1.0) < 1e-6


def test_pearson_correlation_perfect_negative() -> None:
    """Test Pearson correlation with perfect negative correlation."""
    x = [1.0, 2.0, 3.0, 4.0]
    y = [8.0, 6.0, 4.0, 2.0]
    result = SensorPredictor._pearson_correlation(x, y)
    assert result is not None
    assert abs(result - (-1.0)) < 1e-6


def test_pearson_correlation_insufficient_data() -> None:
    """Test Pearson correlation with < 3 points."""
    assert SensorPredictor._pearson_correlation([1.0, 2.0], [3.0, 4.0]) is None


def test_pearson_correlation_zero_variance() -> None:
    """Test Pearson correlation with zero variance → None."""
    x = [5.0, 5.0, 5.0]
    y = [1.0, 2.0, 3.0]
    assert SensorPredictor._pearson_correlation(x, y) is None


# ─── SensorPredictor._find_closest_value ─────────────────────────────


def test_find_closest_value_exact() -> None:
    """Test find closest value with exact match."""
    points = [(100.0, 10.0), (200.0, 20.0), (300.0, 30.0)]
    result = SensorPredictor._find_closest_value(points, 200.0)
    assert result == 20.0


def test_find_closest_value_between() -> None:
    """Test find closest value between points."""
    points = [(100.0, 10.0), (200.0, 20.0), (300.0, 30.0)]
    result = SensorPredictor._find_closest_value(points, 190.0)
    assert result == 20.0


def test_find_closest_value_empty() -> None:
    """Test find closest value with empty list."""
    assert SensorPredictor._find_closest_value([], 100.0) is None


def test_find_closest_value_too_far() -> None:
    """Test find closest value outside 24h window → None."""
    points = [(100.0, 10.0)]
    # target > 24h away from 100.0
    target = 100.0 + 86400.0 + 1.0
    assert SensorPredictor._find_closest_value(points, target) is None


def test_find_closest_value_left_neighbor() -> None:
    """Test find closest value prefers left neighbor when closer."""
    points = [(100.0, 10.0), (200.0, 20.0)]
    # 140 is closer to 100 than 200
    result = SensorPredictor._find_closest_value(points, 140.0)
    assert result == 10.0


# ─── SensorPredictor._compute_threshold_prediction ───────────────────


def test_threshold_prediction_above_rising() -> None:
    """Test threshold prediction: rising toward trigger_above."""
    degradation = DegradationAnalysis(
        entity_id="sensor.temp",
        slope_per_day=2.0,
        trend="rising",
        r_squared=0.9,
        current_value=20.0,
        data_points=50,
        lookback_days=30,
    )
    config = {"type": "threshold", "trigger_above": 30.0}
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is not None
    assert result.days_until_threshold is not None
    # (30 - 20) / 2.0 = 5 days
    assert abs(result.days_until_threshold - 5.0) < 0.1
    assert result.threshold_direction == "above"
    assert result.confidence == "high"


def test_threshold_prediction_below_falling() -> None:
    """Test threshold prediction: falling toward trigger_below."""
    degradation = DegradationAnalysis(
        entity_id="sensor.temp",
        slope_per_day=-3.0,
        trend="falling",
        r_squared=0.5,
        current_value=25.0,
        data_points=50,
        lookback_days=30,
    )
    config = {"type": "threshold", "trigger_below": 10.0}
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is not None
    assert result.days_until_threshold is not None
    # (10 - 25) / -3.0 = 5 days
    assert abs(result.days_until_threshold - 5.0) < 0.1
    assert result.threshold_direction == "below"
    assert result.confidence == "medium"


def test_threshold_prediction_already_exceeded() -> None:
    """Test threshold prediction: value already exceeds threshold."""
    degradation = DegradationAnalysis(
        entity_id="sensor.temp",
        slope_per_day=2.0,
        trend="rising",
        r_squared=0.9,
        current_value=35.0,
        data_points=50,
        lookback_days=30,
    )
    config = {"type": "threshold", "trigger_above": 30.0}
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is not None
    assert result.days_until_threshold == 0.0


def test_threshold_prediction_slope_zero() -> None:
    """Test threshold prediction: slope=0 → None."""
    degradation = DegradationAnalysis(
        entity_id="sensor.temp",
        slope_per_day=0.0,
        trend="stable",
        r_squared=0.9,
        current_value=20.0,
        data_points=50,
        lookback_days=30,
    )
    config = {"type": "threshold", "trigger_above": 30.0}
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is None


def test_threshold_prediction_wrong_direction() -> None:
    """Test threshold prediction: falling but trigger_above → None."""
    degradation = DegradationAnalysis(
        entity_id="sensor.temp",
        slope_per_day=-2.0,
        trend="falling",
        r_squared=0.9,
        current_value=20.0,
        data_points=50,
        lookback_days=30,
    )
    config = {"type": "threshold", "trigger_above": 30.0}
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is None


def test_threshold_prediction_counter_delta() -> None:
    """Test threshold prediction for counter delta mode."""
    degradation = DegradationAnalysis(
        entity_id="sensor.counter",
        slope_per_day=5.0,
        trend="rising",
        r_squared=0.1,  # low r² → low confidence
        current_value=110.0,
        data_points=30,
        lookback_days=30,
    )
    config = {
        "type": "counter",
        "trigger_target_value": 50,
        "trigger_delta_mode": True,
        "trigger_baseline_value": 100,
    }
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is not None
    assert result.days_until_threshold is not None
    # current_delta = 110 - 100 = 10, remaining = 50 - 10 = 40, 40 / 5 = 8 days
    assert abs(result.days_until_threshold - 8.0) < 0.1
    assert result.confidence == "low"


def test_threshold_prediction_counter_absolute() -> None:
    """Test threshold prediction for counter absolute mode."""
    degradation = DegradationAnalysis(
        entity_id="sensor.counter",
        slope_per_day=10.0,
        trend="rising",
        r_squared=0.8,
        current_value=30.0,
        data_points=30,
        lookback_days=30,
    )
    config = {
        "type": "counter",
        "trigger_target_value": 100,
        "trigger_delta_mode": False,
    }
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is not None
    assert result.days_until_threshold is not None
    # (100 - 30) / 10 = 7 days
    assert abs(result.days_until_threshold - 7.0) < 0.1


def test_threshold_prediction_counter_negative_slope() -> None:
    """Test counter prediction with negative slope returns None."""
    degradation = DegradationAnalysis(
        entity_id="sensor.counter",
        slope_per_day=-2.0,
        trend="falling",
        r_squared=0.8,
        current_value=50.0,
        data_points=30,
        lookback_days=30,
    )
    config = {
        "type": "counter",
        "trigger_target_value": 100,
        "trigger_delta_mode": False,
    }
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is None


def test_threshold_prediction_counter_zero_slope() -> None:
    """Test counter prediction with zero slope returns None (handled by slope==0 guard)."""
    degradation = DegradationAnalysis(
        entity_id="sensor.counter",
        slope_per_day=0.0,
        trend="stable",
        r_squared=0.8,
        current_value=50.0,
        data_points=30,
        lookback_days=30,
    )
    config = {
        "type": "counter",
        "trigger_target_value": 100,
    }
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is None


def test_threshold_prediction_counter_no_target() -> None:
    """Test threshold prediction for counter without target → None."""
    degradation = DegradationAnalysis(
        entity_id="sensor.counter",
        slope_per_day=5.0,
        trend="rising",
        r_squared=0.8,
        current_value=30.0,
        data_points=30,
        lookback_days=30,
    )
    config = {"type": "counter"}
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is None


def test_threshold_prediction_no_slope() -> None:
    """Test threshold prediction: slope=None → None."""
    degradation = DegradationAnalysis(
        entity_id="sensor.temp",
        slope_per_day=None,
        trend="insufficient_data",
        r_squared=None,
        current_value=20.0,
        data_points=2,
        lookback_days=30,
    )
    config = {"type": "threshold", "trigger_above": 30.0}
    assert SensorPredictor._compute_threshold_prediction(degradation, config) is None


def test_threshold_prediction_near_zero_slope_no_overflow() -> None:
    """Test threshold prediction handles near-zero slope without OverflowError.

    Regression test: a near-zero slope produces days_until that exceeds
    timedelta's max (999_999_999 days), previously crashing the coordinator.
    Now capped at 3650 days (10 years) to avoid overflow and provide
    a meaningful upper bound.
    """
    degradation = DegradationAnalysis(
        entity_id="sensor.temp",
        slope_per_day=1e-15,  # near-zero but not exactly 0
        trend="rising",
        r_squared=0.1,
        current_value=20.0,
        data_points=50,
        lookback_days=30,
    )
    config = {"type": "threshold", "trigger_above": 30.0}
    result = SensorPredictor._compute_threshold_prediction(degradation, config)
    assert result is not None
    # days_until capped at 3650 (10 years), so predicted_date is valid
    assert result.days_until_threshold == 3650
    assert result.predicted_date is not None


def test_linear_regression_unix_timestamps() -> None:
    """Test linear regression with realistic Unix timestamps.

    Regression test: raw timestamps (~1.7e9) cause catastrophic cancellation
    in the naive least-squares denominator (n*Σx²−(Σx)²). After normalization
    the slope should still be accurate.
    """
    base_ts = 1_700_000_000.0  # ~Nov 2023
    # 10 hourly points with y = 2.5 * hours + 100
    points = [
        (base_ts + i * 3600, 100.0 + 2.5 * i)
        for i in range(10)
    ]
    result = SensorPredictor._linear_regression(points)
    assert result is not None
    slope, intercept, r_squared = result
    # slope should be 2.5 per 3600s ≈ 6.944e-4 per second
    expected_slope = 2.5 / 3600.0
    assert abs(slope - expected_slope) < 1e-10
    assert abs(r_squared - 1.0) < 1e-6


def test_linear_regression_unix_timestamps_with_noise() -> None:
    """Test linear regression with Unix timestamps + noisy data stays accurate."""
    base_ts = 1_700_000_000.0
    # 20 points over 20 hours, y ≈ 0.5 * hours + 50 (with noise)
    import random
    rng = random.Random(42)
    points = [
        (base_ts + i * 3600, 50.0 + 0.5 * i + rng.gauss(0, 0.1))
        for i in range(20)
    ]
    result = SensorPredictor._linear_regression(points)
    assert result is not None
    slope, _intercept, r_squared = result
    expected_slope = 0.5 / 3600.0
    # With normalization, slope should be close to expected
    assert abs(slope - expected_slope) / expected_slope < 0.05  # within 5%
    assert r_squared > 0.9


# ─── SensorPredictor.async_analyze ───────────────────────────────────


@pytest.fixture
def predictor(hass: HomeAssistant) -> SensorPredictor:
    return SensorPredictor(hass)


async def test_analyze_non_sensor_based(predictor: SensorPredictor) -> None:
    """Test async_analyze returns None for non-sensor tasks."""
    result = await predictor.async_analyze(
        {"schedule_type": "time_based"}, {}
    )
    assert result is None


async def test_analyze_no_entity_id(predictor: SensorPredictor) -> None:
    """Test async_analyze returns None when no entity_id."""
    result = await predictor.async_analyze(
        {"schedule_type": "sensor_based", "trigger_config": {"type": "threshold"}},
        {},
    )
    assert result is None


async def test_analyze_unsupported_trigger_type(predictor: SensorPredictor) -> None:
    """Test async_analyze returns None for runtime trigger."""
    result = await predictor.async_analyze(
        {
            "schedule_type": "sensor_based",
            "trigger_config": {"type": "runtime", "entity_id": "sensor.test"},
        },
        {},
    )
    assert result is None


async def test_analyze_with_degradation(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test full async_analyze with degradation data from recorder."""
    # Generate enough data points (> DEFAULT_DEGRADATION_MIN_POINTS=5)
    now = datetime.now(timezone.utc)
    mock_points = [
        (now.timestamp() - i * 3600, 20.0 + i * 0.1)
        for i in range(20)
    ]
    mock_points.reverse()

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=mock_points,
    ):
        result = await predictor.async_analyze(
            {
                "schedule_type": "sensor_based",
                "trigger_config": {
                    "type": "threshold",
                    "entity_id": "sensor.temp",
                    "trigger_above": 30,
                },
            },
            {},
        )

    assert result is not None
    assert result.degradation is not None
    assert result.degradation.data_points == 20
    assert result.degradation.slope_per_day is not None


async def test_analyze_insufficient_data(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test async_analyze with insufficient recorder data."""
    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=[(1.0, 10.0)],
    ):
        result = await predictor.async_analyze(
            {
                "schedule_type": "sensor_based",
                "trigger_config": {
                    "type": "threshold",
                    "entity_id": "sensor.temp",
                    "trigger_above": 30,
                },
            },
            {},
        )

    assert result is not None
    assert result.degradation is not None
    assert result.degradation.trend == "insufficient_data"
    assert result.degradation.slope_per_day is None


async def test_analyze_with_environmental(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test async_analyze with environmental entity."""
    hass.states.async_set("sensor.humidity", "65")

    now = datetime.now(timezone.utc)
    task_points = [(now.timestamp() - i * 3600, 20.0 + i * 0.1) for i in range(20)]
    task_points.reverse()

    env_points = [(now.timestamp() - i * 3600, 50.0 + i * 0.5) for i in range(20)]
    env_points.reverse()

    call_count = 0

    async def mock_fetch(entity_id: str, days: int) -> list[tuple[float, float]]:
        nonlocal call_count
        call_count += 1
        if entity_id == "sensor.temp":
            return task_points
        return env_points

    with patch.object(predictor, "_async_fetch_statistics_points", side_effect=mock_fetch):
        result = await predictor.async_analyze(
            {
                "schedule_type": "sensor_based",
                "trigger_config": {
                    "type": "threshold",
                    "entity_id": "sensor.temp",
                    "trigger_above": 30,
                },
                "history": [],
            },
            {"environmental_entity": "sensor.humidity"},
        )

    assert result is not None
    assert result.environmental is not None
    assert result.environmental.entity_id == "sensor.humidity"


# ─── SensorPredictor._async_compute_degradation ─────────────────────


async def test_compute_degradation_regression_none(
    predictor: SensorPredictor,
) -> None:
    """Test degradation when regression returns None (constant x)."""
    # All same timestamp → denom=0 → regression returns None
    points = [(1000.0, 10.0), (1000.0, 20.0), (1000.0, 30.0),
              (1000.0, 40.0), (1000.0, 50.0)]

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=points,
    ):
        result = await predictor._async_compute_degradation("sensor.test", None, 30)

    assert result.trend == "insufficient_data"
    assert result.slope_per_day is None


async def test_compute_degradation_trend_classification(
    predictor: SensorPredictor,
) -> None:
    """Test degradation trend classification: stable, rising, falling."""
    now_ts = datetime.now(timezone.utc).timestamp()

    # Stable: very small slope relative to mean
    stable_points = [
        (now_ts - i * 3600, 100.0 + i * 0.0001) for i in range(10)
    ]
    stable_points.reverse()

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=stable_points,
    ):
        result = await predictor._async_compute_degradation("sensor.test", None, 30)
    assert result.trend == "stable"

    # Rising: values increase with time (earlier timestamps have lower values)
    # i=0 is now, i=9 is 9 days ago; after reverse: earliest first
    rising_points = [
        (now_ts - (9 - i) * 86400, 10.0 + i * 5.0) for i in range(10)
    ]
    # Already ordered: earliest (i=0, ts=now-9d, val=10) to latest (i=9, ts=now, val=55)

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=rising_points,
    ):
        result = await predictor._async_compute_degradation("sensor.test", None, 30)
    assert result.trend == "rising"

    # Falling: values decrease with time
    falling_points = [
        (now_ts - (9 - i) * 86400, 100.0 - i * 5.0) for i in range(10)
    ]

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=falling_points,
    ):
        result = await predictor._async_compute_degradation("sensor.test", None, 30)
    assert result.trend == "falling"


# ─── SensorPredictor._async_fetch_statistics_points ──────────────────


async def test_fetch_statistics_empty_result(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test fetch statistics returns empty list when entity has no data."""
    with patch(
        "homeassistant.components.recorder.statistics.statistics_during_period",
        return_value={},
    ):
        result = await predictor._async_fetch_statistics_points("sensor.test", 30)
    assert result == []


async def test_fetch_statistics_exception(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test fetch statistics handles general exceptions."""
    with patch(
        "homeassistant.components.recorder.statistics.statistics_during_period",
        side_effect=RuntimeError("DB error"),
    ):
        result = await predictor._async_fetch_statistics_points("sensor.test", 30)
    assert result == []


async def test_fetch_statistics_parses_rows(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test fetch statistics parses different row formats."""
    now = datetime.now(timezone.utc)
    mock_rows = [
        {"start": now.timestamp(), "mean": 25.0},
        {"start": int(now.timestamp() - 3600), "state": 20.0},  # int start, state value
        {"start": now - timedelta(hours=2), "mean": 15.0},  # datetime start
        {"start": None, "mean": 10.0},  # None start → skipped
        {"start": now.timestamp() - 10800, "mean": None, "state": None},  # No value → skipped
    ]

    with patch(
        "homeassistant.components.recorder.statistics.statistics_during_period",
        return_value={"sensor.test": mock_rows},
    ):
        result = await predictor._async_fetch_statistics_points("sensor.test", 30)

    # Should get 3 valid points (rows 0, 1, 2)
    assert len(result) == 3
    # Sorted by timestamp
    assert result[0][0] <= result[1][0] <= result[2][0]


# ─── SensorPredictor._async_analyze_environmental ────────────────────


async def test_environmental_insufficient_env_points(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test environmental analysis with insufficient env data points."""
    hass.states.async_set("sensor.env", "25")

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=[(1.0, 10.0)],  # < 10 points
    ):
        result = await predictor._async_analyze_environmental(
            "sensor.env", None, {"history": []}
        )

    assert result.has_sufficient_data is False
    assert result.adjustment_factor == 1.0


async def test_environmental_insufficient_completions(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test environmental analysis with < 2 completions."""
    hass.states.async_set("sensor.env", "25")
    now_ts = datetime.now(timezone.utc).timestamp()
    env_points = [(now_ts - i * 3600, 20.0) for i in range(20)]

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=env_points,
    ):
        result = await predictor._async_analyze_environmental(
            "sensor.env", None,
            {"history": [{"type": "completed", "timestamp": datetime.now(timezone.utc).isoformat()}]},
        )

    assert result.has_sufficient_data is False


async def test_environmental_with_sufficient_data(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test environmental analysis with sufficient data computes correlation."""
    hass.states.async_set("sensor.env", "30")
    now = datetime.now(timezone.utc)
    now_ts = now.timestamp()

    # Generate env points covering 90 days (one per day)
    env_points = [(now_ts - i * 86400, 20.0 + (i % 5)) for i in range(90)]
    env_points.reverse()

    # Generate enough completions (> DEFAULT_ENVIRONMENTAL_MIN_COMPLETIONS=3)
    # Each within 24h of an env point
    history = []
    for i in range(6):
        ts = (now - timedelta(days=i * 10)).isoformat()
        history.append({"type": "completed", "timestamp": ts})

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=env_points,
    ):
        result = await predictor._async_analyze_environmental(
            "sensor.env", None,
            {"history": history},
        )

    assert result.entity_id == "sensor.env"
    assert result.current_value == 30.0
    assert result.average_value is not None
    assert result.data_points >= 1


async def test_environmental_attribute_based(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test environmental analysis reads from attribute."""
    hass.states.async_set("sensor.device", "on", {"temperature": 28.5})
    now_ts = datetime.now(timezone.utc).timestamp()
    env_points = [(now_ts - i * 3600, 20.0) for i in range(5)]

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=env_points,
    ):
        result = await predictor._async_analyze_environmental(
            "sensor.device", "temperature",
            {"history": []},
        )

    assert result.current_value == 28.5


async def test_environmental_non_numeric_value(
    hass: HomeAssistant, predictor: SensorPredictor,
) -> None:
    """Test environmental analysis with non-numeric state."""
    hass.states.async_set("sensor.env", "not_a_number")
    now_ts = datetime.now(timezone.utc).timestamp()
    env_points = [(now_ts - i * 3600, 20.0) for i in range(5)]

    with patch.object(
        predictor, "_async_fetch_statistics_points",
        new_callable=AsyncMock, return_value=env_points,
    ):
        result = await predictor._async_analyze_environmental(
            "sensor.env", None,
            {"history": []},
        )

    assert result.current_value is None
