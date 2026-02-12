"""Trigger system for sensor-based maintenance tasks."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from ...const import TriggerType
from .base_trigger import BaseTrigger
from .counter import CounterTrigger
from .state_change import StateChangeTrigger
from .threshold import ThresholdTrigger

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def create_trigger(
    hass: HomeAssistant,
    entity: Any,
    trigger_config: dict[str, Any],
) -> BaseTrigger:
    """Create a trigger instance based on trigger type."""
    trigger_type = trigger_config.get("type", TriggerType.THRESHOLD)

    if trigger_type == TriggerType.THRESHOLD:
        return ThresholdTrigger(hass, entity, trigger_config)
    if trigger_type == TriggerType.COUNTER:
        return CounterTrigger(hass, entity, trigger_config)
    if trigger_type == TriggerType.STATE_CHANGE:
        return StateChangeTrigger(hass, entity, trigger_config)

    raise ValueError(f"Unknown trigger type: {trigger_type}")


__all__ = [
    "BaseTrigger",
    "CounterTrigger",
    "StateChangeTrigger",
    "ThresholdTrigger",
    "create_trigger",
]
