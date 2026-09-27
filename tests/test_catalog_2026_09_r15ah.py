"""Catalog round 15, part A/HACS (vacuums, printers, pets, kitchen, personal care).

Pins the HACS reset wiring (Dreame, Eufy Clean, ILIFE, PetKit, PETLIBRO, Home
Connect Local, Candy, Philips shaver), the uncatalogued counters that come
with a reset (Anycubic nozzle wear, Home Connect Local fridge filter,
Electrolux fridge filter states, PetKit odor eliminators, the Philips
cleaning cartridge), the drift fixes (hOn's two forks, Traeger's renamed
counter) and the new integrations (HomeWhiz, ConnectLife, Electrolux
Wellbeing, Roomba rest980, Roomba+, Viomi SE, PetSafe, Philips Sonicare).

Entities are seeded the way each integration registers them: its
translation_key where it sets one, else the entity-id suffix its naming
produces; buttons the integration ships disabled are seeded disabled.
"""

from __future__ import annotations

from typing import NamedTuple

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


class Ent(NamedTuple):
    """One seeded entity: FULL object id, translation_key, unit, state,
    platform domain, original (registry) name, integration-disabled."""

    object_id: str
    tkey: str | None = None
    unit: str | None = None
    state: str = "40"
    platform: str = "sensor"
    original_name: str | None = None
    disabled: bool = False


def btn(object_id: str, tkey: str | None = None, *, disabled: bool = False) -> Ent:
    return Ent(object_id, tkey, platform="button", state="unknown", disabled=disabled)


async def _seed(hass: HomeAssistant, domain: str, uid: str, device_name: str, entities: list[Ent], *, model: str | None = None) -> str:
    source = MockConfigEntry(domain=domain, title=domain)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=device_name, model=model
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


def _by_name(setups: dict[str, dict], device_id: str) -> dict[str, dict]:
    return {t["task_name"]: t for t in setups[device_id]["tasks"]}


def _reset(task: dict) -> str | None:
    return task["reset"]["entity_id"] if task["reset"] else None


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


# ── HACS reset wiring ────────────────────────────────────────────────────────


async def test_dreame_eufy_ilife_vacuum_resets(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Dreame (translation_key buttons), Eufy Clean (name-derived suffixes, the
    sensor reset is 'Reset Sensors' plural) and ILIFE (cloud backend) wire each
    consumable duty to its own reset; Dreame's secondary filter has none."""
    await setup_integration(hass, global_entry)
    dreame = await _seed(
        hass,
        "dreame_vacuum",
        "l10s",
        "Dreame L10s",
        [
            Ent("l10s_main_brush_left", "main_brush_left", "%"),
            Ent("l10s_side_brush_left", "side_brush_left", "%"),
            Ent("l10s_filter_left", "filter_left", "%"),
            Ent("l10s_sensor_dirty_left", "sensor_dirty_left", "%"),
            Ent("l10s_mop_pad_left", "mop_pad_left", "%"),
            Ent("l10s_detergent_left", "detergent_left", "%"),
            Ent("l10s_silver_ion_left", "silver_ion_left", "%"),
            Ent("l10s_secondary_filter_left", "secondary_filter_left", "%"),
            *(
                btn(f"l10s_{key}", key)
                for key in (
                    "reset_main_brush",
                    "reset_side_brush",
                    "reset_filter",
                    "reset_sensor",
                    "reset_mop_pad",
                    "reset_detergent",
                    "reset_silver_ion",
                )
            ),
        ],
    )
    eufy = await _seed(
        hass,
        "robovac_mqtt",
        "x10",
        "Eufy X10",
        [
            Ent("eufy_x10_filter_remaining", unit="h", state="120"),
            Ent("eufy_x10_rolling_brush_remaining", unit="h", state="200"),
            Ent("eufy_x10_side_brush_remaining", unit="h", state="100"),
            Ent("eufy_x10_sensor_remaining", unit="h", state="20"),
            Ent("eufy_x10_cleaning_tray_remaining", unit="h", state="20"),
            Ent("eufy_x10_mopping_cloth_remaining", unit="h", state="100"),
            *(
                btn(f"eufy_x10_{suffix}")
                for suffix in (
                    "reset_filter",
                    "reset_rolling_brush",
                    "reset_side_brush",
                    "reset_sensors",
                    "reset_cleaning_tray",
                    "reset_mopping_cloth",
                )
            ),
        ],
    )
    ilife = await _seed(
        hass,
        "ilife",
        "v9",
        "ILIFE V9",
        [
            Ent("ilife_v9_main_brush", "main_brush", "%"),
            Ent("ilife_v9_side_brush", "side_brush", "%"),
            Ent("ilife_v9_filter", "filter", "%"),
            Ent("ilife_v9_history", "history", None, "ok"),
            btn("ilife_v9_reset_main_brush", "reset_main_brush"),
            btn("ilife_v9_reset_side_brush", "reset_side_brush"),
            btn("ilife_v9_reset_filter", "reset_filter"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, dreame)
    assert {n: _reset(t) for n, t in tasks.items()} == {
        "Replace Main Brush": "button.l10s_reset_main_brush",
        "Replace Side Brush": "button.l10s_reset_side_brush",
        "Replace Filter": "button.l10s_reset_filter",
        "Clean Sensors": "button.l10s_reset_sensor",
        "Replace Mop Pads": "button.l10s_reset_mop_pad",
        "Refill Detergent": "button.l10s_reset_detergent",
        "Replace Silver-ion Module": "button.l10s_reset_silver_ion",
        "Replace Secondary Filter": None,
    }

    assert {n: _reset(t) for n, t in _by_name(setups, eufy).items()} == {
        "Replace Filter": "button.eufy_x10_reset_filter",
        "Replace Main Brush": "button.eufy_x10_reset_rolling_brush",
        "Replace Side Brush": "button.eufy_x10_reset_side_brush",
        "Clean Sensors": "button.eufy_x10_reset_sensors",
        "Clean Mop Tray": "button.eufy_x10_reset_cleaning_tray",
        "Replace Mop Pads": "button.eufy_x10_reset_mopping_cloth",
    }

    assert {n: _reset(t) for n, t in _by_name(setups, ilife).items()} == {
        "Replace Main Brush": "button.ilife_v9_reset_main_brush",
        "Replace Side Brush": "button.ilife_v9_reset_side_brush",
        "Replace Filter": "button.ilife_v9_reset_filter",
    }


async def test_petkit_resets_and_odor_eliminators(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """PetKit: feeder desiccant and fountain filter wired to their resets; a
    litter box reporting both odor eliminators gets one task per part, each with
    its own reset; a single-part box keeps the plain name."""
    await setup_integration(hass, global_entry)
    feeder = await _seed(
        hass,
        "petkit",
        "d4",
        "Fresh Element",
        [Ent("fresh_element_desiccant_left_days", "desiccant_left_days", "d", "20"), btn("fresh_element_reset_desiccant", "reset_desiccant")],
    )
    fountain = await _seed(
        hass,
        "petkit",
        "w5",
        "Eversweet",
        [Ent("eversweet_filter_percent", "filter_percent", "%", "30"), btn("eversweet_reset_filter", "reset_filter")],
    )
    t5 = await _seed(
        hass,
        "petkit",
        "t5",
        "Purobot",
        [
            Ent("purobot_n50", "odor_eliminator_n50_left_days", "d", "12", original_name="Odor eliminator N50 left days"),
            Ent("purobot_n60", "odor_eliminator_n60_left_days", "d", "3", original_name="Odor eliminator N60 left days"),
            Ent("purobot_purification_n60_left_days", "purification_n60_left_days", "d", "5"),
            btn("purobot_reset_n50", "reset_n50_odor_eliminator"),
            btn("purobot_reset_n60", "reset_n60_odor_eliminator"),
        ],
    )
    t3 = await _seed(
        hass,
        "petkit",
        "t3",
        "Pura X",
        [Ent("pura_x_n50", "odor_eliminator_n50_left_days", "d", "12"), btn("pura_x_reset_n50", "reset_n50_odor_eliminator")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (desiccant,) = setups[feeder]["tasks"]
    assert _reset(desiccant) == "button.fresh_element_reset_desiccant"
    (water,) = setups[fountain]["tasks"]
    assert water["task_name"] == "Replace Water Filter" and _reset(water) == "button.eversweet_reset_filter"

    odor = _by_name(setups, t5)
    assert set(odor) == {
        "Replace Odor Eliminator — Odor eliminator N50 left days",
        "Replace Odor Eliminator — Odor eliminator N60 left days",
    }
    n60 = odor["Replace Odor Eliminator — Odor eliminator N60 left days"]
    assert n60["entity_ids"] == ["sensor.purobot_n60"] and _reset(n60) == "button.purobot_reset_n60"
    assert n60["threshold"] == 2.0  # 48 h in days
    assert _reset(odor["Replace Odor Eliminator — Odor eliminator N50 left days"]) == "button.purobot_reset_n50"

    (single,) = setups[t3]["tasks"]
    assert single["task_name"] == "Replace Odor Eliminator" and _reset(single) == "button.pura_x_reset_n50"


async def test_petlibro_resets_per_device_type(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """PETLIBRO: one 'filter_reset' key serves the fountain filter and the Luma
    filter; desiccant and cleaning countdowns get theirs."""
    await setup_integration(hass, global_entry)
    granary = await _seed(
        hass,
        "petlibro",
        "gr1",
        "Granary",
        [Ent("granary_remaining_desiccant", "remaining_desiccant", "d", "10"), btn("granary_desiccant_replaced", "desiccant_reset")],
    )
    dockstream = await _seed(
        hass,
        "petlibro",
        "ds1",
        "Dockstream",
        [
            Ent("dockstream_remaining_filter_days", "remaining_filter_days", "d", "10"),
            Ent("dockstream_remaining_cleaning_days", "remaining_cleaning_days", "d", "4"),
            btn("dockstream_filter_reset", "filter_reset"),
            btn("dockstream_cleaning_reset", "cleaning_reset"),
        ],
    )
    luma = await _seed(
        hass,
        "petlibro",
        "lu1",
        "Luma",
        [
            Ent("luma_remaining_replacement_days", "remaining_replacement_days", "d", "10"),
            Ent("luma_remaining_cleaning_days", "remaining_cleaning_days", "d", "4"),
            btn("luma_filter_reset", "filter_reset"),
            btn("luma_cleaning_reset", "cleaning_reset"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    assert _reset(setups[granary]["tasks"][0]) == "button.granary_desiccant_replaced"
    assert {n: _reset(t) for n, t in _by_name(setups, dockstream).items()} == {
        "Replace Water Filter": "button.dockstream_filter_reset",
        "Clean Appliance": "button.dockstream_cleaning_reset",
    }
    assert {n: _reset(t) for n, t in _by_name(setups, luma).items()} == {
        "Replace Filter": "button.luma_filter_reset",
        "Clean Appliance": "button.luma_cleaning_reset",
    }


async def test_home_connect_local_candy_and_shaver_resets(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Home Connect Local: the hood grease filter reset (the carbon filter stays
    unwired) and the fridge water-filter saturation with its reset; Candy's
    full-control maintenance resets; the Philips shaver head reset and the
    cleaning-cartridge duty with its own reset."""
    await setup_integration(hass, global_entry)
    hood = await _seed(
        hass,
        "homeconnect_ws",
        "hood1",
        "Hood",
        [
            Ent("hood_grease_filter_saturation", "sensor_grease_filter_saturation", "%", "95"),
            Ent("hood_carbon_filter_saturation", "sensor_carbon_filter_saturation", "%", "50"),
            btn("hood_grease_filter_reset", "button_hood_grease_filter_reset"),
            btn("hood_carbon_filter_reset", "button_hood_carbon_filter_reset"),
        ],
    )
    fridge = await _seed(
        hass,
        "homeconnect_ws",
        "fr1",
        "Fridge",
        [
            Ent("fridge_water_filter_saturation", "sensor_water_filter_saturation", "%", "40"),
            btn("fridge_water_filter_reset", "button_water_filter_reset"),
        ],
    )
    candy = await _seed(
        hass,
        "candy",
        "cw1",
        "Candy Washer",
        [
            Ent("candy_limescale_remaining_cycles", "wash_maint_limescale", None, "12"),
            Ent("candy_filter_remaining_cycles", "wash_maint_filter", None, "40"),
            btn("candy_limescale_maintenance_reset", "wash_maint_limescale_reset"),
            btn("candy_filter_maintenance_reset", "wash_maint_filter_reset"),
        ],
    )
    shaver = await _seed(
        hass,
        "philips_shaver",
        "s9",
        "Shaver",
        [
            Ent("shaver_head_remaining", "head_remaining", "%", "30"),
            Ent("shaver_remaining_cleaning_cycles", "cleaning_cycles_remaining", None, "12.4"),
            btn("shaver_blade_replacement", "blade_replacement"),
            btn("shaver_cartridge_reset", "cartridge_reset"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    hood_tasks = _by_name(setups, hood)
    assert _reset(hood_tasks["Clean Grease Filter"]) == "button.hood_grease_filter_reset"
    assert _reset(hood_tasks["Replace Filter"]) is None

    (water,) = setups[fridge]["tasks"]
    assert water["task_name"] == "Replace Water Filter" and water["direction"] == "alert_above"
    assert water["threshold"] == 90.0 and _reset(water) == "button.fridge_water_filter_reset"

    assert {n: _reset(t) for n, t in _by_name(setups, candy).items()} == {
        "Descaling": "button.candy_limescale_maintenance_reset",
        "Filter Cleaning": "button.candy_filter_maintenance_reset",
    }

    shaver_tasks = _by_name(setups, shaver)
    assert _reset(shaver_tasks["Replace Shaver Head"]) == "button.shaver_blade_replacement"
    cart = shaver_tasks["Replace Cleaning Cartridge"]
    assert cart["direction"] == "value_below" and cart["threshold"] == 3.0
    assert _reset(cart) == "button.shaver_cartridge_reset"


async def test_anycubic_nozzle_wear_adopt_enables_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Anycubic: the integration's nozzle-wear gauge (abrasive fill, counts up)
    proposes 'Replace Nozzle' on FDM printers only; adopting wires the
    integration-disabled reset button and enables it."""
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, global_entry)
    fdm = await _seed(
        hass,
        "anycubic_cloud",
        "k3",
        "Kobra 3",
        [
            Ent("kobra_3_nozzle_wear", "nozzle_wear_percent", "%", "12"),
            Ent("kobra_3_nozzle_temperature", "curr_nozzle_temp", "°C", "25"),
            btn("kobra_3_reset_nozzle_wear", "reset_nozzle_wear", disabled=True),
        ],
    )
    resin = await _seed(hass, "anycubic_cloud", "m5", "Photon M5", [Ent("photon_m5_nozzle_wear", "nozzle_wear_percent", "%", "0")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    (nozzle,) = setups[fdm]["tasks"]
    assert nozzle["task_name"] == "Replace Nozzle" and nozzle["direction"] == "alert_above" and nozzle["threshold"] == 90.0
    assert nozzle["reset"] == {"entity_id": "button.kobra_3_reset_nozzle_wear", "name": "button.kobra_3_reset_nozzle_wear", "disabled": True}
    assert resin not in setups

    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": fdm}]})
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Kobra 3"
    )
    (task,) = obj.data[CONF_TASKS].values()
    assert task["on_complete_action"]["target"] == {"entity_id": "button.kobra_3_reset_nozzle_wear"}
    assert er.async_get(hass).async_get("button.kobra_3_reset_nozzle_wear").disabled_by is None


# ── uncatalogued counters with a reset ───────────────────────────────────────


async def test_electrolux_fridge_filter_states(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Both Electrolux integrations: the fridge's own filter verdict latches on
    'Change' (title-cased by the integration) and wires the matching reset; the
    water duty is one shared object."""
    await setup_integration(hass, global_entry)
    ocp = await _seed(
        hass,
        "electrolux",
        "cr1",
        "Electrolux Fridge",
        [
            Ent("electrolux_fridge_water_filter_status", "waterfilterstate", None, "Good"),
            Ent("electrolux_fridge_air_filter_status", "airfilterstate", None, "Buy"),
            btn("electrolux_fridge_reset_water_filter", "waterfilterstatereset"),
            btn("electrolux_fridge_reset_air_filter", "airfilterstatereset"),
        ],
    )
    status = await _seed(
        hass,
        "electrolux_status",
        "cr2",
        "AEG Fridge",
        [
            Ent("aeg_fridge_cr_waterfilterstate", state="Change"),
            Ent("aeg_fridge_cr_airfilterstate", state="Good"),
            btn("aeg_fridge_cr_waterfilterstatereset"),
            btn("aeg_fridge_cr_airfilterstatereset"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for device, prefix in ((ocp, "electrolux_fridge_reset_"), (status, "aeg_fridge_cr_")):
        tasks = _by_name(setups, device)
        assert set(tasks) == {"Replace Water Filter", "Replace Filter"}
        assert all(t["direction"] == "event_present" for t in tasks.values())
        assert _trigger(hass, setups[device]["integration"], tasks["Replace Filter"])["trigger_to_state"] == "Change"
        assert _reset(tasks["Replace Water Filter"]).startswith(f"button.{prefix}")
    assert _reset(_by_name(setups, status)["Replace Filter"]) == "button.aeg_fridge_cr_airfilterstatereset"
    assert _reset(_by_name(setups, ocp)["Replace Filter"]) == "button.electrolux_fridge_reset_air_filter"

    water = {c: next(s for s in SIGNATURES[c].tasks if s.keys == ("waterfilterstate",)) for c in ("electrolux", "electrolux_status")}
    assert water["electrolux"] is water["electrolux_status"]


# ── drift fixes ──────────────────────────────────────────────────────────────


async def test_hon_both_forks(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """hOn: the store fork (gvigroux) names its sensors '<nick> Main filter' /
    'Pre filter' / 'Total wash cycle' and reports life LEFT; the old fork
    (Andre0512) reports the raw status under tk filter_life / filter_cleaning,
    which counts UP — a wear gauge (alert above 90)."""
    await setup_integration(hass, global_entry)
    gvigroux = await _seed(
        hass,
        "hon",
        "ap_gv",
        "Purifier",
        [Ent("purifier_main_filter", unit="%", state="60"), Ent("purifier_pre_filter", unit="%", state="20")],
    )
    washer_gv = await _seed(hass, "hon", "wm_gv", "Washer", [Ent("washer_total_wash_cycle", state="310")])
    andre = await _seed(
        hass,
        "hon",
        "ap_an",
        "Old Purifier",
        [
            Ent("old_purifier_main_filter_status", "filter_life", "%", "40"),
            Ent("old_purifier_pre_filter_status", "filter_cleaning", "%", "80"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    gv = _by_name(setups, gvigroux)
    assert {n: (t["direction"], t["entity_ids"]) for n, t in gv.items()} == {
        "Replace Filter": ("percent_left", ["sensor.purifier_main_filter"]),
        "Filter Cleaning": ("percent_left", ["sensor.purifier_pre_filter"]),
    }
    (tub,) = setups[washer_gv]["tasks"]
    assert tub["task_name"] == "Clean Tub" and tub["direction"] == "usage_delta" and tub["threshold"] == 30.0

    an = _by_name(setups, andre)
    assert {n: (t["direction"], t["threshold"]) for n, t in an.items()} == {
        "Replace Filter": ("alert_above", 90.0),
        "Filter Cleaning": ("alert_above", 90.0),
    }


async def test_traeger_both_counter_names(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    jv = await _seed(hass, "traeger", "grill1", "Ironwood", [Ent("0123456789ab_cook_cycles", state="42")])
    nj = await _seed(hass, "traeger", "grill2", "Pro 575", [Ent("pro_575_cook_cycle", state="42")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    for device in (jv, nj):
        assert set(_by_name(setups, device)) == {"Clean Grease Trap", "Clean Appliance"}


# ── new integrations ─────────────────────────────────────────────────────────


async def test_homewhiz_warning_latches(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """HomeWhiz: the appliance warning bits (custom device class, not problem)
    latch refill / cleaning duties; the washer's two auto-dose tanks split per
    entity; door / water / tank-full warnings stay unmatched."""
    await setup_integration(hass, global_entry)

    def warn(object_id: str, key: str, state: str = "off", name: str | None = None) -> Ent:
        return Ent(object_id, key, state=state, platform="binary_sensor", original_name=name)

    dishwasher = await _seed(
        hass,
        "homewhiz",
        "dw1",
        "Beko Dishwasher",
        [
            warn("beko_dishwasher_no_salt", "dishwasher_warning_no_salt", "on"),
            warn("beko_dishwasher_no_rinse_aid", "dishwasher_warning_no_rinse_aid"),
            warn("beko_dishwasher_check_the_filter", "dishwasher_warning_check_the_filter"),
            warn("beko_dishwasher_liquid_detergent_low", "dishwasher_liquid_detergent_low"),
            warn("beko_dishwasher_no_water", "dishwasher_warning_no_water"),
            warn("beko_dishwasher_door_is_open", "dishwasher_warning_door_is_open"),
        ],
    )
    washer = await _seed(
        hass,
        "homewhiz",
        "wm1",
        "Grundig Washer",
        [
            warn("grundig_washer_no_liquid_detergent", "washer_warning_no_liquid_detergent", name="No liquid detergent"),
            warn("grundig_washer_no_powder_detergent", "washer_warning_no_powder_detergent", name="No powder detergent"),
            warn("grundig_washer_no_softener", "washer_warning_no_softener"),
            warn("grundig_washer_door_is_open", "washer_warning_door_is_open"),
        ],
    )
    dryer = await _seed(
        hass,
        "homewhiz",
        "td1",
        "Bauknecht Dryer",
        [
            warn("bauknecht_dryer_check_the_filter", "dryer_warning_check_the_filter"),
            warn("bauknecht_dryer_check_the_condenser_filter", "dryer_warning_check_the_condenser_filter"),
            warn("bauknecht_dryer_tank_full", "dryer_warning_tankfull"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    dw = _by_name(setups, dishwasher)
    assert set(dw) == {"Refill Salt", "Refill Rinse Aid", "Filter Cleaning", "Refill Detergent"}
    assert _trigger(hass, "homewhiz", dw["Refill Salt"])["trigger_to_state"] == "on"
    assert set(_by_name(setups, washer)) == {
        "Refill Detergent — No liquid detergent",
        "Refill Detergent — No powder detergent",
        "Refill Fabric Softener",
    }
    assert set(_by_name(setups, dryer)) == {"Lint Filter Cleaning", "Condenser Cleaning"}


async def test_connectlife_hood_hob_and_dishwasher(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """ConnectLife: hood and hob grease-filter hours (both property spellings)
    and the per-filter carbon hours count up from the device's reset; the
    dishwasher's self-clean reminder (no device class) latches; problem-class
    alarms are left to problem-sensor adoption."""
    await setup_integration(hass, global_entry)
    hood = await _seed(
        hass,
        "connectlife",
        "h012",
        "Gorenje Hood",
        [
            Ent("gorenje_hood_greasefilterusedhours", "greasefilterusedhours", "h", "12"),
            Ent("gorenje_hood_recirculationfilter1usedhours", "recirculationfilter1usedhours", "h", "80", original_name="RecirculationFilter1UsedHours"),
            Ent("gorenje_hood_recirculationfilter2usedhours", "recirculationfilter2usedhours", "h", "80", original_name="RecirculationFilter2UsedHours"),
        ],
    )
    hob = await _seed(
        hass,
        "connectlife",
        "h010",
        "Hob Extractor",
        [Ent("hob_extractor_grease_filter_used_hours", "grease_filter_used_hours", "h", "5")],
    )
    dishwasher = await _seed(
        hass,
        "connectlife",
        "d015",
        "ASKO Dishwasher",
        [
            Ent("asko_dishwasher_alarm_run_selfcleaning", "alarm_run_selfcleaning", state="off", platform="binary_sensor"),
            Ent("asko_dishwasher_alarm_salt_refill", "alarm_salt_refill", state="off", platform="binary_sensor"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, hood)
    assert set(tasks) == {
        "Clean Grease Filter",
        "Replace Filter — RecirculationFilter1UsedHours",
        "Replace Filter — RecirculationFilter2UsedHours",
    }
    grease = tasks["Clean Grease Filter"]
    assert grease["direction"] == "usage_above" and grease["threshold"] == 30.0
    trig = _trigger(hass, "connectlife", grease)
    assert trig["type"] == "counter" and trig["trigger_baseline_value"] == 0
    assert tasks["Replace Filter — RecirculationFilter1UsedHours"]["threshold"] == 120.0
    assert set(_by_name(setups, hob)) == {"Clean Grease Filter"}
    (selfclean,) = setups[dishwasher]["tasks"]
    assert selfclean["task_name"] == "Clean Appliance" and selfclean["direction"] == "event_present"


async def test_wellbeing_robot_and_two_filter_purifier(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    robot = await _seed(
        hass,
        "wellbeing",
        "pure_i9",
        "PUREi9",
        [
            Ent("wellbeing_purei9_main_brush_sqm", unit="%", state="70"),
            Ent("wellbeing_purei9_side_brush_sqm", unit="%", state="40"),
            Ent("wellbeing_purei9_filter_sqm", unit="%", state="30"),
        ],
    )
    purifier = await _seed(
        hass,
        "wellbeing",
        "uh500",
        "UltimateHome 500",
        [
            Ent("wellbeing_ultimatehome_500_filterlife_1", unit="%", state="60", original_name="Particle Filter Life"),
            Ent("wellbeing_ultimatehome_500_filterlife_2", unit="%", state="80", original_name="Carbon Filter Life"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    assert {n: t["entity_ids"] for n, t in _by_name(setups, robot).items()} == {
        "Replace Main Brush": ["sensor.wellbeing_purei9_main_brush_sqm"],
        "Replace Side Brush": ["sensor.wellbeing_purei9_side_brush_sqm"],
        "Replace Filter": ["sensor.wellbeing_purei9_filter_sqm"],
    }
    assert set(_by_name(setups, purifier)) == {"Replace Filter — Particle Filter Life", "Replace Filter — Carbon Filter Life"}


async def test_roomba_bridges(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """rest980: the robot's lifetime runtime (minutes) drives the cleaning
    cadences and the bin ENUM latches on 'Full'. Roomba+: the four remaining-
    hours countdowns with ~10 % floors and their reset buttons."""
    await setup_integration(hass, global_entry)
    rest = await _seed(
        hass,
        "roomba_rest980",
        "r980",
        "Roomba",
        [
            Ent("roomba_total_time", unit="min", state="6000"),
            Ent("roomba_bin", state="Not Full"),
            Ent("roomba_total_jobs", unit="min", state="120"),
        ],
    )
    plus = await _seed(
        hass,
        "roomba_plus",
        "j7",
        "Roomba j7+",
        [
            Ent("roomba_j7_maintenance_filter", "filter_remaining_hours", "h", "40"),
            Ent("roomba_j7_maintenance_brushes", "brush_remaining_hours", "h", "150"),
            Ent("roomba_j7_maintenance_side_brush", "part_edge_brush", "h", "100"),
            Ent("roomba_j7_maintenance_clean_base_bag", "part_dirt_bag", "h", "20"),
            btn("roomba_j7_reset_filter", "reset_filter"),
            btn("roomba_j7_reset_brush", "reset_brush"),
            btn("roomba_j7_reset_side_brush", "reset_side_brush"),
            btn("roomba_j7_reset_clean_base_bag", "reset_clean_base_bag"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    rest_tasks = _by_name(setups, rest)
    assert {n: (t["direction"], t["threshold"]) for n, t in rest_tasks.items()} == {
        "Filter Cleaning": ("usage_delta", 900.0),
        "Clean Main Brush": ("usage_delta", 1800.0),
        "Empty Dustbin": ("event_present", 0.0),
    }
    assert _trigger(hass, "roomba_rest980", rest_tasks["Empty Dustbin"])["trigger_to_state"] == "Full"

    assert {n: (t["threshold"], _reset(t)) for n, t in _by_name(setups, plus).items()} == {
        "Replace Filter": (6.0, "button.roomba_j7_reset_filter"),
        "Replace Main Brush": (20.0, "button.roomba_j7_reset_brush"),
        "Replace Side Brush": (15.0, "button.roomba_j7_reset_side_brush"),
        "Replace Dust Bag": (3.0, "button.roomba_j7_reset_clean_base_bag"),
    }


async def test_viomise_shares_the_xiaomi_cloud_duties(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    robot = await _seed(
        hass,
        "viomise",
        "se1",
        "Viomi SE",
        [
            Ent("viomi_se_main_brush_life", unit="%", state="50"),
            Ent("viomi_se_side_brush_life", unit="%", state="50"),
            Ent("viomi_se_filter_life", unit="%", state="50"),
            Ent("viomi_se_mop_life", unit="%", state="50"),
            Ent("viomi_se_battery", unit="%", state="80"),
        ],
    )
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert set(_by_name(setups, robot)) == {"Replace Main Brush", "Replace Side Brush", "Replace Filter", "Replace Mop Pads"}
    assert set(SIGNATURES["viomise"].tasks) == set(SIGNATURES["xiaomi_vacuum"].tasks)
    assert all(a is b for a, b in zip(SIGNATURES["viomise"].tasks, SIGNATURES["xiaomi_vacuum"].tasks, strict=True))


async def test_petsafe_rake_counter_and_sonicare_brush_head(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    box = await _seed(
        hass,
        "petsafe",
        "sf1",
        "ScoopFree",
        [Ent("scoopfree_rake_counter", state="80"), Ent("scoopfree_rake_status", state="idle"), btn("scoopfree_clean"), btn("scoopfree_reset")],
    )
    head = await _seed(
        hass,
        "philips_sonicare_ble",
        "hx9_brushhead",
        "Sonicare Brush Head",
        [
            Ent("sonicare_brush_head_brush_head_wear", "brushhead_wear", "%", "35"),
            Ent("sonicare_brush_head_sessions_left", "brushhead_sessions_left", None, "60"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (litter,) = setups[box]["tasks"]
    assert litter["task_name"] == "Change Litter" and litter["direction"] == "usage_above" and litter["threshold"] == 120.0
    assert _reset(litter) == "button.scoopfree_reset"
    (brush,) = setups[head]["tasks"]
    assert brush["task_name"] == "Replace Brush Head" and brush["direction"] == "alert_above" and brush["threshold"] == 90.0


async def test_xiaomi_miot_reset_buttons(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """xiaomi_miot names action buttons '<model>_<mac4>_<action>' — the first
    brush-cleaner / filter instance, like the sensors the duties match."""
    await setup_integration(hass, global_entry)
    robot = await _seed(
        hass,
        "xiaomi_miot",
        "p2009",
        "Dreame F9",
        [
            Ent("p2009_ab12_filter_life_level", "filter-filter_life_level", "%", "8"),
            Ent("p2009_ab12_brush_life_level", "brush_cleaner-brush_life_level", "%", "40"),
            btn("p2009_ab12_reset_filter_life", "filter-reset_filter_life"),
            btn("p2009_ab12_reset_brush_life", "brush_cleaner-reset_brush_life"),
        ],
    )
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert {n: _reset(t) for n, t in _by_name(setups, robot).items()} == {
        "Replace Filter": "button.p2009_ab12_reset_filter_life",
        "Replace Main Brush": "button.p2009_ab12_reset_brush_life",
    }


def test_round15ah_entries_cite_their_sources() -> None:
    new = ("homewhiz", "connectlife", "wellbeing", "roomba_rest980", "roomba_plus", "viomise", "petsafe", "philips_sonicare_ble")
    for domain in new:
        catalog = SIGNATURES[domain]
        assert catalog.verified.startswith("2026-09-27") and catalog.source, domain
    for domain in ("dreame_vacuum", "robovac_mqtt", "ilife", "petkit", "petlibro", "homeconnect_ws", "candy", "philips_shaver", "anycubic_cloud"):
        assert any(s.resets for s in SIGNATURES[domain].tasks), domain
