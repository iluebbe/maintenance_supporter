"""Tests for the native To-do list entity.

A single global ``todo`` list aggregates every active task; its item status
mirrors due state (due/overdue/triggered → needs_action, otherwise completed),
and checking an item off routes to ``complete_maintenance``.
"""

from __future__ import annotations

from homeassistant.components.todo.const import TodoItemStatus, TodoListEntityFeature
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.todo import MaintenanceTodoList

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

TASK_ID_2 = "b" * 32


def _global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter", data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant, tasks: dict, *, uid: str = "todo_obj") -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump"), tasks=tasks,
        ),
        source="user", unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


def _todo(hass: HomeAssistant) -> MaintenanceTodoList:
    return hass.data[DOMAIN]["_todo_entity"]


async def test_todo_entity_created_with_update_feature(hass: HomeAssistant) -> None:
    await setup_integration(hass, _global(hass), _object(hass, {
        TASK_ID_1: build_task_data(last_performed="2020-01-01", interval_days=30),
    }))
    todo = _todo(hass)
    assert todo.supported_features & TodoListEntityFeature.UPDATE_TODO_ITEM
    # No create/delete/move — the list is derived, not user-authored.
    assert not (todo.supported_features & TodoListEntityFeature.CREATE_TODO_ITEM)


async def test_todo_status_mirrors_due_state(hass: HomeAssistant) -> None:
    await setup_integration(hass, _global(hass), _object(hass, {
        TASK_ID_1: build_task_data(
            name="Overdue Task", last_performed="2020-01-01", interval_days=30,
        ),
        TASK_ID_2: build_task_data(
            task_id=TASK_ID_2, name="Fresh Task", interval_days=3650,
            last_performed="2026-06-01",
        ),
    }))
    items = {i.summary: i for i in _todo(hass).todo_items}
    assert "Pool Pump: Overdue Task" in items
    assert "Pool Pump: Fresh Task" in items
    assert items["Pool Pump: Overdue Task"].status == TodoItemStatus.NEEDS_ACTION
    assert items["Pool Pump: Fresh Task"].status == TodoItemStatus.COMPLETED


async def test_todo_excludes_disabled_and_archived(hass: HomeAssistant) -> None:
    await setup_integration(hass, _global(hass), _object(hass, {
        TASK_ID_1: build_task_data(name="Off", enabled=False),
        TASK_ID_2: build_task_data(
            task_id=TASK_ID_2, name="Gone",
            history=[{"timestamp": "2026-01-01T00:00:00+00:00", "type": "completed"}],
        ),
    }))
    # Archive the second task in storage.
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID
    )
    tasks = dict(obj.data["tasks"])
    tasks[TASK_ID_2] = {**tasks[TASK_ID_2], "archived_at": "2026-02-01T00:00:00+00:00"}
    hass.config_entries.async_update_entry(obj, data={**obj.data, "tasks": tasks})

    summaries = [i.summary for i in _todo(hass).todo_items]
    assert "Pool Pump: Off" not in summaries
    assert "Pool Pump: Gone" not in summaries


async def test_todo_complete_completes_task(hass: HomeAssistant) -> None:
    obj = _object(hass, {
        TASK_ID_1: build_task_data(
            name="Overdue Task", last_performed="2020-01-01", interval_days=30,
        ),
    })
    await setup_integration(hass, _global(hass), obj)
    todo = _todo(hass)

    item = next(i for i in todo.todo_items if i.summary == "Pool Pump: Overdue Task")
    item.status = TodoItemStatus.COMPLETED
    await todo.async_update_todo_item(item)

    rd = obj.runtime_data
    merged = rd.coordinator._get_merged_tasks_data()  # type: ignore[union-attr]
    history = merged[TASK_ID_1].get("history", [])
    assert any(h["type"] == HistoryEntryType.COMPLETED for h in history)
