"""Counter trigger for maintenance tasks."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

from .base_trigger import BaseTrigger

_LOGGER = logging.getLogger(__name__)


class CounterTrigger(BaseTrigger):
    """Trigger that activates when a counter reaches a target value.

    Supports:
    - Absolute mode: triggers when value >= target
    - Delta mode: triggers when (value - baseline) >= target
    """

    def __init__(
        self,
        hass: HomeAssistant,
        entity: Any,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize counter trigger."""
        super().__init__(hass, entity, trigger_config)

        self._target_value: float = trigger_config.get("trigger_target_value", 0)
        self._delta_mode: bool = trigger_config.get("trigger_delta_mode", False)
        self._baseline_value: float | None = trigger_config.get(
            "trigger_baseline_value"
        )

    async def async_setup(self) -> None:
        """Set up counter trigger with baseline initialization."""
        await super().async_setup()

        # Set initial baseline if in delta mode and no baseline exists
        if self._delta_mode and self._baseline_value is None and self._current_value is not None:
            self._baseline_value = self._current_value
            await self._persist_baseline()
            _LOGGER.debug(
                "Counter baseline initialized: %s = %s",
                self.entity_id,
                self._baseline_value,
            )

    def evaluate(self, value: float) -> bool:
        """Evaluate counter condition."""
        if self._delta_mode:
            if self._baseline_value is None:
                self._baseline_value = value
                return False
            delta = value - self._baseline_value
            return delta >= self._target_value

        # Absolute mode
        return value >= self._target_value

    @property
    def current_delta(self) -> float | None:
        """Return the current delta from baseline."""
        if not self._delta_mode or self._baseline_value is None:
            return None
        if self._current_value is None:
            return None
        return self._current_value - self._baseline_value

    def reset_baseline(self) -> None:
        """Reset the baseline to current value (after maintenance)."""
        if self._current_value is not None:
            self._baseline_value = self._current_value
            self.hass.async_create_task(self._persist_baseline())
            _LOGGER.debug(
                "Counter baseline reset: %s = %s",
                self.entity_id,
                self._baseline_value,
            )

    async def _persist_baseline(self) -> None:
        """Persist baseline value to config entry for survival across restarts."""
        if self._baseline_value is not None:
            await self._coordinator.async_persist_trigger_runtime(
                self._task_id,
                {"trigger_baseline_value": self._baseline_value},
            )

    def reset(self) -> None:
        """Reset trigger and baseline."""
        super().reset()
        self.reset_baseline()
