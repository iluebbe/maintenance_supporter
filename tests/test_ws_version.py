"""maintenance_supporter/version — the stale-bundle handshake (roadmap guard 2)."""

from __future__ import annotations

import json
from pathlib import Path

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration

_MANIFEST = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter" / "manifest.json"


async def test_ws_version_reports_manifest_version(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)

    from custom_components.maintenance_supporter.websocket.io import ws_version

    conn = make_ws_connection()
    await call_ws_handler(ws_version, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    result = conn.send_result.call_args[0][1]
    manifest_version = json.loads(_MANIFEST.read_text(encoding="utf-8"))["version"]
    assert result == {"version": manifest_version}
