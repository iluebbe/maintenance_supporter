"""One-click setup of the Battery Fleet: an object whose PARTS are battery
types and whose single task aggregates all low batteries.

Design (see helpers/battery_fleet.py for the aggregation): the fleet is ONE
object; each battery TYPE present becomes a tracked spare-part (so the existing
stock/reorder machinery handles "order in time"); ONE task "Replace low
batteries" hangs off the global battery-low count sensor via an ordinary
threshold trigger. No per-battery task.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any
from uuid import uuid4

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from ..const import (
    BATTERY_FLEET_EXCLUDED,
    BATTERY_FLEET_INCLUDED,
    BATTERY_FLEET_OBJECT_FLAG,
    BATTERY_FLEET_TASK_FLAG,
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DOMAIN,
)
from .battery_fleet import _norm_type, discover_battery_types, lifetime_months, read_batteries

# The global aggregate sensor the fleet task triggers on (fixed entity_id).
LOW_COUNT_ENTITY_ID = "sensor.maintenance_supporter_batteries_to_replace"

# Hygiene bound on the manual exclude/include lists (security review
# 2026-08-21): both are write-gated, but nothing else limited their growth —
# a scripted operator could bloat the fleet object's config entry without
# bound. 2000 is far above any real fleet.
FLEET_LIST_CAP = 2000

# Marker on the object + task so the panel renders the battery detail section
# and setup is idempotent (never a second fleet).
OBJECT_FLAG = BATTERY_FLEET_OBJECT_FLAG
TASK_FLAG = BATTERY_FLEET_TASK_FLAG


def find_fleet_entry(hass: HomeAssistant) -> ConfigEntry | None:
    """The existing Battery Fleet object entry, or None."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.data.get(CONF_OBJECT, {}).get(OBJECT_FLAG):
            return entry
    return None


async def async_setup_battery_fleet(hass: HomeAssistant, language: str | None = None) -> dict[str, Any]:
    """Create (or return) the Battery Fleet object with type-parts + the task.

    Idempotent: a second call reconciles the type-parts against the current
    fleet (adds parts for newly-seen types) and returns the existing entry.
    ``language`` is the caller's UI language (same contract as the template
    WS): the created object/task/part names and notes are localized through
    the ``_T`` table, falling back to the server language, then English.
    """
    from ..websocket.objects import async_create_object
    from ..websocket.tasks_persist import async_persist_task
    from .i18n import normalize_language, normalize_language_code
    from .parts import normalize_part

    lang = normalize_language_code(language) if language else normalize_language(hass)
    types = discover_battery_types(hass)  # {TYPE: total_qty}

    existing = find_fleet_entry(hass)
    if existing is not None:
        added_pids = _reconcile_type_parts(hass, existing, types, lang)
        # Track stock at 0 for the parts just added — the CREATE path below
        # does, and a part left untracked (stock None) shows no stock line
        # and never flags for reorder. Found on a real fleet: types added by
        # a later reconcile sat untracked next to setup-created "0 pcs/2"
        # siblings, silently disarming their reorder thresholds.
        if added_pids:
            rd = getattr(existing, "runtime_data", None)
            store = getattr(rd, "store", None) if rd else None
            if store is not None:
                for pid in added_pids:
                    store.set_part_stock(pid, 0)
                await store.async_save()
        repaired = await _reconcile_fleet_task(hass, existing, lang)
        return {
            "entry_id": existing.entry_id,
            "created": False,
            "types": list(types),
            "parts_added": len(added_pids),
            "task_repaired": repaired,
        }

    from ..templates import localize_template_text

    entry_id = await async_create_object(hass, name=localize_template_text("Battery Fleet", lang) or "Battery Fleet")
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None:  # pragma: no cover — just created above
        raise HomeAssistantError("Battery Fleet object entry vanished after creation")

    # Flag the object + attach a type-part per battery type present.
    new_data = dict(entry.data)
    obj = dict(new_data.get(CONF_OBJECT, {}))
    obj[OBJECT_FLAG] = True
    new_data[CONF_OBJECT] = obj
    parts: dict[str, dict[str, Any]] = {}
    for btype, total_qty in types.items():
        part = normalize_part(_type_part(btype, total_qty, lang))
        parts[part["id"]] = part
    new_data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Track stock at 0 for each type (user counts their drawer later).
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        for pid in parts:
            store.set_part_stock(pid, 0)
        await store.async_save()

    # The single aggregate task, triggered by the global low-count sensor.
    task = _fleet_task(obj.get("id", ""), lang)
    await async_persist_task(hass, entry, task)

    return {
        "entry_id": entry_id,
        "created": True,
        "types": list(types),
        "parts_added": len(parts),
        "task_id": task["id"],
    }


def _fleet_trigger_config() -> dict[str, Any]:
    """The canonical fleet-task trigger: threshold >0 on the low-count sensor.

    Carries BOTH the singular ``entity_id`` and plural ``entity_ids`` — the
    task-dialog's save path gates on the singular field, and a (possibly
    cached) frontend that hydrates only ``entity_id`` would otherwise wipe
    the trigger on an unrelated edit (issue #106).
    """
    return {
        "type": "threshold",
        "entity_id": LOW_COUNT_ENTITY_ID,
        "entity_ids": [LOW_COUNT_ENTITY_ID],
        "trigger_above": 0,
        "entity_logic": "any",
        "auto_complete_on_recovery": True,
    }


def _fleet_task(obj_id: str, lang: str) -> dict[str, Any]:
    """The single aggregate fleet task, with localized name + notes."""
    from ..templates import localize_template_text

    return {
        "id": uuid4().hex,
        "object_id": obj_id,
        "name": localize_template_text("Replace low batteries", lang) or "Replace low batteries",
        "type": "inspection",
        "enabled": True,
        TASK_FLAG: True,
        "schedule": {"kind": "manual"},
        "trigger_config": _fleet_trigger_config(),
        "created_at": dt_util.now().date().isoformat(),
        "notes": localize_template_text(
            "Aggregate battery check. The detail view lists which devices are low and which battery types to buy.",
            lang,
        ),
    }


def _type_part(btype: str, total_qty: int, lang: str) -> dict[str, Any]:
    """A spare-part definition for one battery type (localized name/notes).

    reorder_threshold defaults to keeping a spare set roughly the size of the
    fleet's need for that type (min 2); restock is double that. auto_buy_task
    stays off so setup never spawns extra buy-tasks — the fleet task's detail
    is the shopping surface; the user can enable auto-buy per type later.
    """
    from ..templates import localize_template_text

    threshold = max(2, total_qty)
    name_tpl = localize_template_text("{type} battery", lang) or "{type} battery"
    notes_tpl = localize_template_text("Typical service life ~{months} months.", lang) or "Typical service life ~{months} months."
    return {
        "id": f"batt_{btype.lower()}",
        "name": name_tpl.format(type=btype),
        "unit": "pcs",
        "reorder_threshold": threshold,
        "restock_quantity": threshold * 2,
        "auto_buy_task": False,
        "notes": notes_tpl.format(months=lifetime_months(btype)),
    }


# ── retranslating the seeded texts (issue #115) ────────────────────────────
#
# Setup writes the object/task/part names and notes ONCE, in the language that
# happened to be current — and nothing ever touched them again, so a fleet set
# up before localized seeding existed (v2.38) keeps English notes forever while
# every runtime string around them is translated. The panel's runtime strings
# follow the UI language; these stored ones can only follow it if something
# rewrites them.
#
# The rule that makes rewriting safe: a stored text is only replaced when it
# EXACTLY matches one of the known template variants (any language), i.e. the
# user never edited it. Anything the user typed stays.


def _template_variants(text_en: str) -> set[str]:
    """The English template plus every translation of it."""
    from ..templates_i18n import _T

    return {text_en} | set(_T.get(text_en, {}).values())


def _extract_placeholder(stored: str, text_en: str, placeholder: str) -> str | None:
    """The placeholder's value, if ``stored`` matches any variant of the template.

    ``"AA-batteri"`` against ``"{type} battery"`` finds the Danish variant
    ``"{type}-batteri"``, matches prefix/suffix and returns ``"AA"``. Returns
    None when no variant matches — the user rewrote the text.
    """
    token = "{" + placeholder + "}"
    for variant in _template_variants(text_en):
        prefix, sep, suffix = variant.partition(token)
        if not sep:
            continue
        if stored.startswith(prefix) and stored.endswith(suffix) and len(stored) > len(prefix) + len(suffix):
            return stored[len(prefix) : len(stored) - len(suffix)]
    return None


def retranslate_seeded_texts(hass: HomeAssistant, entry: ConfigEntry, lang: str) -> bool:
    """Bring untouched seeded texts into ``lang``. Returns True when changed.

    Runs at every fleet-entry setup: cheap string comparisons, and idempotent —
    once the texts are in the current language they match that language's
    variant and are rewritten to themselves.

    The boot-time caller passes the SERVER language, so untouched seeded texts
    converge on it — the same convention notifications and digests follow,
    because stored data is shared by every user of the instance. Seeding still
    honours the caller's UI language for the immediate result; if the two
    differ, the next reload converges.
    """
    from ..templates import localize_template_text

    changed = False
    data = dict(entry.data)

    def _localized(text_en: str) -> str:
        return localize_template_text(text_en, lang) or text_en

    obj = dict(data.get(CONF_OBJECT) or {})
    if obj.get("name") in _template_variants("Battery Fleet") and obj.get("name") != _localized("Battery Fleet"):
        obj["name"] = _localized("Battery Fleet")
        data[CONF_OBJECT] = obj
        changed = True

    tasks = dict(data.get(CONF_TASKS) or {})
    for task_id, task in tasks.items():
        if not task.get(TASK_FLAG):
            continue
        new_task = dict(task)
        if new_task.get("name") in _template_variants("Replace low batteries"):
            new_task["name"] = _localized("Replace low batteries")
        notes_en = "Aggregate battery check. The detail view lists which devices are low and which battery types to buy."
        if new_task.get("notes") in _template_variants(notes_en):
            new_task["notes"] = _localized(notes_en)
        if new_task != task:
            tasks[task_id] = new_task
            data[CONF_TASKS] = tasks
            changed = True

    parts = dict(data.get(CONF_PARTS) or {})
    for part_id, part in parts.items():
        if not str(part_id).startswith("batt_"):
            continue
        new_part = dict(part)
        btype = _extract_placeholder(str(new_part.get("name") or ""), "{type} battery", "type")
        if btype is not None:
            new_part["name"] = (_localized("{type} battery")).format(type=btype)
        months = _extract_placeholder(str(new_part.get("notes") or ""), "Typical service life ~{months} months.", "months")
        if months is not None:
            new_part["notes"] = (_localized("Typical service life ~{months} months.")).format(months=months)
        if new_part != part:
            parts[part_id] = new_part
            data[CONF_PARTS] = parts
            changed = True

    if changed:
        title = (data.get(CONF_OBJECT) or {}).get("name") or entry.title
        hass.config_entries.async_update_entry(entry, data=data, title=title)
    return changed


def replaced_button_for(battery_plus_entity_id: str) -> str:
    """The Battery Notes 'replaced' button entity id for a battery_plus sensor.

    Battery Notes mints them in parallel: sensor.<x>_battery_plus ->
    button.<x>_battery_replaced.
    """
    # #121 low-only notes are binary_sensor.<x>_battery_plus_low; their button
    # is still button.<x>_battery_replaced (bug audit 2026-08-29).
    if battery_plus_entity_id.startswith("binary_sensor."):
        return (
            battery_plus_entity_id.replace("binary_sensor.", "button.", 1)
            .replace("_battery_plus_low", "_battery_replaced")
            .replace("_battery_plus", "_battery_replaced")
        )
    return battery_plus_entity_id.replace("sensor.", "button.", 1).replace("_battery_plus", "_battery_replaced")


async def async_mark_replaced(hass: HomeAssistant, entity_ids: list[str] | None = None) -> dict[str, Any]:
    """Mark batteries replaced: press their Battery Notes 'replaced' button
    (records the replacement date → resets the forecast) and consume the
    matching type-part spares from stock.

    ``entity_ids`` = battery_plus sensors to mark; default = all currently low.
    The fleet task auto-completes on its own once the devices report fresh
    (low count → 0), so this does NOT complete the task directly (which would
    race that recovery).
    """
    by_eid = {b.entity_id: b for b in read_batteries(hass)}
    targets = entity_ids if entity_ids is not None else [e for e, b in by_eid.items() if b.low]

    pressed = 0
    by_type: dict[str, int] = {}
    for eid in targets:
        bat = by_eid.get(eid)
        if bat is None:
            continue
        button = replaced_button_for(eid)
        if hass.states.get(button) is not None:
            await hass.services.async_call("button", "press", {"entity_id": button}, blocking=False)
            pressed += 1
        t = _norm_type(bat.battery_type)
        by_type[t] = by_type.get(t, 0) + bat.quantity

    consumed: dict[str, int] = {}
    fleet = find_fleet_entry(hass)
    if fleet is not None and by_type:
        from ..parts_runtime import async_change_part_stock

        parts = fleet.data.get(CONF_PARTS) or {}
        for btype, qty in by_type.items():
            pid = f"batt_{btype.lower()}"
            if pid in parts:
                await async_change_part_stock(hass, fleet, pid, delta=-qty)
                consumed[pid] = qty

    return {"marked": len(targets), "pressed": pressed, "consumed": consumed}


def _mutate_fleet_object(hass: HomeAssistant, mutate: Callable[[dict[str, Any]], None]) -> bool:
    """Find the fleet entry, apply ``mutate`` to a copy of its object dict,
    persist. Returns False when no fleet exists yet — the shared scaffolding
    the three setters below each hand-rolled (drift audit 2026-08)."""
    entry = find_fleet_entry(hass)
    if entry is None:
        return False
    new_data = dict(entry.data)
    obj = dict(new_data.get(CONF_OBJECT, {}))
    mutate(obj)
    new_data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(entry, data=new_data)
    return True


def set_battery_excluded(hass: HomeAssistant, entity_id: str, excluded: bool) -> bool:
    """Persist a manual exclude/include of one battery on the fleet object.

    Issue #107: some tracked batteries should never appear (a rechargeable
    device the heuristics missed, a neighbour's sensor, …). Stored as
    ``battery_fleet_excluded`` on the fleet object dict. Returns False when
    no fleet exists yet.
    """

    def _apply(obj: dict[str, Any]) -> None:
        current = set(obj.get(BATTERY_FLEET_EXCLUDED) or [])
        if excluded:
            # Symmetry (#135): hiding a manually-added battery removes the
            # manual include instead of stacking an exclusion on top of it.
            includes = set(obj.get(BATTERY_FLEET_INCLUDED) or [])
            if entity_id in includes:
                includes.discard(entity_id)
                obj[BATTERY_FLEET_INCLUDED] = sorted(includes)
            else:
                if len(current) >= FLEET_LIST_CAP and entity_id not in current:
                    raise HomeAssistantError(f"Battery fleet exclusion list is full ({FLEET_LIST_CAP})")
                current.add(entity_id)
        else:
            current.discard(entity_id)
        obj[BATTERY_FLEET_EXCLUDED] = sorted(current)

    return _mutate_fleet_object(hass, _apply)


def set_battery_included(hass: HomeAssistant, entity_id: str, included: bool) -> bool:
    """Persist a manual ADD of one battery to the fleet (#135).

    The include bypasses the discovery heuristic and the self-charging filter
    in the aggregation — for batteries the heuristics miss. Adding also lifts
    a previous exclusion (the user changed their mind). Returns False when no
    fleet exists yet.
    """

    def _apply(obj: dict[str, Any]) -> None:
        includes = set(obj.get(BATTERY_FLEET_INCLUDED) or [])
        if included:
            if len(includes) >= FLEET_LIST_CAP and entity_id not in includes:
                raise HomeAssistantError(f"Battery fleet include list is full ({FLEET_LIST_CAP})")
            includes.add(entity_id)
            excludes = set(obj.get(BATTERY_FLEET_EXCLUDED) or [])
            if entity_id in excludes:
                excludes.discard(entity_id)
                obj[BATTERY_FLEET_EXCLUDED] = sorted(excludes)
        else:
            includes.discard(entity_id)
        obj[BATTERY_FLEET_INCLUDED] = sorted(includes)

    return _mutate_fleet_object(hass, _apply)


def set_track_self_charging(hass: HomeAssistant, enabled: bool) -> bool:
    """Persist the fleet-wide track-self-charging opt-in (#135 follow-up).

    Stored on the fleet object like the exclude/include lists. Returns False
    when no fleet exists yet.
    """
    from ..const import BATTERY_FLEET_TRACK_SELF_CHARGING

    return _mutate_fleet_object(hass, lambda obj: obj.__setitem__(BATTERY_FLEET_TRACK_SELF_CHARGING, bool(enabled)))


def find_fleet_task(entry: ConfigEntry) -> tuple[str, dict[str, Any]] | None:
    """The flagged fleet task (id, data) on the fleet entry, or None."""
    for task_id, task_data in (entry.data.get(CONF_TASKS) or {}).items():
        if task_data.get(TASK_FLAG):
            return task_id, task_data
    return None


def fleet_task_trigger_ok(entry: ConfigEntry) -> bool:
    """Whether the fleet task exists and still carries a usable trigger.

    A user edit can wipe the trigger (issue #106: the dialog nulled a trigger
    stored with only the plural ``entity_ids``); without it the task never
    fires or auto-completes. This is the health signal behind the repair path.
    """
    found = find_fleet_task(entry)
    if found is None:
        return False
    tc = found[1].get("trigger_config") or {}
    eids = tc.get("entity_ids") or ([tc["entity_id"]] if tc.get("entity_id") else [])
    return tc.get("type") == "threshold" and LOW_COUNT_ENTITY_ID in eids


async def _reconcile_fleet_task(hass: HomeAssistant, entry: ConfigEntry, lang: str) -> bool:
    """Repair the fleet task if broken. Returns True when something was fixed.

    * Trigger lost (issue #106) → restore the canonical threshold trigger,
      keeping the user's name/type/translations untouched.
    * Task deleted entirely → recreate it fresh (localized).
    """
    from ..websocket.tasks_persist import async_persist_task

    if fleet_task_trigger_ok(entry):
        return False

    found = find_fleet_task(entry)
    if found is not None:
        task_id, task_data = found
        new_task = dict(task_data)
        new_task["trigger_config"] = _fleet_trigger_config()
        new_data = dict(entry.data)
        new_tasks = dict(new_data.get(CONF_TASKS, {}))
        new_tasks[task_id] = new_task
        new_data[CONF_TASKS] = new_tasks
        hass.config_entries.async_update_entry(entry, data=new_data)
        await hass.config_entries.async_reload(entry.entry_id)
        return True

    obj = entry.data.get(CONF_OBJECT, {})
    await async_persist_task(hass, entry, _fleet_task(obj.get("id", ""), lang))
    return True


async def reconcile_fleet_parts_at_start(hass: HomeAssistant, entry: ConfigEntry, lang: str) -> dict[str, Any]:
    """Boot-time reconcile of the fleet's type-parts (issue #148).

    A battery whose TYPE only becomes known after the fleet was set up (a
    Battery Notes note added later, or a low-only Matter lock whose typed
    ``…_battery_plus_low`` binary arrived with #121) never got its spare
    part: ``_reconcile_type_parts`` only ran on an explicit fleet-setup
    call. Runs the same reconcile once per start — and prunes the legacy
    "UNKNOWN battery" part older versions minted for untyped batteries,
    but ONLY while it is completely untouched (no stock counted, no
    product/vendor data, auto-buy off); the moment a user touched it, it
    is theirs and stays.
    """
    types = discover_battery_types(hass)
    added = _reconcile_type_parts(hass, entry, types, lang)

    pruned = False
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None

    parts = dict(entry.data.get(CONF_PARTS) or {})
    legacy = parts.get("batt_unknown")
    if legacy is not None:
        stock = store.get_part_stock("batt_unknown") if store is not None else None
        untouched = (
            not stock
            and not legacy.get("product_url")
            and not legacy.get("vendor")
            and not legacy.get("mpn")
            and not legacy.get("gtin")
            and not legacy.get("auto_buy_task")
        )
        if untouched:
            parts.pop("batt_unknown")
            new_data = dict(entry.data)
            new_data[CONF_PARTS] = parts
            hass.config_entries.async_update_entry(entry, data=new_data)
            pruned = True
            if store is not None:
                store.remove_part("batt_unknown")

    # #148 follow-up (v2.70.0 aftermath): the prune must not leave the
    # part's stock sensor behind as an unavailable orphan in the entity
    # registry — the official ws_delete_part removes that entry, the v2.70.0
    # prune did not, and HA greys out Delete while the integration still
    # claims the entity. Sweep every part-stock registry entry whose part no
    # longer exists; this also heals installs where the v2.70.0 prune
    # already ran (the part is gone, only the registry corpse remains).
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    orphans_removed = 0
    for reg_entry in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        uid = reg_entry.unique_id or ""
        if "_part_" not in uid:
            continue
        pid = uid.split("_part_", 1)[1]
        if pid and pid not in parts:
            ent_reg.async_remove(reg_entry.entity_id)
            orphans_removed += 1

    if store is not None and (added or pruned):
        for pid in added:
            store.set_part_stock(pid, 0)
        await store.async_save()
    return {"added": added, "pruned": pruned, "orphans_removed": orphans_removed}



def _reconcile_type_parts(hass: HomeAssistant, entry: ConfigEntry, types: dict[str, int], lang: str) -> list[str]:
    """Add parts for battery types newly seen since setup. Returns added ids
    (the caller initializes their stock, mirroring the create path)."""
    from .parts import normalize_part

    parts = dict(entry.data.get(CONF_PARTS) or {})
    existing_ids = set(parts)
    added: list[str] = []
    for btype, total_qty in types.items():
        pid = f"batt_{btype.lower()}"
        if pid not in existing_ids:
            parts[pid] = normalize_part(_type_part(btype, total_qty, lang))
            added.append(pid)
    if added:
        new_data = dict(entry.data)
        new_data[CONF_PARTS] = parts
        hass.config_entries.async_update_entry(entry, data=new_data)
    return added
