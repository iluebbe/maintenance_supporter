"""Catalog round 18 (sweep 2026-11-01): Home Assistant 2026.11 and HACS.

Core 2026.11 (read in core dev 8e864cd): Helty Flow's treated-air counter,
the Exicom Spin wallbox's lifetime energy, LoJack's new odometer, Rituals'
fill level now that it is a percentage (older cores sent text, so the duty
requires the unit), SmartyPlants' fertilising countdown, ViCare's ash level,
and the reset buttons that make Fjäråskupan's grease filter and Midea's
dust-filter reminder catalog duties. HACS: RAMSES RF ventilation, Philips
Home iD (MUJI filters, Rita espresso machines), JURA Wi-Fi, three water
softeners, and the second repositories of PetKit and FordPass, whose keys
differed from the ones the catalog knew.

Odometers HA shows in metres and volume counters shown in litres or cubic
feet get their thresholds converted (they fell back to the canonical
number before). Entities are seeded the way the integrations register them.
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
    platform domain, original (registry) name."""

    object_id: str
    tkey: str | None = None
    unit: str | None = None
    state: str = "40"
    platform: str = "sensor"
    original_name: str | None = None


def btn(object_id: str, tkey: str) -> Ent:
    return Ent(object_id, tkey, platform="button", state="unknown")


def problem(object_id: str, tkey: str, state: str = "off") -> Ent:
    return Ent(object_id, tkey, platform="binary_sensor", state=state)


async def _seed(hass: HomeAssistant, domain: str, uid: str, device_name: str, entities: list[Ent]) -> str:
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


async def _tasks(hass: HomeAssistant, device_id: str) -> dict[str, dict]:
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    if device_id not in setups:
        return {}
    return {t["task_name"]: t for t in setups[device_id]["tasks"]}


def _reset(task: dict) -> str | None:
    return task["reset"]["entity_id"] if task["reset"] else None


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


# ── Core 2026.11 ─────────────────────────────────────────────────────────────


async def test_helty_filter_by_treated_air_in_its_unit(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """85,000 m³ (the docs' reminder ahead of the 90,000 m³ alarm); the reset
    takes the counter back to zero, which completes the task. The lifetime
    counter is not a duty. A unit shown in ft³ gets the same air volume."""
    await setup_integration(hass, global_entry)
    dev = await _seed(
        hass,
        "helty_cloud",
        "flow",
        "Helty Flow",
        [
            Ent("flow_air_treated_by_filter", "filter_volume", "m³", "61200"),
            Ent("flow_total_air_treated", "total_volume", "m³", "412000"),
            problem("flow_filter", "filter"),
        ],
    )
    tasks = await _tasks(hass, dev)
    assert set(tasks) == {"Replace Ventilation Filter"}
    task = tasks["Replace Ventilation Filter"]
    assert task["entity_ids"] == ["sensor.flow_air_treated_by_filter"]
    trigger = _trigger(hass, "helty_cloud", task)
    assert trigger["type"] == "counter"
    assert trigger["trigger_target_value"] == 85000

    hass.states.async_set("sensor.flow_air_treated_by_filter", "2161000", {"unit_of_measurement": "ft³"})
    assert _trigger(hass, "helty_cloud", task)["trigger_target_value"] == pytest.approx(85000 * 35.3147, rel=1e-6)


async def test_lojack_odometer_in_miles_and_in_metres(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    dev = await _seed(hass, "lojack", "van", "Van", [Ent("van_odometer", "odometer", "mi", "48210")])
    tasks = await _tasks(hass, dev)
    assert set(tasks) == {"Annual Service", "Tire Rotation"}
    service = tasks["Annual Service"]
    assert _trigger(hass, "lojack", service)["trigger_target_value"] == pytest.approx(15000 * 0.62137, abs=0.01)
    # An odometer shown in metres: the 15,000 km floor read as 15,000 m before.
    hass.states.async_set("sensor.van_odometer", "77588000", {"unit_of_measurement": "m"})
    assert _trigger(hass, "lojack", service)["trigger_target_value"] == 15_000_000


async def test_filament_counts_in_metres_whatever_the_display(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The nozzle duty's 1,000 are metres of filament (unit_base), unlike an
    odometer's kilometres: shown in m it stays 1,000, shown in km it is 1."""
    await setup_integration(hass, global_entry)
    printer = await _seed(
        hass, "moonraker", "voron", "Voron", [Ent("voron_totals_filament_used", None, "m", "5321", original_name="Totals Filament Used")]
    )
    (nozzle,) = (await _tasks(hass, printer)).values()
    assert _trigger(hass, "moonraker", nozzle)["trigger_target_value"] == 1000
    hass.states.async_set("sensor.voron_totals_filament_used", "5.321", {"unit_of_measurement": "km"})
    assert _trigger(hass, "moonraker", nozzle)["trigger_target_value"] == 1


async def test_rituals_fill_needs_the_percent_unit(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """2026.11 reports the fill level in %; an older core sent text under the
    same key with no unit, which must not become a duty."""
    await setup_integration(hass, global_entry)
    new = await _seed(hass, "rituals_perfume_genie", "g2", "Genie", [Ent("genie_fill", "fill", "%", "40")])
    old = await _seed(hass, "rituals_perfume_genie", "g1", "Old Genie", [Ent("old_genie_fill", "fill", None, "70-80%")])
    tasks = await _tasks(hass, new)
    assert set(tasks) == {"Replace Fragrance Cartridge"}
    assert tasks["Replace Fragrance Cartridge"]["direction"] == "percent_left"
    assert await _tasks(hass, old) == {}


async def test_exicom_smartyplants_and_vicare_ash(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    charger = await _seed(
        hass,
        "exicom_spin_ble",
        "spin",
        "Spin",
        [Ent("spin_lifetime_energy", "lifetime_energy", "kWh", "812"), Ent("spin_session_energy", "session_energy", "kWh", "9")],
    )
    plant = await _seed(hass, "smartyplants", "fig", "Fig", [Ent("fig_fertilize_in", "fertilize", "d", "4"), Ent("fig_moisture", "moisture", "%", "31")])
    boiler = await _seed(hass, "vicare", "vitoligno", "Vitoligno", [Ent("vitoligno_ash_level", "ash_level", "%", "40")])

    (cable,) = (await _tasks(hass, charger)).values()
    assert cable["task_name"] == "Inspect Cable and Plug"
    assert cable["entity_ids"] == ["sensor.spin_lifetime_energy"]

    tasks = await _tasks(hass, plant)
    assert set(tasks) == {"Fertilizing"}
    assert _trigger(hass, "smartyplants", tasks["Fertilizing"])["trigger_below"] == 1  # one day ahead

    tasks = await _tasks(hass, boiler)
    assert set(tasks) == {"Empty Ash Pan"}
    trigger = _trigger(hass, "vicare", tasks["Empty Ash Pan"])
    assert trigger["trigger_above"] == 85
    assert trigger.get("auto_complete_on_recovery") is True


async def test_fjaraskupan_grease_filter_presses_its_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    hood = await _seed(
        hass,
        "fjaraskupan",
        "hood",
        "Kitchen Hood",
        [problem("hood_grease_filter", "grease_filter"), problem("hood_carbon_filter", "carbon_filter"), btn("hood_reset_grease_filter", "reset_grease_filter")],
    )
    tasks = await _tasks(hass, hood)
    assert set(tasks) == {"Clean Grease Filter", "Replace Filter"}
    assert _reset(tasks["Clean Grease Filter"]) == "button.hood_reset_grease_filter"
    assert tasks["Replace Filter"]["reset"] is None
    assert _trigger(hass, "fjaraskupan", tasks["Clean Grease Filter"])["type"] == "state_change"


async def test_midea_dust_filter_reset_only_where_the_button_is(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    ac = await _seed(hass, "midea", "ac", "Bedroom AC", [problem("bedroom_ac_full_dust", "full_dust"), btn("bedroom_ac_reset_filter", "reset_filter")])
    dehum = await _seed(hass, "midea", "a1", "Dehumidifier", [problem("dehumidifier_full_dust", "full_dust")])
    tasks = await _tasks(hass, ac)
    assert _reset(tasks["Filter Cleaning"]) == "button.bedroom_ac_reset_filter"
    assert (await _tasks(hass, dehum))["Filter Cleaning"]["reset"] is None


# ── HACS ─────────────────────────────────────────────────────────────────────


async def test_ramses_filter_days_by_name_with_its_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """No translation_key: the entity id ends in '_filter_remaining'. The %
    twin slugs to the same name and gets '_2'; it never becomes the duty."""
    await setup_integration(hass, global_entry)
    fan = await _seed(
        hass,
        "ramses_cc",
        "32_123456",
        "Itho HRU",
        [
            Ent("itho_hru_filter_remaining", None, "d", "40", original_name="Filter remaining"),
            Ent("itho_hru_filter_remaining_2", None, "%", "22", original_name="Filter remaining (%)"),
            btn("itho_hru_reset_filter_counter", "reset_filter_counter"),
        ],
    )
    tasks = await _tasks(hass, fan)
    assert set(tasks) == {"Replace Ventilation Filter"}
    task = tasks["Replace Ventilation Filter"]
    assert task["entity_ids"] == ["sensor.itho_hru_filter_remaining"]
    assert _reset(task) == "button.itho_hru_reset_filter_counter"
    assert _trigger(hass, "ramses_cc", task)["trigger_below"] == 7  # a week, in days


async def test_ramses_percent_twin_alone_is_no_duty(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    fan = await _seed(hass, "ramses_cc", "32_654321", "Orcon", [Ent("orcon_filter_remaining", None, "%", "22", original_name="Filter remaining (%)")])
    assert await _tasks(hass, fan) == {}


async def test_philips_homeid_muji_filters_and_rita(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    muji = await _seed(
        hass,
        "philips_homeid",
        "muji",
        "MUJI Purifier",
        [
            Ent("muji_filter_clean_in", "muji_filter0_remaining", "h", "300"),
            Ent("muji_filter_replace_in", "muji_filter1_remaining", "h", "3900"),
            btn("muji_reset_clean", "muji_reset_filter_clean"),
            btn("muji_reset_replace", "muji_reset_filter_replace"),
        ],
    )
    rita = await _seed(
        hass,
        "philips_homeid",
        "rita",
        "LatteGo",
        [Ent("lattego_aquaclean", "rita_aquaclean_autonomy", "%", "64"), Ent("lattego_descale", "rita_descale_autonomy", "%", "51")],
    )
    tasks = await _tasks(hass, muji)
    assert set(tasks) == {"Filter Cleaning", "Replace Filter"}
    assert _reset(tasks["Filter Cleaning"]) == "button.muji_reset_clean"
    assert _reset(tasks["Replace Filter"]) == "button.muji_reset_replace"
    assert tasks["Filter Cleaning"]["entity_ids"] == ["sensor.muji_filter_clean_in"]
    assert set(await _tasks(hass, rita)) == {"Replace Water Filter", "Descaling"}


async def test_jura_wifi_alerts(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    jura = await _seed(
        hass,
        "jura_wifi",
        "e8",
        "E8",
        [
            problem("e8_cleaning_due", "cleaning_due"),
            problem("e8_descaling_due", "descaling_due"),
            problem("e8_filter_change_due", "filter_change_due"),
            problem("e8_milk_clean_due", "milk_clean_due"),
            problem("e8_milk_rinse_due", "milk_rinse_due"),
            problem("e8_water_tank_empty", "water_tank_empty"),
        ],
    )
    tasks = await _tasks(hass, jura)
    assert set(tasks) == {"Run Cleaning Program", "Descaling", "Replace Water Filter", "Clean Milk System"}
    assert all(t["direction"] == "event_present" for t in tasks.values())
    assert tasks["Clean Milk System"]["entity_ids"] == ["binary_sensor.e8_milk_clean_due"]


async def test_softeners_salt_and_resin(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    eco = await _seed(hass, "ecowater_cloud", "eco", "EcoWater", [Ent("eco_days_until_out_of_salt", "days_until_out_of_salt", "d", "21")])
    cul = await _seed(hass, "culligan_azure", "cul", "Culligan", [Ent("cul_days_salt_remaining", "days_salt_remaining", "d", "12")])
    yps = await _seed(
        hass,
        "ypsilon_local",
        "yps",
        "Runxin",
        [
            problem("runxin_salt_shortage_reminder", "salt_shortage_reminder"),
            problem("runxin_salt_shortage_alarm", "salt_shortage_alarm"),
            problem("runxin_resin_replacement", "resin_replacement"),
            problem("runxin_filter_reminder", "filter_reminder"),
        ],
    )
    for dev, domain in ((eco, "ecowater_cloud"), (cul, "culligan_azure")):
        tasks = await _tasks(hass, dev)
        assert set(tasks) == {"Refill Softener Salt"}, domain
        assert _trigger(hass, domain, tasks["Refill Softener Salt"])["trigger_below"] == 7, domain
    tasks = await _tasks(hass, yps)
    assert set(tasks) == {"Refill Softener Salt", "Replace Softener Resin", "Replace Filter"}
    assert sorted(tasks["Refill Softener Salt"]["entity_ids"]) == [
        "binary_sensor.runxin_salt_shortage_alarm",
        "binary_sensor.runxin_salt_shortage_reminder",
    ]


async def test_petkit_second_repository(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """RobertD502's petkit names the fountain filter 'filter' and the feeder's
    desiccant 'desiccant_days_remaining'; their resets are wired as in the
    first repository."""
    await setup_integration(hass, global_entry)
    fountain = await _seed(hass, "petkit", "w5", "Eversweet", [Ent("eversweet_filter", "filter", "%", "35"), btn("eversweet_reset_filter", "reset_filter")])
    feeder = await _seed(
        hass,
        "petkit",
        "d4",
        "Fresh Element",
        [Ent("fresh_element_desiccant", "desiccant_days_remaining", "d", "9"), btn("fresh_element_reset_desiccant", "reset_desiccant")],
    )
    tasks = await _tasks(hass, fountain)
    assert _reset(tasks["Replace Water Filter"]) == "button.eversweet_reset_filter"
    tasks = await _tasks(hass, feeder)
    assert _reset(tasks["Replace Desiccant"]) == "button.fresh_element_reset_desiccant"
    assert _trigger(hass, "petkit", tasks["Replace Desiccant"])["trigger_below"] == 2


async def test_fordpass_oil_life(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    car = await _seed(
        hass,
        "fordpass",
        "vin1",
        "Puma",
        [Ent("fordpass_vin1_oil", "oil", "%", "62"), Ent("fordpass_vin1_odometer", "odometer", "km", "31240"), Ent("fordpass_vin1_engineoiltemp", "engineoiltemp", "°C", "88")],
    )
    tasks = await _tasks(hass, car)
    assert set(tasks) == {"Annual Service", "Tire Rotation", "Oil Service"}
    assert tasks["Oil Service"]["entity_ids"] == ["sensor.fordpass_vin1_oil"]
    assert tasks["Oil Service"]["direction"] == "percent_left"


def test_round_18_new_names_are_translated() -> None:
    from custom_components.maintenance_supporter.templates_i18n import localize_template_text

    for name, de in (
        ("Run Cleaning Program", "Reinigungsprogramm ausführen"),
        ("Clean Milk System", "Milchsystem reinigen"),
        ("Replace Fragrance Cartridge", "Duftkartusche ersetzen"),
        ("Replace Softener Resin", "Enthärterharz ersetzen"),
    ):
        assert localize_template_text(name, "de") == de
