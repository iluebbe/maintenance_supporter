"""Tests for GlobalOptionsFlow (config_flow_options_global.py)."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.config_flow_options_global import (
    _get_test_result_text,
    validate_notify_service,
)
from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_GROUPS,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import build_global_entry_data, setup_integration


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


@pytest.fixture
def global_entry_with_notifications(hass: HomeAssistant) -> MockConfigEntry:
    data = build_global_entry_data(notifications_enabled=True, notify_service="notify.test")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def global_entry_notifications_no_service(hass: HomeAssistant) -> MockConfigEntry:
    data = build_global_entry_data(notifications_enabled=True, notify_service="")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# ─── validate_notify_service ──────────────────────────────────────────────


def test_validate_empty_service() -> None:
    """Test empty string returns no error."""
    result, error = validate_notify_service("")
    assert result == ""
    assert error is None


def test_validate_auto_prefix() -> None:
    """Test auto-prepending 'notify.' prefix."""
    result, error = validate_notify_service("test_device")
    assert result == "notify.test_device"
    assert error is None


def test_validate_full_service() -> None:
    """Test valid full service name."""
    result, error = validate_notify_service("notify.mobile_app")
    assert result == "notify.mobile_app"
    assert error is None


def test_validate_invalid_format() -> None:
    """Test invalid service format."""
    result, error = validate_notify_service("not_notify.service")
    assert error == "invalid_notify_service"


def test_validate_invalid_chars() -> None:
    """Test service name with invalid characters."""
    result, error = validate_notify_service("notify.bad-name!")
    assert error == "invalid_notify_service"


def test_validate_service_not_found(hass: HomeAssistant) -> None:
    """Test validation when service doesn't exist in hass."""
    result, error = validate_notify_service("notify.nonexistent", hass)
    assert error == "notify_service_not_found"


# ─── _get_test_result_text ────────────────────────────────────────────────


def test_get_test_result_text_en(hass: HomeAssistant) -> None:
    """Test English result text."""
    hass.config.language = "en"
    result = _get_test_result_text(hass, "success")
    assert "successfully" in result


def test_get_test_result_text_de(hass: HomeAssistant) -> None:
    """Test German result text."""
    hass.config.language = "de"
    result = _get_test_result_text(hass, "success")
    assert "erfolgreich" in result


def test_get_test_result_text_fallback(hass: HomeAssistant) -> None:
    """Test fallback to English for unknown language."""
    hass.config.language = "zh"
    result = _get_test_result_text(hass, "success")
    assert "successfully" in result


def test_get_test_result_text_unknown_key(hass: HomeAssistant) -> None:
    """Test unknown key falls back to 'failed' text."""
    hass.config.language = "en"
    result = _get_test_result_text(hass, "unknown_key")
    assert "Failed" in result


# ─── Options Flow Navigation ──────────────────────────────────────────────


async def test_options_flow_init(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test options flow shows menu on init."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "global_init"
    assert "general_settings" in result["menu_options"]
    assert "advanced_features" in result["menu_options"]
    assert "done" in result["menu_options"]


async def test_options_flow_done(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test done step closes the options flow."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "done"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY


async def test_options_flow_advanced_features(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test advanced features toggle."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "advanced_features"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "advanced_features"

    # Submit with some features enabled
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_ADVANCED_ADAPTIVE: True,
            CONF_ADVANCED_BUDGET: True,
            CONF_ADVANCED_GROUPS: True,
        },
    )
    # Should return to menu
    assert result["type"] == FlowResultType.MENU

    # Menu should now include budget and groups
    assert "budget_settings" in result["menu_options"]
    assert "manage_groups" in result["menu_options"]


async def test_options_flow_general_settings(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test general settings form."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "general_settings"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "general_settings"


async def test_options_flow_notifications_menu(
    hass: HomeAssistant, global_entry_with_notifications: MockConfigEntry,
) -> None:
    """Test that notifications enabled adds menu items."""
    await setup_integration(hass, global_entry_with_notifications)

    result = await hass.config_entries.options.async_init(global_entry_with_notifications.entry_id)
    assert "notification_settings" in result["menu_options"]
    assert "notification_actions" in result["menu_options"]
    assert "test_notification" in result["menu_options"]


async def test_options_flow_notification_settings(
    hass: HomeAssistant, global_entry_with_notifications: MockConfigEntry,
) -> None:
    """Test notification settings form."""
    await setup_integration(hass, global_entry_with_notifications)

    result = await hass.config_entries.options.async_init(global_entry_with_notifications.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "notification_settings"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "notification_settings"


async def test_options_flow_notification_actions(
    hass: HomeAssistant, global_entry_with_notifications: MockConfigEntry,
) -> None:
    """Test notification actions form."""
    await setup_integration(hass, global_entry_with_notifications)

    result = await hass.config_entries.options.async_init(global_entry_with_notifications.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "notification_actions"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "notification_actions"

    # Submit with action buttons toggled
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={},
    )
    # Should return to menu
    assert result["type"] == FlowResultType.MENU


async def test_options_flow_test_notification_no_service(
    hass: HomeAssistant, global_entry_notifications_no_service: MockConfigEntry,
) -> None:
    """Test test_notification when no service configured."""
    await setup_integration(hass, global_entry_notifications_no_service)

    result = await hass.config_entries.options.async_init(
        global_entry_notifications_no_service.entry_id,
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "test_notification"},
    )
    # Should show result with no_service message
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "test_notification"


async def test_options_flow_test_notification_success(
    hass: HomeAssistant, global_entry_with_notifications: MockConfigEntry,
) -> None:
    """Test test_notification success path."""
    await setup_integration(hass, global_entry_with_notifications)

    # Register a mock notify service
    async def mock_service(call: ServiceCall) -> None:
        pass

    hass.services.async_register("notify", "test", mock_service)

    result = await hass.config_entries.options.async_init(
        global_entry_with_notifications.entry_id,
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "test_notification"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "test_notification"

    # Acknowledge result → returns to menu
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={},
    )
    assert result["type"] == FlowResultType.MENU


async def test_options_flow_test_notification_failed(
    hass: HomeAssistant, global_entry_with_notifications: MockConfigEntry,
) -> None:
    """Test test_notification when service call fails."""
    await setup_integration(hass, global_entry_with_notifications)

    # Register a failing mock service
    async def mock_service_fail(call: ServiceCall) -> None:
        raise Exception("Service unavailable")

    hass.services.async_register("notify", "test", mock_service_fail)

    result = await hass.config_entries.options.async_init(
        global_entry_with_notifications.entry_id,
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "test_notification"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "test_notification"


async def test_options_flow_general_settings_submit(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test submitting general settings form."""
    await setup_integration(hass, global_entry)

    # Register the notify service so validation passes
    hass.services.async_register("notify", "test", lambda call: None)

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "general_settings"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 5,
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
        },
    )
    assert result["type"] == FlowResultType.MENU


async def test_options_flow_general_settings_invalid_service(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test general settings with invalid notify service shows error."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "general_settings"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 5,
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "invalid.bad-service!",
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"] is not None
    assert result["errors"].get(CONF_NOTIFY_SERVICE)


async def test_options_flow_budget_settings(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test budget settings form display and submit."""
    await setup_integration(hass, global_entry)

    # First enable budget via advanced features
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "advanced_features"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_ADVANCED_BUDGET: True,
        },
    )
    # Menu should now have budget_settings
    assert "budget_settings" in result["menu_options"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "budget_settings"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "budget_settings"

    # Submit budget settings
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            "budget_monthly": 100.0,
            "budget_yearly": 1200.0,
            "budget_alerts_enabled": True,
            "budget_alert_threshold": 80,
        },
    )
    assert result["type"] == FlowResultType.MENU


async def test_options_flow_manage_groups_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test manage_groups with no groups goes to add_group form."""
    await setup_integration(hass, global_entry)

    # Enable groups via advanced features
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "advanced_features"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_ADVANCED_GROUPS: True,
        },
    )
    assert "manage_groups" in result["menu_options"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_groups"},
    )
    # No groups → goes directly to add_group form
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "add_group"


async def test_options_flow_add_group(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test adding a new group."""
    await setup_integration(hass, global_entry)

    # Enable groups
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "advanced_features"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_ADVANCED_GROUPS: True},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_groups"},
    )
    # Submit add_group form
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            "group_name": "Pool Equipment",
            "group_description": "All pool-related items",
        },
    )
    assert result["type"] == FlowResultType.MENU

    # Verify group was added
    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    groups = (entry.options or entry.data).get("groups", {})
    assert len(groups) == 1
    group = list(groups.values())[0]
    assert group["name"] == "Pool Equipment"


async def test_options_flow_notification_settings_submit(
    hass: HomeAssistant, global_entry_with_notifications: MockConfigEntry,
) -> None:
    """Test notification settings form submit."""
    from custom_components.maintenance_supporter.const import (
        CONF_MAX_NOTIFICATIONS_PER_DAY,
        CONF_NOTIFICATION_BUNDLE_THRESHOLD,
        CONF_NOTIFICATION_BUNDLING_ENABLED,
        CONF_NOTIFY_DUE_SOON_ENABLED,
        CONF_NOTIFY_DUE_SOON_INTERVAL,
        CONF_NOTIFY_OVERDUE_ENABLED,
        CONF_NOTIFY_OVERDUE_INTERVAL,
        CONF_NOTIFY_TRIGGERED_ENABLED,
        CONF_NOTIFY_TRIGGERED_INTERVAL,
        CONF_QUIET_HOURS_ENABLED,
        CONF_QUIET_HOURS_END,
        CONF_QUIET_HOURS_START,
    )

    await setup_integration(hass, global_entry_with_notifications)

    result = await hass.config_entries.options.async_init(
        global_entry_with_notifications.entry_id,
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "notification_settings"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_NOTIFY_DUE_SOON_ENABLED: True,
            CONF_NOTIFY_DUE_SOON_INTERVAL: 12,
            CONF_NOTIFY_OVERDUE_ENABLED: True,
            CONF_NOTIFY_OVERDUE_INTERVAL: 24,
            CONF_NOTIFY_TRIGGERED_ENABLED: True,
            CONF_NOTIFY_TRIGGERED_INTERVAL: 0,
            CONF_QUIET_HOURS_ENABLED: True,
            CONF_QUIET_HOURS_START: "22:00",
            CONF_QUIET_HOURS_END: "08:00",
            CONF_MAX_NOTIFICATIONS_PER_DAY: 10,
            CONF_NOTIFICATION_BUNDLING_ENABLED: False,
            CONF_NOTIFICATION_BUNDLE_THRESHOLD: 2,
        },
    )
    assert result["type"] == FlowResultType.MENU
