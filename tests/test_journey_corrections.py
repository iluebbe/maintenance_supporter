"""Journey D (corrections): fixing mistakes must survive restarts.

See docs/design/user-journeys.md — history edits and date resets are how
users repair wrong entries; the corrected values (not the originals) must be
what every surface reports afterwards, including after a restart.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket import (
    _build_object_response,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
    ws_reset_task,
)
from custom_components.maintenance_supporter.websocket.tasks_history import (
    ws_update_history_entry,
)

from .conftest import make_ws_connection as _conn, build_global_entry_data, call_ws_handler, setup_integration
from .journey import simulate_restart


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




def _task_response(hass: HomeAssistant, entry_id: str, task_id: str) -> dict[str, Any]:
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    rd = entry.runtime_data
    coord = rd.coordinator if rd else None
    resp = _build_object_response(hass, entry, coord.data if coord else None)
    return next(t for t in resp["tasks"] if t["id"] == task_id)


async def test_wrong_cost_is_corrected_and_survives_restart(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)

    obj = await hass.services.async_call(
        DOMAIN,
        "add_object",
        {"name": "Car"},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Oil change", "interval_days": 365},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    task_id = res["task_id"]

    # Fat-fingered: 1250 instead of 125.
    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": entry_id,
            "task_id": task_id,
            "notes": "5W30",
            "cost": 1250.0,
        },
    )
    await hass.async_block_till_done()

    task = _task_response(hass, entry_id, task_id)
    assert task["total_cost"] == 1250.0
    original_ts = task["history"][-1]["timestamp"]

    # The correction (panel history edit → task/history/update).
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": entry_id,
            "task_id": task_id,
            "original_timestamp": original_ts,
            "cost": 125.0,
            "notes": "5W30 (typo fixed)",
        },
    )
    await hass.async_block_till_done()

    # The handler's request_refresh is debounced (10s cooldown after the
    # completion's refresh) — pull the next tick explicitly, like the
    # coordinator's schedule would.
    entry = hass.config_entries.async_get_entry(entry_id)
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()

    task = _task_response(hass, entry_id, task_id)
    assert task["total_cost"] == 125.0

    # The corrected value — not the original — survives the restart.
    await simulate_restart(hass, global_entry, entry)
    task = _task_response(hass, entry_id, task_id)
    assert task["total_cost"] == 125.0
    assert task["history"][-1]["notes"] == "5W30 (typo fixed)"
    assert task["times_performed"] == 1


async def test_backdating_a_completion_recomputes_status(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Moving a completion's timestamp back must flip status accordingly."""
    await setup_integration(hass, global_entry)

    obj = await hass.services.async_call(
        DOMAIN,
        "add_object",
        {"name": "Filter"},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Swap", "interval_days": 30},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    task_id = res["task_id"]

    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": entry_id,
            "task_id": task_id,
        },
    )
    await hass.async_block_till_done()
    assert _task_response(hass, entry_id, task_id)["status"] == "ok"

    # "I actually did that 45 days ago" → reset to the real date.
    real_date = (dt_util.now().date() - timedelta(days=45)).isoformat()
    await call_ws_handler(
        ws_reset_task,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/task/reset",
            "entry_id": entry_id,
            "task_id": task_id,
            "date": real_date,
        },
    )
    await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(entry_id)
    await simulate_restart(hass, global_entry, entry)
    task = _task_response(hass, entry_id, task_id)
    assert task["status"] == "overdue"
    assert task["last_performed"] == real_date
