"""Tests for correct old_status in notification status transitions.

Regression test for the bug where _previous_statuses was updated BEFORE
old_status was read, causing old_status == new_status in all notifications.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

NOTIFICATION_MANAGER_KEY = "_notification_manager"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
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
            CONF_NOTIFY_DUE_SOON_ENABLED: True,
            CONF_NOTIFY_DUE_SOON_INTERVAL: 24,
            CONF_NOTIFY_OVERDUE_ENABLED: True,
            CONF_NOTIFY_OVERDUE_INTERVAL: 12,
            CONF_NOTIFY_TRIGGERED_ENABLED: True,
            CONF_NOTIFY_TRIGGERED_INTERVAL: 4,
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_QUIET_HOURS_START: "22:00",
            CONF_QUIET_HOURS_END: "08:00",
        },
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_notif_trans",
    )
    entry.add_to_hass(hass)
    return entry


async def test_old_status_correct_on_first_transition(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test first notification sends correctly (task never seen before)."""
    await setup_integration(hass, global_entry, object_entry)

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Reset previous statuses to simulate fresh start
    coordinator._previous_statuses = {}

    # Patch the real notification manager's method
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    mock_notify = AsyncMock()

    with patch.object(nm, "async_task_status_changed", mock_notify):
        await coordinator._async_notify_status_changes({
            TASK_ID_1: {
                "name": "Filter Cleaning",
                "_status": MaintenanceStatus.DUE_SOON,
                "_days_until_due": 5,
                "_next_due": "2026-03-07",
            }
        })

    # Notification should have been sent
    mock_notify.assert_called_once()
    call_kwargs = mock_notify.call_args.kwargs
    assert call_kwargs["new_status"] == MaintenanceStatus.DUE_SOON


async def test_old_status_correct_on_second_transition(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test that _previous_statuses is updated correctly after notification.

    Regression test: _previous_statuses must be updated AFTER the notification
    is sent, not before.
    """
    await setup_integration(hass, global_entry, object_entry)

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Simulate that the task was previously "ok"
    coordinator._previous_statuses = {TASK_ID_1: MaintenanceStatus.OK}

    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    mock_notify = AsyncMock()

    with patch.object(nm, "async_task_status_changed", mock_notify):
        await coordinator._async_notify_status_changes({
            TASK_ID_1: {
                "name": "Filter Cleaning",
                "_status": MaintenanceStatus.DUE_SOON,
                "_days_until_due": 5,
                "_next_due": "2026-03-07",
            }
        })

    # Notification should have been sent with the correct new_status
    mock_notify.assert_called_once()
    call_kwargs = mock_notify.call_args.kwargs
    assert call_kwargs["new_status"] == MaintenanceStatus.DUE_SOON

    # After notification, _previous_statuses should be updated
    assert coordinator._previous_statuses[TASK_ID_1] == MaintenanceStatus.DUE_SOON


async def test_old_status_due_soon_to_overdue(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test due_soon -> overdue transition sends overdue notification."""
    await setup_integration(hass, global_entry, object_entry)

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    coordinator._previous_statuses = {TASK_ID_1: MaintenanceStatus.DUE_SOON}

    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    mock_notify = AsyncMock()

    with patch.object(nm, "async_task_status_changed", mock_notify):
        await coordinator._async_notify_status_changes({
            TASK_ID_1: {
                "name": "Filter Cleaning",
                "_status": MaintenanceStatus.OVERDUE,
                "_days_until_due": -2,
                "_next_due": "2026-02-28",
            }
        })

    mock_notify.assert_called_once()
    call_kwargs = mock_notify.call_args.kwargs
    assert call_kwargs["new_status"] == MaintenanceStatus.OVERDUE

    # _previous_statuses should be updated after notification
    assert coordinator._previous_statuses[TASK_ID_1] == MaintenanceStatus.OVERDUE


async def test_previous_statuses_updated_when_no_notifiable(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test that _previous_statuses is updated even when no notifications sent."""
    await setup_integration(hass, global_entry, object_entry)

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    coordinator._previous_statuses = {}

    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    mock_notify = AsyncMock()

    with patch.object(nm, "async_task_status_changed", mock_notify):
        # "ok" is not a notifiable status, so no notification sent
        await coordinator._async_notify_status_changes({
            TASK_ID_1: {
                "name": "Filter Cleaning",
                "_status": MaintenanceStatus.OK,
                "_days_until_due": 25,
            }
        })

    # No notification should have been sent
    mock_notify.assert_not_called()

    # But the cache should still be updated
    assert coordinator._previous_statuses[TASK_ID_1] == MaintenanceStatus.OK


async def test_cache_not_updated_before_notification_sent(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test that _previous_statuses is updated AFTER notification, not before."""
    await setup_integration(hass, global_entry, object_entry)

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    coordinator._previous_statuses = {TASK_ID_1: MaintenanceStatus.OK}

    captured_cache_at_call: list[str | None] = []

    async def _capture_cache(**kwargs: Any) -> None:
        # Capture what _previous_statuses holds at the moment of the call.
        # Before the fix, this would already be "overdue". After the fix,
        # it should still be "ok" (not yet updated).
        captured_cache_at_call.append(
            coordinator._previous_statuses.get(TASK_ID_1)
        )

    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    with patch.object(nm, "async_task_status_changed", AsyncMock(side_effect=_capture_cache)):
        await coordinator._async_notify_status_changes({
            TASK_ID_1: {
                "name": "Filter Cleaning",
                "_status": MaintenanceStatus.OVERDUE,
                "_days_until_due": -1,
                "_next_due": "2026-03-01",
            }
        })

    # At call time, cache should still hold the OLD value
    assert captured_cache_at_call == [MaintenanceStatus.OK]
    # After return, cache is updated to the new value
    assert coordinator._previous_statuses[TASK_ID_1] == MaintenanceStatus.OVERDUE
