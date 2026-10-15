"""Battery Notes 3.7.2: a note whose source goes unavailable loses its attributes.

Up to 3.7.1 a note's ``…_battery_plus`` read ``unknown`` while its source was
unavailable and kept its attributes (type, quantity, ``battery_low``, the
replacement date). From 3.7.2 it reads ``unavailable`` (unless the note's
*retain state* is on), and Home Assistant writes no attributes for an
unavailable entity. The fleet dropped such a battery completely, right when it
had most likely died and taken its device offline. The note's type sensor and
last-replaced sensor still carry its metadata; the low latch carries ``low``.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.helpers.battery_fleet import build_overview, read_batteries
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import async_record_replacement

SLUG = "hall_motion"
PLUS = f"sensor.{SLUG}_battery_plus"
LOW_BINARY = f"binary_sensor.{SLUG}_battery_plus_low"
SOURCE = f"sensor.{SLUG}_battery"
LAST = "2025-03-01T10:00:00+00:00"


def _note(hass: HomeAssistant, *, binary: bool = False, type_sensor: bool = True, last_replaced: bool = True) -> str:
    """A device with its own battery sensor and a Battery Notes note on it,
    registered as Battery Notes registers them (one unique_id + a suffix per
    entity). Returns the device id."""
    entry = MockConfigEntry(domain="test", data={})
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, identifiers={("test", SLUG)}, name="Hall Motion")
    reg = er.async_get(hass)
    reg.async_get_or_create("sensor", "test", f"{SLUG}_batt", suggested_object_id=f"{SLUG}_battery", device_id=device.id)
    if binary:
        reg.async_get_or_create("binary_sensor", "battery_notes", "note1_battery_low", suggested_object_id=f"{SLUG}_battery_plus_low", device_id=device.id)
    else:
        reg.async_get_or_create("sensor", "battery_notes", "note1_battery_plus", suggested_object_id=f"{SLUG}_battery_plus", device_id=device.id)
    reg.async_get_or_create("sensor", "battery_notes", "note1_battery_type", suggested_object_id=f"{SLUG}_battery_type", device_id=device.id)
    reg.async_get_or_create("sensor", "battery_notes", "note1_battery_last_replaced", suggested_object_id=f"{SLUG}_battery_last_replaced", device_id=device.id)
    if type_sensor:
        hass.states.async_set(f"sensor.{SLUG}_battery_type", "AAA×2", {"battery_type": "AAA", "battery_quantity": 2, "note": ""})
    if last_replaced:
        hass.states.async_set(f"sensor.{SLUG}_battery_last_replaced", LAST, {"device_class": "timestamp"})
    return device.id


def _attrs(*, low: bool, source: str = "") -> dict:
    """What Battery Notes writes while the note is available (``source_entity_id``
    is empty for a device note)."""
    return {
        "device_class": "battery",
        "unit_of_measurement": "%",
        "battery_type": "AAA",
        "battery_quantity": 2,
        "battery_low": low,
        "battery_low_threshold": 10,
        "battery_last_replaced": LAST,
        "source_entity_id": source,
        "device_name": "Hall Motion",
        "friendly_name": "Hall Motion Battery+",
    }


# What Home Assistant writes for an UNAVAILABLE entity: no extra attributes.
BARE = {"device_class": "battery", "unit_of_measurement": "%", "friendly_name": "Hall Motion Battery+"}


def _offline(hass: HomeAssistant, entity_id: str = PLUS) -> None:
    hass.states.async_set(SOURCE, "unavailable", {"device_class": "battery", "unit_of_measurement": "%"})
    hass.states.async_set(entity_id, "unavailable", BARE)


def _rows(hass: HomeAssistant):
    bats = read_batteries(hass)
    return bats, build_overview(bats, today=dt_util.now().date())


async def test_a_low_battery_that_takes_its_device_offline_stays_low_and_listed(hass: HomeAssistant) -> None:
    _note(hass)
    hass.states.async_set(SOURCE, "8", {"device_class": "battery", "unit_of_measurement": "%"})
    hass.states.async_set(PLUS, "8", _attrs(low=True))
    bats, ov = _rows(hass)
    assert [r["entity_id"] for r in ov.low] == [PLUS]

    _offline(hass)
    bats, ov = _rows(hass)
    assert len(bats) == 1, "one row: neither lost nor duplicated by the device's own sensor"
    bat = bats[0]
    assert bat.entity_id == PLUS and bat.source == "battery_notes"
    assert (bat.battery_type, bat.quantity, bat.device_name) == ("AAA", 2, "Hall Motion"), "from the type sensor and the device"
    assert bat.last_replaced is not None and bat.last_replaced.isoformat() == "2025-03-01"
    assert bat.available is False and bat.level is None
    assert bat.low is True and bat.latched is True, "offline is no proof it was replaced"
    assert [r["entity_id"] for r in ov.low] == [PLUS] and dict(ov.needs_now) == {"AAA": 2}


async def test_a_low_battery_without_a_recorded_date_stays_listed_too(hass: HomeAssistant) -> None:
    """Without a replacement date an offline, not-low row is dropped as noise;
    a battery that was low is not noise."""
    _note(hass, last_replaced=False)
    hass.states.async_set(PLUS, "8", {**_attrs(low=True), "battery_last_replaced": None})
    _rows(hass)
    _offline(hass)
    bats, ov = _rows(hass)
    assert [b.entity_id for b in bats] == [PLUS] and bats[0].low is True and bats[0].last_replaced is None
    assert dict(ov.needs_now) == {"AAA": 2}


async def test_an_offline_note_that_was_fine_shows_offline_with_its_forecast(hass: HomeAssistant) -> None:
    _note(hass)
    _offline(hass)
    bats, ov = _rows(hass)
    assert [b.entity_id for b in bats] == [PLUS]
    assert bats[0].available is False and bats[0].low is False
    row = ov.all[0]
    assert row["status"] in ("soon", "ok") and row["forecast_days"] is not None, row


async def test_the_battery_is_released_once_its_device_reports_a_fresh_cell(hass: HomeAssistant) -> None:
    _note(hass)
    hass.states.async_set(PLUS, "8", _attrs(low=True))
    _rows(hass)
    _offline(hass)
    assert _rows(hass)[1].low_count == 1
    hass.states.async_set(PLUS, "96", _attrs(low=False))
    bats, ov = _rows(hass)
    assert ov.low_count == 0 and bats[0].available is True and bats[0].latched is False


async def test_a_low_binary_note_is_bridged_over_an_outage(hass: HomeAssistant) -> None:
    """#121 devices report only a low binary. Its "off" stays the all-clear;
    only the outage between "on" and the next reading is held."""
    _note(hass, binary=True)
    hass.states.async_set(LOW_BINARY, "on", _attrs(low=True))
    assert [r["entity_id"] for r in _rows(hass)[1].low] == [LOW_BINARY]

    _offline(hass, LOW_BINARY)
    bats, ov = _rows(hass)
    assert [b.entity_id for b in bats] == [LOW_BINARY]
    assert bats[0].available is False and bats[0].low is True and bats[0].battery_type == "AAA"

    hass.states.async_set(LOW_BINARY, "off", _attrs(low=False))
    bats, ov = _rows(hass)
    assert ov.low_count == 0 and bats[0].latched is False, "the binary's own all-clear releases it"
    # A plain off -> on -> off without an outage behaves as before.
    hass.states.async_set(LOW_BINARY, "on", _attrs(low=True))
    assert _rows(hass)[1].low_count == 1
    hass.states.async_set(LOW_BINARY, "off", _attrs(low=False))
    assert _rows(hass)[1].low_count == 0


async def test_without_a_type_sensor_the_battery_still_stays_listed(hass: HomeAssistant) -> None:
    _note(hass, type_sensor=False)
    hass.states.async_set(PLUS, "8", _attrs(low=True))
    _rows(hass)
    _offline(hass)
    bats, ov = _rows(hass)
    assert [b.entity_id for b in bats] == [PLUS] and bats[0].battery_type == "Unknown" and bats[0].low is True


async def test_an_offline_note_without_a_date_or_a_low_history_is_dropped_as_before(hass: HomeAssistant) -> None:
    """Offline, never low, no forecast: connectivity noise - and the note's own
    entity must not come back as a degraded native "Unknown" row either."""
    _note(hass, last_replaced=False)
    _offline(hass)
    assert read_batteries(hass) == []


async def test_a_recorded_replacement_reaches_the_note_it_belongs_to(hass: HomeAssistant) -> None:
    """By device, Battery Notes 3.7.2 prefers the device's own note; an entity
    note is reached through its source entity."""
    device_id = _note(hass)
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    at = "2026-10-01T08:00:00+00:00"

    hass.states.async_set(PLUS, "40", _attrs(low=False, source=SOURCE))
    await async_record_replacement(hass, PLUS, at)
    await hass.async_block_till_done()
    assert calls[-1].data == {"source_entity_id": SOURCE, "datetime_replaced": at}

    hass.states.async_set(PLUS, "40", _attrs(low=False))
    await async_record_replacement(hass, PLUS, at)
    await hass.async_block_till_done()
    assert calls[-1].data == {"device_id": device_id, "datetime_replaced": at}
