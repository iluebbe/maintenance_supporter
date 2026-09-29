"""Adoption without duplicates (2.94).

Suggested setups used to create a NEW object for every device no object was
linked to, and to compare suggested tasks with the target's tasks by exact
name only. In a real home that doubled the washer and the dryer (the user's
objects carried the model but no device link), the second wallbox (one object
stood for both), and lubrication tasks named differently than the catalog's.

Two questions, answered from what is already in Home Assistant:

* :func:`candidate_object` — which existing object a device most likely IS:
  its model number or its name appears in the device's name, the area
  matches, or it stands for a sibling device of the same integration and
  model. The adoption dialog then offers "add to that object" first.
* :func:`covering_task` — whether the target already has a task for a
  suggested duty under another name: two shared word stems ("Filter
  reinigen" ~ "Laugenfilter reinigen"), the same rare action on the same
  object (lubricating, descaling), or the same measured quantity (a pressure
  task on another pressure sensor). Such duties are shown, but not ticked.
"""

from __future__ import annotations

import re
from collections.abc import Collection, Iterable, Mapping
from typing import TYPE_CHECKING, Any

from ..const import CONF_OBJECT, CONF_TASKS

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

_WORD = re.compile(r"[^\W_]+", re.UNICODE)
# Words that say nothing about WHAT is maintained.
_STOP = frozenset(
    ["und", "and", "the", "der", "die", "das", "den", "dem", "des", "von", "vom", "zum", "zur", "für", "for", "of", "to", "mit", "with", "oder", "or", "et", "de", "la", "le", "les", "des", "du", "y", "el", "los", "las", "en", "e", "il", "lo", "di", "del", "della", "a", "an", "van", "het", "een", "og", "och", "eller", "i", "på", "per", "pro", "na", "do"]
)
# Roots in their STEMMED form (_stems cuts "grease" to "greas"). One per
# object is the norm: a second task with this action on the same
# object is almost certainly the same job under another name.
_RARE_ACTIONS: dict[str, tuple[str, ...]] = {
    "lubricate": ("schmier", "lubric", "lubrif", "greas", "graiss", "smer", "smør", "smörj", "voitel", "smar", "zsíroz"),
    "descale": ("entkalk", "descal", "detartr", "détartr", "ontkalk", "decalcif", "anticalc", "avkalk", "kalkinpois", "vízkő", "odvápn"),
}
_ENDINGS = ("ungen", "ung", "ing", "en", "er", "ed", "es", "e", "s", "n")
_MIN_SCORE = 3


def _stems(text: str) -> set[str]:
    out: set[str] = set()
    for word in _WORD.findall(text.casefold()):
        if word in _STOP or word.isdigit() or len(word) < 3:
            continue
        for end in _ENDINGS:
            if word.endswith(end) and len(word) - len(end) >= 4:
                word = word[: -len(end)]
                break
        out.add(word)
    return out


def _same(a: str, b: str) -> bool:
    return a == b or (min(len(a), len(b)) >= 4 and (a in b or b in a))


def _shared(a: set[str], b: set[str]) -> int:
    return sum(1 for x in a if any(_same(x, y) for y in b))


def _rare_action(stems: set[str]) -> str | None:
    for action, roots in _RARE_ACTIONS.items():
        if any(stem.startswith(root) or root in stem for stem in stems for root in roots):
            return action
    return None


def _tokens(*texts: str | None) -> set[str]:
    return {w for t in texts if t for w in _WORD.findall(t.casefold())}


# ─── which object a device is ────────────────────────────────────────────


def _attr(device: Any, name: str) -> str:
    """A device attribute that HA 2026.9's sub-devices (ChildDeviceEntry)
    do not carry — model and manufacturer — read safely."""
    return str(getattr(device, name, None) or "")


def _integration_of(hass: HomeAssistant, device: Any) -> set[str]:
    return {
        e.domain
        for eid in getattr(device, "config_entries", ()) or ()
        if (e := hass.config_entries.async_get_entry(eid)) is not None
    }


def candidate_object(hass: HomeAssistant, device_id: str) -> dict[str, Any] | None:
    """The existing, unarchived object this device most likely is — or None.

    ``{"entry_id", "name", "reasons"}``; reasons are codes the dialog
    translates: ``model`` (the object's model number is in the device name or
    model), ``name`` (a word of the object's name is), ``area`` (same area),
    ``sibling`` (the object is linked to another device of the same
    integration with the same maker and model — one object for two wallboxes).
    Two equally good objects → None: the user picks, we don't guess.
    """
    from homeassistant.helpers import device_registry as dr

    from .aggregate import get_object_entries, object_name

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get(device_id)
    if device is None:
        return None
    dev_words = _tokens(device.name_by_user, device.name, _attr(device, "model"), _attr(device, "manufacturer"))
    dev_domains = _integration_of(hass, device)
    scored: list[tuple[int, str, str, list[str]]] = []
    for entry in get_object_entries(hass):
        obj = entry.data.get(CONF_OBJECT) or {}
        if obj.get("archived_at") is not None:
            continue
        bound = obj.get("ha_device_id")
        score, reasons = 0, []
        if bound:
            if bound == device_id:
                return None  # already linked — the caller's bound object wins
            other = dev_reg.async_get(bound)
            if (
                other is not None
                and _attr(device, "model")
                and _attr(other, "model") == _attr(device, "model")
                and _attr(other, "manufacturer") == _attr(device, "manufacturer")
                and dev_domains & _integration_of(hass, other)
            ):
                score, reasons = 3, ["sibling"]
        else:
            numbers = {w for w in _tokens(obj.get("model"), obj.get("manufacturer")) if any(c.isdigit() for c in w) and len(w) >= 3}
            if numbers & dev_words:
                score += 3
                reasons.append("model")
            if {w for w in _tokens(obj.get("name")) if len(w) >= 4} & dev_words:
                score += 2
                reasons.append("name")
            if obj.get("area_id") and obj.get("area_id") == device.area_id:
                score += 1
                reasons.append("area")
        if score >= _MIN_SCORE:
            scored.append((score, entry.entry_id, object_name(entry), reasons))
    if not scored:
        return None
    scored.sort(key=lambda s: s[0], reverse=True)
    if len(scored) > 1 and scored[0][0] == scored[1][0]:
        return None
    _, entry_id, name, reasons = scored[0]
    return {"entry_id": entry_id, "name": name, "reasons": reasons}


# ─── whether the target already has the task ─────────────────────────────


def _quantity(hass: HomeAssistant, entity_id: str) -> tuple[str, str] | None:
    state = hass.states.get(entity_id)
    if state is None:
        return None
    device_class = state.attributes.get("device_class")
    if not device_class:
        return None
    return str(device_class), str(state.attributes.get("unit_of_measurement") or "")


def covering_task(
    hass: HomeAssistant,
    names: Collection[str],
    entity_ids: Iterable[str],
    tasks: Mapping[str, Mapping[str, Any]],
    *,
    ignore: Collection[str | None] = (),
) -> dict[str, str] | None:
    """The target's task that most likely already covers a suggested duty.

    ``names`` are the duty's names (localized and catalog), ``entity_ids``
    what its trigger would watch, ``tasks`` the target's tasks. Returns
    ``{"task_id", "name", "reason"}`` with reason ``similar_name``,
    ``same_action`` or ``same_quantity`` — or None. Exact names are the
    caller's business (they are not proposed at all). ``ignore`` are texts
    whose words say nothing about the job — the device's and the object's
    names ("Nuki Smart Lock … Batterie kritisch" must not match "Akku laden
    (Smart Lock Pro)" on "smart" + "lock").
    """
    from ..entity.triggers import normalize_entity_ids

    noise = set().union(*(_stems(t) for t in ignore if t)) if ignore else set()
    duty_stems = (set().union(*(_stems(n) for n in names if n)) if names else set()) - noise
    duty_action = _rare_action(duty_stems)
    duty_quantities = {q for eid in entity_ids if (q := _quantity(hass, eid)) is not None}
    for task_id, task in tasks.items():
        if task.get("archived_at"):
            continue
        name = str(task.get("name") or "")
        stems = _stems(name) - noise
        if _shared(duty_stems, stems) >= 2:
            return {"task_id": task_id, "name": name, "reason": "similar_name"}
        if duty_action and _rare_action(stems) == duty_action:
            return {"task_id": task_id, "name": name, "reason": "same_action"}
        tc = task.get("trigger_config")
        if duty_quantities and isinstance(tc, Mapping) and tc.get("type") == "threshold":
            if any(_quantity(hass, eid) in duty_quantities for eid in normalize_entity_ids(dict(tc))):
                return {"task_id": task_id, "name": name, "reason": "same_quantity"}
    return None


def target_tasks(entry: ConfigEntry | None) -> dict[str, Any]:
    return dict(entry.data.get(CONF_TASKS, {})) if entry is not None else {}
