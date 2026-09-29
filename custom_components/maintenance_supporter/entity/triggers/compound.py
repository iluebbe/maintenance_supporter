"""Compound trigger — combines multiple trigger conditions with AND/OR logic."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback

if TYPE_CHECKING:
    from .base_trigger import TriggerCoordinator, TriggerHost

from ...const import (
    CONF_COMPOUND_CONDITIONS,
    CONF_COMPOUND_LOGIC,
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    UNAVAILABLE_STATES,
)
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
        _eids = condition_config.get("entity_ids") or []
        self._per_entity_states: dict[str, bool] = {eid: False for eid in _eids} if len(_eids) > 1 else {}
        self._per_entity_values: dict[str, float | None] = {}
        self._entity_logic = condition_config.get("entity_logic", "any")
        # Mirror attributes the real entity exposes for trigger access
        self.entity_id: str = parent.entity.entity_id
        self._task_id: str = parent.entity._task_id
        # Replaced by the condition's _CompoundCoordinatorProxy right after.
        self.coordinator: TriggerCoordinator = parent.entity.coordinator

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

    def __init__(self, real_coordinator: TriggerCoordinator, condition_idx: int) -> None:
        """Initialize the proxy."""
        self._real = real_coordinator
        self._condition_idx = condition_idx

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

    async def async_add_trigger_history_entry(self, task_id: str, trigger_value: float | None = None) -> None:
        """No-op for a condition — see the class comment above."""

    def note_trigger_edge(self, task_id: str, *, recovered: bool = True) -> None:
        """No-op for a condition — the compound reports its own edge."""

    async def async_request_refresh(self) -> None:
        """Delegate to the object's coordinator."""
        await self._real.async_request_refresh()

    async def async_auto_complete_on_recovery(self, task_id: str, trigger_value: float) -> None:
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
            proxy_coordinator = _CompoundCoordinatorProxy(self._coordinator, idx)
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

    async def async_teardown(self) -> None:
        """Tear down all sub-triggers."""
        for trigger_list in self._sub_triggers:
            for trigger in trigger_list:
                await trigger.async_teardown()
        self._sub_triggers = []
        self._sub_entities = []
        self._condition_states = [False] * len(self._conditions)
        await super().async_teardown()

    def evaluate(self, value: float) -> bool:
        """Evaluate compound condition (aggregation of condition states)."""
        if self._compound_logic == "AND":
            return bool(self._condition_states) and all(self._condition_states)
        return any(self._condition_states)  # OR

    def reset(self) -> None:
        """Reset all sub-triggers."""
        super().reset()
        self._condition_states = [False] * len(self._conditions)
        for trigger_list in self._sub_triggers:
            for trigger in trigger_list:
                trigger.reset()

    @callback
    def _on_condition_changed(self, condition_idx: int, is_triggered: bool) -> None:
        """Handle a condition state change and re-aggregate."""
        self._condition_states[condition_idx] = is_triggered

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
        elif not now_triggered and was_triggered:
            self._on_trigger_deactivated(0.0)
        self._maybe_settle()

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
        self.entity.async_update_trigger_state(
            is_triggered=False,
            current_value=None,
            trigger_entity_id=None,
        )
        self._request_coordinator_refresh()
        self.hass.bus.async_fire(
            EVENT_TRIGGER_DEACTIVATED,
            {
                "entity_id": self.entity.entity_id,
                **self._event_ids(),
                "trigger_type": "compound",
                "compound_logic": self._compound_logic,
                "condition_states": list(self._condition_states),
            },
        )
