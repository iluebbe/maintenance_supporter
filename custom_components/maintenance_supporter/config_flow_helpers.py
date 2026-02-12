"""Shared helpers for config flow and options flow threshold suggestions."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .helpers.entity_analyzer import EntityAnalyzer
from .helpers.threshold_calculator import ThresholdCalculator, ThresholdSuggestions

_LOGGER = logging.getLogger(__name__)


async def async_get_threshold_suggestions(
    hass: HomeAssistant,
    trigger_entity_id: str | None,
    current_task: dict[str, Any],
) -> ThresholdSuggestions:
    """Get threshold suggestions using EntityAnalyzer and ThresholdCalculator."""
    if not trigger_entity_id:
        return ThresholdSuggestions()

    try:
        analyzer = EntityAnalyzer(hass)
        analysis = await analyzer.async_analyze_entity(trigger_entity_id)

        attribute = current_task.get("trigger_config", {}).get("attribute")
        calculator = ThresholdCalculator(hass)
        return await calculator.async_calculate_suggestions(
            trigger_entity_id, attribute, analysis
        )
    except (HomeAssistantError, ValueError, TypeError, KeyError):
        _LOGGER.debug(
            "Failed to get threshold suggestions for %s",
            trigger_entity_id,
            exc_info=True,
        )
        return ThresholdSuggestions()


def format_threshold_placeholders(
    trigger_entity_id: str | None,
    attribute: str | None,
    suggestions: ThresholdSuggestions,
) -> dict[str, str]:
    """Format description placeholders from threshold suggestions."""
    return {
        "entity_id": trigger_entity_id or "",
        "attribute": attribute or "state",
        "current_value": str(suggestions.current_value) if suggestions.current_value is not None else "",
        "unit": suggestions.unit,
        "average": f"{suggestions.average:.1f}" if suggestions.average is not None else "N/A",
        "minimum": f"{suggestions.minimum:.1f}" if suggestions.minimum is not None else "N/A",
        "maximum": f"{suggestions.maximum:.1f}" if suggestions.maximum is not None else "N/A",
        "suggested_above": f"{suggestions.suggested_above:.1f}" if suggestions.suggested_above is not None else "",
        "suggested_below": f"{suggestions.suggested_below:.1f}" if suggestions.suggested_below is not None else "",
        "data_period": str(suggestions.data_period_days) if suggestions.data_period_days > 0 else "0",
        "trend": suggestions.trend or "",
    }
