"""Tests for the notification manager."""

from __future__ import annotations

from datetime import datetime, time, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
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
    CONF_SNOOZE_DURATION_HOURS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import (
    NotificationManager,
    _notif_t,
)

from .conftest import build_global_entry_data, setup_integration


# ─── Fixtures ────────────────────────────────────────────────────────────


@pytest.fixture
def global_with_notifications(hass: HomeAssistant) -> MockConfigEntry:
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
            new_status=MaintenanceStatus.DUE_SOON,
        )
        assert mock_hass.services.async_call.call_count == 1

        # Second identical notification should be rate-limited
        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Test",
            object_name="Object",
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


# ─── Snooze Tests ──────────────────────────────────────────────────────


async def test_snooze_suppresses_notification(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test that snoozed task does not receive notifications."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    # Snooze the task
    nm.snooze_task("test_entry", "test_task")

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Snoozed Task",
            object_name="Object",
            new_status=MaintenanceStatus.DUE_SOON,
        )

        mock_hass.services.async_call.assert_not_called()


async def test_snooze_expired_allows_notification(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test that expired snooze allows notifications again."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    # Snooze the task, then set snooze time to the past
    nm.snooze_task("test_entry", "test_task")
    past = dt_util.now() - timedelta(hours=1)
    for key in list(nm._snoozed_until.keys()):
        nm._snoozed_until[key] = past

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="test_entry",
            task_id="test_task",
            task_name="Expired Snooze",
            object_name="Object",
            new_status=MaintenanceStatus.DUE_SOON,
        )

        mock_hass.services.async_call.assert_called_once()


# ─── Daily Limit Tests ─────────────────────────────────────────────────


def _make_global_with_limit(
    hass: HomeAssistant,
    max_per_day: int = 2,
) -> MockConfigEntry:
    """Create global entry with daily limit."""
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
            CONF_NOTIFY_DUE_SOON_INTERVAL: 0,
            CONF_NOTIFY_OVERDUE_ENABLED: True,
            CONF_NOTIFY_OVERDUE_INTERVAL: 0,
            CONF_NOTIFY_TRIGGERED_ENABLED: True,
            CONF_NOTIFY_TRIGGERED_INTERVAL: 0,
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_MAX_NOTIFICATIONS_PER_DAY: max_per_day,
        },
    )
    entry.add_to_hass(hass)
    return entry


async def test_daily_limit_blocks(
    hass: HomeAssistant,
) -> None:
    """Test that daily limit blocks further notifications."""
    entry = _make_global_with_limit(hass, max_per_day=1)
    await setup_integration(hass, entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        # First notification sends
        await nm.async_task_status_changed(
            entry_id="e1", task_id="t1",
            task_name="Task 1", object_name="Obj",
            new_status=MaintenanceStatus.DUE_SOON,
        )
        assert mock_hass.services.async_call.call_count == 1

        # Second notification blocked by daily limit
        await nm.async_task_status_changed(
            entry_id="e2", task_id="t2",
            task_name="Task 2", object_name="Obj",
            new_status=MaintenanceStatus.OVERDUE,
        )
        assert mock_hass.services.async_call.call_count == 1


async def test_daily_limit_resets_new_day(
    hass: HomeAssistant,
) -> None:
    """Test that daily limit resets on new day."""
    entry = _make_global_with_limit(hass, max_per_day=1)
    await setup_integration(hass, entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    # Simulate that the limit was reached yesterday
    nm._daily_count = 1
    nm._daily_reset_date = (dt_util.now() - timedelta(days=1)).date()

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="e1", task_id="t1",
            task_name="New Day", object_name="Obj",
            new_status=MaintenanceStatus.DUE_SOON,
        )

        mock_hass.services.async_call.assert_called_once()


# ─── Status-Specific Enable/Disable ───────────────────────────────────


def _make_global_with_status_disabled(
    hass: HomeAssistant,
    due_soon_enabled: bool = True,
    overdue_enabled: bool = True,
) -> MockConfigEntry:
    """Create global entry with specific status notifications disabled."""
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
            CONF_NOTIFY_DUE_SOON_ENABLED: due_soon_enabled,
            CONF_NOTIFY_DUE_SOON_INTERVAL: 24,
            CONF_NOTIFY_OVERDUE_ENABLED: overdue_enabled,
            CONF_NOTIFY_OVERDUE_INTERVAL: 12,
            CONF_NOTIFY_TRIGGERED_ENABLED: True,
            CONF_NOTIFY_TRIGGERED_INTERVAL: 4,
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    entry.add_to_hass(hass)
    return entry


async def test_due_soon_disabled(hass: HomeAssistant) -> None:
    """Test that DUE_SOON notifications are skipped when disabled."""
    entry = _make_global_with_status_disabled(hass, due_soon_enabled=False)
    await setup_integration(hass, entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="e1", task_id="t1",
            task_name="Task", object_name="Obj",
            new_status=MaintenanceStatus.DUE_SOON,
        )

        mock_hass.services.async_call.assert_not_called()


async def test_overdue_disabled(hass: HomeAssistant) -> None:
    """Test that OVERDUE notifications are skipped when disabled."""
    entry = _make_global_with_status_disabled(hass, overdue_enabled=False)
    await setup_integration(hass, entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="e1", task_id="t1",
            task_name="Task", object_name="Obj",
            new_status=MaintenanceStatus.OVERDUE,
        )

        mock_hass.services.async_call.assert_not_called()


# ─── Interval Zero (Send Once) ────────────────────────────────────────


async def test_interval_zero_sends_once(
    hass: HomeAssistant,
) -> None:
    """Test interval=0 sends once and never repeats."""
    entry = _make_global_with_limit(hass, max_per_day=10)
    await setup_integration(hass, entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        # First notification sends (interval=0 from fixture)
        await nm.async_task_status_changed(
            entry_id="e1", task_id="t1",
            task_name="Once Only", object_name="Obj",
            new_status=MaintenanceStatus.DUE_SOON,
        )
        assert mock_hass.services.async_call.call_count == 1

        # Second attempt is suppressed (sent once = never repeat)
        await nm.async_task_status_changed(
            entry_id="e1", task_id="t1",
            task_name="Once Only", object_name="Obj",
            new_status=MaintenanceStatus.DUE_SOON,
        )
        assert mock_hass.services.async_call.call_count == 1


# ─── Bundled Notifications ─────────────────────────────────────────────


async def test_bundled_notification(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test bundled notification for multiple tasks."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        tasks = [
            {"task_name": "Filter", "status": MaintenanceStatus.OVERDUE},
            {"task_name": "Oil", "status": MaintenanceStatus.DUE_SOON},
        ]

        await nm.async_send_bundled(
            entry_id="e1",
            object_name="Pool Pump",
            tasks=tasks,
        )

        mock_hass.services.async_call.assert_called_once()
        call_data = mock_hass.services.async_call.call_args[0][2]
        assert "2 tasks" in call_data["title"]
        assert "Filter" in call_data["message"]
        assert "Oil" in call_data["message"]


async def test_bundled_rate_limited(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test bundled notification rate limited within 1 hour."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    tasks = [{"task_name": "T1", "status": MaintenanceStatus.OVERDUE}]

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        # First bundle sends
        await nm.async_send_bundled(entry_id="e1", object_name="Obj", tasks=tasks)
        assert mock_hass.services.async_call.call_count == 1

        # Second bundle within 1h is rate limited
        await nm.async_send_bundled(entry_id="e1", object_name="Obj", tasks=tasks)
        assert mock_hass.services.async_call.call_count == 1


# ─── Budget Alert Tests ───────────────────────────────────────────────


async def test_budget_alert_monthly(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test monthly budget alert notification."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_budget_alert(period="monthly", spent=90.0, budget=100.0)

        mock_hass.services.async_call.assert_called_once()
        call_data = mock_hass.services.async_call.call_args[0][2]
        assert "Budget" in call_data["title"]
        assert "90" in call_data["message"]


async def test_budget_alert_yearly(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test yearly budget alert notification."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_budget_alert(period="yearly", spent=950.0, budget=1000.0)

        mock_hass.services.async_call.assert_called_once()
        call_data = mock_hass.services.async_call.call_args[0][2]
        assert "95%" in call_data["message"]


async def test_budget_alert_rate_limited_24h(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test budget alert rate limited to once per 24h per period."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        # First alert sends
        await nm.async_budget_alert(period="monthly", spent=90.0, budget=100.0)
        assert mock_hass.services.async_call.call_count == 1

        # Second alert within 24h is rate limited
        await nm.async_budget_alert(period="monthly", spent=95.0, budget=100.0)
        assert mock_hass.services.async_call.call_count == 1


# ─── Action Buttons ───────────────────────────────────────────────────


def _make_global_with_actions(hass: HomeAssistant) -> MockConfigEntry:
    """Create global entry with action buttons enabled."""
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
            CONF_ACTION_COMPLETE_ENABLED: True,
            CONF_ACTION_SKIP_ENABLED: True,
            CONF_ACTION_SNOOZE_ENABLED: True,
        },
    )
    entry.add_to_hass(hass)
    return entry


async def test_action_buttons_included(hass: HomeAssistant) -> None:
    """Test that action buttons are included in notification data."""
    entry = _make_global_with_actions(hass)
    await setup_integration(hass, entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await nm.async_task_status_changed(
            entry_id="e1", task_id="t1",
            task_name="Filter", object_name="Pump",
            new_status=MaintenanceStatus.DUE_SOON,
            days_until_due=3,
        )

        mock_hass.services.async_call.assert_called_once()
        call_data = mock_hass.services.async_call.call_args[0][2]
        assert "data" in call_data
        actions = call_data["data"]["actions"]
        assert len(actions) == 3
        action_names = [a["action"] for a in actions]
        assert any("COMPLETE" in a for a in action_names)
        assert any("SKIP" in a for a in action_names)
        assert any("SNOOZE" in a for a in action_names)


# ─── User-Targeted Notifications ──────────────────────────────────────


async def test_user_targeted_notification(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test that responsible_user_id routes to user's service."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        with patch(
            "custom_components.maintenance_supporter.helpers.notification_manager._get_user_notify_services",
            return_value=["notify.mobile_app_user_phone"],
        ):
            await nm.async_task_status_changed(
                entry_id="e1", task_id="t1",
                task_name="User Task", object_name="Obj",
                new_status=MaintenanceStatus.DUE_SOON,
                responsible_user_id="user123",
            )

            mock_hass.services.async_call.assert_called_once()
            call_args = mock_hass.services.async_call.call_args
            assert call_args[0][1] == "mobile_app_user_phone"


async def test_user_fallback_to_global(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test that missing user service falls back to global service."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        with patch(
            "custom_components.maintenance_supporter.helpers.notification_manager._get_user_notify_services",
            return_value=[],
        ):
            await nm.async_task_status_changed(
                entry_id="e1", task_id="t1",
                task_name="Fallback", object_name="Obj",
                new_status=MaintenanceStatus.DUE_SOON,
                responsible_user_id="user123",
            )

            mock_hass.services.async_call.assert_called_once()
            call_args = mock_hass.services.async_call.call_args
            # Falls back to global "notify.mobile_app"
            assert call_args[0][1] == "mobile_app"


# ─── Message Building ─────────────────────────────────────────────────


def test_build_message_overdue() -> None:
    """Test overdue message is correctly built."""
    nm = NotificationManager.__new__(NotificationManager)
    title, message = nm._build_message(
        MaintenanceStatus.OVERDUE, "en",
        "Oil Change", "Car", -5, None,
    )
    assert title == "Maintenance Overdue!"
    assert "Oil Change" in message
    assert "Car" in message
    assert "5" in message


def test_build_message_triggered() -> None:
    """Test triggered message is correctly built."""
    nm = NotificationManager.__new__(NotificationManager)
    title, message = nm._build_message(
        MaintenanceStatus.TRIGGERED, "en",
        "Pressure Check", "Pump", None, None,
    )
    assert title == "Maintenance Triggered"
    assert "Pressure Check" in message
    assert "sensor" in message.lower()


def test_build_message_german() -> None:
    """Test German translation of notification messages."""
    nm = NotificationManager.__new__(NotificationManager)
    title, message = nm._build_message(
        MaintenanceStatus.DUE_SOON, "de",
        "Filterwechsel", "Pumpe", 3, "2024-12-15",
    )
    assert title == "Wartung bald fällig"
    assert "Filterwechsel" in message
    assert "Pumpe" in message
    assert "3" in message


def test_notif_t_fallback_to_english() -> None:
    """Test that unknown language falls back to English."""
    result = _notif_t("due_soon_title", "xx")
    assert result == "Maintenance Due Soon"


# ─── Clear Task State ──────────────────────────────────────────────────


def test_clear_task_state() -> None:
    """Test that clear_task_state removes notification tracking."""
    nm = NotificationManager.__new__(NotificationManager)
    nm._last_notified = {
        "e1_t1_due_soon": dt_util.now(),
        "e1_t1_overdue": dt_util.now(),
        "e1_t1_triggered": dt_util.now(),
        "e2_t2_due_soon": dt_util.now(),
    }
    nm._snoozed_until = {
        "e1_t1_due_soon": dt_util.now() + timedelta(hours=1),
    }

    nm.clear_task_state("e1", "t1")

    # All e1_t1 keys should be removed
    assert "e1_t1_due_soon" not in nm._last_notified
    assert "e1_t1_overdue" not in nm._last_notified
    assert "e1_t1_triggered" not in nm._last_notified
    assert "e1_t1_due_soon" not in nm._snoozed_until

    # Other task keys should remain
    assert "e2_t2_due_soon" in nm._last_notified


# ─── Service Failure Handling ──────────────────────────────────────────


async def test_service_failure_handled(
    hass: HomeAssistant,
    global_with_notifications: ConfigEntry,
) -> None:
    """Test that service call exception is caught gracefully."""
    await setup_integration(hass, global_with_notifications)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    with patch.object(nm, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock(
            side_effect=HomeAssistantError("Service not found")
        )
        mock_hass.config_entries = hass.config_entries

        # Should not raise
        await nm.async_task_status_changed(
            entry_id="e1", task_id="t1",
            task_name="Failing", object_name="Obj",
            new_status=MaintenanceStatus.DUE_SOON,
        )

        # Service was called but failed - notification should not be tracked
        mock_hass.services.async_call.assert_called_once()
        # Key should NOT be in last_notified since send failed
        key = "e1_t1_due_soon"
        assert key not in nm._last_notified
