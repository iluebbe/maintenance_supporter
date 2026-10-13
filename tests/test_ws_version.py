"""maintenance_supporter/version — the stale-bundle handshake (roadmap guard 2)
and the update that waits for Home Assistant's restart (helpers/update_state)."""

from __future__ import annotations

import json
from pathlib import Path
from types import SimpleNamespace
from typing import Any
from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers import update_state

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration

_MANIFEST = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter" / "manifest.json"
_VERSION = json.loads(_MANIFEST.read_text(encoding="utf-8"))["version"]


async def _version(hass: HomeAssistant) -> dict[str, Any]:
    from custom_components.maintenance_supporter.websocket.io import ws_version

    conn = make_ws_connection()
    await call_ws_handler(ws_version, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    result: dict[str, Any] = conn.send_result.call_args[0][1]
    return result


async def _setup(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)


async def test_ws_version_reports_manifest_version(hass: HomeAssistant) -> None:
    await _setup(hass)
    assert hass.data[update_state.RUNNING_VERSION_KEY] == _VERSION
    assert await _version(hass) == {"version": _VERSION, "installed_version": _VERSION, "restart_pending": False}


async def test_an_update_on_disk_waits_for_the_restart(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    """HACS replaced the files, and Home Assistant's integration cache already
    reports the new version (seen on a real install, 2026-10-12), while the
    code in memory is the one the run imported: the answer keeps the running
    version and says a restart is pending — also after a later setup in the
    same run (uninstall, reinstall)."""
    await _setup(hass)
    newer = tmp_path / "manifest.json"
    newer.write_text(json.dumps({"domain": DOMAIN, "version": "9.9.9"}), encoding="utf-8")
    monkeypatch.setattr(update_state, "_MANIFEST", newer)
    monkeypatch.setattr(update_state, "async_get_integration", AsyncMock(return_value=SimpleNamespace(version="9.9.9")))
    await update_state.async_remember_running_version(hass)

    assert await _version(hass) == {"version": _VERSION, "installed_version": "9.9.9", "restart_pending": True}


@pytest.mark.parametrize("content", [None, "{not json", json.dumps({"domain": DOMAIN})])
async def test_an_unreadable_manifest_is_no_pending_restart(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch, tmp_path: Path, content: str | None
) -> None:
    await _setup(hass)
    manifest = tmp_path / "manifest.json"
    if content is not None:
        manifest.write_text(content, encoding="utf-8")
    monkeypatch.setattr(update_state, "_MANIFEST", manifest)

    assert await _version(hass) == {"version": _VERSION, "installed_version": None, "restart_pending": False}
