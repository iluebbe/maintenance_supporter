"""Moving a backup to another instance: what ids cannot carry, names do.

A JSON import mints fresh object, task and part ids, and HA user ids exist
only on the instance that created them. Everything that points at them by id
lost its target on a move (round-trip audit 2026-09-29):

* task assignments, rotation pools and "completed by" — HA user ids; the
  orphan sweep then cleared the assignments at the next start, silently;
* task groups and the vacation exemptions — kept in the SETTINGS export with
  the old entry/task ids, so the groups came back empty.

The exports therefore name what they point at — ``users`` ({user id: name})
next to the objects and the settings, ``task_names`` ({task id: {object,
task}}) next to the settings — and the import maps by those names where the
id does not resolve. A reference that still resolves is never touched, so a
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


async def async_attach_user_names(hass: HomeAssistant, data: dict[str, Any]) -> dict[str, Any]:
    """Add ``users`` — the display name of every HA user the export points at
    (tasks of ``objects``, saved views of ``global_settings``)."""
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
    person with that name here; none or several → unmatched, reported.
    """
    users = await hass.auth.async_get_users()
    known = {u.id for u in users}
    by_name: dict[str, list[str]] = {}
    for u in users:
        if u.is_active and not u.system_generated and u.name:
            by_name.setdefault(_norm(u.name), []).append(u.id)
    mapping: dict[str, str] = {}
    unmatched: set[str] = set()
    if not isinstance(hints, dict):
        return mapping, []
    for old_id, name in hints.items():
        if not isinstance(old_id, str) or not isinstance(name, str) or old_id in known:
            continue
        candidates = by_name.get(_norm(name), [])
        if len(candidates) == 1:
            mapping[old_id] = candidates[0]
        else:
            unmatched.add(name.strip()[:100])
    return mapping, sorted(unmatched)


def remap_task_users(task: dict[str, Any], mapping: dict[str, str]) -> None:
    """Point a task's user references at this instance's users (in place).
    References without a match stay — the orphan sweep clears them."""
    if not mapping:
        return
    if (uid := task.get("responsible_user_id")) in mapping:
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
        if isinstance(entry, dict) and entry.get("completed_by") in mapping:
            entry["completed_by"] = mapping[entry["completed_by"]]


def remap_view_users(views: list[dict[str, Any]], mapping: dict[str, str]) -> None:
    """Saved views filtering on one person follow that person. A view whose
    person matches nobody keeps the old id (it shows nothing) rather than
    silently turning into an unfiltered view."""
    for view in views:
        filters = view.get("filters")
        if isinstance(filters, dict) and filters.get("user_id") in mapping:
            filters["user_id"] = mapping[filters["user_id"]]


# --- task references in the settings ----------------------------------------


def _live_tasks(hass: HomeAssistant) -> tuple[set[tuple[str, str]], dict[tuple[str, str], list[tuple[str, str]]]]:
    """(live (entry_id, task_id) pairs, (object name, task name) → pairs)."""
    live: set[tuple[str, str]] = set()
    by_name: dict[tuple[str, str], list[tuple[str, str]]] = {}
    for entry in get_object_entries(hass):
        obj_name = _norm((entry.data.get(CONF_OBJECT) or {}).get("name"))
        for task_id, task in (entry.data.get(CONF_TASKS) or {}).items():
            live.add((entry.entry_id, task_id))
            by_name.setdefault((obj_name, _norm(task.get("name"))), []).append((entry.entry_id, task_id))
    return live, by_name


def settings_task_names(hass: HomeAssistant, settings: dict[str, Any]) -> dict[str, dict[str, str]]:
    """``task_names`` for the settings export: object + task name of every
    task a group or the vacation exemptions point at."""
    wanted: set[str] = set()
    for group in (settings.get(CONF_GROUPS) or {}).values():
        refs = group.get("task_refs") if isinstance(group, dict) else None
        for ref in refs if isinstance(refs, list) else []:
            if isinstance(ref, dict) and isinstance(ref.get("task_id"), str):
                wanted.add(ref["task_id"])
    wanted.update(t for t in settings.get(CONF_VACATION_EXEMPT_TASK_IDS) or [] if isinstance(t, str))
    out: dict[str, dict[str, str]] = {}
    for entry in get_object_entries(hass):
        obj_name = str((entry.data.get(CONF_OBJECT) or {}).get("name") or "")
        for task_id, task in (entry.data.get(CONF_TASKS) or {}).items():
            if task_id in wanted:
                out[task_id] = {"object": obj_name, "task": str(task.get("name") or "")}
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
        return found[0] if len(found) == 1 else None

    for group in (settings.get(CONF_GROUPS) or {}).values():
        refs = []
        for ref in group.get("task_refs") or []:
            if (ref["entry_id"], ref["task_id"]) not in live and (hit := _by_name(ref["task_id"])) is not None:
                ref = {"entry_id": hit[0], "task_id": hit[1]}
            if ref not in refs:
                refs.append(ref)
        group["task_refs"] = refs
    exempt = settings.get(CONF_VACATION_EXEMPT_TASK_IDS)
    if isinstance(exempt, list):
        out: list[str] = []
        for task_id in exempt:
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
                    and (ref.get("entry_id"), ref.get("task_id")) not in live
                    and ref.get("task_id") in task_map
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
            if task_id not in live_tasks and task_id in task_map:
                task_id = task_map[task_id][1]
                moved = True
            if task_id not in out:
                out.append(task_id)
        if moved:
            changed[CONF_VACATION_EXEMPT_TASK_IDS] = out
    return changed
