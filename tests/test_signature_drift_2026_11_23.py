"""Signature drift of 2026-11-23 (#289): what the re-dive changed in the catalog.

Four of the six reported integrations only moved or reshaped their source
(Generac, Blueair, MCZ Maestro, Stiebel Eltron ISG): their catalog keys still
match, and only the probes and the audit trail moved. Two changed what the
catalog has to match:

* Uconnect gave every sensor a translation_key and translated its names. Two
  keys differ from the English name the entity id used to come from
  ('days_to_service' for "Days till service needed", 'oil_level' for "Oil
  Life"), so a new install on a translated system was no longer recognised.
* The HACS Proxmox integration left the domain it shared with core and is
  'proxmoxve_custom' now; its entities move to that platform on the update.

Entities are seeded the way the integrations register them after the change:
translated entity ids with the translation_key, and the old ids that the
registry keeps on an existing install.
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
    """One seeded sensor: FULL object id, translation_key, unit, state."""

    object_id: str
    tkey: str | None = None
    unit: str | None = None
    state: str = "40"


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
            "sensor",
            domain,
            f"{uid}_{ent.object_id}",
            config_entry=source,
            device_id=device.id,
            translation_key=ent.tkey,
            suggested_object_id=ent.object_id,
        )
        assert entry.entity_id == f"sensor.{ent.object_id}"
        attrs = {"unit_of_measurement": ent.unit} if ent.unit is not None else {}
        hass.states.async_set(entry.entity_id, ent.state, attrs)
    return device.id


def _by(setup: dict) -> dict[tuple[str, str], dict]:
    return {(t["task_name"], t["direction"]): t for t in setup["tasks"]}


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


# ── Uconnect ─────────────────────────────────────────────────────────────────


async def test_uconnect_is_recognised_by_its_translation_keys(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A new install on a French system: the entity ids come from the French
    names, so only the translation_key says which sensor is which."""
    await setup_integration(hass, global_entry)
    jeep = await _seed(
        hass,
        "uconnect",
        "vin1",
        "Jeep Avenger",
        [
            Ent("jeep_avenger_kilometrage", "odometer", "km", "12000"),
            Ent("jeep_avenger_distance_avant_entretien", "distance_to_service", "km", "9000"),
            Ent("jeep_avenger_jours_avant_entretien", "days_to_service", "d", "200"),
            Ent("jeep_avenger_duree_de_vie_de_l_huile", "oil_level", "%", "55"),
            # Not a duty: the fuel level is a percentage too.
            Ent("jeep_avenger_carburant_restant", "fuel_amount", "%", "80"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by(setups[jeep])
    assert set(tasks) == {
        ("Tire Rotation", "usage_delta"),
        ("Annual Service", "duration_left"),
        ("Annual Service", "value_below"),
        ("Oil Service", "percent_left"),
    }
    assert tasks[("Tire Rotation", "usage_delta")]["entity_ids"] == ["sensor.jeep_avenger_kilometrage"]
    assert tasks[("Annual Service", "duration_left")]["entity_ids"] == ["sensor.jeep_avenger_jours_avant_entretien"]
    assert tasks[("Annual Service", "duration_left")]["threshold"] == 14.0  # 336 h in days
    assert tasks[("Annual Service", "value_below")]["entity_ids"] == ["sensor.jeep_avenger_distance_avant_entretien"]
    assert tasks[("Oil Service", "percent_left")]["entity_ids"] == ["sensor.jeep_avenger_duree_de_vie_de_l_huile"]
    oil = _trigger(hass, "uconnect", tasks[("Oil Service", "percent_left")])
    assert oil["type"] == "threshold" and oil["trigger_below"] == 10.0  # household default


async def test_uconnect_updated_install_matches_each_sensor_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """After the update the registry keeps the old English ids and the
    entities gain the translation_key: both catalog spellings point at the
    same sensor, which must be watched once."""
    await setup_integration(hass, global_entry)
    jeep = await _seed(
        hass,
        "uconnect",
        "vin2",
        "Jeep Wrangler",
        [
            Ent("jeep_wrangler_odometer", "odometer", "mi", "41000"),
            Ent("jeep_wrangler_distance_to_service", "distance_to_service", "mi", "2500"),
            Ent("jeep_wrangler_days_till_service_needed", "days_to_service", "d", "60"),
            Ent("jeep_wrangler_oil_life", "oil_level", "%", "55"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by(setups[jeep])
    assert len(setups[jeep]["tasks"]) == 4
    assert tasks[("Annual Service", "duration_left")]["entity_ids"] == ["sensor.jeep_wrangler_days_till_service_needed"]
    assert tasks[("Oil Service", "percent_left")]["entity_ids"] == ["sensor.jeep_wrangler_oil_life"]


def test_uconnect_keeps_the_ids_of_older_versions() -> None:
    """Up to v1.0.3 there was no translation_key: the id suffix from the
    English name is the only handle, and it stays a key."""
    keys = {key for sig in SIGNATURES["uconnect"].tasks for key in sig.keys}
    assert {"days_till_service_needed", "oil_life"} <= keys  # older versions
    assert {"days_to_service", "oil_level", "odometer", "distance_to_service"} <= keys  # translation keys


# ── Proxmox VE (HACS, under its own domain) ──────────────────────────────────


async def test_proxmoxve_custom_storage_cleanup_on_storages_only(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The HACS integration is 'proxmoxve_custom' since 6.0.0. Its
    'disk_used_perc' sits on nodes, guests and storages; only the storage
    devices get the cleanup duty above 85 %."""
    await setup_integration(hass, global_entry)
    local_lvm = await _seed(
        hass,
        "proxmoxve_custom",
        "st1",
        "local-lvm",
        [Ent("pve_local_lvm_disk_used_perc", "disk_used_perc", "%", "62")],
        model="Storage",
    )
    nfs = await _seed(
        hass,
        "proxmoxve_custom",
        "st2",
        "backup-nfs",
        [Ent("pve_backup_nfs_disk_used_perc", "disk_used_perc", "%", "88")],
        model="Shared storage",
    )
    node = await _seed(
        hass,
        "proxmoxve_custom",
        "n1",
        "Node pve",
        [Ent("node_pve_disk_used_perc", "disk_used_perc", "%", "35")],
        model="AMD Ryzen 7 5800X",
    )
    guest = await _seed(
        hass, "proxmoxve_custom", "q1", "VM 101 web", [Ent("vm_101_web_disk_used_perc", "disk_used_perc", "%", "91")], model="QEMU"
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for device_id, entity_id in (
        (local_lvm, "sensor.pve_local_lvm_disk_used_perc"),
        (nfs, "sensor.pve_backup_nfs_disk_used_perc"),
    ):
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Storage Cleanup" and task["direction"] == "alert_above"
        assert task["entity_ids"] == [entity_id]
        assert task["threshold"] == 85.0
    tc = _trigger(hass, "proxmoxve_custom", setups[nfs]["tasks"][0])
    assert tc["type"] == "threshold" and tc["trigger_above"] == 85.0 and tc["auto_complete_on_recovery"] is True
    assert node not in setups
    assert guest not in setups


def test_proxmoxve_keeps_core_and_the_old_hacs_key() -> None:
    """Core stays on 'proxmoxve', and so does a HACS install that has not
    taken the 6.0 update yet: the old entry keeps both keys."""
    (old,) = SIGNATURES["proxmoxve"].tasks
    (new,) = SIGNATURES["proxmoxve_custom"].tasks
    assert old.keys == ("disk_used_perc", "storage_used_percentage")
    assert new.keys == ("disk_used_perc",)
    assert old.models == new.models == ("storage",) and old.delta_units == new.delta_units == 85


# ── Moved sources, same keys ─────────────────────────────────────────────────


async def test_maestro_stove_service_on_a_translated_install(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Maestro names its sensors through the translation_key now, so a German
    system gets a German entity id; the key still finds the countdown."""
    await setup_integration(hass, global_entry)
    stove = await _seed(hass, "maestro_mcz", "s1", "Stube", [Ent("stube_nachste_wartung", "next_maintenance", "h", "120")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[stove]["tasks"]
    assert task["task_name"] == "Stove Service" and task["direction"] == "duration_left"
    assert task["entity_ids"] == ["sensor.stube_nachste_wartung"] and task["threshold"] == 24.0


async def test_blueair_consumables_by_translation_key(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    purifier = await _seed(
        hass,
        "ha_blueair",
        "b1",
        "Wohnzimmer",
        [
            Ent("wohnzimmer_filterlebensdauer", "filter_life", "%", "40"),
            Ent("wohnzimmer_dochtlebensdauer", "wick_life", "%", "70"),
            Ent("wohnzimmer_wasserstand", "water_level", "%", "50"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = {t["task_name"]: t for t in setups[purifier]["tasks"]}
    assert set(tasks) == {"Replace Filter", "Replace Wick"}
    assert tasks["Replace Filter"]["entity_ids"] == ["sensor.wohnzimmer_filterlebensdauer"]
    assert tasks["Replace Wick"]["entity_ids"] == ["sensor.wohnzimmer_dochtlebensdauer"]


def test_redived_entries_bear_the_date_of_the_dive() -> None:
    for domain in ("generac", "ha_blueair", "maestro_mcz", "proxmoxve", "proxmoxve_custom", "stiebel_eltron_isg", "uconnect"):
        catalog = SIGNATURES[domain]
        assert catalog.verified.startswith("2026-11-23 @ "), domain
        assert catalog.source and catalog.tasks, domain
