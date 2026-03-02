"""Frontend module registration for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from ..const import CARD_URL, DOMAIN

_LOGGER = logging.getLogger(__name__)

DATA_EXTRA_MODULE_URL = "frontend_extra_module_url"


async def async_register_card(hass: HomeAssistant) -> None:
    """Register the Lovelace card JS module."""
    if hass.data.get(DOMAIN, {}).get("_card_registered"):
        return

    card_path = Path(__file__).parent / "maintenance-card.js"

    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(card_path), False)]
    )

    # Add to extra module URLs so HA auto-loads it in the frontend
    hass.data.setdefault(DATA_EXTRA_MODULE_URL, set()).add(CARD_URL)

    hass.data.setdefault(DOMAIN, {})["_card_registered"] = True
    _LOGGER.debug("Maintenance Supporter Lovelace card registered at %s", CARD_URL)
