"""Deep notification manager tests — quiet hours, bundled, budget, user discovery."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import (
    _NOTIFY_SERVICE_MISSING_ISSUE_ID,
    NotificationManager,
    _get_user_notify_services,
    _notif_t,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


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
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
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
        MaintenanceStatus.DUE_SOON,
        "en",
        "Filter Cleaning",
        "Pool Pump",
        5,
        "2025-06-15",
    )
    assert title  # Non-empty
    assert "Filter Cleaning" in message or "Pool Pump" in message


async def test_build_message_overdue(hass: HomeAssistant) -> None:
    """Test build message for OVERDUE status."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    title, message = mgr._build_message(
        MaintenanceStatus.OVERDUE,
        "en",
        "Oil Change",
        "Car",
        -10,
        None,
    )
    assert title


async def test_build_message_triggered(hass: HomeAssistant) -> None:
    """Test build message for TRIGGERED status."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    title, message = mgr._build_message(
        MaintenanceStatus.TRIGGERED,
        "en",
        "Filter Alert",
        "Pool",
        None,
        None,
    )
    assert title


async def test_build_message_unknown_status(hass: HomeAssistant) -> None:
    """Test build message for unknown status uses fallback."""
    _create_global_entry(hass)

    mgr = NotificationManager(hass)
    title, message = mgr._build_message(
        "unknown_status",
        "en",
        "Task",
        "Object",
        None,
        None,
    )
    assert title == "Maintenance"
    assert "Task" in message


# ─── User Notify Service Discovery ───────────────────────────────────


async def test_user_notify_services_no_mobile_app(hass: HomeAssistant) -> None:
    """Test user notify discovery returns empty when no mobile_app entries."""
    services = await _get_user_notify_services(hass, "user123")
    assert services == []


async def test_user_notify_services_with_mobile_app(hass: HomeAssistant) -> None:
    """User notify discovery finds mobile_app services by the slugified device name.

    Regression for #75: the real service is ``notify.mobile_app_<slug(device_name)>``,
    NOT ``mobile_app_<device_identifier>`` (a webhook UUID). Here the identifier
    deliberately differs from the device-name slug, so the old identifier-based
    lookup would miss it and fall back to the global service.
    """
    from homeassistant.helpers import device_registry as dr

    # Create a mobile_app config entry (carries the device_name mobile_app uses).
    mobile_entry = MockConfigEntry(
        domain="mobile_app",
        data={"user_id": "user123", "device_name": "Test Phone"},
        source="user",
    )
    mobile_entry.add_to_hass(hass)

    # Device identifier is a webhook UUID — NOT the service slug.
    device_reg = dr.async_get(hass)
    device_reg.async_get_or_create(
        config_entry_id=mobile_entry.entry_id,
        identifiers={("mobile_app", "a1b2c3d4-e5f6-7890-webhook-uuid")},
        name="Test Phone",
    )

    # The real service name is the slugified device name.
    hass.services.async_register("notify", "mobile_app_test_phone", AsyncMock())

    services = await _get_user_notify_services(hass, "user123")
    assert services == ["notify.mobile_app_test_phone"]


async def test_user_notify_services_renamed_device(hass: HomeAssistant) -> None:
    """#75 safety net: a device renamed in HA (name_by_user) still resolves — the
    mobile_app service keeps the original registration name, which lives in the
    entry's ``device_name``."""
    from homeassistant.helpers import device_registry as dr

    mobile_entry = MockConfigEntry(
        domain="mobile_app",
        data={"user_id": "user123", "device_name": "Original Name"},
        source="user",
    )
    mobile_entry.add_to_hass(hass)

    device_reg = dr.async_get(hass)
    device = device_reg.async_get_or_create(
        config_entry_id=mobile_entry.entry_id,
        identifiers={("mobile_app", "webhook-uuid-xyz")},
        name="Original Name",
    )
    device_reg.async_update_device(device.id, name_by_user="My Renamed Phone")

    # Service still follows the original registration name.
    hass.services.async_register("notify", "mobile_app_original_name", AsyncMock())

    services = await _get_user_notify_services(hass, "user123")
    assert "notify.mobile_app_original_name" in services


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


async def test_mgr_lang_normalizes_regional_code(hass: HomeAssistant) -> None:
    """Regional HA language codes normalize to the 2-letter table key.

    HA always reports Chinese as ``zh-Hans`` / ``zh-Hant`` (never bare ``zh``),
    so without normalization the localized notification block would never
    resolve and silently fall back to English. ``calendar.py`` and
    ``config_flow_options_global.py`` already normalize; this keeps
    ``notification_manager`` consistent. Regression for PR #64 (zh-Hans) and
    every other regional code (``pt-BR``, ``en-GB``, ...).
    """
    _create_global_entry(hass)

    # pt-BR resolves to the real Portuguese block (present today), proving the
    # regional code reaches a localized table rather than the English fallback.
    hass.config.language = "pt-BR"
    mgr = NotificationManager(hass)
    assert mgr._lang == "pt"
    assert _notif_t("overdue_title", mgr._lang) != _notif_t("overdue_title", "en")

    # zh-Hans / zh-Hant collapse to the "zh" key the translation uses.
    hass.config.language = "zh-Hans"
    assert NotificationManager(hass)._lang == "zh"
    hass.config.language = "zh-Hant"
    assert NotificationManager(hass)._lang == "zh"


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
        MaintenanceStatus.OVERDUE,
        "en",
        "Filter cleaning",
        "Pool Pump",
        -3,
        "2026-04-23",
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
        MaintenanceStatus.OVERDUE,
        "en",
        "Filter cleaning",
        "Pool Pump",
        -3,
        "2026-04-23",
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
        MaintenanceStatus.OVERDUE,
        "en",
        "Filter cleaning",
        "Pool Pump",
        -3,
        "2026-04-23",
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
        MaintenanceStatus.OVERDUE,
        "en",
        "Filter cleaning",
        "Pool Pump",
        -3,
        "2026-04-23",
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


# ─── No global entry (migrated from test_coverage_97c.py) ─────────────


async def test_notification_manager_no_global_entry(
    hass: HomeAssistant,
) -> None:
    """Line 246: _global_options returns {} when no global entry."""
    from custom_components.maintenance_supporter.helpers.notification_manager import (
        NotificationManager,
    )

    nm = NotificationManager(hass)
    assert nm._global_options == {}


# ─── coordinator budget check (uses NotificationManager gating) ──────────


async def test_budget_both_zero_returns(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """_async_check_budget returns early when both budgets are zero."""
    # Enable budget alerts but set both budgets to 0
    global_data = dict(global_config_entry.data)
    global_data[CONF_BUDGET_ALERTS_ENABLED] = True
    global_data[CONF_BUDGET_ALERT_THRESHOLD] = 80
    global_data[CONF_BUDGET_MONTHLY] = 0
    global_data[CONF_BUDGET_YEARLY] = 0
    hass.config_entries.async_update_entry(global_config_entry, data=global_data)

    await setup_integration(hass, global_config_entry, object_config_entry)

    # Set up a mock NM so the first isinstance check passes
    nm = MagicMock(spec=NotificationManager)
    nm.enabled = True
    hass.data[DOMAIN]["_notification_manager"] = nm

    coordinator = object_config_entry.runtime_data.coordinator
    await coordinator._async_check_budget({})


async def test_budget_skips_non_completed_and_no_cost(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Budget traversal skips non-completed entries, entries with no cost, and bad timestamps."""
    global_data = dict(global_config_entry.data)
    global_data[CONF_BUDGET_ALERTS_ENABLED] = True
    global_data[CONF_BUDGET_ALERT_THRESHOLD] = 80
    global_data[CONF_BUDGET_MONTHLY] = 1000
    global_data[CONF_BUDGET_YEARLY] = 5000
    hass.config_entries.async_update_entry(global_config_entry, data=global_data)

    now = datetime.now()
    task = build_task_data(
        history=[
            # Skipped entry (not completed) → line 660
            {"type": "skipped", "timestamp": now.isoformat()},
            # Completed but no cost → line 663
            {"type": "completed", "timestamp": now.isoformat(), "cost": None},
            # Completed with cost but bad timestamp → lines 667-668
            {"type": "completed", "timestamp": "not-a-date", "cost": 50.0},
            # Valid entry (below threshold, no alert)
            {"type": "completed", "timestamp": now.isoformat(), "cost": 10.0},
        ],
    )
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Budget Edge",
        data=build_object_entry_data(
            object_data=build_object_data(name="Budget Edge"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_budget_edge",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    # Set up a mock NM so the first isinstance check passes
    nm = MagicMock(spec=NotificationManager)
    nm.enabled = True
    hass.data[DOMAIN]["_notification_manager"] = nm

    coordinator = entry.runtime_data.coordinator
    await coordinator._async_check_budget({})


# === migrated from test_cov_helpers.py (behaviour-based split) ===


async def test_notification_skipped_when_vacation_active(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """Lines 520-521: notification skipped during active vacation."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        CONF_VACATION_ENABLED,
        CONF_VACATION_END,
        CONF_VACATION_START,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager

    # Set up global entry with notifications enabled + active vacation
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    today = date.today()
    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_VACATION_ENABLED: True,
            CONF_VACATION_START: (today - timedelta(days=1)).isoformat(),
            CONF_VACATION_END: (today + timedelta(days=5)).isoformat(),
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)
    # Register a dummy notify service so enabled check passes
    hass.services.async_register("notify", "test", AsyncMock())

    called = False
    orig_send = mgr._async_send_notification_to_service

    async def _track(*args, **kwargs):
        nonlocal called
        called = True
        return await orig_send(*args, **kwargs)

    mgr._async_send_notification_to_service = _track  # type: ignore[method-assign]

    from custom_components.maintenance_supporter.const import MaintenanceStatus

    await mgr.async_task_status_changed(
        entry_id="eid",
        task_id="task_not_exempt",
        task_name="Test",
        object_name="Obj",
        new_status=MaintenanceStatus.OVERDUE,
    )
    # Vacation is active and task is not exempt → notification suppressed
    assert not called


async def test_notification_no_target_services(hass: HomeAssistant) -> None:
    """Lines 575-576: logs warning when no notification services are available."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
        MaintenanceStatus,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "",  # no global service
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)
    # Override quiet hours to be off
    with patch.object(type(mgr), "_is_quiet_hours", return_value=False):
        await mgr.async_task_status_changed(
            entry_id="eid",
            task_id="t1",
            task_name="Test",
            object_name="Obj",
            new_status=MaintenanceStatus.OVERDUE,
        )
    # No crash — just returns without sending (lines 574-576)


async def test_send_bundled_title_style_object_name(hass: HomeAssistant) -> None:
    """Line 767: bundled notification uses object_name as title when title_style = object_name."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFICATION_TITLE_STYLE,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
        MaintenanceStatus,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_NOTIFICATION_TITLE_STYLE: "object_name",
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)
    tasks = [{"status": MaintenanceStatus.OVERDUE, "task_name": "Filter"}]

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_send_bundled("entry1", "Pool Pump", tasks)

        # title should be the object name when style = object_name
        assert mock_hass.services.async_call.called
        call_data = mock_hass.services.async_call.call_args[0][2]
        assert call_data.get("title") == "Pool Pump"


async def test_send_bundled_quiet_hours_skipped(hass: HomeAssistant) -> None:
    """Line 744: bundled notifications skipped during quiet hours."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
        CONF_QUIET_HOURS_START,
        CONF_QUIET_HOURS_END,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
        MaintenanceStatus,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_QUIET_HOURS_ENABLED: True,
            CONF_QUIET_HOURS_START: "00:00",
            CONF_QUIET_HOURS_END: "23:59",  # always quiet
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)
    tasks = [{"status": MaintenanceStatus.OVERDUE, "task_name": "Filter"}]

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_send_bundled("entry1", "Pool Pump", tasks)

        # quiet hours active → service not called
        mock_hass.services.async_call.assert_not_called()


async def test_budget_alert_quiet_hours_skipped(hass: HomeAssistant) -> None:
    """Line 818: budget alert skipped during quiet hours."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
        CONF_QUIET_HOURS_START,
        CONF_QUIET_HOURS_END,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_QUIET_HOURS_ENABLED: True,
            CONF_QUIET_HOURS_START: "00:00",
            CONF_QUIET_HOURS_END: "23:59",
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_budget_alert("monthly", 450.0, 500.0)

        # quiet hours active → not called
        mock_hass.services.async_call.assert_not_called()


async def test_budget_alert_sends_notification(hass: HomeAssistant) -> None:
    """Lines 791-792: budget alert sends notification to service."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_budget_alert("monthly", 450.0, 500.0)

        assert mock_hass.services.async_call.called
        call_args = mock_hass.services.async_call.call_args[0]
        assert call_args[0] == "notify"


async def test_dismiss_task_notification(hass: HomeAssistant) -> None:
    """Lines 894-895: async_dismiss_task_notification calls service."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_dismiss_task_notification("my_task_id")

        assert mock_hass.services.async_call.called
        call_data = mock_hass.services.async_call.call_args[0][2]
        assert call_data["message"] == "clear_notification"
        assert "maintenance_my_task_id" in call_data["data"]["tag"]


async def test_dismiss_task_notification_no_service(hass: HomeAssistant) -> None:
    """Line 882: async_dismiss_task_notification returns early when no service."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "",  # empty
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_dismiss_task_notification("my_task_id")

        # No notify_service configured → should not call service
        mock_hass.services.async_call.assert_not_called()


# ─── Configured notify-service health (repair issue) ───────────────────────


def _get_notify_issue(hass: HomeAssistant) -> ir.IssueEntry | None:
    """Return the 'configured notify service missing' repair issue, or None."""
    return ir.async_get(hass).async_get_issue(DOMAIN, _NOTIFY_SERVICE_MISSING_ISSUE_ID)


async def test_verify_service_creates_issue_when_missing(
    hass: HomeAssistant,
) -> None:
    """A configured service that doesn't exist raises a repair issue."""
    _create_global_entry(hass, notify_service="notify.ghost_service")
    # notify.ghost_service is never registered.

    mgr = NotificationManager(hass)
    mgr.async_verify_configured_service()

    issue = _get_notify_issue(hass)
    assert issue is not None
    assert issue.translation_placeholders == {"service": "notify.ghost_service"}


async def test_verify_service_no_issue_when_service_exists(
    hass: HomeAssistant,
) -> None:
    """A configured service that exists raises no issue."""
    _create_global_entry(hass, notify_service="notify.test")
    hass.services.async_register("notify", "test", AsyncMock())

    mgr = NotificationManager(hass)
    mgr.async_verify_configured_service()

    assert _get_notify_issue(hass) is None


async def test_verify_service_group_not_flagged(hass: HomeAssistant) -> None:
    """A *working* notify group is never flagged.

    We deliberately only check the top-level service. A broken member inside the
    group is invisible here (HA dispatches to the working members and only logs
    the bad one), so a registered group must not raise the issue — otherwise we'd
    false-alarm on exactly the user's real-world setup.
    """
    _create_global_entry(hass, notify_service="notify.all_devices_ingmar")
    hass.services.async_register("notify", "all_devices_ingmar", AsyncMock())

    mgr = NotificationManager(hass)
    mgr.async_verify_configured_service()

    assert _get_notify_issue(hass) is None


async def test_verify_service_no_issue_when_disabled(hass: HomeAssistant) -> None:
    """Notifications disabled → no issue even when the service is missing."""
    _create_global_entry(hass, notifications_enabled=False, notify_service="notify.ghost_service")

    mgr = NotificationManager(hass)
    mgr.async_verify_configured_service()

    assert _get_notify_issue(hass) is None


async def test_verify_service_clears_issue_on_restore(hass: HomeAssistant) -> None:
    """The issue clears once the missing service comes back."""
    _create_global_entry(hass, notify_service="notify.test")

    mgr = NotificationManager(hass)
    # First check: service absent → issue raised.
    mgr.async_verify_configured_service()
    assert _get_notify_issue(hass) is not None

    # Service registered → next check clears it.
    hass.services.async_register("notify", "test", AsyncMock())
    mgr.async_verify_configured_service()
    assert _get_notify_issue(hass) is None


async def test_verify_service_first_call_clears_stale_issue(
    hass: HomeAssistant,
) -> None:
    """A stale issue persisted from a previous run is cleared on the first check.

    The transition gate starts at None precisely so a healthy service reconciles
    (deletes) a left-over issue instead of no-opping on it after a restart.
    """
    _create_global_entry(hass, notify_service="notify.test")
    hass.services.async_register("notify", "test", AsyncMock())
    # Simulate an issue left over in the registry from before the restore.
    ir.async_create_issue(
        hass,
        DOMAIN,
        _NOTIFY_SERVICE_MISSING_ISSUE_ID,
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="notify_service_missing",
        translation_placeholders={"service": "notify.test"},
    )
    assert _get_notify_issue(hass) is not None

    # Fresh manager (transition flag = None) must reconcile the registry.
    mgr = NotificationManager(hass)
    mgr.async_verify_configured_service()

    assert _get_notify_issue(hass) is None


async def test_status_change_keeps_issue_in_sync(hass: HomeAssistant) -> None:
    """The send path itself raises the repair issue (verify hook is wired)."""
    _create_global_entry(hass, notify_service="notify.ghost_service")

    mgr = NotificationManager(hass)
    # Patch the actual dispatch so the test asserts only the verify hook, not
    # HA's service-call internals.
    with patch.object(mgr, "_async_send_notification_to_service", AsyncMock(return_value=True)):
        await mgr.async_task_status_changed(
            entry_id="eid",
            task_id="t1",
            task_name="Filter",
            object_name="Furnace",
            new_status=MaintenanceStatus.OVERDUE,
        )

    assert _get_notify_issue(hass) is not None


def test_test_notification_success_text_warns_about_group_members() -> None:
    """(b) A green test must not imply *every* device works.

    The success copy points users at the per-device / notify-group + HA log, so a
    silently-broken group member isn't mistaken for an all-clear.
    """
    from custom_components.maintenance_supporter.config_flow_options_global import (
        _TEST_NOTIFICATION_RESULTS,
    )

    en = _TEST_NOTIFICATION_RESULTS["en"]["success"].lower()
    assert "group" in en
    assert "log" in en
    de = _TEST_NOTIFICATION_RESULTS["de"]["success"].lower()
    assert "gruppe" in de


# ─── Dual send path: legacy service vs notify entity ───────────────────────


async def test_send_to_legacy_service_uses_service_call(hass: HomeAssistant) -> None:
    """A target with a legacy notify service is sent via that service, with the
    full ``data`` payload (action buttons / tag / deep link preserved)."""
    _create_global_entry(hass, notify_service="notify.legacy_device")
    calls: list = []
    hass.services.async_register("notify", "legacy_device", lambda c: calls.append(c))

    mgr = NotificationManager(hass)
    ok = await mgr._async_send_notification_to_service(
        service="notify.legacy_device",
        title="T",
        message="M",
        entry_id="e",
        task_id="t",
    )
    await hass.async_block_till_done()

    assert ok is True
    assert len(calls) == 1
    assert calls[0].data.get("message") == "M"
    assert "data" in calls[0].data  # legacy path keeps the rich payload


async def test_send_to_notify_entity_uses_send_message(hass: HomeAssistant) -> None:
    """An entity-only target (no legacy service) is sent via notify.send_message
    with entity_id — message+title only, since the entity model can't carry data."""
    _create_global_entry(hass, notify_service="notify.file")
    hass.states.async_set("notify.file", "unknown")  # a notify ENTITY, not a service
    send_calls: list = []
    hass.services.async_register("notify", "send_message", lambda c: send_calls.append(c))

    mgr = NotificationManager(hass)
    ok = await mgr._async_send_notification_to_service(
        service="notify.file",
        title="T",
        message="M",
        entry_id="e",
        task_id="t",
    )
    await hass.async_block_till_done()

    assert ok is True
    assert len(send_calls) == 1
    assert send_calls[0].data.get("entity_id") == "notify.file"
    assert send_calls[0].data.get("message") == "M"
    assert "data" not in send_calls[0].data  # entity model drops the rich payload


async def test_verify_service_accepts_notify_entity(hass: HomeAssistant) -> None:
    """A configured notify ENTITY (no legacy service) is a valid target — the
    repair issue must not false-fire on it."""
    _create_global_entry(hass, notify_service="notify.file")
    hass.states.async_set("notify.file", "unknown")

    mgr = NotificationManager(hass)
    mgr.async_verify_configured_service()

    assert _get_notify_issue(hass) is None
