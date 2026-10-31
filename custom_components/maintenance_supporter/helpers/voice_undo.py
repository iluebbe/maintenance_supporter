"""Undo the last thing somebody did by voice — or a Complete in the panel.

Speech recognition mishears, and a matched name can be the wrong task. The
panel has a history editor for that; a voice satellite has nothing — the
answer "Completed 'Descale' on Kettle" is the first moment anyone learns
which task was hit. So every voice action that changes something remembers
the state it changed, and "undo that" puts it back. A one-tap Complete in
the panel or on a dashboard card is the same kind of slip (the wrong row,
a pocket tap), so the WebSocket completions remember theirs too, under the
person's own key — their toast offers Undo, and so does their voice.

What an undo covers, precisely:

* the task's own record in the Store — completion history, the cycle anchor,
  a postponement, the phase cursor, checklist ticks, adaptive learning;
* the entry fields a voice action writes: the rotation pointer and the notes;
* spare-part stock the action consumed or added — and, for a buy reminder,
  its link to the part and the price its purchase set; a buy reminder the
  purchase was booked on because none was open is removed again;
* a snooze;
* the sensor trigger's progress a completion or a skip reset (the runtime
  hours, the counter's baseline, the counted changes): the object reloads so
  its triggers count on from there. A pump at 180 of 200 hours read 0 after
  an undone mis-tap (bug audit 2026-10-17, T-9).

What it cannot take back, and does not pretend to: events that were fired
(automations already ran), notifications that were sent, an on-complete
action. What a trigger counted in the minutes between the action and its
undo is not kept. The reference-number counter is not rewound either, so a
later completion never reuses an undone entry's number.

One level, per person (the Home Assistant user, or the satellite that heard
it when there is no user), for ten minutes, in memory. If the task changed in
between — somebody completed it in the panel — the undo refuses rather than
overwrite that.
"""

from __future__ import annotations

import copy
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util

from ..const import CONF_PARTS, CONF_TASKS, DOMAIN, NOTIFICATION_MANAGER_KEY
from ..parts_runtime import async_change_part_stock, async_set_part_restoring, async_untrack_part_stock
from .aggregate import get_object_entries, get_store, store_of
from .task_persist import async_delete_task

UNDO_WINDOW = timedelta(minutes=10)

_DATA_KEY = f"{DOMAIN}_voice_undo"

#: Store fields a voice action changes and an undo puts back. Not listed on
#: purpose: trigger_runtime (live sensor progress, put back but never
#: compared, see TRIGGER_RESETTING_KINDS), next_history_ref (never
#: renumber), todo_mirror (rows in another integration's list), the battery
#: low latch (follows the sensors).
TASK_FIELDS = (
    "last_performed",
    "last_planned_due",
    "planned_day",
    "due_override",
    "history",
    "adaptive_config",
    "phase_cursor",
    "checklist_progress",
    "battery_replacements",
)

#: Entry-level task fields a voice action writes.
STATIC_FIELDS = ("responsible_user_id", "notes")

#: Entry-level fields put back but not compared: the buy-task reconcile
#: detaches a completed reminder's part link in the background, a moment
#: after the action — compared, that read as "changed since" and the undo
#: was refused. Not put back, the reopened reminder had no link and the
#: reconcile created a second one (DRY audit 2026-10-12, BR5-A2).
RESTORE_ONLY_FIELDS = ("part_ref",)

#: The actions that reset the task's sensor triggers (they close the cycle).
TRIGGER_RESETTING_KINDS = frozenset({"completed", "skipped", "reading"})


@dataclass
class Snapshot:
    """The parts of the world one voice action can change."""

    entry_id: str
    task_id: str | None
    task: dict[str, Any] | None = None
    static: dict[str, Any] = field(default_factory=dict)
    snooze: dict[str, datetime] = field(default_factory=dict)
    stocks: dict[tuple[str, str], float | None] = field(default_factory=dict)
    # #208: a reusable part's used ones waiting to be ready again.
    piles: dict[tuple[str, str], float] = field(default_factory=dict)
    restore_only: dict[str, Any] = field(default_factory=dict)
    # #104 "when used": a buy reminder's paid price becomes its part's price.
    part_costs: dict[tuple[str, str], Any] = field(default_factory=dict)
    # The triggers' progress before the action (T-9); never compared, it
    # moves with the sensors.
    trigger_runtime: Any = None


@dataclass
class UndoRecord:
    """One remembered voice action."""

    kind: str
    at: datetime
    before: Snapshot
    after: Snapshot
    speech: dict[str, Any]


def actor(intent_obj: intent.Intent) -> str:
    """Whose undo this is: the user, else the device that heard it."""
    context = getattr(intent_obj, "context", None)
    user_id = getattr(context, "user_id", None) if context else None
    if user_id:
        return f"user:{user_id}"
    satellite = getattr(intent_obj, "satellite_id", None)
    if satellite:
        return f"satellite:{satellite}"
    if intent_obj.device_id:
        return f"device:{intent_obj.device_id}"
    return "anonymous"


def capture(hass: HomeAssistant, entry_id: str, task_id: str | None) -> Snapshot:
    """Everything the coming action may change, copied."""
    snap = Snapshot(entry_id=entry_id, task_id=task_id)
    entry = hass.config_entries.async_get_entry(entry_id)
    store = get_store(hass, entry_id)
    static: Any =(entry.data.get(CONF_TASKS) or {}).get(task_id) if entry is not None and task_id else None
    # A task that no longer exists (a buy task the restock retired) has no
    # record left to compare or restore — only its stock does.
    if task_id and isinstance(static, dict) and store is not None:
        state = store.get_task_state(task_id)
        snap.task = {key: copy.deepcopy(state.get(key)) for key in TASK_FIELDS}
        snap.static = {key: copy.deepcopy(static.get(key)) for key in STATIC_FIELDS}
        snap.restore_only = {key: copy.deepcopy(static.get(key)) for key in RESTORE_ONLY_FIELDS}
        snap.trigger_runtime = copy.deepcopy(state.get("trigger_runtime"))
    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if task_id and nm is not None:
        snap.snooze = dict(nm.task_snooze_state(entry_id, task_id))
    # Every tracked stock: a completion may consume from another object's
    # pool (#111), and the list is small.
    for ce in get_object_entries(hass):
        ce_store = store_of(ce)
        if ce_store is None:
            continue
        for part_id, part in (ce.data.get(CONF_PARTS) or {}).items():
            snap.stocks[(ce.entry_id, part_id)] = ce_store.get_part_stock(part_id)
            snap.piles[(ce.entry_id, part_id)] = ce_store.get_part_restoring(part_id)
            snap.part_costs[(ce.entry_id, part_id)] = part.get("cost") if isinstance(part, dict) else None
    return snap


def user_actor(user_id: str | None) -> str:
    """The undo key of a signed-in person — the key their voice uses too."""
    return f"user:{user_id}" if user_id else "anonymous"


def remember(
    hass: HomeAssistant,
    intent_obj: intent.Intent,
    kind: str,
    before: Snapshot,
    **speech: Any,
) -> None:
    """Record a finished voice action so its speaker can undo it."""
    remember_as(hass, actor(intent_obj), kind, before, **speech)


def remember_as(hass: HomeAssistant, who: str, kind: str, before: Snapshot, **speech: Any) -> bool:
    """Record a finished action under the undo key ``who`` — when it changed
    anything. A double tap the completion guard swallowed changed nothing:
    remembering it would let its Undo claim to take back a completion that is
    somebody else's (or the person's own previous one stays undoable)."""
    after = capture(hass, before.entry_id, before.task_id)
    if (after.task, after.static, after.snooze, after.stocks, after.piles) == (before.task, before.static, before.snooze, before.stocks, before.piles):
        return False
    hass.data.setdefault(_DATA_KEY, {})[who] = UndoRecord(kind=kind, at=dt_util.utcnow(), before=before, after=after, speech=speech)
    return True


def peek_as(hass: HomeAssistant, who: str) -> UndoRecord | None:
    """``who``'s last action if it is still within the window (kept)."""
    record: UndoRecord | None = hass.data.get(_DATA_KEY, {}).get(who)
    if record is None or dt_util.utcnow() - record.at > UNDO_WINDOW:
        return None
    return record


def pop(hass: HomeAssistant, intent_obj: intent.Intent) -> UndoRecord | None:
    """The speaker's last action if it is still within the window (and forget it)."""
    return pop_as(hass, actor(intent_obj))


def pop_as(hass: HomeAssistant, who: str) -> UndoRecord | None:
    """``who``'s last action if it is still within the window (and forget it)."""
    record: UndoRecord | None = hass.data.get(_DATA_KEY, {}).pop(who, None)
    if record is None or dt_util.utcnow() - record.at > UNDO_WINDOW:
        return None
    return record


def _changed_stocks(record: UndoRecord) -> dict[tuple[str, str], float | None]:
    return {
        key: record.before.stocks.get(key)
        for key, value in record.after.stocks.items()
        if record.before.stocks.get(key) != value
    }


def _changed_piles(record: UndoRecord) -> dict[tuple[str, str], float]:
    return {
        key: record.before.piles.get(key, 0)
        for key, value in record.after.piles.items()
        if record.before.piles.get(key, 0) != value
    }


def unchanged_since(hass: HomeAssistant, record: UndoRecord) -> bool:
    """Whether everything the action touched still looks as it left it."""
    now = capture(hass, record.after.entry_id, record.after.task_id)
    if record.after.task is not None and now.task is not None:
        if now.task != record.after.task or now.static != record.after.static:
            return False
    if now.snooze != record.after.snooze:
        return False
    return all(now.stocks.get(key) == record.after.stocks.get(key) for key in _changed_stocks(record)) and all(
        now.piles.get(key, 0) == record.after.piles.get(key, 0) for key in _changed_piles(record)
    )


async def async_restore(hass: HomeAssistant, record: UndoRecord) -> None:
    """Put back what *record*'s action changed."""
    before = record.before
    entry = hass.config_entries.async_get_entry(before.entry_id)
    rd = getattr(entry, "runtime_data", None) if entry else None
    coordinator = getattr(rd, "coordinator", None) if rd else None

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if before.task_id and nm is not None and before.snooze != record.after.snooze:
        nm.restore_task_snooze_state(before.entry_id, before.task_id, before.snooze)

    # The task first: put back before the stock, a reopened buy reminder
    # carries its part link again when the stock change re-plans the buy
    # tasks — otherwise that re-plan created a second reminder.
    if coordinator is not None and before.task_id and before.task is not None:
        static = {**before.static, **before.restore_only}
        if before.task != record.after.task or static != {**record.after.static, **record.after.restore_only}:
            await coordinator.async_restore_task_fields(before.task_id, dict(before.task), static)
        await _async_restore_trigger_progress(hass, entry, record)
    elif entry is not None and before.task_id and before.task is None and record.after.task is not None:
        # A task the action made: "bought …" with no buy reminder open books
        # the purchase on a new one. It goes, with the purchase's history
        # entry and spending (DRY audit 2026-10-30, BI6-A2).
        if await async_delete_task(hass, entry, before.task_id):
            hass.config_entries.async_schedule_reload(entry.entry_id)

    # Stock and waiting pile (#208) go back in ONE booking through the one
    # stock writer: what is owned moves once, so the low / restocked edge
    # fires at most once and the buy tasks are re-planned once.
    stocks, piles = _changed_stocks(record), _changed_piles(record)
    for key in dict.fromkeys([*stocks, *piles]):
        entry_id, part_id = key
        part_entry = hass.config_entries.async_get_entry(entry_id)
        if part_entry is None:
            continue
        if key in stocks and stocks[key] is None:
            await async_untrack_part_stock(hass, part_entry, part_id)
        elif key in stocks:
            await async_change_part_stock(hass, part_entry, part_id, absolute=stocks[key], restoring=piles.get(key))
        else:
            await async_set_part_restoring(hass, part_entry, part_id, piles[key])

    # The price a buy reminder's purchase set (#104 "when used").
    for (entry_id, part_id), cost in before.part_costs.items():
        if record.after.part_costs.get((entry_id, part_id)) == cost:
            continue
        part_entry = hass.config_entries.async_get_entry(entry_id)
        parts = dict((part_entry.data.get(CONF_PARTS) or {}) if part_entry else {})
        part = parts.get(part_id)
        if part_entry is None or not isinstance(part, dict) or part.get("cost") == cost:
            continue
        parts[part_id] = {**part, "cost": cost} if cost is not None else {k: v for k, v in part.items() if k != "cost"}
        hass.config_entries.async_update_entry(part_entry, data={**part_entry.data, CONF_PARTS: parts})


async def _async_restore_trigger_progress(hass: HomeAssistant, entry: Any, record: UndoRecord) -> None:
    """The trigger progress the undone completion or skip reset (T-9).

    The live triggers hold their count in memory, so the object reloads
    and they read it back from the Store.
    """
    before = record.before
    if record.kind not in TRIGGER_RESETTING_KINDS or entry is None or before.task_id is None:
        return
    static = (entry.data.get(CONF_TASKS) or {}).get(before.task_id) or {}
    store = store_of(entry)
    if not isinstance(static.get("trigger_config"), dict) or store is None:
        return
    if store.get_task_state(before.task_id).get("trigger_runtime") == before.trigger_runtime:
        return
    store.update_task_state(before.task_id, trigger_runtime=copy.deepcopy(before.trigger_runtime))
    await store.async_save()
    hass.config_entries.async_schedule_reload(entry.entry_id)
