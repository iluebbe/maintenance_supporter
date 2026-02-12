"""State change trigger for maintenance tasks."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event

from .base_trigger import BaseTrigger

_LOGGER = logging.getLogger(__name__)


class StateChangeTrigger(BaseTrigger):
    """Trigger that activates after counting state transitions.

    Counts transitions matching from_state -> to_state pattern.
    Triggers when count reaches target_changes.
    """

    def __init__(
        self,
        hass: HomeAssistant,
        entity: Any,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize state change trigger."""
        super().__init__(hass, entity, trigger_config)

        self._from_state: str | None = trigger_config.get("trigger_from_state")
        self._to_state: str | None = trigger_config.get("trigger_to_state")
        self._target_changes: int = trigger_config.get("trigger_target_changes", 1)
        # Restore persisted change count from config, default to 0
        self._change_count: int = trigger_config.get("trigger_change_count", 0)
        self._last_state: str | None = None

    async def async_setup(self) -> None:
        """Set up state change trigger.

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
                self.hass, [self.entity_id], self._handle_state_transition
            )
            return

        self._last_state = state.state

        # Restore triggered state from persisted change count
        if self._change_count >= self._target_changes:
            self._triggered = True
            self.entity.async_update_trigger_state(
                is_triggered=True, current_value=float(self._change_count)
            )

        # Register state change listener (override base: we handle events differently)
        self._unsub_listener = async_track_state_change_event(
            self.hass, [self.entity_id], self._handle_state_transition
        )

        _LOGGER.debug(
            "State change trigger setup: %s (target=%d, count=%d, from=%s, to=%s)",
            self.entity_id,
            self._target_changes,
            self._change_count,
            self._from_state,
            self._to_state,
        )

    @callback
    def _handle_state_transition(self, event: Event) -> None:
        """Handle state transition and count matching changes."""
        old_state = event.data.get("old_state")
        new_state = event.data.get("new_state")

        if new_state is None:
            # Entity removed from state machine
            return

        new_val = new_state.state

        # Entity appeared for the first time (old_state=None)
        if old_state is None:
            _LOGGER.info(
                "Trigger entity %s appeared in state machine (state=%s)",
                self.entity_id,
                new_val,
            )
            self._logged_unavailable = False
            # Capture initial state but don't count as a transition
            if new_val not in ("unavailable", "unknown"):
                self._last_state = new_val
            return

        old_val = old_state.state

        # Handle unavailable/unknown with log-once pattern
        if new_val in ("unavailable", "unknown"):
            if not self._logged_unavailable:
                _LOGGER.warning(
                    "Trigger entity %s became %s",
                    self.entity_id,
                    new_val,
                )
                self._logged_unavailable = True
            return

        # Entity is back to a valid state
        if self._logged_unavailable:
            _LOGGER.info(
                "Trigger entity %s is available again (state=%s)",
                self.entity_id,
                new_val,
            )
            self._logged_unavailable = False

        # Check if transition matches pattern
        matches = True
        if self._from_state is not None and old_val != self._from_state:
            matches = False
        if self._to_state is not None and new_val != self._to_state:
            matches = False

        if matches and old_val != new_val:
            self._change_count += 1
            # Persist change count to survive restarts
            self.hass.async_create_task(self._persist_change_count())
            _LOGGER.debug(
                "State change counted: %s (%s -> %s) count=%d/%d",
                self.entity_id,
                old_val,
                new_val,
                self._change_count,
                self._target_changes,
            )

            was_triggered = self._triggered
            is_triggered = self._change_count >= self._target_changes
            self._triggered = is_triggered

            if is_triggered and not was_triggered:
                self._on_trigger_activated(float(self._change_count))
            elif not is_triggered and was_triggered:
                self._on_trigger_deactivated(float(self._change_count))

        self._last_state = new_val

    def evaluate(self, value: float) -> bool:
        """Evaluate is handled by _handle_state_transition directly."""
        # State change triggers use event-driven evaluation only
        return self._triggered

    @property
    def change_count(self) -> int:
        """Return the current change count."""
        return self._change_count

    def reset_count(self) -> None:
        """Reset the change counter (after maintenance)."""
        self._change_count = 0
        self.hass.async_create_task(self._persist_change_count())
        _LOGGER.debug("State change counter reset: %s", self.entity_id)

    async def _persist_change_count(self) -> None:
        """Persist change count to config entry for survival across restarts."""
        await self._coordinator.async_persist_trigger_runtime(
            self._task_id,
            {"trigger_change_count": self._change_count},
        )

    def reset(self) -> None:
        """Reset trigger and counter."""
        super().reset()
        self.reset_count()
