"""History payload diet (perf): list responses truncate, task/history serves all.

At 150+ tasks the full histories dominated the ``objects`` payload (906 KB
measured at 40 entries/task against the store cap of 500) — every list
consumer reads at most the last 20 entries or an aggregate, so the summary
now carries only that window plus ``history_count``, and the detail view
fetches the complete record lazily via the read-tier ``task/history``.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket import _HISTORY_WINDOW
from custom_components.maintenance_supporter.websocket.tasks_lifecycle import ws_list_tasks, ws_task_history

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _history(n: int) -> list[dict]:
    return [
        {"timestamp": f"2026-{1 + i // 28:02d}-{1 + i % 28:02d}T10:00:00+00:00", "type": "completed", "notes": f"run {i}"}
        for i in range(n)
    ]


async def test_list_truncates_history_and_detail_ws_serves_it_all(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    task = build_task_data(name="Descaling", interval_days=30)
    task["history"] = _history(_HISTORY_WINDOW + 15)
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Espresso",
        data=build_object_entry_data(
            object_data=build_object_data(name="Espresso", object_id="objid_esp"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(ws_list_tasks, hass, conn, {"id": 1, "type": "x"})
    listed = next(t for t in conn.send_result.call_args[0][1]["tasks"] if t["task_id"] == TASK_ID_1)
    assert len(listed["history"]) == _HISTORY_WINDOW, "the list carries only the window"
    assert listed["history_count"] == _HISTORY_WINDOW + 15, "…but says how much exists"
    # The window is the most RECENT entries — the tail, not the head.
    assert listed["history"][-1]["notes"] == f"run {_HISTORY_WINDOW + 14}"
    assert listed["history"][0]["notes"] == "run 15"

    conn2 = make_ws_connection()
    await call_ws_handler(ws_task_history, hass, conn2, {"id": 2, "type": "x", "entry_id": entry.entry_id, "task_id": TASK_ID_1})
    full = conn2.send_result.call_args[0][1]
    assert full["count"] == _HISTORY_WINDOW + 15
    assert len(full["history"]) == _HISTORY_WINDOW + 15
    assert full["history"][0]["notes"] == "run 0"


async def test_task_history_unknown_task_errors(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    conn = make_ws_connection()
    await call_ws_handler(ws_task_history, hass, conn, {"id": 1, "type": "x", "entry_id": "nope", "task_id": "nope"})
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "not_found"
