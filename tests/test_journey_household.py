"""Journeys M1 (household double-complete) + P1 (read parity across surfaces).

See docs/design/user-journeys.md — the household/truth categories:
two people acting on the same task must count as one action, and every
read surface must report the same numbers.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket import (
    _build_object_response,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import (
    ws_update_task,
)

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




def _make_entry(hass: HomeAssistant, unique_id: str, name: str, task: dict[str, Any]) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── M1: two phones, one lawn ────────────────────────────────────────────────


async def test_double_tap_from_two_devices_counts_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    MockUser(id="m1-anna", name="Anna").add_to_hass(hass)
    MockUser(id="m1-ben", name="Ben").add_to_hass(hass)
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Mow",
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        interval_days=7,
    )
    obj_entry = _make_entry(hass, "double_tap", "Lawn", task)
    await setup_integration(hass, global_entry, obj_entry)

    # Shared task rotating between Anna and Ben, Anna's turn.
    await call_ws_handler(
        ws_update_task,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "responsible_user_id": "m1-anna",
            "assignee_pool": ["m1-anna", "m1-ben"],
            "rotation_strategy": "round_robin",
        },
    )
    await hass.async_block_till_done()

    # Both phones show "Mow — overdue"; both taps arrive within seconds.
    for i in (1, 2):
        await call_ws_handler(
            ws_complete_task,
            hass,
            _conn(),
            {
                "id": 10 + i,
                "type": "maintenance_supporter/task/complete",
                "entry_id": obj_entry.entry_id,
                "task_id": TASK_ID_1,
                "cost": 5.0,
            },
        )
    await hass.async_block_till_done()

    coordinator = obj_entry.runtime_data.coordinator
    merged = coordinator._get_merged_tasks_data()[TASK_ID_1]
    completions = [h for h in merged["history"] if h.get("type") == "completed"]
    assert len(completions) == 1, "double tap recorded twice"
    # Rotation advanced exactly ONE step: Anna → Ben (not back to Anna).
    assert obj_entry.data[CONF_TASKS][TASK_ID_1]["responsible_user_id"] == "m1-ben", "double tap double-advanced the rotation"


async def test_completion_after_the_window_is_a_real_completion(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The dedup window must not swallow deliberate later completions."""
    from unittest.mock import patch

    task = build_task_data(
        task_id=TASK_ID_1,
        name="Wipe",
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        interval_days=7,
    )
    obj_entry = _make_entry(hass, "window_edge", "Counter", task)
    await setup_integration(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator

    await coordinator.complete_maintenance(task_id=TASK_ID_1)
    await hass.async_block_till_done()

    # 31 seconds later (monotonic) a second completion is genuine.
    real_monotonic = __import__("time").monotonic
    with patch(
        "custom_components.maintenance_supporter.coordinator.time.monotonic",
        side_effect=lambda: real_monotonic() + 31,
    ):
        await coordinator.complete_maintenance(task_id=TASK_ID_1)
    await hass.async_block_till_done()

    merged = coordinator._get_merged_tasks_data()[TASK_ID_1]
    completions = [h for h in merged["history"] if h.get("type") == "completed"]
    assert len(completions) == 2


# ─── P1: every read surface reports the same numbers ────────────────────────


async def test_read_parity_across_all_surfaces(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Descale",
        last_performed=last,
        interval_days=30,
    )
    obj_entry = _make_entry(hass, "read_parity", "Kettle", task)
    await setup_integration(hass, global_entry, obj_entry)

    expected_due = (date.fromisoformat(last) + timedelta(days=30)).isoformat()

    # 1. Sensor state + attributes.
    from homeassistant.helpers import entity_registry as er

    reg = er.async_get(hass)
    sensor_eid = next(
        e.entity_id
        for e in er.async_entries_for_config_entry(reg, obj_entry.entry_id)
        if e.domain == "sensor" and not e.unique_id.endswith("_next_due")
    )
    state = hass.states.get(sensor_eid)
    assert state.state == "ok"
    assert state.attributes["next_due"] == expected_due
    assert state.attributes["days_until_due"] == 10

    # 2. list_tasks service.
    listed = await hass.services.async_call(
        DOMAIN,
        "list_tasks",
        {"entry_id": obj_entry.entry_id},
        blocking=True,
        return_response=True,
    )
    row = listed["tasks"][0]
    assert row["status"] == "ok"
    assert row["next_due"] == expected_due
    assert row["days_until_due"] == 10

    # 3. WS object response (what the panel renders).
    coordinator = obj_entry.runtime_data.coordinator
    resp = _build_object_response(hass, obj_entry, coordinator.data)
    task_resp = next(t for t in resp["tasks"] if t["id"] == TASK_ID_1)
    assert task_resp["status"] == "ok"
    assert task_resp["next_due"] == expected_due
    assert task_resp["days_until_due"] == 10

    # 4. To-do item due date.
    from homeassistant.components.todo import TodoListEntity

    todo_eid = next(e.entity_id for e in reg.entities.values() if e.domain == "todo")
    todo_entity = hass.data["todo"].get_entity(todo_eid)
    assert isinstance(todo_entity, TodoListEntity)
    item = next(i for i in (todo_entity.todo_items or []) if i.uid == f"{obj_entry.entry_id}:{TASK_ID_1}")
    assert str(item.due) == expected_due

    # 5. Calendar entity event.
    from homeassistant.util import dt as dtu

    cal_eid = next(e.entity_id for e in reg.entities.values() if e.domain == "calendar")
    cal_entity = hass.data["calendar"].get_entity(cal_eid)
    events = await cal_entity.async_get_events(
        hass,
        dtu.now(),
        dtu.now() + timedelta(days=40),
    )
    ours = [e for e in events if "Descale" in e.summary]
    assert ours, "calendar lost the task"
    start = ours[0].start
    start_date = start.date() if hasattr(start, "date") else start
    assert start_date.isoformat() == expected_due
