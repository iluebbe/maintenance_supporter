"""State change trigger for maintenance tasks."""

from __future__ import annotations

import logging
from datetime import datetime
from typing import TYPE_CHECKING, Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers.event import (
    EventStateChangedData,
    async_call_later,
    async_track_state_change_event,
)
from homeassistant.util import dt as dt_util

if TYPE_CHECKING:
    from ...sensor import MaintenanceSensor

from .base_trigger import BaseTrigger

_LOGGER = logging.getLogger(__name__)


def _norm_state(value: str | None) -> str | None:
    """Case/whitespace-insensitive state form for from/to comparisons."""
    return value.strip().casefold() if isinstance(value, str) else value


class StateChangeTrigger(BaseTrigger):
    """Trigger that activates after counting state transitions.

    Counts transitions matching from_state -> to_state pattern.
    Triggers when count reaches target_changes.
    """

    # Setup saw no usable state -> reconcile on the first real one (#131).
    # Class default so hand-built test instances inherit it.
    _needs_latch_reconcile: bool = False
    # #136 hold-window state — class defaults for the same reason.
    _for_minutes: int = 0
    _pending_state: str | None = None
    _pending_since: str | None = None
    _interrupted_pending: str | None = None
    _timer_cancel: CALLBACK_TYPE | None = None

    def __init__(
        self,
        hass: HomeAssistant,
        entity: MaintenanceSensor,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize state change trigger."""
        super().__init__(hass, entity, trigger_config)

        # Case-insensitive matching, like RuntimeTrigger's on_states: the
        # options flow lowercases these on save while the panel keeps the
        # user's casing, and HA states themselves can be capitalized
        # (input_select "Home") — normalizing BOTH sides at compare time is
        # the only variant that works for every surface combination.
        self._from_state: str | None = _norm_state(trigger_config.get("trigger_from_state"))
        self._to_state: str | None = _norm_state(trigger_config.get("trigger_to_state"))
        self._target_changes: int = trigger_config.get("trigger_target_changes", 1)
        # Restore persisted change count from config, default to 0
        self._change_count: int = trigger_config.get("trigger_change_count", 0)
        self._current_value = float(self._change_count)
        self._last_state: str | None = None
        self._needs_latch_reconcile = False

        # #136: a transition only counts once the NEW state has HELD for this
        # long. 0 (the default) counts immediately — deliberately, because some
        # sensors express a real event only as a brief pulse; the filter is an
        # opt-in for the flappy ones. Applies to BOTH modes: the single-shot
        # alarm latch (target_changes == 1, the reporter's vacuum problem
        # sensors glitching for seconds at night) and the cycle counter
        # (a flicker is not a wash cycle).
        self._for_minutes: int = int(trigger_config.get("trigger_for_minutes", 0) or 0)
        self._timer_cancel: CALLBACK_TYPE | None = None
        # A window cut short by an unavailability blip — the only case that
        # may re-open on recovery (see _handle_state_transition).
        self._interrupted_pending: str | None = None
        # The state currently waiting out the hold window (None = no window).
        self._pending_state: str | None = None
        self._pending_since: str | None = None
        # Persisted pending window from before a restart (consumed in setup).
        self._restored_pending_state: str | None = trigger_config.get("trigger_state_pending_state")
        self._restored_pending_dt: datetime | None = None
        raw_since = trigger_config.get("trigger_state_pending_since")
        if raw_since:
            try:
                parsed = datetime.fromisoformat(raw_since)
                if parsed.tzinfo is None:
                    from datetime import UTC

                    parsed = parsed.replace(tzinfo=UTC)
                self._restored_pending_dt = parsed
            except (ValueError, TypeError):
                self._restored_pending_state = None

    async def async_setup(self) -> None:
        """Set up state change trigger.

        IMPORTANT: The listener is ALWAYS registered, even when the entity does
        not exist yet.  HA fires a state_change event when an entity first
        appears (old_state=None), so the trigger will self-heal automatically.
        """
        state = self.hass.states.get(self.entity_id)
        if state is None or state.state in ("unavailable", "unknown"):
            # No USABLE state yet — the #131 family: trigger setup races both
            # the entity's registration AND its device readiness (a Zigbee /
            # Z-Wave problem sensor restores as unavailable long before it
            # reports). "unavailable" must never read as "recovered" — it
            # used to quietly clear a single-shot latch right here. Register
            # the listener and defer the latch reconciliation to the first
            # real state.
            self._needs_latch_reconcile = True
            _LOGGER.info(
                "Trigger entity %s not ready at setup (state=%s) — listener registered, latch check deferred",
                self.entity_id,
                state.state if state else "missing",
            )
            self._unsub_listener = async_track_state_change_event(self.hass, [self.entity_id], self._handle_state_transition)
            return

        self._last_state = state.state
        self._reconcile_persisted_latch(state.state)
        self._resume_pending_window(state.state)

        # Register state change listener (override base: we handle events differently)
        self._unsub_listener = async_track_state_change_event(self.hass, [self.entity_id], self._handle_state_transition)

        _LOGGER.debug(
            "State change trigger setup: %s (target=%d, count=%d, from=%s, to=%s)",
            self.entity_id,
            self._target_changes,
            self._change_count,
            self._from_state,
            self._to_state,
        )

    def _reconcile_persisted_latch(self, live_state: str) -> None:
        """Align the persisted change-count latch with the LIVE entity state.

        Runs at setup when the entity already exists, and again when the
        entity first APPEARS (issue #131): trigger setup races HA's state
        restoration, so a source that restores later kept a stale latch —
        a problem sensor still on read OK, and a single-shot alarm that had
        recovered while we were down stayed triggered.

        A single-shot state alarm (target_changes == 1) whose entity is no
        longer in its alert state is cleared QUIETLY — the recovery
        transition was never observed, so we must NOT auto-complete for it
        here (that path only runs on a live off event, guarded against
        double-count). Otherwise the latch is restored and repainted.
        """
        if self._change_count < self._target_changes:
            return
        if self._to_state is not None and self._target_changes == 1 and _norm_state(live_state) != self._to_state:
            self._change_count = 0
            self._current_value = 0.0
            self._triggered = False
            self._persist_runtime_soon()
            self.entity.async_update_trigger_state(
                is_triggered=False,
                current_value=0.0,
                trigger_entity_id=self.entity_id,
            )
        else:
            self._triggered = True
            self.entity.async_update_trigger_state(
                is_triggered=True,
                current_value=float(self._change_count),
                trigger_entity_id=self.entity_id,
            )

    def _resume_pending_window(self, live_state: str) -> None:
        """Resume (or discard) a hold window persisted before a restart (#136).

        Mirrors the threshold trigger's exceeded-since recovery: the wall-clock
        anchor survives the restart, so a state that kept holding through the
        downtime commits immediately once the window has fully elapsed, and
        otherwise the timer resumes with the remaining duration. A live state
        that no longer matches the anchored one discards the window.
        """
        restored_state, restored_dt = self._restored_pending_state, self._restored_pending_dt
        self._restored_pending_state = None
        self._restored_pending_dt = None
        if self._for_minutes <= 0 or restored_dt is None or restored_state is None or self._triggered:
            return
        if _norm_state(live_state) != _norm_state(restored_state):
            self._persist_runtime_soon()
            return
        elapsed = (dt_util.utcnow() - restored_dt).total_seconds()
        if elapsed >= self._for_minutes * 60:
            _LOGGER.debug(
                "State hold recovery: elapsed %.0fs >= %ds, committing immediately: %s",
                elapsed,
                self._for_minutes * 60,
                self.entity_id,
            )
            self._commit_transition(live_state, None)
            return
        self._pending_state = restored_state
        self._pending_since = restored_dt.isoformat()
        remaining = max(self._for_minutes * 60 - elapsed, 0)
        _LOGGER.debug("State hold recovery: %.0fs remaining: %s", remaining, self.entity_id)
        self._start_hold_timer(remaining_seconds=remaining)

    def _start_pending(self, new_val: str) -> None:
        """(Re)open the hold window for *new_val* — commits when the timer fires."""
        self._cancel_timer()
        self._pending_state = new_val
        self._pending_since = dt_util.utcnow().isoformat()
        self._persist_runtime_soon()
        self._start_hold_timer()

    def _start_hold_timer(self, remaining_seconds: float | None = None) -> None:
        self._cancel_timer()
        duration = remaining_seconds if remaining_seconds is not None else self._for_minutes * 60

        @callback
        def _timer_fired(_now: datetime) -> None:
            pending = self._pending_state
            self._pending_state = None
            self._pending_since = None
            self._timer_cancel = None
            if pending is None:
                return
            # Safety net: only commit while the state still holds.
            live = self.hass.states.get(self.entity_id)
            if live is None or _norm_state(live.state) != _norm_state(pending):
                self._persist_runtime_soon()
                return
            _LOGGER.debug(
                "State hold timer fired: %s held %r for %d min",
                self.entity_id,
                pending,
                self._for_minutes,
            )
            self._commit_transition(pending, None)

        self._timer_cancel = async_call_later(self.hass, duration, _timer_fired)

    def _clear_pending(self) -> None:
        """Abandon the hold window (state moved on before it elapsed)."""
        if self._pending_state is None and self._timer_cancel is None:
            return
        self._cancel_timer()
        self._pending_state = None
        self._pending_since = None
        self._persist_runtime_soon()

    def _cancel_timer(self) -> None:
        if self._timer_cancel is not None:
            self._timer_cancel()
            self._timer_cancel = None

    def _commit_transition(self, new_val: str, old_val: str | None) -> None:
        """Count one matching transition (immediately, or after its hold)."""
        self._pending_state = None
        self._pending_since = None
        self._change_count += 1
        self._current_value = float(self._change_count)
        self._persist_runtime_soon()
        _LOGGER.debug(
            "State change counted: %s (%s -> %s) count=%d/%d",
            self.entity_id,
            old_val if old_val is not None else "<held>",
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

    @callback
    def _handle_state_transition(self, event: Event[EventStateChangedData]) -> None:
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
            # Capture initial state but don't count as a transition — and
            # reconcile the persisted latch against it (issue #131): when the
            # entity restores AFTER our setup, this appearance is the first
            # moment the latch can be checked against reality.
            if new_val not in ("unavailable", "unknown"):
                self._needs_latch_reconcile = False
                self._last_state = new_val
                self._reconcile_persisted_latch(new_val)
            return

        old_val = old_state.state

        # Handle unavailable/unknown with log-once pattern
        if new_val in ("unavailable", "unknown"):
            # #136: an unavailability blip is not "the state held" — abandon
            # the hold window, but REMEMBER it: only a window that was
            # actually running may re-open when the entity comes back (else a
            # blip on a long-settled state would count a phantom transition).
            if self._pending_state is not None:
                self._interrupted_pending = self._pending_state
            self._clear_pending()
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
            # #136: a window was running when the blip hit and the state came
            # back unchanged — restart it (fresh clock; the normal transition
            # path below cannot, because effective_old equals new_val here).
            interrupted = self._interrupted_pending
            self._interrupted_pending = None
            if (
                self._for_minutes > 0
                and not self._triggered
                and self._pending_state is None
                and interrupted is not None
                and _norm_state(new_val) == _norm_state(interrupted)
            ):
                self._start_pending(new_val)

        # First REAL state after a setup that saw none/unavailable (#131
        # family): reconcile the persisted latch against it instead of
        # counting the restore as a transition. Mid-run unavailability
        # glitches never set the flag, so their observed recovery still goes
        # through the normal transition/auto-complete path below.
        if self._needs_latch_reconcile:
            self._needs_latch_reconcile = False
            self._last_state = new_val
            self._reconcile_persisted_latch(new_val)
            return

        # Use _last_state as fallback when old_val is unavailable/unknown
        effective_old = old_val
        if old_val in ("unavailable", "unknown") and self._last_state is not None:
            effective_old = self._last_state

        # #136: any real state movement means the previous state did NOT hold
        # — abandon a running hold window (a matching transition right below
        # opens a fresh one) and invalidate a blip-interruption marker.
        if effective_old != new_val:
            self._interrupted_pending = None
            self._clear_pending()

        # Check if transition matches pattern
        matches = True
        if self._from_state is not None and _norm_state(effective_old) != self._from_state:
            matches = False
        if self._to_state is not None and _norm_state(new_val) != self._to_state:
            matches = False

        if matches and effective_old != new_val:
            if self._for_minutes > 0:
                # #136: the transition only counts once new_val has held.
                self._start_pending(new_val)
            else:
                self._commit_transition(new_val, old_val)

        # Latch recovery: a single-shot state alarm (target_changes == 1 — an
        # adopted problem sensor or an appliance event) clears when the entity
        # leaves its alert state. Reset the counter so the next occurrence can
        # fire again, and run the deactivation path — which auto-completes on
        # recovery when opted in. Multi-count triggers keep accumulating and
        # only reset on manual completion, so they are untouched here.
        elif (
            self._to_state is not None
            and self._target_changes == 1
            and self._triggered
            and _norm_state(new_val) != self._to_state
        ):
            self._change_count = 0
            self._current_value = 0.0
            self._persist_runtime_soon()
            self._triggered = False
            self._on_trigger_deactivated(0.0)

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
        self._current_value = 0.0
        self._persist_runtime_soon()
        _LOGGER.debug("State change counter reset: %s", self.entity_id)

    def _persist_runtime_soon(self) -> None:
        if self.hass.is_running:
            self.hass.async_create_task(self._persist_runtime())

    async def _persist_runtime(self) -> None:
        """Persist the full runtime dict (count + hold window) to the Store.

        Always the COMPLETE dict: set_trigger_runtime replaces per-entity
        state wholesale, so a partial write would drop the other half.
        """
        data: dict[str, Any] = {"change_count": self._change_count}
        if self._pending_since is not None and self._pending_state is not None:
            data["pending_since"] = self._pending_since
            data["pending_state"] = self._pending_state
        await self._coordinator.async_persist_trigger_runtime(
            self._task_id,
            data,
            entity_id=self.entity_id,
        )

    async def async_teardown(self) -> None:
        """Clean up the hold timer on teardown."""
        self._cancel_timer()
        await super().async_teardown()

    def reset(self) -> None:
        """Reset trigger, counter and any running hold window."""
        super().reset()
        self._cancel_timer()
        self._pending_state = None
        self._pending_since = None
        self._interrupted_pending = None
        self.reset_count()
