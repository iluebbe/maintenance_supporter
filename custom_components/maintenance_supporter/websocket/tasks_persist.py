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
    DOMAIN,
    FLAT_SCHEDULE_TYPES,
    MAX_TASKS_PER_OBJECT,
)
from ..helpers.aggregate import get_store, is_object_entry
from ..helpers.dates import parse_iso_date
from ..helpers.entry_tasks import insert_new_task
from ..helpers.global_options import get_default_warning_days
from ..helpers.sanitize import cap_task_fields
from ..helpers.schedule import (
    KIND_INTERVAL,
    KIND_MANUAL,
    KIND_ONE_TIME,
    Schedule,
    normalize_task_storage,
)

_TIME_BASED = "time_based"
# The flat service schedule_type → the Schedule kind it means.
_FLAT_TO_KIND = {_TIME_BASED: KIND_INTERVAL, KIND_ONE_TIME: KIND_ONE_TIME, KIND_MANUAL: KIND_MANUAL}

# ---------------------------------------------------------------------------
# Task CRUD
# ---------------------------------------------------------------------------


def _checked_due_date(value: Any) -> str:
    """The canonical ISO form of a service-supplied ``due_date``.

    The service schemas only require a string, so "next tuesday" was stored
    as a one-time task's due date — the task then never came due (bug audit
    2026-09-26). Raises ValueError, which the services report as invalid
    input.
    """
    parsed = parse_iso_date(value) if isinstance(value, str) else None
    if parsed is None:
        raise ValueError(f"due_date must be a valid date (YYYY-MM-DD), got {value!r}")
    return parsed.isoformat()


def _check_schedule_request(
    schedule_type: str | None,
    *,
    interval_days: Any,
    schedule: dict[str, Any] | None,
    stored_kind: str | None = None,
) -> None:
    """Refuse a recurrence request that contradicts itself.

    The storage model resolves a contradiction by picking one side, so the
    services used to report success for a task that was quietly something
    else (bug audit 2026-09-29): ``time_based`` without an interval made a
    manual task (a weekday or one-time task lost its schedule), ``manual``
    with ``interval_days`` an interval task, ``one_time`` with an interval
    ``schedule`` a one-time task without a date. ``stored_kind`` is the
    task's current kind on an edit — an interval task switched to
    ``time_based`` keeps its interval. Raises ValueError (the services report
    it as invalid input).
    """
    if schedule_type is None:
        return
    if schedule:
        parsed = Schedule.from_dict(schedule)
        kind = parsed.kind
        if parsed.is_calendar_kind:
            if schedule_type != _TIME_BASED:
                raise ValueError(f"schedule_type {schedule_type!r} contradicts the {kind!r} schedule (use time_based)")
        elif _FLAT_TO_KIND.get(schedule_type) != kind:
            raise ValueError(f"schedule_type {schedule_type!r} contradicts the schedule's kind {kind!r}")
        return
    if schedule_type == KIND_MANUAL and interval_days is not None:
        raise ValueError("A manual task has no interval — leave interval_days out")
    if schedule_type == _TIME_BASED and interval_days is None and stored_kind != KIND_INTERVAL:
        raise ValueError("A time-based task needs interval_days")


def _implied_schedule_type(*, interval_days: Any, due_date: Any, schedule: dict[str, Any] | None) -> str:
    """What an ``add_task`` call without ``schedule_type`` asks for: the kind
    its other fields describe (a bare name stays a manual task, as before)."""
    if schedule:
        kind = Schedule.from_dict(schedule).kind
        return kind if kind in (KIND_ONE_TIME, KIND_MANUAL) else _TIME_BASED
    if due_date:
        return KIND_ONE_TIME
    return _TIME_BASED if interval_days is not None else KIND_MANUAL


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
    # The insert itself (normalise, per-object cap → ValueError, task_ids,
    # ConfigEntry.data, Store init) is the sync core shared with the options
    # flow; this path saves right away and reloads so the task's entities
    # (sensor / binary_sensor / buttons) are created.
    store = insert_new_task(hass, entry, task_data, last_performed=last_performed, history=history)
    if store is not None:
        await store.async_save()
    await hass.config_entries.async_reload(entry.entry_id)


async def async_create_task_simple(
    hass: HomeAssistant,
    *,
    entry_id: str,
    name: str,
    task_type: str = "custom",
    schedule_type: str | None = None,
    interval_days: int | None = None,
    interval_unit: str = "days",
    due_date: str | None = None,
    warning_days: int | None = None,
    enabled: bool = True,
    notes: str | None = None,
    schedule: dict[str, Any] | None = None,
) -> str:
    """Create a task with the common fields and persist it; return task_id.

    The service-facing creation path — a focused subset of ws_create_task's
    field set — sharing :func:`async_persist_task` with the WS handler (DRY).
    For the full field set (triggers, checklists, completion actions, …) use
    the panel / card dialogs or the ``task/create`` WS command.

    Raises ValueError if the entry_id is not a maintenance object, the name
    is empty, the due date is not a date or the recurrence contradicts itself
    (:func:`_check_schedule_request`). Without ``schedule_type`` the kind the
    other fields describe is created — a bare name stays a manual task.

    ``warning_days`` defaults to the integration-wide setting like every
    other create path — it was the bare constant 7 here (bug audit
    2026-09-26).

    Like the config-flow save handlers (see ``helpers/sanitize``), this runs
    :func:`cap_task_fields` before persisting: the ``add_task`` *service*
    schema is the boundary for service callers, but this function is also
    reachable directly from Python, so the caps can't live only in the schema.
    """
    entry = hass.config_entries.async_get_entry(entry_id)
    # is_object_entry() rejects None as well; the explicit test narrows the type.
    if entry is None or not is_object_entry(entry):
        raise ValueError(f"No maintenance object found for entry_id {entry_id!r}")
    name = (name or "").strip()
    if not name:
        raise ValueError("Name must not be empty")
    if schedule_type is None:
        schedule_type = _implied_schedule_type(interval_days=interval_days, due_date=due_date, schedule=schedule)
    else:
        _check_schedule_request(schedule_type, interval_days=interval_days, schedule=schedule)
    if schedule_type == KIND_ONE_TIME and not due_date and not (schedule and Schedule.from_dict(schedule).due_date):
        raise ValueError("A one-time task needs a due_date")
    task_id = uuid4().hex
    task_data: dict[str, Any] = {
        "id": task_id,
        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
        "name": name,
        "type": task_type,
        "enabled": enabled,
        "schedule_type": schedule_type,
        "warning_days": warning_days if warning_days is not None else get_default_warning_days(hass),
        "created_at": dt_util.now().date().isoformat(),
    }
    if schedule:
        # Calendar kinds: persist the nested schedule (normalize treats it as
        # authoritative over the flat fields) — canonicalised like the WS
        # create path does; it was stored raw (bug audit 2026-09-26).
        task_data["schedule"] = Schedule.from_dict(schedule).to_dict()
    if interval_days is not None:
        task_data["interval_days"] = interval_days
    if interval_unit and interval_unit != "days":
        task_data["interval_unit"] = interval_unit
    if due_date:
        task_data["due_date"] = _checked_due_date(due_date)
    if notes:
        task_data["notes"] = notes
    # Same sanitising as the config-flow create path, applied BEFORE the
    # storage normalisation inside async_persist_task so a capped
    # interval_days/warning_days is what the schedule model sees.
    cap_task_fields(task_data)
    await async_persist_task(hass, entry, task_data)
    return task_id


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
    # is_object_entry() rejects None as well; the explicit test narrows the type.
    if entry is None or not is_object_entry(entry):
        raise ValueError(f"No maintenance object found for entry_id {entry_id!r}")

    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    if task_id not in new_tasks:
        raise ValueError(f"No task {task_id!r} in {entry.title!r}")

    task = dict(new_tasks[task_id])
    stored_kind = Schedule.parse(new_tasks[task_id]).kind
    _check_schedule_request(
        updates.get("schedule_type"),
        interval_days=updates.get("interval_days"),
        schedule=updates.get("schedule"),
        stored_kind=stored_kind,
    )
    if updates.get("due_date") is not None:
        updates = {**updates, "due_date": _checked_due_date(updates["due_date"])}
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
        task["schedule"] = Schedule.from_dict(updates["schedule"]).to_dict()
    elif isinstance(task.get("schedule"), dict) and Schedule.from_dict(task["schedule"]).is_calendar_kind and (
        any(updates.get(key) is not None for key in ("interval_days", "interval_unit", "due_date"))
        or updates.get("schedule_type") in FLAT_SCHEDULE_TYPES
    ):
        # A flat recurrence edit on a calendar-kind task: normalize keeps a
        # calendar schedule authoritative and DROPS the flat keys, so the
        # interval the caller set silently vanished. Same rule as the WS
        # task/update — the flat fields rebuild the schedule (bug audit
        # 2026-09-26).
        task.pop("schedule", None)
    new_kind = updates.get("schedule_type")
    if (
        new_kind in (KIND_MANUAL, KIND_ONE_TIME)
        and not updates.get("schedule")
        and (new_kind != stored_kind or new_kind == KIND_MANUAL)
    ):
        # A switch to manual / one-time: the stored interval rode along into
        # the flat overlay and rebuilt an interval, so the switch silently did
        # nothing (audit 2026-09-29). The old recurrence goes; a one-time task
        # needs its date.
        if new_kind == KIND_ONE_TIME and not task.get("due_date"):
            raise ValueError("A one-time task needs a due_date")
        task.pop("schedule", None)
        for key in ("interval_days", "interval_unit", "interval_anchor"):
            task.pop(key, None)

    # The service cannot change the completion action, so the stored one keeps
    # the user it runs as — dropping ``configured_by`` here made an operator's
    # action run with system rights after any service edit (bug audit
    # 2026-09-27).
    cap_task_fields(task, keep_action_owner=True)
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

    def __init__(self, code: str, message: str, translation_key: str) -> None:
        super().__init__(message)
        self.code = code
        self.translation_key = translation_key


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

    from ..const import CONF_VACATION_EXEMPT_TASK_IDS, DOCUMENT_STORE_KEY
    from ..helpers.completion_photos import history_photo_ids
    from ..helpers.parts import PART_REF_FIELD
    from .tasks_crud import async_delete_task

    task_data = deepcopy(dict(source.data[CONF_TASKS][task_id]))
    # A buy task follows its spare part and the fleet task IS the battery
    # fleet — neither can live on another object (bug audit 2026-09-12).
    if task_data.get(PART_REF_FIELD):
        raise TaskMoveRefused("task_not_movable", "A spare-part buy task stays with its part", "move_part_task")
    if task_data.get(BATTERY_FLEET_TASK_FLAG):
        raise TaskMoveRefused("task_not_movable", "The battery fleet task cannot be moved", "move_fleet_task")

    # Both Stores must be loaded (entry disabled / setup-retry / mid-reload
    # = no runtime_data): the config would move while history, readings and
    # trigger state silently vanished (bug audit 2026-09-12).
    src_store = get_store(hass, source.entry_id)
    tgt_store = get_store(hass, target.entry_id)
    if src_store is None or tgt_store is None:
        raise TaskMoveRefused("object_not_loaded", "Both objects must be loaded to move a task", "move_objects_not_loaded")

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

    def _strip_refs(state: dict[str, Any]) -> dict[str, Any]:
        state.pop("next_history_ref", None)
        for entry in state.get("history") or []:
            if isinstance(entry, dict):
                entry.pop("ref_no", None)
        return state

    state = _strip_refs(deepcopy(src_store.get_task_state(task_id)))

    # Group memberships: snapshot, let the delete sweep them, re-add under the target.
    from ..const import CONF_GROUPS
    from ..helpers.global_options import get_global_entry, get_global_options
    from . import _merge_global_options

    member_groups: list[str] = []
    global_entry = get_global_entry(hass)
    for gid, group in (get_global_options(hass).get(CONF_GROUPS) or {}).items():
        if any(isinstance(r, dict) and r.get("task_id") == task_id for r in group.get("task_refs", [])):
            member_groups.append(gid)

    # Vacation exemption + document links: the delete leg strips both
    # (task-id keyed, otherwise never pruned) — snapshot, restore after.
    exempt = get_global_options(hass).get(CONF_VACATION_EXEMPT_TASK_IDS) or []
    vacation_exempt = isinstance(exempt, list) and task_id in exempt
    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    doc_links = doc_store.task_links(task_id) if doc_store is not None else {}
    # Photos linked to this task alone are re-homed with it — a doc shared
    # with the object's other tasks stays where it is (link kept). Which of
    # them the history uses is decided on the FINAL state below.
    sole_task_docs = {did for did in doc_links if (doc_store.get(did) or {}).get("task_ids") == [task_id]}

    existing = target.data.get(CONF_TASKS, {})
    if len(existing) >= MAX_TASKS_PER_OBJECT:
        raise ValueError(f"The target object already has the maximum of {MAX_TASKS_PER_OBJECT} tasks")

    # The delete awaits before it drops the Store state; take the state as
    # it was at that moment — a completion landing during the awaits was
    # lost from the snapshot above (bug audit 2026-09-26).
    final_state: dict[str, Any] = {}
    await async_delete_task(hass, source, task_id, removed_state=final_state)
    if final_state:
        state = _strip_refs(final_state)
    photo_ids: set[str] = set()
    for entry in state.get("history") or []:
        if isinstance(entry, dict):
            photo_ids.update(history_photo_ids(entry))
    rehome_ids = photo_ids & sole_task_docs

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

    # Both write-backs read the settings the delete leg just rewrote
    # (DRY audit 2026-09-26 B: one read rule, one merge).
    if vacation_exempt and global_entry is not None:
        current = get_global_options(hass).get(CONF_VACATION_EXEMPT_TASK_IDS) or []
        if task_id not in current:
            _merge_global_options(hass, global_entry, {CONF_VACATION_EXEMPT_TASK_IDS: [*current, task_id]})

    if member_groups and global_entry is not None:
        groups = dict(get_global_options(hass).get(CONF_GROUPS) or {})
        for gid in member_groups:
            group = groups.get(gid)
            if group is None:
                continue
            groups[gid] = {**group, "task_refs": [*group.get("task_refs", []), {"entry_id": target.entry_id, "task_id": task_id}]}
        _merge_global_options(hass, global_entry, {CONF_GROUPS: groups})
