"""Pools of spare parts that several objects draw on (#111).

A part belongs to exactly one object — that is deliberate (entry-data locality,
export simplicity) and stays true here. What #111 adds is that a task on
ANOTHER object may link to it: three robot vacuums, one box of dust bags, one
number that is the real number.

Keeping a single owner is what makes the rest fall out for free. The buy-task
reconciler, the reorder threshold and the stock sensor's unique_id are all
entry-local already, so one owner means one "Buy …" task, one low state and one
sensor — no deduplication anywhere.

The one thing that does need care is the owner disappearing. Stock lives in a
per-entry Store, and every setup prunes stock rows whose part is not in that
entry's own data, so a pool cannot simply be parked elsewhere. Instead, when an
owner with borrowers is deleted, the pool MOVES to a borrower and their links
are rewritten — see :func:`async_transfer_pools_on_removal`. Nothing is lost
and no link is ever left pointing at nothing.
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from ..const import (
    BATTERY_FLEET_OBJECT_FLAG,
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DOCUMENT_STORE_KEY,
    DOMAIN,
    STORES_CACHE_KEY,
)
from ..storage import MaintenanceStore
from .aggregate import async_store_even_unloaded, get_object_entries, is_object_entry, object_id_for_entry, object_name
from .entry_tasks import write_tasks
from .issues import SHARED_PARTS_MOVED_PREFIX, shared_parts_moved_issue_id
from .parts import MAX_PARTS_PER_OBJECT, iter_part_links, map_part_links, map_used_parts
from .pause import is_task_inert

_LOGGER = logging.getLogger(__name__)

TRANSFER_ISSUE_PREFIX = SHARED_PARTS_MOVED_PREFIX


# Every maintenance OBJECT entry (the global entry is not one) — the
# implementation lives in helpers.aggregate.
object_entries = get_object_entries


def _links_to(task: dict[str, Any], owner_id: str) -> list[dict[str, Any]]:
    """The task's links (task level AND per phase) into ``owner_id``'s pool."""
    return [link for link in iter_part_links(task) if str(link.get("entry_id") or "") == owner_id]


def _is_inert_borrower(entry: ConfigEntry, task: dict[str, Any]) -> bool:
    """An archived / disabled task, or an archived / paused borrower object."""
    obj = entry.data.get(CONF_OBJECT) or {}
    return obj.get("archived_at") is not None or is_task_inert(task, obj)


def borrowers_of(hass: HomeAssistant, owner_id: str) -> list[ConfigEntry]:
    """Objects whose tasks consume a part owned by ``owner_id``.

    Oldest first, so which object inherits a pool is deterministic rather than
    a function of dict ordering. Phase-level links count (bug audit
    2026-09-27): a borrower whose only link sat in a phase was missed, and
    the owner's delete handed the pool to nobody.
    """
    found: list[ConfigEntry] = []
    for entry in object_entries(hass):
        if entry.entry_id == owner_id:
            continue
        if any(_links_to(task, owner_id) for task in (entry.data.get(CONF_TASKS) or {}).values()):
            found.append(entry)
    # created_at is per object; fall back to entry_id for a stable order.
    found.sort(key=lambda e: (str((e.data.get(CONF_OBJECT) or {}).get("created_at") or ""), e.entry_id))
    return found


def borrowed_part_ids(hass: HomeAssistant, owner_id: str, *, active_only: bool = False) -> set[str]:
    """Which of the owner's parts other objects actually link to (task level
    and per phase). ``active_only``: count only links of live tasks on live
    objects — the buy-task reconcile of a retired owner asks this."""
    wanted: set[str] = set()
    for entry in object_entries(hass):
        if entry.entry_id == owner_id:
            continue
        for task in (entry.data.get(CONF_TASKS) or {}).values():
            if active_only and _is_inert_borrower(entry, task):
                continue
            for link in _links_to(task, owner_id):
                part_id = str(link.get("part_id") or "").strip()
                if part_id:
                    wanted.add(part_id)
    return wanted


def live_parts(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, dict[str, Any]]:
    """The parts of ``entry`` on a shelf that is still in use: all of them,
    unless the object is archived — then only a shared pool live objects
    still draw on (the buy-task reconcile's rule). A replaced object hands
    its parts on to its successor as copies, and counting the archived
    predecessor's as well kept the reorder count up for good, listed every
    part twice in the inventory and made voice ask "which one?" (bug audit
    2026-10-16, S2)."""
    parts = entry.data.get(CONF_PARTS)
    if not isinstance(parts, dict):
        return {}
    # Only well-formed parts (a hand-edited backup can hold anything).
    shelf = {pid: part for pid, part in parts.items() if isinstance(part, dict)}
    if (entry.data.get(CONF_OBJECT) or {}).get("archived_at") is None:
        return shelf
    in_use = borrowed_part_ids(hass, entry.entry_id, active_only=True)
    return {pid: part for pid, part in shelf.items() if pid in in_use}


def foreign_part_resolver(hass: HomeAssistant) -> Callable[[str], set[str] | None]:
    """Callback for ``sanitize_consumes_parts``: which parts an entry owns.

    Returns None for an entry that does not exist or is not a maintenance
    object, so a link to it is dropped rather than trusted.
    """

    def _resolve(entry_id: str) -> set[str] | None:
        entry = hass.config_entries.async_get_entry(entry_id)
        # is_object_entry() rejects None too; the explicit test narrows the type.
        if entry is None or not is_object_entry(entry):
            return None
        return set(entry.data.get(CONF_PARTS) or {})

    return _resolve


def relink_tasks(
    tasks: dict[str, Any], old_owner: str, new_owner: str, moved: dict[str, str]
) -> tuple[dict[str, Any], int]:
    """Point links at the pool's new home; ``moved`` maps old→new part id.

    ``new_owner == ""`` means the pool now lives on the tasks' own object
    (the link loses its ``entry_id``). Task-level AND phase-level links move
    (bug audit 2026-09-27). Returns the tasks and how many changed.
    """

    def _rewrite(link: dict[str, Any]) -> dict[str, Any]:
        return _relinked(link, old_owner, new_owner, moved)

    out: dict[str, Any] = {}
    count = 0
    for task_id, task in tasks.items():
        new_task, changed = map_part_links(task, _rewrite)
        if changed:
            count += 1
            out[task_id] = new_task
        else:
            out[task_id] = task
    return out, count


def _relinked(link: dict[str, Any], old_owner: str, new_owner: str, moved: dict[str, str]) -> dict[str, Any]:
    """One link pointed at the pool's new home (see :func:`relink_tasks`)."""
    if str(link.get("entry_id") or "") != old_owner or str(link.get("part_id") or "") not in moved:
        return link
    link = {**link, "part_id": moved[str(link["part_id"])]}
    if new_owner == "":
        link.pop("entry_id", None)  # the pool is now ours
    else:
        link["entry_id"] = new_owner
    return link


def relink_history(store: Any, old_owner: str, new_owner: str, moved: dict[str, str]) -> bool:
    """Point the history's ``used_parts`` at the pool's new home, like the
    task links. A recorded link names its owner, and that name wins when a
    history edit or delete looks the part up: after the owner was deleted
    the stock went back to nothing, after a replace into the archived
    predecessor's hidden copy (bug audit 2026-10-17, S-7)."""
    def _relink(used: list[Any]) -> list[Any]:
        return [_relinked(link, old_owner, new_owner, moved) if isinstance(link, dict) else link for link in used]

    changed = False
    for task_id, state in store.all_task_states().items():
        history = state.get("history")
        if not isinstance(history, list):
            continue
        rewritten, touched = map_used_parts(history, _relink)
        if touched:
            store.set_history(task_id, rewritten)
            changed = True
    return changed


async def async_relink_history(hass: HomeAssistant, entry: ConfigEntry, old_owner: str, new_owner: str, moved: dict[str, str]) -> None:
    """:func:`relink_history` on an object's Store, loaded or not, saved."""
    store = await async_store_even_unloaded(hass, entry)
    if store is not None and relink_history(store, old_owner, new_owner, moved):
        await store.async_save()


def relink_borrowers(hass: HomeAssistant, old_owner: str, new_owner: str, moved: dict[str, str]) -> int:
    """Re-point every OTHER object's links from ``old_owner``'s pool to
    ``new_owner``'s (``moved``: old→new part id). Used by object/replace:
    the spares moved to the successor with fresh ids, and borrowers kept
    drawing on the archived predecessor — whose buy tasks are suppressed —
    so the pool silently split in two (bug audit 2026-09-27). Returns the
    number of objects rewritten."""
    touched = 0
    for entry in object_entries(hass):
        if entry.entry_id in (old_owner, new_owner):
            continue
        tasks, changed = relink_tasks(dict(entry.data.get(CONF_TASKS) or {}), old_owner, new_owner, moved)
        if changed:
            write_tasks(hass, entry, tasks)
            touched += 1
    return touched


class PartMoveError(Exception):
    """A part cannot move as asked; ``code`` names why for the caller."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


async def async_move_part(hass: HomeAssistant, source: ConfigEntry, target: ConfigEntry, part_id: str) -> str:
    """Move one part to another object (#262). Returns its id there.

    The part keeps everything that makes it that part: its definition, its
    stock and the used ones waiting, the links of every task that draws on it
    (the old owner's own tasks now borrow it from the new one) and where the
    history says its parts came from. Its manual moves along unless another
    part of the old owner uses the same document.

    The old owner's open buy reminder goes with its next reconcile, and the
    new owner's reconcile makes one if the part is low there. The stock
    sensor is the new owner's from then on.
    """
    if source.entry_id == target.entry_id:
        raise PartMoveError("invalid_target", "The part is already on this object")
    if not is_object_entry(target):
        raise PartMoveError("invalid_target", "The target is not a maintenance object")
    source_obj = source.data.get(CONF_OBJECT) or {}
    target_obj = target.data.get(CONF_OBJECT) or {}
    # The battery fleet mints and removes its own type parts; nothing else
    # may sit on that shelf, and its parts stay where the fleet looks.
    if source_obj.get(BATTERY_FLEET_OBJECT_FLAG) is True or target_obj.get(BATTERY_FLEET_OBJECT_FLAG) is True:
        raise PartMoveError("invalid_target", "Battery fleet parts cannot be moved")
    if target_obj.get("archived_at") is not None:
        raise PartMoveError("invalid_target", "The target object is archived")

    source_parts = dict(source.data.get(CONF_PARTS) or {})
    part = source_parts.get(part_id)
    if not isinstance(part, dict):
        raise PartMoveError("not_found", "Part not found")
    target_parts = dict(target.data.get(CONF_PARTS) or {})
    if len(target_parts) >= MAX_PARTS_PER_OBJECT:
        raise PartMoveError("limit_reached", f"At most {MAX_PARTS_PER_OBJECT} parts per object")

    source_store = await async_store_even_unloaded(hass, source)
    target_store = await async_store_even_unloaded(hass, target)
    if source_store is None or target_store is None:  # pragma: no cover - a Store always loads
        raise PartMoveError("not_loaded", "The object's data could not be loaded")
    stock = source_store.get_part_stock(part_id)
    waiting = source_store.get_part_restoring(part_id)

    new_id = part_id
    while new_id in target_parts:
        new_id = f"{new_id}_moved"
    moved = {part_id: new_id}
    moved_part = {**part, "id": new_id}

    # The manual: documents are object-owned. Alone with this part it moves
    # along; shared with another part of the old owner it stays there.
    doc_id = part.get("doc_id")
    if isinstance(doc_id, str) and doc_id:
        shared = any(pid != part_id and isinstance(p, dict) and p.get("doc_id") == doc_id for pid, p in source_parts.items())
        doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
        if shared or doc_store is None:
            moved_part.pop("doc_id", None)
        else:
            await doc_store.async_rehome({doc_id}, object_id_for_entry(target))

    # The new owner: the part, its stock, and its own tasks' links (they
    # borrowed it until now) and history pointing at themselves.
    target_parts[new_id] = moved_part
    target_tasks, _ = relink_tasks(dict(target.data.get(CONF_TASKS) or {}), source.entry_id, "", moved)
    hass.config_entries.async_update_entry(target, data={**target.data, CONF_PARTS: target_parts, CONF_TASKS: target_tasks})
    if stock is not None:
        target_store.set_part_stock(new_id, stock)
        target_store.set_part_restoring(new_id, waiting)
    target_store.set_part_order(new_id, source_store.get_part_order(part_id))
    relink_history(target_store, source.entry_id, "", moved)
    await target_store.async_save()

    # Everybody else who draws on it.
    for other in object_entries(hass):
        if other.entry_id in (source.entry_id, target.entry_id):
            continue
        tasks, changed = relink_tasks(dict(other.data.get(CONF_TASKS) or {}), source.entry_id, target.entry_id, moved)
        if changed:
            write_tasks(hass, other, tasks)
        await async_relink_history(hass, other, source.entry_id, target.entry_id, moved)

    # The old owner: the part is gone from its shelf, its own tasks (their
    # links name no owner) now borrow it, and so does its history.
    del source_parts[part_id]
    source_tasks, _ = relink_tasks(dict(source.data.get(CONF_TASKS) or {}), "", target.entry_id, moved)
    hass.config_entries.async_update_entry(source, data={**source.data, CONF_PARTS: source_parts, CONF_TASKS: source_tasks})
    relink_history(source_store, "", target.entry_id, moved)
    source_store.remove_part(part_id)
    await source_store.async_save()

    _LOGGER.info("Moved spare part %s from %s to %s", part.get("name"), object_name(source), object_name(target))
    return new_id


def pool_handover(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any] | None:
    """What deleting ``entry`` hands on: the parts other objects draw on and
    the object that takes them (D#256, #262). None when nothing moves.

    The delete dialog says it before the delete; the transfer below decides
    by the same two scans, so the dialog cannot promise another heir.
    """
    wanted = borrowed_part_ids(hass, entry.entry_id)
    owner_parts = entry.data.get(CONF_PARTS) or {}
    names = sorted(str(part.get("name") or "?") for pid, part in owner_parts.items() if pid in wanted and isinstance(part, dict))
    heirs = borrowers_of(hass, entry.entry_id)
    if not names or not heirs:
        return None
    return {"new_owner": object_name(heirs[0]), "new_owner_entry_id": heirs[0].entry_id, "parts": names}


async def async_transfer_pools_on_removal(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Hand a deleted object's borrowed pools to a borrower.

    Must run BEFORE the owner's Store is removed — the stock numbers only exist
    there. Called from ``async_remove_entry``, which is the one hook that fires
    for the panel's delete, Home Assistant's own *Configure → Delete* and the
    service alike; a warning dialog in the panel could never cover the second.
    """
    owner_id = entry.entry_id
    wanted = borrowed_part_ids(hass, owner_id)
    if not wanted:
        return

    owner_parts = entry.data.get(CONF_PARTS) or {}
    pools = {pid: dict(part) for pid, part in owner_parts.items() if pid in wanted}
    if not pools:
        # Linked to parts this object no longer has; the completion path will
        # surface those links as broken on their own.
        return

    heirs = borrowers_of(hass, owner_id)
    if not heirs:  # pragma: no cover - unreachable while the two scans agree
        # ``borrowed_part_ids`` above already found a link, and it matches on
        # exactly the same condition as ``borrowers_of`` (same owner skip, same
        # entry_id compare), so a non-empty ``wanted`` implies a non-empty
        # ``heirs``. Kept because the two are separate functions: if one filter
        # ever grows a condition the other lacks, this returns instead of
        # raising IndexError on the next line.
        return
    heir = heirs[0]

    # Read the stock while the owner's Store still exists.
    source_store = hass.data.get(STORES_CACHE_KEY, {}).get(owner_id)
    if source_store is None:
        source_store = MaintenanceStore(hass, owner_id)
        await source_store.async_load()
    stocks = {pid: source_store.get_part_stock(pid) for pid in pools}
    waiting = {pid: source_store.get_part_restoring(pid) for pid in pools}

    # Move the definitions onto the heir, keeping their ids so the links only
    # need their entry_id rewritten (ids are uuid4 — a clash is not a concern,
    # and keeping them makes the move auditable).
    heir_parts = dict(heir.data.get(CONF_PARTS) or {})
    moved: dict[str, str] = {}
    for pid, part in pools.items():
        target_id = pid
        while target_id in heir_parts:
            target_id = f"{target_id}_moved"
        heir_parts[target_id] = {**part, "id": target_id}
        moved[pid] = target_id

    heir_tasks, _ = relink_tasks(dict(heir.data.get(CONF_TASKS) or {}), owner_id, "", moved)
    hass.config_entries.async_update_entry(
        heir, data={**heir.data, CONF_PARTS: heir_parts, CONF_TASKS: heir_tasks}
    )

    # The parts' manuals go along (bug audit 2026-09-26, SEC-10): documents
    # are object-owned, and the owner's are removed with it right after this —
    # the moved parts' doc_id pointed at nothing. Re-stamped onto the heir.
    part_doc_ids = {str(part["doc_id"]) for part in pools.values() if isinstance(part.get("doc_id"), str) and part["doc_id"]}
    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    if part_doc_ids and doc_store is not None:
        await doc_store.async_rehome(part_doc_ids, object_id_for_entry(heir))

    # Carry the stock over.
    heir_store = hass.data.get(STORES_CACHE_KEY, {}).get(heir.entry_id)
    if heir_store is None:
        heir_store = MaintenanceStore(hass, heir.entry_id)
        await heir_store.async_load()
    for pid, target_id in moved.items():
        value = stocks.get(pid)
        if value is not None:
            heir_store.set_part_stock(target_id, value)
            heir_store.set_part_restoring(target_id, waiting.get(pid, 0))
    relink_history(heir_store, owner_id, "", moved)
    await heir_store.async_save()
    # The parts' stock sensors are made at setup, and its reconcile gives a
    # low part its buy reminder: the heir had neither until something
    # reloaded it, so the part actions could not reach the moved parts and
    # the owner's buy reminder went with the owner (bug audit 2026-11-08, P8-1).
    if heir.state is ConfigEntryState.LOADED:
        hass.config_entries.async_schedule_reload(heir.entry_id)

    # Everybody else now points at the heir, its history included.
    for other in heirs[1:]:
        tasks, changed = relink_tasks(dict(other.data.get(CONF_TASKS) or {}), owner_id, heir.entry_id, moved)
        if changed:
            write_tasks(hass, other, tasks)
        await async_relink_history(hass, other, owner_id, heir.entry_id, moved)

    heir_name = object_name(heir)
    owner_name = object_name(entry)
    ir.async_create_issue(
        hass,
        DOMAIN,
        shared_parts_moved_issue_id(heir.entry_id),
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="shared_parts_moved",
        translation_placeholders={
            "deleted_object": owner_name,
            "new_owner": heir_name,
            "parts": ", ".join(sorted(str(part.get("name") or "?") for part in pools.values())),
        },
    )
    _LOGGER.info(
        "Deleting %s moved %d shared spare part(s) to %s; %d borrower(s) relinked",
        owner_name,
        len(pools),
        heir_name,
        len(heirs),
    )
