"""Catalog wave 2026-09-25, part C (air + heating modules).

Pins the Gree fix (runtime on the climate STATE — core's Gree entity never
sets hvac_action) and the round-14 additions: purifier/HRV filters (Meross,
Tuya Local, Govee, Duux, Carrier, Komfovent, Pluggit/Dantherm, Samsung Local
Things, core Flexit Modbus), boiler pressure (De Dietrich, Remeha Home),
softener salt (SYR Connect, Salt Sentry, Unique Waterontharder, BWT AQA Perla
BLE) and generator engine hours (Generac, EnergyTrak, Himoinsa C4LAN).

Entities are seeded the way the real integrations register them: a
translation_key where the integration sets one, otherwise only the entity-id
suffix its naming code produces.
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
    build_setup_trigger,
    discover_integration_setups,
)

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration


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
    entities: list[tuple[str, str | None, str | None, str]],
    platform: str = "sensor",
) -> str:
    """Seed one device of `domain` with (object_id, translation_key, unit,
    state) entities — object_id is the FULL object id, so the entity-id
    suffix is exactly what the real integration's naming code produces."""
    source = MockConfigEntry(domain=domain, title=domain)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=device_name
    )
    ent_reg = er.async_get(hass)
    for object_id, tkey, unit, state in entities:
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


def _sig(domain: str, task_name: str):
    return next(s for s in SIGNATURES[domain].tasks if s.task_name == task_name)


async def test_gree_filter_cleaning_runs_on_the_climate_state(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Gree's climate entity never sets hvac_action — the runtime trigger
    must watch the STATE (the HVAC mode) with every running mode, and carry
    no attribute (the old attribute trigger never accumulated)."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    source = MockConfigEntry(domain="gree", title="Gree")
    source.add_to_hass(hass)
    dev = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={("gree", "g1")}, name="Gree Bora")
    clim = er.async_get(hass).async_get_or_create(
        "climate",
        "gree",
        "g1",
        config_entry=source,
        device_id=dev.id,
        suggested_object_id="gree_bora",
    )
    # Real Gree state: the HVAC mode, and NO hvac_action attribute at all.
    hass.states.async_set(clim.entity_id, "fan_only", {"hvac_modes": ["auto", "cool", "dry", "fan_only", "heat", "off"]})

    (setup,) = discover_integration_setups(hass)
    (task,) = setup["tasks"]
    assert task["task_name"] == "Filter Cleaning" and task["direction"] == "runtime_hours"
    assert task["threshold"] == 100.0
    assert task["entity_ids"] == ["climate.gree_bora"]

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": dev.id}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Gree Bora"
    )
    (t,) = obj.data[CONF_TASKS].values()
    tc = t["trigger_config"]
    assert tc["type"] == "runtime" and tc["entity_id"] == "climate.gree_bora"
    assert "attribute" not in tc
    assert tc["trigger_on_states"] == ["auto", "cool", "dry", "fan_only", "heat"]
    assert "off" not in tc["trigger_on_states"]


async def test_round14_purifier_filters_percent_remaining(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Meross MAP100 (suffix _filter), Tuya Local / Govee / Duux (tk), and
    Carrier (suffix _filter_remaining) — all % REMAINING → Replace Filter at
    the household floor. Tuya Local's duration-unit filter_life variant is
    deliberately NOT claimed (some count up un-inverted)."""
    await setup_integration(hass, global_entry)
    meross = await _seed(
        hass,
        "meross_lan",
        "map100",
        "Meross Purifier",
        [("meross_purifier_filter", None, "%", "63"), ("meross_purifier_signal_strength", None, "%", "80")],
    )
    tuya = await _seed(
        hass,
        "tuya_local",
        "kogan",
        "Kogan Purifier",
        [("kogan_purifier_filter_life", "filter_life", "%", "45")],
    )
    tuya_fountain = await _seed(
        hass,
        "tuya_local",
        "fresco",
        "Pet Fountain",
        [("pet_fountain_filter_life", "filter_life", "min", "20000")],
    )
    govee = await _seed(
        hass,
        "govee",
        "h7126",
        "Govee H7126",
        [("govee_h7126_filter_life", "sensor_filter_life", "%", "70")],
    )
    duux = await _seed(
        hass,
        "duux",
        "bright2",
        "Duux Bright 2",
        [("duux_bright_2_hepa_filter_remaining_lifespan", "filter_life", "%", "80")],
    )
    carrier = await _seed(
        hass,
        "ha_carrier",
        "inf1",
        "Carrier Infinity",
        [("carrier_infinity_filter_remaining", None, "%", "55"), ("carrier_infinity_humidifier_remaining", None, "%", "30")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert tuya_fountain not in setups

    for dev_id, expected in (
        (meross, "sensor.meross_purifier_filter"),
        (tuya, "sensor.kogan_purifier_filter_life"),
        (govee, "sensor.govee_h7126_filter_life"),
        (duux, "sensor.duux_bright_2_hepa_filter_remaining_lifespan"),
        (carrier, "sensor.carrier_infinity_filter_remaining"),
    ):
        (task,) = setups[dev_id]["tasks"]
        assert task["task_name"] == "Replace Filter", dev_id
        assert task["direction"] == "percent_left"
        assert task["threshold"] == 10.0  # household consumable floor
        assert task["entity_ids"] == [expected]


async def test_round14_ventilation_filters(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Komfovent clogging % (alert_above 90), Pluggit/Dantherm filter days
    remaining (7 d), core Flexit Modbus filter timer (4380 h, mirrors
    flexit_bacnet)."""
    await setup_integration(hass, global_entry)
    komfovent = await _seed(
        hass,
        "komfovent",
        "c6",
        "Komfovent C6",
        [("komfovent_c6_filter_clogging", "filter_clogging", "%", "35")],
    )
    pluggit = await _seed(
        hass,
        "pluggit",
        "ap310",
        "Pluggit AP310",
        [("pluggit_ap310_filter_remain", "filter_remain", "d", "120")],
    )
    dantherm = await _seed(
        hass,
        "dantherm",
        "hcv5",
        "Dantherm HCV5",
        [("dantherm_hcv5_filter_remain", "filter_remain", "d", "90")],
    )
    flexit = await _seed(
        hass,
        "flexit",
        "uni3",
        "Flexit UNI 3",
        [("flexit_uni_3_air_filter_operating_time", "air_filter_operating_time", "h", "1200")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (kv,) = setups[komfovent]["tasks"]
    assert kv["task_name"] == "Replace Ventilation Filter"
    assert kv["direction"] == "alert_above" and kv["threshold"] == 90.0
    trig = build_setup_trigger(_sig("komfovent", "Replace Ventilation Filter"), hass, kv["entity_ids"])
    assert trig["type"] == "threshold" and trig["trigger_above"] == 90.0
    assert trig["auto_complete_on_recovery"] is True

    for dev_id in (pluggit, dantherm):
        (pv,) = setups[dev_id]["tasks"]
        assert pv["task_name"] == "Replace Ventilation Filter"
        assert pv["direction"] == "duration_left" and pv["threshold"] == 7.0  # 168 h in days

    (fx,) = setups[flexit]["tasks"]
    assert fx["task_name"] == "Replace Ventilation Filter"
    assert fx["direction"] == "usage_above" and fx["threshold"] == 4380.0
    trig = build_setup_trigger(_sig("flexit", "Replace Ventilation Filter"), hass, fx["entity_ids"])
    assert trig["type"] == "counter" and trig["trigger_delta_mode"] is True
    assert trig["trigger_baseline_value"] == 0 and trig["trigger_target_value"] == 4380.0


async def test_round14_localthings_samsung_filter_duties(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Samsung Local Things: every filterUsage is % USED. The AC dust filter
    (air_filter_usage + its AC-only usage_hours sibling) → Filter Cleaning;
    the fridge reuses air_filter_usage for its deodorizing filter WITHOUT the
    sibling and gets nothing (its water/deodor 'Filter usage' entities are not
    signed either); purifier HEPA → Replace Filter; hood → Clean Grease
    Filter. HA names them all 'Filter usage' — only the translation_key
    tells them apart."""
    await setup_integration(hass, global_entry)
    ac = await _seed(
        hass,
        "localthings",
        "ac1",
        "WindFree AC",
        [
            ("windfree_ac_filter_usage", "air_filter_usage", "%", "93"),
            ("windfree_ac_filter_usage_hours", "air_filter_usage_hours", "h", "465"),
        ],
    )
    fridge = await _seed(
        hass,
        "localthings",
        "ref1",
        "Fridge",
        [
            ("fridge_filter_usage", "filter_usage", "%", "40"),
            ("fridge_filter_usage_2", "air_filter_usage", "%", "95"),
            ("fridge_filter_usage_3", "deodor_filter_usage", "%", "-1"),
        ],
    )
    purifier = await _seed(
        hass,
        "localthings",
        "ap1",
        "Purifier",
        [("purifier_hepa_filter_usage", "hepa_filter_usage", "%", "12")],
    )
    old_purifier = await _seed(
        hass,
        "localthings",
        "ap0",
        "Old Purifier",
        [("old_purifier_filter_progress", "filter_progress", "%", "88")],
    )
    hood = await _seed(
        hass,
        "localthings",
        "hood1",
        "Hood",
        [("hood_filter_usage", "hood_filter_usage", "%", "20")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert fridge not in setups

    (ac_task,) = setups[ac]["tasks"]
    assert ac_task["task_name"] == "Filter Cleaning"
    assert ac_task["direction"] == "alert_above" and ac_task["threshold"] == 90.0
    assert ac_task["entity_ids"] == ["sensor.windfree_ac_filter_usage"]  # not the hours sibling

    for dev_id, eid in ((purifier, "sensor.purifier_hepa_filter_usage"), (old_purifier, "sensor.old_purifier_filter_progress")):
        (pt,) = setups[dev_id]["tasks"]
        assert pt["task_name"] == "Replace Filter"
        assert pt["direction"] == "alert_above" and pt["threshold"] == 90.0
        assert pt["entity_ids"] == [eid]

    (ht,) = setups[hood]["tasks"]
    assert ht["task_name"] == "Clean Grease Filter" and ht["threshold"] == 90.0


async def test_round14_boiler_pressure_and_softener_salt(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """De Dietrich (tk) / Remeha Home (suffix) loop pressure below 1 bar;
    SYR salt supply in WEEKS as value_below 2 in the entity's own unit (the
    duration conversion has no weeks factor); Salt Sentry / Unique /
    BWT BLE salt % → Refill Softener Salt."""
    await setup_integration(hass, global_entry)
    dietrich = await _seed(
        hass,
        "de_dietrich",
        "diematic",
        "Diematic",
        [("diematic_water_pressure", "water_pressure", "bar", "1.6")],
    )
    remeha = await _seed(
        hass,
        "remeha_home",
        "tzerra",
        "Remeha Tzerra",
        [("remeha_tzerra_water_pressure", None, "bar", "1.8")],
    )
    syr = await _seed(
        hass,
        "syr_connect",
        "lex",
        "SYR LEX Plus",
        [
            ("syr_connect_123456_getss1", "getss1", "w", "6"),
            ("syr_connect_123456_getsv1", "getsv1", "kg", "12"),
        ],
    )
    sentry = await _seed(
        hass,
        "salt_sentry",
        "ss1",
        "Salt Sentry 1A2B",
        [("salt_sentry_1a2b_salt_level", "salt_level", "%", "55"), ("salt_sentry_1a2b_distance", "distance", "cm", "30")],
    )
    unique = await _seed(
        hass,
        "unique_waterontharder",
        "u1",
        "Unique Softener",
        [("unique_softener_salt_level", "salt_level", "%", "60")],
    )
    bwt = await _seed(
        hass,
        "bwt_aqa_perla_ble",
        "bwt1",
        "AQA Perla",
        [("aqa_perla_salt", "salt_pct", "%", "70"), ("aqa_perla_salt_remaining", "salt_kg", "kg", "8")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for dev_id in (dietrich, remeha):
        (bp,) = setups[dev_id]["tasks"]
        assert bp["task_name"] == "Refill Heating Water"
        assert bp["direction"] == "value_below" and bp["threshold"] == 1.0

    (sy,) = setups[syr]["tasks"]
    assert sy["task_name"] == "Refill Softener Salt"
    assert sy["direction"] == "value_below" and sy["threshold"] == 2.0  # weeks, not converted
    assert sy["entity_ids"] == ["sensor.syr_connect_123456_getss1"]
    trig = build_setup_trigger(_sig("syr_connect", "Refill Softener Salt"), hass, sy["entity_ids"])
    assert trig["type"] == "threshold" and trig["trigger_below"] == 2.0

    for dev_id in (sentry, unique, bwt):
        (st,) = setups[dev_id]["tasks"]
        assert st["task_name"] == "Refill Softener Salt"
        assert st["direction"] == "percent_left" and st["threshold"] == 10.0
        assert len(st["entity_ids"]) == 1


async def test_round14_generator_engine_hours_oil_service(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Lifetime engine-hours counters → Oil Service as a delta counter:
    Generac (property 71 'Engine Hours', suffix _run_time) and EnergyTrak
    (tk) every 200 h, Himoinsa C4LAN (suffix _engine_hours) every 250 h."""
    await setup_integration(hass, global_entry)
    generac = await _seed(
        hass,
        "generac",
        "gen1",
        "Guardian 22kW",
        [("generac_gen1_run_time", None, "h", "31"), ("generac_gen1_protection_time", None, "h", "56184")],
    )
    energytrak = await _seed(
        hass,
        "energytrak",
        "et1",
        "Standby Generator",
        [("standby_generator_engine_hours", "engine_hours", "h", "412.5")],
    )
    himoinsa = await _seed(
        hass,
        "himoinsa_c4lan",
        "c4",
        "C4LAN Generator",
        [("c4lan_generator_engine_hours", None, "h", "1830")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (gt,) = setups[generac]["tasks"]
    assert gt["task_name"] == "Oil Service"
    assert gt["direction"] == "usage_delta" and gt["threshold"] == 200.0
    assert gt["entity_ids"] == ["sensor.generac_gen1_run_time"]  # not protection time
    trig = build_setup_trigger(_sig("generac", "Oil Service"), hass, gt["entity_ids"])
    assert trig["type"] == "counter" and trig["trigger_delta_mode"] is True
    assert trig["trigger_target_value"] == 200.0
    # Lifetime counter: no explicit 0 baseline, no auto-complete.
    assert "trigger_baseline_value" not in trig and "auto_complete_on_recovery" not in trig

    (et,) = setups[energytrak]["tasks"]
    assert et["task_name"] == "Oil Service" and et["threshold"] == 200.0

    (ht,) = setups[himoinsa]["tasks"]
    assert ht["task_name"] == "Oil Service"
    assert ht["direction"] == "usage_delta" and ht["threshold"] == 250.0


def test_round14_signatures_are_catalogued_with_source_and_ref() -> None:
    """Every round-14 domain is in the assembled catalog with its audit trail
    (the registry raises on a duplicate domain across modules)."""
    for domain in (
        "meross_lan",
        "tuya_local",
        "govee",
        "duux",
        "komfovent",
        "pluggit",
        "dantherm",
        "ha_carrier",
        "localthings",
        "flexit",
        "de_dietrich",
        "remeha_home",
        "syr_connect",
        "salt_sentry",
        "unique_waterontharder",
        "bwt_aqa_perla_ble",
        "generac",
        "energytrak",
        "himoinsa_c4lan",
    ):
        cat = SIGNATURES[domain]
        assert cat.verified.startswith("2026-09-25 @ "), domain
        assert cat.source and cat.tasks, domain
    gree = SIGNATURES["gree"].tasks[0]
    assert gree.entity_domain == "climate" and gree.attribute == ""
