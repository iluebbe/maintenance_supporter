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

from ..const import CONF_TASKS
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
