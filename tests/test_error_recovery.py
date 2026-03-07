"""Integration tests: error recovery and graceful degradation."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
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
    TriggerEntityState,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    set_sensor_state,
    setup_integration,
)


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


async def test_notify_service_unavailable(
    hass: HomeAssistant,
) -> None:
    """Notify service raises error → caught, no crash."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(
            notifications_enabled=True,
            notify_service="notify.nonexistent",
        ),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.nonexistent",
            CONF_NOTIFY_OVERDUE_ENABLED: True,
            CONF_NOTIFY_OVERDUE_INTERVAL: 12,
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    global_entry.add_to_hass(hass)

    # Start with OK, then make it transition to OVERDUE
    last_performed = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(last_performed=last_performed, interval_days=30)
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Notify Fail",
        data=build_object_entry_data(
            object_data=build_object_data(name="Notify Fail"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_notify_fail",
    )
    obj_entry.add_to_hass(hass)

    # Service call will raise
    async def _raise(*args: Any, **kwargs: Any) -> None:
        raise HomeAssistantError("Service not found")

    with patch("homeassistant.core.ServiceRegistry.async_call", side_effect=_raise):
        await setup_integration(hass, global_entry, obj_entry)

        entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
        assert entry is not None
        coordinator = entry.runtime_data.coordinator

        # Make task overdue via store
        store = entry.runtime_data.store
        old_date = (dt_util.now().date() - timedelta(days=60)).isoformat()
        store.set_last_performed(TASK_ID_1, old_date)

        # This should NOT crash even though notify service fails
        await coordinator.async_refresh()
        await hass.async_block_till_done()

        # Coordinator still works
        assert coordinator.data is not None
        assert coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.OVERDUE


async def test_trigger_entity_disappears(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Sensor entity removed mid-operation → graceful handling."""
    set_sensor_state(hass, "sensor.disappearing", "25.0")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.disappearing",
            "trigger_above": 50.0,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Disappear Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Disappear Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_disappear",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Normal operation
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # Remove the entity
    hass.states.async_remove("sensor.disappearing")

    # Should not crash
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert coordinator.data is not None


async def test_trigger_entity_unavailable(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Sensor state='unavailable' → trigger not activated."""
    set_sensor_state(hass, "sensor.flaky", "0.5")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.flaky",
            "trigger_below": 1.0,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Unavailable Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Unavailable Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_unavailable",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Set to unavailable
    hass.states.async_set("sensor.flaky", "unavailable")
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    # Should not be triggered when entity is unavailable
    assert task_data.get("_trigger_active") is not True


async def test_store_missing_on_reload(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Store file deleted → reload → Store re-initializes, no crash."""
    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        interval_days=30,
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Store Missing",
        data=build_object_entry_data(
            object_data=build_object_data(name="Store Missing"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_store_missing",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    # Unload
    await hass.config_entries.async_unload(obj_entry.entry_id)
    await hass.async_block_till_done()

    # Delete store file (simulate corruption/loss)
    import os
    store_path = hass.config.path(f".storage/maintenance_supporter.{obj_entry.entry_id}")
    if os.path.exists(store_path):
        os.remove(store_path)

    # Reload — should not crash
    await hass.config_entries.async_setup(obj_entry.entry_id)
    await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    assert entry.runtime_data is not None
    assert entry.runtime_data.store is not None


async def test_calendar_with_no_tasks(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Object with 0 tasks → calendar returns empty events."""
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Empty Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Empty Object"),
            tasks={},
        ),
        source="user",
        unique_id="maintenance_supporter_empty_cal",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    # Calendar entity should exist and not crash
    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is not None:
        now = dt_util.now()
        events = await calendar.async_get_events(
            hass, now, now + timedelta(days=365)
        )
        # Should be empty list, not an error
        assert isinstance(events, list)


async def test_threshold_trigger_non_numeric_state(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Sensor returns 'unknown' → no ValueError, trigger not activated."""
    hass.states.async_set("sensor.bad_data", "unknown")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.bad_data",
            "trigger_above": 50.0,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Bad Data Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Bad Data Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_bad_data",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Should not crash with non-numeric state
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is not True
