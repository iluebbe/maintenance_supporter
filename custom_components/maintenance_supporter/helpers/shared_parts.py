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
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DOCUMENT_STORE_KEY,
    DOMAIN,
    STORES_CACHE_KEY,
)
from .aggregate import get_object_entries, object_name
from .issues import SHARED_PARTS_MOVED_PREFIX, shared_parts_moved_issue_id
from .parts import iter_part_links, map_part_links
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


def relink_tasks(
    tasks: dict[str, Any], old_owner: str, new_owner: str, moved: dict[str, str]
) -> tuple[dict[str, Any], int]:
    """Point links at the pool's new home; ``moved`` maps old→new part id.

    ``new_owner == ""`` means the pool now lives on the tasks' own object
    (the link loses its ``entry_id``). Task-level AND phase-level links move
    (bug audit 2026-09-27). Returns the tasks and how many changed.
    """

    def _rewrite(link: dict[str, Any]) -> dict[str, Any]:
        if str(link.get("entry_id") or "") != old_owner or str(link.get("part_id") or "") not in moved:
            return link
        link["part_id"] = moved[str(link["part_id"])]
        if new_owner == "":
            link.pop("entry_id", None)  # the pool is now ours
        else:
            link["entry_id"] = new_owner
        return link

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
            hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})
            touched += 1
    return touched


async def async_transfer_pools_on_removal(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Hand a deleted object's borrowed pools to a borrower.

    Must run BEFORE the owner's Store is removed — the stock numbers only exist
    there. Called from ``async_remove_entry``, which is the one hook that fires
    for the panel's delete, Home Assistant's own *Configure → Delete* and the
    service alike; a warning dialog in the panel could never cover the second.
    """
    from homeassistant.helpers import issue_registry as ir

    from ..storage import MaintenanceStore

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
        from ..websocket import object_id_for_entry

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
    await heir_store.async_save()

    # Everybody else now points at the heir.
    for other in heirs[1:]:
        tasks, changed = relink_tasks(dict(other.data.get(CONF_TASKS) or {}), owner_id, heir.entry_id, moved)
        if changed:
            hass.config_entries.async_update_entry(other, data={**other.data, CONF_TASKS: tasks})

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
