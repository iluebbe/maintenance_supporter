"""Threshold calculator for suggesting trigger values based on recorder statistics."""

from __future__ import annotations

import logging
from dataclasses import dataclass

from homeassistant.core import HomeAssistant

from .entity_analyzer import EntityAnalysis, EntityAnalyzer

_LOGGER = logging.getLogger(__name__)


@dataclass
class ThresholdSuggestions:
    """Suggested threshold values for a trigger."""

    current_value: float | None = None
    unit: str = ""
    average: float | None = None
    minimum: float | None = None
    maximum: float | None = None
    suggested_above: float | None = None
    suggested_below: float | None = None
    data_period_days: int = 0
    percentile_10: float | None = None
    percentile_90: float | None = None
    trend: str | None = None


class ThresholdCalculator:
    """Calculates intelligent threshold suggestions based on entity statistics."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the calculator."""
        self.hass = hass

    async def async_calculate_suggestions(
        self,
        entity_id: str,
        attribute: str | None = None,
        analysis: EntityAnalysis | None = None,
    ) -> ThresholdSuggestions:
        """Generate threshold suggestions based on recorder statistics."""
        state = self.hass.states.get(entity_id)
        if state is None:
            return ThresholdSuggestions()

        unit = state.attributes.get("unit_of_measurement", "")

        try:
            if attribute:
                current = float(state.attributes.get(attribute, 0))
            else:
                current = float(state.state)
        except (ValueError, TypeError):
            return ThresholdSuggestions(unit=unit)

        # Fetch analysis if not provided
        if analysis is None:
            analyzer = EntityAnalyzer(self.hass)
            analysis = await analyzer.async_analyze_entity(entity_id)

        # Try statistics-based suggestions
        if analysis and analysis.statistics and analysis.statistics.has_data:
            stats = analysis.statistics
            return self._suggestions_from_statistics(current, unit, stats)

        # Fallback: naive calculation
        return self._naive_suggestions(current, unit)

    def _suggestions_from_statistics(
        self,
        current: float,
        unit: str,
        stats,
    ) -> ThresholdSuggestions:
        """Calculate suggestions from recorder statistics."""
        suggested_above = None
        suggested_below = None

        if stats.percentile_90 is not None:
            # Above: 20% above P90 (catches unusual highs)
            suggested_above = round(stats.percentile_90 * 1.2, 2)

        if stats.percentile_10 is not None:
            # Below: 20% below P10 (catches unusual lows)
            suggested_below = round(stats.percentile_10 * 0.8, 2)

        # Ensure suggestions don't cross each other or current value nonsensically
        if suggested_above is not None and suggested_below is not None:
            if suggested_above <= suggested_below:
                # Range too narrow, use wider margins
                if stats.mean is not None and stats.std_dev is not None:
                    suggested_above = round(stats.mean + 2 * stats.std_dev, 2)
                    suggested_below = round(stats.mean - 2 * stats.std_dev, 2)

        return ThresholdSuggestions(
            current_value=round(current, 2),
            unit=unit,
            average=stats.mean,
            minimum=stats.minimum,
            maximum=stats.maximum,
            suggested_above=suggested_above,
            suggested_below=suggested_below,
            data_period_days=stats.period_days,
            percentile_10=stats.percentile_10,
            percentile_90=stats.percentile_90,
            trend=stats.recent_trend,
        )

    def _naive_suggestions(self, current: float, unit: str) -> ThresholdSuggestions:
        """Fallback suggestions when no statistics are available."""
        if current > 0:
            suggested_above = round(current * 1.5, 2)
            suggested_below = round(current * 0.5, 2)
        else:
            suggested_above = round(current + 10, 2)
            suggested_below = round(current - 10, 2)

        return ThresholdSuggestions(
            current_value=round(current, 2),
            unit=unit,
            average=None,
            minimum=None,
            maximum=None,
            suggested_above=suggested_above,
            suggested_below=suggested_below,
            data_period_days=0,
        )
