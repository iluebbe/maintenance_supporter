"""Battery-fleet aggregation + forecast (helpers/battery_fleet.py)."""

from __future__ import annotations

from datetime import date, timedelta

from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.helpers.battery_fleet import (
    Battery,
    build_overview,
    discover_battery_types,
    has_battery_notes,
    is_rechargeable_type,
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


def test_trend_prediction_beats_the_table():
    # #114 follow-up (c): the discharge trend is device-specific — where it
    # exists it replaces the type-lifetime date; everything else falls back.
    today = date(2026, 8, 1)
    bats = [
        _bat("Lock", "AA", low=False, last=date(2026, 7, 1)),  # table: ~11 months out
        _bat("Sensor", "AA", low=False, last=date(2026, 7, 1)),
    ]
    trends = {"sensor.Lock_battery_plus": (12, "high")}
    ov = build_overview(bats, today=today, trend_predictions=trends)
    lock = next(r for r in ov.all if r["device_name"] == "Lock")
    sensor = next(r for r in ov.all if r["device_name"] == "Sensor")
    assert lock["days_until"] == 12
    assert lock["predicted_source"] == "trend" and lock["prediction_confidence"] == "high"
    assert lock["status"] == "soon", "a 12-day trend must land in the forecast bucket"
    assert sensor["predicted_source"] == "typical" and sensor["prediction_confidence"] is None
    assert sensor["days_until"] > 300
    # The shopping forecast follows the blended date.
    assert ov.needs_soon.get("AA") == 1


def test_trend_never_resurrects_a_low_battery():
    today = date(2026, 8, 1)
    bats = [_bat("Dead", "AA", low=True)]
    ov = build_overview(bats, today=today, trend_predictions={"sensor.Dead_battery_plus": (90, "high")})
    assert ov.all[0]["status"] == "low" and ov.all[0]["days_until"] is None


async def test_async_predict_below_reuses_the_regression(hass):
    """The entity-level predictor entry point: a cleanly falling series
    crosses the threshold on schedule, with high confidence."""
    from unittest.mock import patch

    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    now = dt_util.utcnow()
    # 60 %, falling 0.5 %/day over 30 days → 45 % today; below 20 % in ~50 days.
    points = [((now - timedelta(days=30 - i)).timestamp(), 60.0 - 0.5 * i) for i in range(31)]
    predictor = SensorPredictor(hass)
    with patch.object(predictor, "_async_fetch_statistics_points", return_value=points):
        pred = await predictor.async_predict_below("sensor.probe_battery_plus", 20.0)
    assert pred is not None
    assert pred.threshold_direction == "below"
    assert 45 <= pred.days_until_threshold <= 55
    assert pred.confidence == "high"


async def test_trend_predictions_cache_and_filters(hass):
    from unittest.mock import AsyncMock, patch

    from custom_components.maintenance_supporter.helpers import battery_fleet as bf

    bats = [
        Battery(
            entity_id="sensor.a_battery_plus",
            device_name="A",
            battery_type="AA",
            quantity=1,
            low=False,
            level=55.0,
            last_replaced=None,
        ),
        Battery(
            entity_id="binary_sensor.b_battery_plus_low",
            device_name="B",
            battery_type="CR2",
            quantity=1,
            low=False,
            level=None,
            last_replaced=None,
        ),  # no level → skipped
        Battery(
            entity_id="sensor.c_battery_plus",
            device_name="C",
            battery_type="AA",
            quantity=1,
            low=True,
            level=5.0,
            last_replaced=None,
        ),  # low → skipped
    ]
    fake = AsyncMock(return_value=type("P", (), {"days_until_threshold": 42.0, "confidence": "medium"})())
    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor.async_predict_below",
        fake,
    ):
        out1 = await bf.async_trend_predictions(hass, bats)
        out2 = await bf.async_trend_predictions(hass, bats)
    assert out1 == {"sensor.a_battery_plus": (42, "medium")}
    assert out2 == out1
    assert fake.await_count == 1, "the 6 h cache must absorb the second call"


async def test_far_out_trends_fall_back_to_the_table(hass):
    """A 30 d regression extrapolated years out is guesswork — prod produced
    'empty in 1142 d' for a barely-draining sensor. Beyond _TREND_MAX_DAYS the
    trend is dropped and the type table answers."""
    from unittest.mock import AsyncMock, patch

    from custom_components.maintenance_supporter.helpers import battery_fleet as bf

    bats = [
        Battery(
            entity_id="sensor.slow_battery_plus",
            device_name="Slow",
            battery_type="AA",
            quantity=1,
            low=False,
            level=90.0,
            last_replaced=None,
        )
    ]
    fake = AsyncMock(return_value=type("P", (), {"days_until_threshold": 1142.0, "confidence": "medium"})())
    with patch(
        "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor.async_predict_below",
        fake,
    ):
        out = await bf.async_trend_predictions(hass, bats)
    assert out == {}, "a 1142 d extrapolation must not become a trend date"


async def test_recovery_in_the_window_rejects_the_trend(hass):
    """A cold-dipped voltage percentage falls AND bounces back — a regression
    over the dip yields a confident false 'empty soon'. A recovery larger than
    the guard (10 %) rejects the series; a small relaxation bounce (+4 %, seen
    on a real LYWSD03MMC) does not."""
    from unittest.mock import patch

    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    now = dt_util.utcnow().timestamp()

    def series(values):
        return [(now - (len(values) - 1 - i) * 86400.0, v) for i, v in enumerate(values)]

    predictor = SensorPredictor(hass)
    # 90 → 60 dip, then recovery to 85: not a discharge.
    dip = series([90, 80, 70, 60, 65, 75, 85, 85, 85, 84])
    with patch.object(predictor, "_async_fetch_statistics_points", return_value=dip):
        assert await predictor.async_predict_below("sensor.x", 20.0, max_recovery=10.0) is None

    # Steady discharge with a +4 % relaxation bounce: prediction survives.
    steady = series([80 - 1.5 * i + (4 if i == 20 else 0) for i in range(30)])
    with patch.object(predictor, "_async_fetch_statistics_points", return_value=steady):
        pred = await predictor.async_predict_below("sensor.x", 20.0, max_recovery=10.0)
    assert pred is not None and pred.days_until_threshold is not None


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


def _binary_note_device(hass, slug, *, with_percent_sensor):
    """Registry device with a native battery binary + a Battery Notes low
    binary (and optionally the percentage battery_plus sensor). The shape of
    #121: a Matter lock reports no percentage, so Battery Notes creates ONLY
    the low binary — which carries all the type metadata."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    entry = MockConfigEntry(domain="test", data={})
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={("test", slug)},
        name=slug.title(),
    )
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "binary_sensor", "matter", f"{slug}_batt", suggested_object_id=f"{slug}_battery", device_id=device.id
    )
    ent_reg.async_get_or_create(
        "binary_sensor",
        "battery_notes",
        f"{slug}_plus_low",
        suggested_object_id=f"{slug}_battery_plus_low",
        device_id=device.id,
    )
    if with_percent_sensor:
        ent_reg.async_get_or_create(
            "sensor", "battery_notes", f"{slug}_plus", suggested_object_id=f"{slug}_battery_plus", device_id=device.id
        )
    return device


def _set_note_binary(hass, slug, state="off", **extra):
    attrs = {
        "device_class": "battery",
        "battery_type": "Lithium 3-volt CR2",
        "battery_quantity": 1,
        "battery_last_replaced": "2026-05-22T13:46:23+00:00",
        "device_name": slug.replace("_", " ").title(),
    }
    attrs.update(extra)
    hass.states.async_set(f"binary_sensor.{slug}_battery_plus_low", state, attrs)


async def test_low_only_binary_note_supplies_the_type(hass):
    # #121: a device whose battery reports ONLY through a low binary (Matter
    # lock). Battery Notes creates no percentage sensor — the type must come
    # from the low binary, ONE row, and the native binary must not surface as
    # a second "Unknown" row.
    _binary_note_device(hass, "back_door_lock", with_percent_sensor=False)
    hass.states.async_set("binary_sensor.back_door_lock_battery", "off", {"device_class": "battery"})
    _set_note_binary(hass, "back_door_lock", "off")

    bats = read_batteries(hass)
    assert len(bats) == 1, [b.entity_id for b in bats]
    bat = bats[0]
    assert bat.source == "battery_notes"
    assert bat.battery_type == "Lithium 3-volt CR2"
    assert bat.level is None and bat.available is True and bat.low is False
    assert bat.last_replaced == date(2026, 5, 22)
    assert has_battery_notes(hass) is True
    # discover_battery_types canonicalizes labels (upper-case grouping).
    assert dict(discover_battery_types(hass))["LITHIUM 3-VOLT CR2"] == 1


async def test_low_only_binary_note_reports_low_when_on(hass):
    _binary_note_device(hass, "shed_lock", with_percent_sensor=False)
    _set_note_binary(hass, "shed_lock", "on")
    bats = read_batteries(hass)
    assert len(bats) == 1
    assert bats[0].low is True and bats[0].battery_type == "Lithium 3-volt CR2"


async def test_percentage_and_binary_note_stay_one_row(hass):
    # The regression a naive "also scan binaries" fix would ship (reviewed on
    # PR #122): a percentage note's OWN low binary carries the same metadata
    # attributes — sweeping it too would put every battery in the roster
    # twice. The sensor row (with the level) must be the only one.
    _binary_note_device(hass, "hall_motion", with_percent_sensor=True)
    _set_note(hass, "hall_motion", battery_type="CR2450", _state="42", battery_low=False)
    _set_note_binary(hass, "hall_motion", "off", battery_type="CR2450")

    bats = read_batteries(hass)
    assert len(bats) == 1, [b.entity_id for b in bats]
    assert bats[0].entity_id == "sensor.hall_motion_battery_plus"
    assert bats[0].level == 42.0 and bats[0].battery_type == "CR2450"


async def test_registry_less_note_pair_stays_one_row(hass):
    # Caught LIVE in the dev fleet (2026-08-02): state-only entities have no
    # entity-registry entry, so device-based dedupe finds nothing and every
    # battery doubled. The Battery Notes naming contract
    # (sensor.X_battery_plus ↔ binary_sensor.X_battery_plus_low) must carry
    # the dedupe when the registry cannot.
    _set_note(hass, "camper_door", battery_type="AA", _state="77", battery_low=False)
    hass.states.async_set(
        "binary_sensor.camper_door_battery_plus_low",
        "off",
        {"device_class": "battery", "battery_type": "AA", "battery_quantity": 1, "device_name": "Camper Door"},
    )
    bats = read_batteries(hass)
    assert len(bats) == 1, [b.entity_id for b in bats]
    assert bats[0].entity_id == "sensor.camper_door_battery_plus"
    assert bats[0].level == 77.0


async def test_excluded_percentage_note_does_not_resurrect_via_its_binary(hass):
    # Excluding the sensor row must hide the battery COMPLETELY — the sibling
    # low binary (same metadata) must not bring it back.
    from custom_components.maintenance_supporter.const import CONF_OBJECT, DOMAIN
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    _binary_note_device(hass, "porch_cam", with_percent_sensor=True)
    _set_note(hass, "porch_cam", battery_type="AA", _state="55", battery_low=False)
    _set_note_binary(hass, "porch_cam", "off", battery_type="AA")
    fleet = MockConfigEntry(
        domain=DOMAIN,
        data={
            CONF_OBJECT: {
                "id": "obj1",
                "name": "Fleet",
                "battery_fleet": True,
                "battery_fleet_excluded": ["sensor.porch_cam_battery_plus"],
            }
        },
    )
    fleet.add_to_hass(hass)
    assert read_batteries(hass) == []


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
    # RETAINS battery_low → stays visible. An offline-and-not-low one WITHOUT
    # a replacement date is noise (with a date it is a forecast-only note, B1).
    _set_note(hass, "dead_lock", _state="unavailable", battery_low=True, battery_type="9V")
    _set_note(hass, "idle_probe", _state="unavailable", battery_low=False, battery_type="AA", battery_last_replaced=None)
    bats = read_batteries(hass)
    eids = {b.entity_id for b in bats}
    assert "sensor.dead_lock_battery_plus" in eids
    assert "sensor.idle_probe_battery_plus" not in eids
    dead = next(b for b in bats if b.entity_id == "sensor.dead_lock_battery_plus")
    assert dead.low is True and dead.available is False and dead.level is None


async def test_low_floor_applies_to_battery_notes_too(hass):
    # B2 (live-audit case b): a CR2032 at 11.5 % with Battery Notes' own 10 %
    # threshold (battery_low=False) counted healthy while the same level was
    # low in the native pass. The fleet-wide floor now ORs in — and a HIGHER
    # Battery Notes threshold still wins via its battery_low flag.
    _set_note(hass, "coin_cell", _state="11.5", battery_low=False, battery_type="CR2032")
    _set_note(hass, "healthy", _state="55", battery_low=False, battery_type="AA")
    _set_note(hass, "high_threshold", _state="28", battery_low=True, battery_type="AA")  # BN threshold 30%
    by_eid = {b.entity_id: b for b in read_batteries(hass)}
    assert by_eid["sensor.coin_cell_battery_plus"].low is True
    assert by_eid["sensor.healthy_battery_plus"].low is False
    assert by_eid["sensor.high_threshold_battery_plus"].low is True


async def test_forecast_only_note_reaches_the_forecast(hass):
    # B1 (live-audit "the big one"): a Battery Notes index card — no level
    # sensor (state unknown forever), no source_entity_id — but WITH a
    # battery_type and an old last_replaced must reach build_overview and
    # surface in the forecast. 15/27 notes (11 overdue) were silently hidden.
    _set_note(
        hass,
        "garage_remote",
        _state="unknown",
        battery_low=False,
        battery_type="CR2032",
        battery_last_replaced="2024-01-01T00:00:00+00:00",
    )
    bats = read_batteries(hass)
    assert len(bats) == 1
    b = bats[0]
    assert b.available is False and b.low is False
    assert b.last_replaced == date(2024, 1, 1)
    # CR2032 lifetime 18mo → long overdue by mid-2026: lands in `soon` with
    # negative days_until, sorted to the top.
    ov = build_overview(bats, today=date(2026, 7, 25))
    assert ov.total == 1 and ov.low == []
    assert len(ov.soon) == 1
    assert ov.soon[0]["days_until"] < 0
    assert dict(ov.needs_soon) == {"CR2032": 1}


async def test_dead_note_no_longer_shadows_live_native_sensor(hass):
    # B3: a device with a DEAD note (no date, no reading) AND a working native
    # level sensor was invisible in BOTH passes — the dropped note still
    # marked the device covered. The native fallback must surface now.
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    device = _device_with_battery(hass, slug="hall_cam")  # native sensor.hall_cam_battery at 9%
    note_entry = MockConfigEntry(domain="battery_notes", data={})
    note_entry.add_to_hass(hass)
    er.async_get(hass).async_get_or_create(
        "sensor", "battery_notes", "hall_cam_plus", suggested_object_id="hall_cam_battery_plus", device_id=device.id
    )
    _set_note(hass, "hall_cam", _state="unavailable", battery_low=False, battery_type="AA", battery_last_replaced=None)
    bats = read_batteries(hass)
    assert [b.entity_id for b in bats] == ["sensor.hall_cam_battery"]
    assert bats[0].source == "native" and bats[0].low is True


async def test_excluded_note_still_covers_its_device(hass):
    # B4 interplay: excluding a battery hides it — it must NOT resurrect as a
    # degraded native "Unknown" row via its own device's native sensor.
    from custom_components.maintenance_supporter.const import CONF_OBJECT, DOMAIN
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    device = _device_with_battery(hass, slug="porch_cam")
    note_entry = MockConfigEntry(domain="battery_notes", data={})
    note_entry.add_to_hass(hass)
    er.async_get(hass).async_get_or_create(
        "sensor", "battery_notes", "porch_cam_plus", suggested_object_id="porch_cam_battery_plus", device_id=device.id
    )
    _set_note(hass, "porch_cam", battery_type="AA", source_entity_id="sensor.porch_cam_battery")
    fleet = MockConfigEntry(
        domain=DOMAIN,
        data={
            CONF_OBJECT: {
                "id": "obj1",
                "name": "Fleet",
                "battery_fleet": True,
                "battery_fleet_excluded": ["sensor.porch_cam_battery_plus"],
            }
        },
    )
    fleet.add_to_hass(hass)
    assert read_batteries(hass) == []


async def test_native_offline_dropped_when_not_low(hass):
    hass.states.async_set("sensor.gone_battery", "unavailable", {"device_class": "battery"})
    assert read_batteries(hass) == []


async def test_heuristic_pickup_without_device_class(hass):
    # Some Zigbee2MQTT/ESPHome devices ship battery levels WITHOUT a
    # device_class — the strict %-plus-name heuristic finds them, while
    # charging electronics and home-storage SoC sensors stay out.
    hass.states.async_set("sensor.shed_door_battery", "85", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.porch_battery_level", "9", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.inverter_battery_power", "1200", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.wallbox_battery_charging_current", "16", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.powerwall_battery_soc", "64", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.humidity_kitchen", "45", {"unit_of_measurement": "%"})
    bats = {b.entity_id: b for b in read_batteries(hass)}
    assert set(bats) == {"sensor.shed_door_battery", "sensor.porch_battery_level"}
    assert bats["sensor.porch_battery_level"].low is True  # 9 <= floor
    assert bats["sensor.shed_door_battery"].low is False


async def test_native_dead_battery_retained_from_snapshot(hass):
    # battery_monitor comparison finding: a NATIVE battery that dies takes
    # its entity to unavailable — without a snapshot it vanished at the exact
    # moment it needed replacing (Battery Notes covers this via its retained
    # battery_low attribute; native has no equivalent).
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    from custom_components.maintenance_supporter.helpers.battery_fleet import _native_snapshot_cache

    hass.states.async_set("sensor.gate_battery", "12", {"device_class": "battery"})
    bats = read_batteries(hass)  # populates the snapshot cache
    assert bats[0].low is True and bats[0].available is True

    hass.states.async_set("sensor.gate_battery", "unavailable", {"device_class": "battery"})
    bats = read_batteries(hass)
    assert len(bats) == 1
    assert bats[0].low is True and bats[0].available is False and bats[0].level == 12.0

    # Beyond the retention window the snapshot expires and the battery drops.
    cache = _native_snapshot_cache(hass)
    cache["sensor.gate_battery"]["ts"] = dt_util.utcnow() - timedelta(hours=49)
    assert read_batteries(hass) == []


async def test_native_healthy_then_offline_not_retained(hass):
    # Only last-known-LOW batteries are retained — a healthy battery whose
    # device drops off wifi is connectivity noise, not a replace candidate.
    hass.states.async_set("sensor.cam_battery", "80", {"device_class": "battery"})
    read_batteries(hass)
    hass.states.async_set("sensor.cam_battery", "unavailable", {"device_class": "battery"})
    assert read_batteries(hass) == []


def _device_with_battery(hass, *, slug, extra_domain=None, extra_device_class=None, identifiers=None):
    """Registry device + native battery sensor (+ optional sibling entity)."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    entry = MockConfigEntry(domain="test", data={})
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers=identifiers or {("test", slug)},
        name=slug.title(),
    )
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create("sensor", "test", f"{slug}_batt", suggested_object_id=f"{slug}_battery", device_id=device.id)
    if extra_domain:
        ent_reg.async_get_or_create(
            extra_domain,
            "test",
            f"{slug}_extra",
            suggested_object_id=f"{slug}_extra",
            device_id=device.id,
            original_device_class=extra_device_class,
        )
    hass.states.async_set(f"sensor.{slug}_battery", "9", {"device_class": "battery"})
    return device


async def test_self_charging_devices_skipped(hass):
    # #107: a vacuum's low native battery must NOT enter the fleet — the
    # robot recharges itself. Same for battery_charging binaries and phones.
    _device_with_battery(hass, slug="roborock", extra_domain="vacuum")
    _device_with_battery(hass, slug="ebike", extra_domain="binary_sensor", extra_device_class="battery_charging")
    _device_with_battery(hass, slug="pixel", identifiers={("mobile_app", "pixel10")})
    _device_with_battery(hass, slug="door_sensor")  # plain battery device stays
    bats = read_batteries(hass)
    assert [b.entity_id for b in bats] == ["sensor.door_sensor_battery"]


async def test_a_noted_self_charging_device_is_skipped_too(hass):
    """#107 follow-up: a Battery Notes note on a mower/vacuum used to win over
    the self-charging skip ("a note is deliberate intent") — but Battery Notes
    AUTO-DISCOVERS such devices from its library (type "Rechargeable"), so a
    real fleet told its owner to buy a RECHARGEABLE for the vacuum. The skip
    now applies to both passes; the note must not resurrect natively either."""
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    device = _device_with_battery(hass, slug="mower", extra_domain="lawn_mower")
    note_entry = MockConfigEntry(domain="battery_notes", data={})
    note_entry.add_to_hass(hass)
    er.async_get(hass).async_get_or_create(
        "sensor", "battery_notes", "mower_plus", suggested_object_id="mower_battery_plus", device_id=device.id
    )
    _set_note(hass, "mower", battery_type="Rechargeable", source_entity_id="sensor.mower_battery")
    assert read_batteries(hass) == []


async def test_manual_exclusion_filters_both_passes(hass):
    from custom_components.maintenance_supporter.const import CONF_OBJECT, DOMAIN
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    _set_note(hass, "hall_motion", battery_type="CR2450")
    hass.states.async_set("sensor.remote_battery", "9", {"device_class": "battery"})
    # Fleet entry with both entity_ids excluded.
    fleet = MockConfigEntry(
        domain=DOMAIN,
        data={
            CONF_OBJECT: {
                "id": "obj1",
                "name": "Fleet",
                "battery_fleet": True,
                "battery_fleet_excluded": ["sensor.hall_motion_battery_plus", "sensor.remote_battery"],
            }
        },
    )
    fleet.add_to_hass(hass)
    assert read_batteries(hass) == []


# ─── the full roster (discussion #113) ────────────────────────────────────


def test_a_healthy_device_is_still_listed_so_it_can_be_excluded():
    """The gap this closes: `low` and `soon` answer "what needs doing", and a
    device that needs nothing appeared in NEITHER — so the exclude control,
    which only ever rendered on a low row, could not reach it. A robot vacuum
    that recharges itself has to be dismissable BEFORE it starts nagging."""
    today = date(2026, 7, 20)
    healthy = _bat("Robot Vacuum", "Li-ion", low=False, last=today)
    ov = build_overview([healthy], today=today)

    assert ov.low == [] and ov.soon == [], "a fresh battery should need nothing"
    assert [r["device_name"] for r in ov.all] == ["Robot Vacuum"]
    assert ov.all[0]["status"] == "ok"
    assert ov.all[0]["entity_id"] == healthy.entity_id, "exclusion needs the entity_id"


def test_the_roster_holds_every_battery_exactly_once_with_its_status():
    today = date(2026, 7, 20)
    bats = [
        _bat("Lock", "AA", qty=2, low=True),
        _bat("Doorbell", "AA", low=False, last=date(2024, 8, 1)),  # long past → soon
        _bat("Remote", "AAA", low=False, last=today),  # fresh → ok
    ]
    ov = build_overview(bats, today=today)

    assert len(ov.all) == ov.total == 3
    by_name = {r["device_name"]: r["status"] for r in ov.all}
    assert by_name == {"Lock": "low", "Doorbell": "soon", "Remote": "ok"}

    # The roster must agree with the categorised lists rather than drift from
    # them — two places deriving the same fact is how they disagree later.
    assert {r["device_name"] for r in ov.low} == {n for n, s in by_name.items() if s == "low"}
    assert {r["device_name"] for r in ov.soon} == {n for n, s in by_name.items() if s == "soon"}


def test_the_roster_is_sorted_by_device_name():
    """It is a lookup list — a person scans it for one device."""
    today = date(2026, 7, 20)
    bats = [_bat("Zeta", "AA", last=today), _bat("alpha", "AA", last=today), _bat("Mid", "AA", last=today)]
    ov = build_overview(bats, today=today)
    assert [r["device_name"] for r in ov.all] == ["alpha", "Mid", "Zeta"]


def test_a_battery_without_a_replacement_date_is_ok_not_soon():
    """Native battery entities carry no last_replaced, so there is no forecast.
    They must still be listed — they are exactly the phones and vacuums people
    want out of the fleet."""
    today = date(2026, 7, 20)
    ov = build_overview([_bat("Phone", "unknown", low=False, last=None)], today=today)
    assert ov.soon == []
    assert [(r["status"], r["days_until"]) for r in ov.all] == [("ok", None)]


# ─── rechargeable types: charged, never bought ────────────────────────────


def test_rechargeable_type_detection():
    assert is_rechargeable_type("Rechargeable")
    assert is_rechargeable_type("Nuki Battery Pack")
    assert is_rechargeable_type("Li-ion")
    assert is_rechargeable_type("18650")
    # Primary cells stay primary — including primary lithium.
    assert not is_rechargeable_type("AA")
    assert not is_rechargeable_type("CR2032")
    assert not is_rechargeable_type("Lithium 3-Volt CR2")
    assert not is_rechargeable_type(None)


def test_rechargeable_low_is_tracked_but_never_shoppable():
    """A low Nuki power pack means "charge it" — the row stays in low/all (the
    fleet task still fires), but "1× NUKI BATTERY PACK" must never appear in
    the shopping groupings (seen on a real fleet)."""
    today = date(2026, 8, 1)
    ov = build_overview(
        [_bat("Nuki Lock", "Nuki Battery Pack", low=True), _bat("Sensor", "AA", low=True)],
        today=today,
    )
    assert ov.low_count == 2
    assert dict(ov.needs_now) == {"AA": 1}
    nuki = next(r for r in ov.all if r["device_name"] == "Nuki Lock")
    assert nuki["status"] == "low" and nuki["rechargeable"] is True


def test_rechargeable_gets_no_table_date_but_keeps_the_trend():
    """The type-lifetime table describes primary cells; for a rechargeable it
    produced "replace the vacuum's pack ~1 year after the device was added"
    (Battery Notes seeds last_replaced at note creation). Only the discharge
    trend may date a rechargeable — and even then it never enters needs_soon."""
    today = date(2026, 8, 1)
    bats = [
        _bat("Nuki Lock", "Nuki Battery Pack", low=False, last=date(2025, 8, 10)),
        _bat("Camera", "Battery Pack", low=False, last=date(2025, 8, 10)),
    ]
    trends = {"sensor.Camera_battery_plus": (14, "high")}
    ov = build_overview(bats, today=today, trend_predictions=trends)
    nuki = next(r for r in ov.all if r["device_name"] == "Nuki Lock")
    cam = next(r for r in ov.all if r["device_name"] == "Camera")
    # Table date suppressed: last_replaced + 12 mo would have been "soon".
    assert nuki["status"] == "ok" and nuki["days_until"] is None
    # Trend survives — "charge in ~14 days" is useful — but nothing to buy.
    assert cam["status"] == "soon" and cam["days_until"] == 14
    assert cam["predicted_source"] == "trend"
    assert dict(ov.needs_soon) == {}
    assert [r["device_name"] for r in ov.soon] == ["Camera"]


async def test_discover_battery_types_skips_rechargeables(hass):
    """Fleet setup mints a spare-part per discovered type — a "RECHARGEABLE"
    part with a reorder threshold is nonsense, so rechargeables stay out."""
    _set_note(hass, "hall_motion", battery_type="CR2450")
    _set_note(hass, "front_lock", battery_type="Nuki Battery Pack")
    assert dict(discover_battery_types(hass)) == {"CR2450": 1}
