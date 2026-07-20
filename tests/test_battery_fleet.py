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


async def test_read_batteries_from_state(hass):
    hass.states.async_set(
        "sensor.hall_motion_battery_plus",
        "8",
        {
            "device_class": "battery",
            "battery_type": "CR2450",
            "battery_quantity": 1,
            "battery_low": True,
            "battery_last_replaced": "2025-01-01T00:00:00+00:00",
            "device_name": "Hall Motion",
        },
    )
    # A plain battery sensor WITHOUT battery_type must be ignored (not Battery Notes).
    hass.states.async_set("sensor.phone_battery", "55", {"device_class": "battery"})
    bats = read_batteries(hass)
    assert len(bats) == 1
    b = bats[0]
    assert b.device_name == "Hall Motion" and b.battery_type == "CR2450"
    assert b.low is True and b.level == 8.0
    assert b.last_replaced == date(2025, 1, 1)
    assert has_battery_notes(hass) is True
    assert dict(discover_battery_types(hass)) == {"CR2450": 1}
