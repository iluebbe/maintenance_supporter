"""Regression: a "fresh cycle" must also drop a pending ``due_override``.

Task unarchive, object unarchive and pause/resume all promise the same thing —
a recurring task comes back on today + interval, not retroactively overdue and
not on some stale date. All three re-anchored ``last_performed`` and cleared
``last_planned_due``, and all three forgot ``due_override``.

``due_override`` is a per-occurrence postpone that ``Schedule.next_due`` gives
precedence over the cadence whenever it is later than ``last_performed``. So a
task postponed to a FUTURE date and then archived/paused resurfaced on that
postponed date — the re-anchor was silently ignored. The three paths now share
``helpers.pause.reanchor_recurring_task``; one case per path below.
"""

from __future__ import annotations

from typing import Any

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.objects import (
    ws_archive_object,
    ws_get_objects,
    ws_pause_object,
    ws_resume_object,
    ws_unarchive_object,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_archive_task,
    ws_postpone_task,
    ws_unarchive_task,
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

# The postponed occurrence sits far enough past the re-anchor day that the two
# candidate answers can't collide: re-anchored on 2026-05-10 a monthly task is
# due 2026-06-10, while the stale override would say 2026-06-20.
POSTPONED_TO = "2026-06-20"
SETUP_DAY = "2026-05-01 09:00:00"
REANCHOR_DAY = "2026-05-10 09:00:00"
FRESH_DUE = "2026-06-10"


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


def _object(hass: HomeAssistant) -> MockConfigEntry:
    """One monthly recurring task on one object."""
    task = build_task_data(interval_days=None)
    task["schedule"] = {"kind": "interval", "every": 1, "unit": "months"}
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
    await call_ws_handler(
        ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"}
    )
    for obj in conn.send_result.call_args.args[1]["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return task
    raise AssertionError("task not found")


async def _call(hass: HomeAssistant, handler: Any, entry_id: str, **extra: Any) -> None:
    conn = _conn()
    msg = {"id": 1, "type": "x", "entry_id": entry_id, **extra}
    await call_ws_handler(handler, hass, conn, msg)
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()


async def _postponed_object(hass: HomeAssistant, global_entry: MockConfigEntry) -> MockConfigEntry:
    """Set up the object and postpone its monthly task into the future."""
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    await _call(hass, ws_postpone_task, obj.entry_id, task_id=TASK_ID_1, until=POSTPONED_TO)
    postponed = await _read(hass, obj.entry_id)
    assert postponed["next_due"] == POSTPONED_TO, "postpone did not take effect"
    return obj


def _assert_fresh_cycle(task: dict[str, Any]) -> None:
    assert task["due_override"] is None, "stale postpone survived the re-anchor"
    assert task["next_due"] == FRESH_DUE, (
        f"expected a fresh cycle ({FRESH_DUE}), got {task['next_due']!r} "
        f"— the stale postponed date was {POSTPONED_TO}"
    )


async def test_task_unarchive_drops_a_pending_postpone(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    with freeze_time(SETUP_DAY):
        obj = await _postponed_object(hass, global_entry)
        await _call(hass, ws_archive_task, obj.entry_id, task_id=TASK_ID_1)

    with freeze_time(REANCHOR_DAY):
        await _call(hass, ws_unarchive_task, obj.entry_id, task_id=TASK_ID_1)
        _assert_fresh_cycle(await _read(hass, obj.entry_id))


async def test_object_unarchive_drops_a_pending_postpone(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    with freeze_time(SETUP_DAY):
        obj = await _postponed_object(hass, global_entry)
        await _call(hass, ws_archive_object, obj.entry_id)

    with freeze_time(REANCHOR_DAY):
        await _call(hass, ws_unarchive_object, obj.entry_id)
        _assert_fresh_cycle(await _read(hass, obj.entry_id))


async def test_object_resume_drops_a_pending_postpone(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    with freeze_time(SETUP_DAY):
        obj = await _postponed_object(hass, global_entry)
        await _call(hass, ws_pause_object, obj.entry_id)

    with freeze_time(REANCHOR_DAY):
        await _call(hass, ws_resume_object, obj.entry_id)
        _assert_fresh_cycle(await _read(hass, obj.entry_id))
