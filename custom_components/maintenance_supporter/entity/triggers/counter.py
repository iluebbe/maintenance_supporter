"""Counter trigger for maintenance tasks."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback

if TYPE_CHECKING:
    from datetime import datetime

    from .base_trigger import TriggerHost

from ...helpers.managed_timer import ManagedTimer
from ...helpers.trigger_fallback import counter_baseline
from .base_trigger import BaseTrigger

_LOGGER = logging.getLogger(__name__)

# How long a reading under the delta baseline waits for a reading back above
# it before it counts as the source counter's reset (see _evaluate_drop).
DROP_CONFIRM_SECONDS = 120


class CounterTrigger(BaseTrigger):
    """Trigger that activates when a counter reaches a target value.

    Supports:
    - Absolute mode: triggers when value >= target
    - Delta mode: triggers when (value - baseline) >= target
    """

    def __init__(
        self,
        hass: HomeAssistant,
        entity: TriggerHost,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize counter trigger."""
        super().__init__(hass, entity, trigger_config)

        self._target_value: float = trigger_config.get("trigger_target_value", 0)
        self._delta_mode: bool = trigger_config.get("trigger_delta_mode", False)
        self._baseline_value: float | None = trigger_config.get("trigger_baseline_value")
        # Set when reset_baseline is called while the source is unavailable, so
        # the re-baseline is applied against the next real value (M4).
        self._reset_pending: bool = False
        # Delta mode: the first reading under the baseline, waiting to be
        # told apart from a glitch (see _evaluate_drop).
        self._drop_low: float | None = None
        self._drop_timer = ManagedTimer(hass, f"CounterTrigger:{self.entity_id}:drop")

    async def async_setup(self) -> None:
        """Set up counter trigger with baseline initialization."""
        # Restore persisted baseline BEFORE super().async_setup() which calls
        # evaluate().  Without this, evaluate() sets _baseline_value to the
        # current sensor value, discarding the saved baseline from the Store.
        # The Store baseline wins even over an explicit trigger_baseline_value
        # from the config: the config value is only the INITIAL baseline, while
        # the Store holds the LIVING one — after a completion re-baselines to
        # e.g. 80, falling back to the config's 0 on restart would re-fire the
        # just-completed task (issue #102 family).
        if self._delta_mode:
            # The shared lookup (helpers.trigger_fallback.counter_baseline):
            # the entity's Store baseline, else the configured initial one.
            saved = counter_baseline(self.config, self.entity_id)
            if saved is not None:
                self._baseline_value = saved
                _LOGGER.debug(
                    "Counter baseline restored from store: %s = %s",
                    self.entity_id,
                    self._baseline_value,
                )

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

    def _evaluate_and_update(self, value: float) -> None:
        """Initialize/re-baseline before evaluation, then persist."""
        if self._delta_mode and self._reset_pending:
            # Apply the deferred post-completion re-baseline now that a real
            # value is available (the source was unavailable at completion). (M4)
            self._baseline_value = value
            self._reset_pending = False
            self.hass.async_create_task(
                self._persist_baseline(),
                eager_start=False,
            )
        elif self._delta_mode and self._baseline_value is None:
            self._baseline_value = value
            self.hass.async_create_task(
                self._persist_baseline(),
                eager_start=False,
            )
            _LOGGER.debug(
                "Counter baseline initialized on state change: %s = %s",
                self.entity_id,
                self._baseline_value,
            )
        super()._evaluate_and_update(value)

    def evaluate(self, value: float) -> bool:
        """Evaluate counter condition."""
        if self._delta_mode:
            if self._baseline_value is None:
                # Fallback — should be caught by _evaluate_and_update
                self._baseline_value = value
                return False
            if value < self._baseline_value:
                return self._evaluate_drop(value)
            if self._drop_low is not None:
                # Back up: the reading under the baseline was a glitch.
                self._drop_low = None
                self._drop_timer.cancel()
            delta = value - self._baseline_value
            return delta >= self._target_value

        # Absolute mode
        return value >= self._target_value

    def _evaluate_drop(self, value: float) -> bool:
        """A reading under the baseline: a glitch (a sensor that reported 0
        for a moment) or the source counter's reset (the device's own reset —
        for a counter that counts since then, that IS the maintenance — a
        reboot, a meter rollover).

        One reading decided at once: it re-based the count, so a single 0
        made the next real reading count from 0 and fire the task (bug audit
        2026-10-16, T5). A drop is a reset when the next reading is still
        under the baseline, or when no reading back above it arrives within
        DROP_CONFIRM_SECONDS; then counting starts from the new value instead
        of waiting for the counter to climb back past the old baseline (M3).
        Until then the trigger keeps its state."""
        if self._drop_low is None:
            self._drop_low = value
            self._drop_timer.schedule(DROP_CONFIRM_SECONDS, self._drop_timer_fired)
            return self._triggered
        # Counted from the first low reading: what came since is new use.
        self._baseline_value = min(self._drop_low, value)
        self._drop_low = None
        self._drop_timer.cancel()
        self.hass.async_create_task(self._persist_baseline(), eager_start=False)
        return value - self._baseline_value >= self._target_value

    @callback
    def _drop_timer_fired(self, _now: datetime) -> None:
        """No reading back above the baseline: the drop was a reset."""
        if self._drop_low is None:
            return
        state = self.hass.states.get(self.entity_id)
        live = self._get_numeric_value(state) if state is not None else None
        if live is None or self._baseline_value is None or live >= self._baseline_value:
            self._drop_low = None
            return
        self._current_value = live
        self._evaluate_and_update(live)

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
            self._reset_pending = False
            self._drop_low = None
            self._drop_timer.cancel()
            self.hass.async_create_task(self._persist_baseline())
            _LOGGER.debug(
                "Counter baseline reset: %s = %s",
                self.entity_id,
                self._baseline_value,
            )
        elif self._delta_mode:
            # Source unavailable at completion — defer the re-baseline to the
            # next real value so a stale baseline can't immediately re-trigger
            # the just-completed task when the entity returns. (M4; delta-only,
            # absolute mode has no baseline to defer.)
            self._reset_pending = True
            _LOGGER.debug(
                "Counter baseline reset deferred (source unavailable): %s",
                self.entity_id,
            )

    async def _persist_baseline(self) -> None:
        """Persist baseline value to the Store for survival across restarts."""
        if self._baseline_value is not None:
            await self._coordinator.async_persist_trigger_runtime(
                self._task_id,
                {"baseline_value": self._baseline_value},
                entity_id=self.entity_id,
                immediate=True,
            )
            # Surface the moved baseline in the coordinator read-model right
            # away. Without this, a freshly adopted delta task shows no delta
            # for up to a full update interval and the panel's progress bar
            # falls back to the RAW counter value — a 27,000 km odometer reads
            # as "27000/15000, overdue" (issue #102). Debounced upstream, and
            # the periodic refresh never writes baselines, so no loop.
            # Debounced ON PURPOSE: a counter entity can change many times
            # a minute, and this is the path the ten-second coalescing
            # window exists for. User actions use async_refresh_now.
            await self._coordinator.async_request_refresh()

    def reset(self) -> None:
        """Reset trigger and baseline."""
        super().reset()
        self.reset_baseline()

    async def async_teardown(self) -> None:
        """Clean up the drop timer on teardown."""
        self._drop_timer.close()
        await super().async_teardown()
