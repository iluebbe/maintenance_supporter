"""Runtime trigger for maintenance tasks.

Tracks accumulated 'on' time of a binary entity (input_boolean, switch,
binary_sensor, etc.) and triggers when the total runtime reaches a
configured threshold in hours.
"""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.util import dt as dt_util

from .base_trigger import BaseTrigger

_LOGGER = logging.getLogger(__name__)

_ON_STATES = frozenset({"on", "1", "true"})

# Persist accumulated runtime every 5 minutes to minimise data loss on crash
_PERSIST_INTERVAL = timedelta(minutes=5)


class RuntimeTrigger(BaseTrigger):
    """Trigger that activates when accumulated runtime reaches target hours.

    Monitors a binary entity (on/off) and accumulates time spent in the 'on'
    state.  Triggers when accumulated hours >= configured threshold.
    """

    def __init__(
        self,
        hass: HomeAssistant,
        entity: Any,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize runtime trigger."""
        super().__init__(hass, entity, trigger_config)

        self._target_hours: float = trigger_config.get(
            "trigger_runtime_hours", 100.0
        )
        self._accumulated_seconds: float = trigger_config.get(
            "trigger_accumulated_seconds", 0.0
        )

        # Restore on_since timestamp for restart recovery
        on_since_str = trigger_config.get("trigger_on_since")
        self._on_since: str | None = None  # ISO string stored for persistence
        self._on_since_dt: Any | None = None  # parsed datetime for calculation
        if on_since_str:
            parsed = dt_util.parse_datetime(on_since_str)
            if parsed:
                self._on_since = on_since_str
                self._on_since_dt = parsed

        self._unsub_periodic: Any | None = None

    async def async_setup(self) -> None:
        """Set up runtime trigger with state restoration."""
        state = self.hass.states.get(self.entity_id)
        if state is None:
            _LOGGER.info(
                "Runtime trigger entity %s not yet available — listener "
                "registered, waiting for entity to appear",
                self.entity_id,
            )
            self._unsub_listener = async_track_state_change_event(
                self.hass,
                [self.entity_id],
                self._handle_runtime_state_change,
            )
            self._start_periodic_timer()
            return

        # Entity exists — check if currently ON
        if self._is_on(state.state):
            if self._on_since_dt is None:
                # No restored timestamp — start tracking from now
                now = dt_util.utcnow()
                self._on_since_dt = now
                self._on_since = now.isoformat()
                await self._persist_runtime()
                _LOGGER.debug(
                    "Runtime trigger: entity %s is ON, started tracking from now",
                    self.entity_id,
                )
        else:
            # Entity is OFF — clear any stale on_since
            if self._on_since_dt is not None:
                # Was ON before restart but now OFF — accumulate the gap
                self._accumulate_elapsed()
                self._on_since_dt = None
                self._on_since = None
                await self._persist_runtime()

        # Register state change listener
        self._unsub_listener = async_track_state_change_event(
            self.hass,
            [self.entity_id],
            self._handle_runtime_state_change,
        )

        # Start periodic persistence timer
        self._start_periodic_timer()

        # Initial evaluation
        current_hours = self._get_current_runtime_hours()
        self._current_value = current_hours
        self._evaluate_and_update(current_hours)

        _LOGGER.debug(
            "Runtime trigger setup: %s (target=%.1fh, accumulated=%.2fh, on_since=%s)",
            self.entity_id,
            self._target_hours,
            self._accumulated_seconds / 3600.0,
            self._on_since,
        )

    def _start_periodic_timer(self) -> None:
        """Start the periodic persistence timer."""
        self._unsub_periodic = async_track_time_interval(
            self.hass,
            self._periodic_callback,
            _PERSIST_INTERVAL,
        )

    async def async_teardown(self) -> None:
        """Remove listeners and periodic timer."""
        if self._unsub_periodic is not None:
            self._unsub_periodic()
            self._unsub_periodic = None
        await super().async_teardown()

    @callback
    def _handle_runtime_state_change(self, event: Event) -> None:
        """Handle state changes for runtime accumulation."""
        old_state = event.data.get("old_state")
        new_state = event.data.get("new_state")

        if new_state is None:
            return

        new_val = new_state.state

        # Entity appeared for the first time
        if old_state is None:
            _LOGGER.info(
                "Runtime trigger entity %s appeared (state=%s)",
                self.entity_id,
                new_val,
            )
            self._logged_unavailable = False
            if self._is_on(new_val) and self._on_since_dt is None:
                now = dt_util.utcnow()
                self._on_since_dt = now
                self._on_since = now.isoformat()
                self.hass.async_create_task(self._persist_runtime())
            self._update_evaluation()
            return

        old_val = old_state.state

        # Handle unavailable/unknown — pause accumulation
        if new_val in ("unavailable", "unknown"):
            if self._on_since_dt is not None:
                self._accumulate_elapsed()
                self._on_since_dt = None
                self._on_since = None
                self.hass.async_create_task(self._persist_runtime())
            if not self._logged_unavailable:
                _LOGGER.warning(
                    "Runtime trigger entity %s became %s (runtime paused)",
                    self.entity_id,
                    new_val,
                )
                self._logged_unavailable = True
            return

        # Entity back to valid state
        if self._logged_unavailable:
            _LOGGER.info(
                "Runtime trigger entity %s available again (state=%s)",
                self.entity_id,
                new_val,
            )
            self._logged_unavailable = False

        was_on = self._is_on(old_val)
        now_on = self._is_on(new_val)

        if was_on and not now_on:
            # Turned OFF — accumulate elapsed time
            self._accumulate_elapsed()
            self._on_since_dt = None
            self._on_since = None
            self.hass.async_create_task(self._persist_runtime())
            _LOGGER.debug(
                "Runtime trigger: %s turned OFF (accumulated=%.2fh)",
                self.entity_id,
                self._accumulated_seconds / 3600.0,
            )
        elif not was_on and now_on:
            # Turned ON — start tracking
            now = dt_util.utcnow()
            self._on_since_dt = now
            self._on_since = now.isoformat()
            self.hass.async_create_task(self._persist_runtime())
            _LOGGER.debug(
                "Runtime trigger: %s turned ON (tracking started)",
                self.entity_id,
            )

        self._update_evaluation()

    def _update_evaluation(self) -> None:
        """Evaluate trigger condition with current runtime."""
        current_hours = self._get_current_runtime_hours()
        self._current_value = current_hours
        self._evaluate_and_update(current_hours)

    @staticmethod
    def _is_on(state_value: str) -> bool:
        """Check if state represents 'on'."""
        return state_value.lower() in _ON_STATES

    def _accumulate_elapsed(self) -> None:
        """Add elapsed time since _on_since to accumulated total."""
        if self._on_since_dt is None:
            return
        now = dt_util.utcnow()
        elapsed = (now - self._on_since_dt).total_seconds()
        if elapsed > 0:
            self._accumulated_seconds += elapsed

    def _get_current_runtime_hours(self) -> float:
        """Get current runtime in hours (accumulated + ongoing if ON)."""
        total_seconds = self._accumulated_seconds
        if self._on_since_dt is not None:
            elapsed = (dt_util.utcnow() - self._on_since_dt).total_seconds()
            if elapsed > 0:
                total_seconds += elapsed
        return total_seconds / 3600.0

    def evaluate(self, value: float) -> bool:
        """Evaluate whether runtime threshold is met."""
        return value >= self._target_hours

    @callback
    def _periodic_callback(self, _now: Any) -> None:
        """Periodic callback to persist runtime every 5 minutes."""
        if self._on_since_dt is None:
            return
        # Accumulate elapsed, reset window, persist
        self._accumulate_elapsed()
        now = dt_util.utcnow()
        self._on_since_dt = now
        self._on_since = now.isoformat()
        self.hass.async_create_task(self._persist_runtime())

        # Re-evaluate (runtime may have crossed threshold)
        self._update_evaluation()

        _LOGGER.debug(
            "Runtime trigger periodic persist: %s (accumulated=%.2fh)",
            self.entity_id,
            self._accumulated_seconds / 3600.0,
        )

    async def _persist_runtime(self) -> None:
        """Persist accumulated runtime and on_since to config entry."""
        data: dict[str, Any] = {
            "trigger_accumulated_seconds": self._accumulated_seconds,
            "trigger_on_since": self._on_since,
        }
        await self._coordinator.async_persist_trigger_runtime(
            self._task_id, data
        )

    def reset(self) -> None:
        """Reset accumulated runtime (called after maintenance completion)."""
        super().reset()
        self._accumulated_seconds = 0.0
        # If entity is currently ON, keep tracking from now (fresh start)
        if self._on_since_dt is not None:
            now = dt_util.utcnow()
            self._on_since_dt = now
            self._on_since = now.isoformat()
        self.hass.async_create_task(self._persist_runtime())
        _LOGGER.debug(
            "Runtime trigger reset: %s (accumulated hours cleared)",
            self.entity_id,
        )

    # --- Properties for sensor attributes ---

    @property
    def accumulated_hours(self) -> float:
        """Return persisted accumulated hours (not including ongoing session)."""
        return self._accumulated_seconds / 3600.0

    @property
    def current_runtime_hours(self) -> float:
        """Return total runtime including ongoing session."""
        return self._get_current_runtime_hours()

    @property
    def remaining_hours(self) -> float:
        """Return hours remaining until trigger fires."""
        return max(0.0, self._target_hours - self._get_current_runtime_hours())
