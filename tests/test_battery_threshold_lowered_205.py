"""#205: a lowered battery threshold releases the batteries it no longer counts.

The low latch (#180) holds a battery that went low until it reads above the
recovered level (50 %) or a replacement is recorded — so a battery that
rebounds while idle stays on the list. It also held batteries after the user
LOWERED the threshold (20 % → 10 %, to match Battery Notes): a 15 % battery
stayed "to replace", its to-dos open. The latch now keeps the threshold it
latched at; a threshold lowered since then is a decision, not a hover, and a
battery above the new one is released at once (never as a recorded
replacement). The hub's in-memory band follows the same rule. A latch from
before (no threshold of its own) is taken to have latched at the household
default, 20 %.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import CONF_BATTERY_LOW_PERCENT, CONF_TASKS, DOMAIN, STORES_CACHE_KEY
from custom_components.maintenance_supporter.helpers.battery_fleet import (
    LOW_LATCH_KEY,
    Battery,
    apply_low_latch,
    sanitize_low_latch,
)
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import LOW_COUNT_ENTITY_ID

from .conftest import call_ws_handler, make_global_entry, make_ws_connection, setup_integration


def _bat(level: float | None, threshold: float, *, low: bool | None = None, available: bool = True) -> Battery:
    is_low = (level is not None and level <= threshold) if low is None else low
    return Battery("sensor.remote", "Remote", "CR2032", 1, is_low, level, None, available=available, low_threshold=threshold)


def _step(bat: Battery, latch: dict[str, Any], released: list[str] | None = None) -> bool:
    return apply_low_latch([bat], latch, recovered=50, now_iso="t", released_by_level=released)


def test_a_lowered_threshold_releases_a_battery_above_it() -> None:
    latch: dict[str, Any] = {}
    _step(_bat(18, 20), latch)
    assert latch["sensor.remote"]["threshold"] == 20.0
    released: list[str] = []
    b = _bat(15, 10)
    assert _step(b, latch, released) is True
    assert latch == {} and not b.low
    assert released == [], "a threshold change is no replacement: nothing is recorded"


def test_low_at_the_new_threshold_belongs_to_it() -> None:
    """Low again under the lowered threshold: the episode is the new one's,
    and a rebound after it is held as always."""
    latch: dict[str, Any] = {}
    _step(_bat(18, 20), latch)
    _step(_bat(8, 10), latch)
    assert latch["sensor.remote"]["threshold"] == 10.0
    b = _bat(15, 10)
    _step(b, latch)
    assert b.low and b.latched, "a rebound above the threshold it went low at is held"


def test_a_rebound_without_a_threshold_change_is_still_held() -> None:
    latch: dict[str, Any] = {}
    _step(_bat(18, 20), latch)
    b = _bat(35, 20)
    assert _step(b, latch) is False
    assert b.low and b.latched


def test_a_latch_from_before_counts_as_latched_at_the_default() -> None:
    # Lowered floor: the old latch is released above it.
    latch: dict[str, Any] = {"sensor.remote": {"at": "t0", "last_replaced": None}}
    b = _bat(15, 10)
    assert _step(b, latch) is True and latch == {} and not b.low
    # Unchanged floor: the old latch keeps doing its job, now with its threshold.
    latch = {"sensor.remote": {"at": "t0", "last_replaced": None}}
    b = _bat(35, 20)
    assert _step(b, latch) is True
    assert b.low and latch["sensor.remote"]["threshold"] == 20.0
    # A Battery Notes threshold above the default is what it latched at.
    latch = {"sensor.remote": {"at": "t0", "last_replaced": None}}
    b = _bat(35, 30)
    _step(b, latch)
    assert b.low and latch["sensor.remote"]["threshold"] == 30.0


def test_no_reading_is_no_release() -> None:
    latch: dict[str, Any] = {}
    _step(_bat(18, 20), latch)
    b = _bat(None, 10, low=False, available=False)
    # read_batteries names a level sensor eligible even while it is offline
    apply_low_latch([b], latch, recovered=50, now_iso="t", eligible={"sensor.remote"})
    assert b.low and "sensor.remote" in latch


def test_a_raised_threshold_follows_the_episode() -> None:
    latch: dict[str, Any] = {}
    _step(_bat(18, 20), latch)
    _step(_bat(25, 30), latch)
    assert latch["sensor.remote"]["threshold"] == 30.0
    b = _bat(25, 20)
    _step(b, latch)
    assert not b.low and latch == {}, "lowered back below 25 %: released"


def test_the_backup_carries_the_threshold() -> None:
    raw = {
        "sensor.a": {"at": "2026-09-20T08:00:00+00:00", "last_replaced": None, "threshold": 20},
        "sensor.b": {"at": "2026-09-20T08:00:00+00:00", "last_replaced": None, "threshold": "x"},
        "sensor.c": {"at": "2026-09-20T08:00:00+00:00", "last_replaced": None, "threshold": 150},
    }
    out = sanitize_low_latch(raw)
    assert out["sensor.a"]["threshold"] == 20.0
    assert "threshold" not in out["sensor.b"] and "threshold" not in out["sensor.c"]


# ─── the reported case, end to end ──────────────────────────────────────────


REMOTE = "sensor.remote_battery_plus"


def _remote(hass: HomeAssistant, level: float) -> None:
    """A Battery Notes battery whose own threshold is 10 % (the user's
    Battery Notes default)."""
    hass.states.async_set(
        REMOTE,
        str(level),
        {
            "device_class": "battery",
            "battery_type": "CR2032",
            "battery_quantity": 1,
            "battery_low": level <= 10,
            "battery_low_threshold": 10,
            "device_name": "Remote",
        },
    )


async def test_lowering_the_floor_clears_the_batteries_above_it(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    g = make_global_entry(hass, minor_version=6, options={CONF_BATTERY_LOW_PERCENT: 20})
    _remote(hass, 15)
    await setup_integration(hass, g)
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    await hass.async_block_till_done()
    assert hass.states.get(LOW_COUNT_ENTITY_ID).state == "1", "15 % is low under the 20 % floor"

    hass.config_entries.async_update_entry(g, options={**g.options, CONF_BATTERY_LOW_PERCENT: 10})
    await hass.async_block_till_done()

    assert hass.states.get(LOW_COUNT_ENTITY_ID).state == "0", "above the new 10 % floor: off the list at once"
    fleet = next(e for e in hass.config_entries.async_entries(DOMAIN) if (e.data.get("object") or {}).get("battery_fleet"))
    task_id = next(iter(fleet.data[CONF_TASKS]))
    latch = hass.data[STORES_CACHE_KEY][fleet.entry_id].get_task_state(task_id).get(LOW_LATCH_KEY) or {}
    assert REMOTE not in latch

    # Really low under the new floor: on the list again.
    _remote(hass, 9)
    hass.config_entries.async_update_entry(g, options={**g.options, CONF_BATTERY_LOW_PERCENT: 10, "battery_recovered_percent": 50})
    await hass.async_block_till_done()
    assert hass.states.get(LOW_COUNT_ENTITY_ID).state == "1"
