"""#223: a battery whose level reads healthy is healthy, even past its
type's typical lifetime.

A Hue dimmer's CR2032 had read 100 % for its whole life. The discharge trend
had nothing to say (the level never fell), so the forecast fell back to the
type table: 18 months after Battery Notes' last-replaced date, a day that
had passed — and B1 kept a passed forecast in *Soon*, with the CR2032 on the
shopping preview. The level is a measurement; the table only the prior it
stands in for. Such a row is now ``ok`` and shops nothing; it keeps the
passed date as a quiet hint (``forecast_overdue`` + ``forecast_days``).

Rows without a level to contradict the table keep B1: a low-only binary, an
offline battery, a note without a sensor (D#162).
"""

from __future__ import annotations

from datetime import date

from custom_components.maintenance_supporter.helpers.battery_fleet import Battery, build_overview

TODAY = date(2026, 10, 20)
LAST = date(2025, 1, 10)  # + 18 months (CR2032) = 2026-07-10, 102 days ago


def _bat(name: str, **kw) -> Battery:
    base = dict(
        entity_id=f"sensor.{name}_battery_plus",
        device_name=name,
        battery_type="CR2032",
        quantity=1,
        low=False,
        level=100.0,
        last_replaced=LAST,
    )
    return Battery(**{**base, **kw})


def test_a_healthy_level_outlives_the_typical_lifetime() -> None:
    ov = build_overview([_bat("Dimmer")], today=TODAY, trend_predictions={})
    row = ov.all[0]
    assert row["status"] == "ok"
    assert ov.soon == [] and dict(ov.needs_soon) == {}
    assert ov.low == [] and dict(ov.needs_now) == {}
    # The passed date stays as a hint: the roster draws it from forecast_days.
    assert row["forecast_overdue"] is True
    assert row["forecast_days"] == (date(2026, 7, 10) - TODAY).days == -102
    assert row["days_until"] is None
    assert row["predicted_source"] == "typical"


def test_rows_without_a_level_keep_the_passed_forecast_in_soon() -> None:
    """B1 holds where nothing measures the battery."""
    rows = [
        _bat("LowOnly", level=None),
        _bat("Offline", available=False),
        _bat("NoSensor", level=None, no_sensor=True),
    ]
    ov = build_overview(rows, today=TODAY, trend_predictions={})
    soon = {r["device_name"]: r for r in ov.soon}
    assert set(soon) == {"LowOnly", "Offline", "NoSensor"}
    assert all(r["forecast_overdue"] is True and r["days_until"] == 0 for r in soon.values())
    assert dict(ov.needs_soon) == {"CR2032": 3}


def test_a_forecast_still_ahead_stays_a_buying_hint() -> None:
    """Only a PASSED type date is contradicted by the level; one coming up
    within the horizon is still the reminder to order in time."""
    soon_last = date(2025, 5, 1)  # + 18 months = 2026-11-01, 12 days ahead
    ov = build_overview([_bat("Remote", last_replaced=soon_last)], today=TODAY, trend_predictions={})
    assert [r["device_name"] for r in ov.soon] == ["Remote"]
    assert ov.soon[0]["days_until"] == 12 and ov.soon[0]["forecast_overdue"] is False


def test_a_low_battery_is_still_low() -> None:
    ov = build_overview([_bat("Dead", low=True, level=5.0)], today=TODAY, trend_predictions={})
    assert [r["device_name"] for r in ov.low] == ["Dead"] and ov.all[0]["status"] == "low"


def test_a_measured_trend_is_unaffected() -> None:
    ov = build_overview(
        [_bat("Trend", level=40.0)], today=TODAY, trend_predictions={"sensor.Trend_battery_plus": (9, "high")}
    )
    assert ov.soon[0]["predicted_source"] == "trend" and ov.soon[0]["days_until"] == 9
