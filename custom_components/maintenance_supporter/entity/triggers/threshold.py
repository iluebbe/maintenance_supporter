"""Threshold trigger for maintenance tasks."""

from __future__ import annotations

import logging
from datetime import datetime
from typing import TYPE_CHECKING, Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later
from homeassistant.util import dt as dt_util

if TYPE_CHECKING:
    from ...sensor import MaintenanceSensor

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
        entity: MaintenanceSensor,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize threshold trigger."""
        super().__init__(hass, entity, trigger_config)

        self._above: float | None = trigger_config.get("trigger_above")
        self._below: float | None = trigger_config.get("trigger_below")
        self._for_minutes: int = trigger_config.get("trigger_for_minutes", 0)

        self._threshold_exceeded = False
        self._timer_cancel: CALLBACK_TYPE | None = None

        # Restore persisted exceeded-since timestamp (survives HA restarts)
        exceeded_since = trigger_config.get("trigger_threshold_exceeded_since")
        self._exceeded_since: str | None = None
        self._exceeded_since_dt: datetime | None = None
        if exceeded_since:
            try:
                self._exceeded_since_dt = datetime.fromisoformat(exceeded_since)
                self._exceeded_since = exceeded_since
            except (ValueError, TypeError):
                pass

    def _value_exceeds_threshold(self, value: float) -> bool:
        """Check if the value exceeds configured thresholds."""
        if self._above is not None and value > self._above:
            return True
        if self._below is not None and value < self._below:
            return True
        return False

    def evaluate(self, value: float) -> bool:
        """Evaluate threshold condition."""
        exceeds = self._value_exceeds_threshold(value)

        if exceeds:
            if self._for_minutes > 0:
                if not self._threshold_exceeded:
                    self._threshold_exceeded = True

                    # Restart recovery: check persisted exceeded_since
                    if self._exceeded_since_dt is not None:
                        elapsed = (
                            dt_util.utcnow() - self._exceeded_since_dt
                        ).total_seconds()
                        if elapsed >= self._for_minutes * 60:
                            _LOGGER.debug(
                                "Threshold recovery: elapsed %.0fs >= %ds, "
                                "triggering immediately: %s",
                                elapsed,
                                self._for_minutes * 60,
                                self.entity_id,
                            )
                            self._triggered = True
                            return True
                        remaining = max(
                            self._for_minutes * 60 - elapsed, 0
                        )
                        _LOGGER.debug(
                            "Threshold recovery: %.0fs remaining: %s",
                            remaining,
                            self.entity_id,
                        )
                        self._exceeded_since_dt = None  # consumed
                        self._start_for_timer(remaining_seconds=remaining)
                        return False

                    # Fresh start: persist timestamp and start full timer
                    self._exceeded_since = dt_util.utcnow().isoformat()
                    self._exceeded_since_dt = None
                    if self.hass.is_running:
                        self.hass.async_create_task(self._persist_exceeded_since())
                    self._start_for_timer()
                    return False
                # Timer running or already triggered
                return self._triggered
            return True

        # Value back in normal range
        if self._threshold_exceeded and self._exceeded_since is not None:
            self._exceeded_since = None
            self._exceeded_since_dt = None
            if self.hass.is_running:
                self.hass.async_create_task(self._persist_exceeded_since())
        self._threshold_exceeded = False
        self._cancel_timer()
        return False

    def _start_for_timer(self, remaining_seconds: float | None = None) -> None:
        """Start the for-duration timer.

        If *remaining_seconds* is provided (e.g. after a restart recovery),
        the timer uses that value instead of the full ``for_minutes`` duration.
        The exceeded-since timestamp is persisted so the timer survives HA
        restarts.
        """
        self._cancel_timer()
        duration = (
            remaining_seconds
            if remaining_seconds is not None
            else self._for_minutes * 60
        )

        @callback
        def _timer_fired(_now: datetime) -> None:
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
            self.hass, duration, _timer_fired
        )

    def _cancel_timer(self) -> None:
        """Cancel the for-duration timer."""
        if self._timer_cancel is not None:
            self._timer_cancel()
            self._timer_cancel = None

    async def _persist_exceeded_since(self) -> None:
        """Persist exceeded-since timestamp for survival across restarts."""
        await self._coordinator.async_persist_trigger_runtime(
            self._task_id,
            {"threshold_exceeded_since": self._exceeded_since},
            entity_id=self.entity_id,
        )

    async def async_teardown(self) -> None:
        """Clean up timer on teardown."""
        self._cancel_timer()
        await super().async_teardown()

    def reset(self) -> None:
        """Reset trigger state."""
        super().reset()
        self._threshold_exceeded = False
        self._exceeded_since = None
        self._exceeded_since_dt = None
        if self.hass.is_running:
            self.hass.async_create_task(self._persist_exceeded_since())
        self._cancel_timer()
