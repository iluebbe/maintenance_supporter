"""Trigger system for sensor-based maintenance tasks."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from ...const import TriggerType
from .base_trigger import BaseTrigger
from .compound import CompoundTrigger
from .counter import CounterTrigger
from .runtime import RuntimeTrigger
from .state_change import StateChangeTrigger
from .threshold import ThresholdTrigger

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def normalize_entity_ids(trigger_config: dict[str, Any]) -> list[str]:
    """Return a list of entity IDs from trigger_config.

    Handles both the new ``entity_ids`` list and the legacy ``entity_id``
    string.  Always returns a list (possibly empty).
    """
    ids = trigger_config.get("entity_ids")
    if isinstance(ids, list) and ids:
        return list(ids)
    eid = trigger_config.get("entity_id")
    if eid:
        return [eid]
    return []


def _migrate_flat_to_per_entity(
    config: dict[str, Any], first_entity_id: str
) -> dict[str, dict[str, Any]]:
    """Create ``_trigger_state`` from legacy flat keys on first load.

    Returns a dict keyed by entity_id with per-entity state.  Only creates
    an entry for *first_entity_id* since legacy configs only had one entity.
    """
    trigger_type = config.get("type", TriggerType.THRESHOLD)
    state: dict[str, Any] = {}

    if trigger_type == TriggerType.COUNTER:
        bv = config.get("trigger_baseline_value")
        if bv is not None:
            state["baseline_value"] = bv
    elif trigger_type == TriggerType.RUNTIME:
        acc = config.get("trigger_accumulated_seconds")
        if acc is not None:
            state["accumulated_seconds"] = acc
        on_since = config.get("trigger_on_since")
        if on_since is not None:
            state["on_since"] = on_since
    elif trigger_type == TriggerType.STATE_CHANGE:
        cc = config.get("trigger_change_count")
        if cc is not None:
            state["change_count"] = cc

    if state:
        return {first_entity_id: state}
    return {}


def _inject_per_entity_state(
    config: dict[str, Any], entity_state: dict[str, Any]
) -> None:
    """Inject per-entity persisted state into a trigger config for construction.

    Overwrites the flat keys that each trigger reads in ``__init__`` so that
    the trigger instance picks up the correct per-entity values.
    """
    trigger_type = config.get("type", TriggerType.THRESHOLD)

    if trigger_type == TriggerType.COUNTER:
        if "baseline_value" in entity_state:
            config["trigger_baseline_value"] = entity_state["baseline_value"]
    elif trigger_type == TriggerType.RUNTIME:
        if "accumulated_seconds" in entity_state:
            config["trigger_accumulated_seconds"] = entity_state["accumulated_seconds"]
        if "on_since" in entity_state:
            config["trigger_on_since"] = entity_state["on_since"]
    elif trigger_type == TriggerType.STATE_CHANGE:
        if "change_count" in entity_state:
            config["trigger_change_count"] = entity_state["change_count"]


def create_trigger(
    hass: HomeAssistant,
    entity: Any,
    trigger_config: dict[str, Any],
) -> BaseTrigger:
    """Create a trigger instance based on trigger type."""
    trigger_type = trigger_config.get("type", TriggerType.THRESHOLD)

    if trigger_type == TriggerType.THRESHOLD:
        return ThresholdTrigger(hass, entity, trigger_config)
    if trigger_type == TriggerType.COUNTER:
        return CounterTrigger(hass, entity, trigger_config)
    if trigger_type == TriggerType.STATE_CHANGE:
        return StateChangeTrigger(hass, entity, trigger_config)
    if trigger_type == TriggerType.RUNTIME:
        return RuntimeTrigger(hass, entity, trigger_config)
    if trigger_type == TriggerType.COMPOUND:
        return CompoundTrigger(hass, entity, trigger_config)

    raise ValueError(f"Unknown trigger type: {trigger_type}")


def create_triggers(
    hass: HomeAssistant,
    entity: Any,
    trigger_config: dict[str, Any],
) -> list[BaseTrigger]:
    """Create trigger instances for all entity_ids in the config.

    Creates one trigger per entity_id for all trigger types that support
    multi-entity.  For counter/runtime/state_change, per-entity persisted
    state is injected from ``_trigger_state`` before construction.
    """
    # Compound triggers manage their own sub-triggers; always return one.
    trigger_type = trigger_config.get("type", TriggerType.THRESHOLD)
    if trigger_type == TriggerType.COMPOUND:
        return [CompoundTrigger(hass, entity, trigger_config)]

    entity_ids = normalize_entity_ids(trigger_config)
    if not entity_ids:
        raise ValueError("No entity_id(s) in trigger_config")

    if len(entity_ids) == 1:
        single_config = dict(trigger_config)
        single_config["entity_id"] = entity_ids[0]
        return [create_trigger(hass, entity, single_config)]

    # Ensure _trigger_state exists (migrate from flat keys if needed)
    if "_trigger_state" not in trigger_config:
        trigger_config["_trigger_state"] = _migrate_flat_to_per_entity(
            trigger_config, entity_ids[0]
        )

    # Multi-entity: one trigger per entity_id
    triggers: list[BaseTrigger] = []
    for eid in entity_ids:
        per_entity_config = dict(trigger_config)
        per_entity_config["entity_id"] = eid
        # Inject per-entity persisted state
        entity_state = trigger_config.get("_trigger_state", {}).get(eid, {})
        _inject_per_entity_state(per_entity_config, entity_state)
        triggers.append(create_trigger(hass, entity, per_entity_config))
    return triggers


__all__ = [
    "BaseTrigger",
    "CompoundTrigger",
    "CounterTrigger",
    "RuntimeTrigger",
    "StateChangeTrigger",
    "ThresholdTrigger",
    "create_trigger",
    "create_triggers",
    "normalize_entity_ids",
]
