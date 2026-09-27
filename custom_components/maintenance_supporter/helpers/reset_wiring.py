"""Reset the integration's own counter when a task is completed (2.95).

Robot vacuums, mowers, filters and litter boxes count their consumables
themselves and offer a reset button (Roborock "Reset main brush consumable",
Automower "Reset cutting blade usage time"). A catalog duty knows which
button belongs to its counter (``ConsumableSignature.resets``); wiring it
makes the task's completion action press that button, so completing the task
here also resets the counter in the integration — before, the counter kept
running and the task fell due again right away.

Some integrations ship these buttons disabled (Roborock, Ecovacs, Tuya);
wiring enables a button the INTEGRATION disabled, never one the user did.
The action carries ``skip_auto``: when the task completed itself because the
counter recovered (someone reset it in the vendor app), pressing reset again
would be pointless.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

RESET_SERVICE = "button.press"


def reset_action(entity_id: str) -> dict[str, Any]:
    """The completion action that presses the reset button."""
    return {"service": RESET_SERVICE, "target": {"entity_id": entity_id}, "skip_auto": True}


def pressable_reset_buttons(hass: HomeAssistant, device_id: str, integration: str) -> list[er.RegistryEntry]:
    """The integration's buttons on the device that wiring may use: enabled,
    or disabled by the integration itself (wiring enables them)."""
    ent_reg = er.async_get(hass)
    return [
        e
        for e in er.async_entries_for_device(ent_reg, device_id, include_disabled_entities=True)
        if e.domain == "button"
        and e.platform == integration
        and e.disabled_by in (None, er.RegistryEntryDisabler.INTEGRATION)
    ]


def enable_reset_button(hass: HomeAssistant, entity_id: str) -> bool:
    """Enable a reset button the integration shipped disabled. True when it
    was enabled now (Home Assistant reloads the integration shortly after)."""
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get(entity_id)
    if entry is None or entry.disabled_by is not er.RegistryEntryDisabler.INTEGRATION:
        return False
    ent_reg.async_update_entity(entity_id, disabled_by=None)
    return True


def apply_reset_action(hass: HomeAssistant, task_data: dict[str, Any], entity_id: str, user_id: str | None) -> None:
    """Set the reset as the task's completion action (validated, run as the
    user who wired it) and enable the button when the integration hid it."""
    from .sanitize import cap_action_field, stamp_action_owner

    task_data["on_complete_action"] = reset_action(entity_id)
    cap_action_field(task_data)
    stamp_action_owner(task_data, user_id)
    enable_reset_button(hass, entity_id)


def _catalog_shaped(hass: HomeAssistant, task: Mapping[str, Any], sig: Any, entity: er.RegistryEntry) -> bool:
    """Whether the task still looks exactly like an adoption of ``sig`` on
    ``entity``: a replacement task whose trigger has the shape the catalog
    writes (type, bounds, auto-complete, delta mode) — how a task adopted
    before the fingerprint and renamed since is recognised (never certain)."""
    from .signatures._model import build_setup_trigger

    tc = task.get("trigger_config")
    if task.get("type") != "replacement" or not isinstance(tc, dict):
        return False
    expected = build_setup_trigger(sig, hass, [entity.entity_id])
    if tc.get("type") != expected.get("type"):
        return False
    if any(bool(tc.get(key)) != bool(expected.get(key)) for key in ("auto_complete_on_recovery", "trigger_delta_mode")):
        return False

    def bounds(trigger: Mapping[str, Any]) -> set[str]:
        return {k for k in ("trigger_below", "trigger_above", "trigger_target_value") if trigger.get(k) is not None}

    return bounds(tc) == bounds(expected)


def _counter_duty(hass: HomeAssistant, entity: er.RegistryEntry, task: Mapping[str, Any]) -> tuple[Any, Any, bool] | None:
    """(catalog, duty, renamed) when ``entity`` is a catalogued counter with a
    reset and the task is that duty — by its fingerprint or its name (any
    language). A custom task that merely watches the counter (cleaning the
    brush, not replacing it) must not reset it. ``renamed``: no fingerprint,
    another name, but exactly the catalog's trigger shape — offered, never
    pre-selected."""
    from .signatures import SIGNATURES
    from .signatures._discovery import _matches_catalog_key
    from .signatures._model import catalog_base_name, task_name_variants
    from .task_origin import origin_is_duty, task_origin

    catalog = SIGNATURES.get(entity.platform)
    if catalog is None:
        return None
    keys = {k for s in catalog.tasks for k in s.keys}
    base = catalog_base_name(str(task.get("name", "")).lower())
    has_origin = task_origin(task) is not None
    probable = None
    for sig in catalog.tasks:
        if not sig.resets:
            continue
        if not any(_matches_catalog_key(entity, k, keys, tk_authoritative=catalog.translation_keys_authoritative) for k in sig.keys):
            continue
        if origin_is_duty(task, entity.platform, sig.task_name, sig.direction):
            return catalog, sig, False
        if has_origin:
            continue  # adopted as another duty (or from a template) — not this one
        if base in task_name_variants(sig.task_name):
            return catalog, sig, False
        if probable is None and _catalog_shaped(hass, task, sig, entity):
            probable = (catalog, sig, True)
    return probable


def _reset_candidates(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Existing tasks that watch a catalogued counter whose integration can
    reset it, but whose completion does not press that reset yet — adopted
    before 2.95, or wired by hand without an action. Internal keys (``_*``)
    carry what wiring needs to record the task's fingerprint."""
    from ..const import CONF_OBJECT, CONF_TASKS
    from ..entity.triggers import normalize_entity_ids
    from .aggregate import get_object_entries
    from .signatures._discovery import reset_button_for
    from .signatures._model import PER_ENTITY_SEPARATOR

    ent_reg = er.async_get(hass)
    out: list[dict[str, Any]] = []
    for entry in get_object_entries(hass):
        obj = entry.data.get(CONF_OBJECT, {})
        if obj.get("archived_at"):
            continue
        for task_id, task in entry.data.get(CONF_TASKS, {}).items():
            if task.get("on_complete_action") or task.get("archived_at") or task.get("enabled") is False:
                continue
            tc = task.get("trigger_config")
            if not isinstance(tc, dict):
                continue
            name = str(task.get("name", ""))
            for entity_id in normalize_entity_ids(tc):
                reg = ent_reg.async_get(entity_id)
                if reg is None or not reg.device_id:
                    continue
                found = _counter_duty(hass, reg, task)
                if found is None:
                    continue
                catalog, sig, renamed = found
                keys = {k for s in catalog.tasks for k in s.keys}
                button = reset_button_for(
                    hass, sig, [reg], reg.device_id, reg.platform, keys, tk_authoritative=catalog.translation_keys_authoritative
                )
                if button is None:
                    continue
                out.append(
                    {
                        "entry_id": entry.entry_id,
                        "object_name": obj.get("name", entry.title),
                        "task_id": task_id,
                        "task_name": name,
                        "integration_name": catalog.name,
                        "button_entity_id": button["entity_id"],
                        "button_name": button["name"],
                        "button_disabled": button["disabled"],
                        "renamed": renamed,
                        "_platform": reg.platform,
                        "_sig": sig,
                        "_device_id": reg.device_id,
                        "_label": name.split(PER_ENTITY_SEPARATOR, 1)[1] if sig.per_entity and PER_ENTITY_SEPARATOR in name else None,
                    }
                )
                break
    out.sort(key=lambda o: (o["object_name"].lower(), o["task_name"].lower()))
    return out


def reset_offers(hass: HomeAssistant) -> list[dict[str, Any]]:
    """The reset offers as the dialog gets them (see ``_reset_candidates``);
    ``renamed`` ones are shown unticked with a "check this" hint."""
    return [{k: v for k, v in c.items() if not k.startswith("_")} for c in _reset_candidates(hass)]


def wire_resets(hass: HomeAssistant, items: list[dict[str, str]], user_id: str | None) -> int:
    """Wire the offered resets for the chosen (entry_id, task_id) pairs —
    recomputed here, never taken from the client. Returns how many."""
    from ..const import CONF_TASKS
    from .entry_tasks import write_tasks
    from .task_origin import ORIGIN_KEY, integration_origin

    wanted = {(i["entry_id"], i["task_id"]) for i in items}
    by_entry: dict[str, dict[str, dict[str, Any]]] = {}
    for offer in _reset_candidates(hass):
        if (offer["entry_id"], offer["task_id"]) not in wanted:
            continue
        entry = hass.config_entries.async_get_entry(offer["entry_id"])
        if entry is None:
            continue
        task = dict(entry.data.get(CONF_TASKS, {}).get(offer["task_id"]) or {})
        if not task:
            continue
        apply_reset_action(hass, task, offer["button_entity_id"], user_id)
        # Confirmed as this duty — record the fingerprint (a renamed task
        # stays recognised from now on).
        if ORIGIN_KEY not in task:
            sig = offer["_sig"]
            task[ORIGIN_KEY] = integration_origin(offer["_platform"], sig.task_name, sig.direction, offer["_device_id"], offer["_label"])
        by_entry.setdefault(entry.entry_id, {})[offer["task_id"]] = task
    count = 0
    for entry_id, tasks in by_entry.items():
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is not None:
            write_tasks(hass, entry, tasks)
            count += len(tasks)
    return count
