"""Single write chokepoint for task dicts in ConfigEntry.data.

The ``dict(entry.data)`` → ``dict(tasks)`` → mutate → ``async_update_entry``
dance was open-coded at ~12 sites, and only the options-flow copies ran
``normalize_task_storage`` — so a task edited via one surface converged on the
canonical nested ``schedule`` shape while the same edit via another kept the
legacy flat fields. Every entry-data task write goes through here now.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any

from ..const import CONF_OBJECT, CONF_TASKS, MAX_TASKS_PER_OBJECT
from .aggregate import get_store
from .schedule import normalize_task_storage

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant


def write_tasks(hass: HomeAssistant, entry: ConfigEntry, tasks: Mapping[str, dict[str, Any]]) -> None:
    """Write task dicts into ``entry.data``, normalized, in one update."""
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    for task_id, task_data in tasks.items():
        new_tasks[task_id] = normalize_task_storage(task_data)
    new_data[CONF_TASKS] = new_tasks
    hass.config_entries.async_update_entry(entry, data=new_data)


def write_task(hass: HomeAssistant, entry: ConfigEntry, task_id: str, task_data: dict[str, Any]) -> None:
    """Write ONE task dict into ``entry.data``, normalized."""
    write_tasks(hass, entry, {task_id: task_data})


def insert_new_task(
    hass: HomeAssistant,
    entry: ConfigEntry,
    task_data: dict[str, Any],
    *,
    last_performed: str | None = None,
    history: list[dict[str, Any]] | None = None,
) -> Any:
    """Insert a freshly-built task into an object entry — the ONE create rule
    for the ``task/create`` WS command, the ``add_task`` service and the
    options flow (DRY review 2026-09-12; the flow had its own copy).

    Synchronous on purpose: the options flow calls it from a sync callback.
    Normalises the record to the nested ``schedule`` shape, enforces the
    per-object cap (``ValueError``), appends the id to the object's
    ``task_ids``, writes ConfigEntry.data and initialises the Store's dynamic
    state (or, on a legacy entry without a Store, the inline fields). Returns
    the Store (or ``None``) so the caller decides how to save — the WS path
    awaits ``async_save`` and reloads, the flow delay-saves and reloads on its
    done step.
    """
    task_data = normalize_task_storage(task_data)
    task_id = task_data["id"]
    existing_tasks = entry.data.get(CONF_TASKS, {})
    if task_id not in existing_tasks and len(existing_tasks) >= MAX_TASKS_PER_OBJECT:
        raise ValueError(f"This object already has the maximum of {MAX_TASKS_PER_OBJECT} tasks")
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    new_tasks[task_id] = task_data
    new_data[CONF_TASKS] = new_tasks

    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = list(obj.get("task_ids", []))
    if task_id not in task_ids:
        task_ids.append(task_id)
    obj["task_ids"] = task_ids
    new_data[CONF_OBJECT] = obj

    store = get_store(hass, entry.entry_id)
    if store is None:
        # Legacy: dynamic fields live in ConfigEntry.data
        task_data["last_performed"] = last_performed
        task_data["history"] = history or []
        new_tasks[task_id] = task_data
    hass.config_entries.async_update_entry(entry, data=new_data)
    if store is not None:
        store.init_task(task_id, last_performed=last_performed)
        if history:
            store.set_history(task_id, history)
    return store

