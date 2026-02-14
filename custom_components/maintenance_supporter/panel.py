"""Sidebar panel registration for the Maintenance Supporter integration."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import PANEL_ICON, PANEL_NAME, PANEL_TITLE, PANEL_URL

_LOGGER = logging.getLogger(__name__)

_PANEL_REGISTERED = False


async def _async_file_hash(hass: HomeAssistant, path: Path) -> str:
    """Return a short hash of a file for cache busting."""
    try:
        content = await hass.async_add_executor_job(path.read_bytes)
        return hashlib.md5(content).hexdigest()[:8]  # noqa: S324
    except OSError:
        return "0"


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the maintenance supporter sidebar panel."""
    global _PANEL_REGISTERED  # noqa: PLW0603
    if _PANEL_REGISTERED:
        return

    panel_path = Path(__file__).parent / "frontend" / "maintenance-panel.js"
    version = await _async_file_hash(hass, panel_path)
    versioned_url = f"{PANEL_URL}_{version}"

    await hass.http.async_register_static_paths(
        [StaticPathConfig(versioned_url, str(panel_path), False)]
    )

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_NAME,
        webcomponent_name="maintenance-supporter-panel",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=versioned_url,
        require_admin=False,
        config={},
    )

    _PANEL_REGISTERED = True
    _LOGGER.debug("Maintenance Supporter sidebar panel registered (v=%s)", version)


async def async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove the maintenance supporter sidebar panel."""
    global _PANEL_REGISTERED  # noqa: PLW0603
    if not _PANEL_REGISTERED:
        return

    frontend.async_remove_panel(hass, PANEL_NAME)
    _PANEL_REGISTERED = False
    _LOGGER.debug("Maintenance Supporter sidebar panel removed")
