"""Journey: the invoice found in a drawer — backdated completions (#133).

A household completes a task normally, then later finds the garage invoice
for a service done months ago and backfills it. The journey pins the whole
arc across the REAL surfaces (WS complete, coordinator, store, events):

* the backfill lands in history with its past timestamp and cost,
* the LIVE cycle is untouched (anchor, next_due, status),
* budget/statistics count the backfilled cost,
* the bus events tell the two apart (`completed_at` + `backfill`),
* and a "did it three days ago" completion (still the latest) anchors the
  cycle on the real day instead of today.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_capture_events,
)

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    EVENT_TASK_COMPLETED,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection as _conn,
    setup_integration,
)


import pytest


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


def _car(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Family Car",
        data=build_object_entry_data(
            object_data=build_object_data(name="Family Car"),
            tasks={
                TASK_ID_1: build_task_data(
                    task_id=TASK_ID_1,
                    name="Oil Change",
                    interval_days=180,
                    last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
                )
            },
        ),
        source="user",
        unique_id="maintenance_supporter_journey_backdate",
    )
    entry.add_to_hass(hass)
    return entry


async def _complete(hass: HomeAssistant, entry: MockConfigEntry, **fields):
    conn = _conn()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
            **fields,
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()


async def test_journey_backfill_from_an_old_invoice(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    car = _car(hass)
    await setup_integration(hass, global_entry, car)
    events = async_capture_events(hass, EVENT_TASK_COMPLETED)
    coordinator = car.runtime_data.coordinator

    # 1. A normal completion today — the live cycle anchors on it.
    await _complete(hass, car, cost=89.0, notes="regular service")
    today = dt_util.now().date().isoformat()
    merged = coordinator._get_merged_tasks_data()
    assert merged[TASK_ID_1]["last_performed"] == today

    # 2. Months later... the drawer yields an invoice from LAST YEAR.
    invoice_day = (dt_util.now() - timedelta(days=300)).replace(microsecond=0)
    await _complete(
        hass,
        car,
        completed_at=invoice_day.isoformat(),
        cost=250.0,
        notes="found the invoice",
    )

    merged = coordinator._get_merged_tasks_data()
    task = merged[TASK_ID_1]

    # The live cycle did NOT move backwards.
    assert task["last_performed"] == today

    # Both completions are on the record, the backfill with its real day.
    completed = [h for h in task["history"] if h["type"] == HistoryEntryType.COMPLETED]
    assert len(completed) == 2
    assert completed[-1]["timestamp"] == invoice_day.isoformat()
    assert completed[-1]["cost"] == 250.0

    # Statistics count both services (times_performed via coordinator data).
    coord_task = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert coord_task["_times_performed"] == 2
    assert coord_task["_total_cost"] == 339.0

    # The bus told the two apart.
    assert [e.data["backfill"] for e in events] == [False, True]
    assert events[1].data["completed_at"] == invoice_day.isoformat()
    assert events[1].data["cost"] == 250.0


async def test_journey_did_it_three_days_ago(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Logging real work late: the newest completion anchors on ITS day."""
    car = _car(hass)
    await setup_integration(hass, global_entry, car)
    coordinator = car.runtime_data.coordinator

    three_days_ago = (dt_util.now() - timedelta(days=3)).replace(microsecond=0)
    await _complete(hass, car, completed_at=three_days_ago.isoformat(), duration=45)

    merged = coordinator._get_merged_tasks_data()
    task = merged[TASK_ID_1]
    assert task["last_performed"] == three_days_ago.date().isoformat()
    entry = task["history"][-1]
    assert entry["timestamp"] == three_days_ago.isoformat()
    assert entry["duration"] == 45

    # The next cycle counts from the real day: 180d interval - 3 elapsed.
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_days_until_due"] == 177
