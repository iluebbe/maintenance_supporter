"""Base trigger class for sensor-based maintenance triggers."""

from __future__ import annotations

import logging
import math
from abc import ABC, abstractmethod
from collections.abc import Coroutine
from datetime import datetime
from typing import TYPE_CHECKING, Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.helpers.event import (
    EventStateChangedData,
    async_track_state_change_event,
)

if TYPE_CHECKING:
    from ...coordinator import MaintenanceCoordinator
    from ...sensor import MaintenanceSensor

from ...const import (
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    UNAVAILABLE_STATES,
)
from ...helpers.managed_timer import ManagedTimer

_LOGGER = logging.getLogger(__name__)

# The initial-evaluation retry: an entity that is unknown/unavailable at
# setup is re-checked this often, this many times, before the state-change
# listener alone is trusted to catch its recovery (issue #1 family).
RETRY_DELAY_SECONDS = 30.0
RETRY_MAX_ATTEMPTS = 10


class BaseTrigger(ABC):
    # Class-level defaults: subclasses built without __init__ in tests still
    # carry the flags (see the instance comments in __init__).
    _recovered_since_reset: bool = True
    _evaluated_once: bool = True
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
        # Bug audit 2026-09-12: after a completion resets the trigger, the
        # sensor may still read beyond the threshold (the user tapped Complete
        # before refilling). Such a re-activation is NOT a new edge and must
        # not lift the coordinator's post-completion cooldown - only an
        # activation after the value was seen on the other side is.
        self._recovered_since_reset = True
        # False until the first real evaluation of this instance — the one
        # that runs after every restart and every entry reload (each task
        # edit reloads). See _evaluate_and_update.
        self._evaluated_once = False
        self._current_value: float | None = None
        self._unsub_listener: CALLBACK_TYPE | None = None
        # One timer per purpose (a retry and a subclass's for/hold window can
        # be pending at the same time); the tasks a trigger spawns (history
        # entry, refresh, persist) are tracked here and cancelled at teardown.
        self._retry_timer = ManagedTimer(hass, f"{type(self).__name__}:{self.entity_id}:retry")
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
                "Trigger entity %s not yet available — listener registered, waiting for entity to appear",
                self.entity_id,
            )
            # Register listener anyway so we catch the entity appearing
            self._unsub_listener = async_track_state_change_event(self.hass, [self.entity_id], self._handle_state_change_event)
            return

        # Register state change listener
        self._unsub_listener = async_track_state_change_event(self.hass, [self.entity_id], self._handle_state_change_event)

        # If state is unknown/unavailable, schedule a retry
        if state.state in UNAVAILABLE_STATES:
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
        """Schedule a retry of the initial evaluation (30 s, capped).

        Before the ManagedTimer this was a single hard-coded shot: an entity
        still unavailable 30 s after setup was never re-checked by the timer
        again (the state-change listener catches a LATER recovery, but not
        one that happened while we were not looking). Now it re-arms until
        the entity reports or the budget is spent.
        """
        self._retry_timer.retry(self._retry_initial_evaluation, delay=RETRY_DELAY_SECONDS, max_attempts=RETRY_MAX_ATTEMPTS)

    @callback
    def _retry_initial_evaluation(self, _now: datetime) -> None:
        """Re-check entity state after a delay."""
        state = self.hass.states.get(self.entity_id)
        if state is None or state.state in UNAVAILABLE_STATES:
            _LOGGER.debug(
                "Trigger entity %s still %s after retry",
                self.entity_id,
                state.state if state else "missing",
            )
            self._schedule_retry()
            return
        self._retry_timer.reset_retries()
        value = self._get_numeric_value(state)
        if value is not None:
            self._current_value = value
            self._evaluate_and_update(value)
            _LOGGER.info(
                "Trigger entity %s recovered after retry (value=%s)",
                self.entity_id,
                value,
            )

    def _track(self, coro: Coroutine[Any, Any, Any], *, cancel_on_close: bool = True) -> None:
        """Spawn a fire-and-forget task the trigger owns (cancelled at
        teardown unless it must land regardless — see the auto-complete)."""
        self._retry_timer.track_task(coro, cancel_on_close=cancel_on_close)

    async def async_teardown(self) -> None:
        """Remove the trigger listener, the retry timer and owned tasks."""
        self._retry_timer.close()
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

        # Handle unavailable/unknown with log-once pattern.
        # A transient unavailable/unknown carries no measurement, so we treat
        # it as "no new data" and do NOT deactivate an active trigger here.
        # Deactivating on a blip dropped real (alarm) triggers and, combined
        # with the threshold for-minutes debounce latch, left tasks stuck at
        # OK once the value returned below threshold. A genuinely missing
        # trigger entity is surfaced via the missing_trigger_entity repair
        # flow instead. (Numeric-only triggers: any non-numeric value below
        # is likewise ignored via the _get_numeric_value None check.)
        if new_state.state in UNAVAILABLE_STATES:
            if not self._logged_unavailable:
                _LOGGER.warning(
                    "Trigger entity %s became %s — keeping last trigger state",
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
        initial = not self._evaluated_once
        self._evaluated_once = True
        if not is_triggered:
            self._recovered_since_reset = True

        if is_triggered and not was_triggered:
            if initial and self._already_announced():
                self._restore_activation(value)
            else:
                self._on_trigger_activated(value)
        elif not is_triggered and was_triggered:
            self._on_trigger_deactivated(value)

    def _already_announced(self) -> bool:
        """Whether the task's activation is already on record (the coordinator
        reads its history). Looked up on the coordinator's CLASS: a mocked
        coordinator (unit tests) and the compound condition proxy, which only
        delegates per instance, have none and keep announcing as before."""
        check = getattr(type(self._coordinator), "trigger_already_announced", None)
        return callable(check) and check(self._coordinator, self._task_id) is True

    def _restore_activation(self, value: float) -> None:
        """Re-latch an activation that was announced before this instance
        existed — repaint only: no second TRIGGERED history entry, no second
        activation event. A threshold/counter/runtime task still over its
        limit wrote both again on every restart and every task edit (entry
        reload), while the state-change latch already only repainted (bug
        audit 2026-09-26, SCH-10)."""
        _LOGGER.debug("Trigger %s restored as active (already announced): %s", self.entity_id, value)
        self.entity.async_update_trigger_state(
            is_triggered=True,
            current_value=value,
            trigger_entity_id=self.entity_id,
        )
        self._request_coordinator_refresh()

    @abstractmethod
    def evaluate(self, value: float) -> bool:
        """Evaluate whether the trigger condition is met.

        Must be implemented by subclasses.
        Returns True if trigger should be active.
        """


    def _request_coordinator_refresh(self) -> None:
        """#175: a trigger flip must reach the coordinator now, not on the
        next 5-minute tick. Notifications (and the ``maintenance_supporter_
        notification`` event) are decided in the coordinator's refresh from the
        status change, so without this the reminder trailed the flip by up to a
        full update interval — 30 s once, 4 min the next time. Debounced on
        purpose (HA's ten-second window): a noisy sensor must not recompute the
        object on every state change; user actions use async_refresh_now."""
        self._track(self._coordinator.async_request_refresh())

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
        self._track(self._coordinator.async_add_trigger_history_entry(self._task_id, trigger_value=value))
        self._coordinator.note_trigger_edge(self._task_id, recovered=self._recovered_since_reset)
        self._request_coordinator_refresh()

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

        # Update entity state — it answers whether the TASK recovered (all
        # entities of "any" clear, the "all" set broken up), not just this
        # entity; None (a proxy entity) keeps the per-entity meaning.
        task_recovered = self.entity.async_update_trigger_state(
            is_triggered=False,
            current_value=value,
            trigger_entity_id=self.entity_id,
        )

        self._request_coordinator_refresh()

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

        # Opt-in (#53): the sensor recovering IS the maintenance being done
        # (salt refilled, filter swapped) — record the completion so
        # last_performed and the time-between-services statistics stay real.
        # This hook only fires on the evaluate path: a manual complete/skip
        # resets the trigger via reset(), which never lands here, so the
        # manual flow cannot double-record.
        # Only on the task's own recovery (bug audit 2026-09-26, SCH-5): one of
        # several sensors clearing while another still holds the task — or an
        # "all" task whose set was never complete — is not the work being done.
        if self.config.get("auto_complete_on_recovery") and task_recovered is not False:
            # cancel_on_close=False: a completion in flight must land even
            # when the recovery coincides with a reload of the entry.
            self._track(self._coordinator.async_auto_complete_on_recovery(self._task_id, value), cancel_on_close=False)

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
        self._recovered_since_reset = False
