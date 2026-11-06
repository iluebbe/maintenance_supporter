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
from homeassistant.core import HomeAssistant

from .aggregate import get_runtime_data
from .schedule import normalize_task_storage

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
        "on_complete_action",
        "quick_complete_defaults",
        "required_completion_fields",
        "nfc_tag_id",
        "require_tag_scan",
        # Read when a completion consumes them (parts_runtime), never wired
        # by the setup. The dialog sends the list on every save, so a task
        # that never stored one reloaded its object on its first save.
        "consumes_parts",
    }
)
#: A changed sensor rule: rebuilt on the task's sensor.
TRIGGER_FIELD = "trigger_config"


def edited_fields(before: Mapping[str, Any], after: Mapping[str, Any]) -> set[str]:
    """The stored fields an edit changed, both sides as stored (the runtime
    keys, ``_…``, are no edit)."""
    old, new = normalize_task_storage(before), normalize_task_storage(after)
    return {k for k in {*old, *new} if not k.startswith("_") and old.get(k) != new.get(k)}


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
