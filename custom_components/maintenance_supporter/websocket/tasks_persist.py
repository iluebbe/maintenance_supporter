"""Task persistence primitives shared by CRUD + the add_task service."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from ..helpers.schedule import (
    normalize_task_storage,
)
from . import (
    _get_runtime_data,
)

# ---------------------------------------------------------------------------
# Task CRUD
# ---------------------------------------------------------------------------


async def async_persist_task(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: dict[str, Any],
    *,
    last_performed: str | None = None,
    history: list[dict[str, Any]] | None = None,
) -> None:
    """Persist a freshly-built task into an object entry and reload it.

    Shared by the ``task/create`` WS command and the ``add_task`` service
    (DRY): updates ConfigEntry.data + the object's task_ids, initializes the
    Store dynamic state, and reloads the entry so the task's entities
    (sensor / binary_sensor / buttons) are created.
    """
    # Store recurrence in the canonical nested `schedule` shape (schedule-model v2).
    task_data = normalize_task_storage(task_data)
    task_id = task_data["id"]
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    new_tasks[task_id] = task_data
    new_data[CONF_TASKS] = new_tasks

    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = list(obj.get("task_ids", []))
    task_ids.append(task_id)
    obj["task_ids"] = task_ids
    new_data[CONF_OBJECT] = obj

    hass.config_entries.async_update_entry(entry, data=new_data)

    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        store.init_task(task_id, last_performed=last_performed)
        if history:
            store.set_history(task_id, history)
        await store.async_save()
    else:
        # Legacy: dynamic fields live in ConfigEntry.data
        task_data["last_performed"] = last_performed
        task_data["history"] = history or []
        new_tasks[task_id] = task_data
        new_data[CONF_TASKS] = new_tasks
        hass.config_entries.async_update_entry(entry, data=new_data)

    await hass.config_entries.async_reload(entry.entry_id)


async def async_create_task_simple(
    hass: HomeAssistant,
    *,
    entry_id: str,
    name: str,
    task_type: str = "custom",
    schedule_type: str = "time_based",
    interval_days: int | None = None,
    interval_unit: str = "days",
    due_date: str | None = None,
    warning_days: int = 7,
    enabled: bool = True,
    notes: str | None = None,
    schedule: dict[str, Any] | None = None,
) -> str:
    """Create a task with the common fields and persist it; return task_id.

    The service-facing creation path — a focused subset of ws_create_task's
    field set — sharing :func:`async_persist_task` with the WS handler (DRY).
    For the full field set (triggers, checklists, completion actions, …) use
    the panel / card dialogs or the ``task/create`` WS command.

    Raises ValueError if the entry_id is not a maintenance object or the name
    is empty.
    """
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        raise ValueError(f"No maintenance object found for entry_id {entry_id!r}")
    name = (name or "").strip()
    if not name:
        raise ValueError("Name must not be empty")
    task_data: dict[str, Any] = {
        "id": uuid4().hex,
        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
        "name": name,
        "type": task_type,
        "enabled": enabled,
        "schedule_type": schedule_type,
        "warning_days": warning_days,
        "created_at": dt_util.now().date().isoformat(),
    }
    if schedule:
        # Calendar kinds: persist the nested schedule (normalize treats it as
        # authoritative over the flat fields).
        task_data["schedule"] = schedule
    if interval_days is not None:
        task_data["interval_days"] = interval_days
    if interval_unit and interval_unit != "days":
        task_data["interval_unit"] = interval_unit
    if due_date:
        task_data["due_date"] = due_date
    if notes:
        task_data["notes"] = notes
    await async_persist_task(hass, entry, task_data)
    return task_data["id"]

