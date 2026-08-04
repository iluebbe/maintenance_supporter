"""Dev-only battery fixtures for the ha-maint container.

Battery-Notes-SHAPED battery sensors on REAL registry devices — the piece
REST-seeded states cannot provide (no registry entry → no device). They make
the fleet's device-dependent paths live-testable in Docker: the
unrecorded-swap detector (needs a resolvable source device), the rechargeable
charging icon, and per-note low thresholds.

Mounted into /config/custom_components by docker/compose.yaml; never part of
the shipped integration.
"""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

DOMAIN = "dev_battery_fixtures"
PLATFORMS = ["sensor"]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
