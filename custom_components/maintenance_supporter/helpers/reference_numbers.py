"""Human-readable reference numbers (#170): object ``8``, task ``8.3``,
completion ``8.3-2``.

Why numbers and not the ids: a UUID on a printed service booklet is noise.
A short, stable number lets a photo, a paper note or a booklet line say
"that was 8.3-2" and lets the panel's search jump straight there.

The rules that make them trustworthy on paper:

* **Assigned once, never reused, never renumbered.** Every level keeps a
  high-water counter (``next_object_ref`` in a small Store,
  ``object.next_task_ref`` on the object, ``next_history_ref`` in the
  task's dynamic Store state). Deleting 8.2 does not turn 8.3 into 8.2, and
  the next task is 8.4 even if 8.3 is gone.
* **Creation order.** Existing objects and tasks are numbered on first
  contact sorted by their creation date, so an install that upgrades gets
  the numbering a user would have written down by hand. Every later
  creation — through the panel, the options flow, an import, a template,
  the battery-fleet setup — is picked up lazily: objects when their entry
  is set up, tasks on the coordinator's next refresh (which every write
  triggers), completions in the coordinator's completion choke point.
* **Imports keep their numbers** where they do not collide; a collision
  (the same export restored next to its originals) is resolved by
  renumbering the younger entry.
* **Compaction is explicit.** The one way numbers ever move is the admin
  action ``reference_numbers/compact`` (#170 follow-up: a user who deleted
  test objects wants a tidy sequence again). It renumbers EVERY level in
  one pass — objects 1..N and tasks 1..M in creation order, completions
  1..K by date — and resets the counters, so afterwards the lazy passes
  above continue from N+1 / M+1 / K+1. Nothing else ever renumbers.

Formatting lives here too, so the WS layer, the search and the tests all
spell a reference the same way — and the panel's ``helpers/reference.ts``
mirrors it.
"""

from __future__ import annotations

import asyncio
import re
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.storage import Store

from ..const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from .history import completed_entries

if TYPE_CHECKING:
    from ..storage import MaintenanceStore

REF_STORE_KEY = f"{DOMAIN}.reference_numbers"
REF_STORE_VERSION = 1
REFERENCE_NUMBERS_KEY = "_reference_numbers"

#: ``8`` / ``8.3`` / ``8.3-2`` — what a user types into the search.
REF_PATTERN = re.compile(r"^(\d+)(?:\.(\d+)(?:-(\d+))?)?$")


def format_task_ref(object_ref: int | None, task_ref: int | None) -> str | None:
    if object_ref is None or task_ref is None:
        return None
    return f"{object_ref}.{task_ref}"


def format_entry_ref(object_ref: int | None, task_ref: int | None, entry_ref: int | None) -> str | None:
    task = format_task_ref(object_ref, task_ref)
    if task is None or entry_ref is None:
        return None
    return f"{task}-{entry_ref}"


def parse_ref(text: str) -> tuple[int, int | None, int | None] | None:
    """``"8.3-2"`` → ``(8, 3, 2)``; ``"8"`` → ``(8, None, None)``; else None."""
    m = REF_PATTERN.match(text.strip())
    if not m:
        return None
    obj, task, entry = m.groups()
    return int(obj), int(task) if task else None, int(entry) if entry else None


def _as_ref(value: Any) -> int | None:
    return value if isinstance(value, int) and not isinstance(value, bool) and value > 0 else None


def assign_task_refs(entry_data: dict[str, Any]) -> dict[str, Any] | None:
    """Number every task without a ``ref_no`` (creation order); returns the
    new entry data, or None when nothing was missing. Pure — the caller
    persists. Duplicates (an import restored next to its original) lose the
    number on the younger task and get a fresh one."""
    tasks: dict[str, Any] = entry_data.get(CONF_TASKS) or {}
    obj: dict[str, Any] = dict(entry_data.get(CONF_OBJECT) or {})
    seen: set[int] = set()
    missing: list[str] = []
    for tid, td in tasks.items():
        ref = _as_ref(td.get("ref_no"))
        if ref is None or ref in seen:
            missing.append(tid)
        else:
            seen.add(ref)
    if not missing:
        return None
    high = max([_as_ref(obj.get("next_task_ref")) or 1, *(r + 1 for r in seen)])
    missing.sort(key=lambda tid: (str(tasks[tid].get("created_at") or ""), tid))
    new_tasks = dict(tasks)
    for tid in missing:
        new_tasks[tid] = {**tasks[tid], "ref_no": high}
        high += 1
    obj["next_task_ref"] = high
    return {**entry_data, CONF_OBJECT: obj, CONF_TASKS: new_tasks}


def next_history_ref(store: MaintenanceStore, task_id: str, history: list[dict[str, Any]]) -> int:
    """Hand out the next completion number for a task and bump the
    high-water mark in the task's dynamic state (imports that carry higher
    numbers move the mark up)."""
    high = _as_ref(store.get_task_state(task_id).get("next_history_ref")) or 1  # the counter is task state, owned by the store
    for e in history:
        r = _as_ref(e.get("ref_no")) if isinstance(e, dict) else None
        if r is not None and r + 1 > high:
            high = r + 1
    store.update_task_state(task_id, next_history_ref=high + 1)
    return high


def assign_history_refs(store: MaintenanceStore, tasks: dict[str, Any]) -> int:
    """Number completed history entries that carry no ``ref_no`` — per task,
    oldest first (the backfill for records from before 2.79). Mutates the
    store's entry dicts in place; returns how many were numbered."""
    count = 0
    for task_id in tasks:
        history = store.get_history(task_id)
        missing = [e for e in completed_entries(history) if _as_ref(e.get("ref_no")) is None]
        if not missing:
            continue
        missing.sort(key=lambda e: str(e.get("timestamp") or ""))
        for e in missing:
            e["ref_no"] = next_history_ref(store, task_id, history)
            count += 1
    return count


# ─── compaction (the explicit admin action) ──────────────────────────────────


def _task_creation_order(tasks: dict[str, Any]) -> list[str]:
    """Task ids in creation order — the SAME key the lazy pass uses."""
    return sorted(tasks, key=lambda tid: (str(tasks[tid].get("created_at") or ""), tid))


def compact_task_refs(entry_data: dict[str, Any]) -> dict[str, Any] | None:
    """Renumber every task (archived ones included) 1..M in creation order
    and set ``next_task_ref`` to M+1. Pure — returns the new entry data, or
    None when the object already reads exactly like that."""
    tasks: dict[str, Any] = entry_data.get(CONF_TASKS) or {}
    obj: dict[str, Any] = dict(entry_data.get(CONF_OBJECT) or {})
    new_tasks = dict(tasks)
    changed = False
    for ref, tid in enumerate(_task_creation_order(tasks), start=1):
        if _as_ref(tasks[tid].get("ref_no")) != ref:
            new_tasks[tid] = {**tasks[tid], "ref_no": ref}
            changed = True
    high = len(tasks) + 1
    if obj.get("next_task_ref") != high:
        obj["next_task_ref"] = high
        changed = True
    if not changed:
        return None
    return {**entry_data, CONF_OBJECT: obj, CONF_TASKS: new_tasks}


def compact_history_refs(store: MaintenanceStore, tasks: dict[str, Any]) -> tuple[int, bool]:
    """Renumber the completed entries of every task 1..K by timestamp (oldest
    first) and set ``next_history_ref`` to K+1 (absent when K is 0 — the
    lazy counter's own "start at 1"). Entries of other types carry no number;
    a stray one is dropped. Mutates the store's dicts in place; returns
    ``(completions counted, anything changed)``."""
    total = 0
    changed = False
    for task_id in tasks:
        history = store.get_history(task_id)
        done = completed_entries(history)
        done.sort(key=lambda e: str(e.get("timestamp") or ""))
        for ref, e in enumerate(done, start=1):
            total += 1
            if _as_ref(e.get("ref_no")) != ref:
                e["ref_no"] = ref
                changed = True
        numbered = {id(e) for e in done}
        for e in history:
            if isinstance(e, dict) and id(e) not in numbered and "ref_no" in e:
                del e["ref_no"]
                changed = True
        target = len(done) + 1 if done else None
        if _as_ref(store.get_task_state(task_id).get("next_history_ref")) != target:
            store.update_task_state(task_id, next_history_ref=target)
            changed = True
    return total, changed


async def compact_reference_numbers(hass: HomeAssistant) -> dict[str, int]:
    """Renumber everything sequentially — see ``ReferenceNumbers.async_compact``.
    Raises HomeAssistantError when the integration is not set up."""
    reference_numbers = (hass.data.get(DOMAIN) or {}).get(REFERENCE_NUMBERS_KEY)
    if not isinstance(reference_numbers, ReferenceNumbers):
        raise HomeAssistantError("Reference numbers are not loaded")
    return await reference_numbers.async_compact()


class ReferenceNumbers:
    """The object-level counter + the assignment pass for object entries."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, REF_STORE_VERSION, REF_STORE_KEY)
        self._next_object_ref = 1
        self._lock = asyncio.Lock()

    async def async_load(self) -> None:
        raw = await self._store.async_load()
        if isinstance(raw, dict):
            self._next_object_ref = _as_ref(raw.get("next_object_ref")) or 1

    async def async_assign_objects(self) -> int:
        """Number every object entry that lacks a ``ref_no`` — all of them in
        one pass sorted by creation date, so boot order (entries set up
        concurrently) never decides who is 1 and who is 2. Returns the count."""
        async with self._lock:
            entries = [e for e in self.hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]
            seen: set[int] = set()
            missing: list[ConfigEntry] = []
            for entry in sorted(entries, key=_entry_created):
                ref = _as_ref((entry.data.get(CONF_OBJECT) or {}).get("ref_no"))
                if ref is None or ref in seen:
                    missing.append(entry)
                else:
                    seen.add(ref)
            if not missing:
                return 0
            high = max([self._next_object_ref, *(r + 1 for r in seen)])
            for entry in missing:
                obj = dict(entry.data.get(CONF_OBJECT) or {})
                obj["ref_no"] = high
                high += 1
                self.hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_OBJECT: obj})
            self._next_object_ref = high
            await self._store.async_save({"next_object_ref": high})
            return len(missing)

    async def async_compact(self) -> dict[str, int]:
        """The explicit renumbering: objects 1..N in creation order, tasks
        1..M per object, completions 1..K per task by date, every counter
        reset to the next free number. Archived objects and tasks are
        included — they keep a number too; an object whose entry is not
        loaded (disabled, setup-retry) still gets its object and task
        numbers, its history waits for the next load.

        Every in-memory write happens BEFORE the first ``await`` (and under
        the same lock as the lazy object pass), so no refresh can observe or
        interleave with a half-renumbered state; the Stores are then saved
        and every loaded coordinator refreshed. Returns
        ``{"objects": N, "tasks": total, "completions": total}``."""
        async with self._lock:
            entries = sorted(
                (e for e in self.hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID),
                key=_entry_created,
            )
            task_total = 0
            completion_total = 0
            stores: list[MaintenanceStore] = []
            coordinators: list[Any] = []
            for object_ref, entry in enumerate(entries, start=1):
                old_data = dict(entry.data)
                obj = dict(old_data.get(CONF_OBJECT) or {})
                obj["ref_no"] = object_ref
                renumbered = {**old_data, CONF_OBJECT: obj}
                new_data = compact_task_refs(renumbered) or renumbered
                tasks: dict[str, Any] = new_data.get(CONF_TASKS) or {}
                task_total += len(tasks)
                if new_data != old_data:
                    self.hass.config_entries.async_update_entry(entry, data=new_data)
                rd = getattr(entry, "runtime_data", None)
                store = getattr(rd, "store", None) if rd else None
                if store is None:
                    continue
                count, changed = compact_history_refs(store, tasks)
                completion_total += count
                if changed:
                    stores.append(store)
                coordinator = getattr(rd, "coordinator", None)
                if coordinator is not None:
                    coordinators.append(coordinator)
            self._next_object_ref = len(entries) + 1
            await self._store.async_save({"next_object_ref": self._next_object_ref})
            for store in stores:
                await store.async_save()
            for coordinator in coordinators:
                await coordinator.async_refresh_now()
            return {"objects": len(entries), "tasks": task_total, "completions": completion_total}


def _entry_created(entry: ConfigEntry) -> tuple[float, str]:
    created = getattr(entry, "created_at", None)
    try:
        stamp = created.timestamp() if created is not None else 0.0
    except (AttributeError, OSError, OverflowError, ValueError):
        stamp = 0.0
    return stamp, entry.entry_id
