"""Compound trigger — combines multiple trigger conditions with AND/OR logic."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback

if TYPE_CHECKING:
    from ...coordinator import MaintenanceCoordinator
    from ...sensor import MaintenanceSensor

from ...const import (
    CONF_COMPOUND_CONDITIONS,
    CONF_COMPOUND_LOGIC,
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    HistoryEntryType,
    TriggerType,
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
        self._per_entity_states: dict[str, bool] = {}
        self._per_entity_values: dict[str, float | None] = {}
        self._entity_logic = condition_config.get("entity_logic", "any")
        # Mirror attributes the real entity exposes for trigger access
        self.entity_id = parent.entity.entity_id
        self._task_id = parent.entity._task_id
        self.coordinator = parent.entity.coordinator

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
            aggregated = bool(self._per_entity_states) and all(
                self._per_entity_states.values()
            )
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

    def __init__(self, real_coordinator: MaintenanceCoordinator, condition_idx: int) -> None:
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
        """Persist under trigger_runtime.conditions[idx]."""
        store = getattr(self._real, "_store", None)
        if store is not None:
            # Store-based: build a compound key for condition index
            compound_key = f"_compound_{self._condition_idx}"
            if entity_id is not None:
                compound_key = f"_compound_{self._condition_idx}_{entity_id}"
            store.set_trigger_runtime(task_id, compound_key, runtime_data)
            if immediate:
                await store.async_save()
            else:
                store.async_delay_save()
        else:
            # Legacy: write to ConfigEntry.data under _trigger_state
            from ...const import CONF_TASKS

            tasks_data = dict(self._real.entry.data.get(CONF_TASKS, {}))
            if task_id not in tasks_data:
                return

            task_dict = dict(tasks_data[task_id])
            trigger_config = dict(task_dict.get("trigger_config", {}))
            trigger_state = dict(trigger_config.get("_trigger_state", {}))

            conditions_state = list(trigger_state.get("conditions", []))
            while len(conditions_state) <= self._condition_idx:
                conditions_state.append({})
            cond_state = dict(conditions_state[self._condition_idx])

            if entity_id is not None:
                entity_state = dict(cond_state.get(entity_id, {}))
                for key, value in runtime_data.items():
                    entity_state[key] = value
                cond_state[entity_id] = entity_state
            else:
                for key, value in runtime_data.items():
                    cond_state[key] = value

            conditions_state[self._condition_idx] = cond_state
            trigger_state["conditions"] = conditions_state
            trigger_config["_trigger_state"] = trigger_state
            task_dict["trigger_config"] = trigger_config
            tasks_data[task_id] = task_dict

            new_data = dict(self._real.entry.data)
            new_data[CONF_TASKS] = tasks_data
            self._real.hass.config_entries.async_update_entry(
                self._real.entry, data=new_data
            )


class CompoundTrigger(BaseTrigger):
    """Compound trigger that combines multiple conditions with AND/OR logic.

    Two-level aggregation:
    1. Within each condition: multi-entity ``entity_logic`` (any/all)
    2. Across conditions: ``compound_logic`` (AND/OR)
    """

    def __init__(
        self,
        hass: HomeAssistant,
        entity: MaintenanceSensor,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize the compound trigger."""
        # BaseTrigger expects entity_id; compound has no single monitored entity
        config_with_id = dict(trigger_config)
        config_with_id.setdefault("entity_id", "")
        super().__init__(hass, entity, config_with_id)

        self._compound_logic: str = trigger_config.get(
            CONF_COMPOUND_LOGIC, "AND"
        ).upper()
        self._conditions: list[dict[str, Any]] = trigger_config.get(
            CONF_COMPOUND_CONDITIONS, []
        )
        self._condition_states: list[bool] = [False] * len(self._conditions)
        self._sub_triggers: list[list[BaseTrigger]] = []
        self._sub_entities: list[CompoundSubEntity] = []

    @property
    def condition_states(self) -> list[bool]:
        """Return the current state of each condition."""
        return list(self._condition_states)

    async def async_setup(self) -> None:
        """Set up all sub-triggers for each condition."""
        from . import create_triggers

        trigger_state = self.config.get("_trigger_state", {})
        conditions_state = trigger_state.get("conditions", [])

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
            proxy_coordinator = _CompoundCoordinatorProxy(
                self._coordinator, idx
            )
            sub_entity.coordinator = proxy_coordinator  # type: ignore[assignment]

            sub_triggers = create_triggers(self.hass, sub_entity, cond_config)  # type: ignore[arg-type]
            self._sub_triggers.append(sub_triggers)

            for trigger in sub_triggers:
                await trigger.async_setup()

        _LOGGER.debug(
            "Compound trigger setup: %d conditions with %s logic for %s",
            len(self._conditions),
            self._compound_logic,
            self.entity.entity_id,
        )

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
            now_triggered = bool(self._condition_states) and all(
                self._condition_states
            )
        else:  # OR
            now_triggered = any(self._condition_states)

        self._triggered = now_triggered

        if now_triggered and not was_triggered:
            self._on_trigger_activated(0.0)
        elif not now_triggered and was_triggered:
            self._on_trigger_deactivated(0.0)

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
        self.hass.async_create_task(
            self._coordinator.async_add_trigger_history_entry(
                self._task_id, trigger_value=None
            )
        )
        self.hass.bus.async_fire(
            EVENT_TRIGGER_ACTIVATED,
            {
                "entity_id": self.entity.entity_id,
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
        self.hass.bus.async_fire(
            EVENT_TRIGGER_DEACTIVATED,
            {
                "entity_id": self.entity.entity_id,
                "trigger_type": "compound",
                "compound_logic": self._compound_logic,
                "condition_states": list(self._condition_states),
            },
        )
