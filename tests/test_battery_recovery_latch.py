"""#180: the battery fleet's low-recovery latch (hysteresis).

A Hue dimmer's level oscillated around the low floor several times a day;
the low-count sensor flipped 0 ↔ 1 and the fleet task — auto-complete on
recovery — recorded a "completion" on every dip. A level-driven battery that
went low now stays counted low until its level rises ABOVE
``battery_recovered_percent`` (global setting, default 50) or a replacement
is recorded (Battery Notes' ``battery_last_replaced`` moves forward, the
Replaced action, the record-replacement command). Level-less rows (binary
low-only) keep their plain on/off behaviour. The latch is persisted on the
fleet task's Store state.
"""

from __future__ import annotations

from datetime import date

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    BATTERY_RECOVERED_PERCENT_RANGE,
    CONF_BATTERY_LOW_PERCENT,
    CONF_BATTERY_RECOVERED_PERCENT,
    DEFAULT_BATTERY_RECOVERED_PERCENT,
)
from custom_components.maintenance_supporter.helpers.battery_fleet import (
    LOW_LATCH_KEY,
    Battery,
    _detect_unrecorded_jump,
    apply_low_latch,
    compute_overview,
    get_battery_recovered_percent,
    read_batteries,
)

from .conftest import call_ws_handler, make_global_entry, make_ws_connection, setup_integration

PLUS = "sensor.dimmer_battery_plus"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    # Low floor 5 % so 4 % is low and 6 / 8 % are not — the Hue dimmer's
    # oscillation band from the issue. Recovery threshold = default 50.
    return make_global_entry(hass, minor_version=6, options={CONF_BATTERY_LOW_PERCENT: 5})


def _level(hass: HomeAssistant, level: float, *, low: bool, last: str | None = None, eid: str = PLUS, name: str = "Dimmer") -> None:
    hass.states.async_set(
        eid,
        str(level),
        {
            "device_class": "battery",
            "battery_type": "AAA",
            "battery_quantity": 1,
            "battery_low": low,
            "battery_low_threshold": 5,
            "device_name": name,
            **({"battery_last_replaced": last} if last else {}),
        },
    )


async def _fleet(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args


def _latch_state(hass: HomeAssistant) -> dict:
    from custom_components.maintenance_supporter.helpers.battery_lifetime import fleet_store_and_task

    found = fleet_store_and_task(hass)
    assert found is not None
    store, task_id = found
    return dict(store.get_task_state(task_id).get(LOW_LATCH_KEY) or {})


async def test_oscillation_around_the_floor_stays_one_low_episode(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    _level(hass, 4, low=True)
    await _fleet(hass)

    assert compute_overview(hass).low_count == 1
    assert PLUS in _latch_state(hass)  # persisted on the fleet task's state

    # 4 → 6 → 4 → 8: the reading leaves the floor twice, the count never flips.
    for level, raw_low in ((6, False), (4, True), (8, False)):
        _level(hass, level, low=raw_low)
        ov = compute_overview(hass)
        assert ov.low_count == 1, f"at {level} %"
        assert dict(ov.needs_now) == {"AAA": 1}, f"at {level} %"
        (row,) = ov.low
        assert row["latched"] is (not raw_low)
        assert row["level"] == level
    # Even well above the floor but below the recovery threshold it stays low.
    _level(hass, 30, low=False)
    assert compute_overview(hass).low_count == 1

    # Rising ABOVE battery_recovered_percent (50) releases it.
    _level(hass, 55, low=False)
    ov = compute_overview(hass)
    assert ov.low_count == 0 and dict(ov.needs_now) == {}
    assert PLUS not in _latch_state(hass)
    # …and 50 exactly would NOT have (strictly above).
    _level(hass, 4, low=True)
    assert compute_overview(hass).low_count == 1
    _level(hass, 50, low=False)
    assert compute_overview(hass).low_count == 1


async def test_recorded_replacement_releases_at_any_level(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    _level(hass, 4, low=True, last="2025-01-10T09:00:00+00:00")
    await _fleet(hass)
    assert compute_overview(hass).low_count == 1

    # The level only crawls to 8 %, but Battery Notes now carries a newer
    # last-replaced date: the user recorded a swap → released.
    _level(hass, 8, low=False, last="2026-09-12T09:00:00+00:00")
    ov = compute_overview(hass)
    assert ov.low_count == 0
    assert PLUS not in _latch_state(hass)

    # The fresh cell reading low AGAIN (a bad cell) is a NEW episode.
    _level(hass, 4, low=True, last="2026-09-12T09:00:00+00:00")
    assert compute_overview(hass).low_count == 1
    assert _latch_state(hass)[PLUS]["last_replaced"] == "2026-09-12"


async def test_unavailable_reading_is_no_recovery(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    _level(hass, 4, low=True, last="2025-01-10T09:00:00+00:00")
    await _fleet(hass)
    assert compute_overview(hass).low_count == 1
    # Offline: Battery Notes retains battery_low=False from the last 6 % read;
    # the latch keeps it counted (the sensor's sticky rule agrees).
    hass.states.async_set(
        PLUS,
        "unavailable",
        {"device_class": "battery", "battery_type": "AAA", "battery_quantity": 1, "battery_low": False, "device_name": "Dimmer", "battery_last_replaced": "2025-01-10T09:00:00+00:00"},
    )
    ov = compute_overview(hass)
    assert ov.low_count == 1 and ov.low[0]["latched"] is True


async def test_level_less_binary_keeps_plain_on_off(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    attrs = {"device_class": "battery", "battery_type": "CR123A", "battery_quantity": 1, "device_name": "Lock"}
    hass.states.async_set("binary_sensor.lock_battery_plus_low", "on", {**attrs, "battery_low": True})
    await _fleet(hass)
    assert compute_overview(hass).low_count == 1
    # "off" IS the all-clear — no percentage to wait for, no latch entry.
    hass.states.async_set("binary_sensor.lock_battery_plus_low", "off", {**attrs, "battery_low": False})
    assert compute_overview(hass).low_count == 0
    assert _latch_state(hass) == {}


async def test_mark_replaced_releases_the_latch_immediately(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from pytest_homeassistant_custom_component.common import async_mock_service

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import async_mark_replaced

    await setup_integration(hass, global_entry)
    _level(hass, 4, low=True)
    hass.states.async_set("button.dimmer_battery_replaced", "unknown")
    await _fleet(hass)
    _level(hass, 8, low=False)
    assert compute_overview(hass).low_count == 1
    async_mock_service(hass, "button", "press")
    res = await async_mark_replaced(hass)
    assert res["pressed"] == 1
    # Released right away — no waiting for Battery Notes to echo the date.
    assert PLUS not in _latch_state(hass)
    assert compute_overview(hass).low_count == 0


async def test_latch_survives_without_a_fleet_in_memory(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The low-count sensor exists before any fleet: the latch then lives in
    memory instead of a Store, with the same behaviour."""
    await setup_integration(hass, global_entry)
    _level(hass, 4, low=True)
    assert [b.low for b in read_batteries(hass)] == [True]
    _level(hass, 8, low=False)
    assert [b.low for b in read_batteries(hass)] == [True]
    _level(hass, 80, low=False)
    assert [b.low for b in read_batteries(hass)] == [False]


def test_pure_latch_rules() -> None:
    def bat(low: bool, level: float | None, *, available: bool = True, last: date | None = None) -> Battery:
        return Battery("sensor.a", "A", "AA", 1, low, level, last, available=available)

    latch: dict = {}
    b = bat(True, 4)
    assert apply_low_latch([b], latch, recovered=50, now_iso="t0") is True
    assert latch == {"sensor.a": {"at": "t0", "last_replaced": None}}
    # held below the threshold, released above
    b = bat(False, 30)
    assert apply_low_latch([b], latch, recovered=50, now_iso="t1") is False and b.low and b.latched
    b = bat(False, 51)
    assert apply_low_latch([b], latch, recovered=50, now_iso="t2") is True and not b.low and latch == {}
    # a battery that vanished from the fleet loses its entry
    latch = {"sensor.gone": {"at": "t0", "last_replaced": None}}
    assert apply_low_latch([bat(False, 90)], latch, recovered=50, now_iso="t3") is True and latch == {}
    # a sensorless note is never latched (its forecast decides low)
    latch = {}
    ns = bat(True, None)
    ns.no_sensor = True
    assert apply_low_latch([ns], latch, recovered=50, now_iso="t4") is False and latch == {}


async def test_setting_range_default_and_echo(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.settings_registry import int_range, setting_default
    from custom_components.maintenance_supporter.websocket.dashboard import _build_full_settings, sanitize_settings_input

    assert BATTERY_RECOVERED_PERCENT_RANGE == (20, 100)
    assert int_range(CONF_BATTERY_RECOVERED_PERCENT) == (20, 100)
    assert setting_default(CONF_BATTERY_RECOVERED_PERCENT) == DEFAULT_BATTERY_RECOVERED_PERCENT == 50
    assert _build_full_settings({})["general"]["battery_recovered_percent"] == 50
    assert _build_full_settings({CONF_BATTERY_RECOVERED_PERCENT: 70})["general"]["battery_recovered_percent"] == 70
    # The sanitiser keeps in-range ints and drops the rest.
    assert sanitize_settings_input({CONF_BATTERY_RECOVERED_PERCENT: 60})[0] == {CONF_BATTERY_RECOVERED_PERCENT: 60}
    assert sanitize_settings_input({CONF_BATTERY_RECOVERED_PERCENT: 10})[0] == {}
    assert sanitize_settings_input({CONF_BATTERY_RECOVERED_PERCENT: 101})[0] == {}
    # The runtime reader: option, junk, out of range.
    entry = make_global_entry(hass, minor_version=6, options={CONF_BATTERY_RECOVERED_PERCENT: 60})
    assert get_battery_recovered_percent(hass) == 60
    hass.config_entries.async_update_entry(entry, options={CONF_BATTERY_RECOVERED_PERCENT: "x"})
    assert get_battery_recovered_percent(hass) == 50
    hass.config_entries.async_update_entry(entry, options={CONF_BATTERY_RECOVERED_PERCENT: 5})
    assert get_battery_recovered_percent(hass) == 50


async def test_recovered_percent_is_honoured_by_the_latch(hass: HomeAssistant) -> None:
    make_global_entry(hass, minor_version=6, options={CONF_BATTERY_LOW_PERCENT: 5, CONF_BATTERY_RECOVERED_PERCENT: 30})
    _level(hass, 4, low=True)
    assert [b.low for b in read_batteries(hass)] == [True]
    _level(hass, 31, low=False)
    assert [b.low for b in read_batteries(hass)] == [False]


def test_jump_detection_ignores_rises_below_the_recovery_threshold() -> None:
    """#181 noise: a bounce that never lands above battery_recovered_percent
    is not a swap — the calendar-sync chip kept offering "newer dates"."""
    t0, t1 = 1_700_000_000.0, 1_700_043_200.0
    # +30 points, but 45 % is still below the 50 % recovery threshold.
    assert _detect_unrecorded_jump([(t0, 15.0), (t1, 45.0)], None, recovered=50) is None
    # The same rise landing above it IS a swap.
    jump = _detect_unrecorded_jump([(t0, 15.0), (t1, 60.0)], None, recovered=50)
    assert jump == {"at": round(t1), "from": 15.0, "to": 60.0}
    # Without a threshold the old rule (>= 25 points) still applies.
    assert _detect_unrecorded_jump([(t0, 15.0), (t1, 45.0)], None) is not None
