"""To-do platform for the Maintenance Supporter integration.

A single global ``todo`` list entity aggregates every active maintenance task
across all objects, so maintenance shows up in Home Assistant's native **To-do**
card and is reachable through **Assist/voice** ("what maintenance is due?",
"mark the filter change done").

Each task becomes one to-do item whose status mirrors its due state: a task
that is due-soon / overdue / triggered is ``needs_action`` (actionable), an
up-to-date task is ``completed``. Checking a ``needs_action`` item off routes to
the same ``complete_maintenance`` coordinator method the panel, buttons, and
notification actions use — one action layer, no duplicated logic.
"""

from __future__ import annotations

import logging
from datetime import date
from typing import TYPE_CHECKING

from homeassistant.components.todo import TodoItem, TodoListEntity
from homeassistant.components.todo.const import (
    TodoItemStatus,
    TodoListEntityFeature,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_OBJECT,
    CONF_TASK_ENABLED,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)

if TYPE_CHECKING:
    from . import MaintenanceSupporterConfigEntry

_LOGGER = logging.getLogger(__name__)

PARALLEL_UPDATES = 0

# Statuses that make a task "actionable" in the to-do list (needs_action).
_ACTION_STATUSES = frozenset(
    {
        MaintenanceStatus.DUE_SOON,
        MaintenanceStatus.OVERDUE,
        MaintenanceStatus.TRIGGERED,
    }
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: MaintenanceSupporterConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the single global maintenance to-do list.

    Mirrors the calendar platform: the list lives on the global entry and
    aggregates every object's coordinator. Object entries register their
    coordinator so the list repaints when a task's status changes.
    """
    if entry.unique_id != GLOBAL_UNIQUE_ID:
        runtime_data = entry.runtime_data
        if runtime_data and runtime_data.coordinator:
            todo = hass.data.get(DOMAIN, {}).get("_todo_entity")
            if todo:
                runtime_data.coordinator.register_todo_entity(todo)
        return

    todo = MaintenanceTodoList(hass)
    hass.data.setdefault(DOMAIN, {})["_todo_entity"] = todo
    async_add_entities([todo])

    for other_entry in hass.config_entries.async_entries(DOMAIN):
        if other_entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        other_data = getattr(other_entry, "runtime_data", None)
        if other_data and getattr(other_data, "coordinator", None):
            other_data.coordinator.register_todo_entity(todo)

    _LOGGER.debug("Maintenance to-do list entity created")


class MaintenanceTodoList(TodoListEntity):
    """A single list of every active maintenance task, keyed by due state."""

    _attr_name = "Maintenance"
    _attr_unique_id = "maintenance_supporter_todo"
    _attr_translation_key = "maintenance_todo"
    _attr_should_poll = False
    _attr_supported_features = TodoListEntityFeature.UPDATE_TODO_ITEM

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the to-do list."""
        self._hass = hass

    def refresh(self) -> None:
        """Repaint the list (called by coordinators on update)."""
        if self.hass is not None:
            self.async_write_ha_state()

    @property
    def todo_items(self) -> list[TodoItem]:
        """Build one item per active task across all objects."""
        items: list[TodoItem] = []
        for entry in self._hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                continue
            obj_data = entry.data.get(CONF_OBJECT, {})
            if obj_data.get("archived_at") is not None:
                continue
            obj_name = obj_data.get("name", "Unknown")

            runtime_data = getattr(entry, "runtime_data", None)
            coordinator = getattr(runtime_data, "coordinator", None)
            live = coordinator.data.get(CONF_TASKS, {}) if coordinator and coordinator.data else {}

            for task_id, task_cfg in entry.data.get(CONF_TASKS, {}).items():
                if not task_cfg.get(CONF_TASK_ENABLED, True):
                    continue
                if task_cfg.get("archived_at") is not None:
                    continue
                task_live = live.get(task_id, {})
                status = task_live.get("_status", MaintenanceStatus.OK)
                # Archived is retired; paused (v2.20, N3) is frozen — neither
                # belongs on the actionable To-do list.
                if status in (MaintenanceStatus.ARCHIVED, MaintenanceStatus.PAUSED):
                    continue
                due_iso = task_live.get("_next_due")
                due: date | None = None
                if isinstance(due_iso, str):
                    try:
                        due = date.fromisoformat(due_iso)
                    except ValueError:
                        due = None
                items.append(
                    TodoItem(
                        uid=f"{entry.entry_id}:{task_id}",
                        summary=f"{obj_name}: {task_cfg.get('name', '')}",
                        status=(TodoItemStatus.NEEDS_ACTION if status in _ACTION_STATUSES else TodoItemStatus.COMPLETED),
                        due=due,
                    )
                )
        return items

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Handle a checkbox toggle: completing an item completes the task.

        Un-checking (back to needs_action) is a no-op — a maintenance task can't
        be "un-completed"; its next cycle is driven by the schedule.
        """
        if item.status != TodoItemStatus.COMPLETED or not item.uid:
            return
        entry_id, _, task_id = item.uid.partition(":")
        entry = self._hass.config_entries.async_get_entry(entry_id)
        if entry is None:
            return
        coordinator = getattr(getattr(entry, "runtime_data", None), "coordinator", None)
        if coordinator is None:
            return
        # Respect a task's completion window — silently no-op (the item stays
        # needs_action) rather than completing an item that's not yet due.
        from .models.maintenance_task import MaintenanceTask

        td = coordinator._get_merged_tasks_data().get(task_id)
        if td and not MaintenanceTask.from_dict(td).can_complete_now:
            return
        await coordinator.complete_maintenance(
            task_id,
            notes="Completed from the To-do list",
            unattended=True,
            # HA's entity-service call carries the user in the context.
            completed_by=self._context.user_id if self._context else None,
        )
        self.async_write_ha_state()
