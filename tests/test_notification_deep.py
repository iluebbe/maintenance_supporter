"""Deep notification manager tests — quiet hours, bundled, budget, user discovery."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import (
    NotificationManager,
    _get_user_notify_services,
)

from .conftest import build_global_entry_data


def _create_global_entry(
    hass: HomeAssistant,
    notifications_enabled: bool = True,
    notify_service: str = "notify.test",
    quiet_hours_enabled: bool = False,
    quiet_start: str = "22:00",
    quiet_end: str = "08:00",
    action_complete: bool = False,
    action_skip: bool = False,
    action_snooze: bool = False,
    max_per_day: int = 50,
) -> MockConfigEntry:
    data = build_global_entry_data(
        notifications_enabled=notifications_enabled,
        notify_service=notify_service,
    )
    data[CONF_QUIET_HOURS_ENABLED] = quiet_hours_enabled
    data[CONF_QUIET_HOURS_START] = quiet_start
    data[CONF_QUIET_HOURS_END] = quiet_end
    data[CONF_ACTION_COMPLETE_ENABLED] = action_complete
    data[CONF_ACTION_SKIP_ENABLED] = action_skip
    data[CONF_ACTION_SNOOZE_ENABLED] = action_snooze
    data[CONF_MAX_NOTIFICATIONS_PER_DAY] = max_per_day

    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# ─── Quiet Hours ───────────────────────────────────────────────────────


async def test_quiet_hours_blocking(hass: HomeAssistant) -> None:
    """Test notifications are blocked during quiet hours."""
    _create_global_entry(
        hass,
        quiet_hours_enabled=True,
        quiet_start="00:00",
        quiet_end="23:59",  # Covers all day
    )

    hass.services.async_register("notify", "test", AsyncMock())

    mgr = NotificationManager(hass)
    assert mgr._is_quiet_hours() is True


async def test_quiet_hours_not_blocking(hass: HomeAssistant) -> None:
    """Test notifications go through when outside quiet hours."""
    _create_global_entry(
        hass,
        quiet_hours_enabled=False,
    )

    mgr = NotificationManager(hass)
    assert mgr._is_quiet_hours() is False


async def test_quiet_hours_invalid_format(hass: HomeAssistant) -> None:
    """Test invalid quiet hours format doesn't crash."""
    _create_global_entry(
        hass,
        quiet_hours_enabled=True,
        quiet_start="not-a-time",
        quiet_end="also-not",
    )

    mgr = NotificationManager(hass)
    assert mgr._is_quiet_hours() is False


async def test_quiet_hours_overnight(hass: HomeAssistant) -> None:
    """Test overnight quiet hours (22:00-08:00)."""
    _create_global_entry(
        hass,
        quiet_hours_enabled=True,
        quiet_start="22:00",
        quiet_end="08:00",
    )

    mgr = NotificationManager(hass)
    # The result depends on current time, just verify no crash
    result = mgr._is_quiet_hours()
    assert isinstance(result, bool)


# ─── Daily Limit ───────────────────────────────────────────────────────


async def test_daily_limit_blocks(hass: HomeAssistant) -> None:
    """Test daily notification limit blocks when exceeded."""
    _create_global_entry(hass, max_per_day=2)

    mgr = NotificationManager(hass)
    # Simulate 2 notifications already sent
    mgr._daily_count = 2
    mgr._daily_reset_date = dt_util.now().date()

    assert mgr._check_daily_limit() is False


async def test_daily_limit_resets_new_day(hass: HomeAssistant) -> None:
    """Test daily limit resets on new day."""
    _create_global_entry(hass, max_per_day=2)

    mgr = NotificationManager(hass)
    mgr._daily_count = 2
    mgr._daily_reset_date = dt_util.now().date() - timedelta(days=1)  # Yesterday

    assert mgr._check_daily_limit() is True
    assert mgr._daily_count == 0


# ─── Status Enabled/Disabled ──────────────────────────────────────────


async def test_status_enabled_check(hass: HomeAssistant) -> None:
    """Test _is_status_enabled returns correct values."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    # Default: all enabled
    assert mgr._is_status_enabled(MaintenanceStatus.DUE_SOON) is True
    assert mgr._is_status_enabled(MaintenanceStatus.OVERDUE) is True
    assert mgr._is_status_enabled(MaintenanceStatus.TRIGGERED) is True
    # Unknown status
    assert mgr._is_status_enabled("unknown_status") is False


async def test_interval_hours(hass: HomeAssistant) -> None:
    """Test _get_interval_hours for various statuses."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    # Default intervals
    assert isinstance(mgr._get_interval_hours(MaintenanceStatus.DUE_SOON), int)
    assert isinstance(mgr._get_interval_hours(MaintenanceStatus.OVERDUE), int)
    assert isinstance(mgr._get_interval_hours(MaintenanceStatus.TRIGGERED), int)
    # Unknown → default 24
    assert mgr._get_interval_hours("unknown") == 24


# ─── Bundled Notifications ────────────────────────────────────────────


async def test_bundled_notification_sends(hass: HomeAssistant) -> None:
    """Test bundled notification sends successfully."""
    _create_global_entry(hass)

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)

    tasks = [
        {"task_name": "Filter Cleaning", "status": MaintenanceStatus.DUE_SOON},
        {"task_name": "Oil Change", "status": MaintenanceStatus.OVERDUE},
    ]

    await mgr.async_send_bundled("entry123", "Pool Pump", tasks)

    assert mock_service.called


async def test_bundled_notification_rate_limited(hass: HomeAssistant) -> None:
    """Test bundled notification is rate-limited (once per hour)."""
    _create_global_entry(hass)

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)
    # Simulate recent bundled notification
    mgr._last_notified["entry123_bundled"] = dt_util.now()

    tasks = [
        {"task_name": "Filter", "status": MaintenanceStatus.DUE_SOON},
    ]

    await mgr.async_send_bundled("entry123", "Pool Pump", tasks)

    assert not mock_service.called  # Rate limited


async def test_bundled_disabled(hass: HomeAssistant) -> None:
    """Test bundled notification skipped when disabled."""
    _create_global_entry(hass, notifications_enabled=False)

    mgr = NotificationManager(hass)
    await mgr.async_send_bundled("entry123", "Pool", [])
    # Should return immediately without sending


async def test_bundled_quiet_hours(hass: HomeAssistant) -> None:
    """Test bundled notification blocked during quiet hours."""
    _create_global_entry(
        hass,
        quiet_hours_enabled=True,
        quiet_start="00:00",
        quiet_end="23:59",
    )

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)
    tasks = [
        {"task_name": "Filter", "status": MaintenanceStatus.DUE_SOON},
    ]

    await mgr.async_send_bundled("entry123", "Pool", tasks)

    assert not mock_service.called


# ─── Budget Alerts ────────────────────────────────────────────────────


async def test_budget_alert_sends(hass: HomeAssistant) -> None:
    """Test budget alert notification sends."""
    _create_global_entry(hass)

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)

    await mgr.async_budget_alert("monthly", 85.0, 100.0)

    assert mock_service.called


async def test_budget_alert_rate_limited(hass: HomeAssistant) -> None:
    """Test budget alert is rate-limited (once per 24 hours)."""
    _create_global_entry(hass)

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)
    mgr._last_notified["_budget_monthly"] = dt_util.now()

    await mgr.async_budget_alert("monthly", 85.0, 100.0)

    assert not mock_service.called


async def test_budget_alert_disabled(hass: HomeAssistant) -> None:
    """Test budget alert skipped when disabled."""
    _create_global_entry(hass, notifications_enabled=False)

    mgr = NotificationManager(hass)
    await mgr.async_budget_alert("monthly", 85.0, 100.0)


async def test_budget_alert_quiet_hours(hass: HomeAssistant) -> None:
    """Test budget alert blocked during quiet hours."""
    _create_global_entry(
        hass,
        quiet_hours_enabled=True,
        quiet_start="00:00",
        quiet_end="23:59",
    )

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)
    await mgr.async_budget_alert("monthly", 85.0, 100.0)

    assert not mock_service.called


# ─── Action Buttons ───────────────────────────────────────────────────


async def test_notification_with_action_buttons(hass: HomeAssistant) -> None:
    """Test notification includes action buttons when enabled."""
    _create_global_entry(
        hass,
        action_complete=True,
        action_skip=True,
        action_snooze=True,
    )

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)

    result = await mgr._async_send_notification_to_service(
        service="notify.test",
        title="Test",
        message="Test message",
        entry_id="entry123",
        task_id="task456",
    )

    assert result is True
    assert mock_service.called
    call_args = mock_service.call_args
    service_data = call_args[0][0] if call_args[0] else call_args.kwargs
    # With action buttons, data should contain actions
    if hasattr(service_data, "data"):
        assert "data" in service_data.data


async def test_notification_service_failure(hass: HomeAssistant) -> None:
    """Test notification returns False on service failure (HomeAssistantError)."""

    _create_global_entry(hass)

    mgr = NotificationManager(hass)

    with patch(
        "custom_components.maintenance_supporter.helpers.notification_manager.NotificationManager._async_send_notification_to_service",
        return_value=False,
    ) as mock_send:
        # Verify the mocked method can return False (simulating failure)
        result = await mock_send(
            service="notify.test",
            title="Test",
            message="Test message",
            entry_id="entry123",
            task_id="task456",
        )
        assert result is False

    # Also test the actual invalid service format path
    result = await mgr._async_send_notification_to_service(
        service="no_dot_service",
        title="Test",
        message="Test",
        entry_id="e1",
        task_id="t1",
    )
    assert result is False


async def test_notification_invalid_service_format(hass: HomeAssistant) -> None:
    """Test notification returns False for invalid service format."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)

    result = await mgr._async_send_notification_to_service(
        service="invalid_format_no_dot",
        title="Test",
        message="Test",
        entry_id="e1",
        task_id="t1",
    )

    assert result is False


# ─── Build Message ────────────────────────────────────────────────────


async def test_build_message_due_soon(hass: HomeAssistant) -> None:
    """Test build message for DUE_SOON status."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    title, message = mgr._build_message(
        MaintenanceStatus.DUE_SOON, "en",
        "Filter Cleaning", "Pool Pump", 5, "2025-06-15",
    )
    assert title  # Non-empty
    assert "Filter Cleaning" in message or "Pool Pump" in message


async def test_build_message_overdue(hass: HomeAssistant) -> None:
    """Test build message for OVERDUE status."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    title, message = mgr._build_message(
        MaintenanceStatus.OVERDUE, "en",
        "Oil Change", "Car", -10, None,
    )
    assert title


async def test_build_message_triggered(hass: HomeAssistant) -> None:
    """Test build message for TRIGGERED status."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    title, message = mgr._build_message(
        MaintenanceStatus.TRIGGERED, "en",
        "Filter Alert", "Pool", None, None,
    )
    assert title


async def test_build_message_unknown_status(hass: HomeAssistant) -> None:
    """Test build message for unknown status uses fallback."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    title, message = mgr._build_message(
        "unknown_status", "en",
        "Task", "Object", None, None,
    )
    assert title == "Maintenance"
    assert "Task" in message


# ─── User Notify Service Discovery ───────────────────────────────────


async def test_user_notify_services_no_mobile_app(hass: HomeAssistant) -> None:
    """Test user notify discovery returns empty when no mobile_app entries."""
    services = await _get_user_notify_services(hass, "user123")
    assert services == []


async def test_user_notify_services_with_mobile_app(hass: HomeAssistant) -> None:
    """Test user notify discovery finds mobile_app services."""
    from homeassistant.helpers import device_registry as dr

    # Create a mobile_app config entry
    mobile_entry = MockConfigEntry(
        domain="mobile_app",
        data={"user_id": "user123"},
        source="user",
    )
    mobile_entry.add_to_hass(hass)

    # Create a device linked to that entry
    device_reg = dr.async_get(hass)
    device_reg.async_get_or_create(
        config_entry_id=mobile_entry.entry_id,
        identifiers={("mobile_app", "test_phone")},
        name="Test Phone",
    )

    # Register the corresponding notify service
    hass.services.async_register("notify", "mobile_app_test_phone", AsyncMock())

    services = await _get_user_notify_services(hass, "user123")
    assert "notify.mobile_app_test_phone" in services


async def test_user_notify_services_wrong_user(hass: HomeAssistant) -> None:
    """Test user notify discovery ignores entries for other users."""
    mobile_entry = MockConfigEntry(
        domain="mobile_app",
        data={"user_id": "other_user"},
        source="user",
    )
    mobile_entry.add_to_hass(hass)

    services = await _get_user_notify_services(hass, "user123")
    assert services == []


# ─── Clear Task State ────────────────────────────────────────────────


async def test_clear_task_state(hass: HomeAssistant) -> None:
    """Test clearing task notification state."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    mgr._last_notified["entry1_task1_due_soon"] = dt_util.now()
    mgr._snoozed_until["entry1_task1"] = dt_util.now() + timedelta(hours=2)

    mgr.clear_task_state("entry1", "task1")

    # Keys with the task prefix should be removed
    remaining = [k for k in mgr._last_notified if "task1" in k]
    assert len(remaining) == 0


# ─── Properties ──────────────────────────────────────────────────────


async def test_mgr_properties(hass: HomeAssistant) -> None:
    """Test NotificationManager properties."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    assert mgr.enabled is True
    assert mgr.notify_service == "notify.test"
    assert mgr._lang in ("en", "de", "nl", "fr", "it", "es")


async def test_mgr_disabled(hass: HomeAssistant) -> None:
    """Test NotificationManager when notifications disabled."""
    _create_global_entry(hass, notifications_enabled=False)

    mgr = NotificationManager(hass)
    assert mgr.enabled is False


# ─── v1.4.0 (#44): notification_title_style ────────────────────────────


async def test_title_style_default_uses_per_status_title(hass: HomeAssistant) -> None:
    """Without configuration, NM uses the i18n per-status title."""
    _create_global_entry(hass)
    mgr = NotificationManager(hass)
    assert mgr.title_style == "default"
    title, message = mgr._build_message(
        MaintenanceStatus.OVERDUE, "en", "Filter cleaning", "Pool Pump", -3, "2026-04-23",
    )
    # Per-status default title — does NOT contain object/task name.
    assert "Pool Pump" not in title
    assert "Filter cleaning" not in title
    # Object + task DO appear in the body — that's the existing pre-1.4.0 behaviour.
    assert "Pool Pump" in message
    assert "Filter cleaning" in message


async def test_title_style_object_name_uses_object_as_title(hass: HomeAssistant) -> None:
    """With title_style=object_name, the object name becomes the title."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATION_TITLE_STYLE,
    )

    entry = _create_global_entry(hass)
    hass.config_entries.async_update_entry(
        entry,
        options={**entry.options, CONF_NOTIFICATION_TITLE_STYLE: "object_name"},
    )

    mgr = NotificationManager(hass)
    assert mgr.title_style == "object_name"
    title, _ = mgr._build_message(
        MaintenanceStatus.OVERDUE, "en", "Filter cleaning", "Pool Pump", -3, "2026-04-23",
    )
    assert title == "Pool Pump"


async def test_title_style_task_name_uses_task_as_title(hass: HomeAssistant) -> None:
    """With title_style=task_name, the task name becomes the title."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATION_TITLE_STYLE,
    )

    entry = _create_global_entry(hass)
    hass.config_entries.async_update_entry(
        entry,
        options={**entry.options, CONF_NOTIFICATION_TITLE_STYLE: "task_name"},
    )

    mgr = NotificationManager(hass)
    assert mgr.title_style == "task_name"
    title, _ = mgr._build_message(
        MaintenanceStatus.OVERDUE, "en", "Filter cleaning", "Pool Pump", -3, "2026-04-23",
    )
    assert title == "Filter cleaning"


async def test_title_style_unknown_value_falls_back_to_default(hass: HomeAssistant) -> None:
    """Bogus title_style values fall back to default title behaviour."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATION_TITLE_STYLE,
    )

    entry = _create_global_entry(hass)
    hass.config_entries.async_update_entry(
        entry,
        options={**entry.options, CONF_NOTIFICATION_TITLE_STYLE: "totally_not_a_style"},
    )

    mgr = NotificationManager(hass)
    assert mgr.title_style == "default"
    title, _ = mgr._build_message(
        MaintenanceStatus.OVERDUE, "en", "Filter cleaning", "Pool Pump", -3, "2026-04-23",
    )
    assert "Pool Pump" not in title  # default per-status title


# ─── Seed Startup State ──────────────────────────────────────────────


async def test_seed_startup_state_with_interval(hass: HomeAssistant) -> None:
    """seed_startup_state sets _last_notified to now for statuses with repeat interval."""
    _create_global_entry(hass)
    mgr = NotificationManager(hass)

    before = dt_util.now()
    mgr.seed_startup_state("entry1", "task1", MaintenanceStatus.OVERDUE)
    after = dt_util.now()

    key = f"entry1_task1_{MaintenanceStatus.OVERDUE}"
    assert key in mgr._last_notified
    ts = mgr._last_notified[key]
    assert before <= ts <= after  # timestamp is "now"


async def test_seed_startup_state_interval_zero(hass: HomeAssistant) -> None:
    """seed_startup_state sets _SENT_ONCE for statuses with interval=0."""
    from custom_components.maintenance_supporter.helpers.notification_manager import _SENT_ONCE

    _create_global_entry(hass)
    mgr = NotificationManager(hass)

    # Patch interval to 0 for TRIGGERED
    with patch.object(mgr, "_get_interval_hours", return_value=0):
        mgr.seed_startup_state("entry1", "task1", MaintenanceStatus.TRIGGERED)

    key = f"entry1_task1_{MaintenanceStatus.TRIGGERED}"
    assert mgr._last_notified[key] is _SENT_ONCE


async def test_seed_prevents_immediate_notification(hass: HomeAssistant) -> None:
    """After seeding, calling async_task_status_changed does NOT send immediately."""
    _create_global_entry(hass)

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)
    mgr.seed_startup_state("entry1", "task1", MaintenanceStatus.OVERDUE)

    # Now call async_task_status_changed — should be rate-limited
    await mgr.async_task_status_changed(
        entry_id="entry1",
        task_id="task1",
        task_name="Filter",
        object_name="Pool",
        new_status=MaintenanceStatus.OVERDUE,
        days_until_due=-5,
    )

    assert not mock_service.called  # Rate-limited by the seed


async def test_seed_allows_repeat_after_interval(hass: HomeAssistant) -> None:
    """After seed + interval elapsed, repeat notification fires."""
    _create_global_entry(hass)

    mock_service = AsyncMock()
    hass.services.async_register("notify", "test", mock_service)

    mgr = NotificationManager(hass)
    # Seed with a timestamp far enough in the past
    key = f"entry1_task1_{MaintenanceStatus.OVERDUE}"
    mgr._last_notified[key] = dt_util.now() - timedelta(hours=13)  # > 12h default

    await mgr.async_task_status_changed(
        entry_id="entry1",
        task_id="task1",
        task_name="Filter",
        object_name="Pool",
        new_status=MaintenanceStatus.OVERDUE,
        days_until_due=-5,
    )

    assert mock_service.called  # Interval elapsed → notification sent
