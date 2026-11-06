"""The cards' settings read leaves out what only the Settings page shows.

Every card on every dashboard reads ``settings`` once per page (the row
style, the feature switches, the write delegation), and the server scanned
the whole home each time for the notify targets, the Battery Notes hint and
the battery lifetime table: 34 ms of a 4,700-entity home's event loop in the
middle of every dashboard load (perf 2026-11-06). ``lite`` skips those three;
everything else, all the cards and dialogs read (frontend
helpers/settings-cache parseSettings), is the same answer.
"""

from __future__ import annotations

from unittest.mock import patch

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.websocket import dashboard
from custom_components.maintenance_supporter.websocket.dashboard import ws_get_settings

from .conftest import call_ws_handler, make_global_entry, make_ws_connection

SCANS = ("build_notify_targets", "battery_notes_summary", "fleet_lifetime_catalog")
PAGE_ONLY = ("notify_targets", "battery_notes", "battery_lifetimes")


async def _settings(hass: HomeAssistant, **extra: object) -> dict:
    conn = make_ws_connection()
    await call_ws_handler(ws_get_settings, hass, conn, {"id": 1, "type": "maintenance_supporter/settings", **extra})
    assert conn.send_result.called, conn.send_error.call_args
    return conn.send_result.call_args[0][1]


def _without_page_only(settings: dict) -> dict:
    return {**settings, "general": {k: v for k, v in settings["general"].items() if k not in PAGE_ONLY}}


@pytest.mark.parametrize("with_global_entry", [True, False])
async def test_lite_runs_none_of_the_scans_and_answers_the_rest_the_same(
    hass: HomeAssistant, with_global_entry: bool
) -> None:
    if with_global_entry:
        make_global_entry(hass, notify_service="notify.phone")
    full = await _settings(hass)
    with (
        patch.object(dashboard, SCANS[0], side_effect=AssertionError(SCANS[0])),
        patch.object(dashboard, SCANS[1], side_effect=AssertionError(SCANS[1])),
        patch.object(dashboard, SCANS[2], side_effect=AssertionError(SCANS[2])),
    ):
        lite = await _settings(hass, lite=True)
    assert lite["general"]["notify_targets"] == []
    assert lite["general"]["battery_notes"] is None
    assert lite["general"]["battery_lifetimes"] == []
    assert _without_page_only(lite) == _without_page_only(full)


async def test_the_settings_page_still_gets_everything(hass: HomeAssistant) -> None:
    make_global_entry(hass, notify_service="notify.phone")
    full = await _settings(hass)
    # The saved target is always pickable, so the full answer carries it.
    assert "notify.phone" in full["general"]["notify_targets"]
    assert "battery_lifetimes" in full["general"]
    assert "battery_notes" in full["general"]


def test_the_schema_takes_lite_and_nothing_else_new() -> None:
    schema = ws_get_settings._ws_schema  # type: ignore[attr-defined]
    base = {"id": 1, "type": "maintenance_supporter/settings"}
    assert schema(base)["lite"] is False
    assert schema({**base, "lite": True})["lite"] is True
    with pytest.raises(vol.Invalid):
        schema({**base, "lite": "yes please"})
    with pytest.raises(vol.Invalid):
        schema({**base, "slim": True})
