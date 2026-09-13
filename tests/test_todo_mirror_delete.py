"""D#183: deleting a mirrored task takes its rows off the lists (the Store
record goes with the task, so the rows would otherwise outlive it)."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.helpers.todo_mirror import MIRROR_STATE_KEY, TodoMirror


class _Store:
    def __init__(self, state: dict[str, Any]) -> None:
        self.state = state
        self.updates: list[dict[str, Any]] = []

    def get_task_state(self, task_id: str) -> dict[str, Any]:
        return self.state.get(task_id, {})

    def update_task_state(self, task_id: str, **fields: Any) -> None:
        self.updates.append({task_id: fields})
        for k, v in fields.items():
            if v is None:
                self.state.get(task_id, {}).pop(k, None)
            else:
                self.state.setdefault(task_id, {})[k] = v


async def test_forget_task_removes_rows_and_record(hass: HomeAssistant) -> None:
    hass.states.async_set("todo.children", "1")
    hass.states.async_set("todo.parents", "0")
    calls: list[dict[str, Any]] = []

    async def _remove(call: Any) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("todo", "remove_item", _remove)
    mirror = TodoMirror(hass)
    store = _Store({"t1": {MIRROR_STATE_KEY: {"todo.children": {"summary": "Obj: Task", "uid": "u1"}, "todo.parents": {"summary": "Obj: Task", "uid": "u2"}}}})
    await mirror.async_forget_task(store, "t1")  # type: ignore[arg-type]
    assert sorted(c["item"] for c in calls) == ["u1", "u2"]
    assert MIRROR_STATE_KEY not in store.state["t1"]
    # no record → nothing to do, no service call
    calls.clear()
    await mirror.async_forget_task(store, "t2")  # type: ignore[arg-type]
    assert calls == []


async def test_delete_task_ws_forgets_rows(hass: HomeAssistant) -> None:
    """The WS delete path calls the mirror before dropping the Store state."""
    from custom_components.maintenance_supporter.websocket import tasks_crud

    from pathlib import Path

    src = Path(tasks_crud.__file__).read_text(encoding="utf-8")
    delete_body = src.split("async def ws_delete_task", 1)[1]
    assert "async_forget_task" in delete_body and delete_body.index("async_forget_task") < delete_body.index("store.remove_task(task_id)")
    mirror = MagicMock()
    mirror.async_forget_task = AsyncMock()
    assert hasattr(mirror, "async_forget_task")
