"""Demo stand-in for the Roborock integration — docs screenshots and GIFs only.

Mounted into the throwaway ``ha-shots`` container as
``/config/custom_components/roborock`` (see e2e/shots-demo.mjs). Two robots
whose consumable countdowns and reset buttons carry the SAME translation keys
as the core integration, so the Suggested setups catalog matches them exactly
like real Roborock devices: discovery proposes the duties, adopting wires the
reset buttons, and completing a task presses the button — which puts the
counter back to its full life here, like the real robot does. The reset
buttons ship disabled, like core.

Never shipped: HACS packages custom_components/maintenance_supporter only.
"""

from __future__ import annotations

import os
from datetime import datetime

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

DOMAIN = "roborock"
PLATFORMS = [Platform.SENSOR, Platform.BUTTON]
SIGNAL = "roborock_demo_update"

# robot -> (device name, {consumable: (full life h, current h left)})
ROBOTS = {
    "s8": ("Roborock S8", {"main_brush": (300, 150), "side_brush": (200, 140), "air_filter": (150, 90), "sensor": (30, 25)}),
    "q7": ("Roborock Q7", {"main_brush": (300, 3), "side_brush": (200, 120), "air_filter": (150, 4), "sensor": (30, 20)}),
}
# survives entry reloads (enabling a button reloads the entry); a restart of
# Home Assistant starts from the values above again
VALUES: dict[tuple[str, str], float] = {(r, c): left for r, (_, cons) in ROBOTS.items() for c, (_, left) in cons.items()}

# ROBOROCK_DEMO_WEAR=1 (the faketime timelapse, e2e/timelapse/run.mjs): the
# countdowns run with the clock like a robot that cleans an hour a day —
# hours left drop by one per day since the last reset. Off (the docs shots),
# the values stay put.
WEAR = os.environ.get("ROBOROCK_DEMO_WEAR") == "1"
RESET_AT: dict[tuple[str, str], datetime] = {}


def hours_left(key: tuple[str, str]) -> float:
    if not WEAR:
        return VALUES[key]
    anchor = RESET_AT.setdefault(key, dt_util.utcnow())
    return max(0.0, round(VALUES[key] - (dt_util.utcnow() - anchor).total_seconds() / 86400, 1))


def reset(key: tuple[str, str], full: float) -> None:
    VALUES[key] = full
    RESET_AT[key] = dt_util.utcnow()


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
