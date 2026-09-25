"""Heal catalog-adopted triggers whose signature turned out to be wrong.

The suggested-setups catalog pre-wires triggers at adoption time; a later fix
to a signature only reaches NEW adoptions. Where a shipped signature could
never work, the triggers it already wrote are repaired once at setup.

2026-09-25: the ``gree`` and ``daikin`` "Filter Cleaning" duties counted
runtime on the climate ATTRIBUTE ``hvac_action``. Gree never sets it (the
counter never moved); Daikin sets it only while cooling or heating, so time in
fan-only, dry and auto was lost and the ``fan``/``drying`` states were
unreachable. Both now count on the climate STATE (every mode but ``off``).

Only triggers still in the exact shape the catalog wrote are touched —
``runtime`` on a climate entity of that platform, ``attribute: hvac_action``
and the old default state set — so a user's own configuration is never
rewritten. Idempotent: a healed trigger no longer matches.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from ..const import CONF_TASKS, CONF_TRIGGER_CONFIG

# platform → (old catalog on_states, new catalog on_states)
_CLIMATE_RUNTIME_HEALS: dict[str, tuple[frozenset[str], tuple[str, ...]]] = {
    "gree": (
        frozenset({"cooling", "heating", "fan", "drying"}),
        ("auto", "cool", "dry", "fan_only", "heat"),
    ),
    "daikin": (
        frozenset({"cooling", "heating", "fan", "drying"}),
        ("cool", "dry", "fan_only", "heat", "heat_cool"),
    ),
}


def _healed_trigger(hass: HomeAssistant, tc: Mapping[str, Any]) -> dict[str, Any] | None:
    if tc.get("type") != "runtime" or tc.get("attribute") != "hvac_action":
        return None
    entity_id = tc.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id.startswith("climate."):
        return None
    reg = er.async_get(hass).async_get(entity_id)
    heal = _CLIMATE_RUNTIME_HEALS.get(reg.platform) if reg is not None else None
    if heal is None:
        return None
    old_states, new_states = heal
    current = {str(s).lower() for s in (tc.get("trigger_on_states") or [])}
    if current != old_states:
        return None  # the user changed the states — theirs to keep
    healed = {k: v for k, v in tc.items() if k != "attribute"}
    healed["trigger_on_states"] = list(new_states)
    return healed


def heal_catalog_triggers(hass: HomeAssistant, data: Mapping[str, Any]) -> dict[str, Any] | None:
    """The entry data with healed triggers, or None when nothing changed."""
    tasks = data.get(CONF_TASKS)
    if not isinstance(tasks, Mapping):
        return None
    new_tasks: dict[str, Any] | None = None
    for task_id, td in tasks.items():
        tc = td.get(CONF_TRIGGER_CONFIG) if isinstance(td, Mapping) else None
        if not isinstance(tc, Mapping):
            continue
        healed = _healed_trigger(hass, tc)
        if healed is None:
            continue
        if new_tasks is None:
            new_tasks = dict(tasks)
        new_tasks[task_id] = {**td, CONF_TRIGGER_CONFIG: healed}
    if new_tasks is None:
        return None
    return {**data, CONF_TASKS: new_tasks}
