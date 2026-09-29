"""Moving a backup to another instance: what ids cannot carry, names do.

A JSON import mints fresh object, task and part ids, and HA user ids exist
only on the instance that created them. Everything that points at them by id
lost its target on a move (round-trip audit 2026-09-29):

* task assignments, rotation pools and "completed by" — HA user ids; the
  orphan sweep then cleared the assignments at the next start, silently;
* task groups and the vacation exemptions — kept in the SETTINGS export with
  the old entry/task ids, so the groups came back empty;
* an object's device link and an adopted task's fingerprint — HA device ids,
  minted per instance, so the moved object lost its device and discovery
  offered the same appliance again as a new object.

The exports therefore name what they point at — ``users`` ({user id: name})
next to the objects and the settings, ``devices`` ({device id: the device's
integration identifiers}) next to the objects, ``task_names`` ({task id:
{object, task}}) next to the settings — and the import maps by those where
the id does not resolve. A reference that still resolves is never touched, so a
restore next to the originals keeps pointing at the originals.
"""

from __future__ import annotations

from collections.abc import Iterable
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import (
    CONF_GROUPS,
    CONF_OBJECT,
    CONF_SAVED_FILTER_VIEWS,
    CONF_TASKS,
    CONF_VACATION_EXEMPT_TASK_IDS,
)
from .aggregate import get_object_entries

USERS_KEY = "users"
DEVICES_KEY = "devices"
TASK_NAMES_KEY = "task_names"
CURRENT_USER = "current_user"


def _norm(name: Any) -> str:
    return str(name or "").strip().casefold()


# --- users -----------------------------------------------------------------


def _task_user_ids(task: dict[str, Any]) -> Iterable[str]:
    if isinstance(task.get("responsible_user_id"), str):
        yield task["responsible_user_id"]
    for uid in task.get("assignee_pool") or []:
        if isinstance(uid, str):
            yield uid
    for entry in task.get("history") or []:
        if isinstance(entry, dict) and isinstance(entry.get("completed_by"), str):
            yield entry["completed_by"]


def _view_user_ids(settings: dict[str, Any]) -> Iterable[str]:
    for view in settings.get(CONF_SAVED_FILTER_VIEWS) or []:
        filters = view.get("filters") if isinstance(view, dict) else None
        uid = filters.get("user_id") if isinstance(filters, dict) else None
        if isinstance(uid, str) and uid != CURRENT_USER:
            yield uid


async def async_attach_move_hints(hass: HomeAssistant, data: dict[str, Any]) -> dict[str, Any]:
    """Name what the export points at by instance-bound id: ``users`` (the
    display name of every HA user — tasks of ``objects``, saved views of
    ``global_settings``) and ``devices`` (see :func:`attach_device_hints`)."""
    attach_device_hints(hass, data)
    ids: set[str] = set()
    for obj in data.get("objects") or []:
        tasks = obj.get("tasks") if isinstance(obj, dict) else None
        for task in tasks if isinstance(tasks, list) else []:
            if isinstance(task, dict):
                ids.update(_task_user_ids(task))
    settings = data.get("global_settings")
    if isinstance(settings, dict):
        ids.update(_view_user_ids(settings))
    if not ids:
        return data
    names = {u.id: u.name for u in await hass.auth.async_get_users() if u.id in ids and u.name}
    if names:
        data[USERS_KEY] = names
    return data


async def async_user_map(hass: HomeAssistant, hints: Any) -> tuple[dict[str, str], list[str]]:
    """(old id → id on this instance, names that match nobody).

    An id that exists here stays as it is (a restore on the same instance).
    Otherwise the name from the export's ``users`` picks the one active
    person with that name here; none or several → unmatched, reported. Two
    people who shared a name at the source (a former and a current member,
    say) are not both folded into the one person here — they are reported
    too. A system user (Supervisor and the like, which appear as "completed
    by" of automated completions) maps to the system user of the same name
    here instead of being reported as a missing person (bug audit
    2026-09-29).
    """
    users = await hass.auth.async_get_users()
    known = {u.id for u in users}
    people: dict[str, list[str]] = {}
    system: dict[str, list[str]] = {}
    for u in users:
        if u.is_active and u.name:
            (system if u.system_generated else people).setdefault(_norm(u.name), []).append(u.id)
    mapping: dict[str, str] = {}
    unmatched: set[str] = set()
    if not isinstance(hints, dict):
        return mapping, []
    wanted = {old_id: name for old_id, name in hints.items() if isinstance(old_id, str) and isinstance(name, str) and old_id not in known}
    shared: dict[str, int] = {}
    for name in wanted.values():
        shared[_norm(name)] = shared.get(_norm(name), 0) + 1
    for old_id, name in wanted.items():
        key = _norm(name)
        candidates = people.get(key) or system.get(key) or []
        if len(candidates) == 1 and shared[key] == 1:
            mapping[old_id] = candidates[0]
        else:
            unmatched.add(name.strip()[:100])
    return mapping, sorted(unmatched)


def remap_task_users(task: dict[str, Any], mapping: dict[str, str]) -> None:
    """Point a task's user references at this instance's users (in place).
    References without a match stay — the orphan sweep clears them."""
    if not mapping:
        return
    if isinstance(uid := task.get("responsible_user_id"), str) and uid in mapping:
        task["responsible_user_id"] = mapping[uid]
    pool = task.get("assignee_pool")
    if isinstance(pool, list):
        seen: list[str] = []
        for uid in pool:
            new = mapping.get(uid, uid) if isinstance(uid, str) else uid
            if new not in seen:
                seen.append(new)
        task["assignee_pool"] = seen
    for entry in task.get("history") or []:
        if isinstance(entry, dict) and isinstance(entry.get("completed_by"), str) and entry["completed_by"] in mapping:
            entry["completed_by"] = mapping[entry["completed_by"]]


def remap_view_users(views: list[dict[str, Any]], mapping: dict[str, str]) -> None:
    """Saved views filtering on one person follow that person. A view whose
    person matches nobody keeps the old id (it shows nothing) rather than
    silently turning into an unfiltered view."""
    for view in views:
        filters = view.get("filters")
        if isinstance(filters, dict) and isinstance(filters.get("user_id"), str) and filters["user_id"] in mapping:
            filters["user_id"] = mapping[filters["user_id"]]


# --- devices ---------------------------------------------------------------


def attach_device_hints(hass: HomeAssistant, data: dict[str, Any]) -> dict[str, Any]:
    """Add ``devices`` — the integration identifiers (stable across
    installations, e.g. ``["roborock", "q7_1234"]``) of every device an
    exported object is linked to or an adopted task was fingerprinted on."""
    from homeassistant.helpers import device_registry as dr

    ids: set[str] = set()
    for obj in data.get("objects") or []:
        if not isinstance(obj, dict):
            continue
        if isinstance(device_id := (obj.get("object") or {}).get("ha_device_id"), str):
            ids.add(device_id)
        for task in obj.get("tasks") or []:
            origin = task.get("origin") if isinstance(task, dict) else None
            if isinstance(origin, dict) and isinstance(origin.get("device_id"), str):
                ids.add(origin["device_id"])
    dev_reg = dr.async_get(hass)
    hints: dict[str, Any] = {}
    for device_id in sorted(ids):
        device = dev_reg.async_get(device_id)
        # A child device (HA 2026.9) has identifiers only.
        connections = getattr(device, "connections", None) or set()
        if device is None or not (device.identifiers or connections):
            continue
        # Connections too: an ESPHome device carries only its MAC address.
        hints[device_id] = {
            "identifiers": sorted([list(i) for i in device.identifiers]),
            "connections": sorted([list(c) for c in connections]),
            "name": device.name_by_user or device.name,
        }
    if hints:
        data[DEVICES_KEY] = hints
    return data


def device_map(hass: HomeAssistant, hints: Any) -> dict[str, str]:
    """old device id → the device on this instance with the same integration
    identifiers. An id that exists here stays; one that matches nothing stays
    too (the integration may not be set up yet — linking later works)."""
    from homeassistant.helpers import device_registry as dr

    mapping: dict[str, str] = {}
    if not isinstance(hints, dict):
        return mapping
    dev_reg = dr.async_get(hass)
    for old_id, hint in hints.items():
        if not isinstance(old_id, str) or dev_reg.async_get(old_id) is not None or not isinstance(hint, dict):
            continue
        identifiers = _pairs(hint.get("identifiers"))
        connections = _pairs(hint.get("connections"))
        if (identifiers or connections) and (device := _find_device(hass, dev_reg, identifiers, connections)) is not None:
            mapping[old_id] = device.id
    return mapping


def _pairs(raw: Any) -> set[tuple[str, str]]:
    """``[[a, b], …]`` from an export as a set of string pairs (junk skipped)."""
    if not isinstance(raw, list):
        return set()
    return {(str(p[0]), str(p[1])) for p in raw if isinstance(p, (list, tuple)) and len(p) == 2}


def _find_device(
    hass: HomeAssistant, dev_reg: Any, identifiers: set[tuple[str, str]], connections: set[tuple[str, str]]
) -> Any:
    """The device carrying one of these identifiers or connections.

    Before the 2026.8 device split the legacy ``async_get_device`` answers
    directly. Since then identifiers are unique per config entry only and that
    call is deprecated (removed HA 2027.8): ``async_get_devices`` searches every
    config entry — the first element of an identifier is not always the
    integration (HomeKit uses ``homekit_controller:accessory-id``), and an
    ESPHome device has only its MAC connection — preferring the identifier's
    own integration when a split left several. A child device (2026.9+) is
    found per config entry. Looking only at the entries of the identifier's
    domain left all of those unlinked (bug audit 2026-09-29)."""
    get_devices = getattr(dev_reg, "async_get_devices", None)
    if get_devices is None:
        return dev_reg.async_get_device(identifiers=identifiers or None, connections=connections or None)
    matches = get_devices(identifiers=identifiers or None, connections=connections or None)
    if matches:
        domains = {domain for domain, _ in identifiers}
        for device in matches:
            entry = hass.config_entries.async_get_entry(getattr(device, "config_entry_id", "") or "")
            if entry is not None and entry.domain in domains:
                return device
        return matches[0]
    get_child = getattr(dev_reg, "async_get_child_device_by_identifier", None)
    if get_child is not None and identifiers:
        for entry in hass.config_entries.async_entries():
            for identifier in sorted(identifiers):
                if (child := get_child(identifier, entry.entry_id)) is not None:
                    return child
    return None


def remap_task_device(task: dict[str, Any], mapping: dict[str, str]) -> None:
    """An adopted task's fingerprint follows its device (in place)."""
    origin = task.get("origin")
    if mapping and isinstance(origin, dict) and origin.get("device_id") in mapping:
        task["origin"] = {**origin, "device_id": mapping[origin["device_id"]]}


# --- task references in the settings ----------------------------------------


def _task_archived(entry: Any, task: dict[str, Any]) -> bool:
    return bool(task.get("archived_at") or (entry.data.get(CONF_OBJECT) or {}).get("archived_at"))


def _live_tasks(
    hass: HomeAssistant,
) -> tuple[set[tuple[str, str]], dict[tuple[str, str], list[tuple[str, str, bool]]]]:
    """(live (entry_id, task_id) pairs, (object name, task name) →
    [(entry_id, task_id, archived)])."""
    live: set[tuple[str, str]] = set()
    by_name: dict[tuple[str, str], list[tuple[str, str, bool]]] = {}
    for entry in get_object_entries(hass):
        obj_name = _norm((entry.data.get(CONF_OBJECT) or {}).get("name"))
        for task_id, task in (entry.data.get(CONF_TASKS) or {}).items():
            live.add((entry.entry_id, task_id))
            by_name.setdefault((obj_name, _norm(task.get("name"))), []).append(
                (entry.entry_id, task_id, _task_archived(entry, task))
            )
    return live, by_name


def settings_task_names(hass: HomeAssistant, settings: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """``task_names`` for the settings export: object + task name of every
    task a group or the vacation exemptions point at."""
    wanted: set[str] = set()
    for group in (settings.get(CONF_GROUPS) or {}).values():
        refs = group.get("task_refs") if isinstance(group, dict) else None
        for ref in refs if isinstance(refs, list) else []:
            if isinstance(ref, dict) and isinstance(ref.get("task_id"), str):
                wanted.add(ref["task_id"])
    wanted.update(t for t in settings.get(CONF_VACATION_EXEMPT_TASK_IDS) or [] if isinstance(t, str))
    out: dict[str, dict[str, Any]] = {}
    for entry in get_object_entries(hass):
        obj_name = str((entry.data.get(CONF_OBJECT) or {}).get("name") or "")
        for task_id, task in (entry.data.get(CONF_TASKS) or {}).items():
            if task_id in wanted:
                # archived: a replaced object keeps its name for its successor
                # by default, so the name alone can fit two tasks.
                out[task_id] = {"object": obj_name, "task": str(task.get("name") or ""), "archived": _task_archived(entry, task)}
    return out


def resolve_task_refs_by_name(hass: HomeAssistant, settings: dict[str, Any], hints: Any) -> None:
    """Settings imported AFTER the objects: re-point the group members and
    vacation exemptions whose ids resolve nowhere by object + task name (in
    place). Unresolved ones stay for a later objects import to repair."""
    if not isinstance(hints, dict) or not hints:
        return
    live, by_name = _live_tasks(hass)
    live_tasks = {task_id for _, task_id in live}

    def _by_name(task_id: str) -> tuple[str, str] | None:
        hint = hints.get(task_id)
        if not isinstance(hint, dict):
            return None
        found = by_name.get((_norm(hint.get("object")), _norm(hint.get("task"))), [])
        if len(found) > 1:
            # A retired object and its same-named successor: the task with
            # the archive state the export recorded (a hint from before that
            # field means the active one). Giving up here left the successor's
            # group members pointing nowhere (bug audit 2026-09-29).
            want = hint["archived"] if isinstance(hint.get("archived"), bool) else False
            found = [f for f in found if f[2] == want]
        return (found[0][0], found[0][1]) if len(found) == 1 else None

    for group in (settings.get(CONF_GROUPS) or {}).values():
        refs = []
        for ref in group.get("task_refs") or []:
            if not (isinstance(ref, dict) and isinstance(ref.get("entry_id"), str) and isinstance(ref.get("task_id"), str)):
                continue
            if (ref["entry_id"], ref["task_id"]) not in live and (hit := _by_name(ref["task_id"])) is not None:
                ref = {"entry_id": hit[0], "task_id": hit[1]}
            if ref not in refs:
                refs.append(ref)
        group["task_refs"] = refs
    exempt = settings.get(CONF_VACATION_EXEMPT_TASK_IDS)
    if isinstance(exempt, list):
        out: list[str] = []
        for task_id in exempt:
            if not isinstance(task_id, str):
                continue
            if task_id not in live_tasks and (hit := _by_name(task_id)) is not None:
                task_id = hit[1]
            if task_id not in out:
                out.append(task_id)
        settings[CONF_VACATION_EXEMPT_TASK_IDS] = out


def repair_task_refs(options: dict[str, Any], hass: HomeAssistant, task_map: dict[str, tuple[str, str]]) -> dict[str, Any]:
    """Objects imported AFTER (or with) the settings: point the group members
    and vacation exemptions that resolve nowhere at the freshly imported
    tasks (old task id → (new entry id, new task id)). Returns the changed
    option keys ({} when nothing moved)."""
    if not task_map:
        return {}
    live, _ = _live_tasks(hass)
    live_tasks = {task_id for _, task_id in live}
    changed: dict[str, Any] = {}

    groups = options.get(CONF_GROUPS)
    if isinstance(groups, dict):
        new_groups: dict[str, Any] = {}
        moved = False
        for gid, group in groups.items():
            if not isinstance(group, dict):
                new_groups[gid] = group
                continue
            refs = []
            for ref in group.get("task_refs") or []:
                if (
                    isinstance(ref, dict)
                    and isinstance(ref.get("entry_id"), str)
                    and isinstance(ref.get("task_id"), str)
                    and (ref["entry_id"], ref["task_id"]) not in live
                    and ref["task_id"] in task_map
                ):
                    new_entry, new_task = task_map[ref["task_id"]]
                    ref = {"entry_id": new_entry, "task_id": new_task}
                    moved = True
                if ref not in refs:
                    refs.append(ref)
            new_groups[gid] = {**group, "task_refs": refs}
        if moved:
            changed[CONF_GROUPS] = new_groups

    exempt = options.get(CONF_VACATION_EXEMPT_TASK_IDS)
    if isinstance(exempt, list):
        out: list[str] = []
        moved = False
        for task_id in exempt:
            if isinstance(task_id, str) and task_id not in live_tasks and task_id in task_map:
                task_id = task_map[task_id][1]
                moved = True
            if task_id not in out:
                out.append(task_id)
        if moved:
            changed[CONF_VACATION_EXEMPT_TASK_IDS] = out
    return changed
