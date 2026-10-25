"""Catalog round 17, part B (sweep 2026-10-25): HACS integrations and Proxmox.

Pins the round-17 HACS additions, each verified against the integration's
current default branch: lock lubrication for Homematic(IP) Local (gated to
its door locks, so thermostat button locks stay out), eufy Security (safes
excluded), Nuki NG (Openers excluded) and Hubitat; storage cleanup on Proxmox
VE storages (HACS and core keys, guests and nodes left out); cable and plug
inspection on evcc loadpoints and OCPP charge points; sprinkler heads by
watering time on B-hyve zones and OpenSprinkler stations; the generator
service counter of Victron MQTT; the Govee Life purifier filter.

Entities are seeded the way the real integrations register them: the
translation_key where the integration sets one, else the entity id and the
original (registry) name its naming code produces; device models where a
duty is model-gated.
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
from custom_components.maintenance_supporter.helpers.signatures import _shared

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
    platform domain, original (registry) name, integration-disabled."""

    object_id: str
    tkey: str | None = None
    unit: str | None = None
    state: str = "40"
    platform: str = "sensor"
    original_name: str | None = None
    disabled: bool = False


async def _seed(
    hass: HomeAssistant, domain: str, uid: str, device_name: str, entities: list[Ent], *, model: str | None = None
) -> str:
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


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


def _lock(object_id: str, tkey: str | None = None, *, disabled: bool = False) -> Ent:
    return Ent(object_id, tkey, None, "locked", "lock", disabled=disabled)


# ── Locks ────────────────────────────────────────────────────────────────────


async def test_homematicip_local_door_locks_only(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """aiohomematic exposes the keypad locks of thermostats as lock entities
    too: the duty is gated to the door-lock models. The DLD's own button lock
    ships disabled and stays out of the count."""
    await setup_integration(hass, global_entry)
    dld = await _seed(
        hass,
        "homematicip_local",
        "dld1",
        "Front Door",
        [_lock("front_door"), _lock("front_door_button_lock", "button_lock", disabled=True)],
        model="HmIP-DLD-S",
    )
    keymatic = await _seed(hass, "homematicip_local", "key1", "Cellar Door", [_lock("cellar_door")], model="HM-Sec-Key-S")
    trv = await _seed(
        hass, "homematicip_local", "trv1", "Bathroom TRV", [_lock("bathroom_trv_button_lock", "button_lock")], model="HmIP-eTRV-2"
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[dld]["tasks"]
    assert task["task_name"] == "Lubricate Cylinder" and task["entity_ids"] == ["lock.front_door"]
    tc = _trigger(hass, "homematicip_local", task)
    assert tc["type"] == "state_change" and tc["trigger_to_state"] == "locked" and tc["trigger_target_changes"] == 2000
    assert [t["entity_ids"] for t in setups[keymatic]["tasks"]] == [["lock.cellar_door"]]
    assert trv not in setups


async def test_eufy_nuki_ng_and_hubitat_locks(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """eufy smart safes and Nuki Openers report 'locked' too and are kept out
    by their device model; a Hubitat hub's lock gets the duty, its other
    devices do not."""
    await setup_integration(hass, global_entry)
    eufy_lock = await _seed(hass, "eufy_security", "t8520", "Front Door Lock", [_lock("front_door_lock")], model="T8520")
    eufy_safe = await _seed(hass, "eufy_security", "t7400", "Smart Safe", [_lock("smart_safe")], model="T7400")
    nuki = await _seed(hass, "nuki_ng", "n1", "Apartment", [_lock("apartment_lock")], model="Nuki Smart Lock")
    opener = await _seed(hass, "nuki_ng", "o1", "Building Door", [_lock("building_door_lock")], model="Nuki Opener")
    hub_lock = await _seed(hass, "hubitat", "h1", "Back Door", [_lock("back_door")], model="Generic Z-Wave Lock")
    hub_switch = await _seed(
        hass, "hubitat", "h2", "Porch Light", [Ent("porch_light", None, None, "on", "switch")], model="Generic Z-Wave Switch"
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for device_id, entity_id in ((eufy_lock, "lock.front_door_lock"), (nuki, "lock.apartment_lock"), (hub_lock, "lock.back_door")):
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Lubricate Cylinder" and task["entity_ids"] == [entity_id]
    assert eufy_safe not in setups
    assert opener not in setups
    assert hub_switch not in setups
    assert SIGNATURES["nuki_ng"].tasks[0] is SIGNATURES["nuki_web"].tasks[0] is _shared.LOCK_CYLINDER_CYCLES_NO_OPENER
    assert SIGNATURES["hubitat"].tasks == (_shared.LOCK_CYLINDER_CYCLES,)


# ── Proxmox VE ───────────────────────────────────────────────────────────────


async def test_proxmoxve_storage_cleanup_on_storages_only(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The HACS integration puts 'disk_used_perc' on nodes, guests and
    storages; core puts 'storage_used_percentage' on its storages. Only the
    storage devices get the cleanup duty above 85 %."""
    await setup_integration(hass, global_entry)
    local_lvm = await _seed(
        hass, "proxmoxve", "st1", "local-lvm", [Ent("pve_local_lvm_disk_used_perc", "disk_used_perc", "%", "62")], model="Storage"
    )
    nfs = await _seed(
        hass, "proxmoxve", "st2", "backup-nfs", [Ent("pve_backup_nfs_disk_used_perc", "disk_used_perc", "%", "88")], model="Shared storage"
    )
    core_storage = await _seed(
        hass,
        "proxmoxve",
        "st3",
        "Storage tank",
        [Ent("storage_tank_storage_used_percentage", "storage_used_percentage", "%", "40")],
        model="Storage",
    )
    node = await _seed(
        hass, "proxmoxve", "n1", "Node pve", [Ent("node_pve_disk_used_perc", "disk_used_perc", "%", "35")], model="AMD Ryzen 7 5800X"
    )
    guest = await _seed(
        hass, "proxmoxve", "q1", "VM 101 web", [Ent("vm_101_web_disk_used_perc", "disk_used_perc", "%", "91")], model="QEMU"
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for device_id, entity_id in (
        (local_lvm, "sensor.pve_local_lvm_disk_used_perc"),
        (nfs, "sensor.pve_backup_nfs_disk_used_perc"),
        (core_storage, "sensor.storage_tank_storage_used_percentage"),
    ):
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Storage Cleanup" and task["direction"] == "alert_above"
        assert task["entity_ids"] == [entity_id]
        assert task["threshold"] == 85.0
    tc = _trigger(hass, "proxmoxve", setups[nfs]["tasks"][0])
    assert tc["type"] == "threshold" and tc["trigger_above"] == 85.0 and tc["auto_complete_on_recovery"] is True
    assert node not in setups
    assert guest not in setups


# ── Chargers ─────────────────────────────────────────────────────────────────


async def test_evcc_and_ocpp_lifetime_meters(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """evcc's per-loadpoint 'chargetotalimport' and OCPP's Energy Active Import
    Register (per charge point and per connector) are lifetime meters: cable
    and plug inspection every 5000 kWh. The session counters match nothing."""
    await setup_integration(hass, global_entry)
    loadpoint = await _seed(
        hass,
        "evcc_intg",
        "lp1",
        "Garage",
        [
            Ent("evcc_garage_charge_total_import", "chargetotalimport", "kWh", "4120.5"),
            Ent("evcc_garage_charged_energy", "chargedenergy", "kWh", "11.2"),
        ],
        model="Loadpoint Garage [1]",
    )
    charge_point = await _seed(
        hass,
        "ocpp",
        "cp1",
        "charger",
        [
            Ent("charger_energy_active_import_register", None, "kWh", "9312.0", original_name="Energy Active Import Register"),
            Ent("charger_energy_session", None, "kWh", "7.5", original_name="Energy Session"),
        ],
    )
    connector = await _seed(
        hass,
        "ocpp",
        "cp1c2",
        "charger Connector 2",
        [
            Ent(
                "charger_connector_2_energy_active_import_register",
                None,
                "kWh",
                "120.0",
                original_name="Energy Active Import Register",
            )
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for domain, device_id, entity_id in (
        ("evcc_intg", loadpoint, "sensor.evcc_garage_charge_total_import"),
        ("ocpp", charge_point, "sensor.charger_energy_active_import_register"),
        ("ocpp", connector, "sensor.charger_connector_2_energy_active_import_register"),
    ):
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Inspect Cable and Plug" and task["direction"] == "usage_delta"
        assert task["entity_ids"] == [entity_id]
        assert task["threshold"] == 5000.0
        tc = _trigger(hass, domain, task)
        assert tc["type"] == "counter" and tc["trigger_delta_mode"] is True and tc["trigger_target_value"] == 5000.0


# ── Irrigation ───────────────────────────────────────────────────────────────


async def test_bhyve_zones_and_opensprinkler_stations_by_watering_time(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A B-hyve timer's zones are valves ('open' while watering), an
    OpenSprinkler's stations 'Station Running' binaries; every zone or
    station gets its own 30 h runtime duty, a single-zone timer the plain
    name. Program switches and rain delay match nothing."""
    await setup_integration(hass, global_entry)
    timer = await _seed(
        hass,
        "bhyve",
        "t4",
        "Backyard Timer",
        [
            Ent("backyard_timer_front_lawn", "zone", None, "closed", "valve", original_name="Front Lawn"),
            Ent("backyard_timer_flower_beds", "zone", None, "closed", "valve", original_name="Flower Beds"),
            Ent("backyard_timer_rain_delay", None, None, "off", "switch", original_name="Rain Delay"),
        ],
    )
    faucet = await _seed(
        hass, "bhyve", "f1", "Faucet Timer", [Ent("faucet_timer_zone", "zone", None, "closed", "valve", original_name="Zone")]
    )
    controller = await _seed(
        hass,
        "opensprinkler",
        "os1",
        "OpenSprinkler",
        [
            Ent("lawn_station_running", None, None, "off", "binary_sensor", original_name="Lawn Station Running"),
            Ent("hedge_station_running", None, None, "off", "binary_sensor", original_name="Hedge Station Running"),
            Ent("lawn_station_enabled", None, None, "on", "switch", original_name="Lawn Station Enabled"),
            Ent("opensprinkler_rain_delay_active", None, None, "off", "binary_sensor", original_name="Rain Delay Active"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    zones = _by_name(setups, timer)
    assert set(zones) == {"Clean Sprinkler Heads — Front Lawn", "Clean Sprinkler Heads — Flower Beds"}
    front = zones["Clean Sprinkler Heads — Front Lawn"]
    assert front["entity_ids"] == ["valve.backyard_timer_front_lawn"] and front["threshold"] == 30.0
    tc = _trigger(hass, "bhyve", front)
    assert tc["type"] == "runtime" and tc["trigger_on_states"] == ["open"] and tc["trigger_runtime_hours"] == 30.0
    (single,) = setups[faucet]["tasks"]
    assert single["task_name"] == "Clean Sprinkler Heads"
    stations = _by_name(setups, controller)
    assert set(stations) == {"Clean Sprinkler Heads — Lawn Station Running", "Clean Sprinkler Heads — Hedge Station Running"}
    tc = _trigger(hass, "opensprinkler", stations["Clean Sprinkler Heads — Lawn Station Running"])
    assert tc["trigger_on_states"] == ["on"] and tc["entity_ids"] == ["binary_sensor.lawn_station_running"]


# ── Generator, purifier ──────────────────────────────────────────────────────


async def test_victron_mqtt_generator_service_and_goveelife_filter(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Victron MQTT carries the victron_gx service counter (run-hours left) —
    the same duty object; Govee Life names its purifier sensors after the raw
    capability, so only the original name 'filterLifeTime' identifies the
    filter."""
    await setup_integration(hass, global_entry)
    genset = await _seed(
        hass,
        "victron_mqtt",
        "gen0",
        "Generator",
        [
            Ent("victron_generator_service_counter", "generator_service_counter", "h", "130"),
            Ent("victron_generator_total_runtime", "generator_total_runtime", "h", "870"),
        ],
    )
    purifier = await _seed(
        hass,
        "goveelife",
        "h7126",
        "Living Room Purifier",
        [
            Ent("living_room_purifier", None, None, "good", original_name="airQuality"),
            Ent("living_room_purifier_2", None, "%", "46", original_name="filterLifeTime"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (oil,) = setups[genset]["tasks"]
    assert oil["task_name"] == "Oil Service" and oil["direction"] == "duration_left"
    assert oil["entity_ids"] == ["sensor.victron_generator_service_counter"] and oil["threshold"] == 24.0
    assert SIGNATURES["victron_mqtt"].tasks[0] is SIGNATURES["victron_gx"].tasks[0] is _shared.GENERATOR_SERVICE_COUNTER
    (filt,) = setups[purifier]["tasks"]
    assert filt["task_name"] == "Replace Filter" and filt["entity_ids"] == ["sensor.living_room_purifier_2"]


def test_round17b_entries_cite_their_branch_heads() -> None:
    for domain in (
        "homematicip_local",
        "eufy_security",
        "nuki_ng",
        "hubitat",
        "proxmoxve",
        "evcc_intg",
        "ocpp",
        "bhyve",
        "opensprinkler",
        "victron_mqtt",
        "goveelife",
    ):
        catalog = SIGNATURES[domain]
        assert catalog.verified.startswith("2026-10-25 @ "), domain
        assert catalog.source, domain
    # The Modbus integration is left out on purpose (an overdue uint32
    # counter would read as a huge value and complete the task).
    assert "victron" not in SIGNATURES
