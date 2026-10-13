"""An update installed on disk that Home Assistant does not run yet.

HACS (or a manual copy) replaces this integration's files while Home
Assistant keeps running the code it imported at start. Until the restart, a
module imported for the first time loads the NEW file next to the OLD ones in
memory, and a call between them can fail with an AttributeError that the
frontend only shows as "Unknown error" (2026-10-12: the complete dialog after
an update from 2.100.0 to 2.102.0). Home Assistant's own integration cache
already reports the version on disk by then, so the running one is noted here
once per run, and the panel asks for both.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from ..const import DOMAIN

# Top-level hass.data key: it must outlive the hass.data[DOMAIN] pop when the
# last entry unloads (the code in memory stays the same until a restart).
RUNNING_VERSION_KEY = f"{DOMAIN}_running_version"

_MANIFEST = Path(__file__).resolve().parent.parent / "manifest.json"


async def async_remember_running_version(hass: HomeAssistant) -> None:
    """Note the version this run imported (the first setup of the run)."""
    if RUNNING_VERSION_KEY in hass.data:
        return
    integration = await async_get_integration(hass, DOMAIN)
    hass.data[RUNNING_VERSION_KEY] = str(integration.version or "")


def read_installed_version() -> str | None:
    """The version in manifest.json on disk now (blocking: run in the executor)."""
    try:
        version = json.loads(_MANIFEST.read_text(encoding="utf-8"))["version"]
    except (OSError, ValueError, KeyError, TypeError):
        return None
    return str(version) if version else None


async def async_version_state(hass: HomeAssistant) -> dict[str, Any]:
    """The running version, the installed one, and whether they differ."""
    running = hass.data.get(RUNNING_VERSION_KEY)
    if not running:
        running = str((await async_get_integration(hass, DOMAIN)).version or "")
    installed = await hass.async_add_executor_job(read_installed_version)
    return {
        "version": running,
        "installed_version": installed,
        "restart_pending": bool(installed and running and installed != running),
    }
