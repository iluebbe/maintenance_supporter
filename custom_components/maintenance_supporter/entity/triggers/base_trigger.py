"""Base trigger class for sensor-based maintenance triggers."""

from __future__ import annotations

import logging
import math
from abc import ABC, abstractmethod
from datetime import datetime
from typing import TYPE_CHECKING, Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.helpers.event import (
    EventStateChangedData,
    async_call_later,
    async_track_state_change_event,
)

if TYPE_CHECKING:
    from ...coordinator import MaintenanceCoordinator
    from ...sensor import MaintenanceSensor

from ...const import (
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    HistoryEntryType,
)

_LOGGER = logging.getLogger(__name__)


class BaseTrigger(ABC):
    """Base class for all maintenance triggers."""

    def __init__(
        self,
        hass: HomeAssistant,
        entity: MaintenanceSensor,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize the trigger."""
        self.hass = hass
        self.entity = entity
        self.config = trigger_config
        self.entity_id = trigger_config.get("entity_id", "")
        self.attribute = trigger_config.get("attribute")

        self._triggered = False
        self._current_value: float | None = None
        self._unsub_listener: CALLBACK_TYPE | None = None
        self._unsub_retry: CALLBACK_TYPE | None = None
        self._logged_unavailable = False  # Log-once pattern for unavailable

    @property
    def _coordinator(self) -> MaintenanceCoordinator:
        """Get the coordinator from the entity."""
        return self.entity.coordinator

    @property
    def _task_id(self) -> str:
        """Get the task ID from the entity."""
        return self.entity._task_id

    async def async_setup(self) -> None:
        """Set up the trigger: validate entity and register listener.

        IMPORTANT: The listener is ALWAYS registered, even when the entity does
        not exist yet.  HA fires a state_change event when an entity first
        appears (old_state=None), so the trigger will self-heal automatically.
        """
        state = self.hass.states.get(self.entity_id)
        if state is None:
            _LOGGER.info(
                "Trigger entity %s not yet available — listener registered, "
                "waiting for entity to appear",
                self.entity_id,
            )
            # Register listener anyway so we catch the entity appearing
            self._unsub_listener = async_track_state_change_event(
                self.hass, [self.entity_id], self._handle_state_change_event
            )
            return

        # Register state change listener
        self._unsub_listener = async_track_state_change_event(
            self.hass, [self.entity_id], self._handle_state_change_event
        )

        # If state is unknown/unavailable, schedule a retry
        if state.state in ("unavailable", "unknown"):
            _LOGGER.info(
                "Trigger entity %s is '%s' — will retry evaluation in 30s",
                self.entity_id,
                state.state,
            )
            self._schedule_retry()
            return

        # Validate that we can get a value
        value = self._get_numeric_value(state)
        if value is not None:
            self._current_value = value

        # Initial evaluation
        if value is not None:
            self._evaluate_and_update(value)

        _LOGGER.debug(
            "Trigger setup complete: %s monitoring %s (attribute=%s, value=%s)",
            type(self).__name__,
            self.entity_id,
            self.attribute,
            self._current_value,
        )

    def _schedule_retry(self) -> None:
        """Schedule a retry of the initial evaluation after 30 seconds."""
        self._cancel_retry()

        @callback
        def _retry_initial_evaluation(_now: datetime) -> None:
            """Re-check entity state after a delay."""
            self._unsub_retry = None
            state = self.hass.states.get(self.entity_id)
            if state is None or state.state in ("unavailable", "unknown"):
                _LOGGER.debug(
                    "Trigger entity %s still %s after retry",
                    self.entity_id,
                    state.state if state else "missing",
                )
                return
            value = self._get_numeric_value(state)
            if value is not None:
                self._current_value = value
                self._evaluate_and_update(value)
                _LOGGER.info(
                    "Trigger entity %s recovered after retry (value=%s)",
                    self.entity_id,
                    value,
                )

        self._unsub_retry = async_call_later(
            self.hass, 30, _retry_initial_evaluation
        )

    def _cancel_retry(self) -> None:
        """Cancel pending retry timer."""
        if self._unsub_retry is not None:
            self._unsub_retry()
            self._unsub_retry = None

    async def async_teardown(self) -> None:
        """Remove the trigger listener."""
        self._cancel_retry()
        if self._unsub_listener is not None:
            self._unsub_listener()
            self._unsub_listener = None
        _LOGGER.debug("Trigger teardown: %s", self.entity_id)

    @callback
    def _handle_state_change_event(self, event: Event[EventStateChangedData]) -> None:
        """Handle state change event from the monitored entity."""
        old_state = event.data.get("old_state")
        new_state = event.data.get("new_state")

        if new_state is None:
            # Entity removed from state machine
            return

        # Entity appeared for the first time (old_state=None)
        if old_state is None:
            _LOGGER.info(
                "Trigger entity %s appeared in state machine (state=%s)",
                self.entity_id,
                new_state.state,
            )
            self._logged_unavailable = False

        # Handle unavailable/unknown with log-once pattern
        if new_state.state in ("unavailable", "unknown"):
            if not self._logged_unavailable:
                _LOGGER.warning(
                    "Trigger entity %s became %s",
                    self.entity_id,
                    new_state.state,
                )
                self._logged_unavailable = True
            return

        # Entity is back to a valid state
        if self._logged_unavailable:
            _LOGGER.info(
                "Trigger entity %s is available again (state=%s)",
                self.entity_id,
                new_state.state,
            )
            self._logged_unavailable = False

        value = self._get_numeric_value(new_state)
        if value is not None:
            self._current_value = value
            self._evaluate_and_update(value)

    def _evaluate_and_update(self, value: float) -> None:
        """Evaluate trigger condition and update state if changed."""
        was_triggered = self._triggered
        is_triggered = self.evaluate(value)
        self._triggered = is_triggered

        if is_triggered and not was_triggered:
            self._on_trigger_activated(value)
        elif not is_triggered and was_triggered:
            self._on_trigger_deactivated(value)

    @abstractmethod
    def evaluate(self, value: float) -> bool:
        """Evaluate whether the trigger condition is met.

        Must be implemented by subclasses.
        Returns True if trigger should be active.
        """

    def _on_trigger_activated(self, value: float) -> None:
        """Handle trigger activation."""
        _LOGGER.info(
            "Maintenance trigger activated: %s = %s (entity: %s)",
            self.entity.entity_id,
            value,
            self.entity_id,
        )

        # Update entity state
        self.entity.async_update_trigger_state(
            is_triggered=True,
            current_value=value,
            trigger_entity_id=self.entity_id,
        )

        # Add history entry for the trigger activation
        self.hass.async_create_task(
            self._coordinator.async_add_trigger_history_entry(
                self._task_id, trigger_value=value
            )
        )

        # Fire event
        self.hass.bus.async_fire(
            EVENT_TRIGGER_ACTIVATED,
            {
                "entity_id": self.entity.entity_id,
                "trigger_entity": self.entity_id,
                "trigger_attribute": self.attribute,
                "trigger_value": value,
                "trigger_type": self.config.get("type"),
            },
        )

    def _on_trigger_deactivated(self, value: float) -> None:
        """Handle trigger deactivation."""
        _LOGGER.info(
            "Maintenance trigger deactivated: %s = %s (entity: %s)",
            self.entity.entity_id,
            value,
            self.entity_id,
        )

        # Update entity state
        self.entity.async_update_trigger_state(
            is_triggered=False,
            current_value=value,
            trigger_entity_id=self.entity_id,
        )

        # Fire event
        self.hass.bus.async_fire(
            EVENT_TRIGGER_DEACTIVATED,
            {
                "entity_id": self.entity.entity_id,
                "trigger_entity": self.entity_id,
                "trigger_attribute": self.attribute,
                "trigger_value": value,
                "trigger_type": self.config.get("type"),
            },
        )

    def _get_numeric_value(self, state: State) -> float | None:
        """Extract numeric value from state or attribute."""
        try:
            if self.attribute:
                raw = state.attributes.get(self.attribute)
            else:
                raw = state.state

            if raw is None:
                return None
            val = float(raw)
            if not math.isfinite(val):
                return None
            return val
        except (ValueError, TypeError):
            return None

    def reset(self) -> None:
        """Reset the trigger (called after maintenance completion)."""
        self._triggered = False
