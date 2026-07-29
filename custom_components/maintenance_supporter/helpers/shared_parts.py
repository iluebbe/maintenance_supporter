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
    CONF_TASK_CONSUMES_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    STORES_CACHE_KEY,
)

_LOGGER = logging.getLogger(__name__)

TRANSFER_ISSUE_PREFIX = "shared_parts_moved_"


def object_entries(hass: HomeAssistant) -> list[ConfigEntry]:
    """Every maintenance OBJECT entry (the global entry is not one)."""
    return [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID
    ]


def borrowers_of(hass: HomeAssistant, owner_id: str) -> list[ConfigEntry]:
    """Objects whose tasks consume a part owned by ``owner_id``.

    Oldest first, so which object inherits a pool is deterministic rather than
    a function of dict ordering.
    """
    found: list[ConfigEntry] = []
    for entry in object_entries(hass):
        if entry.entry_id == owner_id:
            continue
        for task in (entry.data.get(CONF_TASKS) or {}).values():
            links = task.get(CONF_TASK_CONSUMES_PARTS) or []
            if any(
                isinstance(link, dict) and str(link.get("entry_id") or "") == owner_id
                for link in links
            ):
                found.append(entry)
                break
    # created_at is per object; fall back to entry_id for a stable order.
    found.sort(key=lambda e: (str((e.data.get(CONF_OBJECT) or {}).get("created_at") or ""), e.entry_id))
    return found


def borrowed_part_ids(hass: HomeAssistant, owner_id: str) -> set[str]:
    """Which of the owner's parts other objects actually link to."""
    wanted: set[str] = set()
    for entry in object_entries(hass):
        if entry.entry_id == owner_id:
            continue
        for task in (entry.data.get(CONF_TASKS) or {}).values():
            for link in task.get(CONF_TASK_CONSUMES_PARTS) or []:
                if isinstance(link, dict) and str(link.get("entry_id") or "") == owner_id:
                    part_id = str(link.get("part_id") or "").strip()
                    if part_id:
                        wanted.add(part_id)
    return wanted


def _relink(
    tasks: dict[str, Any], old_owner: str, new_owner: str, moved: dict[str, str]
) -> tuple[dict[str, Any], int]:
    """Point links at the pool's new home; ``moved`` maps old→new part id."""
    out: dict[str, Any] = {}
    count = 0
    for task_id, task in tasks.items():
        links = task.get(CONF_TASK_CONSUMES_PARTS)
        if not isinstance(links, list) or not links:
            out[task_id] = task
            continue
        new_links = []
        touched = False
        for link in links:
            if (
                isinstance(link, dict)
                and str(link.get("entry_id") or "") == old_owner
                and str(link.get("part_id") or "") in moved
            ):
                new_link = dict(link)
                new_link["part_id"] = moved[str(link["part_id"])]
                if new_owner == "":
                    new_link.pop("entry_id", None)  # the pool is now ours
                else:
                    new_link["entry_id"] = new_owner
                new_links.append(new_link)
                touched = True
            else:
                new_links.append(link)
        if touched:
            task = {**task, CONF_TASK_CONSUMES_PARTS: new_links}
            count += 1
        out[task_id] = task
    return out, count


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
    if not heirs:
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

    heir_tasks, _ = _relink(dict(heir.data.get(CONF_TASKS) or {}), owner_id, "", moved)
    hass.config_entries.async_update_entry(
        heir, data={**heir.data, CONF_PARTS: heir_parts, CONF_TASKS: heir_tasks}
    )

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
        tasks, changed = _relink(dict(other.data.get(CONF_TASKS) or {}), owner_id, heir.entry_id, moved)
        if changed:
            hass.config_entries.async_update_entry(other, data={**other.data, CONF_TASKS: tasks})

    heir_name = str((heir.data.get(CONF_OBJECT) or {}).get("name") or heir.title)
    owner_name = str((entry.data.get(CONF_OBJECT) or {}).get("name") or entry.title)
    ir.async_create_issue(
        hass,
        DOMAIN,
        f"{TRANSFER_ISSUE_PREFIX}{heir.entry_id}",
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
