"""Tests for the notification manager."""

from __future__ import annotations

from datetime import datetime, time
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.util import dt as dt_util

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
from custom_components.maintenance_supporter.helpers.notification_manager import (
    NotificationManager,
)

from .conftest import build_global_entry_data, setup_integration


# ─── Fixtures ────────────────────────────────────────────────────────────


@pytest.fixture
def global_with_notifications(hass: HomeAssistant) -> ConfigEntry:
    """Create global entry with notifications enabled."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(
            notifications_enabled=True,
            notify_service="notify.mobile_app",
        ),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
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


# ─── 10.1 Basic Notification ────────────────────────────────────────────


async def test_notification_sent_on_status_change(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test that notification is sent on status change to DUE_SOON."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    # Mock the hass object on the NM to intercept service calls
    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Filter Cleaning",
            object_name="Pool Pump",
            old_status=MaintenanceStatus.OK,
            new_status=MaintenanceStatus.DUE_SOON,
            days_until_due=3,
            next_due="2024-12-15",
        )

        mock_hass.services.async_call.assert_called_once()
        call_args = mock_hass.services.async_call.call_args
        assert call_args[0][0] == "notify"
        assert call_args[0][1] == "mobile_app"
        assert "Filter Cleaning" in call_args[0][2]["message"]
        assert "Pool Pump" in call_args[0][2]["message"]


async def test_notification_sent_for_overdue(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test notification for overdue status."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Oil Change",
            object_name="Car",
            old_status=MaintenanceStatus.DUE_SOON,
            new_status=MaintenanceStatus.OVERDUE,
            days_until_due=-5,
        )

        mock_hass.services.async_call.assert_called_once()
        assert "Overdue" in mock_hass.services.async_call.call_args[0][2]["title"]


async def test_notification_sent_for_triggered(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test notification for triggered status."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Pressure Check",
            object_name="Pool Pump",
            old_status=MaintenanceStatus.OK,
            new_status=MaintenanceStatus.TRIGGERED,
        )

        mock_hass.services.async_call.assert_called_once()
        assert "Triggered" in mock_hass.services.async_call.call_args[0][2]["title"]


# ─── 10.2 Notifications Not Sent ────────────────────────────────────────


async def test_no_notification_when_disabled(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test no notification when notifications are disabled."""
    await setup_integration(hass, global_config_entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Test",
            object_name="Test Object",
            old_status=MaintenanceStatus.OK,
            new_status=MaintenanceStatus.DUE_SOON,
        )

        mock_hass.services.async_call.assert_not_called()


async def test_no_notification_for_ok_status(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test no notification for OK status."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Test",
            object_name="Test Object",
            old_status=MaintenanceStatus.DUE_SOON,
            new_status=MaintenanceStatus.OK,
        )

        mock_hass.services.async_call.assert_not_called()


# ─── 10.3 Quiet Hours ───────────────────────────────────────────────────


async def test_no_notification_during_quiet_hours(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test no notification during quiet hours (22:00-08:00)."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")

    # Mock _is_quiet_hours to return True
    with patch.object(nm, "_is_quiet_hours", return_value=True):
        with patch.object(nm, "hass") as mock_hass:
            mock_hass.services = MagicMock()
            mock_hass.services.async_call = AsyncMock()
            mock_hass.config_entries = hass.config_entries

            await nm.async_task_status_changed(
                entry_id="test_entry",
                task_id="test_task",
                task_name="Test",
                object_name="Test Object",
                old_status=MaintenanceStatus.OK,
                new_status=MaintenanceStatus.DUE_SOON,
            )

            mock_hass.services.async_call.assert_not_called()


# ─── 10.4 Rate Limiting ─────────────────────────────────────────────────


async def test_rate_limiting(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test that repeated notifications are rate-limited."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        # First notification should be sent
        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Test",
            object_name="Object",
            old_status=MaintenanceStatus.OK,
            new_status=MaintenanceStatus.DUE_SOON,
        )
        assert mock_hass.services.async_call.call_count == 1

        # Second identical notification should be rate-limited
        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Test",
            object_name="Object",
            old_status=MaintenanceStatus.OK,
            new_status=MaintenanceStatus.DUE_SOON,
        )
        # Should still be 1 (rate limited)
        assert mock_hass.services.async_call.call_count == 1


# ─── 10.5 Cleanup ───────────────────────────────────────────────────────


async def test_notification_manager_cleanup(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test that notification manager cleans up properly."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    await nm.async_unload()
    assert len(nm._last_notified) == 0
