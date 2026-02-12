"""Entity analyzer for discovering numeric attributes and fetching recorder statistics."""

from __future__ import annotations

import logging
import statistics as py_stats
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

_LOGGER = logging.getLogger(__name__)

_STATISTICS_LOOKBACK_DAYS = 90


@dataclass
class AttributeInfo:
    """Information about a numeric attribute."""

    name: str
    current_value: float
    unit: str | None = None


@dataclass
class StatisticsInfo:
    """Historical statistics for an entity from the HA recorder."""

    has_data: bool = False
    period_days: int = 0
    mean: float | None = None
    minimum: float | None = None
    maximum: float | None = None
    std_dev: float | None = None
    percentile_10: float | None = None
    percentile_90: float | None = None
    recent_trend: str | None = None  # "rising" | "falling" | "stable"


@dataclass
class EntityAnalysis:
    """Result of analyzing an entity for trigger suitability."""

    entity_id: str
    domain: str = ""
    device_class: str | None = None
    unit_of_measurement: str | None = None
    is_numeric_state: bool = False
    numeric_attributes: dict[str, AttributeInfo] = field(default_factory=dict)
    current_state: str = ""
    statistics: StatisticsInfo | None = None


class EntityAnalyzer:
    """Analyzes HA entities for maintenance trigger configuration."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the analyzer."""
        self.hass = hass

    async def async_analyze_entity(self, entity_id: str) -> EntityAnalysis | None:
        """Analyze an entity and return its properties including recorder statistics."""
        state = self.hass.states.get(entity_id)
        if state is None:
            return None

        domain = entity_id.split(".")[0]
        device_class = state.attributes.get("device_class")
        unit = state.attributes.get("unit_of_measurement")

        # Check if state is numeric
        is_numeric = False
        try:
            float(state.state)
            is_numeric = True
        except (ValueError, TypeError):
            pass

        # Find numeric attributes
        numeric_attrs: dict[str, AttributeInfo] = {}
        for attr_name, attr_value in state.attributes.items():
            if attr_name.startswith("_"):
                continue
            try:
                val = float(attr_value)
                numeric_attrs[attr_name] = AttributeInfo(
                    name=attr_name,
                    current_value=val,
                    unit=None,
                )
            except (ValueError, TypeError):
                continue

        # Fetch recorder statistics
        stats_info = await self._async_fetch_statistics(entity_id)

        return EntityAnalysis(
            entity_id=entity_id,
            domain=domain,
            device_class=device_class,
            unit_of_measurement=unit,
            is_numeric_state=is_numeric,
            numeric_attributes=numeric_attrs,
            current_state=state.state,
            statistics=stats_info,
        )

    async def _async_fetch_statistics(self, entity_id: str) -> StatisticsInfo | None:
        """Fetch long-term statistics from the HA recorder."""
        try:
            from homeassistant.components.recorder.statistics import (
                statistics_during_period,
            )
        except ImportError:
            _LOGGER.debug("Recorder statistics module not available")
            return None

        start_time = datetime.now(timezone.utc) - timedelta(days=_STATISTICS_LOOKBACK_DAYS)

        try:
            result = await self.hass.async_add_executor_job(
                statistics_during_period,
                self.hass,
                start_time,
                None,  # end_time = now
                {entity_id},
                "day",
                None,  # units
                {"mean", "min", "max"},
            )
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.debug("Failed to fetch statistics for %s", entity_id, exc_info=True)
            return None

        rows = result.get(entity_id, [])
        if not rows:
            return StatisticsInfo(has_data=False)

        # Extract daily values
        means: list[float] = []
        mins: list[float] = []
        maxs: list[float] = []

        for row in rows:
            m = row.get("mean")
            if m is not None:
                means.append(m)
            mn = row.get("min")
            if mn is not None:
                mins.append(mn)
            mx = row.get("max")
            if mx is not None:
                maxs.append(mx)

        if not means and not mins and not maxs:
            return StatisticsInfo(has_data=False)

        # Use whichever series has data (means preferred, fall back to mins)
        values = means if means else mins if mins else maxs

        info = StatisticsInfo(
            has_data=True,
            period_days=len(rows),
        )

        if means:
            info.mean = round(py_stats.mean(means), 3)
        if mins:
            info.minimum = round(min(mins), 3)
        if maxs:
            info.maximum = round(max(maxs), 3)

        # Standard deviation
        if len(values) >= 2:
            info.std_dev = round(py_stats.stdev(values), 3)

        # Percentiles
        if len(values) >= 5:
            sorted_vals = sorted(values)
            n = len(sorted_vals)
            info.percentile_10 = round(sorted_vals[max(0, int(n * 0.1))], 3)
            info.percentile_90 = round(sorted_vals[min(n - 1, int(n * 0.9))], 3)

        # Recent trend (last 7 days vs previous 7 days)
        if len(values) >= 14:
            recent = values[-7:]
            previous = values[-14:-7]
            recent_avg = py_stats.mean(recent)
            prev_avg = py_stats.mean(previous)
            if prev_avg != 0:
                change_pct = (recent_avg - prev_avg) / abs(prev_avg) * 100
                if change_pct > 5:
                    info.recent_trend = "rising"
                elif change_pct < -5:
                    info.recent_trend = "falling"
                else:
                    info.recent_trend = "stable"

        return info
