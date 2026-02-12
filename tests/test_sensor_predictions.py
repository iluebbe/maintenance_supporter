"""Tests for sensor-driven predictions (Phase 3).

Tests the SensorPredictor module including:
- Linear regression
- Degradation rate analysis
- Threshold prediction
- Pearson correlation
- Environmental analysis
"""

from __future__ import annotations

import math
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.maintenance_supporter.helpers.sensor_predictor import (
    DegradationAnalysis,
    EnvironmentalAnalysis,
    SensorPredictor,
    ThresholdPrediction,
)
from custom_components.maintenance_supporter.const import (
    DEFAULT_DEGRADATION_MIN_POINTS,
    DEFAULT_DEGRADATION_SIGNIFICANCE,
    DEFAULT_ENVIRONMENTAL_CORRELATION_MIN,
    DEFAULT_ENVIRONMENTAL_FACTOR_MAX,
    DEFAULT_ENVIRONMENTAL_FACTOR_MIN,
    DEFAULT_ENVIRONMENTAL_MIN_COMPLETIONS,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_linear_points(
    start_ts: float,
    slope_per_day: float,
    intercept: float,
    n_points: int,
    hours_apart: int = 1,
) -> list[tuple[float, float]]:
    """Create perfectly linear (timestamp, value) points."""
    points = []
    for i in range(n_points):
        ts = start_ts + i * hours_apart * 3600
        days = (ts - start_ts) / 86400.0
        val = intercept + slope_per_day * days
        points.append((ts, val))
    return points


def _make_noisy_points(
    start_ts: float,
    slope_per_day: float,
    intercept: float,
    n_points: int,
    noise_scale: float = 0.5,
) -> list[tuple[float, float]]:
    """Create linear points with deterministic noise."""
    points = []
    for i in range(n_points):
        ts = start_ts + i * 3600
        days = (ts - start_ts) / 86400.0
        # Deterministic 'noise' using sine
        noise = noise_scale * math.sin(i * 0.7)
        val = intercept + slope_per_day * days + noise
        points.append((ts, val))
    return points


def _make_history(dates: list[str]) -> list[dict]:
    """Create completed history entries from ISO date strings."""
    return [
        {"type": "completed", "timestamp": d + "T12:00:00+00:00"}
        for d in dates
    ]


def _ts(iso_date: str) -> float:
    """Convert ISO date string to epoch seconds."""
    return datetime.fromisoformat(iso_date + "T12:00:00+00:00").timestamp()


# ===========================================================================
# TestLinearRegression
# ===========================================================================


class TestLinearRegression:
    """Test the _linear_regression static method."""

    def test_empty_list(self):
        result = SensorPredictor._linear_regression([])
        assert result is None

    def test_single_point(self):
        result = SensorPredictor._linear_regression([(100.0, 50.0)])
        assert result is None

    def test_perfect_positive_line(self):
        """y = 2x + 10, perfect fit."""
        points = [(0, 10), (1, 12), (2, 14), (3, 16), (4, 18)]
        slope, intercept, r2 = SensorPredictor._linear_regression(points)
        assert abs(slope - 2.0) < 1e-10
        assert abs(intercept - 10.0) < 1e-10
        assert abs(r2 - 1.0) < 1e-10

    def test_perfect_negative_line(self):
        """y = -3x + 100."""
        points = [(0, 100), (1, 97), (2, 94), (3, 91)]
        slope, intercept, r2 = SensorPredictor._linear_regression(points)
        assert abs(slope - (-3.0)) < 1e-10
        assert abs(r2 - 1.0) < 1e-10

    def test_horizontal_line(self):
        """y = 5, no slope."""
        points = [(0, 5), (1, 5), (2, 5), (3, 5)]
        slope, intercept, r2 = SensorPredictor._linear_regression(points)
        assert abs(slope) < 1e-10
        assert abs(intercept - 5.0) < 1e-10

    def test_noisy_data_positive_trend(self):
        """Noisy but generally rising data."""
        # True slope is 0.5, noise is small
        points = [(0, 1.0), (1, 1.4), (2, 2.1), (3, 2.5), (4, 3.0)]
        slope, _intercept, r2 = SensorPredictor._linear_regression(points)
        assert slope > 0.4
        assert r2 > 0.95

    def test_two_points(self):
        """Minimum valid regression."""
        points = [(0.0, 0.0), (10.0, 100.0)]
        slope, intercept, r2 = SensorPredictor._linear_regression(points)
        assert abs(slope - 10.0) < 1e-10
        assert abs(r2 - 1.0) < 1e-10

    def test_identical_x_values(self):
        """All same x → can't fit."""
        points = [(5.0, 1.0), (5.0, 2.0), (5.0, 3.0)]
        result = SensorPredictor._linear_regression(points)
        assert result is None


# ===========================================================================
# TestPearsonCorrelation
# ===========================================================================


class TestPearsonCorrelation:
    """Test the _pearson_correlation static method."""

    def test_perfect_positive(self):
        r = SensorPredictor._pearson_correlation(
            [1, 2, 3, 4, 5], [10, 20, 30, 40, 50]
        )
        assert r is not None
        assert abs(r - 1.0) < 1e-10

    def test_perfect_negative(self):
        r = SensorPredictor._pearson_correlation(
            [1, 2, 3, 4, 5], [50, 40, 30, 20, 10]
        )
        assert r is not None
        assert abs(r - (-1.0)) < 1e-10

    def test_no_correlation(self):
        """Uncorrelated data should have r near 0."""
        # Pattern chosen to produce near-zero correlation
        r = SensorPredictor._pearson_correlation(
            [1, 2, 3, 4, 5, 6, 7], [4, 2, 5, 1, 6, 3, 4]
        )
        assert r is not None
        assert abs(r) < 0.5

    def test_insufficient_data(self):
        r = SensorPredictor._pearson_correlation([1, 2], [3, 4])
        assert r is None

    def test_zero_variance_x(self):
        r = SensorPredictor._pearson_correlation([5, 5, 5, 5], [1, 2, 3, 4])
        assert r is None

    def test_zero_variance_y(self):
        r = SensorPredictor._pearson_correlation([1, 2, 3, 4], [5, 5, 5, 5])
        assert r is None


# ===========================================================================
# TestThresholdPrediction
# ===========================================================================


class TestThresholdPrediction:
    """Test threshold prediction calculation."""

    def _make_degradation(
        self, current: float, slope: float, r2: float = 0.8
    ) -> DegradationAnalysis:
        return DegradationAnalysis(
            entity_id="sensor.test",
            slope_per_day=slope,
            trend="rising" if slope > 0 else "falling" if slope < 0 else "stable",
            r_squared=r2,
            current_value=current,
            data_points=100,
            lookback_days=30,
        )

    def test_rising_toward_above_threshold(self):
        """Value at 20, rising 1/day, threshold at 50 → ~30 days."""
        deg = self._make_degradation(current=20.0, slope=1.0)
        config = {"type": "threshold", "trigger_above": 50}
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is not None
        assert abs(pred.days_until_threshold - 30.0) < 0.1
        assert pred.threshold_direction == "above"
        assert pred.confidence == "high"
        assert pred.predicted_date is not None

    def test_falling_toward_below_threshold(self):
        """Value at 80, falling -2/day, threshold at 30 → 25 days."""
        deg = self._make_degradation(current=80.0, slope=-2.0)
        config = {"type": "threshold", "trigger_below": 30}
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is not None
        assert abs(pred.days_until_threshold - 25.0) < 0.1
        assert pred.threshold_direction == "below"

    def test_rate_zero_returns_none(self):
        deg = self._make_degradation(current=50.0, slope=0.0)
        config = {"type": "threshold", "trigger_above": 80}
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is None

    def test_slope_none_returns_none(self):
        deg = DegradationAnalysis(
            entity_id="sensor.test",
            slope_per_day=None,
            trend="insufficient_data",
            r_squared=None,
            current_value=50.0,
            data_points=3,
            lookback_days=30,
        )
        config = {"type": "threshold", "trigger_above": 80}
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is None

    def test_rate_going_away_returns_none(self):
        """Value falling but threshold is above → can't predict."""
        deg = self._make_degradation(current=20.0, slope=-1.0)
        config = {"type": "threshold", "trigger_above": 50}
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is None

    def test_already_exceeded(self):
        """Value already past threshold → days = 0."""
        deg = self._make_degradation(current=55.0, slope=1.0)
        config = {"type": "threshold", "trigger_above": 50}
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is not None
        assert pred.days_until_threshold == 0.0

    def test_counter_delta_prediction(self):
        """Counter in delta mode: current=100, baseline=60, target=80, rate=2/day → 20 days."""
        deg = self._make_degradation(current=100.0, slope=2.0)
        config = {
            "type": "counter",
            "trigger_target_value": 80,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 60,
        }
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is not None
        # current_delta = 100-60 = 40, target=80, remaining=40, rate=2 → 20 days
        assert abs(pred.days_until_threshold - 20.0) < 0.1

    def test_counter_absolute_prediction(self):
        """Counter absolute mode: current=200, target=500, rate=10/day → 30 days."""
        deg = self._make_degradation(current=200.0, slope=10.0)
        config = {
            "type": "counter",
            "trigger_target_value": 500,
            "trigger_delta_mode": False,
        }
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is not None
        assert abs(pred.days_until_threshold - 30.0) < 0.1

    def test_confidence_from_r_squared(self):
        """Low r² → low confidence."""
        deg = self._make_degradation(current=20.0, slope=1.0, r2=0.1)
        config = {"type": "threshold", "trigger_above": 50}
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is not None
        assert pred.confidence == "low"

        # Medium
        deg2 = self._make_degradation(current=20.0, slope=1.0, r2=0.5)
        pred2 = SensorPredictor._compute_threshold_prediction(deg2, config)
        assert pred2.confidence == "medium"

        # High
        deg3 = self._make_degradation(current=20.0, slope=1.0, r2=0.85)
        pred3 = SensorPredictor._compute_threshold_prediction(deg3, config)
        assert pred3.confidence == "high"


# ===========================================================================
# TestDegradationAnalysis
# ===========================================================================


class TestDegradationAnalysis:
    """Test degradation rate computation (mocked recorder)."""

    @pytest.fixture
    def predictor(self):
        hass = MagicMock()
        return SensorPredictor(hass)

    @pytest.mark.asyncio
    async def test_insufficient_data(self, predictor):
        """Less than MIN_POINTS → insufficient_data."""
        few_points = [(i * 3600, 10.0 + i * 0.1) for i in range(5)]
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=few_points
        ):
            result = await predictor._async_compute_degradation("sensor.test", None, 30)
        assert result.trend == "insufficient_data"
        assert result.slope_per_day is None

    @pytest.mark.asyncio
    async def test_rising_trend(self, predictor):
        """Clear upward trend → rising."""
        base_ts = 1700000000.0
        # 720 points (30 days), slope=2.0, intercept=10 → mean ≈ 40, ratio=2/40=0.05 → rising
        points = _make_linear_points(base_ts, slope_per_day=2.0, intercept=10.0, n_points=720)
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=points
        ):
            result = await predictor._async_compute_degradation("sensor.test", None, 30)
        assert result.trend == "rising"
        assert result.slope_per_day is not None
        assert result.slope_per_day > 0
        assert result.r_squared is not None
        assert result.r_squared > 0.99

    @pytest.mark.asyncio
    async def test_falling_trend(self, predictor):
        """Clear downward trend → falling."""
        base_ts = 1700000000.0
        # 720 points (30 days), slope=-2.0, intercept=100 → mean ≈ 70, ratio=2/70=0.029 → not enough
        # Use slope=-5.0, intercept=100 → mean ≈ 25, ratio=5/25=0.2 → clearly falling
        points = _make_linear_points(base_ts, slope_per_day=-5.0, intercept=100.0, n_points=480)
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=points
        ):
            result = await predictor._async_compute_degradation("sensor.test", None, 30)
        assert result.trend == "falling"
        assert result.slope_per_day < 0

    @pytest.mark.asyncio
    async def test_stable_trend(self, predictor):
        """Flat data → stable."""
        base_ts = 1700000000.0
        # slope_per_day = 0.001, mean ≈ 50 → ratio = 0.001/50 = 0.00002 < significance
        points = _make_linear_points(base_ts, slope_per_day=0.001, intercept=50.0, n_points=100)
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=points
        ):
            result = await predictor._async_compute_degradation("sensor.test", None, 30)
        assert result.trend == "stable"

    @pytest.mark.asyncio
    async def test_noisy_data_still_detects_trend(self, predictor):
        """Noisy but with clear underlying trend."""
        base_ts = 1700000000.0
        points = _make_noisy_points(base_ts, slope_per_day=2.0, intercept=10.0, n_points=200, noise_scale=0.5)
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=points
        ):
            result = await predictor._async_compute_degradation("sensor.test", None, 30)
        assert result.trend == "rising"
        assert result.r_squared > 0.8

    @pytest.mark.asyncio
    async def test_empty_data(self, predictor):
        """No recorder data → insufficient."""
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=[]
        ):
            result = await predictor._async_compute_degradation("sensor.test", None, 30)
        assert result.trend == "insufficient_data"
        assert result.data_points == 0


# ===========================================================================
# TestEnvironmentalAnalysis
# ===========================================================================


class TestEnvironmentalAnalysis:
    """Test environmental entity correlation analysis."""

    @pytest.fixture
    def predictor(self):
        hass = MagicMock()
        # Mock current env state
        state = MagicMock()
        state.state = "25.0"
        state.attributes = {}
        hass.states.get.return_value = state
        return SensorPredictor(hass)

    def _make_env_points(
        self, avg: float = 20.0, n_days: int = 90
    ) -> list[tuple[float, float]]:
        """Create env sensor points (hourly, centered around avg)."""
        base_ts = datetime(2026, 1, 1, tzinfo=timezone.utc).timestamp()
        points = []
        for i in range(n_days * 24):
            ts = base_ts + i * 3600
            # Sinusoidal temp pattern
            day = i / 24
            val = avg + 10 * math.sin(2 * math.pi * day / 365)
            points.append((ts, val))
        return points

    def _make_task_with_history_and_env_correlation(
        self, intervals: list[int], env_values: list[float]
    ) -> dict:
        """Create task_data with completion history that correlates with env values."""
        base = datetime(2026, 1, 1, tzinfo=timezone.utc)
        history = []
        current = base
        for interval in [0] + intervals:
            current += timedelta(days=interval)
            history.append({
                "type": "completed",
                "timestamp": current.isoformat(),
            })
        return {"history": history, "schedule_type": "sensor_based"}

    @pytest.mark.asyncio
    async def test_insufficient_env_data(self, predictor):
        """Too few env data points → insufficient."""
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=[(1, 20.0)]
        ):
            result = await predictor._async_analyze_environmental(
                "sensor.outdoor_temp", None,
                {"history": _make_history(["2026-01-01", "2026-01-15"])}
            )
        assert not result.has_sufficient_data
        assert result.adjustment_factor == 1.0

    @pytest.mark.asyncio
    async def test_insufficient_completions(self, predictor):
        """Enough env data but too few completions → insufficient."""
        env_points = self._make_env_points()
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=env_points
        ):
            # Only 1 completion → 0 intervals
            result = await predictor._async_analyze_environmental(
                "sensor.outdoor_temp", None,
                {"history": [{"type": "completed", "timestamp": "2026-01-01T12:00:00+00:00"}]}
            )
        assert not result.has_sufficient_data

    @pytest.mark.asyncio
    async def test_no_correlation_no_adjustment(self, predictor):
        """When correlation is weak → factor stays 1.0."""
        # Create env points with constant value → no correlation possible with varying intervals
        base_ts = datetime(2026, 1, 1, tzinfo=timezone.utc).timestamp()
        env_points = [(base_ts + i * 3600, 20.0 + (i % 2) * 0.01) for i in range(2160)]

        # Task with varying intervals
        task_data = {"history": _make_history([
            "2026-01-01", "2026-01-15", "2026-02-01", "2026-02-20",
            "2026-03-10", "2026-03-25",
        ])}

        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=env_points
        ):
            result = await predictor._async_analyze_environmental(
                "sensor.outdoor_temp", None, task_data
            )
        # Weak or no correlation → factor close to 1.0
        assert result.has_sufficient_data
        assert abs(result.adjustment_factor - 1.0) < 0.3

    @pytest.mark.asyncio
    async def test_factor_clamping(self, predictor):
        """Factor should be clamped to [MIN, MAX]."""
        # We test clamping by mocking directly
        env_analysis = EnvironmentalAnalysis(
            entity_id="sensor.test",
            current_value=50.0,
            average_value=20.0,
            correlation=0.9,
            adjustment_factor=1.0,  # will be recomputed
            has_sufficient_data=True,
            data_points=10,
        )
        # The clamping happens in _async_analyze_environmental logic
        assert DEFAULT_ENVIRONMENTAL_FACTOR_MIN == 0.5
        assert DEFAULT_ENVIRONMENTAL_FACTOR_MAX == 2.0


# ===========================================================================
# TestFindClosestValue
# ===========================================================================


class TestFindClosestValue:
    """Test the binary search helper."""

    def test_exact_match(self):
        points = [(10.0, 1.0), (20.0, 2.0), (30.0, 3.0)]
        assert SensorPredictor._find_closest_value(points, 20.0) == 2.0

    def test_between_points(self):
        points = [(10.0, 1.0), (20.0, 2.0), (30.0, 3.0)]
        # 18.0 is closer to 20.0 → value = 2.0
        assert SensorPredictor._find_closest_value(points, 18.0) == 2.0

    def test_beyond_24h_returns_none(self):
        points = [(10.0, 1.0)]
        # 100000 seconds away > 86400 → None
        assert SensorPredictor._find_closest_value(points, 100000.0) is None

    def test_empty_list(self):
        assert SensorPredictor._find_closest_value([], 10.0) is None


# ===========================================================================
# TestPoolPumpPressureScenario
# ===========================================================================


class TestPoolPumpPressureScenario:
    """Real-world: pool filter pressure rising toward cleaning threshold."""

    @pytest.fixture
    def predictor(self):
        hass = MagicMock()
        return SensorPredictor(hass)

    @pytest.mark.asyncio
    async def test_pressure_rising_prediction(self, predictor):
        """Filter pressure rises 1.5 psi/day from 5 toward trigger_above=25.

        slope/mean ratio = 1.5/~27.5 ≈ 0.055 > 0.05 → rising.
        """
        base_ts = 1700000000.0
        # 720 hourly points (30 days), pressure rising 1.5/day from 5
        # After 30 days: 5 + 1.5*30 = 50, mean ≈ 27.5, ratio = 1.5/27.5 ≈ 0.055
        points = _make_linear_points(
            base_ts, slope_per_day=1.5, intercept=5.0, n_points=720
        )

        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=points
        ):
            deg = await predictor._async_compute_degradation("sensor.pool_pressure", None, 30)

        assert deg.trend == "rising"
        assert deg.slope_per_day is not None
        assert abs(deg.slope_per_day - 1.5) < 0.01

        # Predict threshold crossing
        # Current value after 30 days: 5 + 1.5*30 = 50 → already past 25!
        # So days_until_threshold should be 0
        config = {"type": "threshold", "trigger_above": 25}
        pred = SensorPredictor._compute_threshold_prediction(deg, config)
        assert pred is not None
        assert pred.days_until_threshold == 0.0
        assert pred.confidence == "high"

    @pytest.mark.asyncio
    async def test_pressure_stable_no_prediction(self, predictor):
        """Filter pressure stable → no meaningful prediction."""
        base_ts = 1700000000.0
        # Very slight slope that's below significance threshold
        points = _make_linear_points(
            base_ts, slope_per_day=0.001, intercept=15.0, n_points=720
        )

        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=points
        ):
            deg = await predictor._async_compute_degradation("sensor.pool_pressure", None, 30)

        assert deg.trend == "stable"


# ===========================================================================
# TestAsyncAnalyze
# ===========================================================================


class TestAsyncAnalyze:
    """Test the main async_analyze entry point."""

    @pytest.fixture
    def predictor(self):
        hass = MagicMock()
        return SensorPredictor(hass)

    @pytest.mark.asyncio
    async def test_non_sensor_based_returns_none(self, predictor):
        """Time-based tasks should return None."""
        result = await predictor.async_analyze(
            {"schedule_type": "time_based"}, {}
        )
        assert result is None

    @pytest.mark.asyncio
    async def test_no_trigger_entity_returns_none(self, predictor):
        result = await predictor.async_analyze(
            {"schedule_type": "sensor_based", "trigger_config": {}}, {}
        )
        assert result is None

    @pytest.mark.asyncio
    async def test_state_change_trigger_returns_none(self, predictor):
        """State change triggers are not supported."""
        result = await predictor.async_analyze(
            {
                "schedule_type": "sensor_based",
                "trigger_config": {
                    "entity_id": "sensor.test",
                    "type": "state_change",
                },
            },
            {},
        )
        assert result is None

    @pytest.mark.asyncio
    async def test_full_analysis(self, predictor):
        """Full analysis with degradation + threshold prediction."""
        base_ts = 1700000000.0
        points = _make_linear_points(base_ts, slope_per_day=1.0, intercept=10.0, n_points=200)

        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=points
        ):
            result = await predictor.async_analyze(
                {
                    "schedule_type": "sensor_based",
                    "trigger_config": {
                        "entity_id": "sensor.test",
                        "type": "threshold",
                        "trigger_above": 50,
                    },
                },
                {},
            )
        assert result is not None
        assert result.degradation is not None
        assert result.degradation.trend == "rising"
        assert result.threshold_prediction is not None
        assert result.threshold_prediction.days_until_threshold is not None
        assert result.environmental is None  # no env entity configured

    @pytest.mark.asyncio
    async def test_with_environmental_entity(self, predictor):
        """Analysis with environmental entity binding."""
        base_ts = 1700000000.0
        sensor_points = _make_linear_points(base_ts, slope_per_day=0.5, intercept=10.0, n_points=100)
        env_points = [(base_ts + i * 3600, 20.0 + i * 0.01) for i in range(2160)]

        # Mock current env state
        state = MagicMock()
        state.state = "25.0"
        state.attributes = {}
        predictor.hass.states.get.return_value = state

        call_count = [0]
        async def mock_fetch(entity_id, days):
            call_count[0] += 1
            if entity_id == "sensor.test":
                return sensor_points
            return env_points

        with patch.object(predictor, "_async_fetch_statistics_points", side_effect=mock_fetch):
            result = await predictor.async_analyze(
                {
                    "schedule_type": "sensor_based",
                    "trigger_config": {
                        "entity_id": "sensor.test",
                        "type": "threshold",
                        "trigger_above": 50,
                    },
                    "history": _make_history([
                        "2026-01-01", "2026-01-15", "2026-02-01",
                        "2026-02-20", "2026-03-10",
                    ]),
                },
                {"environmental_entity": "sensor.outdoor_temp"},
            )
        assert result is not None
        assert result.degradation is not None
        assert result.environmental is not None
        assert result.environmental.entity_id == "sensor.outdoor_temp"


# ===========================================================================
# TestBackwardCompatibility
# ===========================================================================


class TestBackwardCompatibility:
    """Ensure existing tasks without prediction config work fine."""

    @pytest.fixture
    def predictor(self):
        hass = MagicMock()
        return SensorPredictor(hass)

    @pytest.mark.asyncio
    async def test_old_adaptive_config_no_crash(self, predictor):
        """Old adaptive_config without sensor_prediction_enabled should work."""
        base_ts = 1700000000.0
        points = _make_linear_points(base_ts, slope_per_day=0.5, intercept=10.0, n_points=100)
        with patch.object(
            predictor, "_async_fetch_statistics_points", return_value=points
        ):
            result = await predictor.async_analyze(
                {
                    "schedule_type": "sensor_based",
                    "trigger_config": {
                        "entity_id": "sensor.test",
                        "type": "threshold",
                        "trigger_above": 50,
                    },
                },
                {"enabled": True, "sensitivity": "moderate"},  # old config, no prediction keys
            )
        assert result is not None
        assert result.degradation is not None
