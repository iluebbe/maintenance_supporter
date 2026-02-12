"""Tests for the seasonal scheduling engine (Smart Scheduling Phase 2).

Tests the seasonal extensions to IntervalAnalyzer in isolation (pure Python, no HA).
Covers monthly factor computation, quarterly fallback, hemisphere mapping,
manual overrides, and integration with the existing analyze()/update_on_completion().
"""

from __future__ import annotations

from datetime import datetime, timedelta

import pytest

from custom_components.maintenance_supporter.helpers.interval_analyzer import (
    IntervalAnalyzer,
    SeasonalAnalysis,
)
from custom_components.maintenance_supporter.const import (
    DEFAULT_ADAPTIVE_EWA_ALPHA,
    DEFAULT_ADAPTIVE_MIN_INTERVAL,
    DEFAULT_ADAPTIVE_MAX_INTERVAL,
    DEFAULT_SEASONAL_FACTOR_MAX,
    DEFAULT_SEASONAL_FACTOR_MIN,
    DEFAULT_SEASONAL_MIN_DATA,
    NORTHERN_SEASONS,
    SOUTHERN_SEASONS,
)


# Helper to generate history completions at specific dates
def _make_history(dates: list[str]) -> list[dict]:
    """Create history entries from ISO date strings."""
    return [
        {"timestamp": f"{d}T10:00:00", "type": "completed"}
        for d in dates
    ]


def _make_history_with_feedback(dates: list[str], feedback: str = "needed") -> list[dict]:
    """Create history entries with feedback from ISO date strings."""
    return [
        {"timestamp": f"{d}T10:00:00", "type": "completed", "feedback": feedback}
        for d in dates
    ]


# ============================================================================
# Test _compute_intervals_with_months
# ============================================================================


class TestComputeIntervalsWithMonths:
    """Test _compute_intervals_with_months method."""

    def test_empty_history(self):
        analyzer = IntervalAnalyzer()
        result = analyzer._compute_intervals_with_months([])
        assert result == []

    def test_single_completion(self):
        analyzer = IntervalAnalyzer()
        history = _make_history(["2026-01-15"])
        result = analyzer._compute_intervals_with_months(history)
        assert result == []

    def test_two_completions(self):
        analyzer = IntervalAnalyzer()
        history = _make_history(["2026-01-01", "2026-01-31"])
        result = analyzer._compute_intervals_with_months(history)
        assert result == [(30, 1)]  # 30 days, end-month = January

    def test_cross_month_boundary(self):
        analyzer = IntervalAnalyzer()
        history = _make_history(["2026-01-20", "2026-02-10"])
        result = analyzer._compute_intervals_with_months(history)
        assert result == [(21, 2)]  # 21 days, end-month = February

    def test_multiple_intervals(self):
        analyzer = IntervalAnalyzer()
        history = _make_history([
            "2025-06-01", "2025-06-15",  # 14 days, end June
            "2025-07-15",                 # 30 days, end July
            "2025-12-15",                 # 153 days, end December
        ])
        result = analyzer._compute_intervals_with_months(history)
        assert result == [(14, 6), (30, 7), (153, 12)]

    def test_ignores_non_completed(self):
        analyzer = IntervalAnalyzer()
        history = [
            {"timestamp": "2026-01-01T10:00:00", "type": "completed"},
            {"timestamp": "2026-01-10T10:00:00", "type": "skipped"},
            {"timestamp": "2026-01-20T10:00:00", "type": "completed"},
        ]
        result = analyzer._compute_intervals_with_months(history)
        assert result == [(19, 1)]  # Only completed entries

    def test_same_day_skipped(self):
        analyzer = IntervalAnalyzer()
        history = _make_history(["2026-03-15", "2026-03-15"])
        result = analyzer._compute_intervals_with_months(history)
        assert result == []  # Same-day = 0 delta, skipped


# ============================================================================
# Test _compute_monthly_factors
# ============================================================================


class TestComputeMonthlyFactors:
    """Test _compute_monthly_factors method."""

    def test_insufficient_data(self):
        """< 6 intervals → all 1.0 factors."""
        analyzer = IntervalAnalyzer()
        intervals = [(30, 1), (28, 2), (31, 3)]  # Only 3
        result = analyzer._compute_monthly_factors(intervals, "north")
        assert not result.has_sufficient_data
        assert result.monthly_factors == [1.0] * 12

    def test_empty_intervals(self):
        analyzer = IntervalAnalyzer()
        result = analyzer._compute_monthly_factors([], "north")
        assert not result.has_sufficient_data
        assert result.data_months == 0

    def test_uniform_distribution(self):
        """Same interval every month → all factors ~1.0."""
        analyzer = IntervalAnalyzer()
        # 12 intervals of 30 days, one per month
        intervals = [(30, m) for m in range(1, 13)]
        result = analyzer._compute_monthly_factors(intervals, "north")
        assert result.has_sufficient_data
        for f in result.monthly_factors:
            assert abs(f - 1.0) < 0.01

    def test_summer_heavy(self):
        """Short intervals in summer → summer factors < 1.0."""
        analyzer = IntervalAnalyzer()
        # Summer (Jun, Jul, Aug): 14-day intervals
        # Winter (Dec, Jan, Feb): 45-day intervals
        intervals = [
            (14, 6), (14, 6), (14, 7), (14, 7), (14, 8), (14, 8),  # Summer: 14d
            (45, 12), (45, 1), (45, 2),  # Winter: 45d
        ]
        result = analyzer._compute_monthly_factors(intervals, "north")
        assert result.has_sufficient_data

        # Summer months should have factors < 1.0 (more frequent)
        for m in [6, 7, 8]:
            assert result.monthly_factors[m - 1] < 1.0, f"Month {m} should be < 1.0"

        # Winter months should have factors > 1.0 (less frequent)
        for m in [12, 1, 2]:
            assert result.monthly_factors[m - 1] > 1.0, f"Month {m} should be > 1.0"

    def test_quarterly_fallback_northern(self):
        """Missing months use quarterly average (northern hemisphere)."""
        analyzer = IntervalAnalyzer()
        # Only have June data (summer) and December data (winter)
        intervals = [
            (14, 6), (14, 6), (14, 6),  # June: 14d
            (45, 12), (45, 12), (45, 12),  # December: 45d
        ]
        result = analyzer._compute_monthly_factors(intervals, "north")

        # July and August (same summer quarter as June) should get June's factor
        june_factor = result.monthly_factors[5]  # index 5 = June
        july_factor = result.monthly_factors[6]   # index 6 = July
        aug_factor = result.monthly_factors[7]    # index 7 = August
        assert abs(july_factor - june_factor) < 0.01
        assert abs(aug_factor - june_factor) < 0.01

        # January and February (same winter quarter as December) should get Dec's factor
        dec_factor = result.monthly_factors[11]
        jan_factor = result.monthly_factors[0]
        feb_factor = result.monthly_factors[1]
        assert abs(jan_factor - dec_factor) < 0.01
        assert abs(feb_factor - dec_factor) < 0.01

    def test_quarterly_fallback_southern(self):
        """Southern hemisphere: Dec is summer, Jun is winter."""
        analyzer = IntervalAnalyzer()
        # In southern hemisphere, December = summer
        intervals = [
            (14, 12), (14, 12), (14, 12),  # Dec (summer in south): 14d
            (45, 6), (45, 6), (45, 6),      # Jun (winter in south): 45d
        ]
        result = analyzer._compute_monthly_factors(intervals, "south")

        # January and February (same summer quarter as December in south)
        dec_factor = result.monthly_factors[11]
        jan_factor = result.monthly_factors[0]
        feb_factor = result.monthly_factors[1]
        assert abs(jan_factor - dec_factor) < 0.01
        assert abs(feb_factor - dec_factor) < 0.01

    def test_manual_overrides(self):
        """Manual overrides replace learned values."""
        analyzer = IntervalAnalyzer()
        intervals = [(30, m) for m in range(1, 13)]  # Uniform
        overrides = {7: 0.5, 1: 2.0}  # July: 0.5, January: 2.0
        result = analyzer._compute_monthly_factors(
            intervals, "north", manual_overrides=overrides
        )

        assert result.monthly_factors[6] == 0.5   # July overridden
        assert result.monthly_factors[0] == 2.0    # January overridden
        assert abs(result.monthly_factors[2] - 1.0) < 0.01  # March: learned (1.0)

    def test_manual_overrides_without_history(self):
        """Manual overrides work even with no history data."""
        analyzer = IntervalAnalyzer()
        overrides = {6: 0.7, 7: 0.7, 8: 0.7, 12: 1.5, 1: 1.5, 2: 1.5}
        result = analyzer._compute_monthly_factors(
            [], "north", manual_overrides=overrides
        )

        assert not result.has_sufficient_data
        assert result.monthly_factors[5] == 0.7   # June
        assert result.monthly_factors[11] == 1.5  # December
        assert result.monthly_factors[3] == 1.0   # April: no override, default 1.0

    def test_clamping(self):
        """Factors are clamped to [MIN, MAX]."""
        analyzer = IntervalAnalyzer()
        # Extreme variance: 1-day in summer vs 500-day in winter
        intervals = [
            (1, 6), (1, 6), (1, 7),
            (500, 12), (500, 1), (500, 2),
        ]
        result = analyzer._compute_monthly_factors(intervals, "north")

        for f in result.monthly_factors:
            assert f >= DEFAULT_SEASONAL_FACTOR_MIN
            assert f <= DEFAULT_SEASONAL_FACTOR_MAX

    def test_data_months_count(self):
        analyzer = IntervalAnalyzer()
        intervals = [(30, 1), (28, 1), (30, 6), (30, 6), (30, 7), (30, 12)]
        result = analyzer._compute_monthly_factors(intervals, "north")
        # Unique months: {1, 6, 7, 12} = 4
        assert result.data_months == 4

    def test_hemisphere_field(self):
        analyzer = IntervalAnalyzer()
        result = analyzer._compute_monthly_factors([], "south")
        assert result.hemisphere == "south"


# ============================================================================
# Test _apply_seasonal_adjustment
# ============================================================================


class TestApplySeasonalAdjustment:
    """Test _apply_seasonal_adjustment method."""

    def test_factor_below_one(self):
        """Factor < 1.0 shortens interval."""
        result = IntervalAnalyzer._apply_seasonal_adjustment(30, 0.7, 7, 365)
        assert result == 21  # 30 * 0.7 = 21

    def test_factor_above_one(self):
        """Factor > 1.0 lengthens interval."""
        result = IntervalAnalyzer._apply_seasonal_adjustment(30, 1.5, 7, 365)
        assert result == 45  # 30 * 1.5 = 45

    def test_factor_one(self):
        """Factor 1.0 = no change."""
        result = IntervalAnalyzer._apply_seasonal_adjustment(30, 1.0, 7, 365)
        assert result == 30

    def test_clamped_to_min(self):
        """Result clamped to min_interval."""
        result = IntervalAnalyzer._apply_seasonal_adjustment(10, 0.3, 7, 365)
        assert result == 7  # 10 * 0.3 = 3, clamped to 7

    def test_clamped_to_max(self):
        """Result clamped to max_interval."""
        result = IntervalAnalyzer._apply_seasonal_adjustment(200, 2.5, 7, 365)
        assert result == 365  # 200 * 2.5 = 500, clamped to 365


# ============================================================================
# Test analyze() with seasonal data
# ============================================================================


class TestAnalyzeWithSeasonal:
    """Test that analyze() integrates seasonal adjustment correctly."""

    def _make_adaptive_config(self, **kwargs):
        """Create a base adaptive config dict."""
        config = {
            "enabled": True,
            "ewa_alpha": DEFAULT_ADAPTIVE_EWA_ALPHA,
            "min_interval_days": DEFAULT_ADAPTIVE_MIN_INTERVAL,
            "max_interval_days": DEFAULT_ADAPTIVE_MAX_INTERVAL,
            "feedback_count": 10,  # High confidence
            "confidence": "high",
            "smoothed_interval": 30.0,
            "base_interval": 30,
            "seasonal_enabled": True,
            "hemisphere": "north",
        }
        config.update(kwargs)
        return config

    def test_seasonal_adjustment_applied(self):
        """With sufficient seasonal data, recommendation is adjusted."""
        analyzer = IntervalAnalyzer()
        # Build history: short intervals in summer, long in winter
        dates = []
        base = datetime(2024, 1, 1)
        # Generate ~24 completions spanning 2 years with seasonal pattern
        current = base
        for i in range(24):
            dates.append(current.strftime("%Y-%m-%d"))
            month = current.month
            if month in [6, 7, 8]:  # Summer: every 14 days
                current += timedelta(days=14)
            elif month in [12, 1, 2]:  # Winter: every 45 days
                current += timedelta(days=45)
            else:  # Spring/Fall: every 28 days
                current += timedelta(days=28)

        history = _make_history_with_feedback(dates)
        task_data = {
            "interval_days": 30,
            "history": history,
        }

        config = self._make_adaptive_config(_current_month=7)  # July (summer)
        analysis = analyzer.analyze(task_data, config)

        # With summer seasonal factor, recommendation should be lower than base
        assert analysis.seasonal_factor is not None
        assert analysis.seasonal_factors is not None
        assert len(analysis.seasonal_factors) == 12
        assert analysis.seasonal_adjustment_reason == "learned"

    def test_no_seasonal_without_data(self):
        """With < 6 intervals, no seasonal adjustment."""
        analyzer = IntervalAnalyzer()
        # Only 3 completions = 2 intervals
        history = _make_history_with_feedback([
            "2026-01-01", "2026-01-31", "2026-03-02"
        ])
        task_data = {
            "interval_days": 30,
            "history": history,
        }
        config = self._make_adaptive_config()
        analysis = analyzer.analyze(task_data, config)
        # Not enough data for seasonal OR for adaptive (need 3+ feedback)
        # But feedback_count=10 in config, so recommendation exists
        # Seasonal should be None because < 6 intervals
        assert analysis.seasonal_factor is None

    def test_manual_overrides_applied(self):
        """Manual overrides are applied even without learned data."""
        analyzer = IntervalAnalyzer()
        # Enough feedback for recommendations but not enough intervals for seasonal learning
        history = _make_history_with_feedback(["2026-01-01", "2026-02-01", "2026-03-01"])
        task_data = {
            "interval_days": 30,
            "history": history,
        }
        config = self._make_adaptive_config(
            seasonal_overrides={7: 0.5},  # July = half interval
            _current_month=7,
        )
        analysis = analyzer.analyze(task_data, config)

        # Manual override should be applied
        assert analysis.seasonal_factor == 0.5
        assert analysis.seasonal_adjustment_reason == "manual"

    def test_seasonal_disabled(self):
        """When seasonal_enabled=False, no seasonal adjustment."""
        analyzer = IntervalAnalyzer()
        dates = []
        base = datetime(2024, 1, 1)
        current = base
        for i in range(20):
            dates.append(current.strftime("%Y-%m-%d"))
            current += timedelta(days=30)
        history = _make_history_with_feedback(dates)

        task_data = {"interval_days": 30, "history": history}
        config = self._make_adaptive_config(seasonal_enabled=False)
        analysis = analyzer.analyze(task_data, config)

        assert analysis.seasonal_factor is None
        assert analysis.seasonal_factors is None

    def test_backward_compat_no_seasonal_fields(self):
        """Old adaptive_config without seasonal fields works fine."""
        analyzer = IntervalAnalyzer()
        history = _make_history_with_feedback([
            "2026-01-01", "2026-01-31", "2026-03-02", "2026-04-01"
        ])
        task_data = {"interval_days": 30, "history": history}
        # Old-style config without seasonal fields
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "min_interval_days": 7,
            "max_interval_days": 365,
            "feedback_count": 10,
            "confidence": "high",
            "smoothed_interval": 30.0,
            "base_interval": 30,
            # No seasonal_enabled, no hemisphere, no _current_month
        }
        analysis = analyzer.analyze(task_data, config)
        # Should work without errors; seasonal defaults to enabled but
        # insufficient data (3 intervals) means no seasonal adjustment
        assert analysis.recommended_interval is not None


# ============================================================================
# Test update_on_completion with seasonal
# ============================================================================


class TestUpdateOnCompletionWithSeasonal:
    """Test that update_on_completion handles seasonal fields."""

    def test_no_crash_without_seasonal(self):
        """Old config without seasonal fields doesn't crash."""
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "smoothed_interval": 30.0,
            "feedback_count": 5,
            "min_interval_days": 7,
            "max_interval_days": 365,
            "base_interval": 30,
        }
        result = analyzer.update_on_completion(config, 28, "needed")
        assert "current_recommendation" in result
        assert "smoothed_interval" in result

    def test_seasonal_adjustment_on_recommendation(self):
        """Stored seasonal factors are applied to current_recommendation."""
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "smoothed_interval": 30.0,
            "feedback_count": 10,
            "confidence": "high",
            "min_interval_days": 7,
            "max_interval_days": 365,
            "base_interval": 30,
            "seasonal_enabled": True,
            "_seasonal_factors": [1.5, 1.5, 1.0, 1.0, 0.8, 0.7, 0.7, 0.7, 0.8, 1.0, 1.0, 1.5],
        }
        result = analyzer.update_on_completion(config, 28, "needed")
        # recommendation_reason should include "seasonal"
        if result.get("current_recommendation") is not None:
            assert "seasonal" in (result.get("recommendation_reason") or "")

    def test_seasonal_disabled_no_adjustment(self):
        """With seasonal_enabled=False, no seasonal adjustment on recommendation."""
        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "smoothed_interval": 30.0,
            "feedback_count": 10,
            "confidence": "high",
            "min_interval_days": 7,
            "max_interval_days": 365,
            "base_interval": 30,
            "seasonal_enabled": False,
            "_seasonal_factors": [0.5] * 12,  # Would change rec if enabled
        }
        result = analyzer.update_on_completion(config, 28, "needed")
        reason = result.get("recommendation_reason") or ""
        assert "seasonal" not in reason


# ============================================================================
# Test constants
# ============================================================================


class TestSeasonalConstants:
    """Test that seasonal constants are properly defined."""

    def test_hemisphere_seasons_cover_all_months(self):
        """Both hemisphere season maps cover all 12 months."""
        for seasons in [NORTHERN_SEASONS, SOUTHERN_SEASONS]:
            all_months = set()
            for months in seasons.values():
                all_months.update(months)
            assert all_months == set(range(1, 13))

    def test_hemisphere_seasons_no_overlap(self):
        """No month appears in multiple seasons."""
        for seasons in [NORTHERN_SEASONS, SOUTHERN_SEASONS]:
            seen: set[int] = set()
            for months in seasons.values():
                for m in months:
                    assert m not in seen, f"Month {m} in multiple seasons"
                    seen.add(m)

    def test_default_bounds(self):
        assert DEFAULT_SEASONAL_MIN_DATA == 6
        assert DEFAULT_SEASONAL_FACTOR_MIN == 0.3
        assert DEFAULT_SEASONAL_FACTOR_MAX == 3.0
        assert DEFAULT_SEASONAL_FACTOR_MIN < 1.0 < DEFAULT_SEASONAL_FACTOR_MAX


# ============================================================================
# Test end-to-end scenario: Pool pump
# ============================================================================


class TestPoolPumpScenario:
    """Realistic scenario: pool pump filter cleaning with seasonal patterns."""

    def test_pool_pump_summer_vs_winter(self):
        """Pool pump needs cleaning every 14d in summer, 42d in winter."""
        analyzer = IntervalAnalyzer()

        # Generate 2 years of completions with seasonal pattern
        dates = []
        current = datetime(2024, 1, 1)
        for _ in range(36):  # ~2 years of completions
            dates.append(current.strftime("%Y-%m-%d"))
            month = current.month
            if month in [6, 7, 8]:
                current += timedelta(days=14)
            elif month in [12, 1, 2]:
                current += timedelta(days=42)
            else:
                current += timedelta(days=28)

        history = _make_history_with_feedback(dates, feedback="needed")
        task_data = {"interval_days": 28, "history": history}

        # Test in July (summer) → should recommend shorter interval
        config_summer = {
            "enabled": True,
            "ewa_alpha": 0.3,
            "min_interval_days": 7,
            "max_interval_days": 90,
            "feedback_count": 30,
            "confidence": "high",
            "smoothed_interval": 25.0,
            "base_interval": 28,
            "seasonal_enabled": True,
            "hemisphere": "north",
            "_current_month": 7,
        }
        summer_analysis = analyzer.analyze(task_data, config_summer)

        # Test in January (winter) → should recommend longer interval
        config_winter = dict(config_summer)
        config_winter["_current_month"] = 1
        winter_analysis = analyzer.analyze(task_data, config_winter)

        # Summer recommendation should be shorter than winter
        if summer_analysis.recommended_interval and winter_analysis.recommended_interval:
            assert summer_analysis.recommended_interval < winter_analysis.recommended_interval

        # Summer seasonal factor should be < 1.0
        assert summer_analysis.seasonal_factor is not None
        assert summer_analysis.seasonal_factor < 1.0

        # Winter seasonal factor should be > 1.0
        assert winter_analysis.seasonal_factor is not None
        assert winter_analysis.seasonal_factor > 1.0
