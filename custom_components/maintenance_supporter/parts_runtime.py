"""Spare-parts runtime — the hass-aware driver around helpers/parts.py.

Owns the three mutations (consume on completion, restock, manual adjust) and
applies the declarative buy-task reconcile to the entry. The pure rules live in
:mod:`helpers.parts`; this module only wires them to the Store, the ConfigEntry
and the event bus.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import (
    CONF_OBJECT,
    CONF_PART_SEARCH_URL_TEMPLATE,
    CONF_PARTS,
    CONF_TASK_CONSUMES_PARTS,
    CONF_TASKS,
    DOMAIN,
    EVENT_PART_RESTOCKED,
    EVENT_PART_STOCK_LOW,
    EVENT_PART_STOCK_OUT,
)
from .helpers.global_options import get_global_options
from .helpers.i18n import normalize_language
from .helpers.parts import (
    PART_REF_FIELD,
    reconcile_buy_tasks,
    stock_transition,
)

_LOGGER = logging.getLogger(__name__)

_TRANSITION_EVENTS = {
    "low": EVENT_PART_STOCK_LOW,
    "out": EVENT_PART_STOCK_OUT,
    "restocked": EVENT_PART_RESTOCKED,
}

# Dispatcher signal fired after any stock change — the parts sensors listen.
SIGNAL_PARTS_UPDATED = f"{DOMAIN}_parts_updated"


def _get_store(hass: HomeAssistant, entry: ConfigEntry) -> Any:
    rd = getattr(entry, "runtime_data", None)
    return getattr(rd, "store", None) if rd else None


def _fire_transition(
    hass: HomeAssistant,
    entry: ConfigEntry,
    part: dict[str, Any],
    stock: float | None,
    transition: str | None,
) -> None:
    event = _TRANSITION_EVENTS.get(transition or "")
    if event is None:
        return
    obj = entry.data.get(CONF_OBJECT, {})
    hass.bus.async_fire(
        event,
        {
            "entry_id": entry.entry_id,
            "object_id": obj.get("id", ""),
            "object_name": obj.get("name", entry.title),
            "part_id": part["id"],
            "part_name": part.get("name", ""),
            "stock": stock,
            "reorder_threshold": part.get("reorder_threshold"),
        },
    )


def _signal_parts_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    async_dispatcher_send(hass, SIGNAL_PARTS_UPDATED, entry.entry_id)


async def async_change_part_stock(
    hass: HomeAssistant,
    entry: ConfigEntry,
    part_id: str,
    *,
    delta: float | None = None,
    absolute: int | None = None,
) -> float | None:
    """Change one part's stock (clamped at 0), fire the edge event, save.

    Returns the new stock, or None when the part is unknown / untracked with a
    pure delta (a delta on an untracked part starts tracking from 0 so a first
    "restock" works naturally). Schedules the buy-task reconcile.
    """
    part = (entry.data.get(CONF_PARTS) or {}).get(part_id)
    store = _get_store(hass, entry)
    if part is None or store is None:
        return None
    old = store.get_part_stock(part_id)
    if absolute is not None:
        new = max(0.0, float(absolute))
    else:
        new = max(0.0, (old or 0) + float(delta or 0))
    store.set_part_stock(part_id, new)
    # Immediate save: part CRUD and the buy-task reconcile may reload the entry
    # right after, which re-reads the store from disk — a debounced save would
    # silently lose the stock write across that reload.
    await store.async_save()
    _fire_transition(hass, entry, part, new, stock_transition(part, old, new))
    _signal_parts_updated(hass, entry)
    schedule_buy_task_reconcile(hass, entry)
    return new


async def async_handle_completion_parts(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: dict[str, Any],
    *,
    restock_quantity: float | None = None,
    used_parts: list[dict[str, Any]] | None = None,
) -> None:
    """Completion-side part effects: consume linked parts / restock a buy task.

    Called from the coordinator's complete path with the (pre-completion) task
    dict. Consumption only tracks parts that HAVE a tracked stock; a buy task
    (carrying ``part_ref``) restocks its part by ``restock_quantity`` (dialog
    override) or the part's configured default (min 1). Best-effort by design:
    a broken part link must never block the completion itself.
    """
    parts = entry.data.get(CONF_PARTS) or {}
    store = _get_store(hass, entry)
    if store is None:
        return
    changed = False

    ref = task_data.get(PART_REF_FIELD)
    if isinstance(ref, dict) and ref.get("part_id") in parts:
        part = parts[ref["part_id"]]
        qty = restock_quantity if restock_quantity and restock_quantity > 0 else float(part.get("restock_quantity") or 1)
        old = store.get_part_stock(part["id"])
        new = max(0, (old or 0) + qty)
        store.set_part_stock(part["id"], new)
        _fire_transition(hass, entry, part, new, stock_transition(part, old, new))
        changed = True

    # #99: an explicit per-completion selection REPLACES the fixed links —
    # including the empty selection ("nothing used this time"). None keeps the
    # automatic consumes_parts behaviour.
    links = used_parts if used_parts is not None else (task_data.get(CONF_TASK_CONSUMES_PARTS) or [])
    for link in links:
        if not isinstance(link, dict):
            continue
        part = parts.get(link.get("part_id"))
        if part is None:
            continue
        old = store.get_part_stock(part["id"])
        if old is None:
            continue  # catalog-only part — nothing to decrement
        qty = float(link.get("quantity", 1) or 1)
        new = max(0, old - qty)
        store.set_part_stock(part["id"], new)
        _fire_transition(hass, entry, part, new, stock_transition(part, old, new))
        changed = True

    if changed:
        await store.async_save()  # reconcile may reload — see async_change_part_stock
        _signal_parts_updated(hass, entry)
        schedule_buy_task_reconcile(hass, entry)


def schedule_buy_task_reconcile(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Run the buy-task reconcile as a background task.

    Deferred because applying a diff reloads the entry — which must never
    happen from inside the coordinator call (complete/restock) that triggered
    the stock change. The reconcile is declarative/idempotent, so overlapping
    schedules converge.
    """
    entry_id = entry.entry_id

    async def _run() -> None:
        current = hass.config_entries.async_get_entry(entry_id)
        if current is not None:
            await async_reconcile_buy_tasks(hass, current)

    hass.async_create_task(_run(), name=f"{DOMAIN}_buy_task_reconcile_{entry_id}")


_RECONCILE_LOCKS: dict[str, Any] = {}


def discard_reconcile_lock(entry_id: str) -> None:
    """Forget a removed entry's reconcile lock (called from async_remove_entry)."""
    _RECONCILE_LOCKS.pop(entry_id, None)


async def async_reconcile_buy_tasks(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Apply the declarative buy-task reconcile to *entry*.

    A buy task exists exactly while its part opts in AND is low (see
    helpers/parts.reconcile_buy_tasks for the episode semantics). Creates and
    removals are applied through the same primitives the WS CRUD uses (store
    init / full delete-cleanup), then the entry reloads ONCE so per-task
    entities appear/disappear. Returns True when anything changed.

    Concurrency: serialized per entry (reconciles overlap freely with rapid
    CRUD), and the ConfigEntry write applies only the computed DIFF onto a
    fresh read of entry.data — a whole-map write from the pre-await snapshot
    could clobber a part/task another handler persisted in between (a lost
    update seen live when three part creates raced the first reconcile).
    """
    import asyncio

    lock = _RECONCILE_LOCKS.setdefault(entry.entry_id, asyncio.Lock())
    async with lock:
        return await _reconcile_buy_tasks_locked(hass, entry)


async def _reconcile_buy_tasks_locked(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    parts = entry.data.get(CONF_PARTS) or {}
    # An archived or paused object must stay quiet (journey S4): no shopping
    # reminders while it's retired/out of season. Declaratively: an inert
    # object desires NO buy tasks — open reminders are removed, and the
    # resume/unarchive setup catch-up recreates them if the part is still low.
    obj = entry.data.get(CONF_OBJECT, {})
    if obj.get("archived_at") is not None or obj.get("paused_at") is not None:
        parts = {}
    store = _get_store(hass, entry)
    if store is None:
        return False
    tasks: dict[str, Any] = entry.data.get(CONF_TASKS, {})

    new_tasks, created, removed, changed = reconcile_buy_tasks(
        parts,
        store.all_part_stocks(),
        tasks,
        object_id=entry.data.get(CONF_OBJECT, {}).get("id", ""),
        lang=normalize_language(hass),
        search_template=get_global_options(hass).get(CONF_PART_SEARCH_URL_TEMPLATE),
        today=dt_util.now().date(),
        is_task_done=lambda td: store.get_last_performed(td["id"]) is not None,
    )
    if not changed:
        return False

    # The diff relative to the snapshot: brand-new buy tasks, and existing
    # tasks whose part_ref marker was detached. Only these keys are written.
    detached = [
        tid
        for tid in tasks
        if tid in new_tasks and tasks[tid].get(PART_REF_FIELD) != new_tasks[tid].get(PART_REF_FIELD)
    ]

    # Removals first, via the shared full-cleanup primitive (entity registry,
    # store state, group refs, notification state) — without per-task reloads.
    from .websocket.tasks_crud import async_delete_task

    for tid in removed:
        await async_delete_task(hass, entry, tid)

    # Apply the diff onto a FRESH read (never write back pre-await snapshots).
    current = hass.config_entries.async_get_entry(entry.entry_id)
    if current is None:
        return True
    new_data = dict(current.data)
    merged_tasks = dict(new_data.get(CONF_TASKS, {}))
    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = list(obj.get("task_ids", []))
    for tid in created:
        merged_tasks[tid] = new_tasks[tid]
        if tid not in task_ids:
            task_ids.append(tid)
    for tid in detached:
        if tid in merged_tasks:
            td = dict(merged_tasks[tid])
            td.pop(PART_REF_FIELD, None)
            merged_tasks[tid] = td
    obj["task_ids"] = [t for t in task_ids if t in merged_tasks]
    new_data[CONF_TASKS] = merged_tasks
    new_data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(current, data=new_data)

    for tid in created:
        store.init_task(tid)
    await store.async_save()

    _LOGGER.debug(
        "Buy-task reconcile for %s: +%d / -%d",
        entry.title,
        len(created),
        len(removed),
    )
    if created or removed:
        # Entities for created/removed tasks appear/vanish on reload.
        await hass.config_entries.async_reload(entry.entry_id)
    return True
