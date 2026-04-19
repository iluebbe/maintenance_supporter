"""Tests verifying panel settings (WS API) and config flow settings stay in sync.

Both paths write to the same config_entry.options via
hass.config_entries.async_update_entry().  These tests alternate between
WS writes and config flow writes, then read from the other path to confirm
consistency.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_GROUPS,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_CURRENCY,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_PANEL_ENABLED,
    CONF_QUIET_HOURS_START,
    CONF_SNOOZE_DURATION_HOURS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_get_settings,
    ws_update_global_settings,
)

from .conftest import build_global_entry_data, call_ws_handler, setup_integration

# ─── Helpers ──────────────────────────────────────────────────────────────


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.send_message = MagicMock()
    conn.subscriptions = {}
    conn.user = MagicMock(is_admin=True)
    return conn


_msg_id = 0


def _next_id() -> int:
    global _msg_id
    _msg_id += 1
    return _msg_id


async def _ws_get(hass: HomeAssistant) -> dict[str, Any]:
    """Call ws_get_settings and return the result dict."""
    conn = _mock_connection()
    await call_ws_handler(ws_get_settings, hass, conn, {
        "id": _next_id(),
        "type": "maintenance_supporter/settings",
    })
    conn.send_result.assert_called_once()
    result: dict[str, Any] = conn.send_result.call_args[0][1]
    return result


async def _ws_update(
    hass: HomeAssistant, settings: dict[str, Any],
) -> dict[str, Any]:
    """Call ws_update_global_settings and return the result dict."""
    conn = _mock_connection()
    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": _next_id(),
        "type": "maintenance_supporter/global/update",
        "settings": settings,
    })
    conn.send_result.assert_called_once()
    result: dict[str, Any] = conn.send_result.call_args[0][1]
    return result


def _entry_options(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    """Re-fetch config entry and return its effective options."""
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    return dict(entry.options or entry.data)


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


async def test_ws_update_then_config_flow_reads(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """WS sets warning_days=14, panel=True; config entry options reflect it."""
    await setup_integration(hass, global_entry)

    await _ws_update(hass, {
        CONF_DEFAULT_WARNING_DAYS: 14,
        CONF_PANEL_ENABLED: True,
    })

    # Config entry (as config flow reads via self._current) has updated values
    opts = _entry_options(hass, global_entry.entry_id)
    assert opts[CONF_DEFAULT_WARNING_DAYS] == 14
    assert opts[CONF_PANEL_ENABLED] is True


async def test_config_flow_update_then_ws_reads(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Config flow sets warning_days=3; WS get_settings returns 3."""
    await setup_integration(hass, global_entry)

    # Config flow: navigate to general_settings and submit
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "general_settings"},
    )
    assert result["type"] == FlowResultType.FORM

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 3,
            CONF_NOTIFICATIONS_ENABLED: False,
            CONF_NOTIFY_SERVICE: "",
        },
    )
    assert result["type"] == FlowResultType.MENU

    # WS should see the update
    ws_result = await _ws_get(hass)
    assert ws_result["general"]["default_warning_days"] == 3


async def test_feature_toggles_sync_ws_to_config_flow(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Enable budget+groups via WS; config flow menu reflects it."""
    await setup_integration(hass, global_entry)

    # Enable budget + groups via WS
    await _ws_update(hass, {
        CONF_ADVANCED_BUDGET: True,
        CONF_ADVANCED_GROUPS: True,
    })

    # Config flow menu should include budget_settings + manage_groups
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    assert result["type"] == FlowResultType.MENU
    assert "budget_settings" in result["menu_options"]
    assert "manage_groups" in result["menu_options"]

    # Disable budget via WS
    await _ws_update(hass, {CONF_ADVANCED_BUDGET: False})

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    assert "budget_settings" not in result["menu_options"]
    assert "manage_groups" in result["menu_options"]


async def test_notifications_sync_ws_to_config_flow(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Enable notifications via WS; config flow menu shows notification items."""
    await setup_integration(hass, global_entry)

    # Initially no notification menu items
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    assert "notification_settings" not in result["menu_options"]

    # Enable notifications via WS
    await _ws_update(hass, {CONF_NOTIFICATIONS_ENABLED: True})

    # Config flow should now show notification items
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    assert "notification_settings" in result["menu_options"]
    assert "notification_actions" in result["menu_options"]
    assert "test_notification" in result["menu_options"]


async def test_budget_values_sync_ws_float_precision(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Set budget values via WS (int→float coercion); both paths see correct floats."""
    await setup_integration(hass, global_entry)

    # Enable budget feature first
    await _ws_update(hass, {CONF_ADVANCED_BUDGET: True})

    # Set budget values — 150 is int, should be coerced to float
    await _ws_update(hass, {
        CONF_BUDGET_MONTHLY: 150,
        CONF_BUDGET_YEARLY: 1800.50,
        CONF_BUDGET_CURRENCY: "USD",
        CONF_BUDGET_ALERTS_ENABLED: True,
        CONF_BUDGET_ALERT_THRESHOLD: 90,
    })

    # Config entry has correct values
    opts = _entry_options(hass, global_entry.entry_id)
    assert opts[CONF_BUDGET_MONTHLY] == 150.0
    assert isinstance(opts[CONF_BUDGET_MONTHLY], float)
    assert opts[CONF_BUDGET_YEARLY] == 1800.50
    assert opts[CONF_BUDGET_CURRENCY] == "USD"

    # WS read returns correct structured response
    ws_result = await _ws_get(hass)
    assert ws_result["budget"]["monthly"] == 150.0
    assert ws_result["budget"]["yearly"] == 1800.50
    assert ws_result["budget"]["currency"] == "USD"
    assert ws_result["budget"]["currency_symbol"] == "$"
    assert ws_result["budget"]["alert_threshold_pct"] == 90


async def test_alternating_updates_both_paths(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Alternate WS and config flow updates; both always see latest state."""
    await setup_integration(hass, global_entry)

    # 1) WS: set warning_days=10
    await _ws_update(hass, {CONF_DEFAULT_WARNING_DAYS: 10})

    # 2) Config flow: overwrite to 5
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "general_settings"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 5,
            CONF_NOTIFICATIONS_ENABLED: False,
            CONF_NOTIFY_SERVICE: "",
        },
    )

    # 3) WS read: should see 5 (config flow's write won)
    ws_result = await _ws_get(hass)
    assert ws_result["general"]["default_warning_days"] == 5

    # 4) WS: set warning_days=20
    await _ws_update(hass, {CONF_DEFAULT_WARNING_DAYS: 20})

    # 5) Config entry read: should see 20
    opts = _entry_options(hass, global_entry.entry_id)
    assert opts[CONF_DEFAULT_WARNING_DAYS] == 20

    # 6) Config flow: enable adaptive (unrelated key)
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "advanced_features"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_ADVANCED_ADAPTIVE: True},
    )

    # 7) WS read: adaptive=True AND warning_days=20 (merge preserved both)
    ws_result = await _ws_get(hass)
    assert ws_result["features"]["adaptive"] is True
    assert ws_result["general"]["default_warning_days"] == 20


async def test_full_round_trip(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Full round-trip: WS write → WS read → config entry → CF write → WS read."""
    await setup_integration(hass, global_entry)

    # 1) WS write: 5 mixed keys
    await _ws_update(hass, {
        CONF_ADVANCED_BUDGET: True,
        CONF_BUDGET_MONTHLY: 200.0,
        CONF_ACTION_COMPLETE_ENABLED: True,
        CONF_SNOOZE_DURATION_HOURS: 8,
        CONF_QUIET_HOURS_START: "23:00",
    })

    # 2) WS read: all values present
    ws_result = await _ws_get(hass)
    assert ws_result["budget"]["monthly"] == 200.0
    assert ws_result["actions"]["complete_enabled"] is True
    assert ws_result["actions"]["snooze_duration_hours"] == 8
    assert ws_result["notifications"]["quiet_hours_start"] == "23:00"

    # 3) Config entry read: same values
    opts = _entry_options(hass, global_entry.entry_id)
    assert opts[CONF_BUDGET_MONTHLY] == 200.0
    assert opts[CONF_ACTION_COMPLETE_ENABLED] is True
    assert opts[CONF_SNOOZE_DURATION_HOURS] == 8
    assert opts[CONF_QUIET_HOURS_START] == "23:00"

    # 4) Config flow: overwrite budget values
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "budget_settings"},
    )
    assert result["type"] == FlowResultType.FORM

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_BUDGET_MONTHLY: 300.0,
            CONF_BUDGET_YEARLY: 3600.0,
            CONF_BUDGET_ALERTS_ENABLED: False,
            CONF_BUDGET_ALERT_THRESHOLD: 80,
        },
    )
    assert result["type"] == FlowResultType.MENU

    # 5) WS read: budget overwritten, other keys preserved
    ws_result = await _ws_get(hass)
    assert ws_result["budget"]["monthly"] == 300.0
    assert ws_result["budget"]["yearly"] == 3600.0
    assert ws_result["actions"]["complete_enabled"] is True  # untouched
    assert ws_result["actions"]["snooze_duration_hours"] == 8  # untouched
    assert ws_result["notifications"]["quiet_hours_start"] == "23:00"  # untouched

    # 6) Config entry: all values consistent
    opts = _entry_options(hass, global_entry.entry_id)
    assert opts[CONF_BUDGET_MONTHLY] == 300.0
    assert opts[CONF_ACTION_COMPLETE_ENABLED] is True
    assert opts[CONF_SNOOZE_DURATION_HOURS] == 8
