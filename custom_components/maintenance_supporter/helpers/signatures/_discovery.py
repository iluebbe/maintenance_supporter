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
    from ...const import CONF_TASKS
    from ...entity.triggers import normalize_entity_ids
    from ..aggregate import get_object_entries

    out: dict[str, set[str]] = {}
    known = _catalog_name_variants()
    for entry in get_object_entries(hass):
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


def _matches_catalog_key(entry: er.RegistryEntry, key: str, catalog_keys: set[str], *, tk_authoritative: bool = False) -> bool:
    """``_entity_matches`` where a LONGER key of the same catalog that ends
    in ``key`` owns the entity.

    The entity_id-suffix fallback made dreame's ``secondary_filter_left``
    sensor a second source of "Replace Filter" (``…_filter_left``) next to
    its own "Replace Secondary Filter" duty — the secondary filter's wear
    then fired the main-filter task (bug review 2026-09-04). An exact
    translation_key match is the integration's own word and needs no guard.
    That guard only knows catalog keys; an integration flagged
    ``translation_keys_authoritative`` also keeps the fallbacks off entities
    whose own (uncataloged) translation_key differs.
    """
    if entry.translation_key == key:
        return True
    if not _entity_matches(entry, key, tk_authoritative=tk_authoritative):
        return False
    return not any(
        other != key and other.endswith(f"_{key}") and _entity_matches(entry, other, tk_authoritative=tk_authoritative)
        for other in catalog_keys
    )


def _appliance_type(hass: HomeAssistant, device: Any, integration: str, key: str | None) -> str | None:
    """The appliance type the integration's own config entry names for this
    device (WashData: ``device_type``) — options first, then data."""
    if not key or device is None:
        return None
    for entry_id in getattr(device, "config_entries", ()) or ():
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is not None and entry.domain == integration:
            value = entry.options.get(key, entry.data.get(key))
            return str(value) if value else None
    return None


def annotate_for_target(
    hass: HomeAssistant, proposals: list[dict[str, Any]], entry: Any, *, device_name: str = ""
) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
    """Split proposals against the target object's tasks (2.94).

    A duty the target already has BY NAME (any language) goes to ``already``
    with the existing task's name — shown, never adopted. The rest keeps
    ``covered_by`` (helpers.adopt_match.covering_task): a likely duplicate
    under another name, which the dialog shows unticked.
    """
    from ...const import CONF_TASKS
    from ..adopt_match import covering_task

    tasks = dict(entry.data.get(CONF_TASKS, {})) if entry is not None else {}
    ignore = (device_name, entry.title if entry is not None else "")
    by_lower = {str(t.get("name", "")).lower(): str(t.get("name", "")) for t in tasks.values()}
    keep: list[dict[str, Any]] = []
    already: list[dict[str, str]] = []
    for proposal in proposals:
        hit = set(by_lower) & proposal_name_variants(proposal["catalog_task_name"], proposal["entity_label"])
        if hit:
            already.append({"task_name": proposal["task_name"], "task_name_localized": proposal["task_name_localized"], "existing_name": by_lower[sorted(hit)[0]]})
            continue
        covered = (
            covering_task(hass, (proposal["task_name_localized"], proposal["task_name"]), proposal["entity_ids"], tasks, ignore=ignore)
            if tasks
            else None
        )
        keep.append({**proposal, "covered_by": covered})
    return keep, already


def discover_integration_setups(hass: HomeAssistant, *, targets: dict[str, str] | None = None) -> list[dict[str, Any]]:
    """Devices of catalogued integrations with their matchable task wiring.

    Groups matched entities per device; carries the maintenance object already
    attached to the device (if any) so adoption can extend it instead of
    creating a duplicate. Entity claims are per DUTY, not per entity: a task
    already watching an entity blocks only its own duty (recognised by
    catalog name in any language), so a mower's hours counter still proposes
    "Clean Undercarriage" after "Replace Mower Blades" was adopted. A watcher
    with a custom/renamed name conservatively claims the whole entity —
    re-running discovery never re-proposes against a rename.

    2.94: a device no object is linked to gets a ``candidate`` — the existing
    object it most likely is (helpers.adopt_match.candidate_object) — which
    becomes the default target, and every proposal is annotated against the
    target (:func:`annotate_for_target`). ``targets`` overrides the target
    per device for the dialog's preview (``""`` = a new object).
    """
    from ...templates import localize_template_text
    from ..adopt_match import candidate_object
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
        catalog_keys = {key for s in catalog.tasks for key in s.keys}
        tk_auth = catalog.translation_keys_authoritative
        appliance = _appliance_type(hass, device, integration, catalog.appliance_type_key)
        for sig in catalog.tasks:
            if appliance and appliance in sig.exclude_appliance_types:
                continue
            # Device-type gates: registry model substring and/or a
            # type-identifying sibling entity (watched siblings still count —
            # only the match TARGET must be unwatched).
            if sig.models and not any(m.lower() in model for m in sig.models):
                continue
            if sig.models_exclude and any(m.lower() in model for m in sig.models_exclude):
                continue
            if sig.require_sibling_keys and not any(
                any(_entity_matches(e, key, tk_authoritative=tk_auth) for key in sig.require_sibling_keys) for e in entries
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
                if sig.keys and not any(
                    _matches_catalog_key(entry, key, catalog_keys, tk_authoritative=tk_auth) for key in sig.keys
                ):
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
        candidate = None if suggested else candidate_object(hass, device_id)
        # The object the proposals are judged against: the linked one, else
        # the candidate, else none (a new object) — or the dialog's choice.
        if targets is not None and device_id in targets:
            target_id = targets[device_id] or None
        else:
            target_id = suggested["entry_id"] if suggested else (candidate["entry_id"] if candidate else None)
        target = hass.config_entries.async_get_entry(target_id) if target_id else None
        raw: list[dict[str, Any]] = []
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
                raw.append(
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
        # Duties already present on the target BY NAME (any language) are not
        # proposed — covers manually created calendar tasks whose trigger
        # watches no entity (the entity-watched exclusion misses them); since
        # 2.94 they are listed as ``already`` so the dialog can say so.
        tasks, already = annotate_for_target(hass, raw, target, device_name=device_name)
        if not tasks and targets is None:
            continue
        tasks.sort(key=lambda t: (t["task_name"], t["direction"]))
        from ...const import CONF_TASKS

        out.append(
            {
                "device_id": device_id,
                "device_name": device_name,
                "area_name": area_name,
                "integration": integration,
                "integration_name": catalog.name,
                "suggested_entry_id": suggested["entry_id"] if suggested else None,
                "suggested_object_name": suggested["name"] if suggested else device_name,
                "candidate": candidate,
                "target_entry_id": target.entry_id if target is not None else None,
                "target_task_count": len(target.data.get(CONF_TASKS, {})) if target is not None else 0,
                "tasks": tasks,
                "already": already,
            }
        )
    out.sort(key=lambda s: (s["integration_name"], s["device_name"]))
    return out
