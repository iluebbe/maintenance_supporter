"""Catalog wave 2026-09-25, part A (vacuums, printers, pets, personal care).

Pins the Tuya fix (core's robot-vacuum category carries four percent life
sensors next to the engine-runtime duties) and the round-14 additions:
Ecovacs 2026.8 lifespans + GOAT mowing hours, Roborock dock/Q7/Dyad/Zeo
consumables, Brother inkjets and kits, the HACS vacuums (Eufy Clean, Eufy
RoboVac, Tineco, Xiaomi cloud, ILIFE), 3D printers (Creality, Elegoo,
Anycubic), HP/Epson ink, PETLIBRO countdowns, Philips shaver heads and the
live Oral-B brush-head countdown.

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
    platform domain and the integration's original (registry) name."""

    object_id: str
    tkey: str | None = None
    unit: str | None = None
    state: str = "40"
    platform: str = "sensor"
    original_name: str | None = None


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
        )
        assert entry.entity_id == f"{ent.platform}.{ent.object_id}"
        attrs = {"unit_of_measurement": ent.unit} if ent.unit is not None else {}
        hass.states.async_set(entry.entity_id, ent.state, attrs)
    return device.id


def _by_name(setups: dict[str, dict], device_id: str) -> dict[str, dict]:
    return {t["task_name"]: t for t in setups[device_id]["tasks"]}


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    """The pre-wired trigger the adopt path would build for a proposal."""
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


async def test_tuya_robot_vacuum_life_sensors(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Fix: core Tuya's robot-vacuum category (sd) DOES carry consumable
    sensors. Percent devices get the four replacement duties next to the
    engine-runtime cleaning duties; a device whose DP reports minutes (Tuya
    units are device-defined and often mislabelled) only keeps the runtime
    pair; a purifier's 'filter_utilization' (direction unknown) is ignored."""
    await setup_integration(hass, global_entry)
    robot = await _seed(
        hass,
        "tuya",
        "sd1",
        "Tuya Robot",
        [
            Ent("tuya_robot", platform="vacuum", state="docked"),
            Ent("tuya_robot_rolling_brush_lifetime", "rolling_brush_life", "%"),
            Ent("tuya_robot_side_brush_lifetime", "side_brush_life", "%"),
            Ent("tuya_robot_filter_lifetime", "filter_life", "%"),
            Ent("tuya_robot_duster_cloth_lifetime", "duster_cloth_life", "%"),
        ],
    )
    minutes_robot = await _seed(
        hass,
        "tuya",
        "sd2",
        "Tuya Minutes Robot",
        [
            Ent("tuya_minutes_robot", platform="vacuum", state="docked"),
            Ent("tuya_minutes_robot_side_brush_lifetime", "side_brush_life", "min", "9000"),
        ],
    )
    purifier = await _seed(
        hass,
        "tuya",
        "kj1",
        "Tuya Purifier",
        [Ent("tuya_purifier_filter_utilization", "filter_utilization", "%")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, robot)
    assert set(tasks) == {
        "Filter Cleaning",
        "Clean Main Brush",
        "Replace Main Brush",
        "Replace Side Brush",
        "Replace Filter",
        "Replace Mop Pads",
    }
    assert tasks["Filter Cleaning"]["direction"] == "runtime_hours"
    assert tasks["Replace Filter"]["direction"] == "percent_left"
    assert tasks["Replace Filter"]["threshold"] == 10.0
    assert tasks["Replace Mop Pads"]["entity_ids"] == ["sensor.tuya_robot_duster_cloth_lifetime"]

    assert set(_by_name(setups, minutes_robot)) == {"Filter Cleaning", "Clean Main Brush"}
    assert purifier not in setups


async def test_ecovacs_2026_08_lifespans_and_goat_mowing_hours(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Ecovacs: station/dock lifespans added in 2026.8, the handheld filter
    split per entity from the robot filter, the legacy main-brush tk, and the
    GOAT mower's wear parts + lifetime mowing hours. unit_care stays
    unmatched (semantics not established)."""
    await setup_integration(hass, global_entry)
    omni = await _seed(
        hass,
        "ecovacs",
        "x8",
        "Deebot X8",
        [
            Ent("deebot_x8_main_brush_lifespan", "lifespan_brush", "%"),
            Ent("deebot_x8_filter_lifespan", "lifespan_filter", "%", original_name="Filter lifespan"),
            Ent("deebot_x8_hand_filter_lifespan", "lifespan_hand_filter", "%", original_name="Hand filter lifespan"),
            Ent("deebot_x8_2", "lifespan_station_filter", "%"),
            Ent("deebot_x8_cleaning_solution_lifespan", "lifespan_cleaning_solution", "%"),
            Ent("deebot_x8_sewage_box_lifespan", "lifespan_sewage_box", "%"),
            Ent("deebot_x8_water_sink_lifespan", "lifespan_water_sink", "%"),
            Ent("deebot_x8_air_freshener_lifespan", "lifespan_air_freshener", "%"),
            Ent("deebot_x8_uv_sanitizer_lifespan", "lifespan_uv_sanitizer", "%"),
            Ent("deebot_x8_unit_care_lifespan", "lifespan_unit_care", "%"),
            Ent("deebot_x8_total_cleaning_duration", "total_stats_time", "h", "310"),
        ],
    )
    legacy = await _seed(
        hass,
        "ecovacs",
        "old1",
        "Deebot 900",
        [
            Ent("deebot_900_main_brush_lifespan", "lifespan_main_brush", "%"),
            Ent("deebot_900_filter_lifespan", "lifespan_filter", "%", original_name="Filter lifespan"),
        ],
    )
    goat = await _seed(
        hass,
        "ecovacs",
        "goat1",
        "GOAT O1000",
        [
            Ent("goat_o1000_blade_lifespan", "lifespan_blade", "%"),
            Ent("goat_o1000_lens_brush_lifespan", "lifespan_lens_brush", "%"),
            Ent("goat_o1000_edge_trimmer_brush_lifespan", "lifespan_trimmer_brush", "%"),
            Ent("goat_o1000_edge_trimmer_line_lifespan", "lifespan_weed_rope", "%"),
            Ent("goat_o1000_total_mowing_duration", "total_stats_time_mower", "s", "360000"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, omni)
    assert set(tasks) == {
        "Replace Main Brush",
        "Replace Filter — Filter lifespan",
        "Replace Filter — Hand filter lifespan",
        "Replace Secondary Filter",
        "Refill Detergent",
        "Empty Dirty Water Tank",
        "Clean Mop Tray",
        "Replace Air Freshener",
        "Replace UV Lamp",
    }
    assert all(t["direction"] == "percent_left" for t in tasks.values())
    assert tasks["Replace Filter — Hand filter lifespan"]["entity_ids"] == ["sensor.deebot_x8_hand_filter_lifespan"]
    # A robot vacuum's lifetime cleaning time is NOT the mower's key.
    assert "Clean Undercarriage" not in tasks

    # Single filter → the plain catalog name; legacy tk joins the main brush.
    legacy_tasks = _by_name(setups, legacy)
    assert set(legacy_tasks) == {"Replace Main Brush", "Replace Filter"}

    goat_tasks = _by_name(setups, goat)
    assert set(goat_tasks) == {
        "Replace Blades",
        "Replace Lens Brush",
        "Replace Trimmer Brush",
        "Replace Trimmer Line",
        "Clean Undercarriage",
    }
    uc = goat_tasks["Clean Undercarriage"]
    assert uc["direction"] == "usage_delta" and uc["threshold"] == 25 * 3600.0  # native seconds
    tc = _trigger(hass, "ecovacs", uc)
    assert tc["type"] == "counter" and tc["trigger_delta_mode"] is True
    assert "trigger_baseline_value" not in tc  # lifetime counter: baseline = value at adoption


async def test_roborock_dock_q7_dyad_zeo_consumables(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Roborock: dock strainer + maintenance brush countdowns (hours), the Q7
    mop countdown (minutes), the Dyad roller joining the main-brush duty, the
    Zeo washer's drum-clean counter (usage_above from a 0 baseline) — and the
    Q10 '*_life' sensors (used vs remaining contradictory upstream) unmatched."""
    await setup_integration(hass, global_entry)
    dock = await _seed(
        hass,
        "roborock",
        "s8",
        "S8 Pro Ultra Dock",
        [
            Ent("s8_dock_strainer_time_left", "strainer_time_left", "h", "120"),
            Ent("s8_dock_maintenance_brush_time_left", "cleaning_brush_time_left", "h", "250"),
        ],
    )
    q7 = await _seed(
        hass,
        "roborock",
        "q7",
        "Q7 Max",
        [
            Ent("q7_max_main_brush_time_left", "main_brush_time_left", "min", "15000"),
            Ent("q7_max_mop_life_time_left", "mop_life_time_left", "min", "9000"),
        ],
    )
    dyad = await _seed(
        hass,
        "roborock",
        "dyad",
        "Dyad Pro",
        [
            Ent("dyad_pro_roller_left", "brush_remaining", "h", "80"),
            Ent("dyad_pro_filter_time_left", "filter_time_left", "h", "60"),
        ],
    )
    zeo = await _seed(hass, "roborock", "zeo", "Zeo One", [Ent("zeo_one_times_after_clean", "times_after_clean", None, "12")])
    q10 = await _seed(
        hass,
        "roborock",
        "q10",
        "Q10",
        [Ent("q10_main_brush_time_used", "main_brush_life", "h", "12"), Ent("q10_filter_time_used", "filter_life", "h")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    dock_tasks = _by_name(setups, dock)
    assert set(dock_tasks) == {"Replace Dock Strainer", "Replace Maintenance Brush"}
    assert all(t["direction"] == "duration_left" and t["threshold"] == 24.0 for t in dock_tasks.values())

    q7_tasks = _by_name(setups, q7)
    assert set(q7_tasks) == {"Replace Main Brush", "Replace Mop Pads"}
    assert q7_tasks["Replace Mop Pads"]["threshold"] == 1440.0  # 24 h in minutes

    (main,) = [t for t in setups[dyad]["tasks"] if t["task_name"] == "Replace Main Brush"]
    assert main["entity_ids"] == ["sensor.dyad_pro_roller_left"]
    assert {t["task_name"] for t in setups[dyad]["tasks"]} == {"Replace Main Brush", "Replace Filter"}

    (tub,) = setups[zeo]["tasks"]
    assert tub["task_name"] == "Clean Tub" and tub["direction"] == "usage_above"
    assert tub["threshold"] == 30.0
    tc = _trigger(hass, "roborock", tub)
    assert tc["type"] == "counter" and tc["trigger_baseline_value"] == 0
    assert tc["auto_complete_on_recovery"] is True

    assert q10 not in setups


async def test_brother_inkjet_capture_box_and_kits(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Brother: inkjet cartridges split per entity like the toners, the
    ink capture box maps to the maintenance-box duty, laser unit and the two
    paper-feed kits (tray 1 / MP tray) wear independently."""
    await setup_integration(hass, global_entry)
    inkjet = await _seed(
        hass,
        "brother",
        "j5",
        "MFC-J5945DW",
        [
            Ent("mfc_black_ink_remaining", "black_ink_remaining", "%", original_name="Black ink remaining"),
            Ent("mfc_cyan_ink_remaining", "cyan_ink_remaining", "%", original_name="Cyan ink remaining"),
            Ent("mfc_magenta_ink_remaining", "magenta_ink_remaining", "%", original_name="Magenta ink remaining"),
            Ent("mfc_yellow_ink_remaining", "yellow_ink_remaining", "%", original_name="Yellow ink remaining"),
            Ent("mfc_ink_capture_box_remaining_lifetime", "ink_capture_box_remaining_life", "%"),
        ],
    )
    laser = await _seed(
        hass,
        "brother",
        "l8",
        "HL-L8360CDW",
        [
            Ent("hl_laser_remaining_lifetime", "laser_remaining_life", "%"),
            Ent("hl_pf_kit_1_remaining_lifetime", "pf_kit_1_remaining_life", "%", original_name="PF Kit 1 remaining lifetime"),
            Ent("hl_pf_kit_mp_remaining_lifetime", "pf_kit_mp_remaining_life", "%", original_name="PF Kit MP remaining lifetime"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    ink_tasks = _by_name(setups, inkjet)
    assert set(ink_tasks) == {
        "Replace Ink or Toner — Black ink remaining",
        "Replace Ink or Toner — Cyan ink remaining",
        "Replace Ink or Toner — Magenta ink remaining",
        "Replace Ink or Toner — Yellow ink remaining",
        "Replace Maintenance Box",
    }
    assert ink_tasks["Replace Ink or Toner — Cyan ink remaining"]["entity_ids"] == ["sensor.mfc_cyan_ink_remaining"]
    assert all(t["direction"] == "percent_left" and t["threshold"] == 10.0 for t in ink_tasks.values())

    assert set(_by_name(setups, laser)) == {
        "Replace Laser Unit",
        "Replace Paper Feed Kit — PF Kit 1 remaining lifetime",
        "Replace Paper Feed Kit — PF Kit MP remaining lifetime",
    }


async def test_hacs_printers_ink_and_3d_print_time(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """HP (one device per cartridge), Epson WorkForce (per-tank ink, the
    maintenance-box 'Cleaning level' of undetermined direction unmatched),
    Creality/Elegoo engine print time and Anycubic lifetime print hours —
    resin printers (shared keys) excluded via FDM-only siblings."""
    await setup_integration(hass, global_entry)
    hp_black = await _seed(
        hass,
        "hpprinter",
        "hp_bk",
        "Office HP Black Ink",
        [Ent("office_hp_black_ink_level", "consumable_percentage_level_remaining", "%")],
    )
    epson = await _seed(
        hass,
        "epson_workforce",
        "et2850",
        "Epson ET-2850",
        [
            Ent("epson_et_2850_ink_level_black", unit="%", original_name="Ink level Black"),
            Ent("epson_et_2850_ink_level_cyan", unit="%", original_name="Ink level Cyan"),
            Ent("epson_et_2850_ink_level_light_cyan", unit="%", original_name="Ink level Light Cyan"),
            Ent("epson_et_2850_cleaning_level", unit="%", original_name="Cleaning level"),
        ],
    )
    creality = await _seed(
        hass, "ha_creality_ws", "k1", "Creality K1", [Ent("creality_k1_print_status", "print_status", None, "idle")]
    )
    elegoo_fdm = await _seed(
        hass,
        "elegoo_printer",
        "cc",
        "Centauri Carbon",
        [
            Ent("centauri_carbon_print_status", "print_status", None, "idle"),
            Ent("centauri_carbon_nozzle_temperature", None, "°C", "25"),
        ],
    )
    elegoo_resin = await _seed(
        hass, "elegoo_printer", "sat", "Saturn 4", [Ent("saturn_4_print_status", "print_status", None, "idle")]
    )
    anycubic_fdm = await _seed(
        hass,
        "anycubic_cloud",
        "kobra",
        "Kobra 3",
        [
            Ent("kobra_3_total_print_time", "print_time_total_hrs", "h", "812"),
            Ent("kobra_3_nozzle_temperature", "curr_nozzle_temp", "°C", "25"),
        ],
    )
    anycubic_resin = await _seed(
        hass, "anycubic_cloud", "photon", "Photon Mono", [Ent("photon_mono_total_print_time", "print_time_total_hrs", "h")]
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (hp_task,) = setups[hp_black]["tasks"]
    assert hp_task["task_name"] == "Replace Ink or Toner" and hp_task["direction"] == "percent_left"

    assert set(_by_name(setups, epson)) == {
        "Replace Ink or Toner — Ink level Black",
        "Replace Ink or Toner — Ink level Cyan",
        "Replace Ink or Toner — Ink level Light Cyan",
    }

    for printer in (creality, elegoo_fdm):
        (task,) = setups[printer]["tasks"]
        assert task["task_name"] == "Lubricate Rails and Rods"
        assert task["direction"] == "runtime_hours" and task["threshold"] == 200.0
    tc = _trigger(hass, "elegoo_printer", setups[elegoo_fdm]["tasks"][0])
    assert tc["type"] == "runtime" and tc["trigger_on_states"] == ["printing"]
    assert tc["entity_id"] == "sensor.centauri_carbon_print_status"
    assert elegoo_resin not in setups

    (ac,) = setups[anycubic_fdm]["tasks"]
    assert ac["task_name"] == "Lubricate Rails and Rods"
    assert ac["direction"] == "usage_delta" and ac["threshold"] == 200.0
    assert ac["entity_ids"] == ["sensor.kobra_3_total_print_time"]
    assert anycubic_resin not in setups


async def test_eufy_vacuums_countdowns_and_wear_counters(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Eufy Clean reports hours REMAINING (duration_left, short cleaning
    intervals warn at 6 h); the damacus RoboVac proto models report hours
    USED since the last reset (usage_above from a 0 baseline) next to the
    engine-runtime cleaning duties every model gets."""
    await setup_integration(hass, global_entry)
    x10 = await _seed(
        hass,
        "robovac_mqtt",
        "x10",
        "Eufy X10",
        [
            Ent("eufy_x10_filter_remaining", unit="h", state="300"),
            Ent("eufy_x10_rolling_brush_remaining", unit="h", state="300"),
            Ent("eufy_x10_side_brush_remaining", unit="h", state="150"),
            Ent("eufy_x10_sensor_remaining", unit="h", state="50"),
            Ent("eufy_x10_cleaning_tray_remaining", unit="h", state="20"),
            Ent("eufy_x10_mopping_cloth_remaining", unit="h", state="150"),
        ],
    )
    l60 = await _seed(
        hass,
        "robovac",
        "l60",
        "RoboVac L60",
        [
            Ent("robovac_l60", platform="vacuum", state="docked"),
            Ent("robovac_l60_filter", unit="h", state="120"),
            Ent("robovac_l60_rolling_brush", unit="h", state="120"),
            Ent("robovac_l60_side_brush", unit="h", state="120"),
            Ent("robovac_l60_sensor", unit="h", state="12"),
            Ent("robovac_l60_battery", unit="%", state="80"),
        ],
    )
    g30 = await _seed(hass, "robovac", "g30", "RoboVac G30", [Ent("robovac_g30", platform="vacuum", state="docked")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    x10_tasks = _by_name(setups, x10)
    assert set(x10_tasks) == {
        "Replace Filter",
        "Replace Main Brush",
        "Replace Side Brush",
        "Clean Sensors",
        "Clean Mop Tray",
        "Replace Mop Pads",
    }
    assert all(t["direction"] == "duration_left" for t in x10_tasks.values())
    assert x10_tasks["Replace Filter"]["threshold"] == 24.0
    assert x10_tasks["Clean Sensors"]["threshold"] == 6.0
    assert x10_tasks["Clean Mop Tray"]["threshold"] == 6.0

    l60_tasks = _by_name(setups, l60)
    assert set(l60_tasks) == {
        "Filter Cleaning",
        "Clean Main Brush",
        "Replace Filter",
        "Replace Main Brush",
        "Replace Side Brush",
        "Clean Sensors",
    }
    assert l60_tasks["Replace Filter"]["direction"] == "usage_above"
    assert l60_tasks["Replace Filter"]["threshold"] == 360.0
    assert l60_tasks["Replace Side Brush"]["threshold"] == 180.0
    assert l60_tasks["Clean Sensors"]["threshold"] == 60.0
    assert l60_tasks["Filter Cleaning"]["entity_ids"] == ["vacuum.robovac_l60"]
    tc = _trigger(hass, "robovac", l60_tasks["Replace Main Brush"])
    assert tc["type"] == "counter" and tc["trigger_baseline_value"] == 0

    assert set(_by_name(setups, g30)) == {"Filter Cleaning", "Clean Main Brush"}


async def test_tineco_xiaomi_cloud_and_ilife(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Tineco's brush-roller ENUM latches on 'needs_cleaning'; the Xiaomi
    cloud vacuum and ILIFE (cloud backend, gated on its history sensor)
    report percent remaining. An ILIFE Tuya-backend device whose raw 'filter'
    DP only suffix-matches stays unmatched."""
    await setup_integration(hass, global_entry)
    tineco = await _seed(
        hass, "tineco", "t1", "Tineco Device", [Ent("tineco_device_tineco_brush_roller", "brush_roller", None, "normal")]
    )
    xiaomi = await _seed(
        hass,
        "xiaomi_vacuum",
        "x1",
        "Xiaomi X20",
        [
            Ent("xiaomi_x20_filter_life", "filter_life", "%"),
            Ent("xiaomi_x20_main_brush_life", "main_brush_life", "%"),
            Ent("xiaomi_x20_side_brush_life", "side_brush_life", "%"),
            Ent("xiaomi_x20_mop_life", "mop_life", "%"),
        ],
    )
    ilife_cloud = await _seed(
        hass,
        "ilife",
        "a11",
        "ILIFE A11",
        [
            Ent("ilife_a11_main_brush", "main_brush", "%"),
            Ent("ilife_a11_side_brush", "side_brush", "%"),
            Ent("ilife_a11_filter", "filter", "%"),
            Ent("ilife_a11_history", "history", None, "3"),
        ],
    )
    ilife_tuya = await _seed(hass, "ilife", "v3", "ILIFE V3", [Ent("ilife_v3_filter", None, None, "120")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (latch,) = setups[tineco]["tasks"]
    assert latch["task_name"] == "Clean Main Brush" and latch["direction"] == "event_present"
    tc = _trigger(hass, "tineco", latch)
    assert tc["type"] == "state_change" and tc["trigger_to_state"] == "needs_cleaning"
    assert tc["auto_complete_on_recovery"] is True

    assert set(_by_name(setups, xiaomi)) == {"Replace Filter", "Replace Main Brush", "Replace Side Brush", "Replace Mop Pads"}

    ilife_tasks = _by_name(setups, ilife_cloud)
    assert set(ilife_tasks) == {"Replace Main Brush", "Replace Side Brush", "Replace Filter"}
    assert all(t["direction"] == "percent_left" for t in ilife_tasks.values())
    assert ilife_tuya not in setups


async def test_petlibro_countdowns_and_personal_care(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """PETLIBRO day countdowns (desiccant / fountain filter / cleaning /
    litter-box filter, 48 h = 2 days), the Philips shaver head percentage
    and the live Oral-B brush-head countdown (days)."""
    await setup_integration(hass, global_entry)
    feeder = await _seed(
        hass,
        "petlibro",
        "gf",
        "Granary Feeder",
        [Ent("granary_feeder_remaining_desiccant_days", "remaining_desiccant", "d", "20")],
    )
    fountain = await _seed(
        hass,
        "petlibro",
        "ds",
        "Dockstream",
        [
            Ent("dockstream_remaining_filter_days", "remaining_filter_days", "d", "25"),
            Ent("dockstream_remaining_cleaning_days", "remaining_cleaning_days", "d", "5"),
        ],
    )
    litter = await _seed(
        hass, "petlibro", "luma", "Luma", [Ent("luma_filter_replacement_days", "remaining_replacement_days", "d", "12")]
    )
    shaver = await _seed(
        hass, "philips_shaver", "s9", "Philips S9000", [Ent("philips_s9000_head_remaining", "head_remaining", "%", "70")]
    )
    brush = await _seed(
        hass, "oralb_live", "io9", "Oral-B iO9", [Ent("oral_b_io9_brush_head_remaining", "refill_days", "d", "60")]
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (desiccant,) = setups[feeder]["tasks"]
    assert desiccant["task_name"] == "Replace Desiccant"
    assert desiccant["direction"] == "duration_left" and desiccant["threshold"] == 2.0

    fountain_tasks = _by_name(setups, fountain)
    assert set(fountain_tasks) == {"Replace Water Filter", "Clean Appliance"}
    assert all(t["threshold"] == 2.0 for t in fountain_tasks.values())

    (lf,) = setups[litter]["tasks"]
    assert lf["task_name"] == "Replace Filter" and lf["threshold"] == 2.0

    (head,) = setups[shaver]["tasks"]
    assert head["task_name"] == "Replace Shaver Head"
    assert head["direction"] == "percent_left" and head["threshold"] == 10.0

    (refill,) = setups[brush]["tasks"]
    assert refill["task_name"] == "Replace Brush Head"
    assert refill["direction"] == "duration_left" and refill["threshold"] == 2.0
    tc = _trigger(hass, "oralb_live", refill)
    assert tc["type"] == "threshold" and tc["trigger_below"] == 2.0
