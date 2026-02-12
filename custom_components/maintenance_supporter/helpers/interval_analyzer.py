"""Adaptive interval analyzer for smart maintenance scheduling.

Implements Exponential Weighted Average (EWA) and Weibull distribution
analysis to recommend optimal maintenance intervals based on completion
history and user feedback. Includes seasonal awareness (Phase 2) that
learns monthly maintenance patterns from history and adjusts recommendations.

Pure Python — only stdlib `math` and `statistics` modules used.
No HA dependencies — fully testable in isolation.
"""

from __future__ import annotations

import math
import statistics
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from ..const import (
    DEFAULT_ADAPTIVE_EWA_ALPHA,
    DEFAULT_ADAPTIVE_MAX_INTERVAL,
    DEFAULT_ADAPTIVE_MIN_COMPLETIONS,
    DEFAULT_ADAPTIVE_MIN_INTERVAL,
    DEFAULT_ADAPTIVE_RELIABILITY_TARGET,
    DEFAULT_ADAPTIVE_WEIBULL_MIN,
    DEFAULT_SEASONAL_FACTOR_MAX,
    DEFAULT_SEASONAL_FACTOR_MIN,
    DEFAULT_SEASONAL_MIN_DATA,
    NORTHERN_SEASONS,
    SOUTHERN_SEASONS,
    MaintenanceFeedback,
)

# Feedback multipliers for EWA: adjusts effective interval based on need
FEEDBACK_MULTIPLIERS: dict[str, float] = {
    MaintenanceFeedback.NEEDED: 1.0,      # interval was right or too long
    MaintenanceFeedback.NOT_NEEDED: 1.3,   # can extend interval
    MaintenanceFeedback.NOT_SURE: 1.1,     # slight extension
}


@dataclass
class SeasonalAnalysis:
    """Result of seasonal factor analysis."""

    monthly_factors: list[float]  # 12 floats, index 0=Jan, 11=Dec
    current_month_factor: float  # factor for the current month
    data_months: int  # how many distinct months have data
    total_data_points: int  # total intervals used
    hemisphere: str  # "north" | "south"
    has_sufficient_data: bool  # True if >= MIN_SEASONAL_DATA_POINTS


@dataclass
class IntervalAnalysis:
    """Result of analyzing a task's interval history."""

    current_interval: int
    average_actual_interval: float | None
    interval_std_dev: float | None
    ewa_prediction: float | None
    weibull_prediction: int | None
    weibull_beta: float | None
    weibull_eta: float | None
    recommended_interval: int | None
    confidence: str  # "low" | "medium" | "high"
    feedback_count: int
    data_points: int
    recommendation_reason: str | None
    # Seasonal awareness (Phase 2)
    seasonal_factor: float | None = None
    seasonal_factors: list[float] | None = None
    seasonal_adjustment_reason: str | None = None  # "learned" | "manual" | None
    # Weibull advanced statistics (Phase 4)
    weibull_r_squared: float | None = None
    confidence_interval_low: int | None = None    # R=0.95 (conservative)
    confidence_interval_high: int | None = None   # R=0.80 (aggressive)
    # Sensor predictions (Phase 3)
    degradation_rate: float | None = None  # units/day
    degradation_trend: str | None = None  # "rising"|"falling"|"stable"
    days_until_threshold: float | None = None
    threshold_prediction_confidence: str | None = None  # "low"|"medium"|"high"
    environmental_factor: float | None = None  # adjustment multiplier
    environmental_entity: str | None = None
    sensor_prediction_reason: str | None = None  # "degradation"|"environmental"|"both"


class IntervalAnalyzer:
    """Analyzes maintenance completion patterns to recommend optimal intervals.

    Two algorithms:
    - EWA (Exponential Weighted Average): Primary, lightweight, always active.
      Converges to optimal interval in ~8-10 observations.
    - Weibull distribution: Secondary, activates after 5+ completions.
      Reliability-based recommendation at configurable target (default 90%).

    Both are blended using confidence-weighted averaging.
    """

    def analyze(
        self, task_data: dict[str, Any], adaptive_config: dict[str, Any]
    ) -> IntervalAnalysis:
        """Analyze a task's history and return interval recommendations.

        Called from coordinator._async_update_data() on each refresh.
        Stateless — reads history timestamps from task_data.

        Args:
            task_data: The full task dict (with history, interval_days, etc.)
            adaptive_config: The task's adaptive_config dict.

        Returns:
            IntervalAnalysis with all computed metrics and recommendation.
        """
        current_interval = task_data.get("interval_days") or 30
        history = task_data.get("history", [])
        intervals = self._compute_intervals_from_history(history)
        data_points = len(intervals)

        alpha = adaptive_config.get("ewa_alpha", DEFAULT_ADAPTIVE_EWA_ALPHA)
        min_interval = adaptive_config.get(
            "min_interval_days", DEFAULT_ADAPTIVE_MIN_INTERVAL
        )
        max_interval = adaptive_config.get(
            "max_interval_days", DEFAULT_ADAPTIVE_MAX_INTERVAL
        )
        feedback_count = adaptive_config.get("feedback_count", 0)
        confidence = self._compute_confidence(feedback_count)

        # Statistics
        avg_interval: float | None = None
        std_dev: float | None = None
        if intervals:
            avg_interval = statistics.mean(intervals)
            if len(intervals) >= 2:
                std_dev = statistics.stdev(intervals)

        # EWA — use stored smoothed value if available, otherwise compute
        ewa_prediction: float | None = adaptive_config.get("smoothed_interval")
        if ewa_prediction is None and intervals:
            ewa_prediction = self._exponential_weighted_average(
                [float(i) for i in intervals], alpha
            )

        # Weibull
        weibull_beta: float | None = adaptive_config.get("weibull_beta")
        weibull_eta: float | None = adaptive_config.get("weibull_eta")
        weibull_prediction: int | None = None
        weibull_r_squared: float | None = None
        confidence_low: int | None = None
        confidence_high: int | None = None

        if data_points >= DEFAULT_ADAPTIVE_WEIBULL_MIN:
            fit = self._weibull_fit([float(i) for i in intervals])
            if fit is not None:
                weibull_beta, weibull_eta, weibull_r_squared = fit
                reliability = adaptive_config.get(
                    "reliability_target", DEFAULT_ADAPTIVE_RELIABILITY_TARGET
                )
                weibull_prediction = self._weibull_recommended_interval(
                    weibull_beta, weibull_eta, reliability
                )
                # Confidence interval bounds (Phase 4)
                confidence_low = self._weibull_recommended_interval(
                    weibull_beta, weibull_eta, 0.95
                )
                confidence_high = self._weibull_recommended_interval(
                    weibull_beta, weibull_eta, 0.80
                )

        # Blend recommendations
        recommended: int | None = None
        reason: str | None = None

        if feedback_count >= DEFAULT_ADAPTIVE_MIN_COMPLETIONS:
            recommended, reason = self._blend_recommendations(
                base=current_interval,
                ewa=ewa_prediction,
                weibull=weibull_prediction,
                confidence=confidence,
            )
            if recommended is not None:
                recommended = max(min_interval, min(max_interval, recommended))

        # Seasonal adjustment (Phase 2)
        seasonal_factor: float | None = None
        seasonal_factors_list: list[float] | None = None
        seasonal_reason: str | None = None

        seasonal_enabled = adaptive_config.get("seasonal_enabled", True)
        if recommended is not None and seasonal_enabled:
            intervals_with_months = self._compute_intervals_with_months(history)
            hemisphere = adaptive_config.get("hemisphere", "north")
            manual_overrides = adaptive_config.get("seasonal_overrides")

            current_month = adaptive_config.get("_current_month")
            if current_month is None:
                current_month = datetime.now().month

            seasonal = self._compute_monthly_factors(
                intervals_with_months, hemisphere, manual_overrides, current_month
            )

            seasonal_factors_list = [
                round(f, 2) for f in seasonal.monthly_factors
            ]

            if seasonal.has_sufficient_data or manual_overrides:
                factor = seasonal.monthly_factors[current_month - 1]
                seasonal_factor = round(factor, 2)

                if manual_overrides and current_month in manual_overrides:
                    seasonal_reason = "manual"
                elif seasonal.has_sufficient_data:
                    seasonal_reason = "learned"

                recommended = self._apply_seasonal_adjustment(
                    recommended, factor, min_interval, max_interval
                )
                # Apply seasonal adjustment to confidence bounds too
                if confidence_low is not None:
                    confidence_low = self._apply_seasonal_adjustment(
                        confidence_low, factor, min_interval, max_interval
                    )
                if confidence_high is not None:
                    confidence_high = self._apply_seasonal_adjustment(
                        confidence_high, factor, min_interval, max_interval
                    )
                if reason:
                    reason = f"{reason}_seasonal"

        return IntervalAnalysis(
            current_interval=current_interval,
            average_actual_interval=round(avg_interval, 1) if avg_interval else None,
            interval_std_dev=round(std_dev, 1) if std_dev else None,
            ewa_prediction=round(ewa_prediction, 1) if ewa_prediction else None,
            weibull_prediction=weibull_prediction,
            weibull_beta=round(weibull_beta, 2) if weibull_beta else None,
            weibull_eta=round(weibull_eta, 2) if weibull_eta else None,
            recommended_interval=recommended,
            confidence=confidence,
            feedback_count=feedback_count,
            data_points=data_points,
            recommendation_reason=reason,
            seasonal_factor=seasonal_factor,
            seasonal_factors=seasonal_factors_list,
            seasonal_adjustment_reason=seasonal_reason,
            weibull_r_squared=(
                round(weibull_r_squared, 4) if weibull_r_squared is not None else None
            ),
            confidence_interval_low=confidence_low if confidence_low else None,
            confidence_interval_high=confidence_high if confidence_high else None,
        )

    def update_on_completion(
        self,
        adaptive_config: dict[str, Any],
        actual_interval: int,
        feedback: str | None,
    ) -> dict[str, Any]:
        """Update adaptive config after a task completion.

        This is the learning step — called from coordinator.complete_maintenance().

        Args:
            adaptive_config: Current adaptive_config dict (will be copied).
            actual_interval: Days since last completion.
            feedback: User feedback ("needed", "not_needed", "not_sure") or None.

        Returns:
            Updated adaptive_config dict (new object, original unchanged).
        """
        config = dict(adaptive_config)
        alpha = config.get("ewa_alpha", DEFAULT_ADAPTIVE_EWA_ALPHA)
        min_interval = config.get(
            "min_interval_days", DEFAULT_ADAPTIVE_MIN_INTERVAL
        )
        max_interval = config.get(
            "max_interval_days", DEFAULT_ADAPTIVE_MAX_INTERVAL
        )

        # Apply feedback multiplier to get effective interval
        multiplier = FEEDBACK_MULTIPLIERS.get(
            feedback or MaintenanceFeedback.NEEDED, 1.0
        )
        effective_interval = actual_interval * multiplier

        # Update EWA smoothed interval
        prev_smoothed = config.get("smoothed_interval")
        if prev_smoothed is not None:
            smoothed = alpha * effective_interval + (1 - alpha) * prev_smoothed
        else:
            smoothed = effective_interval

        config["smoothed_interval"] = round(smoothed, 2)

        # Update feedback count
        if feedback is not None:
            config["feedback_count"] = config.get("feedback_count", 0) + 1

        # Update confidence
        config["confidence"] = self._compute_confidence(
            config.get("feedback_count", 0)
        )

        # Update recommendation
        recommended, reason = self._blend_recommendations(
            base=config.get("base_interval", actual_interval),
            ewa=smoothed,
            weibull=config.get("weibull_eta"),  # Re-use last Weibull if available
            confidence=config["confidence"],
        )
        if recommended is not None:
            recommended = max(min_interval, min(max_interval, recommended))

            # Apply seasonal adjustment if factors are stored from last analyze()
            seasonal_enabled = config.get("seasonal_enabled", True)
            stored_factors = config.get("_seasonal_factors")
            if seasonal_enabled and stored_factors and len(stored_factors) == 12:
                current_month = datetime.now().month
                factor = stored_factors[current_month - 1]
                recommended = self._apply_seasonal_adjustment(
                    recommended, factor, min_interval, max_interval
                )
                if reason:
                    reason = f"{reason}_seasonal"

        config["current_recommendation"] = recommended
        config["recommendation_reason"] = reason
        config["last_analysis_date"] = datetime.now().date().isoformat()

        return config

    @staticmethod
    def _compute_intervals_from_history(
        history: list[dict[str, Any]],
    ) -> list[int]:
        """Extract days between consecutive COMPLETED entries from history.

        Args:
            history: List of history entry dicts with 'timestamp' and 'type'.

        Returns:
            List of intervals in days between consecutive completions.
        """
        completed_dates: list[datetime] = []
        for entry in history:
            if entry.get("type") != "completed":
                continue
            ts = entry.get("timestamp")
            if not ts:
                continue
            try:
                dt = datetime.fromisoformat(ts)
                completed_dates.append(dt)
            except (ValueError, TypeError):
                continue

        # Sort chronologically
        completed_dates.sort()

        # Compute intervals between consecutive completions
        intervals: list[int] = []
        for i in range(1, len(completed_dates)):
            delta = (completed_dates[i] - completed_dates[i - 1]).days
            if delta > 0:  # Skip same-day completions
                intervals.append(delta)

        return intervals

    @staticmethod
    def _exponential_weighted_average(
        intervals: list[float], alpha: float
    ) -> float:
        """Compute EWA over a list of intervals.

        More recent values have higher weight.

        Args:
            intervals: List of interval values (days).
            alpha: Smoothing factor (0 < alpha <= 1). Higher = more responsive.

        Returns:
            The EWA value.
        """
        if not intervals:
            return 0.0
        if len(intervals) == 1:
            return intervals[0]

        ewa = intervals[0]
        for val in intervals[1:]:
            ewa = alpha * val + (1 - alpha) * ewa
        return ewa

    @staticmethod
    def _weibull_fit(
        intervals: list[float],
    ) -> tuple[float, float, float] | None:
        """Fit a Weibull distribution using median rank regression.

        Pure Python implementation using only `math.log`.
        Uses Bernard's approximation for median ranks and least-squares
        regression in Weibull probability space.

        Args:
            intervals: List of interval values (days). Must have >= 5 items.

        Returns:
            (beta, eta, r_squared) tuple, or None if fit fails.
            beta = shape parameter (>1 = wear-out pattern)
            eta = scale parameter (characteristic life)
            r_squared = goodness-of-fit (0.0–1.0)
        """
        n = len(intervals)
        if n < DEFAULT_ADAPTIVE_WEIBULL_MIN:
            return None

        # Sort intervals for rank ordering
        sorted_intervals = sorted(intervals)

        # Filter out zero/negative values
        valid = [(i, v) for i, v in enumerate(sorted_intervals) if v > 0]
        if len(valid) < DEFAULT_ADAPTIVE_WEIBULL_MIN:
            return None

        # Median rank (Bernard's approximation): F(i) = (i - 0.3) / (n + 0.4)
        # Then transform to Weibull space:
        #   x = ln(t), y = ln(-ln(1 - F))
        x_vals: list[float] = []
        y_vals: list[float] = []

        for rank, (_, t) in enumerate(valid, start=1):
            f = (rank - 0.3) / (len(valid) + 0.4)
            if f <= 0 or f >= 1:
                continue
            try:
                x = math.log(t)
                y = math.log(-math.log(1 - f))
                x_vals.append(x)
                y_vals.append(y)
            except (ValueError, ZeroDivisionError):
                continue

        if len(x_vals) < 3:
            return None

        # Least-squares regression: y = beta * x - beta * ln(eta)
        # => y = m * x + b, where m = beta, b = -beta * ln(eta)
        n_pts = len(x_vals)
        sum_x = sum(x_vals)
        sum_y = sum(y_vals)
        sum_xy = sum(x * y for x, y in zip(x_vals, y_vals))
        sum_x2 = sum(x * x for x in x_vals)

        denom = n_pts * sum_x2 - sum_x * sum_x
        if abs(denom) < 1e-10:
            return None

        beta = (n_pts * sum_xy - sum_x * sum_y) / denom
        b = (sum_y - beta * sum_x) / n_pts

        if beta <= 0:
            return None

        # eta = exp(-b / beta)
        try:
            eta = math.exp(-b / beta)
        except (OverflowError, ZeroDivisionError):
            return None

        if eta <= 0:
            return None

        # Compute R-squared for goodness-of-fit
        mean_y = sum_y / n_pts
        ss_tot = sum((y - mean_y) ** 2 for y in y_vals)
        ss_res = sum(
            (y - (beta * x + b)) ** 2
            for x, y in zip(x_vals, y_vals)
        )
        r_squared = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0

        return (beta, eta, r_squared)

    @staticmethod
    def _weibull_recommended_interval(
        beta: float, eta: float, reliability: float
    ) -> int:
        """Calculate recommended interval from Weibull parameters.

        t = eta * (-ln(R))^(1/beta)

        Args:
            beta: Weibull shape parameter.
            eta: Weibull scale parameter.
            reliability: Target reliability (e.g. 0.9 for 90%).

        Returns:
            Recommended interval in days (rounded).
        """
        if beta <= 0 or eta <= 0 or reliability <= 0 or reliability >= 1:
            return 0
        try:
            t = eta * ((-math.log(reliability)) ** (1 / beta))
            return max(1, round(t))
        except (ValueError, ZeroDivisionError, OverflowError):
            return 0

    @staticmethod
    def _compute_confidence(feedback_count: int) -> str:
        """Determine confidence level based on feedback count.

        Args:
            feedback_count: Number of feedback responses collected.

        Returns:
            "low", "medium", or "high"
        """
        if feedback_count < DEFAULT_ADAPTIVE_MIN_COMPLETIONS:
            return "low"
        if feedback_count < 8:
            return "medium"
        return "high"

    @staticmethod
    def _compute_intervals_with_months(
        history: list[dict[str, Any]],
    ) -> list[tuple[int, int]]:
        """Extract intervals with end-month from history.

        Like _compute_intervals_from_history but returns tuples of
        (interval_days, end_month) where end_month is the month (1-12)
        of the second completion in each pair.

        Args:
            history: List of history entry dicts with 'timestamp' and 'type'.

        Returns:
            List of (interval_days, month) tuples.
        """
        completed_dates: list[datetime] = []
        for entry in history:
            if entry.get("type") != "completed":
                continue
            ts = entry.get("timestamp")
            if not ts:
                continue
            try:
                dt = datetime.fromisoformat(ts)
                completed_dates.append(dt)
            except (ValueError, TypeError):
                continue

        completed_dates.sort()

        result: list[tuple[int, int]] = []
        for i in range(1, len(completed_dates)):
            delta = (completed_dates[i] - completed_dates[i - 1]).days
            if delta > 0:
                result.append((delta, completed_dates[i].month))

        return result

    @staticmethod
    def _compute_monthly_factors(
        intervals_with_months: list[tuple[int, int]],
        hemisphere: str = "north",
        manual_overrides: dict[int, float] | None = None,
        current_month: int = 1,
    ) -> SeasonalAnalysis:
        """Compute seasonal factors from monthly interval data.

        Groups intervals by end-month, computes per-month averages,
        normalizes by the annual mean to get factors. Missing months
        use a quarterly fallback based on hemisphere-aware season mapping.

        Args:
            intervals_with_months: List of (interval_days, month) tuples.
            hemisphere: "north" or "south" for season mapping.
            manual_overrides: Optional dict {month_num: factor} (1-12) for manual factors.
            current_month: Current month (1-12) for the result.

        Returns:
            SeasonalAnalysis with 12 monthly factors.
        """
        total_points = len(intervals_with_months)

        # Default: all 1.0 (no seasonal adjustment)
        factors = [1.0] * 12

        has_sufficient_data = total_points >= DEFAULT_SEASONAL_MIN_DATA

        if has_sufficient_data:
            # Group intervals by month
            monthly_intervals: dict[int, list[int]] = {}
            for interval, month in intervals_with_months:
                monthly_intervals.setdefault(month, []).append(interval)

            # Compute per-month averages
            monthly_means: dict[int, float] = {}
            for month, ivals in monthly_intervals.items():
                monthly_means[month] = statistics.mean(ivals)

            # Annual mean across all intervals
            all_intervals = [iv for iv, _ in intervals_with_months]
            annual_mean = statistics.mean(all_intervals)

            if annual_mean > 0:
                # Compute raw factors for months with data
                for month, mean_val in monthly_means.items():
                    factors[month - 1] = mean_val / annual_mean

                # Quarterly fallback for months without data
                seasons = (
                    NORTHERN_SEASONS if hemisphere == "north" else SOUTHERN_SEASONS
                )
                for _season_name, season_months in seasons.items():
                    # Compute average factor for months in this quarter that have data
                    season_factors = [
                        factors[m - 1]
                        for m in season_months
                        if m in monthly_means
                    ]
                    if season_factors:
                        quarter_avg = statistics.mean(season_factors)
                        # Fill missing months in this quarter
                        for m in season_months:
                            if m not in monthly_means:
                                factors[m - 1] = quarter_avg

        # Apply manual overrides (replace learned values)
        if manual_overrides:
            for month_num, factor_val in manual_overrides.items():
                if 1 <= month_num <= 12:
                    factors[month_num - 1] = factor_val

        # Clamp all factors
        factors = [
            max(DEFAULT_SEASONAL_FACTOR_MIN, min(DEFAULT_SEASONAL_FACTOR_MAX, f))
            for f in factors
        ]

        data_months = len(
            {m for _, m in intervals_with_months}
        ) if intervals_with_months else 0

        return SeasonalAnalysis(
            monthly_factors=factors,
            current_month_factor=factors[current_month - 1],
            data_months=data_months,
            total_data_points=total_points,
            hemisphere=hemisphere,
            has_sufficient_data=has_sufficient_data,
        )

    @staticmethod
    def _apply_seasonal_adjustment(
        recommended: int,
        seasonal_factor: float,
        min_interval: int,
        max_interval: int,
    ) -> int:
        """Apply seasonal factor to a recommended interval.

        Multiplies the recommendation by the factor and clamps to bounds.

        Args:
            recommended: Base recommended interval in days.
            seasonal_factor: Multiplier (< 1.0 shortens, > 1.0 lengthens).
            min_interval: Minimum allowed interval.
            max_interval: Maximum allowed interval.

        Returns:
            Adjusted interval in days.
        """
        adjusted = round(recommended * seasonal_factor)
        return max(min_interval, min(max_interval, adjusted))

    @staticmethod
    def _blend_recommendations(
        base: int,
        ewa: float | None,
        weibull: int | float | None,
        confidence: str,
    ) -> tuple[int | None, str | None]:
        """Blend base interval with statistical predictions.

        Weights depend on confidence level:
        - low: 100% base (no recommendation)
        - medium: 50% base + 50% statistical
        - high: 20% base + 80% statistical

        Statistical = EWA if no Weibull, or avg(EWA, Weibull) if both available.

        Args:
            base: Current configured interval in days.
            ewa: EWA prediction (days) or None.
            weibull: Weibull prediction (days) or None.
            confidence: "low", "medium", or "high".

        Returns:
            (recommended_interval, reason) tuple. None if insufficient data.
        """
        if confidence == "low":
            return (None, None)

        # Determine statistical prediction
        stat_predictions: list[float] = []
        reason_parts: list[str] = []

        if ewa is not None:
            stat_predictions.append(ewa)
            reason_parts.append("ewa")
        if weibull is not None and weibull > 0:
            stat_predictions.append(float(weibull))
            reason_parts.append("weibull")

        if not stat_predictions:
            return (None, None)

        statistical = statistics.mean(stat_predictions)
        reason = "_and_".join(reason_parts)

        # Blend based on confidence
        if confidence == "medium":
            blended = 0.5 * base + 0.5 * statistical
        else:  # high
            blended = 0.2 * base + 0.8 * statistical

        return (round(blended), reason)
