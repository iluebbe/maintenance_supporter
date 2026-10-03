"""Several tasks changed at once (discussion #199).

After setting up many templates, a household has to assign the tasks, label
them and tune their warning days — one dialog per task. The bulk bar could
only complete, archive and move. ``tasks/update_many`` applies one change to
any number of tasks across objects: the rules of task/update for the same
fields, one write and one reload per object, a per-task answer and the
replaced values for an exact undo.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS
from custom_components.maintenance_supporter.websocket.tasks_bulk import apply_bulk_changes, ws_update_many_tasks

from .conftest import (
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


async def _setup(hass: HomeAssistant) -> tuple[MockConfigEntry, MockConfigEntry]:
    kitchen = make_object_entry(
        hass,
        tasks={
            "descale": {**build_task_data(task_id="descale", name="Descale"), "labels": ["kitchen"]},
            "filter": {**build_task_data(task_id="filter", name="Water filter"), "priority": "high"},
        },
        name="Coffee machine",
        uid="coffee",
    )
    garden = make_object_entry(
        hass,
        tasks={"blades": {**build_task_data(task_id="blades", name="Sharpen blades"), "notify_enabled": False}},
        name="Mower",
        uid="mower",
    )
    await setup_integration(hass, make_global_entry(hass), kitchen, garden)
    return kitchen, garden


async def _ws(hass: HomeAssistant, payload: dict[str, Any]) -> tuple[Any, Any]:
    conn = make_ws_connection()
    await call_ws_handler(ws_update_many_tasks, hass, conn, {"id": 1, "type": "maintenance_supporter/tasks/update_many", **payload})
    await hass.async_block_till_done()
    result = conn.send_result.call_args[0][1] if conn.send_result.called else None
    error = conn.send_error.call_args[0][1:] if conn.send_error.called else None
    return result, error


def _task(entry: MockConfigEntry, task_id: str) -> dict[str, Any]:
    return dict(entry.data[CONF_TASKS][task_id])


def _items(*pairs: tuple[MockConfigEntry, str]) -> list[dict[str, str]]:
    return [{"entry_id": entry.entry_id, "task_id": task_id} for entry, task_id in pairs]


async def test_one_change_reaches_every_task_with_one_reload_per_object(hass: HomeAssistant) -> None:
    kitchen, garden = await _setup(hass)
    alice = await hass.auth.async_create_user("Alice")
    reloads: list[str] = []
    original = hass.config_entries.async_reload

    async def counting_reload(entry_id: str) -> bool:
        reloads.append(entry_id)
        return await original(entry_id)

    with patch.object(hass.config_entries, "async_reload", side_effect=counting_reload):
        result, error = await _ws(
            hass,
            {
                "items": _items((kitchen, "descale"), (kitchen, "filter"), (garden, "blades")),
                "changes": {"responsible_user_id": alice.id, "assignee_pool": None, "rotation_strategy": None, "warning_days": 3},
            },
        )
    assert error is None
    assert len(result["updated"]) == 3 and result["failed"] == []
    assert sorted(reloads) == sorted([kitchen.entry_id, garden.entry_id]), "one reload per object, not per task"
    for entry, task_id in ((kitchen, "descale"), (kitchen, "filter"), (garden, "blades")):
        task = _task(entry, task_id)
        assert task["responsible_user_id"] == alice.id and task["warning_days"] == 3
    assert _task(kitchen, "descale")["labels"] == ["kitchen"], "fields not named stay as they were"


async def test_labels_are_added_and_removed_per_task_and_the_undo_restores_them(hass: HomeAssistant) -> None:
    kitchen, garden = await _setup(hass)
    items = _items((kitchen, "descale"), (garden, "blades"))
    result, _ = await _ws(hass, {"items": items, "changes": {"labels_add": ["monthly", "kitchen"], "labels_remove": ["kitchen"]}})
    assert _task(kitchen, "descale")["labels"] == ["monthly", "kitchen"], "remove first, then add — the add wins"
    assert _task(garden, "blades")["labels"] == ["monthly", "kitchen"]

    undo = [{**ref, "changes": prev["changes"]} for ref, prev in zip(items, result["previous"], strict=True)]
    await _ws(hass, {"items": undo})
    assert _task(kitchen, "descale")["labels"] == ["kitchen"]
    assert "labels" not in _task(garden, "blades"), "a task without labels gets none back"


async def test_reminders_and_priority_follow_task_update_storage_and_undo(hass: HomeAssistant) -> None:
    kitchen, garden = await _setup(hass)
    items = _items((kitchen, "filter"), (garden, "blades"))
    result, _ = await _ws(hass, {"items": items, "changes": {"notify_enabled": True, "priority": "low"}})
    assert "notify_enabled" not in _task(garden, "blades"), "reminders on is stored as absence"
    assert _task(kitchen, "filter")["priority"] == "low"
    by_task = {p["task_id"]: p["changes"] for p in result["previous"]}
    assert by_task["blades"]["notify_enabled"] is False and by_task["filter"]["priority"] == "high"

    await _ws(hass, {"items": [{**ref, "changes": by_task[ref["task_id"]]} for ref in items]})
    assert _task(garden, "blades")["notify_enabled"] is False
    assert _task(kitchen, "filter")["priority"] == "high"
    assert "priority" not in _task(garden, "blades"), "None restores 'not set'"


async def test_a_rotation_gets_its_first_assignee_and_one_person_ends_it(hass: HomeAssistant) -> None:
    kitchen, _garden = await _setup(hass)
    alice = await hass.auth.async_create_user("Alice")
    bob = await hass.auth.async_create_user("Bob")
    items = _items((kitchen, "descale"))
    await _ws(hass, {"items": items, "changes": {"assignee_pool": [alice.id, bob.id], "rotation_strategy": "round_robin", "responsible_user_id": None}})
    task = _task(kitchen, "descale")
    assert task["assignee_pool"] == [alice.id, bob.id] and task["rotation_strategy"] == "round_robin"
    assert task["responsible_user_id"] == alice.id, "a rotation always has someone on duty"

    await _ws(hass, {"items": items, "changes": {"responsible_user_id": bob.id, "assignee_pool": None, "rotation_strategy": None}})
    task = _task(kitchen, "descale")
    assert task["responsible_user_id"] == bob.id
    assert "assignee_pool" not in task and "rotation_strategy" not in task


async def test_each_task_answers_for_itself(hass: HomeAssistant) -> None:
    kitchen, _garden = await _setup(hass)
    result, error = await _ws(
        hass,
        {
            "items": [
                {"entry_id": kitchen.entry_id, "task_id": "descale"},
                {"entry_id": kitchen.entry_id, "task_id": "no_such_task"},
                {"entry_id": "no_such_object", "task_id": "x"},
                {"entry_id": kitchen.entry_id, "task_id": "filter", "changes": {"responsible_user_id": "ghost"}},
            ],
            "changes": {"warning_days": 5},
        },
    )
    assert error is None
    assert result["updated"] == [{"entry_id": kitchen.entry_id, "task_id": "descale"}]
    codes = {(f["task_id"], f["code"]) for f in result["failed"]}
    assert codes == {("no_such_task", "not_found"), ("x", "not_found"), ("filter", "invalid_user")}
    assert _task(kitchen, "filter").get("warning_days") != 5, "a refused task is not half-changed"


def test_apply_reports_what_it_replaced() -> None:
    task = {"name": "T", "labels": ["a"], "warning_days": 7}
    out, previous = apply_bulk_changes(task, {"labels_add": ["b"], "warning_days": 2})
    assert out["labels"] == ["a", "b"] and out["warning_days"] == 2
    assert previous == {"labels": ["a"], "warning_days": 7}
    assert task == {"name": "T", "labels": ["a"], "warning_days": 7}, "the stored dict is not mutated"
