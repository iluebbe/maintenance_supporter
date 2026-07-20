"""Battery-fleet aggregation + forecast (helpers/battery_fleet.py)."""

from __future__ import annotations

from datetime import date

from custom_components.maintenance_supporter.helpers.battery_fleet import (
    Battery,
    build_overview,
    discover_battery_types,
    has_battery_notes,
    lifetime_months,
    read_batteries,
)


def _bat(name, btype, qty=1, low=False, level=None, last=None):
    return Battery(
        entity_id=f"sensor.{name}_battery_plus",
        device_name=name,
        battery_type=btype,
        quantity=qty,
        low=low,
        level=level,
        last_replaced=last,
    )


def test_low_grouping_by_type_and_quantity():
    today = date(2026, 7, 20)
    bats = [
        _bat("Lock", "AA", qty=4, low=True),
        _bat("Motion", "AA", qty=1, low=True),
        _bat("Sensor", "CR2032", qty=1, low=True),
        _bat("Fine", "AAA", qty=2, low=False, last=today),  # fresh → not soon
    ]
    ov = build_overview(bats, today=today)
    assert ov.total == 4
    assert ov.low_count == 3
    # Grouped shopping list: 5× AA, 1× CR2032.
    assert dict(ov.needs_now) == {"AA": 5, "CR2032": 1}
    # types present (sorted) includes the non-low AAA.
    assert ov.types == ["AA", "AAA", "CR2032"]


def test_forecast_soon_vs_far_and_no_double_count():
    today = date(2026, 7, 20)
    bats = [
        # AA lifetime 12 mo: replaced 12 mo ago → due right about now → soon.
        _bat("DueSoon", "AA", qty=2, low=False, last=date(2025, 7, 10)),
        # CR2450 lifetime 24 mo: replaced 2 mo ago → far away → not soon.
        _bat("Fresh", "CR2450", qty=1, low=False, last=date(2026, 5, 1)),
        # Already low AND old → counts in needs_now only, never in soon.
        _bat("Low", "AA", qty=1, low=True, last=date(2024, 1, 1)),
    ]
    ov = build_overview(bats, today=today, horizon_days=28)
    assert dict(ov.needs_now) == {"AA": 1}
    assert dict(ov.needs_soon) == {"AA": 2}
    assert [r["device_name"] for r in ov.soon] == ["DueSoon"]
    # The low battery is not in soon.
    assert all(r["device_name"] != "Low" for r in ov.soon)


def test_forecast_ignores_batteries_without_last_replaced():
    today = date(2026, 7, 20)
    ov = build_overview([_bat("NoDate", "AA", low=False, last=None)], today=today)
    assert ov.needs_soon == {} and ov.soon == []


def test_lifetime_table_and_unknown_fallback():
    assert lifetime_months("cr2450") == 24
    assert lifetime_months("AA") == 12
    assert lifetime_months("weird-cell") == 12  # default


def _set_note(hass, slug, **attrs):
    base = {
        "device_class": "battery",
        "battery_type": "CR2450",
        "battery_quantity": 1,
        "battery_low": True,
        "battery_last_replaced": "2025-01-01T00:00:00+00:00",
        "device_name": slug.replace("_", " ").title(),
    }
    base.update(attrs)
    hass.states.async_set(f"sensor.{slug}_battery_plus", str(attrs.get("_state", "8")), base)


async def test_read_batteries_from_state(hass):
    _set_note(hass, "hall_motion", device_name="Hall Motion")
    bats = read_batteries(hass)
    # Battery Notes note is read richly.
    note = next(b for b in bats if b.source == "battery_notes")
    assert note.device_name == "Hall Motion" and note.battery_type == "CR2450"
    assert note.low is True and note.level == 8.0
    assert note.last_replaced == date(2025, 1, 1)
    assert has_battery_notes(hass) is True
    assert dict(discover_battery_types(hass))["CR2450"] == 1


async def test_native_battery_degraded_pickup(hass):
    # A plain device_class:battery sensor with NO Battery Notes note → native,
    # degraded (type Unknown, qty 1). Low is inferred from a low %.
    hass.states.async_set("sensor.phone_battery", "55", {"device_class": "battery"})
    hass.states.async_set("sensor.remote_battery", "12", {"device_class": "battery"})
    bats = read_batteries(hass)
    assert {b.source for b in bats} == {"native"}
    remote = next(b for b in bats if b.entity_id == "sensor.remote_battery")
    assert remote.battery_type == "Unknown" and remote.quantity == 1
    assert remote.low is True and remote.level == 12.0  # <= NATIVE_LOW_PERCENT
    phone = next(b for b in bats if b.entity_id == "sensor.phone_battery")
    assert phone.low is False and phone.level == 55.0


async def test_native_low_binary_wins_over_percent(hass):
    # A battery-low binary present → it decides low, not the % heuristic.
    hass.states.async_set("binary_sensor.door_battery_low", "on", {"device_class": "battery"})
    bats = read_batteries(hass)
    assert len(bats) == 1 and bats[0].low is True and bats[0].source == "native"


async def test_native_deduped_against_battery_notes_source(hass):
    # Battery Notes monitors sensor.hall_motion_battery via source_entity_id;
    # that native sensor must NOT be double-counted.
    _set_note(hass, "hall_motion", source_entity_id="sensor.hall_motion_battery")
    hass.states.async_set("sensor.hall_motion_battery", "8", {"device_class": "battery"})
    bats = read_batteries(hass)
    assert len(bats) == 1 and bats[0].source == "battery_notes"


async def test_offline_note_retains_low_but_pure_offline_dropped(hass):
    # A dead battery took its device offline: battery_plus is unavailable but
    # RETAINS battery_low → stays visible. An offline-and-not-low one is noise.
    _set_note(hass, "dead_lock", _state="unavailable", battery_low=True, battery_type="9V")
    _set_note(hass, "idle_probe", _state="unavailable", battery_low=False, battery_type="AA")
    bats = read_batteries(hass)
    eids = {b.entity_id for b in bats}
    assert "sensor.dead_lock_battery_plus" in eids
    assert "sensor.idle_probe_battery_plus" not in eids
    dead = next(b for b in bats if b.entity_id == "sensor.dead_lock_battery_plus")
    assert dead.low is True and dead.available is False and dead.level is None


async def test_native_offline_dropped_when_not_low(hass):
    hass.states.async_set("sensor.gone_battery", "unavailable", {"device_class": "battery"})
    assert read_batteries(hass) == []
