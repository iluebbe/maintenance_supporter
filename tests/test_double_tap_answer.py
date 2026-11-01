"""A completion the double-tap guard drops says so.

Two people (or one person on two devices) completing the same task within
thirty seconds record it once (journey M1). The second tap was answered with a
plain success, so the panel read it as done and nothing told anybody that it
counted as the first one (lifecycle click test, 2026-11-01). Both completion
commands now answer with how long ago the first one was, and offer no Undo.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
    ws_quick_complete_task,
)

from .conftest import (
    TASK_ID_1,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


async def _setup(hass: HomeAssistant, uid: str) -> Any:
    task = build_task_data(interval_days=30, last_performed="2020-01-01") | {"quick_complete_defaults": {}}
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Pool Pump", uid=uid)
    await setup_integration(hass, make_global_entry(hass), obj)
    return obj


async def _send(hass: HomeAssistant, handler: Any, obj: Any, kind: str) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(
        handler, hass, conn, {"id": 1, "type": f"maintenance_supporter/task/{kind}", "entry_id": obj.entry_id, "task_id": TASK_ID_1}
    )
    conn.send_error.assert_not_called()
    return conn.send_result.call_args[0][1]


def _completions(obj: Any) -> int:
    merged = obj.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    return sum(1 for e in merged.get("history") or [] if e.get("type") == "completed")


async def test_second_complete_within_the_window_answers_already_recorded(hass: HomeAssistant) -> None:
    obj = await _setup(hass, "dt-complete")
    first = await _send(hass, ws_complete_task, obj, "complete")
    assert "already_recorded_seconds" not in first
    second = await _send(hass, ws_complete_task, obj, "complete")
    assert second["success"] is True
    assert second["undo"] is False, "nothing new to undo"
    assert second["already_recorded_seconds"] >= 1
    assert _completions(obj) == 1


async def test_quick_complete_after_a_complete_answers_already_recorded(hass: HomeAssistant) -> None:
    obj = await _setup(hass, "dt-quick")
    await _send(hass, ws_complete_task, obj, "complete")
    second = await _send(hass, ws_quick_complete_task, obj, "quick_complete")
    assert second["already_recorded_seconds"] >= 1
    assert second["via"] == "quick"
    assert second["undo"] is False
    assert _completions(obj) == 1
