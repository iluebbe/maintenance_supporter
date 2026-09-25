"""Catalog wave 2026-09-25 (round 14), group D: cars and e-bikes, wallboxes,
locks, mowers and pool/spa water care.

Every seeded entity mirrors the real integration's registry shape — the
translation_key where the integration sets one, otherwise the entity-id
suffix its naming code produces — and every assertion pins the proposed
duty, its direction and the threshold in the entity's own unit.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
    discover_integration_setups,
)
from custom_components.maintenance_supporter.helpers.signatures._model import build_setup_trigger

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration

# (entity platform, object_id, translation_key | None, unit | None, state)
_Ent = tuple[str, str, str | None, str | None, str]


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


async def _seed(
    hass: HomeAssistant,
    domain: str,
    uid: str,
    device_name: str,
    entities: list[_Ent],
    model: str | None = None,
) -> str:
    """One device of `domain` with explicit entity ids (object_id) — a None
    translation_key seeds a name-derived (suffix / exact object id) match."""
    source = MockConfigEntry(domain=domain, title=domain)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=device_name, model=model
    )
    ent_reg = er.async_get(hass)
    for platform, object_id, tkey, unit, state in entities:
        entry = ent_reg.async_get_or_create(
            platform,
            domain,
            f"{uid}_{object_id}",
            config_entry=source,
            device_id=device.id,
            translation_key=tkey,
            suggested_object_id=object_id,
        )
        assert entry.entity_id == f"{platform}.{object_id}"
        attrs = {"unit_of_measurement": unit} if unit is not None else {}
        hass.states.async_set(entry.entity_id, state, attrs)
    return device.id


def _by(setup: dict) -> dict[tuple[str, str], dict]:
    return {(t["task_name"], t["direction"]): t for t in setup["tasks"]}


def _sig(domain: str, task_name: str, direction: str):
    return next(s for s in SIGNATURES[domain].tasks if s.task_name == task_name and s.direction == direction)


async def test_round14_wallbox_lifetime_energy(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Seven chargers: the LIFETIME energy counter drives the cable/plug
    inspection (5,000 kWh, converted into native Wh where the entity shows
    Wh); the per-session siblings are never picked up."""
    await setup_integration(hass, global_entry)
    twc = await _seed(
        hass,
        "tesla_wall_connector",
        "twc1",
        "Tesla Wall Connector",
        [
            ("sensor", "tesla_wall_connector_energy", "energy_kwh", "kWh", "12000"),
            ("sensor", "tesla_wall_connector_session_energy", "session_energy_wh", "kWh", "12"),
        ],
    )
    nexblue = await _seed(
        hass,
        "nexblue",
        "nb1",
        "NexBlue Point",
        [
            ("sensor", "nexblue_point_lifetime_energy", "lifetime_energy", "kWh", "800"),
            ("sensor", "nexblue_point_energy", None, "kWh", "8"),
        ],
    )
    prism = await _seed(
        hass,
        "silla_prism",
        "sp1",
        "Prism",
        [
            ("sensor", "prism_total_energy", "total_energy", "Wh", "900000"),
            ("sensor", "prism_session_energy", "session_energy", "Wh", "9000"),
        ],
    )
    besen = await _seed(
        hass,
        "besen",
        "bs1",
        "Besen",
        [
            ("sensor", "besen_total_energy", "total_energy", "kWh", "321"),
            ("sensor", "besen_session_energy", "session_energy", "kWh", "3"),
        ],
    )
    peblar = await _seed(
        hass,
        "peblar",
        "pb1",
        "Peblar",
        [
            ("sensor", "peblar_lifetime_energy", "energy_total", "kWh", "4000"),
            ("sensor", "peblar_session_energy", "energy_session", "kWh", "4"),
        ],
    )
    zaptec = await _seed(
        hass,
        "zaptec",
        "zp1",
        "Zaptec Go",
        [
            ("sensor", "zaptec_go_energy_meter", "signed_meter_value", "kWh", "1500"),
            ("sensor", "zaptec_go_completed_session_energy", "completed_session_energy", "kWh", "15"),
        ],
    )
    goe = await _seed(
        hass,
        "goecharger_mqtt",
        "g1",
        "go-eCharger",
        [
            ("sensor", "go_echarger_222819_eto", "eto", "Wh", "2500000"),
            ("sensor", "go_echarger_222819_etop", "etop", "Wh", "2500000"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    expected = {
        twc: ("sensor.tesla_wall_connector_energy", 5000.0),
        nexblue: ("sensor.nexblue_point_lifetime_energy", 5000.0),
        prism: ("sensor.prism_total_energy", 5000000.0),
        besen: ("sensor.besen_total_energy", 5000.0),
        peblar: ("sensor.peblar_lifetime_energy", 5000.0),
        zaptec: ("sensor.zaptec_go_energy_meter", 5000.0),
        goe: ("sensor.go_echarger_222819_eto", 5000000.0),
    }
    for device_id, (entity_id, threshold) in expected.items():
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Inspect Cable and Plug"
        assert task["direction"] == "usage_delta"
        assert task["entity_ids"] == [entity_id]
        assert task["threshold"] == threshold

    tc = build_setup_trigger(_sig("zaptec", "Inspect Cable and Plug", "usage_delta"), hass, [expected[zaptec][0]])
    assert tc["type"] == "counter" and tc["trigger_delta_mode"] is True
    assert "trigger_baseline_value" not in tc  # lifetime counter: baseline = value at adoption


async def test_round14_car_service_countdowns(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Cars with their OWN service countdowns (Stellantis, Porsche, Uconnect,
    Polestar fork) get the countdown as Annual/Oil Service in two directions
    (days → duration_left 14 d, distance → value_below 1,000) plus the
    odometer-driven tire rotation — no editorial 15,000 km service."""
    await setup_integration(hass, global_entry)
    stellantis = await _seed(
        hass,
        "stellantis_vehicles",
        "vin1",
        "Peugeot e-208",
        [
            ("sensor", "peugeot_e_208_mileage", "mileage", "km", "23000"),
            ("sensor", "peugeot_e_208_mileage_before_maintenance", "mileage_before_maintenance", "km", "4000"),
            ("sensor", "peugeot_e_208_days_before_maintenance", "days_before_maintenance", "d", "120"),
        ],
    )
    porsche = await _seed(
        hass,
        "porscheconnect",
        "vin2",
        "Taycan",
        [
            ("sensor", "taycan_mileage", "mileage", "km", "30000"),
            ("sensor", "taycan_next_service_in", "main_service_range", "km", "9000"),
            ("sensor", "taycan_next_service_in_days", "main_service_time", "d", "200"),
            ("sensor", "taycan_next_oil_change_in", "oil_service_range", "km", "5000"),
            ("sensor", "taycan_next_oil_change_in_days", "oil_service_time", "d", "100"),
        ],
    )
    uconnect = await _seed(
        hass,
        "uconnect",
        "vin3",
        "Jeep Wrangler",
        [
            ("sensor", "jeep_wrangler_odometer", None, "mi", "41000"),
            ("sensor", "jeep_wrangler_distance_to_service", None, "mi", "2500"),
            ("sensor", "jeep_wrangler_days_till_service_needed", None, "d", "60"),
            ("sensor", "jeep_wrangler_oil_life", None, "%", "55"),
        ],
    )
    polestar = await _seed(
        hass,
        "polestar",
        "vin4",
        "Polestar 2",
        [
            ("sensor", "polestar_2_odometer", None, "km", "15000"),
            ("sensor", "polestar_2_distance_to_service", None, "km", "12000"),
            ("sensor", "polestar_2_days_to_service", None, "d", "300"),
            ("sensor", "polestar_2_engine_hours_to_service", None, "h", "10"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    st = _by(setups[stellantis])
    assert set(st) == {
        ("Tire Rotation", "usage_delta"),
        ("Annual Service", "duration_left"),
        ("Annual Service", "value_below"),
    }
    assert st[("Tire Rotation", "usage_delta")]["entity_ids"] == ["sensor.peugeot_e_208_mileage"]
    assert st[("Tire Rotation", "usage_delta")]["threshold"] == 10000.0
    assert st[("Annual Service", "duration_left")]["threshold"] == 14.0  # 336 h in days
    assert st[("Annual Service", "value_below")]["entity_ids"] == ["sensor.peugeot_e_208_mileage_before_maintenance"]
    assert st[("Annual Service", "value_below")]["threshold"] == 1000.0

    po = _by(setups[porsche])
    assert set(po) == {
        ("Tire Rotation", "usage_delta"),
        ("Annual Service", "duration_left"),
        ("Annual Service", "value_below"),
        ("Oil Service", "duration_left"),
        ("Oil Service", "value_below"),
    }
    assert po[("Oil Service", "value_below")]["entity_ids"] == ["sensor.taycan_next_oil_change_in"]
    assert po[("Oil Service", "duration_left")]["entity_ids"] == ["sensor.taycan_next_oil_change_in_days"]
    assert po[("Annual Service", "duration_left")]["threshold"] == 14.0

    uc = _by(setups[uconnect])
    assert set(uc) == {
        ("Tire Rotation", "usage_delta"),
        ("Annual Service", "duration_left"),
        ("Annual Service", "value_below"),
        ("Oil Service", "percent_left"),
    }
    assert uc[("Tire Rotation", "usage_delta")]["threshold"] == round(10000 * 0.62137, 3)  # miles
    assert uc[("Oil Service", "percent_left")]["entity_ids"] == ["sensor.jeep_wrangler_oil_life"]
    assert uc[("Oil Service", "percent_left")]["threshold"] == 10.0  # household default
    oil = build_setup_trigger(_sig("uconnect", "Oil Service", "percent_left"), hass, ["sensor.jeep_wrangler_oil_life"])
    assert oil["type"] == "threshold" and oil["trigger_below"] == 10.0

    ps = _by(setups[polestar])
    assert set(ps) == {
        ("Tire Rotation", "usage_delta"),
        ("Annual Service", "duration_left"),
        ("Annual Service", "value_below"),
    }
    assert ps[("Annual Service", "duration_left")]["entity_ids"] == ["sensor.polestar_2_days_to_service"]
    assert ps[("Annual Service", "value_below")]["entity_ids"] == ["sensor.polestar_2_distance_to_service"]


async def test_round14_car_odometers(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Odometer-only cars get the generic 15,000 km service + 10,000 km tire
    rotation, unit-aware (miles converted); the MG/SAIC fix keeps its
    '_mileage' suffix and never claims 'Mileage Since Last Charge'."""
    await setup_integration(hass, global_entry)
    cars = {
        "cardata": await _seed(
            hass,
            "cardata",
            "c1",
            "BMW i4",
            [("sensor", "bmw_i4_vehicle_mileage", None, "mi", "12000")],
        ),
        "bavariandata": await _seed(
            hass,
            "bavariandata",
            "b1",
            "BMW i5",
            [("sensor", "bmw_i5_vehicle_mileage", "vehicle_vehicle_travelleddistance", "km", "8000")],
        ),
        "nissan_connect": await _seed(
            hass,
            "nissan_connect",
            "n1",
            "Nissan Leaf",
            [("sensor", "nissan_leaf_odometer", "odometer", "km", "50000")],
        ),
        "smartcar": await _seed(
            hass,
            "smartcar",
            "s1",
            "VW ID.4",
            [
                ("sensor", "vw_id_4_odometer", None, "km", "20000"),
                ("sensor", "vw_id_4_engine_oil_life", None, "%", "0.35"),
            ],
        ),
        "lucidmotors": await _seed(
            hass,
            "lucidmotors",
            "l1",
            "Lucid Air",
            [("sensor", "lucid_air_odometer", "mileage", "km", "7000")],
        ),
        "abrp": await _seed(
            hass,
            "abrp",
            "a1",
            "ABRP car",
            [("sensor", "abrp_car_odometer", "odometer", "km", "90000")],
        ),
        "mg_saic": await _seed(
            hass,
            "mg_saic",
            "m1",
            "MG4",
            [
                ("sensor", "mg_mg4_mileage", None, "km", "31000"),
                ("sensor", "mg_mg4_mileage_since_last_charge", None, "km", "80"),
            ],
        ),
    }

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for domain, device_id in cars.items():
        by = _by(setups[device_id])
        assert set(by) == {("Annual Service", "usage_delta"), ("Tire Rotation", "usage_delta")}, domain
        assert len(by[("Annual Service", "usage_delta")]["entity_ids"]) == 1, domain

    cd = _by(setups[cars["cardata"]])
    assert cd[("Annual Service", "usage_delta")]["threshold"] == round(15000 * 0.62137, 3)
    assert _by(setups[cars["bavariandata"]])[("Annual Service", "usage_delta")]["threshold"] == 15000.0
    assert _by(setups[cars["mg_saic"]])[("Tire Rotation", "usage_delta")]["entity_ids"] == ["sensor.mg_mg4_mileage"]
    # Smartcar's oil life is deliberately not matched (unverified scale).
    assert all("sensor.vw_id_4_engine_oil_life" not in t["entity_ids"] for t in setups[cars["smartcar"]]["tasks"])
    assert "townsmcp/mg-saic-ha" in SIGNATURES["mg_saic"].verified


async def test_round14_ebikes(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Specialized Turbo: chain + drivetrain by odometer; Cowboy (belt
    drive): drivetrain only; Xunil99 Bosch eBike: the dealer-set service
    countdowns (days + km) as Bike Service — its odometer is NOT matched,
    so the next-service/last-ride odometer siblings never become a source."""
    await setup_integration(hass, global_entry)
    turbo = await _seed(
        hass,
        "specialized_turbo",
        "t1",
        "Turbo Levo",
        [("sensor", "turbo_levo_odometer", "odometer", "km", "1200")],
    )
    cowboy = await _seed(
        hass,
        "cowboy",
        "cb1",
        "Cowboy 4",
        [("sensor", "cowboy_4_total_distance", "total_distance", "km", "3000")],
    )
    bosch = await _seed(
        hass,
        "ha_bosch_ebike",
        "bb1",
        "Performance Line CX",
        [
            ("sensor", "performance_line_cx_odometer", "odometer", "km", "4200"),
            ("sensor", "performance_line_cx_next_service_odometer", "next_service_odometer", "km", "5000"),
            ("sensor", "performance_line_cx_last_ride_start_odometer", "last_ride_start_odometer", "km", "4180"),
            ("sensor", "performance_line_cx_service_due_in_km", "service_due_in_km", "km", "800"),
            ("sensor", "performance_line_cx_service_due_in_days", "service_due_in_days", "d", "90"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tb = _by(setups[turbo])
    assert set(tb) == {("Lubricate Chain", "usage_delta"), ("Bike Service", "usage_delta")}
    assert tb[("Lubricate Chain", "usage_delta")]["threshold"] == 250.0
    assert tb[("Bike Service", "usage_delta")]["threshold"] == 2000.0

    (cb,) = setups[cowboy]["tasks"]
    assert cb["task_name"] == "Bike Service" and cb["threshold"] == 2000.0

    bo = _by(setups[bosch])
    assert set(bo) == {("Bike Service", "duration_left"), ("Bike Service", "value_below"), ("Lubricate Chain", "usage_delta")}
    # translation_keys_authoritative: only the real odometer, not next_service_/last_ride_start_odometer
    assert bo[("Lubricate Chain", "usage_delta")]["entity_ids"] == ["sensor.performance_line_cx_odometer"]
    assert bo[("Lubricate Chain", "usage_delta")]["threshold"] == 250.0
    assert bo[("Bike Service", "duration_left")]["entity_ids"] == ["sensor.performance_line_cx_service_due_in_days"]
    assert bo[("Bike Service", "duration_left")]["threshold"] == 14.0
    assert bo[("Bike Service", "value_below")]["entity_ids"] == ["sensor.performance_line_cx_service_due_in_km"]
    assert bo[("Bike Service", "value_below")]["threshold"] == 100.0


async def test_round14_lock_cycles_and_nuki_opener_excluded(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Wyze, TTLock, Kwikset and Nuki Web locks get engine-counted locking
    cycles; a Nuki Web OPENER (a lock entity that reads 'locked' whenever it
    is online) is excluded by its device model."""
    await setup_integration(hass, global_entry)
    locks = {}
    for domain, uid, name, model in (
        ("wyzeapi", "w1", "Front Door", None),
        ("ttlock", "t1", "Gate", None),
        ("kwikset", "k1", "Back Door", None),
        ("nuki_web", "n1", "Flat Door", "Smart Lock 3.0/4. Gen"),
    ):
        locks[domain] = await _seed(hass, domain, uid, name, [("lock", f"{domain}_{uid}", None, None, "locked")], model=model)
    opener = await _seed(hass, "nuki_web", "n2", "Intercom", [("lock", "nuki_web_n2", None, None, "locked")], model="Opener")

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for domain, device_id in locks.items():
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Lubricate Cylinder" and task["direction"] == "cycle_count", domain
        assert task["threshold"] == 2000.0
    assert opener not in setups

    tc = build_setup_trigger(_sig("nuki_web", "Lubricate Cylinder", "cycle_count"), hass, ["lock.nuki_web_n1"])
    assert tc["type"] == "state_change"
    assert tc["trigger_to_state"] == "locked" and tc["trigger_target_changes"] == 2000


async def test_round14_mowers(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Mammotion + Worx Vision: blade time since reset (usage_above, 0
    baseline) and lifetime work time (undercarriage every 25 h), in the
    entity's own unit; Dreame mower: blade life percent."""
    await setup_integration(hass, global_entry)
    luba = await _seed(
        hass,
        "mammotion",
        "l2",
        "Luba 2",
        [
            ("sensor", "luba_2_blade_used_time", "blade_used_time", "h", "40"),
            ("sensor", "luba_2_blade_wear_warning_time", "blade_used_warn_time", "h", "100"),
            ("sensor", "luba_2_total_work_time", "maintenance_work_time", "h", "300"),
        ],
    )
    dreame = await _seed(
        hass,
        "dreame_mower",
        "d1",
        "Dreame A1",
        [
            ("sensor", "dreame_a1_blades_left", "blades_left", "%", "80"),
            ("sensor", "dreame_a1_blades_time_left", "blades_time_left", "h", "200"),
        ],
    )
    worx = await _seed(
        hass,
        "worx_vision_cloud",
        "v1",
        "Landroid Vision",
        [
            ("sensor", "landroid_vision_blade_runtime_current", "blade_runtime_current", "min", "900"),
            ("sensor", "landroid_vision_mower_runtime_total", "mower_runtime_total", "min", "90000"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    lb = _by(setups[luba])
    assert set(lb) == {("Replace Blades", "usage_above"), ("Clean Undercarriage", "usage_delta")}
    assert lb[("Replace Blades", "usage_above")]["entity_ids"] == ["sensor.luba_2_blade_used_time"]
    assert lb[("Replace Blades", "usage_above")]["threshold"] == 100.0
    assert lb[("Clean Undercarriage", "usage_delta")]["threshold"] == 25.0
    blades = build_setup_trigger(_sig("mammotion", "Replace Blades", "usage_above"), hass, ["sensor.luba_2_blade_used_time"])
    assert blades["type"] == "counter" and blades["trigger_baseline_value"] == 0
    assert blades["auto_complete_on_recovery"] is True

    (dr_task,) = setups[dreame]["tasks"]
    assert dr_task["task_name"] == "Replace Blades" and dr_task["direction"] == "percent_left"
    assert dr_task["entity_ids"] == ["sensor.dreame_a1_blades_left"]

    wx = _by(setups[worx])
    assert wx[("Replace Blades", "usage_above")]["threshold"] == 6000.0  # 100 h in minutes
    assert wx[("Clean Undercarriage", "usage_delta")]["threshold"] == 1500.0  # 25 h in minutes


async def test_round14_pool_and_spa(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """IntelliCenter salt (value_below 2,700 ppm), Hot Spring salt cartridge
    age (usage_above 120 days, adopted end-to-end), NeoPool UV lamp (engine
    runtime on the RUNNING binary, 8,000 h; the chlorine ppm sensor labelled
    'Salt level' is NOT a salt source) and Bestway's filter-change latch."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    ic = await _seed(
        hass,
        "intellicenter",
        "ic1",
        "IntelliCenter",
        [
            ("sensor", "intellicenter_intellichlor_salt", None, "ppm", "3100"),
            ("sensor", "intellicenter_intellichem_ph", None, None, "7.4"),
        ],
    )
    spa = await _seed(
        hass,
        "hotspring",
        "hs1",
        "Hot Spring Highlife",
        [
            ("sensor", "hot_spring_highlife_salt_cartridge_age", "water_care_120_day_timer", "d", "40"),
            ("sensor", "hot_spring_highlife_salt_10_day_check_timer", "water_care_10_day_timer", "d", "4"),
        ],
    )
    neopool = await _seed(
        hass,
        "neopool",
        "np1",
        "NeoPool",
        [
            ("binary_sensor", "neopool_uv_lamp", "uv_lamp", None, "on"),
            ("binary_sensor", "neopool_filtration_pump", "filtration_pump", None, "on"),
            ("sensor", "neopool_salt_level", "measure_cl", "ppm", "1.2"),
        ],
    )
    bestway = await _seed(
        hass,
        "bestway",
        "bw1",
        "Flowclear pump",
        [
            ("binary_sensor", "pool_filter_change_required", None, None, "off"),
            ("binary_sensor", "pool_filter_errors", None, None, "off"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (salt,) = setups[ic]["tasks"]
    assert salt["task_name"] == "Refill Pool Salt" and salt["direction"] == "value_below"
    assert salt["entity_ids"] == ["sensor.intellicenter_intellichlor_salt"] and salt["threshold"] == 2700.0

    (cart,) = setups[spa]["tasks"]
    assert cart["task_name"] == "Replace Salt Cartridge" and cart["direction"] == "usage_above"
    assert cart["entity_ids"] == ["sensor.hot_spring_highlife_salt_cartridge_age"]
    assert cart["threshold"] == 120.0  # 2,880 h in days

    (uv,) = setups[neopool]["tasks"]
    assert uv["task_name"] == "Replace UV Lamp" and uv["direction"] == "runtime_hours"
    assert uv["entity_ids"] == ["binary_sensor.neopool_uv_lamp"] and uv["threshold"] == 8000.0
    uv_tc = build_setup_trigger(_sig("neopool", "Replace UV Lamp", "runtime_hours"), hass, uv["entity_ids"])
    assert uv_tc["type"] == "runtime" and uv_tc["trigger_on_states"] == ["on"]
    assert uv_tc["trigger_runtime_hours"] == 8000.0

    (flt,) = setups[bestway]["tasks"]
    assert flt["task_name"] == "Replace Filter" and flt["direction"] == "event_present"
    assert flt["entity_ids"] == ["binary_sensor.pool_filter_change_required"]
    latch = build_setup_trigger(_sig("bestway", "Replace Filter", "event_present"), hass, flt["entity_ids"])
    assert latch["type"] == "state_change" and latch["trigger_to_state"] == "on"
    assert latch["auto_complete_on_recovery"] is True

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": spa}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Hot Spring Highlife"
    )
    (task,) = obj.data[CONF_TASKS].values()
    tc = task["trigger_config"]
    assert tc["type"] == "counter" and tc["trigger_delta_mode"] is True
    assert tc["trigger_target_value"] == 120.0 and tc["trigger_baseline_value"] == 0
    assert tc["entity_id"] == "sensor.hot_spring_highlife_salt_cartridge_age"
