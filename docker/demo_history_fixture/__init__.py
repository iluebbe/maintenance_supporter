"""The docs demo's sensor history, written under a fake clock — docs only.

Loaded only in the throwaway container of e2e/demo-history.mjs: mounted there
as ``/config/custom_components/demo_history`` and switched on by a
``demo_history:`` line in that container's own copy of configuration.yaml.
That container runs Home Assistant under libfaketime with a clock that starts
weeks back and runs fast. While it runs, this module writes the demo's sensor
states, so the recorder holds real single states, as in a real home, and not
only the hourly statistics the screenshot seed imports. Every curve ends at
the value the docs show (the template sensors of the demo's
configuration.yaml, the battery states of e2e/shots-remainder3.mjs), so the
demo that starts afterwards without the fake clock continues the same line.

The robots of docker/demo_roborock_fixture wear down by themselves under the
same clock (ROBOROCK_DEMO_WEAR); this module adds their config entry and asks
for a fresh reading on every step.

Never shipped: HACS packages custom_components/maintenance_supporter only.
"""

from __future__ import annotations

import logging
import math
import os
from collections.abc import Callable
from datetime import datetime, timedelta
from typing import Any

import homeassistant.helpers.config_validation as cv
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType
from homeassistant.util import dt as dt_util

DOMAIN = "demo_history"
CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)
_LOGGER = logging.getLogger(__name__)

# Where the curves end: the moment the fake clock catches up with the real
# one (e2e/demo-history.mjs computes it from the clock's start and speed).
END = dt_util.parse_datetime(os.environ.get("DEMO_HISTORY_END", "")) or dt_util.utcnow()
# Writing stops this long before END: stopping the container takes a few real
# seconds, which are hours on the fast clock, and nothing may be recorded
# after the real now.
STOP_BEFORE = timedelta(hours=12)
# One step per real second (the interval timer runs on the real monotonic
# clock, DONT_FAKE_MONOTONIC=1): at 2880x speed a step is 48 minutes.
TICK = timedelta(seconds=1)
# The docs curves move over the last 30 days, like the statistics import.
WINDOW = 30.0
POOL_PUMP = "input_boolean.pool_pump_power"


def _ramp(days: float) -> float:
    """0 at the start of the window, 1 at its end."""
    return min(1.0, max(0.0, 1.0 - days / WINDOW))


def _hours(days: float) -> float:
    return days * 24.0


def _airflow(d: float) -> float:
    # The statistics import's curve: the filter clogs from 95 % to the 54.2 %
    # of the template, below the 60 % threshold (one TRIGGERED task).
    wiggle = 2.5 * math.sin(_hours(d) / 5) if d > 0.5 else 0.0
    return 95 - 40.8 * _ramp(d) + wiggle


def _pressure(d: float) -> float:
    return 1.15 + 0.22 * math.sin(_hours(d) / 9) + 0.08 * math.sin(_hours(d) / 3.1)


def _runtime(d: float) -> float:
    # 69.5 h in 30 days, the pool pump's 2 h 20 min a day (see _pump_on).
    return 187.5 - 69.5 * min(d, WINDOW) / WINDOW - max(0.0, d - WINDOW) * 2.3


def _patio(d: float) -> float:
    # The unrecorded-swap detector's case: a week at ~14 %, fresh cells,
    # then the normal decline to today's 55 %.
    if d >= 23:
        return 14 + 1.5 * math.sin(_hours(d) / 9) + max(0.0, d - WINDOW) * 0.6
    return 100 - 45 * (23 - d) / 23


def _linear(frm: float, to: float) -> Callable[[float], float]:
    return lambda d: to + (frm - to) * min(d, WINDOW) / WINDOW + max(0.0, d - WINDOW) * (frm - to) / WINDOW


# Template sensors of the demo's configuration.yaml: (curve, decimals). Their
# attributes (unit, state class, icon) are copied from the entity.
TEMPLATE_SENSORS: dict[str, tuple[Callable[[float], float], int]] = {
    "sensor.hvac_airflow": (_airflow, 1),
    "sensor.pump_pressure": (_pressure, 2),
    "sensor.pump_runtime": (_runtime, 1),
    "sensor.smoke_detector_hall_battery": (_linear(97, 78), 0),
    "sensor.smoke_detector_kitchen_battery": (_linear(98, 81), 0),
    "sensor.water_meter": (lambda d: 823.4 - 0.32 * d, 1),
}

# Battery-Notes-shaped states of e2e/shots-remainder3.mjs: slug -> (name,
# type, quantity, curve, months since the cells were put in). The levels end
# at the ones that script sets.
BATTERIES: dict[str, tuple[str, str, int, Callable[[float], float], int]] = {
    "hall_motion": ("Hall Motion", "CR2450", 1, _linear(86, 82), 9),
    "front_door_lock": ("Front Door Lock", "AA", 4, _linear(68, 61), 7),
    "garage_remote": ("Garage Remote", "CR2032", 1, _linear(16, 8), 13),
    "kitchen_smoke": ("Kitchen Smoke Alarm", "9V", 1, _linear(60, 34), 10),
    "bedroom_sensor": ("Bedroom Sensor", "AAA", 2, _linear(13, 6), 12),
    "patio_door": ("Patio Door", "CR2032", 1, _patio, 5),
    "utility_leak": ("Utility Leak Sensor", "CR2", 1, _linear(75, 71), 3),
    "office_remote": ("Office Remote", "AAA", 2, _linear(27, 18), 11),
    "video_doorbell": ("Video Doorbell", "Battery Pack", 1, _linear(85, 64), 6),
}


def _pump_on(now: datetime) -> bool:
    """The pool pump runs from 08:00 to 10:20 every day (Home Assistant's zone)."""
    local = dt_util.as_local(now)
    minutes = local.hour * 60 + local.minute
    return 8 * 60 <= minutes < 10 * 60 + 20


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    state: dict[str, Any] = {"day": None, "done": False, "busy": False, "unsub": None}

    async def _tick(_now: datetime) -> None:
        # A step that takes longer than the tick is not run twice at once.
        if state["done"] or state["busy"]:
            return
        state["busy"] = True
        try:
            await _step()
        finally:
            state["busy"] = False

    async def _step() -> None:
        now = dt_util.utcnow()
        if now >= END - STOP_BEFORE:
            state["done"] = True
            if state["unsub"]:
                state["unsub"]()
            await hass.services.async_call("input_boolean", "turn_off", {"entity_id": POOL_PUMP}, blocking=True)
            _LOGGER.warning("done at %s (end %s)", now.isoformat(), END.isoformat())
            return
        d = (END - now).total_seconds() / 86400
        for entity_id, (curve, digits) in TEMPLATE_SENSORS.items():
            current = hass.states.get(entity_id)
            if current is None:
                continue
            value = round(curve(d), digits)
            hass.states.async_set(entity_id, f"{value:.{digits}f}" if digits else str(int(value)), dict(current.attributes))
        for slug, (name, kind, qty, curve, months) in BATTERIES.items():
            level = round(curve(d))
            hass.states.async_set(
                f"sensor.{slug}_battery_plus",
                str(level),
                {
                    "device_class": "battery",
                    "unit_of_measurement": "%",
                    "battery_type": kind,
                    "battery_quantity": qty,
                    "battery_low": level <= 10,
                    "battery_last_replaced": (END - timedelta(days=30 * months)).isoformat(),
                    "device_name": name,
                    "friendly_name": f"{name} Battery",
                },
            )
        pump = hass.states.get(POOL_PUMP)
        want = _pump_on(now)
        if pump is not None and (pump.state == "on") != want:
            await hass.services.async_call("input_boolean", "turn_on" if want else "turn_off", {"entity_id": POOL_PUMP}, blocking=True)
        robots = [e.entity_id for e in er.async_entries_for_config_entry(er.async_get(hass), state.get("robot_entry", "")) if e.domain == "sensor"]
        if robots:
            await hass.services.async_call("homeassistant", "update_entity", {"entity_id": robots}, blocking=True)
        day = dt_util.as_local(now).date().isoformat()
        if day != state["day"]:
            state["day"] = day
            _LOGGER.warning("day %s", day)

    @callback
    def _started(_hass: HomeAssistant) -> None:
        hass.async_create_task(_start())

    async def _start() -> None:
        entries = hass.config_entries.async_entries("roborock")
        if not entries:
            await hass.config_entries.flow.async_init("roborock", context={"source": "user"})
            entries = hass.config_entries.async_entries("roborock")
        if entries:
            state["robot_entry"] = entries[0].entry_id
        _LOGGER.warning("start at %s, curves end %s", dt_util.utcnow().isoformat(), END.isoformat())
        state["unsub"] = async_track_time_interval(hass, _tick, TICK, cancel_on_shutdown=True)

    async_at_started(hass, _started)
    return True

