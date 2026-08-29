"""Device discovery over the assembled signature catalog."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from ._model import (
    _entity_matches,
    _entity_unit,
    _threshold_for,
    _unit_compatible,
    catalog_base_name,
    entity_label,
    per_entity_task_name,
    proposal_name_variants,
    task_name_variants,
)
from ._registry import SIGNATURES


def _entity_watchers(hass: HomeAssistant) -> dict[str, set[str]]:
    """entity_id → lowercased names of the tasks watching it via a trigger."""
    from ...const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
    from ...entity.triggers import normalize_entity_ids

    out: dict[str, set[str]] = {}
    known = _catalog_name_variants()
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        for task in entry.data.get(CONF_TASKS, {}).values():
            tc = task.get("trigger_config")
            if isinstance(tc, dict):
                name = str(task.get("name", "")).lower()
                # A per-entity duty ("replace toner — cyan") claims under its
                # catalog base name: it blocks only ITS duty on ITS entity,
                # and the sibling cartridges stay proposable.
                base = catalog_base_name(name)
                if base != name and base in known:
                    name = base
                for eid in normalize_entity_ids(tc):
                    out.setdefault(eid, set()).add(name)
    return out


def _catalog_name_variants() -> set[str]:
    """Every catalog task name in every language, lowercased — to recognise
    whether an existing watcher task is one of OUR duties or a custom one."""
    variants: set[str] = set()
    for catalog in SIGNATURES.values():
        for sig in catalog.tasks:
            variants.update(task_name_variants(sig.task_name))
    return variants


def discover_integration_setups(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Devices of catalogued integrations with their matchable task wiring.

    Groups matched entities per device; carries the maintenance object already
    attached to the device (if any) so adoption can extend it instead of
    creating a duplicate. Entity claims are per DUTY, not per entity: a task
    already watching an entity blocks only its own duty (recognised by
    catalog name in any language), so a mower's hours counter still proposes
    "Clean Undercarriage" after "Replace Mower Blades" was adopted. A watcher
    with a custom/renamed name conservatively claims the whole entity —
    re-running discovery never re-proposes against a rename.
    """
    from ...templates import localize_template_text
    from ..i18n import normalize_language
    from ..problem_sensors import _object_by_device

    lang = normalize_language(hass)
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    area_reg = ar.async_get(hass)
    watchers = _entity_watchers(hass)
    known_variants = _catalog_name_variants()
    by_device = _object_by_device(hass)

    # Collect the enabled registry entities of cataloged integrations per
    # (device, integration) first — the device-type gates need the device's
    # FULL entity list (siblings identify the appliance type).
    by_device_integration: dict[tuple[str, str], list[er.RegistryEntry]] = {}
    for entry in ent_reg.entities.values():
        if SIGNATURES.get(entry.platform) is None or not entry.device_id:
            continue
        if entry.disabled_by is not None:
            continue
        by_device_integration.setdefault((entry.device_id, entry.platform), []).append(entry)

    # device_id → {(integration, task_name, direction): {sig, entity_ids}}.
    # The direction is part of the key so an integration that ships one task
    # name in two directions (LG ThinQ filter: hours vs percent) stays split.
    matched: dict[str, dict[tuple[str, str, str], dict[str, Any]]] = {}
    for (device_id, integration), entries in by_device_integration.items():
        catalog = SIGNATURES[integration]
        device = dev_reg.async_get(device_id)
        # getattr: HA 2026.9 may hand back a ChildDeviceEntry (sub-device),
        # which carries no model — model-gated signatures simply don't match.
        model = (
            (getattr(device, "model", None) or "")
            if device is not None and getattr(device, "parent_device_id", None) is None
            else ""
        ).lower()
        for sig in catalog.tasks:
            # Device-type gates: registry model substring and/or a
            # type-identifying sibling entity (watched siblings still count —
            # only the match TARGET must be unwatched).
            if sig.models and not any(m.lower() in model for m in sig.models):
                continue
            if sig.models_exclude and any(m.lower() in model for m in sig.models_exclude):
                continue
            if sig.require_sibling_keys and not any(
                any(_entity_matches(e, key) for key in sig.require_sibling_keys) for e in entries
            ):
                continue
            variants = task_name_variants(sig.task_name)
            for entry in entries:
                if entry.domain != sig.entity_domain:
                    continue
                if not _unit_compatible(sig.direction, _entity_unit(hass, entry)):
                    continue
                # Empty keys (non-sensor domains only, tripwire-enforced) match
                # the device's single entity of that domain — THE lawn_mower.
                if sig.keys and not any(_entity_matches(entry, key) for key in sig.keys):
                    continue
                group = matched.setdefault(device_id, {}).setdefault(
                    (integration, sig.task_name, sig.direction),
                    {"sig": sig, "entity_ids": [], "entries": {}, "matched_total": 0},
                )
                # Counted BEFORE the watcher claim: a per-entity duty keeps its
                # entity suffix once the device has several cartridges, also
                # after the first one was adopted.
                group["matched_total"] += 1
                # Per-duty claims: a watcher task named as THIS duty (any
                # language) blocks it; watchers named as other catalog duties
                # leave the remaining duties adoptable; a custom/renamed
                # watcher claims the whole entity.
                watcher_names = watchers.get(entry.entity_id)
                if watcher_names and (watcher_names & variants or watcher_names - known_variants):
                    continue
                group["entity_ids"].append(entry.entity_id)
                group["entries"][entry.entity_id] = entry
                # One source entity may back SEVERAL duties (a mower's hours
                # counter drives blades AND undercarriage) — both within one
                # run and across runs: the per-duty claim above keeps a
                # deselected duty proposable after its sibling was adopted.

    out: list[dict[str, Any]] = []
    for device_id, sig_map in matched.items():
        device = dev_reg.async_get(device_id)
        if device is None:
            continue
        device_name = device.name_by_user or device.name or device_id
        area_name = ""
        if device.area_id and (area := area_reg.async_get_area(device.area_id)):
            area_name = area.name
        integration = next(iter(sig_map))[0]
        catalog = SIGNATURES[integration]
        suggested = by_device.get(device_id)
        # Duties already present on the bound object BY NAME (any language) are
        # not re-proposed — covers manually created calendar tasks whose
        # trigger watches no entity (the entity-watched exclusion misses them).
        existing_names: set[str] = set()
        if suggested and (target := hass.config_entries.async_get_entry(suggested["entry_id"])):
            from ...const import CONF_TASKS

            existing_names = {str(t.get("name", "")).lower() for t in target.data.get(CONF_TASKS, {}).values()}
        tasks = []
        for (_integ, task_name, direction), group in sig_map.items():
            entity_ids = sorted(group["entity_ids"])
            if not entity_ids:
                continue
            sig = group["sig"]
            localized = localize_template_text(task_name, lang) or task_name
            # Per-entity duties split into one proposal per entity, each named
            # after its entity — only when the device actually has several (a
            # mono printer's single cartridge keeps the plain catalog name).
            proposals: list[tuple[list[str], str | None]]
            if sig.per_entity and group["matched_total"] > 1:
                proposals = [
                    ([eid], entity_label(hass, group["entries"][eid], device_name)) for eid in entity_ids
                ]
            else:
                proposals = [(entity_ids, None)]
            for ids, label in proposals:
                if existing_names and existing_names & proposal_name_variants(task_name, label):
                    continue
                tasks.append(
                    {
                        # task_name stays the EN catalog key (adopt selections
                        # match on it) — suffixed with the entity label for
                        # per-entity duties; catalog_task_name is the bare key
                        # and the dialog renders the localized twin.
                        "task_name": per_entity_task_name(task_name, label) if label else task_name,
                        "catalog_task_name": task_name,
                        "entity_label": label,
                        "task_name_localized": per_entity_task_name(localized, label) if label else localized,
                        "entity_ids": ids,
                        "threshold": _threshold_for(sig, hass, ids[0]),
                        "direction": direction,
                    }
                )
        if not tasks:
            continue
        tasks.sort(key=lambda t: (t["task_name"], t["direction"]))
        out.append(
            {
                "device_id": device_id,
                "device_name": device_name,
                "area_name": area_name,
                "integration": integration,
                "integration_name": catalog.name,
                "suggested_entry_id": suggested["entry_id"] if suggested else None,
                "suggested_object_name": suggested["name"] if suggested else device_name,
                "tasks": tasks,
            }
        )
    out.sort(key=lambda s: (s["integration_name"], s["device_name"]))
    return out
