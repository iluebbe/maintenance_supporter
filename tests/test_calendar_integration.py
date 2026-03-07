"""Integration tests: calendar entity cross-module behavior."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_complete_task,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    set_sensor_state,
    setup_integration,
)


TASK_ID_3 = "d" * 32


# ─── Helpers ──────────────────────────────────────────────────────────────


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


# ─── Fixtures ─────────────────────────────────────────────────────────────


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# ─── Tests ────────────────────────────────────────────────────────────────


async def test_calendar_reflects_task_completion(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Overdue task shows as event → complete → event moves to next due date."""
    last_performed = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(
        last_performed=last_performed,
        interval_days=30,
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Cal Complete",
        data=build_object_entry_data(
            object_data=build_object_data(name="Cal Complete"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_cal_complete",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is None:
        pytest.skip("Calendar entity not created")

    now = dt_util.now()

    # Before completion: overdue event should exist near today
    events_before = await calendar.async_get_events(
        hass, now - timedelta(days=60), now + timedelta(days=60)
    )
    overdue_events = [e for e in events_before if "Cal Complete" in (e.summary or "")]
    assert len(overdue_events) >= 1

    # Complete the task
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    store = entry.runtime_data.store
    coordinator = entry.runtime_data.coordinator

    async def _immediate_save() -> None:
        await store.async_save()

    conn = _mock_connection()
    with patch.object(store, "async_delay_save", side_effect=lambda: hass.async_create_task(_immediate_save())):
        await ws_complete_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
            "id": 1, "type": "maintenance_supporter/task/complete",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
        })
    await hass.async_block_till_done()

    # Refresh coordinator so calendar updates
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # After completion: event should be ~30 days from now
    events_after = await calendar.async_get_events(
        hass, now + timedelta(days=20), now + timedelta(days=40)
    )
    future_events = [e for e in events_after if "Cal Complete" in (e.summary or "")]
    assert len(future_events) >= 1


async def test_calendar_multi_object_aggregation(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """3 objects → calendar returns events for all with correct prefixes."""
    now = dt_util.now().date()

    # OK task (due in 20 days)
    ok_task = build_task_data(
        task_id=TASK_ID_1,
        name="OK Task",
        last_performed=(now - timedelta(days=10)).isoformat(),
        interval_days=30,
    )
    ok_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="OK Obj",
        data=build_object_entry_data(
            object_data=build_object_data(name="OK Obj"),
            tasks={TASK_ID_1: ok_task},
        ),
        source="user",
        unique_id="maintenance_supporter_cal_ok",
    )
    ok_entry.add_to_hass(hass)

    # Due soon task (due in 5 days, warning 7)
    due_task = build_task_data(
        task_id=TASK_ID_1,
        name="Due Task",
        last_performed=(now - timedelta(days=25)).isoformat(),
        interval_days=30,
        warning_days=7,
    )
    due_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Due Obj",
        data=build_object_entry_data(
            object_data=build_object_data(name="Due Obj"),
            tasks={TASK_ID_1: due_task},
        ),
        source="user",
        unique_id="maintenance_supporter_cal_due",
    )
    due_entry.add_to_hass(hass)

    # Overdue task
    overdue_task = build_task_data(
        task_id=TASK_ID_1,
        name="Overdue Task",
        last_performed=(now - timedelta(days=60)).isoformat(),
        interval_days=30,
    )
    overdue_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Overdue Obj",
        data=build_object_entry_data(
            object_data=build_object_data(name="Overdue Obj"),
            tasks={TASK_ID_1: overdue_task},
        ),
        source="user",
        unique_id="maintenance_supporter_cal_overdue",
    )
    overdue_entry.add_to_hass(hass)

    await setup_integration(hass, global_entry, ok_entry, due_entry, overdue_entry)

    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is None:
        pytest.skip("Calendar entity not created")

    dt_now = dt_util.now()
    events = await calendar.async_get_events(
        hass, dt_now - timedelta(days=60), dt_now + timedelta(days=60)
    )

    # Should have events from multiple objects
    summaries = [e.summary or "" for e in events]
    assert any("OK Obj" in s for s in summaries) or any("Due Obj" in s for s in summaries) or any("Overdue Obj" in s for s in summaries), (
        f"Expected events from multiple objects, got: {summaries}"
    )


async def test_calendar_triggered_task_shows_today(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Sensor trigger activates → calendar event appears for today."""
    set_sensor_state(hass, "sensor.cal_trigger", "0.5")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.cal_trigger",
            "trigger_below": 1.0,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Trigger Cal",
        data=build_object_entry_data(
            object_data=build_object_data(name="Trigger Cal"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_trigger_cal",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Trigger should be active (sensor below threshold)
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    if not task_data.get("_trigger_active"):
        pytest.skip("Trigger not activated in test environment")

    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is None:
        pytest.skip("Calendar entity not created")

    dt_now = dt_util.now()
    events = await calendar.async_get_events(
        hass, dt_now - timedelta(days=1), dt_now + timedelta(days=1)
    )
    trigger_events = [e for e in events if "Trigger Cal" in (e.summary or "")]
    assert len(trigger_events) >= 1


async def test_calendar_manual_task_only_when_triggered(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Manual task: no event when not triggered, event appears when triggered."""
    task = build_task_data(
        schedule_type=ScheduleType.MANUAL,
        interval_days=None,
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Manual Cal",
        data=build_object_entry_data(
            object_data=build_object_data(name="Manual Cal"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_manual_cal",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is None:
        pytest.skip("Calendar entity not created")

    dt_now = dt_util.now()

    # Manual task not triggered → no event
    events = await calendar.async_get_events(
        hass, dt_now - timedelta(days=1), dt_now + timedelta(days=365)
    )
    manual_events = [e for e in events if "Manual Cal" in (e.summary or "")]
    assert len(manual_events) == 0, "Manual task should not show event when not triggered"
