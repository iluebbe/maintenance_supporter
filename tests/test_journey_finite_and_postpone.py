"""Journey: finite series ends on its own; a postponed occurrence defers once.

Two new scheduling features walked end-to-end across the persistence boundary:
- a finite series (repeat N times) stops re-arming and reads as done after the
  last completion, and stays done across a restart;
- postponing the current occurrence (WS task/postpone) moves only this cycle's
  due date, survives a restart, and is consumed by the next completion so the
  cadence returns to normal.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task, ws_postpone_task

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
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




def _object(hass: HomeAssistant, schedule: dict[str, Any]) -> MockConfigEntry:
    task = build_task_data(interval_days=None)
    task["schedule"] = schedule
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Widget",
        data=build_object_entry_data(
            object_data=build_object_data(name="Widget", object_id="objid_w"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_widget",
    )
    entry.add_to_hass(hass)
    return entry


async def _read(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    conn = _conn()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    for obj in conn.send_result.call_args.args[1]["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return task
    raise AssertionError("task not found")


async def _complete(hass: HomeAssistant, entry_id: str) -> None:
    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": entry_id, "task_id": TASK_ID_1},
    )
    await hass.async_block_till_done()


async def test_finite_series_ends_and_stays_done_across_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj = _object(hass, {"kind": "interval", "every": 1, "unit": "months", "ends": {"count": 2}})
    await setup_integration(hass, global_entry, obj)
    # Two completions. A restart between them clears the monotonic double-tap
    # dedup window (which freeze_time can't move), so both count.
    with freeze_time("2026-03-01 09:00:00"):
        await _complete(hass, obj.entry_id)
    assert (await _read(hass, obj.entry_id))["is_done"] is False, "still one to go"

    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    with freeze_time("2026-04-05 09:00:00"):
        await _complete(hass, obj.entry_id)
    done = await _read(hass, obj.entry_id)
    assert done["is_done"] is True, "finite series should be done after the last completion"
    assert done["next_due"] is None, "an ended series must not re-arm"

    # Stays done across a restart.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    after = await _read(hass, obj.entry_id)
    assert after["is_done"] is True and after["next_due"] is None, "series resurrected after restart"


async def test_postpone_defers_one_occurrence_then_clears_on_complete(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj = _object(hass, {"kind": "interval", "every": 1, "unit": "months"})
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        # First cycle is due ~one month out.
        assert (await _read(hass, obj.entry_id))["next_due"] == "2026-06-01"

        # Postpone this occurrence to a specific date.
        await call_ws_handler(
            ws_postpone_task,
            hass,
            _conn(),
            {
                "id": 1,
                "type": "maintenance_supporter/task/postpone",
                "entry_id": obj.entry_id,
                "task_id": TASK_ID_1,
                "until": "2026-06-20",
            },
        )
        await hass.async_block_till_done()
        postponed = await _read(hass, obj.entry_id)
        assert postponed["next_due"] == "2026-06-20", "postpone did not move the current due date"
        assert postponed["due_override"] == "2026-06-20", "due_override not exposed"

    # The override persists across a restart.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    with freeze_time("2026-05-02 09:00:00"):
        assert (await _read(hass, obj.entry_id))["next_due"] == "2026-06-20", "override lost across restart"

        # Completing consumes the override → back to the normal monthly cadence.
        await _complete(hass, obj.entry_id)
        resumed = await _read(hass, obj.entry_id)
        assert resumed["due_override"] is None, "override not cleared on completion"
        assert resumed["next_due"] == "2026-06-02", "cadence not restored after the postponed cycle"
