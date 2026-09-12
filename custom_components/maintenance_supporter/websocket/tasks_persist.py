"""Task persistence primitives shared by CRUD + the add_task service."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import (
    BATTERY_FLEET_TASK_FLAG,
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_TASKS_PER_OBJECT,
)
from ..helpers.sanitize import cap_task_fields
from ..helpers.schedule import (
    normalize_task_storage,
)
from . import (
    _get_runtime_data,
)

# ---------------------------------------------------------------------------
# Task CRUD
# ---------------------------------------------------------------------------


async def async_persist_task(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: dict[str, Any],
    *,
    last_performed: str | None = None,
    history: list[dict[str, Any]] | None = None,
) -> None:
    """Persist a freshly-built task into an object entry and reload it.

    Shared by the ``task/create`` WS command and the ``add_task`` service
    (DRY): updates ConfigEntry.data + the object's task_ids, initializes the
    Store dynamic state, and reloads the entry so the task's entities
    (sensor / binary_sensor / buttons) are created.
    """
    # Store recurrence in the canonical nested `schedule` shape (schedule-model v2).
    task_data = normalize_task_storage(task_data)
    task_id = task_data["id"]
    # Per-object task cap — this is the single create chokepoint for BOTH the
    # task/create WS command and the add_task service, so one guard covers both.
    # The ValueError surfaces as a WS error / a service ValidationError at the
    # callers (a runaway automation can't inflate ConfigEntry.data without bound).
    existing_tasks = entry.data.get(CONF_TASKS, {})
    if task_id not in existing_tasks and len(existing_tasks) >= MAX_TASKS_PER_OBJECT:
        raise ValueError(f"This object already has the maximum of {MAX_TASKS_PER_OBJECT} tasks")
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    new_tasks[task_id] = task_data
    new_data[CONF_TASKS] = new_tasks

    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = list(obj.get("task_ids", []))
    task_ids.append(task_id)
    obj["task_ids"] = task_ids
    new_data[CONF_OBJECT] = obj

    hass.config_entries.async_update_entry(entry, data=new_data)

    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        store.init_task(task_id, last_performed=last_performed)
        if history:
            store.set_history(task_id, history)
        await store.async_save()
    else:
        # Legacy: dynamic fields live in ConfigEntry.data
        task_data["last_performed"] = last_performed
        task_data["history"] = history or []
        new_tasks[task_id] = task_data
        new_data[CONF_TASKS] = new_tasks
        hass.config_entries.async_update_entry(entry, data=new_data)

    await hass.config_entries.async_reload(entry.entry_id)


async def async_create_task_simple(
    hass: HomeAssistant,
    *,
    entry_id: str,
    name: str,
    task_type: str = "custom",
    schedule_type: str = "time_based",
    interval_days: int | None = None,
    interval_unit: str = "days",
    due_date: str | None = None,
    warning_days: int = DEFAULT_WARNING_DAYS,
    enabled: bool = True,
    notes: str | None = None,
    schedule: dict[str, Any] | None = None,
) -> str:
    """Create a task with the common fields and persist it; return task_id.

    The service-facing creation path — a focused subset of ws_create_task's
    field set — sharing :func:`async_persist_task` with the WS handler (DRY).
    For the full field set (triggers, checklists, completion actions, …) use
    the panel / card dialogs or the ``task/create`` WS command.

    Raises ValueError if the entry_id is not a maintenance object or the name
    is empty.

    Like the config-flow save handlers (see ``helpers/sanitize``), this runs
    :func:`cap_task_fields` before persisting: the ``add_task`` *service*
    schema is the boundary for service callers, but this function is also
    reachable directly from Python, so the caps can't live only in the schema.
    """
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        raise ValueError(f"No maintenance object found for entry_id {entry_id!r}")
    name = (name or "").strip()
    if not name:
        raise ValueError("Name must not be empty")
    task_data: dict[str, Any] = {
        "id": uuid4().hex,
        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
        "name": name,
        "type": task_type,
        "enabled": enabled,
        "schedule_type": schedule_type,
        "warning_days": warning_days,
        "created_at": dt_util.now().date().isoformat(),
    }
    if schedule:
        # Calendar kinds: persist the nested schedule (normalize treats it as
        # authoritative over the flat fields).
        task_data["schedule"] = schedule
    if interval_days is not None:
        task_data["interval_days"] = interval_days
    if interval_unit and interval_unit != "days":
        task_data["interval_unit"] = interval_unit
    if due_date:
        task_data["due_date"] = due_date
    if notes:
        task_data["notes"] = notes
    # Same sanitising as the config-flow create path, applied BEFORE the
    # storage normalisation inside async_persist_task so a capped
    # interval_days/warning_days is what the schedule model sees.
    cap_task_fields(task_data)
    await async_persist_task(hass, entry, task_data)
    return task_data["id"]


_UPDATABLE_FLAT_FIELDS = (
    "name",
    "type",
    "interval_days",
    "interval_unit",
    "due_date",
    "warning_days",
    "enabled",
    "notes",
    "priority",
    "labels",
)


async def async_update_task_simple(
    hass: HomeAssistant,
    *,
    entry_id: str,
    task_id: str,
    updates: dict[str, Any],
) -> None:
    """Patch the common task fields and persist; the service-facing edit path.

    Mirror of :func:`async_create_task_simple` for edits — a focused subset of
    the ``task/update`` WS field set for automations/scripts/voice. Present
    keys in *updates* overwrite; absent keys are untouched. Recurrence changes
    (flat fields or a nested ``schedule``) go through
    :func:`normalize_task_storage`, so partial edits keep the unit/anchor
    semantics of the storage model (issue #58 class).

    Runs :func:`cap_task_fields` over the MERGED task before persisting —
    mirroring the options-flow edit path — so a direct Python caller can't
    write past the caps the ``update_task`` service schema enforces.

    Raises ValueError for an unknown entry/task or an empty name.
    """
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        raise ValueError(f"No maintenance object found for entry_id {entry_id!r}")

    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    if task_id not in new_tasks:
        raise ValueError(f"No task {task_id!r} in {entry.title!r}")

    task = dict(new_tasks[task_id])
    for key in _UPDATABLE_FLAT_FIELDS:
        if key in updates and updates[key] is not None:
            task[key] = updates[key]
    # #128: assignment via the update_task service. "" clears (a user id is
    # never empty); None keeps the field untouched like everywhere else here.
    ruid = updates.get("responsible_user_id")
    if ruid is not None:
        if ruid:
            task["responsible_user_id"] = ruid
        else:
            task.pop("responsible_user_id", None)
    if isinstance(task.get("name"), str):
        task["name"] = task["name"].strip()
        if not task["name"]:
            raise ValueError("Name must not be empty")
    if updates.get("schedule_type") is not None:
        task["schedule_type"] = updates["schedule_type"]
    if updates.get("schedule"):
        task["schedule"] = updates["schedule"]

    cap_task_fields(task)
    new_tasks[task_id] = normalize_task_storage(task)
    new_data[CONF_TASKS] = new_tasks
    hass.config_entries.async_update_entry(entry, data=new_data)
    await hass.config_entries.async_reload(entry_id)


class TaskMoveRefused(ValueError):
    """``task/move`` refused up front — carries the WS error code.

    Raised BEFORE the delete leg so nothing has changed when the caller sees
    it (bug audit 2026-09-12): a task that is not movable, or an entry whose
    Store is not loaded (the move would silently drop history / readings /
    trigger state).
    """

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


def _stamp_part_links(links: Any, entry_id: str) -> Any:
    """Give every own-pool part link an explicit ``entry_id`` (foreign-pool form)."""
    if not isinstance(links, list):
        return links
    return [{**link, "entry_id": link.get("entry_id") or entry_id} if isinstance(link, dict) else link for link in links]


async def async_move_task(
    hass: HomeAssistant,
    source: ConfigEntry,
    target: ConfigEntry,
    task_id: str,
) -> None:
    """Move a task — config AND dynamic state — from one object entry to another.

    What travels: the task's config (schedule, trigger, checklist, parts links,
    slug, NFC tag …) and its Store state (history, last_performed, planned
    due, adaptive config, phase cursor, checklist progress, trigger runtime
    incl. counter baselines). Group memberships, the vacation exemption and
    the document links follow the task; completion photos that belong to
    nothing but this task are re-homed to the target object (they would
    otherwise die with the source object — bug audit 2026-09-12). What does
    not travel: the reference number (``ref_no`` and the history entries'
    numbers — the target object numbers it afresh on its next refresh). Part
    links — task-level AND per phase — keep an explicit ``entry_id`` so a
    link to one of the source object's parts still resolves as a
    foreign-pool link.

    Both entries are reloaded by the caller: the source drops the task's
    entities, the target creates them under its own object slug.
    Raises :class:`TaskMoveRefused` (with a WS error code) for a task that
    must stay with its object / an entry whose Store is not loaded, and a
    plain ValueError when the target is full.
    """
    from copy import deepcopy

    from ..const import CONF_VACATION_EXEMPT_TASK_IDS, DOCUMENT_STORE_KEY, MAX_TASKS_PER_OBJECT
    from ..helpers.completion_photos import history_photo_ids
    from ..helpers.parts import PART_REF_FIELD
    from .tasks_crud import async_delete_task

    task_data = deepcopy(dict(source.data[CONF_TASKS][task_id]))
    # A buy task follows its spare part and the fleet task IS the battery
    # fleet — neither can live on another object (bug audit 2026-09-12).
    if task_data.get(PART_REF_FIELD):
        raise TaskMoveRefused("task_not_movable", "A spare-part buy task stays with its part")
    if task_data.get(BATTERY_FLEET_TASK_FLAG):
        raise TaskMoveRefused("task_not_movable", "The battery fleet task cannot be moved")

    # Both Stores must be loaded (entry disabled / setup-retry / mid-reload
    # = no runtime_data): the config would move while history, readings and
    # trigger state silently vanished (bug audit 2026-09-12).
    src_rd = _get_runtime_data(hass, source.entry_id)
    src_store = getattr(src_rd, "store", None) if src_rd else None
    tgt_rd = _get_runtime_data(hass, target.entry_id)
    tgt_store = getattr(tgt_rd, "store", None) if tgt_rd else None
    if src_store is None or tgt_store is None:
        raise TaskMoveRefused("object_not_loaded", "Both objects must be loaded to move a task")

    task_data.pop("ref_no", None)
    # The task now belongs to the target object — like the duplicate /
    # replace paths re-stamp it (bug audit 2026-09-12).
    task_data["object_id"] = (target.data.get(CONF_OBJECT) or {}).get("id", "")
    task_data["consumes_parts"] = _stamp_part_links(task_data.get("consumes_parts"), source.entry_id)
    if task_data["consumes_parts"] is None:
        del task_data["consumes_parts"]
    phases = task_data.get("phases")
    if isinstance(phases, dict):
        for pdef in phases.values():
            if isinstance(pdef, dict) and isinstance(pdef.get("consumes_parts"), list):
                pdef["consumes_parts"] = _stamp_part_links(pdef["consumes_parts"], source.entry_id)

    state = deepcopy(src_store.get_task_state(task_id))
    state.pop("next_history_ref", None)
    for entry in state.get("history") or []:
        if isinstance(entry, dict):
            entry.pop("ref_no", None)

    # Group memberships: snapshot, let the delete sweep them, re-add under the target.
    from ..const import CONF_GROUPS
    from ..helpers.global_options import get_global_entry

    member_groups: list[str] = []
    global_entry = get_global_entry(hass)
    if global_entry is not None:
        for gid, group in (dict(global_entry.options or global_entry.data).get(CONF_GROUPS) or {}).items():
            if any(isinstance(r, dict) and r.get("task_id") == task_id for r in group.get("task_refs", [])):
                member_groups.append(gid)

    # Vacation exemption + document links: the delete leg strips both
    # (task-id keyed, otherwise never pruned) — snapshot, restore after.
    vacation_exempt = False
    if global_entry is not None:
        exempt = global_entry.options.get(CONF_VACATION_EXEMPT_TASK_IDS) or []
        vacation_exempt = isinstance(exempt, list) and task_id in exempt
    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    doc_links = doc_store.task_links(task_id) if doc_store is not None else {}
    photo_ids: set[str] = set()
    for entry in state.get("history") or []:
        if isinstance(entry, dict):
            photo_ids.update(history_photo_ids(entry))
    # Re-home only the photos that are linked to this task alone — a doc
    # shared with the object's other tasks stays where it is (link kept).
    rehome_ids = {
        did for did in photo_ids if did in doc_links and (doc_store.get(did) or {}).get("task_ids") == [task_id]
    }

    existing = target.data.get(CONF_TASKS, {})
    if len(existing) >= MAX_TASKS_PER_OBJECT:
        raise ValueError(f"The target object already has the maximum of {MAX_TASKS_PER_OBJECT} tasks")

    await async_delete_task(hass, source, task_id)

    new_data = dict(target.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    new_tasks[task_id] = task_data
    new_data[CONF_TASKS] = new_tasks
    obj = dict(new_data.get(CONF_OBJECT, {}))
    obj["task_ids"] = [*obj.get("task_ids", []), task_id]
    new_data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(target, data=new_data)

    tgt_store.put_task_state(task_id, state)
    await tgt_store.async_save()

    if doc_store is not None and doc_links:
        await doc_store.async_relink_task(task_id, doc_links, rehome_doc_ids=rehome_ids, object_id=task_data["object_id"])

    if vacation_exempt and global_entry is not None:
        options = dict(global_entry.options)
        current = options.get(CONF_VACATION_EXEMPT_TASK_IDS) or []
        if task_id not in current:
            options[CONF_VACATION_EXEMPT_TASK_IDS] = [*current, task_id]
            hass.config_entries.async_update_entry(global_entry, options=options)

    if member_groups and global_entry is not None:
        options = dict(global_entry.options or global_entry.data)
        groups = dict(options.get(CONF_GROUPS) or {})
        for gid in member_groups:
            group = groups.get(gid)
            if group is None:
                continue
            groups[gid] = {**group, "task_refs": [*group.get("task_refs", []), {"entry_id": target.entry_id, "task_id": task_id}]}
        options[CONF_GROUPS] = groups
        hass.config_entries.async_update_entry(global_entry, options=options)
