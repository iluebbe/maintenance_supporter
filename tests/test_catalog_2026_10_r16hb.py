"""Catalog round 16, HACS wave part HB (kitchen & water, garden & pool,
cars, wallboxes, pets).

Pins the HACS integrations added from the round-16 research, each verified
in the integration's current default branch: Midea Auto Cloud purifier
cartridges, the Grünbeck softliQ salt and service countdowns (cloud and
local), the Polaris / Rusclimate 'retain' countdowns routed by unit and
device model with their reset buttons, the Gecko spa reminders and the UK
MOT date (due_date), TerraMow and STIHL iMOW mower duties, the Hayward
OmniLogic salt and Fluidra UV-lamp hours, BYD / Pandora / VW Group Connect /
PyCupra car service duties, the Fronius Wattpilot lifetime energy and the
Neakasa litter box — plus the candidates left out on purpose (the Midea
default mapping's salt entity, the Ballu breezer resets, Gecko's generic spa
check, Pandora's CAN mileage twins).

Entities are seeded the way the real integrations register them: the
translation_key the integration sets, otherwise the entity id its naming
produces and its original (registry) name, the unit it reports, the device
model where a duty is gated on it, and — for buttons and disabled-by-default
sensors — the registry state the integration gives them.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import NamedTuple

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
    build_setup_trigger,
    discover_integration_setups,
)
from custom_components.maintenance_supporter.helpers.trigger_fallback import evaluate_due_date

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


def _button(object_id: str, tkey: str | None, name: str) -> Ent:
    return Ent(object_id, tkey, None, "unknown", "button", name)


async def _seed(
    hass: HomeAssistant, domain: str, uid: str, device_name: str, entities: list[Ent], *, model: str | None = None
) -> str:
    """Seed one device of `domain`; the object id is used verbatim so the
    entity id is exactly what the real integration's naming produces."""
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


def _tasks(setups: dict[str, dict], device_id: str) -> dict[tuple[str, str], dict]:
    return {(t["task_name"], t["direction"]): t for t in setups[device_id]["tasks"]}


def _names(setups: dict[str, dict], device_id: str) -> set[str]:
    return {t["task_name"] for t in setups[device_id]["tasks"]}


def _reset(task: dict) -> str | None:
    return task["reset"]["entity_id"] if task["reset"] else None


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    """The pre-wired trigger the adopt path would build for a proposal."""
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


def _object(hass: HomeAssistant, name: str) -> MockConfigEntry:
    return next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == name
    )


# ── Kitchen & water treatment ─────────────────────────────────────────────


def _polaris_humidifier() -> list[Ent]:
    """A Polaris PUH-2300 (type 72): sensor.<class>_<model>_<name>, both
    'retain' countdowns in hours, both reset buttons."""
    return [
        Ent("humidifier_puh_2300_humidity", "humidity_sensor", "%", "45", original_name="Humidity"),
        Ent("humidifier_puh_2300_filter_retain", "filter_retain", "h", "4000", original_name="Filter retain"),
        Ent("humidifier_puh_2300_clean_retain", "clean_retain", "h", "150", original_name="Clean retain"),
        _button("humidifier_puh_2300_button_reset_filter", "button_reset_filter", "Reset time filter"),
        _button("humidifier_puh_2300_button_reset_tank", "button_reset_tank", "Reset time water tank"),
    ]


async def test_polaris_retain_countdowns_by_unit_and_model(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Polaris / Rusclimate: one 'filter_retain' key, routed by its unit
    (hours vs percent) and by the device model (the EPVS ventilation unit
    gets the ventilation filter with a week's lead); the humidifier tank and
    the anode countdowns. Humidifier and Polaris air-cleaner resets are wired;
    the Ballu ASP-200's two buttons are not (their payloads do not follow the
    sensor order); the pre-filter never joins the filter duty."""
    await setup_integration(hass, global_entry)
    humidifier = await _seed(hass, "polaris", "h72", "humidifier PUH-2300", _polaris_humidifier(), model="humidifier - PUH-2300")
    purifier = await _seed(
        hass,
        "polaris",
        "p152",
        "air_cleaner PPA-4050",
        [
            Ent("air_cleaner_ppa_4050_pm_2_5", "pm2_5_sensor", "µg/m³", "8", original_name="PM2.5"),
            Ent("air_cleaner_ppa_4050_filter_retain", "filter_retain", "h", "12", original_name="Filter retain"),
            _button("air_cleaner_ppa_4050_button_reset_filter", "button_reset_filter", "Reset time filter"),
        ],
        model="air_cleaner - PPA-4050",
    )
    ventilation = await _seed(
        hass,
        "polaris",
        "v834",
        "ventilation Electrolux-EPVS_ERVX-inv_SHUFT-PVS_RVX-inv",
        [
            Ent(
                "ventilation_electrolux_epvs_ervx_inv_shuft_pvs_rvx_inv_filter_retain",
                "filter_retain",
                "h",
                "900",
                original_name="Filter retain",
            ),
        ],
        model="ventilation - Electrolux-EPVS_ERVX-inv_SHUFT-PVS_RVX-inv",
    )
    breezer = await _seed(
        hass,
        "polaris",
        "b859",
        "air_cleaner Ballu-OneAir-ASP-200",
        [
            Ent("air_cleaner_ballu_oneair_asp_200_filter_retain", "filter_retain", "%", "35", original_name="Filter retain"),
            Ent(
                "air_cleaner_ballu_oneair_asp_200_pre_filter_retain",
                "pre_filter_retain",
                "%",
                "8",
                original_name="Pre-filter retain",
            ),
            _button("air_cleaner_ballu_oneair_asp_200_button_reset_filter", "button_reset_filter", "Reset time filter"),
            _button("air_cleaner_ballu_oneair_asp_200_button_reset_prefilter", "button_reset_prefilter", "Reset time pre-filter"),
        ],
        model="air_cleaner - Ballu-OneAir-ASP-200",
    )
    eap = await _seed(
        hass,
        "polaris",
        "e826",
        "air_cleaner Electrolux-EAP-2050D_2075D",
        [Ent("air_cleaner_electrolux_eap_2050d_2075d_filter_retain", "filter_retain", "%", "60", original_name="Filter retain")],
        model="air_cleaner - Electrolux-EAP-2050D_2075D",
    )
    boiler = await _seed(
        hass,
        "polaris",
        "w876",
        "boiler Electrolux-Royal-Flash_Centurio-IQ-Inverter",
        [
            Ent(
                "boiler_electrolux_royal_flash_centurio_iq_inverter_anode_retain",
                "anode_retain",
                "d",
                "300",
                original_name="Anode retain",
            ),
            Ent("boiler_electrolux_royal_flash_centurio_iq_inverter_temperature", "temperature_sensor", "°C", "55"),
        ],
        model="boiler - Electrolux-Royal-Flash_Centurio-IQ-Inverter",
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert setups[humidifier]["integration_name"] == "Polaris IQ Home / Rusclimate (MQTT)"

    tasks = _tasks(setups, humidifier)
    assert set(tasks) == {("Replace Filter", "duration_left"), ("Clean Tank", "duration_left")}
    filt = tasks[("Replace Filter", "duration_left")]
    assert filt["entity_ids"] == ["sensor.humidifier_puh_2300_filter_retain"]
    assert filt["threshold"] == 24.0
    assert _reset(filt) == "button.humidifier_puh_2300_button_reset_filter"
    tank = tasks[("Clean Tank", "duration_left")]
    assert tank["entity_ids"] == ["sensor.humidifier_puh_2300_clean_retain"]
    assert _reset(tank) == "button.humidifier_puh_2300_button_reset_tank"

    (pf,) = setups[purifier]["tasks"]
    assert (pf["task_name"], pf["direction"]) == ("Replace Filter", "duration_left")
    assert _reset(pf) == "button.air_cleaner_ppa_4050_button_reset_filter"

    (vf,) = setups[ventilation]["tasks"]
    assert (vf["task_name"], vf["direction"]) == ("Replace Ventilation Filter", "duration_left")
    assert vf["threshold"] == 168.0 and vf["reset"] is None

    breezer_tasks = _tasks(setups, breezer)
    assert set(breezer_tasks) == {("Replace Filter", "percent_left"), ("Clean Pre-Filter", "percent_left")}
    assert breezer_tasks[("Replace Filter", "percent_left")]["entity_ids"] == [
        "sensor.air_cleaner_ballu_oneair_asp_200_filter_retain"
    ]
    assert breezer_tasks[("Replace Filter", "percent_left")]["threshold"] == 10.0
    assert all(t["reset"] is None for t in breezer_tasks.values()), "the ASP-200 resets are not established"

    (ef,) = setups[eap]["tasks"]
    assert (ef["task_name"], ef["direction"]) == ("Replace Filter", "percent_left")

    (anode,) = setups[boiler]["tasks"]
    assert anode["task_name"] == "Anode Rod Inspection" and anode["direction"] == "duration_left"
    assert anode["threshold"] == 14.0  # 336 h in the sensor's days
    assert anode["reset"] is None


async def test_polaris_adopt_wires_both_humidifier_resets(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Adopting the humidifier wires 'Reset time filter' and 'Reset time
    water tank' as the completion actions of their own duties."""
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, global_entry)
    humidifier = await _seed(hass, "polaris", "h72", "humidifier PUH-2300", _polaris_humidifier(), model="humidifier - PUH-2300")
    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": humidifier}]}
    )
    assert not conn.send_error.called, conn.send_error.call_args
    tasks = {t["trigger_config"]["entity_ids"][0]: t for t in _object(hass, "humidifier PUH-2300").data[CONF_TASKS].values()}
    assert tasks["sensor.humidifier_puh_2300_filter_retain"]["on_complete_action"]["target"] == {
        "entity_id": "button.humidifier_puh_2300_button_reset_filter"
    }
    assert tasks["sensor.humidifier_puh_2300_clean_retain"]["on_complete_action"]["target"] == {
        "entity_id": "button.humidifier_puh_2300_button_reset_tank"
    }


async def test_midea_auto_cloud_cartridges_and_purifier_filters(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Midea Auto Cloud: one task per water-purifier cartridge (default and
    sn8 mappings name them differently), the FC purifier's filter and the
    fresh-air unit's ventilation filter (no unit — the default mapping's
    unit key is ignored). The default mapping's 'left_salt' entity (created
    for purifiers too) and the other skipped keys stay unmatched."""
    await setup_integration(hass, global_entry)
    default_purifier = await _seed(
        hass,
        "midea_auto_cloud",
        "ed1",
        "Kitchen Purifier",
        [
            Ent("kitchen_purifier_fcb_filter_remaining_life", "life_fcb", "%", "62", original_name="FCB filter remaining life"),
            Ent("kitchen_purifier_ro_filter_remaining_life", "life_ro", "%", "80", original_name="RO filter remaining life"),
            Ent("kitchen_purifier", "left_salt", "%", "unknown"),
            Ent("kitchen_purifier_remind_maintenance_days", "remind_maintenance_days", "d", "30"),
            Ent("kitchen_purifier_out_tds", "out_tds", "mg/L", "12"),
            Ent("kitchen_purifier_maintenance_remind", "maintenance_remind", None, "off", "binary_sensor"),
        ],
        model="CWHO-R600C",
    )
    sn8_purifier = await _seed(
        hass,
        "midea_auto_cloud",
        "ed2",
        "Hall Purifier",
        [
            Ent("hall_purifier_ro_filter_cartridge_lifespan", "life_1", "%", "55", original_name="RO Filter Cartridge Lifespan"),
            Ent("hall_purifier_life2_pcb", "life_2_pcb", "%", "70", original_name="Life2_PCB"),
        ],
    )
    air_purifier = await _seed(
        hass,
        "midea_auto_cloud",
        "fc1",
        "Bedroom Air Purifier",
        [
            Ent(
                "bedroom_air_purifier_filter_life_remaining",
                "deep_filter_percent",
                "%",
                "40",
                original_name="Filter Life Remaining",
            )
        ],
    )
    fresh_air = await _seed(
        hass,
        "midea_auto_cloud",
        "ac1",
        "Fresh Air",
        [Ent("fresh_air_filter_remaining_life", "fresh_filter_time", None, "35", original_name="Filter remaining life")],
    )
    toilet = await _seed(
        hass, "midea_auto_cloud", "c21", "Toilet", [Ent("toilet_filter_use_percentage", "filter_use_per", "%", "20")]
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    assert _names(setups, default_purifier) == {
        "Replace Water Filter — FCB filter remaining life",
        "Replace Water Filter — RO filter remaining life",
    }
    assert all(t["direction"] == "percent_left" for t in setups[default_purifier]["tasks"])
    assert _names(setups, sn8_purifier) == {
        "Replace Water Filter — RO Filter Cartridge Lifespan",
        "Replace Water Filter — Life2_PCB",
    }
    (fc,) = setups[air_purifier]["tasks"]
    assert fc["task_name"] == "Replace Filter" and fc["threshold"] == 10.0
    (fa,) = setups[fresh_air]["tasks"]
    assert fa["task_name"] == "Replace Ventilation Filter" and fa["direction"] == "percent_left"
    assert toilet not in setups


async def test_gruenbeck_salt_range_and_service_countdowns(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Grünbeck softliQ: the salt range (days) → Refill Softener Salt a week
    ahead; the service countdown (shipped disabled, absent on SE devices) →
    Annual Service two weeks ahead once enabled. The local softliQ:SC
    integration reports the same pair under its parameter ids."""
    await setup_integration(hass, global_entry)
    cloud = await _seed(
        hass,
        "gruenbeck_cloud",
        "bs1",
        "BS12345678",
        [
            Ent("bs12345678_salt_range", "salt_range", "d", "40", original_name="Salt Range"),
            Ent("bs12345678_next_service", "next_service", "d", "120", original_name="Next Service"),
            Ent("bs12345678_last_service", "last_service", None, "2026-04-02", original_name="Last service"),
            Ent("bs12345678_salt_consumption", "salt_consumption", "kg", "61.5"),
            Ent("bs12345678_has_error", "has_error", None, "off", "binary_sensor"),
        ],
        model="softliQ:SD",
    )
    cloud_default = await _seed(
        hass,
        "gruenbeck_cloud",
        "bs2",
        "BS87654321",
        [
            Ent("bs87654321_salt_range", "salt_range", "d", "25", original_name="Salt Range"),
            Ent("bs87654321_next_service", "next_service", "d", disabled=True),
        ],
    )
    local = await _seed(
        hass,
        "gruenbeck_softliq_sc",
        "sc1",
        "softliQ SC",
        [
            Ent("softliq_sc_salt_range_in_days", "D_A_2_3", "d", "12", original_name="Salt range in days"),
            Ent(
                "softliq_sc_days_until_the_next_maintenance",
                "D_A_2_2",
                "d",
                "90",
                original_name="days until the next maintenance",
            ),
            Ent("softliq_sc_remaining_time_quantity_regeneration_step", "D_A_2_1", "min", "0"),
            _button("softliq_sc_manual_regeneration", "manual_regeneration", "Manual regeneration"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _tasks(setups, cloud)
    assert set(tasks) == {("Refill Softener Salt", "duration_left"), ("Annual Service", "duration_left")}
    assert tasks[("Refill Softener Salt", "duration_left")]["threshold"] == 7.0
    assert tasks[("Annual Service", "duration_left")]["threshold"] == 14.0
    assert tasks[("Annual Service", "duration_left")]["entity_ids"] == ["sensor.bs12345678_next_service"]
    assert _names(setups, cloud_default) == {"Refill Softener Salt"}

    local_tasks = _tasks(setups, local)
    assert local_tasks[("Refill Softener Salt", "duration_left")]["entity_ids"] == ["sensor.softliq_sc_salt_range_in_days"]
    assert local_tasks[("Annual Service", "duration_left")]["entity_ids"] == ["sensor.softliq_sc_days_until_the_next_maintenance"]
    assert all(t["reset"] is None for t in local_tasks.values())


# ── Garden, spa & pool ────────────────────────────────────────────────────


def _midnight_utc(days: int) -> str:
    today = dt_util.utcnow().date()
    return (datetime(today.year, today.month, today.day, tzinfo=dt_util.UTC) + timedelta(days=days)).isoformat()


async def test_gecko_spa_reminders_are_due_dates(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Gecko: each spa reminder is a timestamp (midnight UTC + the days left)
    → a due-date duty per part; rinse/clean/drain fall due on the date, the
    ozonator and the Vision cartridge two weeks ahead. The CONFIG date twins
    (same names) and the generic spa check are not duties."""
    await setup_integration(hass, global_entry)
    reminders = {
        "rinse_filter_due": ("Rinse filter", -2),
        "clean_filter_due": ("Clean filter", 20),
        "change_water_due": ("Change water", 60),
        "check_spa_due": ("Check Spa", 3),
        "change_ozonator_due": ("Change Ozonator", 10),
        "change_vision_cartridge_due": ("Change Vision cartridge", 40),
    }
    entities = [
        Ent(f"hot_tub_{key}", None, None, _midnight_utc(days), original_name=f"Hot Tub: {label} due")
        for key, (label, days) in reminders.items()
    ]
    entities += [
        Ent(f"hot_tub_{key}", None, None, _midnight_utc(days)[:10], "date", f"Hot Tub: {label} due")
        for key, (label, days) in reminders.items()
    ]
    entities.append(Ent("hot_tub_water_temperature", None, "°C", "37.5", original_name="Hot Tub: Water Temperature"))
    spa = await _seed(hass, "gecko", "spa1", "Hot Tub", entities, model="inYT 41")

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = {t["task_name"]: t for t in setups[spa]["tasks"]}
    assert set(tasks) == {"Rinse Filter", "Deep Clean Filter", "Drain and Refill", "Replace Ozonator", "Replace Vision Cartridge"}
    assert all(t["direction"] == "due_date" and t["reset"] is None for t in tasks.values())
    assert tasks["Rinse Filter"]["entity_ids"] == ["sensor.hot_tub_rinse_filter_due"]
    assert tasks["Replace Vision Cartridge"]["entity_ids"] == ["sensor.hot_tub_change_vision_cartridge_due"]
    assert {name: t["threshold"] for name, t in tasks.items()} == {
        "Rinse Filter": 0.0,
        "Deep Clean Filter": 0.0,
        "Drain and Refill": 0.0,
        "Replace Ozonator": 14.0,
        "Replace Vision Cartridge": 14.0,
    }

    now = dt_util.utcnow()
    rinse = _trigger(hass, "gecko", tasks["Rinse Filter"])
    assert rinse["type"] == "due_date" and rinse["trigger_days_before"] == 0
    assert evaluate_due_date(hass.states.get, rinse, rinse["entity_ids"], now).active is True  # overdue
    ozone = _trigger(hass, "gecko", tasks["Replace Ozonator"])
    assert evaluate_due_date(hass.states.get, ozone, ozone["entity_ids"], now).active is True  # within the lead
    clean = _trigger(hass, "gecko", tasks["Deep Clean Filter"])
    assert evaluate_due_date(hass.states.get, clean, clean["entity_ids"], now).active is False


async def test_terramow_and_imow_mower_duties(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """TerraMow computes the blade and base-station countdowns (minutes) from
    the vendor's cycles; its lifetime mowing seconds drive the undercarriage.
    STIHL iMOW: lifetime blade / operating hours → the Gardena pair."""
    await setup_integration(hass, global_entry)
    terramow = await _seed(
        hass,
        "terramow",
        "tm1",
        "TerraMow",
        [
            Ent("terramow", "lawn_mower", platform="lawn_mower", state="docked"),
            Ent("terramow_remaining_blade_time", "remaining_blade_time", "min", "3000", original_name="Remaining Blade Time"),
            Ent("terramow_remaining_base_station_time", "remaining_base_station_time", "min", "20000"),
            Ent("terramow_total_mowing_time", "total_mowing_time", "s", "360000", original_name="Total Mowing Time"),
            Ent("terramow_current_session_time", "current_session_time", "s", "600"),
        ],
        model="TerraMow V1000",
    )
    imow = await _seed(
        hass,
        "stihl_imow",
        "im1",
        "iMOW 6.0",
        [
            Ent("imow_6_0_total_blade_operating_time", "statistics_total_blade_operating_time", "h", "250"),
            Ent("imow_6_0_total_operating_time", "statistics_total_operating_time", "h", "400"),
            Ent("imow_6_0_blade_service", "status_blade_service", None, "False"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _tasks(setups, terramow)
    assert set(tasks) == {
        ("Replace Blades", "duration_left"),
        ("Clean Charging Contacts", "duration_left"),
        ("Clean Undercarriage", "usage_delta"),
    }
    assert tasks[("Replace Blades", "duration_left")]["threshold"] == 1440.0  # 24 h in minutes
    assert tasks[("Clean Charging Contacts", "duration_left")]["threshold"] == 1440.0
    uc = tasks[("Clean Undercarriage", "usage_delta")]
    assert uc["threshold"] == 25 * 3600.0 and uc["entity_ids"] == ["sensor.terramow_total_mowing_time"]
    tc = _trigger(hass, "terramow", uc)
    assert tc["type"] == "counter" and tc["trigger_delta_mode"] is True and "trigger_baseline_value" not in tc

    imow_tasks = _tasks(setups, imow)
    assert set(imow_tasks) == {("Replace Blades", "usage_delta"), ("Clean Undercarriage", "usage_delta")}
    assert imow_tasks[("Replace Blades", "usage_delta")]["entity_ids"] == ["sensor.imow_6_0_total_blade_operating_time"]
    assert imow_tasks[("Replace Blades", "usage_delta")]["threshold"] == 100.0
    assert imow_tasks[("Clean Undercarriage", "usage_delta")]["threshold"] == 25.0


async def test_pool_salt_and_uv_lamp_hours(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Hayward OmniLogic (local): the chlorinator's average salt reading →
    Refill Pool Salt below 2,700 ppm (the instant reading is not used);
    Fluidra Pool: the UV lamp's running hours → Replace UV Lamp every
    8,000 h."""
    await setup_integration(hass, global_entry)
    omni = await _seed(
        hass,
        "omnilogic_local",
        "ol1",
        "OmniLogic",
        [
            Ent("omnilogic_chlorinator_average_salt_level", None, "ppm", "2550", original_name="Chlorinator Average Salt Level"),
            Ent("omnilogic_chlorinator_instant_salt_level", None, "ppm", "2510", original_name="Chlorinator Instant Salt Level"),
        ],
    )
    fluidra = await _seed(
        hass,
        "fluidra_pool",
        "fl1",
        "Chlorinator",
        [
            Ent("chlorinator_uv_lamp_running_hours", "uv_running_hours", "h", "4321", original_name="UV Lamp Running Hours"),
            Ent("chlorinator_boost_remaining", "boost_remaining", "min", "0"),
        ],
        model="Chlorinator",
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (salt,) = setups[omni]["tasks"]
    assert salt["task_name"] == "Refill Pool Salt" and salt["direction"] == "value_below"
    assert salt["threshold"] == 2700.0
    assert salt["entity_ids"] == ["sensor.omnilogic_chlorinator_average_salt_level"]
    assert _trigger(hass, "omnilogic_local", salt)["trigger_below"] == 2700.0

    (uv,) = setups[fluidra]["tasks"]
    assert uv["task_name"] == "Replace UV Lamp" and uv["direction"] == "usage_delta"
    assert uv["threshold"] == 8000.0


# ── Cars ──────────────────────────────────────────────────────────────────


async def test_byd_odometer_and_dvla_mot_date(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """BYD: the 'total_mileage' odometer (named 'Odometer') drives the
    service / tire-rotation pair; the cumulative-mileage twin (own key, here
    enabled by the user) does not join. DVLA: the MOT expiry DATE → the
    roadworthiness test 30 days ahead, also after the user renamed the
    entity id (original name)."""
    await setup_integration(hass, global_entry)
    byd = await _seed(
        hass,
        "byd_vehicle",
        "vin1",
        "Atto 3",
        [
            Ent("atto_3_odometer", "total_mileage", "km", "12000", original_name="Odometer"),
            Ent("atto_3_odometer_v2", "total_mileage_v2", "km", disabled=True),
            Ent("atto_3_cumulative_total_mileage", "energy_cumulative_total_mileage", "km", "11990"),
            Ent("atto_3_range", "endurance_mileage", "km", "310", original_name="Range"),
        ],
    )
    soon = (dt_util.now().date() + timedelta(days=20)).isoformat()
    later = (dt_util.now().date() + timedelta(days=200)).isoformat()
    car = await _seed(
        hass,
        "dvla",
        "ab12cde",
        "AB12CDE",
        [
            Ent("dvla_ab12cde_motexpirydate", None, None, soon, original_name="MOT Expiry Date"),
            Ent("dvla_ab12cde_taxduedate", None, None, later, original_name="Tax Due Date"),
            Ent("dvla_ab12cde_motstatus", None, None, "Valid", original_name="MOT Status"),
        ],
        model="FORD",
    )
    renamed = await _seed(
        hass, "dvla", "xy34fgh", "XY34FGH", [Ent("my_van_mot", None, None, later, original_name="MOT Expiry Date")]
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    byd_tasks = _tasks(setups, byd)
    assert set(byd_tasks) == {("Annual Service", "usage_delta"), ("Tire Rotation", "usage_delta")}
    assert all(t["entity_ids"] == ["sensor.atto_3_odometer"] for t in byd_tasks.values())
    assert byd_tasks[("Annual Service", "usage_delta")]["threshold"] == 15000.0

    (mot,) = setups[car]["tasks"]
    assert mot["task_name"] == "Roadworthiness Test" and mot["direction"] == "due_date"
    assert mot["threshold"] == 30.0 and mot["entity_ids"] == ["sensor.dvla_ab12cde_motexpirydate"]
    tc = _trigger(hass, "dvla", mot)
    assert evaluate_due_date(hass.states.get, tc, tc["entity_ids"], dt_util.utcnow()).active is True
    (mot2,) = setups[renamed]["tasks"]
    assert mot2["entity_ids"] == ["sensor.my_van_mot"]
    tc2 = _trigger(hass, "dvla", mot2)
    assert evaluate_due_date(hass.states.get, tc2, tc2["entity_ids"], dt_util.utcnow()).active is False


async def test_pandora_alarm_mileage_and_maintenance_days(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Pandora (alryaz fork): 'mileage' → tire rotation, the CAN 'days to
    maintenance' → Annual Service two weeks ahead; the CAN mileage twins
    (own translation keys, suffix _mileage) stay off the mileage duty. The
    older turbulator fork (no translation keys) still matches its mileage."""
    await setup_integration(hass, global_entry)
    alarm = await _seed(
        hass,
        "pandora_cas",
        "1234567",
        "Pandora DX-91",
        [
            Ent("1234567_mileage", "mileage", "km", "45210.5", original_name="Mileage"),
            Ent("1234567_can_mileage", "can_mileage", "km", "45198", original_name="CAN Mileage"),
            Ent("1234567_can_mileage_by_battery", "can_mileage_by_battery", "km", "0"),
            Ent("1234567_days_to_maintenance", "days_to_maintenance", "d", "100", original_name="Days to Maintenance"),
            Ent("1234567_remaining_engine_runtime", "remaining_engine_runtime", "min", disabled=True),
        ],
    )
    legacy = await _seed(
        hass, "pandora_cas", "7654321", "Pandora legacy", [Ent("7654321_mileage", None, "km", "88000", original_name="mileage")]
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _tasks(setups, alarm)
    assert set(tasks) == {("Tire Rotation", "usage_delta"), ("Annual Service", "duration_left")}
    assert tasks[("Tire Rotation", "usage_delta")]["entity_ids"] == ["sensor.1234567_mileage"]
    assert tasks[("Annual Service", "duration_left")]["threshold"] == 14.0
    (tire,) = setups[legacy]["tasks"]
    assert tire["task_name"] == "Tire Rotation" and tire["entity_ids"] == ["sensor.7654321_mileage"]


async def test_vw_group_connect_and_pycupra_service_countdowns(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """VW Group Connect: the car's own service and oil-service countdowns
    (days + km) and the odometer's tire rotation; the oil-service entities
    never join the service duties, the DATE twins are not used. PyCupra
    exposes the volkswagencarnet instruments → the same duty objects."""
    await setup_integration(hass, global_entry)
    golf = await _seed(
        hass,
        "vag_connect",
        "WVWZZZ1KZ",
        "Golf",
        [
            Ent("golf_odometer", "odometer_km", "km", "64000", original_name="Odometer"),
            Ent("golf_next_service", "service_km", "km", "8200", original_name="Next Service"),
            Ent("golf_service_in", "service_due_in_days", "d", "140", original_name="Service In"),
            Ent("golf_next_oil_change", "oil_service_km", "km", "4100", original_name="Next Oil Change"),
            Ent("golf_oil_change_in", "oil_service_due_in_days", "d", "80", original_name="Oil Change In"),
            Ent("golf_service_date", "service_due_at", None, "2027-02-20", original_name="Service Date"),
        ],
    )
    cupra = await _seed(
        hass,
        "pycupra",
        "VSSZZZK1",
        "My Cupra",
        [
            Ent("my_cupra_odometer", None, "km", "21000", original_name="My Cupra Odometer"),
            Ent("my_cupra_service_inspection_days", None, "d", "300", original_name="My Cupra Service inspection days"),
            Ent("my_cupra_service_inspection_distance", None, "km", "9000", original_name="My Cupra Service inspection distance"),
            Ent("my_cupra_oil_inspection_days", None, "d", "120", original_name="My Cupra Oil inspection days"),
            Ent("my_cupra_oil_inspection_distance", None, "km", "6000", original_name="My Cupra Oil inspection distance"),
            Ent("my_cupra_battery_level", None, "%", "80", original_name="My Cupra Battery level"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _tasks(setups, golf)
    assert set(tasks) == {
        ("Tire Rotation", "usage_delta"),
        ("Annual Service", "duration_left"),
        ("Annual Service", "value_below"),
        ("Oil Service", "duration_left"),
        ("Oil Service", "value_below"),
    }
    assert tasks[("Annual Service", "duration_left")]["entity_ids"] == ["sensor.golf_service_in"]
    assert tasks[("Annual Service", "value_below")]["entity_ids"] == ["sensor.golf_next_service"]
    assert tasks[("Oil Service", "value_below")]["entity_ids"] == ["sensor.golf_next_oil_change"]
    assert tasks[("Annual Service", "duration_left")]["threshold"] == 14.0
    assert tasks[("Oil Service", "value_below")]["threshold"] == 1000.0

    cupra_tasks = _tasks(setups, cupra)
    assert set(cupra_tasks) == set(tasks)
    assert cupra_tasks[("Oil Service", "duration_left")]["entity_ids"] == ["sensor.my_cupra_oil_inspection_days"]
    assert [s for s in SIGNATURES["pycupra"].tasks] == [s for s in SIGNATURES["volkswagencarnet"].tasks]
    assert all(a is b for a, b in zip(SIGNATURES["pycupra"].tasks, SIGNATURES["volkswagencarnet"].tasks, strict=True))


# ── Wallboxes & pets ──────────────────────────────────────────────────────


async def test_wattpilot_lifetime_energy_and_neakasa_litter_box(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Fronius Wattpilot: 'Totally Charged' (eto, Wh) → cable inspection every
    5,000 kWh in the sensor's Wh; the per-connection energy is not used.
    Neakasa: the litter level → Refill Litter, the bin-full binary (no device
    class) → a latch on 'on'; the ENUM twins are not duties."""
    await setup_integration(hass, global_entry)
    charger = await _seed(
        hass,
        "wattpilot",
        "wp1",
        "Wattpilot",
        [
            Ent("wattpilot_totally_charged", None, "Wh", "1534000", original_name="Wattpilot Totally Charged"),
            Ent("wattpilot_connection_charged", None, "Wh", "4100", original_name="Wattpilot Connection Charged"),
        ],
    )
    litter = await _seed(
        hass,
        "neakasa",
        "nk1",
        "Neakasa M1",
        [
            Ent("neakasa_m1_cat_litter_level", "sand_percent", "%", "64", original_name="Cat litter level"),
            Ent("neakasa_m1_garbage_can_full", "bin_full", None, "off", "binary_sensor", "Garbage can full"),
            Ent("neakasa_m1_bin_state", "bin_state", None, "normal", original_name="Bin state"),
            Ent("neakasa_m1_cat_litter_state", "sand_state", None, "sufficient", original_name="Cat litter state"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (cable,) = setups[charger]["tasks"]
    assert cable["task_name"] == "Inspect Cable and Plug" and cable["direction"] == "usage_delta"
    assert cable["entity_ids"] == ["sensor.wattpilot_totally_charged"]
    assert cable["threshold"] == 5_000_000.0  # 5,000 kWh in Wh

    tasks = _tasks(setups, litter)
    assert set(tasks) == {("Refill Litter", "percent_left"), ("Empty Waste Drawer", "event_present")}
    drawer = tasks[("Empty Waste Drawer", "event_present")]
    assert drawer["entity_ids"] == ["binary_sensor.neakasa_m1_garbage_can_full"]
    tc = _trigger(hass, "neakasa", drawer)
    assert tc["type"] == "state_change" and tc["trigger_to_state"] == "on"
    assert tc["auto_complete_on_recovery"] is True
