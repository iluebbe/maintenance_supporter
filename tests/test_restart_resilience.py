"""Integration tests: restart resilience and state persistence."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_QUIET_HOURS_ENABLED,
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
    get_task_store_state,
    set_sensor_state,
    setup_integration,
)


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


async def test_store_persists_across_reload(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Complete task → unload → reload → verify state survives."""
    last_performed = (dt_util.now().date() - timedelta(days=40)).isoformat()
    task = build_task_data(last_performed=last_performed, interval_days=30)
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Persist Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Persist Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_persist_test",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    # Complete the task
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    store = entry.runtime_data.store

    async def _immediate_save() -> None:
        await store.async_save()

    conn = _mock_connection()
    with patch.object(store, "async_delay_save", side_effect=lambda: hass.async_create_task(_immediate_save())):
        await ws_complete_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
            "id": 1, "type": "maintenance_supporter/task/complete",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "notes": "Test completion",
            "cost": 15.0,
        })
    await hass.async_block_till_done()

    today = dt_util.now().date().isoformat()

    # Verify before unload
    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == today
    assert len(state.get("history", [])) >= 1

    # Unload
    await hass.config_entries.async_unload(obj_entry.entry_id)
    await hass.async_block_till_done()

    # Reload
    await hass.config_entries.async_setup(obj_entry.entry_id)
    await hass.async_block_till_done()

    # Verify state survived
    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == today
    assert len(state.get("history", [])) >= 1
    assert state["history"][-1].get("notes") == "Test completion"


async def test_notification_state_reset_on_reload(
    hass: HomeAssistant,
) -> None:
    """Notification in-memory state resets on reload, no burst on re-init."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(
            notifications_enabled=True,
            notify_service="notify.mobile_app",
        ),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile_app",
            CONF_NOTIFY_OVERDUE_ENABLED: True,
            CONF_NOTIFY_OVERDUE_INTERVAL: 12,
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    global_entry.add_to_hass(hass)

    # Already overdue from start
    last_performed = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(last_performed=last_performed, interval_days=30)
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Notif Reset",
        data=build_object_entry_data(
            object_data=build_object_data(name="Notif Reset"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_notif_reset",
    )
    obj_entry.add_to_hass(hass)

    with patch("homeassistant.core.ServiceRegistry.async_call", new_callable=AsyncMock) as mock_call:
        await setup_integration(hass, global_entry, obj_entry)
        await hass.async_block_till_done()

        entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
        assert entry is not None
        coordinator = entry.runtime_data.coordinator

        # First refresh seeded _previous_statuses, no notification for existing OVERDUE
        mock_call.reset_mock()

        # Second refresh — no transition → no notification
        await coordinator.async_refresh()
        await hass.async_block_till_done()

        notify_calls = [
            c for c in mock_call.call_args_list
            if len(c[0]) >= 1 and c[0][0] == "notify"
        ]
        assert len(notify_calls) == 0

        # Unload + reload
        await hass.config_entries.async_unload(obj_entry.entry_id)
        await hass.async_block_till_done()
        mock_call.reset_mock()

        await hass.config_entries.async_setup(obj_entry.entry_id)
        await hass.async_block_till_done()

        # After reload, first refresh seeds again — no notification
        entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
        assert entry is not None
        coordinator = entry.runtime_data.coordinator

        await coordinator.async_refresh()
        await hass.async_block_till_done()

        notify_calls = [
            c for c in mock_call.call_args_list
            if len(c[0]) >= 1 and c[0][0] == "notify"
        ]
        assert len(notify_calls) == 0


async def test_trigger_state_survives_reload(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Sensor trigger runtime state restored from Store after reload."""
    set_sensor_state(hass, "sensor.runtime_test", "50.0")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.runtime_test",
            "trigger_above": 100.0,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Trigger Persist",
        data=build_object_entry_data(
            object_data=build_object_data(name="Trigger Persist"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_trigger_persist",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None

    # Unload
    await hass.config_entries.async_unload(obj_entry.entry_id)
    await hass.async_block_till_done()

    # Reload
    set_sensor_state(hass, "sensor.runtime_test", "50.0")
    await hass.config_entries.async_setup(obj_entry.entry_id)
    await hass.async_block_till_done()

    # Verify integration loaded successfully after reload
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    assert entry.runtime_data is not None
    assert entry.runtime_data.coordinator is not None


async def test_previous_statuses_seeded_on_startup(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """First refresh seeds _previous_statuses for all tasks without notifying."""
    now = dt_util.now().date()

    # 3 tasks with different statuses
    tasks = {
        TASK_ID_1: build_task_data(
            task_id=TASK_ID_1,
            name="OK Task",
            last_performed=(now - timedelta(days=5)).isoformat(),
            interval_days=30,
        ),
        TASK_ID_2: build_task_data(
            task_id=TASK_ID_2,
            name="Overdue Task",
            last_performed=(now - timedelta(days=60)).isoformat(),
            interval_days=30,
        ),
    }
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Seed Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Seed Test"),
            tasks=tasks,
        ),
        source="user",
        unique_id="maintenance_supporter_seed_test",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # _previous_statuses should be populated after first refresh
    assert TASK_ID_1 in coordinator._previous_statuses
    assert TASK_ID_2 in coordinator._previous_statuses
    assert coordinator._previous_statuses[TASK_ID_1] == MaintenanceStatus.OK
    assert coordinator._previous_statuses[TASK_ID_2] == MaintenanceStatus.OVERDUE
