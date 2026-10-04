"""Catalog round 16, part B (kitchen & water, pets, printers, vacuums, garden).

Pins the round-16 additions verified against Home Assistant core 2026.10.0b0
(both unchanged since 2026.9): the Tami4 water bar's filter and UV-lamp
replacement DATES (due_date) and the Litter-Robot 5 filter date with its
"Change filter" button as the reset — plus the candidates reviewed and
skipped this round (pre-warnings, twins of an already catalogued part,
settings, status), which must stay unmatched next to the duties their
devices already carry.

Entities are seeded the way the real integrations register them: a
translation_key where the integration sets one, otherwise only the entity-id
suffix its naming code produces.
"""

from __future__ import annotations

from datetime import timedelta
from typing import NamedTuple

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
    build_setup_trigger,
    discover_integration_setups,
)
from custom_components.maintenance_supporter.helpers.trigger_fallback import evaluate_due_date

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


async def _seed(
    hass: HomeAssistant, domain: str, uid: str, device_name: str, entities: list[Ent], *, model: str | None = None
) -> str:
    """Seed one device of `domain`; the object id is used verbatim so the
    entity-id suffix is exactly what the real integration's naming produces."""
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


async def test_tami4_filter_and_uv_lamp_due_dates(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Tami4 Edge: the cloud reports WHEN the filter and the UV lamp are due
    (device_class DATE, a plain YYYY-MM-DD) → two due-date duties with a
    week's lead time. No button resets them (only boil water / prepare
    drink exist); the litres counter of the same filter and the 'installed'
    flags are not duties."""
    await setup_integration(hass, global_entry)
    today = dt_util.now().date()
    bar = await _seed(
        hass,
        "tami4",
        "psn1",
        "Tami4 Edge",
        [
            Ent("tami4_edge_filter_upcoming_replacement", "filter_upcoming_replacement", None, (today + timedelta(days=40)).isoformat()),
            Ent("tami4_edge_uv_upcoming_replacement", "uv_upcoming_replacement", None, (today + timedelta(days=3)).isoformat()),
            Ent("tami4_edge_filter_water_passed", "filter_litters_passed", "L", "812.5"),
            Ent("tami4_edge_filter_installed", "filter_installed", None, "True"),
            Ent("tami4_edge_uv_installed", "uv_installed", None, "True"),
            Ent("tami4_edge_boil_water", "boil_water", None, "unknown", "button", "Boil water"),
            Ent("tami4_edge_prepare_espresso", "prepare_drink", None, "unknown", "button", "Prepare Espresso"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert setups[bar]["integration_name"] == "Tami4 Edge / Edge+"

    tasks = _by_name(setups, bar)
    assert set(tasks) == {"Replace Water Filter", "Replace UV Lamp"}
    assert tasks["Replace Water Filter"]["entity_ids"] == ["sensor.tami4_edge_filter_upcoming_replacement"]
    assert tasks["Replace UV Lamp"]["entity_ids"] == ["sensor.tami4_edge_uv_upcoming_replacement"]
    for task in tasks.values():
        assert task["direction"] == "due_date" and task["threshold"] == 7.0
        assert task["reset"] is None, "Tami4 has no reset button — the cloud moves the date"

    uv = _trigger(hass, "tami4", tasks["Replace UV Lamp"])
    assert uv == {
        "type": "due_date",
        "entity_id": "sensor.tami4_edge_uv_upcoming_replacement",
        "entity_ids": ["sensor.tami4_edge_uv_upcoming_replacement"],
        "trigger_days_before": 7,
        "auto_complete_on_recovery": True,
    }
    # The date-only state reads through the real evaluator: the UV lamp falls
    # due within the week's lead time, the filter (40 days out) does not.
    now = dt_util.utcnow()
    assert evaluate_due_date(hass.states.get, uv, uv["entity_ids"], now).active is True
    filt = _trigger(hass, "tami4", tasks["Replace Water Filter"])
    assert evaluate_due_date(hass.states.get, filt, filt["entity_ids"], now).active is False


async def test_litter_robot_5_filter_date_reset_by_change_filter(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Litter-Robot 5: the next-filter-replacement TIMESTAMP becomes a
    due-date duty whose completion presses 'Change filter' (pylitterbot:
    resets the filter replacement counter → a later date). The robot 'Reset'
    button is never a duty's reset; an LR4 (no filter date) gets no filter
    duty; the problem-class 'Laser dirty' binary is left to problem-sensor
    adoption."""
    await setup_integration(hass, global_entry)
    lr5 = await _seed(
        hass,
        "litterrobot",
        "lr5",
        "Litter-Robot 5 Pro",
        [
            Ent("litter_robot_5_pro_waste_drawer", "waste_drawer", "%", "35"),
            Ent("litter_robot_5_pro_litter_level", "litter_level", "%", "80"),
            Ent("litter_robot_5_pro_total_cycles", "total_cycles", None, "412"),
            Ent(
                "litter_robot_5_pro_next_filter_replacement",
                "next_filter_replacement",
                None,
                (dt_util.utcnow() + timedelta(days=30)).isoformat(),
            ),
            Ent("litter_robot_5_pro_laser_dirty", "laser_dirty", None, "off", "binary_sensor"),
            Ent("litter_robot_5_pro_reset_waste_drawer", "reset_waste_drawer", None, "unknown", "button", "Reset waste drawer"),
            Ent("litter_robot_5_pro_reset", "reset", None, "unknown", "button", "Reset"),
            Ent("litter_robot_5_pro_change_filter", "change_filter", None, "unknown", "button", "Change filter"),
        ],
    )
    lr4 = await _seed(
        hass,
        "litterrobot",
        "lr4",
        "Litter-Robot 4",
        [
            Ent("litter_robot_4_waste_drawer", "waste_drawer", "%", "20"),
            Ent("litter_robot_4_litter_level", "litter_level", "%", "90"),
            Ent("litter_robot_4_reset", "reset", None, "unknown", "button", "Reset"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, lr5)
    assert set(tasks) == {"Empty Waste Drawer", "Refill Litter", "Wash Litter Box", "Replace Filter"}
    filt = tasks["Replace Filter"]
    assert filt["direction"] == "due_date" and filt["threshold"] == 7.0
    assert filt["entity_ids"] == ["sensor.litter_robot_5_pro_next_filter_replacement"]
    assert filt["reset"] == {
        "entity_id": "button.litter_robot_5_pro_change_filter",
        "name": "Change filter",
        "disabled": False,
    }
    assert tasks["Empty Waste Drawer"]["reset"]["entity_id"] == "button.litter_robot_5_pro_reset_waste_drawer"
    assert all(t["reset"] is None for n, t in tasks.items() if n not in ("Replace Filter", "Empty Waste Drawer"))
    tc = _trigger(hass, "litterrobot", filt)
    assert tc["type"] == "due_date" and tc["trigger_days_before"] == 7
    assert tc["entity_ids"] == ["sensor.litter_robot_5_pro_next_filter_replacement"]
    assert tc["auto_complete_on_recovery"] is True

    lr4_tasks = _by_name(setups, lr4)
    assert set(lr4_tasks) == {"Empty Waste Drawer", "Refill Litter"}
    assert lr4_tasks["Empty Waste Drawer"]["reset"] is None, "the robot 'Reset' is not the drawer reset"


async def test_round16b_reviewed_candidates_stay_unmatched(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Candidates reviewed and skipped this round never join a duty: pre-
    warnings (Home Connect 'descaling in N cups', grease filter 'nearly
    reached' — clearing one would auto-complete the shared latch), twins of
    an already catalogued part (Midea filter days, Brother drum pages,
    Xiaomi Air Fresh filter days), a function flag (LG kimchi fridge
    one-touch filter), a performed-maintenance tally (Miele descaling
    cycles), undocumented counters (Tuya fountain, SmartThings dust-bag
    cycles) and a setting (ScreenLogic Salt/TDS). Fjäråskupan and SmartTub
    only ship problem-class binaries — problem-sensor adoption, no catalog
    entry."""
    await setup_integration(hass, global_entry)
    kimchi = await _seed(
        hass,
        "lg_thinq",
        "kf1",
        "Kimchi Fridge",
        [
            Ent("kimchi_fridge_fresh_air_filter", "fresh_air_filter", None, "replace"),
            Ent("kimchi_fridge_fresh_air_filter", "one_touch_filter", None, "on", "binary_sensor"),
        ],
    )
    coffee = await _seed(
        hass,
        "home_connect",
        "cm1",
        "Coffee Maker",
        [
            Ent("coffee_maker_device_should_be_descaled", "device_should_be_descaled", None, "off"),
            Ent("coffee_maker_descaling_in_20_cups", "descaling_in_20_cups", None, "present"),
            Ent("coffee_maker_descaling_in_5_cups", "descaling_in_5_cups", None, "off"),
        ],
    )
    hood = await _seed(
        hass,
        "home_connect",
        "hd1",
        "Hood",
        [
            Ent("hood_grease_filter_max_saturation_reached", "grease_filter_max_saturation_reached", None, "off"),
            Ent("hood_grease_filter_max_saturation_nearly_reached", "grease_filter_max_saturation_nearly_reached", None, "present"),
        ],
    )
    miele_coffee = await _seed(
        hass, "miele", "cva1", "Coffee System", [Ent("coffee_system_descaling_cycles", "descaling_counter", None, "3")]
    )
    purifier = await _seed(
        hass,
        "midea",
        "ed1",
        "Water Purifier",
        [
            Ent("water_purifier_filter_1_life_level", "filter_life_level", "%", "80"),
            Ent("water_purifier_filter_2_life_level", "filter_life_level", "%", "60"),
            Ent("water_purifier_filter_1_available_days", "filter_available_days", "d", "200"),
            Ent("water_purifier_filter_2_available_days", "filter_available_days", "d", "150"),
        ],
        model="Water Drinking Appliance",
    )
    laser = await _seed(
        hass,
        "brother",
        "hl1",
        "HL-L2350DW",
        [
            Ent("hl_l2350dw_drum_remaining_lifetime", "drum_remaining_life", "%", "70"),
            Ent("hl_l2350dw_drum_remaining_pages", "drum_remaining_pages", None, "9100"),
            Ent("hl_l2350dw_drum_page_counter", "drum_page_counter", None, "2900"),
        ],
    )
    air_fresh = await _seed(
        hass,
        "xiaomi_miio",
        "a1",
        "Air Fresh A1",
        [
            Ent("air_fresh_a1_dust_filter_life_remaining", "dust_filter_life_remaining", "%", "60"),
            Ent("air_fresh_a1_dust_filter_lifetime_remaining_days", "dust_filter_life_remaining_days", "d", "90"),
        ],
    )
    fountain = await _seed(
        hass,
        "tuya",
        "cwysj1",
        "Pet Fountain",
        [
            Ent("pet_fountain_uv_runtime", "uv_runtime", "min", "1200"),
            Ent("pet_fountain_filter_duration", "filter_duration", "h", "300"),
            Ent("pet_fountain_water_pump_duration", "pump_time", "h", "640"),
        ],
    )
    station = await _seed(
        hass,
        "smartthings",
        "jet1",
        "Jet Clean Station",
        [
            Ent("jet_clean_station_dust_bag_cycles", "stick_cleaner_dust_bag_usage", None, "7"),
            Ent("jet_clean_station_dust_bag_full", "stick_cleaner_dust_bag", None, "on", "binary_sensor"),
        ],
    )
    pool = await _seed(
        hass,
        "screenlogic",
        "sl1",
        "Pentair",
        [
            Ent("pentair_chlorinator_salt", "salt_ppm", "ppm", "3200"),
            Ent("pentair_salt_tds", "salt_tds_ppm", "ppm", "1000"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    def only(device_id: str, task_name: str, entity_id: str) -> None:
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == task_name, task
        assert task["entity_ids"] == [entity_id], task

    only(kimchi, "Replace Filter", "sensor.kimchi_fridge_fresh_air_filter")
    only(coffee, "Descale Appliance", "sensor.coffee_maker_device_should_be_descaled")
    only(hood, "Clean Grease Filter", "sensor.hood_grease_filter_max_saturation_reached")
    (water,) = setups[purifier]["tasks"]
    assert water["task_name"] == "Replace Water Filter" and water["direction"] == "percent_left"
    assert water["entity_ids"] == ["sensor.water_purifier_filter_1_life_level", "sensor.water_purifier_filter_2_life_level"]
    only(laser, "Replace Drum Unit", "sensor.hl_l2350dw_drum_remaining_lifetime")
    only(air_fresh, "Replace Filter", "sensor.air_fresh_a1_dust_filter_life_remaining")
    only(pool, "Refill Pool Salt", "sensor.pentair_chlorinator_salt")
    for device_id in (miele_coffee, fountain, station):
        assert device_id not in setups

    assert "fjaraskupan" not in SIGNATURES and "smarttub" not in SIGNATURES
