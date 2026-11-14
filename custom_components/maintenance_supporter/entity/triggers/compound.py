"""Compound trigger — combines multiple trigger conditions with AND/OR logic."""

from __future__ import annotations

import logging
from collections.abc import Callable
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util

if TYPE_CHECKING:
    from .base_trigger import TriggerCoordinator, TriggerHost

from ...const import (
    CONF_COMPOUND_CONDITIONS,
    CONF_COMPOUND_LOGIC,
    EVENT_TRIGGER_ACTIVATED,
    TRIGGER_COMPLETION_COOLDOWN_SECONDS,
    UNAVAILABLE_STATES,
)
from ...helpers.managed_timer import ManagedTimer
from .base_trigger import BaseTrigger

_LOGGER = logging.getLogger(__name__)


class CompoundSubEntity:
    """Proxy entity for a single compound condition.

    Each condition creates its own sub-triggers that call back into this
    proxy.  The proxy aggregates per-entity states within the condition
    (using the condition's ``entity_logic``), then notifies the parent
    ``CompoundTrigger`` of the condition-level result.
    """

    # A condition's sub-trigger only reports to this proxy: the task-level
    # side effects (the trigger events, the cooldown edge, the refresh) belong
    # to the compound — BaseTrigger checks this flag.
    is_compound_condition = True

    def __init__(
        self,
        parent: CompoundTrigger,
        condition_idx: int,
        condition_config: dict[str, Any],
    ) -> None:
        """Initialize the sub-entity proxy."""
        self._parent = parent
        self._condition_idx = condition_idx
        self._condition_config = condition_config
        # Pre-seed a MULTI-entity condition with every entity at False, so
        # `entity_logic == "all"` quantifies over EVERY entity, not just the ones
        # that have already transitioned (an entity that never toggles must keep
        # the AND from firing). Single-entity conditions stay empty and use the
        # is_triggered fallback in async_update_trigger_state. (H1)
        self._per_entity_states: dict[str, bool] = {}
        self._per_entity_values: dict[str, float | None] = {}
        self.reset()
        self._entity_logic = condition_config.get("entity_logic", "any")
        # Mirror attributes the real entity exposes for trigger access (the
        # entity_id is read live, see the property).
        self._task_id: str = parent.entity._task_id
        # Replaced by the condition's _CompoundCoordinatorProxy right after.
        self.coordinator: TriggerCoordinator = parent.entity.coordinator

    def reset(self) -> None:
        """Forget what each entity last reported (seeded as above). The
        compound's reset() calls this with its sub-triggers' — the map kept
        the pre-completion True of every entity, so after "Complete" one
        entity crossing again made an "all" condition true while the others
        had long recovered, or a recovered one never cleared it (bug audit
        2026-10-16, T1)."""
        eids = self._condition_config.get("entity_ids") or []
        self._per_entity_states = {eid: False for eid in eids} if len(eids) > 1 else {}
        self._per_entity_values = {}

    @property
    def entity_id(self) -> str:
        """The task sensor's entity_id, read live. From Home Assistant 2026.11 a
        rename changes the sensor in place and its triggers keep running, so a
        copy taken here would name the old entity until the next reload (#214)."""
        return self._parent.entity.entity_id

    @callback
    def async_update_trigger_state(
        self,
        is_triggered: bool,
        current_value: float | None = None,
        trigger_entity_id: str | None = None,
    ) -> None:
        """Receive trigger state from a sub-trigger."""
        if trigger_entity_id is not None:
            self._per_entity_states[trigger_entity_id] = is_triggered
            if current_value is not None:
                self._per_entity_values[trigger_entity_id] = current_value

        # Aggregate within this condition
        if not self._per_entity_states:
            aggregated = is_triggered
        elif self._entity_logic == "all":
            aggregated = bool(self._per_entity_states) and all(self._per_entity_states.values())
        else:  # "any"
            aggregated = any(self._per_entity_states.values())

        self._parent._on_condition_changed(self._condition_idx, aggregated)

    @callback
    def async_write_ha_state(self) -> None:
        """No-op — the compound trigger manages state through the real entity."""


class _CompoundCoordinatorProxy:
    """Proxy coordinator that routes persistence to the correct condition index.

    Wraps the real coordinator so that ``async_persist_trigger_runtime``
    stores data under ``_trigger_state.conditions[idx][entity_id]``.
    """

    def __init__(
        self,
        real_coordinator: TriggerCoordinator,
        condition_idx: int,
        on_recovered: Callable[[int], None] | None = None,
    ) -> None:
        """Initialize the proxy."""
        self._real = real_coordinator
        self._condition_idx = condition_idx
        self._on_recovered = on_recovered

    def __getattr__(self, name: str) -> Any:
        """Delegate all other attributes to the real coordinator."""
        return getattr(self._real, name)

    async def async_persist_trigger_runtime(
        self,
        task_id: str,
        runtime_data: dict[str, Any],
        entity_id: str | None = None,
        *,
        immediate: bool = False,
    ) -> None:
        """Persist under trigger_runtime as a per-condition compound key.

        The coordinator stores under whatever key it is given;
        merge_task_data reshapes these ``_compound_<idx>[_<entity_id>]`` keys
        back into ``_trigger_state["conditions"][idx]`` on read.
        """
        compound_key = f"_compound_{self._condition_idx}"
        if entity_id is not None:
            compound_key = f"_compound_{self._condition_idx}_{entity_id}"
        await self._real.async_persist_trigger_runtime(task_id, runtime_data, compound_key, immediate=immediate)

    # A condition's sub-trigger is not the task's trigger: only the compound
    # decides when the TASK activates. Delegated to the real coordinator,
    # every sub-trigger activation wrote its own TRIGGERED history entry and
    # lifted the post-completion cooldown — and, since this proxy has no
    # trigger_already_announced, it did so again on every reload and restart
    # (bug audit 2026-09-27, R SCH-10). The compound records the activation.

    async def async_add_trigger_history_entry(
        self,
        task_id: str,
        trigger_value: float | None = None,
        trigger_change: dict[str, str] | None = None,
    ) -> None:
        """No-op for a condition — see the class comment above."""

    def note_trigger_edge(self, task_id: str, *, recovered: bool = True) -> None:
        """No-op for a condition — the compound reports its own edge."""

    def note_trigger_recovered(self, task_id: str) -> None:
        """A sub-trigger of this condition saw its sensor back on the normal
        side after the completion. Whether the TASK's rule has recovered is
        the compound's call, so it goes there, never to the coordinator: one
        clear condition of an OR rule that another condition still holds is
        no recovery."""
        if self._on_recovered is not None:
            self._on_recovered(self._condition_idx)

    async def async_request_refresh(self) -> None:
        """Delegate to the object's coordinator."""
        await self._real.async_request_refresh()

    async def async_auto_complete_on_recovery(self, task_id: str, trigger_value: float | None) -> None:
        """Delegate to the object's coordinator."""
        await self._real.async_auto_complete_on_recovery(task_id, trigger_value)


class CompoundTrigger(BaseTrigger):
    """Compound trigger that combines multiple conditions with AND/OR logic.

    Two-level aggregation:
    1. Within each condition: multi-entity ``entity_logic`` (any/all)
    2. Across conditions: ``compound_logic`` (AND/OR)
    """

    # Class-level defaults for instances built without __init__ (tests), like
    # BaseTrigger's flags; __init__ sets the real starting values.
    _setting_up: bool = False
    _settled: bool = True
    _cooldown_timer: ManagedTimer | None = None
    _held_at_reset: frozenset[int] = frozenset()
    _clear_since_reset: dict[int, int] | None = None
    _relearning: bool = False

    def __init__(
        self,
        hass: HomeAssistant,
        entity: TriggerHost,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize the compound trigger."""
        # BaseTrigger expects entity_id; compound has no single monitored entity
        config_with_id = dict(trigger_config)
        config_with_id.setdefault("entity_id", "")
        super().__init__(hass, entity, config_with_id)

        # `or "AND"` (not just the .get default) so a present-but-null value in
        # hand-edited config doesn't crash on .upper().
        self._compound_logic: str = (trigger_config.get(CONF_COMPOUND_LOGIC) or "AND").upper()
        self._conditions: list[dict[str, Any]] = trigger_config.get(CONF_COMPOUND_CONDITIONS) or []
        self._condition_states: list[bool] = [False] * len(self._conditions)
        self._sub_triggers: list[list[BaseTrigger]] = []
        self._sub_entities: list[CompoundSubEntity] = []
        # The compound's counterpart of BaseTrigger._evaluated_once (bug
        # audit 2026-09-27, R SCH-10): an activation is a RESTORE of the
        # episode on record — repaint only — while the sub-triggers run their
        # initial evaluations (async_setup), and until this instance has seen
        # the compound inactive with every condition entity reporting (late
        # entities after a restart evaluate on their first state event). An
        # activation after that is a new edge and is announced.
        self._setting_up = False
        self._settled = False
        # Re-latches an activation the post-completion cooldown held back.
        self._cooldown_timer = ManagedTimer(hass, f"CompoundTrigger:{self._task_id}:cooldown")
        # Since the last completion: the conditions that still held at it, and
        # per condition how many of its sub-triggers have been seen on the
        # normal side (each tells once per reset) — see _on_condition_recovered.
        self._held_at_reset = frozenset()
        self._clear_since_reset = {}

    @property
    def condition_states(self) -> list[bool]:
        """Return the current state of each condition."""
        return list(self._condition_states)

    async def async_setup(self) -> None:
        """Set up all sub-triggers for each condition."""
        trigger_state = self.config.get("_trigger_state", {})
        conditions_state = trigger_state.get("conditions", [])

        self._setting_up = True
        try:
            await self._async_setup_conditions(conditions_state)
        finally:
            self._setting_up = False
        self._maybe_settle()

        _LOGGER.debug(
            "Compound trigger setup: %d conditions with %s logic for %s",
            len(self._conditions),
            self._compound_logic,
            self.entity.entity_id,
        )

    async def _async_setup_conditions(self, conditions_state: list[Any]) -> None:
        """Build and set up every condition's sub-triggers (their initial
        evaluations run here and may already activate the compound)."""
        from . import create_triggers

        for idx, condition in enumerate(self._conditions):
            sub_entity = CompoundSubEntity(self, idx, condition)
            self._sub_entities.append(sub_entity)

            # Build per-condition config with its persisted state
            cond_config = dict(condition)
            if idx < len(conditions_state):
                cond_state = conditions_state[idx]
                if cond_state:
                    cond_config["_trigger_state"] = cond_state

            # Wrap the real coordinator with a proxy for persistence
            proxy_coordinator = _CompoundCoordinatorProxy(self._coordinator, idx, self._on_condition_recovered)
            sub_entity.coordinator = proxy_coordinator

            sub_triggers = create_triggers(self.hass, sub_entity, cond_config)
            self._sub_triggers.append(sub_triggers)

            for trigger in sub_triggers:
                await trigger.async_setup()

    def _all_conditions_reporting(self) -> bool:
        """Every condition entity has a usable state (its sub-trigger has
        had the chance to evaluate)."""
        for trigger_list in self._sub_triggers:
            for trigger in trigger_list:
                state = self.hass.states.get(trigger.entity_id)
                if state is None or state.state in UNAVAILABLE_STATES:
                    return False
        return True

    def _maybe_settle(self) -> None:
        """Seen inactive with full information: later activations are edges."""
        if not self._settled and not self._setting_up and not self._triggered and self._all_conditions_reporting():
            self._settled = True
            self._release_seed()

    def settle(self) -> None:
        """Settle now if every condition entity reports: a late entity that
        came back on the normal side changed no condition, so nothing called
        :meth:`_maybe_settle` (the coordinator asks while it holds a seed)."""
        self._maybe_settle()

    def _release_seed(self) -> None:
        """The first refresh after a restart or a reload kept the activation
        on record (MaintenanceCoordinator._evaluate_trigger_fallback). Seen
        inactive with every condition reporting, it ended while nothing
        watched: withdrawn quietly, like a latch the state rule finds
        recovered at setup (no event, no completion). Class lookup like
        :meth:`_already_announced`."""
        check = getattr(type(self._coordinator), "holds_trigger_seed", None)
        if callable(check) and check(self._coordinator, self._task_id) is True:
            self.entity.async_update_trigger_state(is_triggered=False)

    async def async_teardown(self) -> None:
        """Tear down all sub-triggers."""
        for trigger_list in self._sub_triggers:
            for trigger in trigger_list:
                await trigger.async_teardown()
        self._sub_triggers = []
        self._sub_entities = []
        self._condition_states = [False] * len(self._conditions)
        if self._cooldown_timer is not None:
            self._cooldown_timer.close()
        await super().async_teardown()

    def evaluate(self, value: float) -> bool:
        """Evaluate compound condition (aggregation of condition states)."""
        if self._compound_logic == "AND":
            return bool(self._condition_states) and all(self._condition_states)
        return any(self._condition_states)  # OR

    def reset(self) -> None:
        """Reset all sub-triggers (and what their conditions aggregate)."""
        held = frozenset(i for i, active in enumerate(self._condition_states) if active)
        super().reset()
        if self._cooldown_timer is not None:
            self._cooldown_timer.cancel()
        self._held_at_reset = held
        self._clear_since_reset = {}
        self._condition_states = [False] * len(self._conditions)
        for sub_entity in self._sub_entities:
            sub_entity.reset()
        for trigger_list in self._sub_triggers:
            for trigger in trigger_list:
                trigger.reset()
        self._relearn_conditions()

    def _relearn_conditions(self) -> None:
        """Right after a reset, read which conditions still hold from the live
        readings, quietly: a level that has not moved is no new edge. The
        reset forgot them, and only a condition's next state event told it
        again, so an AND rule completed while one sensor stayed high kept
        quiet when the other one crossed later: it read that sensor as fine
        until it changed (faketime year, 2026-11-01). When the whole rule
        still holds, it comes back once the cooldown is over, as a sensor
        rule re-latches on the coordinator's sweep."""
        self._relearning = True
        try:
            for trigger_list in self._sub_triggers:
                for trigger in trigger_list:
                    trigger.evaluate_live()
        finally:
            self._relearning = False
        if self._conditions and self.evaluate(0.0) and self._cooldown_timer is not None:
            # From the reset, not from the coordinator's cooldown: a completion
            # records that only after the reset ran (_on_cooldown_over waits
            # for it), and a skip has the same window without the cooldown.
            self._cooldown_timer.schedule_at(
                dt_util.utcnow() + timedelta(seconds=TRIGGER_COMPLETION_COOLDOWN_SECONDS + 1), self._on_cooldown_over
            )

    @callback
    def _on_condition_recovered(self, condition_idx: int) -> None:
        """A sub-trigger of a condition saw its sensor back on the normal side
        after the completion (it tells once per reset, just before it marks
        itself recovered). The rule has recovered once it is clear: for OR,
        once the conditions that still held at the completion are; an AND
        rule is clear as soon as any of its conditions is, one that held or
        one that never did — a condition being clear when all its sensors are
        (entity_logic "any") or one is ("all").
        Then it tells the coordinator, as a plain sensor rule does, so its next
        activation is a new problem instead of being held for the cooldown as
        the one the user completed before fixing. Its sub-triggers' notes went
        to the condition proxy, which dropped them, and a reset had already
        taken the compound's own falling edge: a problem back within ten
        minutes of a cleared one was announced late, without a history entry
        (faketime year, 2026-11-01)."""
        if self._recovered_since_reset or not 0 <= condition_idx < len(self._conditions):
            return
        counts = dict(self._clear_since_reset or {})
        counts[condition_idx] = counts.get(condition_idx, 0) + 1
        self._clear_since_reset = counts

        def clear(idx: int) -> bool:
            seen = counts.get(idx, 0)
            if self._conditions[idx].get("entity_logic", "any") == "all":
                return seen >= 1
            return seen >= max(1, len(self._sub_triggers[idx]) if idx < len(self._sub_triggers) else 1)

        held = self._held_at_reset
        if not held:
            recovered = True  # clear at the completion: any condition seen clear is the evidence
        elif self._compound_logic == "AND":
            recovered = any(clear(i) for i in range(len(self._conditions)))
        else:
            recovered = all(clear(i) for i in held)
        if recovered:
            self._recovered_since_reset = True
            self._note_recovered()

    @callback
    def _on_condition_changed(self, condition_idx: int, is_triggered: bool) -> None:
        """Handle a condition state change and re-aggregate."""
        self._condition_states[condition_idx] = is_triggered
        if self._relearning:
            return  # what still holds after a reset, no edge (see _relearn_conditions)

        was_triggered = self._triggered
        if self._compound_logic == "AND":
            now_triggered = bool(self._condition_states) and all(self._condition_states)
        else:  # OR
            now_triggered = any(self._condition_states)

        self._triggered = now_triggered

        if now_triggered and not was_triggered:
            initial = self._setting_up or not self._settled
            if initial and self._in_completion_cooldown():
                self._recovered_since_reset = False  # see BaseTrigger._evaluate_and_update
            if initial and self._already_announced():
                self._restore_activation(0.0)
            else:
                self._on_trigger_activated(0.0)
            if not self._recovered_since_reset and self._in_completion_cooldown():
                self._relatch_after_cooldown()
        elif not now_triggered and was_triggered:
            # Seen clear since the completion: the next activation is a new
            # edge, as BaseTrigger records it. The compound never did, so a
            # problem back within ten minutes of a completion was taken for
            # the old one (bug audit 2026-10-17, T-4).
            if not self._recovered_since_reset:
                self._note_recovered()
            self._recovered_since_reset = True
            if self._cooldown_timer is not None:
                self._cooldown_timer.cancel()
            self._on_trigger_deactivated(0.0)
        self._maybe_settle()

    def _relatch_after_cooldown(self) -> None:
        """An activation right after a completion whose conditions never
        cleared is not applied while the cooldown lasts (the user completed
        before fixing it). The sensor triggers re-latch after it through the
        coordinator's fallback; a compound has none, so the task read OK while
        its conditions held, until the next reload (bug audit 2026-10-17,
        T-4). Repaint it once the cooldown is over."""
        if self._cooldown_timer is None:
            return
        left = getattr(type(self._coordinator), "completion_cooldown_left", None)
        seconds = left(self._coordinator, self._task_id) if callable(left) else TRIGGER_COMPLETION_COOLDOWN_SECONDS
        self._cooldown_timer.schedule_at(dt_util.utcnow() + timedelta(seconds=seconds + 1), self._on_cooldown_over)

    @callback
    def _on_cooldown_over(self, _now: datetime) -> None:
        if self._in_completion_cooldown():
            self._relatch_after_cooldown()  # it started after this timer was set
            return
        if self._triggered:
            self._restore_activation(0.0)
        elif self._conditions and self.evaluate(0.0):
            # Held from the completion through the cooldown, never seen clear:
            # the activation a sensor rule records on its first reading after
            # the reset (see _relearn_conditions).
            self._triggered = True
            self._on_trigger_activated(0.0)

    def _restore_activation(self, value: float) -> None:
        """Repaint an activation already on record (see ``_settled``) — no
        second history entry, no second event. Like the compound's own
        activation it carries no per-entity id or value."""
        _LOGGER.debug("Compound trigger restored as active (already announced): %s", self.entity.entity_id)
        self.entity.async_update_trigger_state(
            is_triggered=True,
            current_value=None,
            trigger_entity_id=None,
        )
        self._request_coordinator_refresh()

    def _on_trigger_activated(self, value: float) -> None:
        """Handle compound trigger activation."""
        _LOGGER.info(
            "Compound trigger activated: %s (conditions: %s, logic: %s)",
            self.entity.entity_id,
            self._condition_states,
            self._compound_logic,
        )
        self.entity.async_update_trigger_state(
            is_triggered=True,
            current_value=None,
            trigger_entity_id=None,
        )
        self._track(self._coordinator.async_add_trigger_history_entry(self._task_id, trigger_value=None))
        self._coordinator.note_trigger_edge(self._task_id, recovered=self._recovered_since_reset)
        self._request_coordinator_refresh()
        self.hass.bus.async_fire(
            EVENT_TRIGGER_ACTIVATED,
            {
                "entity_id": self.entity.entity_id,
                **self._event_ids(),
                "trigger_type": "compound",
                "compound_logic": self._compound_logic,
                "condition_states": list(self._condition_states),
            },
        )

    def _on_trigger_deactivated(self, value: float) -> None:
        """Handle compound trigger deactivation."""
        _LOGGER.info(
            "Compound trigger deactivated: %s (conditions: %s, logic: %s)",
            self.entity.entity_id,
            self._condition_states,
            self._compound_logic,
        )
        task_recovered = self.entity.async_update_trigger_state(
            is_triggered=False,
            current_value=None,
            trigger_entity_id=None,
        )
        self._request_coordinator_refresh()
        # The conditions' sub-triggers leave the announcement to the compound
        # (they are not the task's trigger): the #53 opt-in did nothing on an
        # AND/OR trigger (bug audit 2026-10-16, T4), and only the TASK's
        # recovery counts: an activation the cooldown held back never
        # latched the task, and its end recorded a second completion for the
        # one job (bug audit 2026-10-17, T-4). The trace has no single sensor
        # to name, and no reading.
        self._announce_task_recovered(
            task_recovered,
            {
                "trigger_type": "compound",
                "compound_logic": self._compound_logic,
                "condition_states": list(self._condition_states),
            },
            trace={},
            reading=None,
        )
