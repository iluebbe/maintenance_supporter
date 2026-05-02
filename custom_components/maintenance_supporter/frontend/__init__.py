"""Frontend module registration for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from ..const import CARD_URL, DOMAIN, STRATEGY_URL

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
    static_paths = [
        StaticPathConfig(CARD_URL, str(frontend_dir / "maintenance-card.js"), False),
        StaticPathConfig(
            STRATEGY_URL,
            str(frontend_dir / "maintenance-dashboard-strategy.js"),
            False,
        ),
    ]
    await hass.http.async_register_static_paths(static_paths)

    # Add to extra module URLs so HA auto-loads them in the frontend
    extra = hass.data.setdefault(DATA_EXTRA_MODULE_URL, set())
    extra.add(CARD_URL)
    extra.add(STRATEGY_URL)

    hass.data.setdefault(DOMAIN, {})["_card_registered"] = True
    _LOGGER.debug(
        "Maintenance Supporter frontend resources registered: card=%s, strategy=%s",
        CARD_URL, STRATEGY_URL,
    )
