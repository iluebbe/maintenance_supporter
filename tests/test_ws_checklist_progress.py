"""#73: in-cycle checklist ticks — persisted WITHOUT completing the task.

`task/checklist_progress` replaces the stored {item text: bool} state, drops
unknown items, and the ticks are echoed on every task summary as
`checklist_progress`. Completing or skipping the cycle clears them.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_checklist_progress,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)

STEPS = ["Drain water", "Clean filter", "Refill"]


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


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(task_id=TASK_ID_1, interval_days=30)
    task["checklist"] = list(STEPS)
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="ms_checklist_obj",
    )
    entry.add_to_hass(hass)
    return entry


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    return conn


async def _set_progress(
    hass: HomeAssistant, entry: MockConfigEntry, state: dict[str, bool]
) -> dict[str, Any]:
    conn = _conn()
    await call_ws_handler(
        ws_checklist_progress,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/checklist_progress",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
            "checklist_state": state,
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    result: dict[str, Any] = conn.send_result.call_args[0][1]
    return result


def _echoed_progress(entry: MockConfigEntry) -> dict[str, bool]:
    from custom_components.maintenance_supporter.websocket import (
        _build_task_summary,
        _get_merged_tasks,
    )

    task_data = _get_merged_tasks(entry)[TASK_ID_1]
    summary = _build_task_summary(None, TASK_ID_1, task_data, None)  # type: ignore[arg-type]
    progress: dict[str, bool] = summary["checklist_progress"]
    return progress


async def test_ticks_persist_without_completing(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)

    result = await _set_progress(hass, object_entry, {"Drain water": True, "Clean filter": False})
    assert result["checklist_state"] == {"Drain water": True, "Clean filter": False}
    assert _echoed_progress(object_entry) == {"Drain water": True, "Clean filter": False}

    # The task itself is untouched — no completion happened.
    rd = object_entry.runtime_data
    task = rd.coordinator.data[CONF_TASKS][TASK_ID_1]
    assert not task.get("history")


async def test_unknown_items_are_dropped(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    result = await _set_progress(
        hass, object_entry, {"Drain water": True, "Not a real step": True}
    )
    assert result["checklist_state"] == {"Drain water": True}


async def test_progress_survives_a_reload(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    await _set_progress(hass, object_entry, {"Refill": True})

    await hass.config_entries.async_reload(object_entry.entry_id)
    await hass.async_block_till_done()

    assert _echoed_progress(object_entry) == {"Refill": True}


async def test_completing_clears_the_ticks(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    await _set_progress(hass, object_entry, {"Drain water": True, "Refill": True})

    rd = object_entry.runtime_data
    await rd.coordinator.complete_maintenance(TASK_ID_1, notes="done")
    await hass.async_block_till_done()

    assert _echoed_progress(object_entry) == {}


async def test_skipping_clears_the_ticks(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    await _set_progress(hass, object_entry, {"Clean filter": True})

    rd = object_entry.runtime_data
    await rd.coordinator.skip_maintenance(TASK_ID_1, reason="on holiday")
    await hass.async_block_till_done()

    assert _echoed_progress(object_entry) == {}
