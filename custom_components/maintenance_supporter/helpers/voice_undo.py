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
* spare-part stock the action consumed or added;
* a snooze.

What it cannot take back, and does not pretend to: events that were fired
(automations already ran), notifications that were sent, an on-complete
action, and a sensor trigger's progress — the triggers keep counting from
where they are, and restoring an old copy of their state would contradict
the live sensors. The reference-number counter is not rewound either, so a
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
from .aggregate import get_object_entries

UNDO_WINDOW = timedelta(minutes=10)

_DATA_KEY = f"{DOMAIN}_voice_undo"

#: Store fields a voice action changes and an undo puts back. Not listed on
#: purpose: trigger_runtime (live sensor progress), next_history_ref (never
#: renumber), todo_mirror (rows in another integration's list), the battery
#: low latch (follows the sensors).
TASK_FIELDS = (
    "last_performed",
    "last_planned_due",
    "due_override",
    "history",
    "adaptive_config",
    "phase_cursor",
    "checklist_progress",
    "battery_replacements",
)

#: Entry-level task fields a voice action writes.
STATIC_FIELDS = ("responsible_user_id", "notes")


@dataclass
class Snapshot:
    """The parts of the world one voice action can change."""

    entry_id: str
    task_id: str | None
    task: dict[str, Any] | None = None
    static: dict[str, Any] = field(default_factory=dict)
    snooze: dict[str, datetime] = field(default_factory=dict)
    stocks: dict[tuple[str, str], float | None] = field(default_factory=dict)


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


def _store_of(hass: HomeAssistant, entry_id: str) -> Any:
    entry = hass.config_entries.async_get_entry(entry_id)
    rd = getattr(entry, "runtime_data", None) if entry else None
    return getattr(rd, "store", None) if rd else None


def capture(hass: HomeAssistant, entry_id: str, task_id: str | None) -> Snapshot:
    """Everything the coming action may change, copied."""
    snap = Snapshot(entry_id=entry_id, task_id=task_id)
    entry = hass.config_entries.async_get_entry(entry_id)
    store = _store_of(hass, entry_id)
    static: Any =(entry.data.get(CONF_TASKS) or {}).get(task_id) if entry is not None and task_id else None
    # A task that no longer exists (a buy task the restock retired) has no
    # record left to compare or restore — only its stock does.
    if task_id and isinstance(static, dict) and store is not None:
        state = store.get_task_state(task_id)
        snap.task = {key: copy.deepcopy(state.get(key)) for key in TASK_FIELDS}
        snap.static = {key: copy.deepcopy(static.get(key)) for key in STATIC_FIELDS}
    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if task_id and nm is not None:
        snap.snooze = dict(nm.task_snooze_state(entry_id, task_id))
    # Every tracked stock: a completion may consume from another object's
    # pool (#111), and the list is small.
    for ce in get_object_entries(hass):
        ce_store = _store_of(hass, ce.entry_id)
        if ce_store is None:
            continue
        for part_id in ce.data.get(CONF_PARTS) or {}:
            snap.stocks[(ce.entry_id, part_id)] = ce_store.get_part_stock(part_id)
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
    if (after.task, after.static, after.snooze, after.stocks) == (before.task, before.static, before.snooze, before.stocks):
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


def unchanged_since(hass: HomeAssistant, record: UndoRecord) -> bool:
    """Whether everything the action touched still looks as it left it."""
    now = capture(hass, record.after.entry_id, record.after.task_id)
    if record.after.task is not None and now.task is not None:
        if now.task != record.after.task or now.static != record.after.static:
            return False
    if now.snooze != record.after.snooze:
        return False
    return all(now.stocks.get(key) == record.after.stocks.get(key) for key in _changed_stocks(record))


async def async_restore(hass: HomeAssistant, record: UndoRecord) -> None:
    """Put back what *record*'s action changed."""
    from ..parts_runtime import async_change_part_stock

    before = record.before
    entry = hass.config_entries.async_get_entry(before.entry_id)
    rd = getattr(entry, "runtime_data", None) if entry else None
    coordinator = getattr(rd, "coordinator", None) if rd else None

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if before.task_id and nm is not None and before.snooze != record.after.snooze:
        nm.restore_task_snooze_state(before.entry_id, before.task_id, before.snooze)

    # Stock first: restoring it goes through the one stock writer, which
    # fires the low / restocked edge and re-plans the buy tasks.
    for (entry_id, part_id), stock in _changed_stocks(record).items():
        part_entry = hass.config_entries.async_get_entry(entry_id)
        if part_entry is None:
            continue
        if stock is None:
            store = _store_of(hass, entry_id)
            if store is not None:
                store.set_part_stock(part_id, None)
                await store.async_save()
        else:
            await async_change_part_stock(hass, part_entry, part_id, absolute=stock)

    if coordinator is not None and before.task_id and before.task is not None:
        if before.task != record.after.task or before.static != record.after.static:
            await coordinator.async_restore_task_fields(before.task_id, dict(before.task), dict(before.static))
