"""Sensor-driven prediction engine for maintenance tasks (Phase 3).

Computes degradation rates from recorder statistics, predicts when sensor
values will reach trigger thresholds, and correlates environmental sensors
with maintenance intervals.

Only applicable to SENSOR_BASED tasks with threshold or counter triggers.
"""

from __future__ import annotations

import itertools
import logging
import math
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.util import dt as dt_util

from ..const import (
    DEFAULT_DEGRADATION_LOOKBACK_DAYS,
    DEFAULT_DEGRADATION_MIN_POINTS,
    DEFAULT_DEGRADATION_SIGNIFICANCE,
    DEFAULT_ENVIRONMENTAL_CORRELATION_MIN,
    DEFAULT_ENVIRONMENTAL_FACTOR_MAX,
    DEFAULT_ENVIRONMENTAL_FACTOR_MIN,
    DEFAULT_ENVIRONMENTAL_LOOKBACK_DAYS,
    DEFAULT_ENVIRONMENTAL_MIN_COMPLETIONS,
    DEGRADATION_BLEND_HALF_POINTS,
    DEGRADATION_CYCLE_JUMP_FRACTION,
    DEGRADATION_CYCLE_LOOKBACK_DAYS,
    DEGRADATION_MIN_CYCLE_HOURS,
)
from .schedule import read_legacy_fields

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

_SECONDS_PER_DAY = 86400.0


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------


@dataclass
class DegradationAnalysis:
    """Result of degradation rate monitoring for a sensor-based task."""

    entity_id: str
    slope_per_day: float | None  # units per day (positive = rising)
    trend: str  # "rising" | "falling" | "stable" | "insufficient_data"
    r_squared: float | None  # goodness of fit (0.0-1.0)
    current_value: float | None
    data_points: int
    lookback_days: int
    # Cycle learning: how many COMPLETED prior service cycles fed the rate,
    # and how consistent their rates were (MAD/|median|; None below 2 cycles).
    cycles_learned: int = 0
    cycle_spread: float | None = None


@dataclass
class ThresholdPrediction:
    """Prediction of when sensor will reach trigger threshold."""

    days_until_threshold: float | None  # None if can't predict
    predicted_date: str | None  # ISO date string
    threshold_value: float
    threshold_direction: str  # "above" | "below"
    current_value: float
    rate_per_day: float
    confidence: str  # "low" | "medium" | "high" based on r_squared


@dataclass
class EnvironmentalAnalysis:
    """Analysis of environmental entity correlation with maintenance intervals."""

    entity_id: str
    current_value: float | None
    average_value: float | None
    correlation: float | None  # Pearson coefficient (-1 to 1)
    adjustment_factor: float  # multiplier to apply on interval (default 1.0)
    has_sufficient_data: bool
    data_points: int


@dataclass
class SensorPredictionResult:
    """Combined result of all sensor-driven predictions for a task."""

    degradation: DegradationAnalysis | None
    threshold_prediction: ThresholdPrediction | None
    environmental: EnvironmentalAnalysis | None


# ---------------------------------------------------------------------------
# Main predictor class
# ---------------------------------------------------------------------------


class SensorPredictor:
    """Computes sensor-driven predictions for maintenance tasks.

    Async — requires HA recorder access for statistics_during_period.
    Only applicable to sensor_based tasks with threshold/counter triggers.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    # ------------------------------------------------------------------
    # Public entry point
    # ------------------------------------------------------------------

    async def async_predict_below(
        self,
        entity_id: str,
        threshold: float,
        lookback_days: int = DEFAULT_DEGRADATION_LOOKBACK_DAYS,
        max_recovery: float | None = None,
    ) -> ThresholdPrediction | None:
        """Entity-level convenience: when does this sensor FALL BELOW threshold?

        Reuses the task machinery (recorder statistics → linear regression →
        threshold crossing with r²-based confidence) without needing a task
        shape around it. Built for the battery fleet's discharge-trend
        forecast; returns ``None`` when the trend is flat, rising, or the
        statistics are too thin to regress.

        ``max_recovery``: reject the series when the value ROSE by more than
        this (same unit as the sensor) after a minimum within the window. A
        real discharge is monotone-ish; a big recovery means the readings
        track something else — the classic case is a voltage-derived battery
        percentage dipping in the cold and bouncing back, which a regression
        happily turns into a confident false "empty soon".
        """
        points = await self._async_fetch_statistics_points(entity_id, lookback_days)
        if max_recovery is not None and points:
            min_seen = math.inf
            for _, value in points:
                min_seen = min(min_seen, value)
                if value - min_seen > max_recovery:
                    return None
        degradation = await self._async_compute_degradation(
            entity_id, None, lookback_days, points=points
        )
        return self._compute_threshold_prediction(
            degradation, {"type": "threshold", "trigger_below": threshold}
        )

    async def async_analyze(
        self,
        task_data: dict[str, Any],
        adaptive_config: dict[str, Any],
    ) -> SensorPredictionResult | None:
        """Run full sensor prediction analysis for a task.

        Returns None if task is not sensor_based or has no trigger entity.
        """
        # Guard: only for sensor_based tasks with trigger config (schedule_type
        # is derived from the trigger when storage is nested — read_legacy_fields)
        if read_legacy_fields(task_data)["schedule_type"] != "sensor_based":
            return None

        trigger_config = task_data.get("trigger_config") or {}
        entity_id = trigger_config.get("entity_id")
        if not entity_id:
            return None

        trigger_type = trigger_config.get("type", "threshold")
        if trigger_type not in ("threshold", "counter"):
            return None

        attribute = trigger_config.get("attribute")

        # 1. Degradation rate. Consumption/accumulation sensors are sawtooths
        #    (drift toward the threshold, jump back on service) — when the
        #    trigger tells us which jump direction means "serviced", regress
        #    the CURRENT cycle and learn the typical rate from prior ones
        #    instead of fitting one line across the jumps (which reported a
        #    refill as a rising trend — the ET-4800 ink finding).
        boundary = self._cycle_boundary_direction(trigger_config)
        if boundary is not None:
            points = await self._async_fetch_statistics_points(entity_id, DEGRADATION_CYCLE_LOOKBACK_DAYS)
            degradation = self._compute_cycle_aware_degradation(entity_id, boundary, points)
        else:
            degradation = await self._async_compute_degradation(
                entity_id,
                attribute,
                DEFAULT_DEGRADATION_LOOKBACK_DAYS,
            )

        # 2. Threshold prediction (synchronous math)
        threshold_prediction = None
        if degradation and degradation.slope_per_day is not None:
            threshold_prediction = self._compute_threshold_prediction(degradation, trigger_config)

        # 3. Environmental analysis (optional)
        environmental = None
        env_entity = adaptive_config.get("environmental_entity")
        if env_entity:
            env_attribute = adaptive_config.get("environmental_attribute")
            environmental = await self._async_analyze_environmental(env_entity, env_attribute, task_data)

        return SensorPredictionResult(
            degradation=degradation,
            threshold_prediction=threshold_prediction,
            environmental=environmental,
        )

    # ------------------------------------------------------------------
    # Cycle-aware degradation (sawtooth sensors)
    # ------------------------------------------------------------------

    @staticmethod
    def _cycle_boundary_direction(trigger_config: dict[str, Any]) -> str | None:
        """Which jump direction means "serviced" for this trigger, or None.

        below-threshold → the value drifts DOWN, a refill jumps UP;
        above-threshold / counter → the value drifts UP, a service resets DOWN;
        both bounds → either jump is a boundary. No bound at all → no cycle
        semantics (keep the plain whole-window regression).
        """
        if trigger_config.get("type", "threshold") == "counter":
            return "down"
        above = trigger_config.get("trigger_above") is not None
        below = trigger_config.get("trigger_below") is not None
        if above and below:
            return "both"
        if below:
            return "up"
        if above:
            return "down"
        return None

    @staticmethod
    def _split_cycles(
        points: list[tuple[float, float]],
        boundary: str,
    ) -> list[list[tuple[float, float]]]:
        """Split a series into service cycles at significant boundary jumps.

        A jump counts when it moves in the boundary direction by at least
        ``DEGRADATION_CYCLE_JUMP_FRACTION`` of the observed value range —
        relative to the range so a 0-100 % ink tank and a 0-3 bar pressure
        sensor segment alike, and immune to step-y sensors that report in
        coarse increments (those steps are far below the fraction).
        """
        if len(points) < 2:
            return [points] if points else []
        values = [v for _, v in points]
        value_range = max(values) - min(values)
        if value_range <= 0:
            return [points]
        jump = DEGRADATION_CYCLE_JUMP_FRACTION * value_range

        segments: list[list[tuple[float, float]]] = [[points[0]]]
        for prev, cur in itertools.pairwise(points):
            delta = cur[1] - prev[1]
            is_boundary = (
                (boundary in ("up", "both") and delta >= jump)
                or (boundary in ("down", "both") and -delta >= jump)
            )
            if is_boundary:
                segments.append([cur])
            else:
                segments[-1].append(cur)
        return segments

    def _compute_cycle_aware_degradation(
        self,
        entity_id: str,
        boundary: str,
        points: list[tuple[float, float]],
    ) -> DegradationAnalysis:
        """Degradation from the CURRENT cycle, blended with prior cycles.

        - current rate: regression over the segment after the last boundary
        - learned rate: median of the prior segments' rates (segments shorter
          than ``DEGRADATION_MIN_CYCLE_HOURS`` or too thin teach nothing)
        - blend: w·current + (1−w)·learned with w = n/(n+K) — right after a
          service the learned rate carries the forecast, and the current
          cycle takes over as it accumulates points
        """
        segments = self._split_cycles(points, boundary)
        current_segment = segments[-1] if segments else []

        # Rates of completed prior cycles (units/day).
        prior_rates: list[float] = []
        for segment in segments[:-1]:
            if len(segment) < DEFAULT_DEGRADATION_MIN_POINTS:
                continue
            if segment[-1][0] - segment[0][0] < DEGRADATION_MIN_CYCLE_HOURS * 3600:
                continue
            fit = self._linear_regression(segment)
            if fit is not None:
                prior_rates.append(fit[0] * _SECONDS_PER_DAY)

        learned_rate: float | None = None
        cycle_spread: float | None = None
        if prior_rates:
            ordered = sorted(prior_rates)
            mid = len(ordered) // 2
            learned_rate = (
                ordered[mid] if len(ordered) % 2 else (ordered[mid - 1] + ordered[mid]) / 2
            )
            if len(ordered) >= 2 and learned_rate != 0:
                deviations = sorted(abs(r - learned_rate) for r in ordered)
                dmid = len(deviations) // 2
                mad = (
                    deviations[dmid]
                    if len(deviations) % 2
                    else (deviations[dmid - 1] + deviations[dmid]) / 2
                )
                cycle_spread = round(mad / abs(learned_rate), 4)

        current_rate: float | None = None
        r_squared: float | None = None
        if len(current_segment) >= DEFAULT_DEGRADATION_MIN_POINTS:
            fit = self._linear_regression(current_segment)
            if fit is not None:
                current_rate = fit[0] * _SECONDS_PER_DAY
                r_squared = fit[2]

        if current_rate is not None and learned_rate is not None:
            w = len(current_segment) / (len(current_segment) + DEGRADATION_BLEND_HALF_POINTS)
            slope_per_day = w * current_rate + (1 - w) * learned_rate
        elif current_rate is not None:
            slope_per_day = current_rate
        elif learned_rate is not None:
            slope_per_day = learned_rate
        else:
            return DegradationAnalysis(
                entity_id=entity_id,
                slope_per_day=None,
                trend="insufficient_data",
                r_squared=None,
                current_value=points[-1][1] if points else None,
                data_points=len(current_segment),
                lookback_days=DEGRADATION_CYCLE_LOOKBACK_DAYS,
                cycles_learned=len(prior_rates),
                cycle_spread=cycle_spread,
            )

        values = [v for _, v in points]
        mean_val = sum(values) / len(values) if values else 1.0
        if mean_val == 0:
            mean_val = 1.0
        ratio = abs(slope_per_day) / abs(mean_val)
        if ratio < DEFAULT_DEGRADATION_SIGNIFICANCE:
            trend = "stable"
        elif slope_per_day > 0:
            trend = "rising"
        else:
            trend = "falling"

        return DegradationAnalysis(
            entity_id=entity_id,
            slope_per_day=round(slope_per_day, 6),
            trend=trend,
            r_squared=round(r_squared, 4) if r_squared is not None else None,
            current_value=points[-1][1] if points else None,
            data_points=len(current_segment),
            lookback_days=DEGRADATION_CYCLE_LOOKBACK_DAYS,
            cycles_learned=len(prior_rates),
            cycle_spread=cycle_spread,
        )

    # ------------------------------------------------------------------
    # Degradation rate
    # ------------------------------------------------------------------

    async def _async_compute_degradation(
        self,
        entity_id: str,
        attribute: str | None,
        lookback_days: int,
        points: list[tuple[float, float]] | None = None,
    ) -> DegradationAnalysis:
        """Compute degradation rate using linear regression on recorder data.

        ``points`` lets a caller that already fetched the series (to inspect
        it) avoid a second recorder query.
        """
        if points is None:
            points = await self._async_fetch_statistics_points(entity_id, lookback_days)

        if len(points) < DEFAULT_DEGRADATION_MIN_POINTS:
            return DegradationAnalysis(
                entity_id=entity_id,
                slope_per_day=None,
                trend="insufficient_data",
                r_squared=None,
                current_value=points[-1][1] if points else None,
                data_points=len(points),
                lookback_days=lookback_days,
            )

        result = self._linear_regression(points)
        if result is None:
            return DegradationAnalysis(
                entity_id=entity_id,
                slope_per_day=None,
                trend="insufficient_data",
                r_squared=None,
                current_value=points[-1][1],
                data_points=len(points),
                lookback_days=lookback_days,
            )

        slope_per_second, _intercept, r_squared = result
        slope_per_day = slope_per_second * _SECONDS_PER_DAY

        # Classify trend
        values = [v for _, v in points]
        mean_val = sum(values) / len(values) if values else 1.0
        if mean_val == 0:
            mean_val = 1.0  # avoid division by zero

        ratio = abs(slope_per_day) / abs(mean_val)
        if ratio < DEFAULT_DEGRADATION_SIGNIFICANCE:
            trend = "stable"
        elif slope_per_day > 0:
            trend = "rising"
        else:
            trend = "falling"

        return DegradationAnalysis(
            entity_id=entity_id,
            slope_per_day=round(slope_per_day, 6),
            trend=trend,
            r_squared=round(r_squared, 4) if r_squared is not None else None,
            current_value=points[-1][1],
            data_points=len(points),
            lookback_days=lookback_days,
        )

    # ------------------------------------------------------------------
    # Threshold prediction
    # ------------------------------------------------------------------

    @staticmethod
    def _compute_threshold_prediction(
        degradation: DegradationAnalysis,
        trigger_config: dict[str, Any],
    ) -> ThresholdPrediction | None:
        """Calculate days until sensor reaches trigger threshold.

        For trigger_above: only predicts if slope > 0 (value rising toward threshold).
        For trigger_below: only predicts if slope < 0 (value falling toward threshold).
        Counter triggers: predicts based on counter increment rate.
        """
        slope = degradation.slope_per_day
        current = degradation.current_value
        if slope is None or current is None or slope == 0:
            return None

        trigger_type = trigger_config.get("type", "threshold")

        # Determine threshold and direction
        threshold_value: float | None = None
        direction: str = ""

        if trigger_type == "counter":
            # Counter: predict when delta reaches target
            target = trigger_config.get("trigger_target_value")
            delta_mode = trigger_config.get("trigger_delta_mode", False)
            baseline = trigger_config.get("trigger_baseline_value", 0)
            if target is None:
                return None
            if delta_mode:
                # Current delta = current - baseline
                current_delta = current - (baseline or 0)
                threshold_value = float(target)
                current = current_delta
            else:
                threshold_value = float(target)
            direction = "above"
            if slope <= 0:
                return None  # Counter not increasing; prediction impossible
        else:
            # Threshold trigger
            above = trigger_config.get("trigger_above")
            below = trigger_config.get("trigger_below")
            if above is not None and slope > 0:
                threshold_value = float(above)
                direction = "above"
            elif below is not None and slope < 0:
                threshold_value = float(below)
                direction = "below"
            else:
                return None

        if threshold_value is None:
            return None

        # Calculate days until threshold
        delta = threshold_value - current
        if direction == "above" and delta <= 0:
            days_until = 0.0  # already exceeded
        elif direction == "below" and delta >= 0:
            days_until = 0.0  # already exceeded
        else:
            days_until = min(abs(delta / slope), 3650)  # Cap at 10 years

        # Confidence: best of fit quality and cycle consistency. Right after
        # a service the current segment is thin (low/no r²), but three prior
        # cycles with near-identical rates justify a confident forecast.
        r2 = degradation.r_squared or 0.0
        if r2 >= 0.7:
            fit_level = 2
        elif r2 >= 0.3:
            fit_level = 1
        else:
            fit_level = 0
        cycle_level = 0
        spread = degradation.cycle_spread
        if degradation.cycles_learned >= 3 and spread is not None and spread <= 0.25:
            cycle_level = 2
        elif degradation.cycles_learned >= 2 and spread is not None and spread <= 0.5:
            cycle_level = 1
        confidence = ("low", "medium", "high")[max(fit_level, cycle_level)]

        # Predicted date
        predicted_date = None
        if days_until > 0:
            try:
                pred_dt = dt_util.now() + timedelta(days=days_until)
                predicted_date = pred_dt.strftime("%Y-%m-%d")
            except OverflowError:
                # Near-zero slope → astronomically large days_until
                predicted_date = None

        return ThresholdPrediction(
            days_until_threshold=round(days_until, 1),
            predicted_date=predicted_date,
            threshold_value=threshold_value,
            threshold_direction=direction,
            current_value=current,
            rate_per_day=slope,
            confidence=confidence,
        )

    # ------------------------------------------------------------------
    # Environmental correlation
    # ------------------------------------------------------------------

    async def _async_analyze_environmental(
        self,
        env_entity_id: str,
        env_attribute: str | None,
        task_data: dict[str, Any],
    ) -> EnvironmentalAnalysis:
        """Analyze correlation between environmental sensor and maintenance intervals.

        Algorithm:
        1. Fetch env entity recorder data (90 days hourly)
        2. For each completion in task history, find closest env value
        3. Compute Pearson correlation between env_value and actual_interval
        4. If |correlation| > threshold, compute adjustment factor
        """
        # Fetch environmental stats
        env_points = await self._async_fetch_statistics_points(env_entity_id, DEFAULT_ENVIRONMENTAL_LOOKBACK_DAYS)

        # Get current environmental value
        current_env: float | None = None
        state = self.hass.states.get(env_entity_id)
        if state:
            try:
                if env_attribute:
                    raw = state.attributes.get(env_attribute)
                else:
                    raw = state.state
                if raw is None:
                    raise TypeError("No value available")
                current_env = float(raw)
            except (TypeError, ValueError):
                current_env = None

        if not env_points or len(env_points) < 10:
            return EnvironmentalAnalysis(
                entity_id=env_entity_id,
                current_value=current_env,
                average_value=None,
                correlation=None,
                adjustment_factor=1.0,
                has_sufficient_data=False,
                data_points=0,
            )

        # Extract completion intervals with env values at completion time
        history = task_data.get("history") or []
        completed = [h for h in history if h.get("type") == "completed" and h.get("timestamp")]
        completed.sort(key=lambda h: h["timestamp"])

        if len(completed) < 2:
            return EnvironmentalAnalysis(
                entity_id=env_entity_id,
                current_value=current_env,
                average_value=None,
                correlation=None,
                adjustment_factor=1.0,
                has_sufficient_data=False,
                data_points=0,
            )

        # Compute intervals and find env value at each completion
        intervals: list[float] = []
        env_at_completion: list[float] = []

        for i in range(1, len(completed)):
            try:
                ts_prev = datetime.fromisoformat(completed[i - 1]["timestamp"])
                ts_curr = datetime.fromisoformat(completed[i]["timestamp"])
            except (ValueError, TypeError):
                continue
            # Defensive TZ handling: legacy entries may be naive — assume HA
            # local TZ. Mixing naive/aware datetimes raises TypeError on
            # subtraction below.
            if ts_prev.tzinfo is None:
                ts_prev = ts_prev.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
            if ts_curr.tzinfo is None:
                ts_curr = ts_curr.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)

            interval_days = (ts_curr - ts_prev).total_seconds() / _SECONDS_PER_DAY
            if interval_days <= 0:
                continue

            # Find closest env point to completion timestamp
            completion_ts = ts_curr.timestamp()
            env_val = self._find_closest_value(env_points, completion_ts)
            if env_val is not None:
                intervals.append(interval_days)
                env_at_completion.append(env_val)

        if len(intervals) < DEFAULT_ENVIRONMENTAL_MIN_COMPLETIONS:
            return EnvironmentalAnalysis(
                entity_id=env_entity_id,
                current_value=current_env,
                average_value=None,
                correlation=None,
                adjustment_factor=1.0,
                has_sufficient_data=False,
                data_points=len(intervals),
            )

        # Compute Pearson correlation
        correlation = self._pearson_correlation(env_at_completion, intervals)

        # Average environmental value
        all_env_values = [v for _, v in env_points]
        avg_env = sum(all_env_values) / len(all_env_values)

        # Compute adjustment factor
        adjustment_factor = 1.0
        if (
            correlation is not None
            and abs(correlation) >= DEFAULT_ENVIRONMENTAL_CORRELATION_MIN
            and current_env is not None
            and avg_env != 0
        ):
            # Positive correlation: higher env → longer intervals needed
            # Negative correlation: higher env → shorter intervals needed
            deviation = (current_env - avg_env) / abs(avg_env)
            # Scale: correlation strength * deviation * sensitivity
            adjustment_factor = 1.0 - correlation * deviation * 0.5
            adjustment_factor = max(
                DEFAULT_ENVIRONMENTAL_FACTOR_MIN,
                min(DEFAULT_ENVIRONMENTAL_FACTOR_MAX, adjustment_factor),
            )
            adjustment_factor = round(adjustment_factor, 3)

        return EnvironmentalAnalysis(
            entity_id=env_entity_id,
            current_value=current_env,
            average_value=round(avg_env, 2),
            correlation=round(correlation, 4) if correlation is not None else None,
            adjustment_factor=adjustment_factor,
            has_sufficient_data=True,
            data_points=len(intervals),
        )

    # ------------------------------------------------------------------
    # Recorder statistics
    # ------------------------------------------------------------------

    async def _async_fetch_statistics_points(
        self,
        entity_id: str,
        days: int,
    ) -> list[tuple[float, float]]:
        """Fetch recorder statistics as (timestamp_epoch_seconds, value) pairs.

        Uses statistics_during_period with "hour" period for degradation analysis.
        Returns sorted list of (timestamp_seconds, value) tuples.
        """
        try:
            from homeassistant.components.recorder import (  # type: ignore[attr-defined]
                get_instance,
            )
            from homeassistant.components.recorder.statistics import (
                statistics_during_period,
            )
        except ImportError:
            _LOGGER.debug("Recorder statistics module not available")
            return []

        start_time = dt_util.now() - timedelta(days=days)

        try:
            result = await get_instance(self.hass).async_add_executor_job(
                lambda: statistics_during_period(
                    self.hass,
                    start_time,
                    None,  # end_time = now
                    {entity_id},
                    "hour",
                    None,  # units
                    {"mean", "state"},
                )
            )
        except Exception:  # noqa: BLE001 - recorder fetch can fail many ways (DB lock, timeout, schema mismatch); empty list is a safe fallback
            _LOGGER.debug("Failed to fetch statistics for %s", entity_id, exc_info=True)
            return []

        rows = result.get(entity_id, [])
        if not rows:
            return []

        points: list[tuple[float, float]] = []
        for row in rows:
            # HA Python API (statistics_during_period) returns start as
            # epoch seconds (float), not milliseconds or datetime objects.
            start = row.get("start")
            if start is None:
                continue

            if isinstance(start, (int, float)):
                ts = float(start)  # already epoch seconds
            elif isinstance(start, datetime):
                ts = start.timestamp()
            else:
                continue

            # Prefer "mean" for gauge sensors, "state" for counters
            val = row.get("mean")
            if val is None:
                val = row.get("state")
            if val is None:
                continue

            try:
                points.append((ts, float(val)))
            except (TypeError, ValueError):
                continue

        points.sort(key=lambda p: p[0])
        return points

    # ------------------------------------------------------------------
    # Statistical helpers (pure Python, no numpy)
    # ------------------------------------------------------------------

    @staticmethod
    def _linear_regression(
        points: list[tuple[float, float]],
    ) -> tuple[float, float, float] | None:
        """Compute simple linear regression: y = slope*x + intercept.

        Returns (slope, intercept, r_squared) or None if insufficient data.
        Uses least squares method.
        """
        n = len(points)
        if n < 2:
            return None

        # Normalize X-values to avoid catastrophic cancellation.
        # Raw Unix timestamps (~1.7e9) squared exceed Float64 precision,
        # causing the denominator (n*Σx²−(Σx)²) to lose significant digits.
        # Translation does not change the slope; intercept is adjusted below.
        x0 = points[0][0]

        sum_x = sum(p[0] - x0 for p in points)
        sum_y = sum(p[1] for p in points)
        sum_xy = sum((p[0] - x0) * p[1] for p in points)
        sum_x2 = sum((p[0] - x0) ** 2 for p in points)
        sum_y2 = sum(p[1] ** 2 for p in points)

        denom = n * sum_x2 - sum_x**2
        if abs(denom) < 1e-15:
            return None

        slope = (n * sum_xy - sum_x * sum_y) / denom
        intercept = (sum_y - slope * sum_x) / n - slope * x0

        # R-squared (coefficient of determination)
        ss_tot = sum_y2 - (sum_y**2) / n
        if abs(ss_tot) < 1e-15:
            r_squared = 1.0 if abs(slope) < 1e-15 else 0.0
        else:
            ss_res = sum((p[1] - (slope * p[0] + intercept)) ** 2 for p in points)
            r_squared = max(0.0, 1.0 - ss_res / ss_tot)

        return slope, intercept, r_squared

    @staticmethod
    def _pearson_correlation(
        x_vals: list[float],
        y_vals: list[float],
    ) -> float | None:
        """Compute Pearson correlation coefficient between two lists.

        Returns float in [-1, 1] or None if insufficient data or zero variance.
        """
        n = len(x_vals)
        if n < 3 or n != len(y_vals):
            return None

        mean_x = sum(x_vals) / n
        mean_y = sum(y_vals) / n

        cov = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_vals, y_vals, strict=True))
        var_x = sum((x - mean_x) ** 2 for x in x_vals)
        var_y = sum((y - mean_y) ** 2 for y in y_vals)

        denom = math.sqrt(var_x * var_y)
        if denom < 1e-15:
            return None

        return cov / denom

    @staticmethod
    def _find_closest_value(
        points: list[tuple[float, float]],
        target_ts: float,
    ) -> float | None:
        """Find the value in points closest to target_ts (binary search)."""
        if not points:
            return None

        lo, hi = 0, len(points) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if points[mid][0] < target_ts:
                lo = mid + 1
            else:
                hi = mid

        # Check neighbors
        best_idx = lo
        if lo > 0:
            if abs(points[lo - 1][0] - target_ts) < abs(points[lo][0] - target_ts):
                best_idx = lo - 1

        # Only return if within 24 hours
        if abs(points[best_idx][0] - target_ts) > _SECONDS_PER_DAY:
            return None

        return points[best_idx][1]
