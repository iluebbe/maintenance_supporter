"""Spare-parts runtime — the hass-aware driver around helpers/parts.py.

Owns the mutations (consume on completion, restock, manual adjust, a
reusable part ready again) and applies the declarative buy-task reconcile to
the entry. The pure rules live in
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
    BATTERY_FLEET_TASK_FLAG,
    CONF_CURRENCY_DECIMALS,
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
from .helpers.aggregate import object_name as _object_name
from .helpers.aggregate import store_of
from .helpers.global_options import global_option
from .helpers.i18n import normalize_language
from .helpers.parts import (
    PART_REF_FIELD,
    POOL_IN_USE_FIELD,
    on_hand,
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


def resolve_part_link(
    hass: HomeAssistant,
    entry: ConfigEntry,
    link: dict[str, Any],
    *,
    link_owners: dict[str, str] | None = None,
) -> tuple[ConfigEntry | None, dict[str, Any] | None, Any]:
    """Resolve a task→part link to ``(owner_entry, part, store)``.

    The owner is the link's ``entry_id`` (#111 pooled link), a
    ``link_owners`` fallback (part_id → entry_id, derived from the task's
    consumes_parts), or the task's own entry. Any element can be None when
    that leg is broken — what a broken link MEANS (repair issue, silent
    skip, raw-id name fallback) stays the caller's business, which is
    exactly where the three hand-copied resolvers had drifted.
    """
    part_id = str(link.get("part_id") or "")
    owner_id = str(link.get("entry_id") or "").strip() or (link_owners or {}).get(part_id) or entry.entry_id
    owner = entry if owner_id == entry.entry_id else hass.config_entries.async_get_entry(owner_id)
    if owner is None:
        return None, None, None
    part = (owner.data.get(CONF_PARTS) or {}).get(part_id)
    return owner, part, store_of(owner)


def part_link_name(hass: HomeAssistant, entry: ConfigEntry, link: dict[str, Any]) -> str:
    """Display name for a link's part, falling back to the raw part id."""
    _owner, part, _store = resolve_part_link(hass, entry, link)
    name = (part or {}).get("name")
    return str(name) if name else str(link.get("part_id"))


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
            "object_name": _object_name(entry),
            "part_id": part["id"],
            "part_name": part.get("name", ""),
            "stock": stock,
            "reorder_threshold": part.get("reorder_threshold"),
        },
    )


def _owned(store: Any, part: dict[str, Any], stock: float | None = None) -> float | None:
    """The part's on-hand count (stock, plus the waiting pile of a reusable
    part, #208) — what the low / out / restocked edges compare."""
    pid = part["id"]
    return on_hand(part, store.get_part_stock(pid) if stock is None else stock, store.get_part_restoring(pid))


def _book_use(store: Any, part: dict[str, Any], qty: float, *, keeps_used: bool = True) -> tuple[float | None, float | None] | None:
    """Book ``qty`` of a part as used (positive) or given back (negative).

    The stock goes down (up); a reusable part's used ones are not gone but
    wait to be ready again (#208), so its pile goes up (down) by as much.
    Returns the on-hand count before and after, None for an untracked part
    (catalog-only: nothing to book). The one booking behind completions,
    history edits and the battery fleet.

    What the stock cannot cover came off a reusable part's waiting pile: it
    was made ready (charged, sharpened) and never marked so. Growing the pile
    by the full quantity anyway made a use add to what is owned, without limit
    while nobody pressed *ready again* (bug audit 2026-10-17, S-2).
    ``keeps_used`` False: the ones taken out are another part (D#213, other
    cells went in), so this part's pile only gives.
    """
    pid = part["id"]
    old = store.get_part_stock(pid)
    if old is None:
        return None
    before = _owned(store, part, old)
    if part.get("reuse") and qty < 0:
        # A reusable one given back comes out of the waiting pile. One made
        # ready again since is in the stock already: added once more, it was
        # owned twice (bug audit 2026-10-16, S6).
        pile = store.get_part_restoring(pid)
        back = min(-qty, pile)
        store.set_part_stock(pid, old + back)
        store.set_part_restoring(pid, pile - back)
        return before, _owned(store, part)
    taken = min(qty, old)
    store.set_part_stock(pid, old - taken)
    if part.get("reuse"):
        pile = store.get_part_restoring(pid)
        pile -= min(qty - taken, pile)
        store.set_part_restoring(pid, pile + qty if keeps_used else pile)
    return before, _owned(store, part)


def _signal_parts_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    async_dispatcher_send(hass, SIGNAL_PARTS_UPDATED, entry.entry_id)


async def async_change_part_stock(
    hass: HomeAssistant,
    entry: ConfigEntry,
    part_id: str,
    *,
    delta: float | None = None,
    absolute: float | None = None,
    use: bool = False,
    keeps_used: bool = True,
    restoring: float | None = None,
) -> float | None:
    """Change one part's stock (clamped at 0), fire the edge event, save.

    Returns the new stock, or None when the part is unknown / untracked with a
    pure delta (a delta on an untracked part starts tracking from 0 so a first
    "restock" works naturally). Schedules the buy-task reconcile.

    ``use``: the delta is items going into service (negative) — booked like a
    completion's parts (:func:`_book_use`), so a reusable part's used ones
    wait to be ready again (#208); an untracked part is left untracked.
    ``keeps_used`` False: the ones taken out are another part
    (:func:`_book_use`).

    ``restoring``: set a reusable part's waiting pile in the same booking
    (after the stock, which a first count creates), so what is owned moves
    once and fires at most one edge: the part form and undo set both.
    """
    part = (entry.data.get(CONF_PARTS) or {}).get(part_id)
    store = store_of(entry)
    if part is None or store is None:
        return None
    if use:
        booked = _book_use(store, part, -float(delta or 0), keeps_used=keeps_used)
        if booked is None:
            return None
        old_owned, new_owned = booked
    else:
        old_owned = _owned(store, part)
        old = store.get_part_stock(part_id)
        if absolute is not None:
            target = max(0.0, float(absolute))
        else:
            target = max(0.0, (old or 0) + float(delta or 0))
        store.set_part_stock(part_id, target)
        if restoring is not None:
            store.set_part_restoring(part_id, restoring)
        new_owned = _owned(store, part)
    new: float | None = store.get_part_stock(part_id)
    # Immediate save: part CRUD and the buy-task reconcile may reload the entry
    # right after, which re-reads the store from disk — a debounced save would
    # silently lose the stock write across that reload.
    await store.async_save()
    _fire_transition(hass, entry, part, new, stock_transition(part, old_owned, new_owned))
    _signal_parts_updated(hass, entry)
    schedule_buy_task_reconcile(hass, entry)
    return new


async def async_untrack_part_stock(hass: HomeAssistant, entry: ConfigEntry, part_id: str) -> None:
    """Stop counting a part (catalog-only): its stock and waiting pile go,
    and the buy tasks are re-planned."""
    store = store_of(entry)
    if store is None:
        return
    store.set_part_stock(part_id, None)
    await store.async_save()
    _signal_parts_updated(hass, entry)
    schedule_buy_task_reconcile(hass, entry)


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
    store = store_of(entry)
    if store is None:
        return
    changed = False

    ref = task_data.get(PART_REF_FIELD)
    if isinstance(ref, dict) and ref.get("part_id") in parts:
        part = parts[ref["part_id"]]
        # Packages bought × package size (#98 follow-up); without a package
        # size one package is one unit.
        from .helpers.parts import restock_units

        qty = restock_units(part, restock_quantity)
        old_owned = _owned(store, part)
        new = max(0, (store.get_part_stock(part["id"]) or 0) + qty)
        store.set_part_stock(part["id"], new)
        _fire_transition(hass, entry, part, new, stock_transition(part, old_owned, _owned(store, part)))
        changed = True

    # #99: an explicit per-completion selection REPLACES the fixed links —
    # including the empty selection ("nothing used this time"). None keeps the
    # automatic consumes_parts behaviour — phase-aware (#139): the phase
    # currently due may override which parts a completion consumes.
    from .helpers.phases import effective_field

    # #181: the battery fleet task consumes per DEVICE (Battery Notes quantity,
    # in ``async_mark_replaced`` / ``async_record_replacement``); a task-level
    # link on it would be charged again on every fleet completion, so the
    # automatic links are ignored there. An explicit selection still applies.
    # Any: the links come from storage or a completion request — each one is
    # shape-checked below.
    links: list[Any]
    if used_parts is not None:
        links = used_parts
    elif task_data.get(BATTERY_FLEET_TASK_FLAG):
        links = []
    else:
        links = effective_field(task_data, CONF_TASK_CONSUMES_PARTS) or []
    # #111: a link may name another object's pool. Every touched entry has its
    # own parts dict and its own Store, so collect them per entry and save each.
    touched: dict[str, tuple[ConfigEntry, Any]] = {}
    if changed:
        touched[entry.entry_id] = (entry, store)
    broken: list[str] = []

    for link in links:
        if not isinstance(link, dict):
            continue
        target_entry, part, target_store = resolve_part_link(hass, entry, link)
        if target_entry is None or target_store is None or part is None:
            # The pool is gone (owner deleted, its store unavailable, or the
            # part removed from it). Silence here would record a completion
            # that consumed nothing and tell nobody — surface it instead.
            broken.append(str(link.get("part_id") or "?"))
            continue
        booked = _book_use(target_store, part, float(link.get("quantity", 1) or 1))
        if booked is None:
            continue  # catalog-only part — nothing to decrement
        _fire_transition(hass, target_entry, part, target_store.get_part_stock(part["id"]), stock_transition(part, *booked))
        touched[target_entry.entry_id] = (target_entry, target_store)
        changed = True

    if broken:
        _raise_broken_link_issue(hass, entry, broken)

    for target_entry, target_store in touched.values():
        await target_store.async_save()  # reconcile may reload — see async_change_part_stock
        _signal_parts_updated(hass, target_entry)
        schedule_buy_task_reconcile(hass, target_entry)


async def async_apply_history_parts_edit(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: dict[str, Any],
    old_used: list[dict[str, Any]],
    new_used: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Reconcile stock for an edited history entry's parts (#130).

    :func:`apply_history_parts_edit` + :func:`async_commit_parts_edit` in
    one call; returns the enriched list to store on the entry.
    """
    enriched, touched = apply_history_parts_edit(hass, entry, task_data, old_used, new_used)
    await async_commit_parts_edit(hass, touched)
    return enriched


async def async_commit_parts_edit(hass: HomeAssistant, touched: list[tuple[ConfigEntry, Any]]) -> None:
    """Save the Stores :func:`apply_history_parts_edit` changed, signal the
    parts sensors and reconcile the buy tasks."""
    for owner, store in touched:
        await store.async_save()
        _signal_parts_updated(hass, owner)
        schedule_buy_task_reconcile(hass, owner)


def apply_history_parts_edit(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: dict[str, Any],
    old_used: list[dict[str, Any]],
    new_used: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[tuple[ConfigEntry, Any]]]:
    """The synchronous half of a history entry's parts edit (#130).

    Applies the per-part difference between the entry's previous and new
    ``used_parts`` to the owning stocks (consuming more decrements, reducing
    a quantity returns the difference) and returns the enriched list to store
    on the entry (``{part_id, name, quantity}`` + ``entry_id`` for pooled
    parts) plus the touched ``(entry, store)`` pairs for
    :func:`async_commit_parts_edit`. Owner resolution per part: an explicit
    ``entry_id`` on the link, else the task's ``consumes_parts`` link for
    that part (#111 pools), else the object's own catalog. Best-effort like
    the completion path — a vanished part skips its stock math but stays
    recorded by name.

    Synchronous on purpose: the history edit applies the delta and writes
    the entry in one go, so the delta is computed from the entry as it is
    stored at that moment and a vanished entry is refused BEFORE any stock
    moved (bug audit 2026-09-27).
    """
    from .helpers.parts import iter_part_links

    # Phase links name pools too (a phase may consume another object's part).
    link_owners: dict[str, str] = {}
    for link in iter_part_links(task_data):
        if link.get("part_id") and link.get("entry_id"):
            link_owners[str(link["part_id"])] = str(link["entry_id"])

    def resolve(link: dict[str, Any]) -> tuple[ConfigEntry, dict[str, Any], Any] | None:
        owner, part, store = resolve_part_link(hass, entry, link, link_owners=link_owners)
        if owner is None or part is None or store is None:
            return None
        return owner, part, store

    def quantities(links: list[dict[str, Any]]) -> dict[str, float]:
        out: dict[str, float] = {}
        for link in links:
            if isinstance(link, dict) and link.get("part_id"):
                out[str(link["part_id"])] = out.get(str(link["part_id"]), 0.0) + float(link.get("quantity", 1) or 1)
        return out

    old_q = quantities(old_used)
    new_q = quantities(new_used)
    by_id = {str(link["part_id"]): link for link in new_used if isinstance(link, dict) and link.get("part_id")}
    for link in old_used:
        if isinstance(link, dict) and link.get("part_id"):
            by_id.setdefault(str(link["part_id"]), link)

    touched: dict[str, tuple[ConfigEntry, Any]] = {}
    for part_id in set(old_q) | set(new_q):
        delta = new_q.get(part_id, 0.0) - old_q.get(part_id, 0.0)
        if delta == 0:
            continue
        resolved = resolve(by_id.get(part_id) or {"part_id": part_id})
        if resolved is None:
            continue
        owner, part, store = resolved
        edge = _book_use(store, part, delta)
        if edge is None:
            continue  # catalog-only part — nothing to adjust
        _fire_transition(hass, owner, part, store.get_part_stock(part["id"]), stock_transition(part, *edge))
        touched[owner.entry_id] = (owner, store)

    # #104: a part already on the entry keeps the price it was booked at; one
    # added by the edit is valued at today's price.
    from .helpers.parts import unit_price

    booked = {
        str(link["part_id"]): link["unit_cost"]
        for link in old_used
        if isinstance(link, dict) and link.get("part_id") and isinstance(link.get("unit_cost"), (int, float))
    }
    enriched: list[dict[str, Any]] = []
    for link in new_used:
        if not isinstance(link, dict) or not link.get("part_id"):
            continue
        resolved = resolve(link)
        name = resolved[1].get("name") if resolved else link.get("name")
        item: dict[str, Any] = {
            "part_id": str(link["part_id"]),
            "name": name or str(link["part_id"]),
            "quantity": float(link.get("quantity", 1) or 1),
        }
        if resolved and resolved[0].entry_id != entry.entry_id:
            item["entry_id"] = resolved[0].entry_id
        price = booked.get(item["part_id"])
        if price is None and resolved:
            price = unit_price(resolved[1])
        if price is not None:
            item["unit_cost"] = price
        enriched.append(item)
    return enriched, list(touched.values())


async def async_part_ready_again(
    hass: HomeAssistant,
    entry: ConfigEntry,
    part_id: str,
    quantity: float | None = None,
) -> dict[str, float] | None:
    """Move used items of a reusable part back to the stock (#208): the
    cells are charged, the blades sharpened. ``quantity`` defaults to every
    waiting one and is capped at them. None for an unknown, untracked or
    not reusable part. What is owned does not change, so no edge fires."""
    part = (entry.data.get(CONF_PARTS) or {}).get(part_id)
    store = store_of(entry)
    if part is None or store is None or not part.get("reuse"):
        return None
    stock = store.get_part_stock(part_id)
    if stock is None:
        return None
    waiting = store.get_part_restoring(part_id)
    moved = waiting if quantity is None else min(waiting, max(0.0, float(quantity)))
    store.set_part_restoring(part_id, waiting - moved)
    store.set_part_stock(part_id, stock + moved)
    await store.async_save()
    _signal_parts_updated(hass, entry)
    return {"moved": moved, "stock": store.get_part_stock(part_id) or 0, "restoring": store.get_part_restoring(part_id)}


async def async_part_dispose(
    hass: HomeAssistant,
    entry: ConfigEntry,
    part_id: str,
    quantity: float | None = None,
) -> dict[str, float] | None:
    """Used items of a reusable part that cannot be made ready again (#218):
    a dead cell, a blade past sharpening. They leave the waiting pile without
    going back to the stock, so what is owned shrinks and the reorder
    threshold sees it. ``quantity`` defaults to one and is capped at the
    waiting ones. None for an unknown, untracked or not reusable part."""
    part = (entry.data.get(CONF_PARTS) or {}).get(part_id)
    store = store_of(entry)
    if part is None or store is None or not part.get("reuse") or store.get_part_stock(part_id) is None:
        return None
    waiting = store.get_part_restoring(part_id)
    gone = min(waiting, max(0.0, 1.0 if quantity is None else float(quantity)))
    await async_set_part_restoring(hass, entry, part_id, waiting - gone)
    return {"disposed": gone, "stock": store.get_part_stock(part_id) or 0, "restoring": store.get_part_restoring(part_id)}


async def async_set_part_restoring(hass: HomeAssistant, entry: ConfigEntry, part_id: str, count: float) -> None:
    """Set how many used ones wait (a correction, or a worn-out one thrown
    away): fires the edge event when what is owned crosses the threshold."""
    part = (entry.data.get(CONF_PARTS) or {}).get(part_id)
    store = store_of(entry)
    if part is None or store is None:
        return
    before = _owned(store, part)
    store.set_part_restoring(part_id, count)
    await store.async_save()
    _fire_transition(hass, entry, part, store.get_part_stock(part_id), stock_transition(part, before, _owned(store, part)))
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
    owner_inert = obj.get("archived_at") is not None or obj.get("paused_at") is not None
    if owner_inert:
        # ...except for a pool OTHER live objects still draw on (#111): the
        # shelf is in use, only its owner retired. Suppressing those too
        # meant the borrowers ran the pool empty without a single reminder
        # (bug audit 2026-09-27).
        from .helpers.shared_parts import borrowed_part_ids

        in_use = borrowed_part_ids(hass, entry.entry_id, active_only=True)
        parts = {pid: part for pid, part in parts.items() if pid in in_use}
    store = store_of(entry)
    if store is None:
        return False
    tasks: dict[str, Any] = entry.data.get(CONF_TASKS, {})

    # A reusable part's used ones are still owned (#208): nobody buys cells
    # that are only waiting to be charged.
    owned = {pid: (_owned(store, parts[pid], stock) if pid in parts else stock) for pid, stock in store.all_part_stocks().items()}
    new_tasks, created, removed, changed = reconcile_buy_tasks(
        parts,
        owned,
        tasks,
        object_id=entry.data.get(CONF_OBJECT, {}).get("id", ""),
        lang=normalize_language(hass),
        search_template=global_option(hass, CONF_PART_SEARCH_URL_TEMPLATE),
        country=hass.config.country,
        today=dt_util.now().date(),
        decimals=int(global_option(hass, CONF_CURRENCY_DECIMALS)),
        is_task_done=lambda td: store.get_last_performed(td["id"]) is not None,
    )
    # The buy tasks that stay live although their owner is paused: every one
    # left on an inert owner is for a pool in use (``parts`` was narrowed to
    # those above). Marked here, unmarked once the owner is live again.
    flips = [
        tid
        for tid, td in new_tasks.items()
        if td.get(PART_REF_FIELD) and (td.get(POOL_IN_USE_FIELD) is True) != owner_inert
    ]
    if not changed and not flips:
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
    for tid in flips:
        if tid in merged_tasks and merged_tasks[tid].get(PART_REF_FIELD):
            td = dict(merged_tasks[tid])
            if owner_inert:
                td[POOL_IN_USE_FIELD] = True
            else:
                td.pop(POOL_IN_USE_FIELD, None)
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
    if created or removed or flips:
        # Entities for created/removed tasks appear/vanish on reload; a
        # flipped pool mark changes whether the task reads as paused.
        await hass.config_entries.async_reload(entry.entry_id)

    # v2.67: mirror the new buy-task set into the configured shopping list
    # (no-op unless the global shopping_list_entity option is set).
    from .shopping_sync import schedule_resync

    schedule_resync(hass)
    return True


def _raise_broken_link_issue(hass: HomeAssistant, entry: ConfigEntry, part_ids: list[str]) -> None:
    """Tell the user a completion could not decrement what it was linked to.

    Deliberately a repair issue rather than a refused completion: the work WAS
    done, and losing the history entry would be the bigger harm. What must not
    happen is the silent version — a tick that consumed nothing and said so
    nowhere.
    """
    from homeassistant.helpers import issue_registry as ir

    from .helpers.issues import broken_part_link_issue_id

    object_name = _object_name(entry)
    ir.async_create_issue(
        hass,
        DOMAIN,
        broken_part_link_issue_id(entry.entry_id),
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="broken_part_link",
        translation_placeholders={
            "object_name": object_name,
            "count": str(len(part_ids)),
        },
    )
    _LOGGER.warning(
        "Completion on %s referenced %d spare part(s) that no longer exist: %s",
        object_name,
        len(part_ids),
        ", ".join(part_ids),
    )
