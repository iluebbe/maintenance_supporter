"""Catalog round 15, part B2 (HACS: air, heating & water, garden, cars).

Pins the reset buttons wired onto existing duties (Dreame mower, Landroid,
Landroid Vision, Sunseeker, Dyson local, Tuya Local, Samsung Local Things,
Komfovent, Pluggit, Grohe Blue), the key fixes (EcoWater days, Dyson's live
filter keys, AquaCell days fallback) and the new HACS entries (Volkswagen,
Smart, FordConnect, Stiebel Eltron ISG, Agua IOT, Robonect, Indego, Bayrol,
Dreame lawn mowers, Genvex, Nilan, ComfoConnect Pro, HERU, Midea AC, Nest
legacy, Pura).

Entities are seeded the way the real integrations register them: a
translation_key where the integration sets one, otherwise only the entity-id
suffix its naming code produces.
"""

from __future__ import annotations

from typing import NamedTuple

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
    build_setup_trigger,
    discover_integration_setups,
)

from .conftest import build_global_entry_data, setup_integration


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


class Ent(NamedTuple):
    """One seeded entity: FULL object id, translation_key, unit, state,
    platform domain, registry name, and whether the integration disabled it."""

    object_id: str
    tkey: str | None = None
    unit: str | None = None
    state: str = "40"
    platform: str = "sensor"
    original_name: str | None = None
    disabled: bool = False


def _button(object_id: str, tkey: str | None = None, name: str | None = None, *, disabled: bool = False) -> Ent:
    return Ent(object_id, tkey, None, "unknown", "button", name, disabled)


async def _seed(hass: HomeAssistant, domain: str, uid: str, device_name: str, entities: list[Ent]) -> str:
    """Seed one device of `domain`; the object id is used verbatim so the
    entity-id suffix is exactly what the real integration's naming produces."""
    source = MockConfigEntry(domain=domain, title=domain)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=device_name
    )
    ent_reg = er.async_get(hass)
    for ent in entities:
        entry = ent_reg.async_get_or_create(
            ent.platform,
            domain,
            f"{uid}_{ent.object_id}",
            config_entry=source,
            device_id=device.id,
            translation_key=ent.tkey,
            original_name=ent.original_name,
            suggested_object_id=ent.object_id,
            disabled_by=er.RegistryEntryDisabler.INTEGRATION if ent.disabled else None,
        )
        assert entry.entity_id == f"{ent.platform}.{ent.object_id}"
        if not ent.disabled:
            attrs = {"unit_of_measurement": ent.unit} if ent.unit is not None else {}
            hass.states.async_set(entry.entity_id, ent.state, attrs)
    return device.id


def _tasks(setups: dict[str, dict], device_id: str) -> dict[tuple[str, str], dict]:
    return {(t["task_name"], t["direction"]): t for t in setups[device_id]["tasks"]}


def _names(setups: dict[str, dict], device_id: str) -> set[str]:
    return {t["task_name"] for t in setups[device_id]["tasks"]}


def _reset(task: dict) -> str | None:
    return task["reset"]["entity_id"] if task["reset"] else None


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


async def test_mower_resets_and_sunseeker_parts(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Mowers: each blade counter names its own reset button — Dreame
    'reset_blades', Landroid 'reset_blade_time' (shipped disabled), Landroid
    Vision 'reset_blade_counter'. Sunseeker's four wear parts are separate
    duties, each wired to its own reset; a legacy entity without a
    translation_key still matches its part but never a reset."""
    await setup_integration(hass, global_entry)
    dreame = await _seed(
        hass,
        "dreame_mower",
        "a1",
        "Dreame A1",
        [
            Ent("dreame_a1_blades_left", "blades_left", "%", "40"),
            _button("dreame_a1_reset_blades", "reset_blades", "Dreame A1 Reset Main Brush"),
        ],
    )
    landroid = await _seed(
        hass,
        "landroid_cloud",
        "m500",
        "Landroid M500",
        [
            Ent("landroid_m500_blade_runtime_current", "blade_runtime_current", "min", "3000"),
            _button("landroid_m500_reset_blade_runtime", "reset_blade_time", "Reset blade runtime", disabled=True),
        ],
    )
    vision = await _seed(
        hass,
        "worx_vision_cloud",
        "v1",
        "Landroid Vision",
        [
            Ent("landroid_vision_blade_runtime_current", "blade_runtime_current", "min", "900"),
            _button("landroid_vision_reset_blade_runtime", "reset_blade_counter", "Reset blade runtime"),
        ],
    )
    sunseeker = await _seed(
        hass,
        "sunseeker",
        "x7",
        "Sunseeker X7",
        [
            Ent("x7_blade_time_left", "sunseeker_blade_time_left", "h", "120"),
            Ent("x7_blade_health", "sunseeker_blade_health", "%", "60"),
            Ent("x7_cutterplade_time_left", "sunseeker_cutterplade_time_left", "h", "300"),
            Ent("x7_cutterplade_health", "sunseeker_cutterplade_health", "%", "80"),
            Ent("x7_small_blade_health", "sunseeker_small_blade_health", "%", "30", original_name="Small blade health"),
            Ent("x7_small_cutterplade_health", "sunseeker_small_cutterplade_health", "%", "90"),
            _button("x7_reset_blade", "sunseeker_reset_blade", "Reset blade"),
            _button("x7_reset_bladeplade", "sunseeker_reset_bladeplade", "Reset bladeplade"),
            _button("x7_reset_small_blade", "sunseeker_reset_small_blade", "Reset small blade"),
            _button("x7_reset_small_bladeplade", "sunseeker_reset_small_bladeplade", "Reset small bladeplade"),
        ],
    )
    legacy = await _seed(
        hass,
        "sunseeker",
        "old",
        "Old Sunseeker",
        [
            Ent("old_sunseeker_blade_health", None, "%", "50"),
            Ent("old_sunseeker_small_blade_health", None, "%", "50"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (blades,) = setups[dreame]["tasks"]
    assert blades["task_name"] == "Replace Blades" and _reset(blades) == "button.dreame_a1_reset_blades"

    (lr,) = setups[landroid]["tasks"]
    assert lr["reset"] == {
        "entity_id": "button.landroid_m500_reset_blade_runtime",
        "name": "Reset blade runtime",
        "disabled": True,
    }
    (lv,) = setups[vision]["tasks"]
    assert _reset(lv) == "button.landroid_vision_reset_blade_runtime"

    parts = _tasks(setups, sunseeker)
    assert set(parts) == {
        ("Replace Blades", "duration_left"),
        ("Replace Blades", "percent_left"),
        ("Replace Cutting Disc", "percent_left"),
        ("Replace Edge Trimmer Blade", "percent_left"),
        ("Replace Edge Trimmer Disc", "percent_left"),
    }
    assert parts[("Replace Blades", "percent_left")]["entity_ids"] == ["sensor.x7_blade_health"]
    assert parts[("Replace Blades", "duration_left")]["entity_ids"] == ["sensor.x7_blade_time_left"]
    assert {name: _reset(task) for (name, _d), task in parts.items()} == {
        "Replace Blades": "button.x7_reset_blade",
        "Replace Cutting Disc": "button.x7_reset_bladeplade",
        "Replace Edge Trimmer Blade": "button.x7_reset_small_blade",
        "Replace Edge Trimmer Disc": "button.x7_reset_small_bladeplade",
    }

    old = _tasks(setups, legacy)
    assert old[("Replace Blades", "percent_left")]["entity_ids"] == ["sensor.old_sunseeker_blade_health"]
    assert old[("Replace Edge Trimmer Blade", "percent_left")]["entity_ids"] == ["sensor.old_sunseeker_small_blade_health"]
    assert all(t["reset"] is None for t in old.values())


async def test_new_hacs_mowers_and_pool(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Robonect (blade hours since the blade reset + lifetime hours), Indego
    (lifetime cut hours), Dreame/MOVA lawn mowers (CMS % counters, disabled
    reset buttons) and Bayrol pool dosing (canister latches, salt to add)."""
    await setup_integration(hass, global_entry)
    robonect = await _seed(
        hass,
        "robonect",
        "r1",
        "Automower 315",
        [
            Ent("automower_315_blades_hours", "mower_blades_hours", "h", "40"),
            Ent("automower_315_hours", "mower_statistic_hours", "h", "900"),
            _button("automower_315_blades_reset", "blades_reset"),
        ],
    )
    indego = await _seed(hass, "indego", "i1", "Indego", [Ent("indego_123_runtime_total", "runtime_total", "h", "210")])
    dreame = await _seed(
        hass,
        "dreame_lawn_mower",
        "d1",
        "Dreame A2",
        [
            Ent("dreame_a2_blade_remaining", None, "%", "30"),
            Ent("dreame_a2_cleaning_brush_remaining", None, "%", "70"),
            Ent("dreame_a2_robot_maintenance_remaining", None, "%", "5"),
            _button("dreame_a2_reset_blade_maintenance", None, "Reset Blade Maintenance", disabled=True),
            _button("dreame_a2_reset_cleaning_brush_maintenance", None, "Reset Cleaning Brush Maintenance", disabled=True),
            _button("dreame_a2_reset_robot_maintenance_maintenance", None, "Reset Robot Maintenance Maintenance", disabled=True),
        ],
    )
    pm5 = await _seed(
        hass,
        "bayrol",
        "pm5",
        "Bayrol PM5",
        [
            Ent("bayrol_abc_ph_canister_level", None, None, "Full"),
            Ent("bayrol_abc_cl_canister_level", None, None, "Low", original_name="Cl Canister Level"),
            Ent("bayrol_abc_redox_canister_level", None, None, "Full", original_name="Redox Canister Level"),
        ],
    )
    salt = await _seed(
        hass,
        "bayrol",
        "salt",
        "Bayrol Automatic SALT",
        [
            Ent("bayrol_def_ph_minus_canister_status", None, None, "Not Empty"),
            Ent("bayrol_def_salt_to_add", None, "kg", "0"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    rb = _tasks(setups, robonect)
    assert set(rb) == {("Replace Blades", "usage_above"), ("Clean Undercarriage", "usage_delta")}
    assert rb[("Replace Blades", "usage_above")]["threshold"] == 100.0
    assert _reset(rb[("Replace Blades", "usage_above")]) == "button.automower_315_blades_reset"
    assert rb[("Clean Undercarriage", "usage_delta")]["threshold"] == 25.0

    ind = _tasks(setups, indego)
    assert set(ind) == {("Replace Blades", "usage_delta"), ("Clean Undercarriage", "usage_delta")}
    assert ind[("Replace Blades", "usage_delta")]["threshold"] == 100.0

    dm = {t["task_name"]: t for t in setups[dreame]["tasks"]}
    assert set(dm) == {"Replace Blades", "Replace Cleaning Brush", "Clean Undercarriage"}
    assert dm["Clean Undercarriage"]["entity_ids"] == ["sensor.dreame_a2_robot_maintenance_remaining"]
    assert dm["Replace Blades"]["reset"] == {
        "entity_id": "button.dreame_a2_reset_blade_maintenance",
        "name": "Reset Blade Maintenance",
        "disabled": True,
    }
    assert _reset(dm["Replace Cleaning Brush"]) == "button.dreame_a2_reset_cleaning_brush_maintenance"
    assert _reset(dm["Clean Undercarriage"]) == "button.dreame_a2_reset_robot_maintenance_maintenance"

    pool = {t["task_name"]: t for t in setups[pm5]["tasks"]}
    assert set(pool) == {
        "Replace pH Canister",
        "Replace Chlorine Canister — Cl Canister Level",
        "Replace Chlorine Canister — Redox Canister Level",
    }
    latch = _trigger(hass, "bayrol", pool["Replace pH Canister"])
    assert latch["type"] == "state_change" and latch["trigger_to_state"] == "Empty"

    auto = {t["task_name"]: t for t in setups[salt]["tasks"]}
    assert set(auto) == {"Replace pH Canister", "Refill Pool Salt"}
    assert auto["Refill Pool Salt"]["direction"] == "alert_above" and auto["Refill Pool Salt"]["threshold"] == 5.0


async def test_air_resets_and_dyson_keys(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Dyson local (Pure Cool Link reset for hours + %, deep clean), the
    hass_dyson live filter keys, Tuya Local (tk and name-only reset; two
    candidate buttons = none), Samsung Local Things, Komfovent and Pluggit."""
    await setup_integration(hass, global_entry)
    link = await _seed(
        hass,
        "dyson_local",
        "tp02",
        "Dyson TP02",
        [
            Ent("dyson_tp02_filter_life", None, "h", "3000"),
            Ent("dyson_tp02_filter_life_percentage", None, "%", "70"),
            _button("dyson_tp02_reset_filter_life", None, "Dyson TP02 Reset Filter Life"),
        ],
    )
    humidify = await _seed(
        hass,
        "dyson_local",
        "ph01",
        "Dyson PH01",
        [Ent("dyson_ph01_filter_life", None, "%", "80"), Ent("dyson_ph01_next_deep_clean", None, "h", "300")],
    )
    hass_dyson = await _seed(
        hass,
        "hass_dyson",
        "hp09",
        "Dyson HP09",
        [
            Ent("dyson_hp09_hepa_filter_life", "hepa_filter_life", "%", "60"),
            Ent("dyson_hp09_carbon_filter_life", "carbon_filter_life", "%", "40"),
            Ent("dyson_hp09_next_cleaning_cycle", "next_cleaning_cycle", "h", "200"),
        ],
    )
    ap402 = await _seed(
        hass,
        "tuya_local",
        "ap402",
        "AP402",
        [Ent("ap402_filter_life", "filter_life", "%", "50"), _button("ap402_filter_reset", "filter_reset", "Filter reset")],
    )
    medion = await _seed(
        hass,
        "tuya_local",
        "s20",
        "Medion S20",
        [Ent("medion_s20_filter_life", "filter_life", "%", "50"), _button("medion_s20_reset_filter", None, "Reset filter")],
    )
    ro = await _seed(
        hass,
        "tuya_local",
        "ro1",
        "RO Purifier",
        [
            Ent("ro_purifier_filter_life", "filter_life", "%", "50"),
            _button("ro_purifier_ro_filter_reset", None, "RO filter reset"),
            _button("ro_purifier_pp_filter_reset", None, "PP filter reset"),
        ],
    )
    samsung = await _seed(
        hass,
        "localthings",
        "rac",
        "Samsung AC",
        [
            Ent("samsung_ac_air_filter_usage", "air_filter_usage", "%", "95"),
            Ent("samsung_ac_air_filter_usage_hours", "air_filter_usage_hours", "h", "480"),
            _button("samsung_ac_reset_air_filter", "air_filter_reset", "Reset air filter"),
        ],
    )
    komfovent = await _seed(
        hass,
        "komfovent",
        "c6",
        "Komfovent C6",
        [
            Ent("komfovent_c6_filter_clogging", "filter_clogging", "%", "35"),
            _button("komfovent_c6_clean_filters_calibration", "clean_filters", "Clean Filters Calibration"),
        ],
    )
    pluggit = await _seed(
        hass,
        "pluggit",
        "ap310",
        "Pluggit AP310",
        [
            Ent("pluggit_ap310_filter_remain", "filter_remain", "d", "120"),
            _button("pluggit_ap310_reset_filter", "filter_reset", "Reset Filter"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    lk = _tasks(setups, link)
    assert set(lk) == {("Replace Filter", "duration_left"), ("Replace Filter", "percent_left")}
    assert {_reset(t) for t in lk.values()} == {"button.dyson_tp02_reset_filter_life"}

    hm = _tasks(setups, humidify)
    assert set(hm) == {("Replace Filter", "percent_left"), ("Descale Appliance", "duration_left")}
    assert hm[("Replace Filter", "percent_left")]["reset"] is None  # Pure Cool: no reset button
    assert hm[("Descale Appliance", "duration_left")]["threshold"] == 24.0

    hd = _tasks(setups, hass_dyson)
    assert set(hd) == {("Replace Filter", "percent_left"), ("Descale Appliance", "duration_left")}
    assert len(hd[("Replace Filter", "percent_left")]["entity_ids"]) == 2  # HEPA + carbon, any-low

    (ap,) = setups[ap402]["tasks"]
    assert _reset(ap) == "button.ap402_filter_reset"
    (md,) = setups[medion]["tasks"]
    assert _reset(md) == "button.medion_s20_reset_filter"
    (r,) = setups[ro]["tasks"]
    assert r["reset"] is None, "two buttons end in _filter_reset — never guess"

    (fc,) = setups[samsung]["tasks"]
    assert fc["task_name"] == "Filter Cleaning" and _reset(fc) == "button.samsung_ac_reset_air_filter"
    (kv,) = setups[komfovent]["tasks"]
    assert _reset(kv) == "button.komfovent_c6_clean_filters_calibration"
    (pv,) = setups[pluggit]["tasks"]
    assert _reset(pv) == "button.pluggit_ap310_reset_filter"


async def test_new_hacs_ventilation_ac_and_diffusers(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Genvex (days left on Nilan CTS, days since on Optima — both reset by
    'filter_reset'), Nilan CTS602, ComfoConnect Pro, HERU (unit spelled
    'days'), Midea AC (engine runtime on the climate entity), Nest legacy
    (filter runtime in seconds) and Pura (one task per vial)."""
    await setup_integration(hass, global_entry)
    cts602 = await _seed(
        hass,
        "genvex_connect",
        "cts",
        "Nilan Compact P",
        [
            Ent("nilan_compact_p_filter_days_left", "filter_days_left", "d", "40"),
            _button("nilan_compact_p_reset_filter", "filter_reset", "Reset filter"),
        ],
    )
    optima = await _seed(
        hass,
        "genvex_connect",
        "opt",
        "Genvex Optima 270",
        [
            Ent("genvex_optima_270_filter_days", "filter_days", "d", "20"),
            _button("genvex_optima_270_reset_filter", "filter_reset", "Reset filter"),
        ],
    )
    nilan = await _seed(
        hass,
        "nilan",
        "n1",
        "Nilan CTS602",
        [
            Ent("nilan_days_to_air_filter_change", "days_to_air_filter_change", "d", "30"),
            Ent("nilan_days_since_air_filter_change", "days_since_air_filter_change", "d", "60"),
        ],
    )
    comfo = await _seed(
        hass,
        "ha_comfoconnectpro",
        "q350",
        "ComfoAir Q350",
        [Ent("comfoair_q350_filter_ersetzen_in", "filter_days_remaining", "d", "50")],
    )
    heru = await _seed(
        hass,
        "heru",
        "h1",
        "HERU 100",
        [
            Ent("heru_100_filter_days_left", None, "days", "90"),
            _button("heru_100_reset_filter_timer", None, "Reset filter timer"),
        ],
    )
    midea = await _seed(
        hass,
        "midea_ac",
        "m1",
        "Bedroom AC",
        [
            Ent("bedroom_ac", None, None, "cool", "climate"),
            Ent("bedroom_ac_filter_alert", "filter_alert", None, "off", "binary_sensor"),
        ],
    )
    nest = await _seed(
        hass,
        "nest_legacy",
        "t3",
        "Hallway Thermostat",
        [Ent("hallway_thermostat_filter_runtime", "filter_runtime", "s", "360000")],
    )
    pura_wall = await _seed(
        hass,
        "pura",
        "p4",
        "Pura 4",
        [
            Ent(
                "pura_4_bay_1_fragrance_remaining",
                "bay_fragrance_remaining",
                "%",
                "60",
                original_name="Bay 1 fragrance remaining",
            ),
            Ent(
                "pura_4_bay_2_fragrance_remaining",
                "bay_fragrance_remaining",
                "%",
                "20",
                original_name="Bay 2 fragrance remaining",
            ),
        ],
    )
    pura_car = await _seed(
        hass, "pura", "car", "Pura Car", [Ent("pura_car_fragrance_remaining", "fragrance_remaining", "%", "50")]
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (cts,) = setups[cts602]["tasks"]
    assert cts["direction"] == "duration_left" and cts["threshold"] == 7.0
    assert _reset(cts) == "button.nilan_compact_p_reset_filter"
    (opt,) = setups[optima]["tasks"]
    assert opt["direction"] == "usage_above" and opt["threshold"] == 182.5  # 4,380 h in days
    assert _reset(opt) == "button.genvex_optima_270_reset_filter"

    (nt,) = setups[nilan]["tasks"]
    assert nt["entity_ids"] == ["sensor.nilan_days_to_air_filter_change"] and nt["threshold"] == 7.0
    (ct,) = setups[comfo]["tasks"]
    assert ct["task_name"] == "Replace Ventilation Filter" and ct["threshold"] == 7.0
    (ht,) = setups[heru]["tasks"]
    assert ht["threshold"] == 7.0  # the spelled-out 'days' unit converts like 'd'
    assert _reset(ht) == "button.heru_100_reset_filter_timer"

    (mt,) = setups[midea]["tasks"]
    assert mt["task_name"] == "Filter Cleaning" and mt["direction"] == "runtime_hours"
    assert mt["entity_ids"] == ["climate.bedroom_ac"]
    assert SIGNATURES["midea_ac"].tasks[0] is SIGNATURES["gree"].tasks[0]

    (nf,) = setups[nest]["tasks"]
    assert nf["direction"] == "usage_above" and nf["threshold"] == 300 * 3600.0

    wall = {t["task_name"] for t in setups[pura_wall]["tasks"]}
    assert wall == {"Replace Air Freshener — Bay 1 fragrance remaining", "Replace Air Freshener — Bay 2 fragrance remaining"}
    (car,) = setups[pura_car]["tasks"]
    assert car["task_name"] == "Replace Air Freshener"


async def test_water_heating_fixes_and_new_entries(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Grohe Blue resets, the EcoWater days key the entity really carries,
    the AquaCell days fallback, Stiebel Eltron LWZ filter requests (one latch
    over three bits) and Agua IOT hydro-stove pressure (its service-hours
    counter is NOT signed — its limit sibling shares the suffix)."""
    await setup_integration(hass, global_entry)
    grohe = await _seed(
        hass,
        "grohe_smarthome",
        "blue1",
        "Grohe Blue Home",
        [
            Ent("grohe_blue_home_remaining_filter", None, "%", "30"),
            Ent("grohe_blue_home_remaining_co2", None, "%", "60"),
            Ent("grohe_blue_home_remaining_filter_app", None, "%", "30"),
            _button("grohe_blue_home_reset_filter", None, "Reset Filter"),
            _button("grohe_blue_home_reset_co2", None, "Reset CO2"),
        ],
    )
    eco = await _seed(
        hass,
        "ecowater_softener",
        "ew1",
        "EcoWater ERR3500",
        [
            Ent("ecowater_123_salt_level_percentage", None, "%", "50"),
            Ent("ecowater_123_days_until_out_of_salt", None, "d", "30"),
        ],
    )
    aquacell = await _seed(
        hass,
        "aquacell",
        "ac1",
        "AquaCell",
        [
            Ent("aquacell_salt_left_side_percentage", "salt_left_side_percentage", "%", "50"),
            Ent("aquacell_salt_right_side_percentage", "salt_right_side_percentage", "%", "60"),
            Ent("aquacell_salt_left_side_time_remaining", "salt_left_side_time_remaining", "d", "40"),
            Ent("aquacell_salt_right_side_time_remaining", "salt_right_side_time_remaining", "d", "45"),
        ],
    )
    lwz = await _seed(
        hass,
        "stiebel_eltron_isg",
        "lwz",
        "Stiebel Eltron LWZ",
        [
            Ent("stiebel_eltron_lwz_filter", "filter", None, "off", "binary_sensor"),
            Ent("stiebel_eltron_lwz_filter_extract_air", "filter_extract_air", None, "off", "binary_sensor"),
            Ent("stiebel_eltron_lwz_filter_ventilation_air", "filter_ventilation_air", None, "off", "binary_sensor"),
            Ent("stiebel_eltron_lwz_service", "service", None, "off", "binary_sensor"),
            Ent("stiebel_eltron_lwz_compressor", "compressor_on", None, "on", "binary_sensor"),
        ],
    )
    stove = await _seed(
        hass,
        "aguaiot",
        "st1",
        "Hydro Stove",
        [
            Ent("hydro_stove_water_pressure", None, "bar", "1.4"),
            Ent("hydro_stove_service_hours", None, "h", "900"),
            Ent("hydro_stove_threshold_service_hours", None, "h", "1800"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    gr = {t["task_name"]: t for t in setups[grohe]["tasks"]}
    assert set(gr) == {"Replace Water Filter", "Replace CO2 Bottle"}
    assert gr["Replace Water Filter"]["entity_ids"] == ["sensor.grohe_blue_home_remaining_filter"]
    assert _reset(gr["Replace Water Filter"]) == "button.grohe_blue_home_reset_filter"
    assert _reset(gr["Replace CO2 Bottle"]) == "button.grohe_blue_home_reset_co2"

    ew = _tasks(setups, eco)
    assert set(ew) == {("Refill Softener Salt", "percent_left"), ("Refill Softener Salt", "duration_left")}
    assert ew[("Refill Softener Salt", "duration_left")]["entity_ids"] == ["sensor.ecowater_123_days_until_out_of_salt"]
    assert ew[("Refill Softener Salt", "duration_left")]["threshold"] == 7.0

    ac = _tasks(setups, aquacell)
    assert set(ac) == {("Refill Softener Salt", "percent_left"), ("Refill Softener Salt", "duration_left")}
    assert len(ac[("Refill Softener Salt", "duration_left")]["entity_ids"]) == 2
    assert ac[("Refill Softener Salt", "duration_left")]["threshold"] == 7.0

    (fl,) = setups[lwz]["tasks"]
    assert fl["task_name"] == "Replace Ventilation Filter" and fl["direction"] == "event_present"
    assert fl["entity_ids"] == [
        "binary_sensor.stiebel_eltron_lwz_filter",
        "binary_sensor.stiebel_eltron_lwz_filter_extract_air",
        "binary_sensor.stiebel_eltron_lwz_filter_ventilation_air",
    ]
    latch = _trigger(hass, "stiebel_eltron_isg", fl)
    assert latch["trigger_to_state"] == "on" and latch["entity_logic"] == "any"

    (pr,) = setups[stove]["tasks"]
    assert pr["task_name"] == "Refill Heating Water" and pr["entity_ids"] == ["sensor.hydro_stove_water_pressure"]


async def test_new_hacs_cars(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Volkswagen (the car's own service/oil countdowns, name-derived ids),
    Smart #1 (translation_key only — the three 'Service due in' sensors share
    a name) and FordConnect (oil life %, odometer pair)."""
    await setup_integration(hass, global_entry)
    vw = await _seed(
        hass,
        "volkswagencarnet",
        "vin1",
        "Golf",
        [
            Ent("golf_odometer", None, "km", "42000"),
            Ent("golf_service_inspection_days", None, "d", "200"),
            Ent("golf_service_inspection_distance", None, "km", "12000"),
            Ent("golf_oil_inspection_days", None, "d", "100"),
            Ent("golf_oil_inspection_distance", None, "km", "8000"),
        ],
    )
    smart = await _seed(
        hass,
        "smarthashtag",
        "vin2",
        "Smart #1",
        [
            Ent("smart_1_odometer", "odometer", "km", "15000"),
            Ent("smart_1_service_due_in", "days_to_service", "d", "300"),
            Ent("smart_1_service_due_in_2", "engine_hours_to_service", "h", "0"),
            Ent("smart_1_service_due_in_3", "distance_to_service", "km", "9000"),
        ],
    )
    ford = await _seed(
        hass,
        "fordconnect_query",
        "vin3",
        "F-150",
        [Ent("fcq_1ftfw_odometer", "odometer", "km", "30000"), Ent("fcq_1ftfw_oil", "oil", "%", "60")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    golf = _tasks(setups, vw)
    assert set(golf) == {
        ("Tire Rotation", "usage_delta"),
        ("Annual Service", "duration_left"),
        ("Annual Service", "value_below"),
        ("Oil Service", "duration_left"),
        ("Oil Service", "value_below"),
    }
    assert golf[("Annual Service", "duration_left")]["threshold"] == 14.0  # 336 h in days
    assert golf[("Oil Service", "value_below")]["threshold"] == 1000.0

    sm = _tasks(setups, smart)
    assert set(sm) == {("Tire Rotation", "usage_delta"), ("Annual Service", "duration_left"), ("Annual Service", "value_below")}
    assert sm[("Annual Service", "duration_left")]["entity_ids"] == ["sensor.smart_1_service_due_in"]
    assert sm[("Annual Service", "value_below")]["entity_ids"] == ["sensor.smart_1_service_due_in_3"]

    fd = _tasks(setups, ford)
    assert set(fd) == {("Annual Service", "usage_delta"), ("Tire Rotation", "usage_delta"), ("Oil Service", "percent_left")}
    assert fd[("Oil Service", "percent_left")]["entity_ids"] == ["sensor.fcq_1ftfw_oil"]
