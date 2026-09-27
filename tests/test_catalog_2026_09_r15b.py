"""Catalog round 15, part B (air, heating & water treatment, garden, transports).

Pins the round-15 additions verified against Home Assistant core 2026.9:
Matter HEPA / activated-carbon filter conditions and robot vacuums, the ZHA
STARKVIND filter run time, the HomeKit Device filter life level, the Hot
Spring 10-day water-test countdown, DROP RO cartridges and its salt sensor,
and the Victron GX generator service countdown.

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
    uid: str | None = None


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
            ent.uid or f"{uid}_{ent.object_id}",
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


async def test_matter_filter_conditions_and_robot_vacuum(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Matter: HEPA and activated-carbon conditions (% remaining) are two
    independent duties with a reset each. A dual-filter device carries two
    buttons under one translation_key, so none is wired there (the lookup
    cannot tell them apart); a single-filter hood gets its reset. A Matter
    robot vacuum gets the engine-runtime cleaning duties; the lock keeps its
    own."""
    await setup_integration(hass, global_entry)
    purifier = await _seed(
        hass,
        "matter",
        "ap1",
        "Mock Air Purifier",
        [
            Ent("mock_air_purifier_hepa_filter_condition", "hepa_filter_condition", "%", "100"),
            Ent("mock_air_purifier_activated_carbon_filter_condition", "activated_carbon_filter_condition", "%", "8"),
            Ent(
                "mock_air_purifier_reset_filter_condition",
                "reset_filter_condition",
                None,
                "unknown",
                "button",
                "Reset filter condition",
                "ap1-HepaFilterMonitoringResetButton-113-65529",
            ),
            Ent(
                "mock_air_purifier_reset_filter_condition_2",
                "reset_filter_condition",
                None,
                "unknown",
                "button",
                "Reset filter condition",
                "ap1-ActivatedCarbonFilterMonitoringResetButton-114-65529",
            ),
        ],
    )
    hepa_only = await _seed(
        hass,
        "matter",
        "hood1",
        "Extractor Hood",
        [
            Ent("extractor_hood_hepa_filter_condition", "hepa_filter_condition", "%", "60"),
            Ent(
                "extractor_hood_reset_filter_condition",
                "reset_filter_condition",
                None,
                "unknown",
                "button",
                "Reset filter condition",
                "hood1-HepaFilterMonitoringResetButton-113-65529",
            ),
        ],
    )
    vacuum = await _seed(hass, "matter", "rvc1", "Matter Robot", [Ent("matter_robot", None, None, "docked", "vacuum")])
    lock = await _seed(hass, "matter", "lock1", "Back Door", [Ent("back_door", None, None, "locked", "lock")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert setups[purifier]["integration_name"] == "Matter"

    tasks = _by_name(setups, purifier)
    assert set(tasks) == {"Replace Filter", "Replace Activated Carbon"}
    assert tasks["Replace Filter"]["entity_ids"] == ["sensor.mock_air_purifier_hepa_filter_condition"]
    assert tasks["Replace Activated Carbon"]["entity_ids"] == ["sensor.mock_air_purifier_activated_carbon_filter_condition"]
    for task in tasks.values():
        assert task["direction"] == "percent_left" and task["threshold"] == 10.0
        assert task["reset"] is None, "two buttons share tk reset_filter_condition — never guess which one"
    tc = _trigger(hass, "matter", tasks["Replace Activated Carbon"])
    assert tc["type"] == "threshold" and tc["trigger_below"] == 10.0 and tc["auto_complete_on_recovery"] is True

    (hood_task,) = setups[hepa_only]["tasks"]
    assert hood_task["task_name"] == "Replace Filter"
    # One filter, one reset button: wired (the ambiguity guard only bites
    # when several buttons share the key).
    assert hood_task["reset"] == {
        "entity_id": "button.extractor_hood_reset_filter_condition",
        "name": "Reset filter condition",
        "disabled": False,
    }

    vac_tasks = _by_name(setups, vacuum)
    assert set(vac_tasks) == {"Filter Cleaning", "Clean Main Brush"}
    assert all(t["direction"] == "runtime_hours" for t in vac_tasks.values())
    assert _trigger(hass, "matter", vac_tasks["Filter Cleaning"])["trigger_on_states"] == ["cleaning"]

    (lock_task,) = setups[lock]["tasks"]
    assert lock_task["task_name"] == "Lubricate Cylinder"


async def test_zha_starkvind_filter_run_time(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """ZHA STARKVIND: the filter run time counts UP in minutes since the
    filter reset → usage_above at IKEA's 259,200-minute default; the problem
    binary and the lifetime config number are not catalog duties."""
    await setup_integration(hass, global_entry)
    purifier = await _seed(
        hass,
        "zha",
        "sv1",
        "STARKVIND",
        [
            Ent("starkvind_filter_run_time", "filter_run_time", "min", "120000"),
            Ent("starkvind_device_run_time", "device_run_time", "min", "400000"),
            Ent("starkvind_replace_filter", "replace_filter", None, "off", "binary_sensor"),
            Ent("starkvind_filter_life_time", "filter_life_time", "min", "259200", "number"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert setups[purifier]["integration_name"] == "Zigbee (ZHA)"
    (task,) = setups[purifier]["tasks"]
    assert task["task_name"] == "Replace Filter" and task["direction"] == "usage_above"
    assert task["entity_ids"] == ["sensor.starkvind_filter_run_time"]
    assert task["threshold"] == 4320 * 60.0  # native minutes
    assert task["reset"] is None
    tc = _trigger(hass, "zha", task)
    assert tc["type"] == "counter" and tc["trigger_baseline_value"] == 0
    assert tc["auto_complete_on_recovery"] is True


async def test_homekit_device_filter_life_level(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """HomeKit Device: the Filter Life Level characteristic sensor has no
    translation_key — '<accessory> Filter lifetime' → suffix match."""
    await setup_integration(hass, global_entry)
    purifier = await _seed(
        hass,
        "homekit_controller",
        "hk1",
        "Bedroom Purifier",
        [
            Ent("bedroom_purifier_filter_lifetime", None, "%", "35"),
            Ent("bedroom_purifier_pm2_5_density", None, "µg/m³", "4"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert setups[purifier]["integration_name"] == "HomeKit Device"
    (task,) = setups[purifier]["tasks"]
    assert task["task_name"] == "Replace Filter" and task["direction"] == "percent_left"
    assert task["entity_ids"] == ["sensor.bedroom_purifier_filter_lifetime"]


async def test_hotspring_ten_day_water_test(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Hot Spring: the 10-day timer counts DOWN to the salt water test (the
    docs' example fires below 1 day) next to the cartridge age counter."""
    await setup_integration(hass, global_entry)
    spa = await _seed(
        hass,
        "hotspring",
        "hs1",
        "Hot Spring Highlife",
        [
            Ent("hot_spring_highlife_salt_cartridge_age", "water_care_120_day_timer", "d", "40"),
            Ent("hot_spring_highlife_salt_10_day_check_timer", "water_care_10_day_timer", "d", "4"),
            Ent("hot_spring_highlife_salt_value", "water_care_salt_value", None, "5"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    tasks = _by_name(setups, spa)
    assert set(tasks) == {"Replace Salt Cartridge", "Water Test"}
    test = tasks["Water Test"]
    assert test["direction"] == "duration_left"
    assert test["entity_ids"] == ["sensor.hot_spring_highlife_salt_10_day_check_timer"]
    assert test["threshold"] == 1.0  # 24 h in a days entity
    tc = _trigger(hass, "hotspring", test)
    assert tc["type"] == "threshold" and tc["trigger_below"] == 1.0
    assert tc["auto_complete_on_recovery"] is True
    assert tasks["Replace Salt Cartridge"]["entity_ids"] == ["sensor.hot_spring_highlife_salt_cartridge_age"]


async def test_drop_cartridges_and_salt_sensor(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """DROP: the RO filter's three cartridges are replaced one at a time
    (one proposal each); the salt sensor's plain 'Salt low' binary latches
    the refill; the softener's regeneration capacity is not a duty."""
    await setup_integration(hass, global_entry)
    ro = await _seed(
        hass,
        "drop_connect",
        "ro1",
        "DROP RO Filter",
        [
            Ent("drop_ro_filter_cartridge_1_life_remaining", "cart1", "%", "80", original_name="Cartridge 1 life remaining"),
            Ent("drop_ro_filter_cartridge_2_life_remaining", "cart2", "%", "55", original_name="Cartridge 2 life remaining"),
            Ent("drop_ro_filter_cartridge_3_life_remaining", "cart3", "%", "9", original_name="Cartridge 3 life remaining"),
            Ent("drop_ro_filter_inlet_tds", "inlet_tds", "ppm", "210"),
            Ent("drop_ro_filter_leak_detected", "leak", None, "off", "binary_sensor"),
        ],
    )
    salt = await _seed(
        hass,
        "drop_connect",
        "salt1",
        "DROP Salt Sensor",
        [Ent("drop_salt_sensor_salt_low", "salt", None, "off", "binary_sensor")],
    )
    softener = await _seed(
        hass,
        "drop_connect",
        "soft1",
        "DROP Softener",
        [
            Ent("drop_softener_capacity_remaining", "capacity_remaining", "gal", "300"),
            Ent("drop_softener_reserve_capacity_in_use", "reserve_in_use", None, "off", "binary_sensor"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    ro_tasks = _by_name(setups, ro)
    assert set(ro_tasks) == {
        "Replace Water Filter — Cartridge 1 life remaining",
        "Replace Water Filter — Cartridge 2 life remaining",
        "Replace Water Filter — Cartridge 3 life remaining",
    }
    cart3 = ro_tasks["Replace Water Filter — Cartridge 3 life remaining"]
    assert cart3["entity_ids"] == ["sensor.drop_ro_filter_cartridge_3_life_remaining"]
    assert cart3["direction"] == "percent_left" and cart3["threshold"] == 10.0

    (refill,) = setups[salt]["tasks"]
    assert refill["task_name"] == "Refill Softener Salt" and refill["direction"] == "event_present"
    latch = _trigger(hass, "drop_connect", refill)
    assert latch["type"] == "state_change" and latch["trigger_to_state"] == "on"
    assert latch["entity_ids"] == ["binary_sensor.drop_salt_sensor_salt_low"]
    assert latch["auto_complete_on_recovery"] is True

    assert softener not in setups


async def test_victron_gx_generator_service_countdown(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Victron GX: the generator's service counter is run-hours LEFT until
    the configured service (Venus OS: interval − runtime since the reset);
    the lifetime runtime counters are not duties of their own."""
    await setup_integration(hass, global_entry)
    genset = await _seed(
        hass,
        "victron_gx",
        "gen0",
        "Generator",
        [
            Ent("generator_service_counter", "generator_service_counter", "h", "120"),
            Ent("generator_total_runtime", "generator_total_runtime", "h", "860"),
            Ent("generator_today_runtime", "generator_today_runtime", "h", "1.5"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    (task,) = setups[genset]["tasks"]
    assert task["task_name"] == "Oil Service" and task["direction"] == "duration_left"
    assert task["entity_ids"] == ["sensor.generator_service_counter"]
    assert task["threshold"] == 24.0
    tc = _trigger(hass, "victron_gx", task)
    assert tc["type"] == "threshold" and tc["trigger_below"] == 24.0
    assert tc["auto_complete_on_recovery"] is True
