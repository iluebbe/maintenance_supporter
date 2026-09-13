"""`currency_decimals`: one global setting (default 0) for every displayed amount.

Pins: the setting is registered (int, 0–3), echoed under `budget` and in
`budget_status`, the cards' `statistics` response now carries a currency
block (code, symbol, decimals — they used to fall back to €), the budget
alert renders amounts with the configured decimals, and the buy-task note
does too.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BUDGET_CURRENCY,
    CONF_CURRENCY_DECIMALS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_QUIET_HOURS_ENABLED,
    DEFAULT_CURRENCY_DECIMALS,
    DOMAIN,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
from custom_components.maintenance_supporter.helpers.parts import buy_task_notes
from custom_components.maintenance_supporter.helpers.settings_registry import int_range

from .conftest import build_object_entry_data, make_global_entry, setup_integration


def _global(hass: HomeAssistant, **options: object) -> MockConfigEntry:
    return make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, **options},
    )


def test_setting_is_registered_as_a_small_int_with_a_whole_number_default() -> None:
    assert DEFAULT_CURRENCY_DECIMALS == 0
    assert int_range(CONF_CURRENCY_DECIMALS) == (0, 3)


def test_buy_task_notes_follow_the_decimals() -> None:
    part = {"name": "Seal", "cost": 12.4, "quantity": 2}
    assert "≈ 12.40 ×" in buy_task_notes(part, None, decimals=2)
    assert "≈ 12 ×" in buy_task_notes(part, None, decimals=0)
    assert "≈ 12 ×" in buy_task_notes(part, None), "the parameter's default IS the setting's default"
    assert "≈ 12.4 ×" in buy_task_notes(part, None, decimals=1)


async def test_budget_alert_renders_the_configured_decimals(hass: HomeAssistant) -> None:
    _global(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    nm = NotificationManager(hass)
    await nm.async_budget_alert("monthly", 90.0, 100.0, "€", decimals=0)
    await hass.async_block_till_done()
    msg = calls.call_args[0][0].data["message"]
    assert "90€" in msg and "100€" in msg and "90.00" not in msg
    nm2 = NotificationManager(hass)
    await nm2.async_budget_alert("yearly", 950.5, 1000.0, "$", decimals=2)
    await hass.async_block_till_done()
    assert "950.50$" in calls.call_args[0][0].data["message"]


async def test_ws_responses_carry_the_currency_block(hass: HomeAssistant, hass_ws_client: Any) -> None:
    g = _global(hass, **{CONF_BUDGET_CURRENCY: "CHF", CONF_CURRENCY_DECIMALS: 1, CONF_NOTIFICATIONS_ENABLED: False, CONF_NOTIFY_SERVICE: ""})
    obj = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Pool Pump", data=build_object_entry_data(), source="user", unique_id="maintenance_supporter_cd")
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    client = await hass_ws_client(hass)

    await client.send_json({"id": 1, "type": "maintenance_supporter/statistics"})
    stats = (await client.receive_json())["result"]
    assert stats["budget"] == {"currency": "CHF", "currency_symbol": "Fr", "currency_decimals": 1}

    await client.send_json({"id": 2, "type": "maintenance_supporter/budget_status"})
    status = (await client.receive_json())["result"]
    assert status["currency_symbol"] == "Fr" and status["currency_decimals"] == 1

    await client.send_json({"id": 3, "type": "maintenance_supporter/settings"})
    settings = (await client.receive_json())["result"]
    assert settings["budget"]["currency_decimals"] == 1

    # The WS write path accepts a value inside the registry range.
    await client.send_json({"id": 4, "type": "maintenance_supporter/global/update", "settings": {"currency_decimals": 2}})
    res = await client.receive_json()
    assert res["success"], res
    assert res["result"]["budget"]["currency_decimals"] == 2
