"""Journey: the mower that sleeps through winter (seasonal active window).

A task restricted to April–October: completing it late in the season pushes the
next occurrence out of season, which must roll forward to the start of the next
active period — and that rolled date has to survive a restart (it's computed
each read, but the completion that anchors it is persisted). Walks
complete-in-season → roll to next spring → restart → resume in spring.
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
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task

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

_SEASON = [4, 5, 6, 7, 8, 9, 10]  # Apr–Oct


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




async def _next_due(hass: HomeAssistant, entry_id: str) -> Any:
    conn = _conn()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    for obj in conn.send_result.call_args.args[1]["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return task["next_due"]
    raise AssertionError("task not found")


async def _complete(hass: HomeAssistant, entry_id: str) -> None:
    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": entry_id, "task_id": TASK_ID_1},
    )
    await hass.async_block_till_done()


async def test_seasonal_task_sleeps_through_the_off_season_and_resumes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    task = build_task_data(interval_days=None)
    task["schedule"] = {"kind": "interval", "every": 2, "unit": "weeks", "season_months": _SEASON}
    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Lawn Mower",
        data=build_object_entry_data(
            object_data=build_object_data(name="Lawn Mower", object_id="objid_mow"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_mower",
    )
    obj.add_to_hass(hass)

    # Mid-season completion → next is two weeks out, still in season.
    with freeze_time("2026-06-15 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await _complete(hass, obj.entry_id)
        assert await _next_due(hass, obj.entry_id) == "2026-06-29", "mid-season next due should be normal cadence"

    # A restart between completions clears the monotonic double-tap dedup
    # window (freeze_time can't move it), so the next completion counts.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)

    # Late-season completion (Oct 25) → next would be Nov 8 (off-season) → the
    # window rolls it forward to April 1 of next year.
    with freeze_time("2026-10-25 09:00:00"):
        await _complete(hass, obj.entry_id)
        assert await _next_due(hass, obj.entry_id) == "2027-04-01", "off-season due did not roll to spring"

    # The spring resume survives a restart.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    with freeze_time("2026-11-01 09:00:00"):
        assert await _next_due(hass, obj.entry_id) == "2027-04-01", "seasonal resume lost across restart"

    # Come spring, completing resumes the normal two-week cadence in season.
    with freeze_time("2027-04-10 09:00:00"):
        await _complete(hass, obj.entry_id)
        assert await _next_due(hass, obj.entry_id) == "2027-04-24", "in-season cadence not resumed"
