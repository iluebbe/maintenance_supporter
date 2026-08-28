"""The slim ``battery_fleet/status`` check behind the panel's setup button.

The panel used to ask the FULL ``battery_fleet/overview`` on every load just
to decide whether to show the one-click-setup button — which runs
``async_compute_overview`` and with it the trend regressions (one recorder
regression per healthy battery on a cold cache after every HA restart).
``status`` answers the two booleans the button needs and must never touch
the battery-reading or trend machinery.
"""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_status

from .conftest import (
    build_global_entry_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


async def _status(hass: HomeAssistant) -> dict:
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_status, hass, conn, {"id": 1, "type": "x"})
    return conn.send_result.call_args[0][1]


async def test_status_reflects_batteries_and_fleet(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)

    # No batteries at all.
    assert await _status(hass) == {"available": False, "configured": False}

    # A battery appears (native is enough for availability).
    hass.states.async_set("sensor.remote_battery", "80", {"device_class": "battery"})
    assert await _status(hass) == {"available": True, "configured": False}

    # A fleet object exists → configured.
    fleet = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Battery Fleet",
        data={CONF_OBJECT: {"id": "objf", "name": "Battery Fleet", "battery_fleet": True}},
        source="user",
    )
    fleet.add_to_hass(hass)
    assert await _status(hass) == {"available": True, "configured": True}


async def test_status_never_touches_the_trend_machinery(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The whole point of the command: a panel boot must not pay for
    battery reads or recorder regressions just to hide a button."""
    await setup_integration(hass, global_entry)
    hass.states.async_set("sensor.remote_battery", "80", {"device_class": "battery"})

    with (
        patch(
            "custom_components.maintenance_supporter.helpers.battery_fleet.async_compute_overview",
            new=AsyncMock(side_effect=AssertionError("status must not compute the overview")),
        ),
        patch(
            "custom_components.maintenance_supporter.helpers.battery_fleet.async_trend_predictions",
            new=AsyncMock(side_effect=AssertionError("status must not run trend predictions")),
        ),
        patch(
            "custom_components.maintenance_supporter.helpers.battery_fleet.read_batteries",
            side_effect=AssertionError("status must not read the battery fleet"),
        ),
    ):
        result = await _status(hass)
    assert result == {"available": True, "configured": False}


async def test_exclude_include_without_fleet_is_not_configured(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#107/#135 toggles refuse cleanly when the fleet was never set up."""
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_set_excluded,
        ws_battery_fleet_set_included,
    )

    from .conftest import assert_ws_error, call_ws_handler, make_ws_connection

    await setup_integration(hass, global_entry)

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_set_excluded, hass, conn, {
        "id": 1, "type": "x", "entity_id": "sensor.some_battery", "excluded": True,
    })
    code, _ = assert_ws_error(conn)
    assert code == "not_configured"

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_set_included, hass, conn, {
        "id": 1, "type": "x", "entity_id": "sensor.some_battery", "included": True,
    })
    code, _ = assert_ws_error(conn)
    assert code == "not_configured"


async def test_overview_history_returns_series(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_history,
    )

    from .conftest import call_ws_handler, make_ws_connection

    await setup_integration(hass, global_entry)
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_history, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    assert "series" in conn.send_result.call_args[0][1]
