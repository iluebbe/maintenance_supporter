"""Frontend module registration for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from ..const import CARD_URL

_LOGGER = logging.getLogger(__name__)

DATA_EXTRA_MODULE_URL = "frontend_extra_module_url"

_CARD_REGISTERED = False


async def async_register_card(hass: HomeAssistant) -> None:
    """Register the Lovelace card JS module."""
    global _CARD_REGISTERED  # noqa: PLW0603
    if _CARD_REGISTERED:
        return

    card_path = Path(__file__).parent / "maintenance-card.js"

    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(card_path), False)]
    )

    # Add to extra module URLs so HA auto-loads it in the frontend
    hass.data.setdefault(DATA_EXTRA_MODULE_URL, set()).add(CARD_URL)

    _CARD_REGISTERED = True
    _LOGGER.debug("Maintenance Supporter Lovelace card registered at %s", CARD_URL)
