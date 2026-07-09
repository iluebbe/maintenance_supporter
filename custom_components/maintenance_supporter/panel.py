"""Sidebar panel registration for the Maintenance Supporter integration."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PANEL_ICON, PANEL_NAME, PANEL_URL
from .helpers.global_options import get_panel_title

_LOGGER = logging.getLogger(__name__)


async def _async_file_hash(hass: HomeAssistant, path: Path) -> str:
    """Return a short hash of a file for cache busting."""
    try:
        content = await hass.async_add_executor_job(path.read_bytes)
        return hashlib.sha256(content).hexdigest()[:8]
    except OSError:
        return "0"


async def async_register_panel(hass: HomeAssistant, *, force: bool = False) -> None:
    """Register the maintenance supporter sidebar panel.

    Pass ``force=True`` to re-register an already-registered panel (e.g. after
    the user changes the sidebar title in options) — HA's panel registry has no
    in-place update, so we remove and re-add it.
    """
    title = get_panel_title(hass)
    if hass.data.get(DOMAIN, {}).get("_panel_registered"):
        if not force:
            return
        # The ONLY global-options change that needs a re-register is the
        # sidebar title — HA has no in-place panel update. If the title is
        # unchanged, return early: calling async_remove_panel on every
        # unrelated settings change (feature toggles, objects-table columns,
        # notification prefs, …) yanks the panel out from under anyone
        # currently viewing it and bounces them to the HA default dashboard.
        if hass.data.get(DOMAIN, {}).get("_panel_title") == title:
            return
        # Title changed: drop the existing registration so the re-register
        # below doesn't raise "Overwriting panel".
        frontend.async_remove_panel(hass, PANEL_NAME)
        hass.data.setdefault(DOMAIN, {})["_panel_registered"] = False

    panel_path = Path(__file__).parent / "frontend" / "maintenance-panel.js"
    version = await _async_file_hash(hass, panel_path)
    versioned_url = f"{PANEL_URL}_{version}"

    # Static path is registered once per versioned URL; on a forced re-register
    # the URL is unchanged (same bundle hash), so guard against re-adding it.
    if hass.data.get(DOMAIN, {}).get("_panel_static_url") != versioned_url:
        await hass.http.async_register_static_paths([StaticPathConfig(versioned_url, str(panel_path), False)])
        hass.data.setdefault(DOMAIN, {})["_panel_static_url"] = versioned_url

    # Idempotency against HA's ACTUAL panel registry — our `_panel_registered`
    # flag lives in hass.data[DOMAIN], which is popped when the last entry
    # unloads, so it desyncs from HA's frontend on a reinstall or a repair that
    # recreates the deleted global entry. Registering over a panel HA still
    # holds raises "Overwriting panel" and fails the whole global entry setup
    # (#86, 2nd report). Drop any stale registration first so this can't happen.
    if PANEL_NAME in hass.data.get(frontend.DATA_PANELS, {}):
        frontend.async_remove_panel(hass, PANEL_NAME, warn_if_unknown=False)

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_NAME,
        webcomponent_name="maintenance-supporter-panel",
        sidebar_title=title,
        sidebar_icon=PANEL_ICON,
        module_url=versioned_url,
        require_admin=False,
        config={},
    )

    hass.data.setdefault(DOMAIN, {})["_panel_registered"] = True
    hass.data.setdefault(DOMAIN, {})["_panel_title"] = title
    _LOGGER.debug(
        "Maintenance Supporter sidebar panel registered (title=%s, v=%s)",
        title,
        version,
    )


async def async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove the maintenance supporter sidebar panel."""
    # Remove when EITHER our flag says so OR HA's actual registry still holds the
    # panel. Reconciling with the real registry (not just the flag, which is lost
    # when hass.data[DOMAIN] is popped on last-entry unload) means deleting the
    # global entry can't leave a dead sidebar panel behind.
    flagged = bool(hass.data.get(DOMAIN, {}).get("_panel_registered"))
    in_registry = PANEL_NAME in hass.data.get(frontend.DATA_PANELS, {})
    if not flagged and not in_registry:
        return

    frontend.async_remove_panel(hass, PANEL_NAME, warn_if_unknown=False)
    hass.data.setdefault(DOMAIN, {})["_panel_registered"] = False
    _LOGGER.debug("Maintenance Supporter sidebar panel removed")
