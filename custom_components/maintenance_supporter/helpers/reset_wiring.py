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


def _counter_duty(hass: HomeAssistant, entity: er.RegistryEntry, task_name: str) -> tuple[Any, Any] | None:
    """(catalog, duty) when ``entity`` is a catalogued counter with a reset
    and the task is named as that duty (any language) — a custom task that
    merely watches the counter (cleaning the brush, not replacing it) must
    not reset it."""
    from .signatures import SIGNATURES
    from .signatures._discovery import _matches_catalog_key
    from .signatures._model import catalog_base_name, task_name_variants

    catalog = SIGNATURES.get(entity.platform)
    if catalog is None:
        return None
    keys = {k for s in catalog.tasks for k in s.keys}
    base = catalog_base_name(task_name.lower())
    for sig in catalog.tasks:
        if not sig.resets or base not in task_name_variants(sig.task_name):
            continue
        if any(_matches_catalog_key(entity, k, keys, tk_authoritative=catalog.translation_keys_authoritative) for k in sig.keys):
            return catalog, sig
    return None


def reset_offers(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Existing tasks that watch a catalogued counter whose integration can
    reset it, but whose completion does not press that reset yet — adopted
    before 2.95, or wired by hand without an action."""
    from ..const import CONF_OBJECT, CONF_TASKS
    from ..entity.triggers import normalize_entity_ids
    from .aggregate import get_object_entries
    from .signatures._discovery import reset_button_for

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
                found = _counter_duty(hass, reg, name)
                if found is None:
                    continue
                catalog, sig = found
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
                    }
                )
                break
    out.sort(key=lambda o: (o["object_name"].lower(), o["task_name"].lower()))
    return out


def wire_resets(hass: HomeAssistant, items: list[dict[str, str]], user_id: str | None) -> int:
    """Wire the offered resets for the chosen (entry_id, task_id) pairs —
    recomputed here, never taken from the client. Returns how many."""
    from ..const import CONF_TASKS
    from .entry_tasks import write_tasks

    wanted = {(i["entry_id"], i["task_id"]) for i in items}
    by_entry: dict[str, dict[str, dict[str, Any]]] = {}
    for offer in reset_offers(hass):
        if (offer["entry_id"], offer["task_id"]) not in wanted:
            continue
        entry = hass.config_entries.async_get_entry(offer["entry_id"])
        if entry is None:
            continue
        task = dict(entry.data.get(CONF_TASKS, {}).get(offer["task_id"]) or {})
        if not task:
            continue
        apply_reset_action(hass, task, offer["button_entity_id"], user_id)
        by_entry.setdefault(entry.entry_id, {})[offer["task_id"]] = task
    count = 0
    for entry_id, tasks in by_entry.items():
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is not None:
            write_tasks(hass, entry, tasks)
            count += len(tasks)
    return count
