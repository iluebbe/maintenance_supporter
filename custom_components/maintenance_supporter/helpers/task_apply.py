"""Making a task edit take effect, without reloading the object where it can.

A reload tears every entity of the object down and sets it up again: each
sensor, binary sensor and button goes unavailable and comes back, every
trigger is rebuilt, and the first refresh runs. An edit needs that only when
it changes the entities (a name, a slug, enabled) or a listener the setup
wired (Done when, the mirror lists, the parts). Most edits change only what
the coordinator reads on every refresh: the schedule, the notes, the people.
For those a refresh is the whole story, and a changed sensor rule rebuilds
just that task's triggers on its sensor.

Found live (2026-11-04): on one home something blocked Home Assistant for a
second on every button state change, and saving one task of an object with
27 buttons froze it for a minute. A refresh writes no button state at all.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from typing import Any

from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.core import HomeAssistant, callback

from ..const import CONF_TASKS, DOMAIN, NOTIFICATION_MANAGER_KEY
from .aggregate import get_runtime_data
from .assignees import task_user_ids
from .sanitize import normalize_people
from .schedule import normalize_task_storage
from .task_fields import COMPACT_KEEPS_EMPTY, UNSTORED_TASK_FIELDS
from .task_trace import KIND_EDITED, changed_values
from .task_trace import record as record_trace

#: helpers/task_origin's ORIGIN_KEY: importing it here closes an import
#: cycle through the triggers (tests/test_dry_audit_2026_11_07 pins it).
ORIGIN_KEY = "origin"

#: The stored task fields the entities, the panel and every completion read
#: from the coordinator's refresh, never from what the setup saw.
LIVE_FIELDS = frozenset(
    {
        # The schedule (stored nested; a few flat keys ride along).
        "schedule",
        "interval_days",
        "interval_unit",
        "interval_anchor",
        "due_date",
        "schedule_type",
        "warning_days",
        "earliest_completion_days",
        "schedule_time",
        "last_performed",
        # What it says and how it looks.
        "notes",
        "documentation_url",
        "custom_icon",
        "priority",
        "type",
        "labels",
        "checklist",
        # Who it is for.
        "responsible_user_id",
        "assignee_pool",
        "rotation_strategy",
        # How it is completed and who hears about it.
        "allow_skip",
        "notify_enabled",
        "notify_icon",
        "notification_texts",
        "on_complete_action",
        "quick_complete_defaults",
        "required_completion_fields",
        "nfc_tag_id",
        "require_tag_scan",
        # Read when a completion consumes them (parts_runtime), never wired
        # by the setup. The dialog sends the list on every save, so a task
        # that never stored one reloaded its object on its first save.
        "consumes_parts",
        # Where the task came from and what its template gave it: read by the
        # template review and the reset wiring, kept in step by
        # async_sync_entry_bases below (a template apply writes it).
        ORIGIN_KEY,
    }
)
#: A changed sensor rule: rebuilt on the task's sensor.
TRIGGER_FIELD = "trigger_config"


#: A changed task names at most this many fields in its trace.
_MAX_TRACED_FIELDS = 20


def _as_stored(task: Mapping[str, Any]) -> dict[str, Any]:
    """A task as a write leaves it: the nested schedule, who it is for in its
    one shape (a task stored before normalize_people kept an empty pool, and
    its first save read as "Shared with: — → —"), an unstored field as what
    it means."""
    stored = normalize_task_storage(task)
    normalize_people(stored)
    return {**UNSTORED_TASK_FIELDS, **stored}


def _changed(old: Mapping[str, Any], new: Mapping[str, Any]) -> set[str]:
    return {k for k in {*old, *new} if not k.startswith("_") and old.get(k) != new.get(k)}


def edited_fields(before: Mapping[str, Any], after: Mapping[str, Any]) -> set[str]:
    """The stored fields an edit changed, both sides as stored (the runtime
    keys, ``_…``, are no edit; a field the dialog sends as its default is
    none either)."""
    return _changed(_as_stored(before), _as_stored(after))


def _blank(value: Any) -> bool:
    """None, [] or {}: a field that says nothing (the trace's "—")."""
    return value is None or value == [] or value == {}


def note_task_edit(
    hass: HomeAssistant, entry_id: str, task_id: str, before: Mapping[str, Any], after: Mapping[str, Any]
) -> set[str]:
    """:func:`edited_fields`, noted in the task's trace (the new look): which
    settings changed, and from what to what where the values are short. The
    one note of an edit for every way a task is edited: the dialog, a bulk
    edit, the update_task action, the options flow and a template's changes.
    Only the dialog's edits reached the trace (DRY audit 2026-11-07, BI7-A3).
    Returns the fields for :func:`async_apply_task_edits`."""
    old, new = _as_stored(before), _as_stored(after)
    edited = _changed(old, new)
    # The dialog sends every list on every save: a task's first save turned
    # "no labels" into [] and read as "Labels: — → —". Nothing to nothing is
    # no change worth telling (an empty Quick complete still is one), and
    # neither is what a template remembers of itself (its origin).
    told = sorted(
        k
        for k in edited - {ORIGIN_KEY}
        if k in COMPACT_KEEPS_EMPTY or not (_blank(old.get(k)) and _blank(new.get(k)))
    )
    if told:
        told = told[:_MAX_TRACED_FIELDS]
        record_trace(hass, entry_id, task_id, KIND_EDITED, fields=told, changes=changed_values(old, new, told))
    if task_user_ids(old) != task_user_ids(new):
        _hand_over_reminder(hass, entry_id, task_id, old)
    return edited


def _hand_over_reminder(hass: HomeAssistant, entry_id: str, task_id: str, before: Mapping[str, Any]) -> None:
    """The people a task is for changed: its reminder leaves the phones it
    went to, and the next refresh tells the new people. Only a completion's
    rotation handed it on; an edit left the push on the old person's phone
    and told the new one nothing until the repeat ran out, or never for a
    status that notifies once (bug audit 2026-11-08, N8-2)."""
    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if nm is not None:
        nm.clear_and_dismiss(entry_id, task_id, before, reason="reassigned")


def note_entry_edits(
    hass: HomeAssistant, entry_id: str, before: Mapping[str, Any], after: Mapping[str, Any]
) -> dict[str, set[str]] | None:
    """Task id → the fields that changed between two versions of an object's
    data, each noted in its trace; None when more than its tasks' fields
    changed (a task added or removed, the object's own settings): then the
    object sets up again."""
    old_tasks, new_tasks = before.get(CONF_TASKS) or {}, after.get(CONF_TASKS) or {}
    edits = {
        task_id: fields
        for task_id, task in new_tasks.items()
        if task_id in old_tasks and (fields := note_task_edit(hass, entry_id, task_id, old_tasks[task_id], task))
    }
    rest_before = {k: v for k, v in before.items() if k != CONF_TASKS}
    rest_after = {k: v for k, v in after.items() if k != CONF_TASKS}
    if set(old_tasks) != set(new_tasks) or rest_before != rest_after:
        return None
    return edits


def needs_reload(fields: Iterable[str]) -> bool:
    """Whether an edit of these fields needs the object set up again."""
    return any(f not in LIVE_FIELDS and f != TRIGGER_FIELD for f in fields)


async def async_apply_task_edits(hass: HomeAssistant, entry: ConfigEntry, edits: Mapping[str, Iterable[str]]) -> None:
    """Make the edits already written to ``entry.data`` take effect: task id
    → the fields that changed. Reloads the object when one needs it (or the
    object is not running), else rebuilds the changed sensor rules and
    refreshes once."""
    fields = {task_id: set(changed) for task_id, changed in edits.items()}
    runtime = get_runtime_data(hass, entry.entry_id)
    coordinator = runtime.coordinator if runtime is not None else None
    if coordinator is None or entry.state is not ConfigEntryState.LOADED or any(needs_reload(f) for f in fields.values()):
        await hass.config_entries.async_reload(entry.entry_id)
        return
    for task_id, changed in fields.items():
        if TRIGGER_FIELD in changed and not await coordinator.async_rebuild_triggers(task_id):
            # No sensor runs this task's triggers (disabled in the registry).
            await hass.config_entries.async_reload(entry.entry_id)
            return
    # What the setup does with an edit: a template task whose user made the
    # template's change themselves moves its base on. (The templates reach
    # the coordinator, which reaches this module: imported when needed.)
    from .template_updates import async_sync_entry_bases

    await async_sync_entry_bases(hass, entry)
    await coordinator.async_refresh_now()


@callback
def apply_entry_edits(hass: HomeAssistant, entry: ConfigEntry, edits: Mapping[str, Iterable[str]] | None) -> None:
    """Make what an options-flow session wrote take effect (its writes, each
    noted by :func:`note_entry_edits`): the tasks' edits like the dialog's (a
    refresh, or a reload where one needs it); None, more than its tasks'
    fields, a reload. "Done" reloaded the object whatever was changed,
    nothing included (DRY audit 2026-11-07, BR7-A1)."""
    if edits is None:
        hass.config_entries.async_schedule_reload(entry.entry_id)
    else:
        # Nothing edited is still a refresh: the flow saves the Store too.
        hass.async_create_task(async_apply_task_edits(hass, entry, edits))
