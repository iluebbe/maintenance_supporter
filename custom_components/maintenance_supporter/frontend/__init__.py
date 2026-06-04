"""Frontend module registration for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from ..const import (
    CALENDAR_CARD_URL,
    CARD_URL,
    DOMAIN,
    STRATEGY_CHUNKS_URL,
    STRATEGY_SHIM_URL,
    STRATEGY_URL,
)

_LOGGER = logging.getLogger(__name__)

DATA_EXTRA_MODULE_URL = "frontend_extra_module_url"


async def async_register_card(hass: HomeAssistant) -> None:
    """Register the Lovelace card + dashboard strategy JS modules.

    Card: works on every supported HA version.
    Strategy: HA 2026.5+ picks it up via ``window.customStrategies``; on older
    versions the registration is a silent no-op. We ship both unconditionally
    so users on any version get the card and 2026.5+ users additionally get
    the auto-generated dashboard in the "Add Dashboard" picker.
    """
    if hass.data.get(DOMAIN, {}).get("_card_registered"):
        return

    frontend_dir = Path(__file__).parent
    # v2.3.4 (issue #52): the strategy is a multi-file split bundle living
    # in frontend/strategy/. Mount the directory under STRATEGY_DIR_URL so
    # the entry's relative ./chunks/* dynamic imports resolve without per-
    # chunk URL registration. The entry file URL stays STRATEGY_URL so the
    # frontend_extra_module_url registration that HA serves to the browser
    # doesn't need to know about the chunk layout.
    static_paths = [
        StaticPathConfig(CARD_URL, str(frontend_dir / "maintenance-card.js"), False),
        # The shim (tiny, zero-import) is the frontend extra-module-url; it
        # lazy-imports the full strategy bundle below on first use.
        StaticPathConfig(
            STRATEGY_SHIM_URL,
            str(frontend_dir / "maintenance-strategy-shim.js"),
            False,
        ),
        StaticPathConfig(
            STRATEGY_URL,
            str(frontend_dir / "strategy" / "maintenance-dashboard-strategy.js"),
            False,
        ),
        StaticPathConfig(
            STRATEGY_CHUNKS_URL,
            str(frontend_dir / "strategy" / "chunks"),
            False,
        ),
        StaticPathConfig(
            CALENDAR_CARD_URL,
            str(frontend_dir / "maintenance-calendar-card.js"),
            False,
        ),
    ]
    await hass.http.async_register_static_paths(static_paths)

    # Add to extra module URLs so HA auto-loads them in the frontend.
    # IMPORTANT: register the SHIM, not the heavy strategy bundle — the shim
    # defines the dashboard-strategy element synchronously so it wins HA's 5 s
    # whenDefined race even under heavy HACS plugin load (the bundle is loaded
    # lazily by the shim). The heavy bundle's static path stays mounted above
    # so the shim's import() can fetch it on demand.
    extra = hass.data.setdefault(DATA_EXTRA_MODULE_URL, set())
    extra.add(CARD_URL)
    extra.add(STRATEGY_SHIM_URL)
    extra.add(CALENDAR_CARD_URL)

    hass.data.setdefault(DOMAIN, {})["_card_registered"] = True
    _LOGGER.debug(
        "Maintenance Supporter frontend resources registered: card=%s, strategy=%s, calendar=%s",
        CARD_URL, STRATEGY_URL, CALENDAR_CARD_URL,
    )
