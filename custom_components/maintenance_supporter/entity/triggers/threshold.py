"""Threshold trigger for maintenance tasks."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_call_later

from .base_trigger import BaseTrigger

_LOGGER = logging.getLogger(__name__)


class ThresholdTrigger(BaseTrigger):
    """Trigger that activates when a sensor value exceeds thresholds.

    Supports:
    - Above threshold (value > above)
    - Below threshold (value < below)
    - Duration requirement (value must exceed for X minutes)
    """

    def __init__(
        self,
        hass: HomeAssistant,
        entity: Any,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize threshold trigger."""
        super().__init__(hass, entity, trigger_config)

        self._above: float | None = trigger_config.get("trigger_above")
        self._below: float | None = trigger_config.get("trigger_below")
        self._for_minutes: int = trigger_config.get("trigger_for_minutes", 0)

        self._threshold_exceeded = False
        self._timer_cancel: callback | None = None

    def evaluate(self, value: float) -> bool:
        """Evaluate threshold condition."""
        exceeds = False

        if self._above is not None and value > self._above:
            exceeds = True
        if self._below is not None and value < self._below:
            exceeds = True

        if exceeds:
            if self._for_minutes > 0:
                if not self._threshold_exceeded:
                    # Start timer
                    self._threshold_exceeded = True
                    self._start_for_timer()
                    return False  # Not triggered yet
                # Timer running or already triggered
                return self._triggered  # Keep current state until timer fires
            return True

        # Value back in normal range
        self._threshold_exceeded = False
        self._cancel_timer()
        return False

    def _start_for_timer(self) -> None:
        """Start the for-duration timer."""
        self._cancel_timer()

        @callback
        def _timer_fired(_now) -> None:
            """Handle timer completion."""
            if self._threshold_exceeded:
                _LOGGER.debug(
                    "Threshold for-timer fired: %s (%d min)",
                    self.entity_id,
                    self._for_minutes,
                )
                self._triggered = True
                self._on_trigger_activated(self._current_value or 0.0)

        self._timer_cancel = async_call_later(
            self.hass, self._for_minutes * 60, _timer_fired
        )

    def _cancel_timer(self) -> None:
        """Cancel the for-duration timer."""
        if self._timer_cancel is not None:
            self._timer_cancel()
            self._timer_cancel = None

    async def async_teardown(self) -> None:
        """Clean up timer on teardown."""
        self._cancel_timer()
        await super().async_teardown()

    def reset(self) -> None:
        """Reset trigger state."""
        super().reset()
        self._threshold_exceeded = False
        self._cancel_timer()
