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

2026-09-27: the Haier hOn (Andre0512 fork) purifier filters were read as life
LEFT ("below 10 %"), but the sensors report the raw status, which counts UP
(0 % right after a filter change, Andre0512/hon#244): the task fell due right
after the filter was changed and resolved itself once it was worn out. Those
filters are now wear gauges ("above 90 %"). A threshold trigger on those
sensors with only a lower bound is the catalog's shape and is flipped.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from ..const import CONF_TASKS, CONF_TRIGGER_CONFIG

# platform → the on_states the OLD catalog wrote (the broken shape a heal
# recognises — history, so spelled out). The healed states are read from the
# catalog itself (``_catalog_on_states``): the heal used to carry its own
# copy of air.py's states, which a later catalog fix would have left behind
# (DRY audit 2026-09-26 B).
_CLIMATE_RUNTIME_HEALS: dict[str, frozenset[str]] = {
    "gree": frozenset({"cooling", "heating", "fan", "drying"}),
    "daikin": frozenset({"cooling", "heating", "fan", "drying"}),
}


def _catalog_on_states(platform: str) -> tuple[str, ...]:
    """The states the catalog's climate-runtime duty of ``platform`` counts —
    exactly what a fresh adoption would wire."""
    from .signatures import SIGNATURES

    for sig in SIGNATURES[platform].tasks:
        if sig.direction == "runtime_hours" and sig.entity_domain == "climate":
            return sig.on_states
    raise LookupError(f"no climate runtime signature for {platform!r}")


def _healed_trigger(hass: HomeAssistant, tc: Mapping[str, Any]) -> dict[str, Any] | None:
    if tc.get("type") != "runtime" or tc.get("attribute") != "hvac_action":
        return None
    entity_id = tc.get("entity_id")
    if not isinstance(entity_id, str) or not entity_id.startswith("climate."):
        return None
    reg = er.async_get(hass).async_get(entity_id)
    old_states = _CLIMATE_RUNTIME_HEALS.get(reg.platform) if reg is not None else None
    if old_states is None or reg is None:
        return None
    current = {str(s).lower() for s in (tc.get("trigger_on_states") or [])}
    if current != old_states:
        return None  # the user changed the states — theirs to keep
    healed = {k: v for k, v in tc.items() if k != "attribute"}
    healed["trigger_on_states"] = list(_catalog_on_states(reg.platform))
    return healed


# platform → the translation keys whose catalog reading flipped from "life
# left" (trigger_below) to "wear" (trigger_above, read from the catalog).
_WEAR_GAUGE_HEALS: dict[str, frozenset[str]] = {
    "hon": frozenset({"filter_life", "filter_cleaning"}),
}


def _catalog_wear_limit(platform: str, key: str) -> float:
    """The alert_above limit the catalog now wires for ``key``."""
    from .signatures import SIGNATURES

    for sig in SIGNATURES[platform].tasks:
        if sig.direction == "alert_above" and key in sig.keys:
            return float(sig.delta_units)
    raise LookupError(f"no wear signature for {platform}/{key}")


def _healed_wear_trigger(hass: HomeAssistant, tc: Mapping[str, Any]) -> dict[str, Any] | None:
    if tc.get("type") != "threshold" or tc.get("trigger_below") is None or tc.get("trigger_above") is not None:
        return None
    from ..entity.triggers import normalize_entity_ids

    entity_ids = normalize_entity_ids(dict(tc))
    if not entity_ids:
        return None
    ent_reg = er.async_get(hass)
    keys = set()
    for entity_id in entity_ids:
        reg = ent_reg.async_get(entity_id) if isinstance(entity_id, str) else None
        heal_keys = _WEAR_GAUGE_HEALS.get(reg.platform) if reg is not None else None
        if reg is None or heal_keys is None or reg.translation_key not in heal_keys:
            return None  # not (only) an affected sensor — the user's own trigger
        keys.add((reg.platform, reg.translation_key))
    limits = {_catalog_wear_limit(platform, key) for platform, key in keys}
    if len(limits) != 1:
        return None
    healed = {k: v for k, v in tc.items() if k != "trigger_below"}
    healed["trigger_above"] = limits.pop()
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
        healed = _healed_trigger(hass, tc) or _healed_wear_trigger(hass, tc)
        if healed is None:
            continue
        if new_tasks is None:
            new_tasks = dict(tasks)
        new_tasks[task_id] = {**td, CONF_TRIGGER_CONFIG: healed}
    if new_tasks is None:
        return None
    return {**data, CONF_TASKS: new_tasks}
