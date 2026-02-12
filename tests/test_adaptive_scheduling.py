"""Tests for the adaptive scheduling engine (Smart Scheduling Phase 3a).

Tests the IntervalAnalyzer module in isolation (pure Python, no HA) and
integration tests for coordinator, model, and websocket changes.
"""

from __future__ import annotations

import math
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.maintenance_supporter.helpers.interval_analyzer import (
    FEEDBACK_MULTIPLIERS,
    IntervalAnalysis,
    IntervalAnalyzer,
)
from custom_components.maintenance_supporter.const import (
    DEFAULT_ADAPTIVE_EWA_ALPHA,
    DEFAULT_ADAPTIVE_MAX_INTERVAL,
    DEFAULT_ADAPTIVE_MIN_COMPLETIONS,
    DEFAULT_ADAPTIVE_MIN_INTERVAL,
    DEFAULT_ADAPTIVE_RELIABILITY_TARGET,
    DEFAULT_ADAPTIVE_WEIBULL_MIN,
    MaintenanceFeedback,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)


# ============================================================================
# Test IntervalAnalyzer — Pure Unit Tests (no HA)
# ============================================================================


class TestComputeIntervals:
    """Test _compute_intervals_from_history."""

    def test_empty_history(self):
        analyzer = IntervalAnalyzer()
        result = analyzer._compute_intervals_from_history([])
        assert result == []

    def test_single_entry(self):
        analyzer = IntervalAnalyzer()
        history = [
            {"timestamp": "2026-01-15T10:00:00", "type": "completed"},
        ]
        result = analyzer._compute_intervals_from_history(history)
        assert result == []  # Need at least 2 completions for an interval

    def test_two_entries(self):
        analyzer = IntervalAnalyzer()
        history = [
            {"timestamp": "2026-01-01T10:00:00", "type": "completed"},
            {"timestamp": "2026-01-31T10:00:00", "type": "completed"},
        ]
        result = analyzer._compute_intervals_from_history(history)
        assert result == [30]

    def test_multiple_entries(self):
        analyzer = IntervalAnalyzer()
        history = [
            {"timestamp": "2026-01-01T10:00:00", "type": "completed"},
            {"timestamp": "2026-01-15T10:00:00", "type": "completed"},
            {"timestamp": "2026-02-01T10:00:00", "type": "completed"},
        ]
        result = analyzer._compute_intervals_from_history(history)
        assert result == [14, 17]

    def test_ignores_non_completed(self):
        analyzer = IntervalAnalyzer()
        history = [
            {"timestamp": "2026-01-01T10:00:00", "type": "completed"},
            {"timestamp": "2026-01-10T10:00:00", "type": "skipped"},
            {"timestamp": "2026-01-20T10:00:00", "type": "completed"},
        ]
        result = analyzer._compute_intervals_from_history(history)
        assert result == [19]

    def test_unordered_history(self):
        """History entries may not be in order — should sort by timestamp."""
        analyzer = IntervalAnalyzer()
        history = [
            {"timestamp": "2026-02-01T10:00:00", "type": "completed"},
            {"timestamp": "2026-01-01T10:00:00", "type": "completed"},
        ]
        result = analyzer._compute_intervals_from_history(history)
        assert result == [31]

    def test_same_day_completions_skipped(self):
        analyzer = IntervalAnalyzer()
        history = [
            {"timestamp": "2026-01-01T08:00:00", "type": "completed"},
            {"timestamp": "2026-01-01T14:00:00", "type": "completed"},
            {"timestamp": "2026-01-31T14:00:00", "type": "completed"},
        ]
        result = analyzer._compute_intervals_from_history(history)
        # Jan 1 14:00 to Jan 31 14:00 = 30 days
        # The 0-day gap (Jan 1 8:00→14:00) is skipped
        assert result == [30]


class TestExponentialWeightedAverage:
    """Test _exponential_weighted_average."""

    def test_single_value(self):
        analyzer = IntervalAnalyzer()
        result = analyzer._exponential_weighted_average([30.0], 0.3)
        assert result == 30.0

    def test_empty_list(self):
        analyzer = IntervalAnalyzer()
        result = analyzer._exponential_weighted_average([], 0.3)
        assert result == 0.0

    def test_converges_toward_recent(self):
        """EWA should be closer to the most recent values."""
        analyzer = IntervalAnalyzer()
        # Old values: 30, recent values: 60
        intervals = [30.0, 30.0, 30.0, 60.0, 60.0, 60.0]
        result = analyzer._exponential_weighted_average(intervals, 0.3)
        # Should be between 30 and 60, closer to 60
        assert result > 45
        assert result < 60

    def test_high_alpha_more_responsive(self):
        """Higher alpha should weight recent data more heavily."""
        analyzer = IntervalAnalyzer()
        intervals = [30.0, 30.0, 30.0, 60.0]
        low_alpha = analyzer._exponential_weighted_average(intervals, 0.1)
        high_alpha = analyzer._exponential_weighted_average(intervals, 0.9)
        # High alpha should be closer to 60 (the latest value)
        assert high_alpha > low_alpha

    def test_ewa_with_feedback_needed(self):
        """Feedback 'needed' keeps multiplier at 1.0."""
        assert FEEDBACK_MULTIPLIERS[MaintenanceFeedback.NEEDED] == 1.0

    def test_ewa_with_feedback_not_needed(self):
        """Feedback 'not_needed' uses multiplier 1.3 to extend."""
        assert FEEDBACK_MULTIPLIERS[MaintenanceFeedback.NOT_NEEDED] == 1.3


class TestWeibullFit:
    """Test _weibull_fit."""

    def test_insufficient_data(self):
        analyzer = IntervalAnalyzer()
        result = analyzer._weibull_fit([30.0, 28.0, 32.0])
        assert result is None  # < 5 data points

    def test_basic_fit(self):
        """Should return valid beta, eta for reasonable data."""
        analyzer = IntervalAnalyzer()
        # Simulated data with wear-out pattern (increasing failure rate)
        intervals = [25.0, 28.0, 30.0, 32.0, 35.0, 27.0, 29.0, 31.0]
        result = analyzer._weibull_fit(intervals)
        assert result is not None
        beta, eta, _r2 = result
        assert beta > 0
        assert eta > 0

    def test_wear_out_pattern(self):
        """Data with clear increasing pattern should have beta > 1."""
        analyzer = IntervalAnalyzer()
        # Tight clustering around ~30 days = high beta (wear-out)
        intervals = [29.0, 30.0, 30.0, 31.0, 30.0, 29.5, 30.5]
        result = analyzer._weibull_fit(intervals)
        assert result is not None
        beta, _, _r2 = result
        assert beta > 1  # Wear-out pattern

    def test_zero_intervals_handled(self):
        """Zero-value intervals should be filtered out."""
        analyzer = IntervalAnalyzer()
        intervals = [0.0, 0.0, 30.0, 28.0, 32.0, 31.0, 29.0]
        result = analyzer._weibull_fit(intervals)
        # Should still fit with the valid values
        if result is not None:
            beta, eta, _r2 = result
            assert beta > 0
            assert eta > 0


class TestWeibullRecommendedInterval:
    """Test _weibull_recommended_interval."""

    def test_basic_recommendation(self):
        analyzer = IntervalAnalyzer()
        # beta=2, eta=30, reliability=0.9
        result = analyzer._weibull_recommended_interval(2.0, 30.0, 0.9)
        assert result > 0
        assert result < 30  # At 90% reliability, should be less than eta

    def test_invalid_params(self):
        analyzer = IntervalAnalyzer()
        assert analyzer._weibull_recommended_interval(0, 30, 0.9) == 0
        assert analyzer._weibull_recommended_interval(2, 0, 0.9) == 0
        assert analyzer._weibull_recommended_interval(2, 30, 0) == 0
        assert analyzer._weibull_recommended_interval(2, 30, 1) == 0


class TestConfidenceLevels:
    """Test _compute_confidence."""

    def test_low_confidence(self):
        analyzer = IntervalAnalyzer()
        assert analyzer._compute_confidence(0) == "low"
        assert analyzer._compute_confidence(1) == "low"
        assert analyzer._compute_confidence(2) == "low"

    def test_medium_confidence(self):
        analyzer = IntervalAnalyzer()
        assert analyzer._compute_confidence(3) == "medium"
        assert analyzer._compute_confidence(5) == "medium"
        assert analyzer._compute_confidence(7) == "medium"

    def test_high_confidence(self):
        analyzer = IntervalAnalyzer()
        assert analyzer._compute_confidence(8) == "high"
        assert analyzer._compute_confidence(15) == "high"
        assert analyzer._compute_confidence(100) == "high"


class TestBlendRecommendations:
    """Test _blend_recommendations."""

    def test_low_confidence_returns_none(self):
        analyzer = IntervalAnalyzer()
        result, reason = analyzer._blend_recommendations(
            base=30, ewa=25.0, weibull=28, confidence="low"
        )
        assert result is None
        assert reason is None

    def test_medium_confidence_50_50(self):
        analyzer = IntervalAnalyzer()
        result, reason = analyzer._blend_recommendations(
            base=30, ewa=20.0, weibull=None, confidence="medium"
        )
        assert result is not None
        # 50% of 30 + 50% of 20 = 25
        assert result == 25
        assert reason == "ewa"

    def test_high_confidence_20_80(self):
        analyzer = IntervalAnalyzer()
        result, reason = analyzer._blend_recommendations(
            base=30, ewa=20.0, weibull=None, confidence="high"
        )
        assert result is not None
        # 20% of 30 + 80% of 20 = 22
        assert result == 22
        assert reason == "ewa"

    def test_ewa_and_weibull_combined(self):
        analyzer = IntervalAnalyzer()
        result, reason = analyzer._blend_recommendations(
            base=30, ewa=20.0, weibull=24, confidence="high"
        )
        assert result is not None
        # statistical = mean(20, 24) = 22
        # 20% of 30 + 80% of 22 = 6 + 17.6 = 23.6 → 24
        assert result == 24
        assert reason == "ewa_and_weibull"

    def test_no_predictions(self):
        analyzer = IntervalAnalyzer()
        result, reason = analyzer._blend_recommendations(
            base=30, ewa=None, weibull=None, confidence="high"
        )
        assert result is None
        assert reason is None


class TestAnalyze:
    """Test the full analyze() method."""

    def test_analyze_empty_history(self):
        analyzer = IntervalAnalyzer()
        task_data = {"interval_days": 30, "history": []}
        adaptive_config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "feedback_count": 0,
        }
        result = analyzer.analyze(task_data, adaptive_config)
        assert isinstance(result, IntervalAnalysis)
        assert result.current_interval == 30
        assert result.data_points == 0
        assert result.confidence == "low"
        assert result.recommended_interval is None

    def test_analyze_with_sufficient_data(self):
        analyzer = IntervalAnalyzer()
        # Build history with 10 completions, ~30 day intervals
        base_date = datetime(2025, 1, 1)
        history = []
        for i in range(10):
            ts = (base_date + timedelta(days=30 * i)).isoformat()
            history.append({
                "timestamp": ts,
                "type": "completed",
                "feedback": "needed" if i > 0 else None,
            })

        task_data = {"interval_days": 30, "history": history}
        adaptive_config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "feedback_count": 9,
            "smoothed_interval": 30.0,
            "min_interval_days": 7,
            "max_interval_days": 365,
        }
        result = analyzer.analyze(task_data, adaptive_config)
        assert result.data_points == 9  # 10 completions → 9 intervals
        assert result.confidence == "high"
        assert result.ewa_prediction is not None
        assert result.average_actual_interval is not None


class TestUpdateOnCompletion:
    """Test update_on_completion."""

    def test_first_completion(self):
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "feedback_count": 0,
            "min_interval_days": 7,
            "max_interval_days": 365,
        }
        updated = analyzer.update_on_completion(config, 28, "needed")
        assert updated["smoothed_interval"] == 28.0  # First value = raw
        assert updated["feedback_count"] == 1
        assert updated["confidence"] == "low"

    def test_subsequent_completion(self):
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "smoothed_interval": 30.0,
            "feedback_count": 5,
            "min_interval_days": 7,
            "max_interval_days": 365,
        }
        updated = analyzer.update_on_completion(config, 25, "needed")
        # smoothed = 0.3 * 25 + 0.7 * 30 = 7.5 + 21 = 28.5
        assert updated["smoothed_interval"] == 28.5
        assert updated["feedback_count"] == 6

    def test_not_needed_extends_interval(self):
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "smoothed_interval": 30.0,
            "feedback_count": 5,
            "min_interval_days": 7,
            "max_interval_days": 365,
        }
        updated = analyzer.update_on_completion(config, 30, "not_needed")
        # effective = 30 * 1.3 = 39
        # smoothed = 0.3 * 39 + 0.7 * 30 = 11.7 + 21 = 32.7
        assert updated["smoothed_interval"] == 32.7
        assert updated["feedback_count"] == 6

    def test_no_feedback_no_count_increment(self):
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "smoothed_interval": 30.0,
            "feedback_count": 5,
            "min_interval_days": 7,
            "max_interval_days": 365,
        }
        updated = analyzer.update_on_completion(config, 28, None)
        assert updated["feedback_count"] == 5  # Not incremented
        assert updated["smoothed_interval"] is not None

    def test_min_max_clamping(self):
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "smoothed_interval": 5.0,
            "feedback_count": 8,
            "base_interval": 7,
            "min_interval_days": 14,
            "max_interval_days": 60,
        }
        updated = analyzer.update_on_completion(config, 3, "needed")
        # Even if prediction is very low, should be clamped to min
        if updated["current_recommendation"] is not None:
            assert updated["current_recommendation"] >= 14
            assert updated["current_recommendation"] <= 60

    def test_original_config_not_mutated(self):
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "smoothed_interval": 30.0,
            "feedback_count": 5,
            "min_interval_days": 7,
            "max_interval_days": 365,
        }
        original_count = config["feedback_count"]
        _ = analyzer.update_on_completion(config, 28, "needed")
        assert config["feedback_count"] == original_count  # Not mutated


# ============================================================================
# Test MaintenanceTask Model — adaptive_config field
# ============================================================================


class TestMaintenanceTaskAdaptive:
    """Test adaptive_config field on MaintenanceTask."""

    def test_default_adaptive_config_is_none(self):
        task = MaintenanceTask(
            id="test",
            object_id="obj1",
            name="Test Task",
            type="cleaning",
        )
        assert task.adaptive_config is None

    def test_to_dict_includes_adaptive_config(self):
        task = MaintenanceTask(
            id="test",
            object_id="obj1",
            name="Test Task",
            type="cleaning",
            adaptive_config={"enabled": True, "ewa_alpha": 0.3},
        )
        d = task.to_dict()
        assert "adaptive_config" in d
        assert d["adaptive_config"]["enabled"] is True

    def test_to_dict_excludes_none_adaptive_config(self):
        task = MaintenanceTask(
            id="test",
            object_id="obj1",
            name="Test Task",
            type="cleaning",
        )
        d = task.to_dict()
        assert "adaptive_config" not in d

    def test_from_dict_with_adaptive_config(self):
        data = {
            "id": "test",
            "object_id": "obj1",
            "name": "Test Task",
            "type": "cleaning",
            "enabled": True,
            "schedule_type": "time_based",
            "warning_days": 7,
            "history": [],
            "adaptive_config": {"enabled": True, "ewa_alpha": 0.3},
        }
        task = MaintenanceTask.from_dict(data)
        assert task.adaptive_config is not None
        assert task.adaptive_config["enabled"] is True

    def test_from_dict_without_adaptive_config(self):
        """Backward compatibility — tasks without adaptive_config."""
        data = {
            "id": "test",
            "object_id": "obj1",
            "name": "Test Task",
            "type": "cleaning",
            "enabled": True,
            "schedule_type": "time_based",
            "warning_days": 7,
            "history": [],
        }
        task = MaintenanceTask.from_dict(data)
        assert task.adaptive_config is None

    def test_complete_with_feedback(self):
        """Complete should store feedback in history entry."""
        task = MaintenanceTask(
            id="test",
            object_id="obj1",
            name="Test Task",
            type="cleaning",
            schedule_type="time_based",
            interval_days=30,
        )
        task.complete(feedback="needed")
        assert len(task.history) == 1
        assert task.history[0]["feedback"] == "needed"

    def test_complete_without_feedback(self):
        """Complete without feedback should not add feedback key."""
        task = MaintenanceTask(
            id="test",
            object_id="obj1",
            name="Test Task",
            type="cleaning",
            schedule_type="time_based",
            interval_days=30,
        )
        task.complete()
        assert len(task.history) == 1
        assert "feedback" not in task.history[0]

    def test_round_trip_preserves_adaptive_config(self):
        """to_dict → from_dict should preserve adaptive_config."""
        original = MaintenanceTask(
            id="test",
            object_id="obj1",
            name="Test Task",
            type="cleaning",
            schedule_type="time_based",
            interval_days=30,
            adaptive_config={
                "enabled": True,
                "ewa_alpha": 0.3,
                "smoothed_interval": 28.5,
                "feedback_count": 5,
                "confidence": "medium",
            },
        )
        d = original.to_dict()
        restored = MaintenanceTask.from_dict(d)
        assert restored.adaptive_config == original.adaptive_config


# ============================================================================
# Test Constants
# ============================================================================


class TestConstants:
    """Verify adaptive scheduling constants are properly defined."""

    def test_defaults(self):
        assert DEFAULT_ADAPTIVE_EWA_ALPHA == 0.3
        assert DEFAULT_ADAPTIVE_MIN_INTERVAL == 7
        assert DEFAULT_ADAPTIVE_MAX_INTERVAL == 365
        assert DEFAULT_ADAPTIVE_MIN_COMPLETIONS == 3
        assert DEFAULT_ADAPTIVE_WEIBULL_MIN == 5
        assert DEFAULT_ADAPTIVE_RELIABILITY_TARGET == 0.9

    def test_feedback_enum(self):
        assert MaintenanceFeedback.NEEDED == "needed"
        assert MaintenanceFeedback.NOT_NEEDED == "not_needed"
        assert MaintenanceFeedback.NOT_SURE == "not_sure"

    def test_feedback_multipliers(self):
        assert FEEDBACK_MULTIPLIERS["needed"] == 1.0
        assert FEEDBACK_MULTIPLIERS["not_needed"] == 1.3
        assert FEEDBACK_MULTIPLIERS["not_sure"] == 1.1


class TestWeibullRSquared:
    """Test R-squared computation in Weibull fit (Phase 4)."""

    def test_r_squared_returned(self):
        """Weibull fit should return (beta, eta, r_squared) tuple."""
        analyzer = IntervalAnalyzer()
        intervals = [29.0, 30.0, 30.0, 31.0, 30.0, 29.5, 30.5]
        result = analyzer._weibull_fit(intervals)
        assert result is not None
        assert len(result) == 3
        beta, eta, r_squared = result
        assert beta > 0
        assert eta > 0
        assert 0 <= r_squared <= 1

    def test_good_fit_high_r_squared(self):
        """Tight clustering should produce high R-squared."""
        analyzer = IntervalAnalyzer()
        intervals = [30.0, 30.1, 29.9, 30.0, 30.0, 29.8, 30.2]
        result = analyzer._weibull_fit(intervals)
        assert result is not None
        _, _, r_squared = result
        assert r_squared > 0.85

    def test_r_squared_is_bounded(self):
        """R-squared should be between 0 and 1 even for scattered data."""
        analyzer = IntervalAnalyzer()
        intervals = [5.0, 60.0, 10.0, 90.0, 30.0, 3.0, 45.0]
        result = analyzer._weibull_fit(intervals)
        assert result is not None
        _, _, r_squared = result
        assert 0.0 <= r_squared <= 1.0


class TestConfidenceIntervals:
    """Test confidence interval bounds computation (Phase 4)."""

    def test_confidence_bounds_ordering(self):
        """Conservative bound (R=0.95) should be less than aggressive (R=0.80)."""
        analyzer = IntervalAnalyzer()
        low = analyzer._weibull_recommended_interval(2.0, 30.0, 0.95)
        high = analyzer._weibull_recommended_interval(2.0, 30.0, 0.80)
        target = analyzer._weibull_recommended_interval(2.0, 30.0, 0.90)
        assert low > 0
        assert high > 0
        assert low < target < high

    def test_analyze_returns_confidence_bounds(self):
        """analyze() should return confidence_interval_low and _high."""
        analyzer = IntervalAnalyzer()
        base_date = datetime(2025, 1, 1)
        # Create intervals with slight variation so Weibull can fit
        offsets = [0, 28, 59, 88, 120, 148, 179, 210, 240]
        history = [
            {
                "timestamp": (base_date + timedelta(days=d)).isoformat(),
                "type": "completed",
            }
            for d in offsets
        ]
        task_data = {"interval_days": 30, "history": history}
        adaptive_config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "feedback_count": 8,
            "smoothed_interval": 30.0,
            "min_interval_days": 7,
            "max_interval_days": 365,
        }
        result = analyzer.analyze(task_data, adaptive_config)
        assert result.weibull_beta is not None
        assert result.weibull_eta is not None
        assert result.weibull_r_squared is not None
        assert result.confidence_interval_low is not None
        assert result.confidence_interval_high is not None
        assert result.confidence_interval_low < result.confidence_interval_high

    def test_no_confidence_bounds_without_weibull(self):
        """When less than 5 data points, no confidence bounds."""
        analyzer = IntervalAnalyzer()
        base_date = datetime(2025, 1, 1)
        history = [
            {
                "timestamp": (base_date + timedelta(days=30 * i)).isoformat(),
                "type": "completed",
            }
            for i in range(3)  # Only 2 intervals — not enough for Weibull
        ]
        task_data = {"interval_days": 30, "history": history}
        adaptive_config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "feedback_count": 3,
        }
        result = analyzer.analyze(task_data, adaptive_config)
        assert result.confidence_interval_low is None
        assert result.confidence_interval_high is None


class TestWeibullCDFMath:
    """Test the Weibull CDF formula used for the chart (Phase 4)."""

    def test_cdf_at_zero(self):
        """F(0) should be 0."""
        assert 1 - math.exp(-((0.0 / 30.0) ** 2)) == 0.0

    def test_cdf_at_eta(self):
        """F(eta) should always be 1 - exp(-1) ~ 0.6321 for all beta."""
        eta = 30.0
        for beta in [0.5, 1.0, 2.0, 3.5, 5.0]:
            f_at_eta = 1 - math.exp(-((eta / eta) ** beta))
            assert abs(f_at_eta - 0.6321) < 0.001

    def test_reliability_at_recommended(self):
        """At the recommended interval (R=0.9), reliability should be ~90%."""
        analyzer = IntervalAnalyzer()
        rec = analyzer._weibull_recommended_interval(2.0, 30.0, 0.9)
        f = 1 - math.exp(-((rec / 30.0) ** 2.0))
        r = 1 - f
        assert abs(r - 0.9) < 0.02  # Within 2% tolerance (rounding)
