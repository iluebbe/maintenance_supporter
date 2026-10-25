"""Catalog round 17, part A (sweep 2026-10-25): the fixes and core 2026.11.

Dreame Vacuum 2.0 renamed its secondary-filter counter to ``tank_filter_left``
— the old duty no longer matched and the renamed sensor fell into the main
filter's ``_filter_left`` suffix; the entry now carries both keys, treats
Dreame's translation keys as authoritative and adds the nine station and
robot consumables 2.0 brought, each with its reset button. Core 2026.11
(read in core dev): six more Ecovacs lifespans, the SwitchBot Air Purifier's
filter hours with their reset, the VeSync filter reset, and the new HP
Printer and Škoda integrations.

Entities are seeded the way the real integrations register them: the
translation_key where the integration sets one, the registry's original
name where a per-entity duty takes its label from it.
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
from custom_components.maintenance_supporter.helpers.signatures import _shared

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


def btn(object_id: str, tkey: str | None = None, original_name: str | None = None) -> Ent:
    return Ent(object_id, tkey, platform="button", state="unknown", original_name=original_name)


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


def _reset(task: dict) -> str | None:
    return task["reset"]["entity_id"] if task["reset"] else None


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


# Dreame 2.0 station / robot consumables: (sensor key, button key, duty).
DREAME_NEW = (
    ("squeegee_left", "reset_squeegee", "Replace Squeegee"),
    ("onboard_dirty_water_tank_left", "reset_onboard_dirty_water_tank", "Clean Dirty Water Tank"),
    ("dirty_water_channel_dirty_left", "reset_dirty_water_channel", "Clean Dirty Water Channel"),
    ("deodorizer_left", "reset_deodorizer", "Replace Odor Eliminator"),
    ("wheel_dirty_left", "reset_wheel", "Clean Wheels"),
    ("scale_inhibitor_left", "reset_scale_inhibitor", "Replace Scale Inhibitor"),
    ("fluffing_roller_dirty_left", "reset_fluffing_roller", "Clean Fluffing Roller"),
    ("roller_mop_filter_dirty_left", "reset_roller_mop_filter", "Clean Roller Mop Filter"),
    ("water_outlet_filter_dirty_left", "reset_water_outlet_filter", "Clean Water Outlet Filter"),
)


# ── Dreame Vacuum 2.0 ────────────────────────────────────────────────────────


async def test_dreame_tank_filter_is_the_secondary_filter_not_a_second_main_filter(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """2.0's tank_filter_left backs "Replace Secondary Filter" (no button: the
    reset action has no button entity) and no longer joins "Replace Filter"
    through the '_filter_left' suffix; a 1.x vacuum's secondary_filter_left
    still matches. The hours twins and the dust-bag drying countdown match
    nothing."""
    await setup_integration(hass, global_entry)
    v2 = await _seed(
        hass,
        "dreame_vacuum",
        "x40",
        "X40 Ultra",
        [
            Ent("x40_ultra_filter_left", "filter_left", "%", "80"),
            Ent("x40_ultra_filter_time_left", "filter_time_left", "h", "120"),
            btn("x40_ultra_reset_filter", "reset_filter"),
            Ent("x40_ultra_tank_filter_left", "tank_filter_left", "%", "30"),
            Ent("x40_ultra_tank_filter_time_left", "tank_filter_time_left", "h", "9"),
            Ent("x40_ultra_dust_bag_drying_left", "dust_bag_drying_left", "min", "12"),
        ],
    )
    v1 = await _seed(
        hass,
        "dreame_vacuum",
        "l20",
        "L20 Ultra",
        [Ent("l20_ultra_secondary_filter_left", "secondary_filter_left", "%", "55")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, v2)
    assert set(tasks) == {"Replace Filter", "Replace Secondary Filter"}
    assert tasks["Replace Filter"]["entity_ids"] == ["sensor.x40_ultra_filter_left"]
    assert _reset(tasks["Replace Filter"]) == "button.x40_ultra_reset_filter"
    assert tasks["Replace Secondary Filter"]["entity_ids"] == ["sensor.x40_ultra_tank_filter_left"]
    assert tasks["Replace Secondary Filter"]["reset"] is None
    (old,) = setups[v1]["tasks"]
    assert old["task_name"] == "Replace Secondary Filter"
    assert old["entity_ids"] == ["sensor.l20_ultra_secondary_filter_left"]
    assert SIGNATURES["dreame_vacuum"].translation_keys_authoritative is True


async def test_dreame_station_consumables_with_their_resets(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The nine consumables 2.0 added: each its own percent duty, completing
    it presses the matching reset button on the same vacuum."""
    await setup_integration(hass, global_entry)
    entities: list[Ent] = []
    for key, button, _name in DREAME_NEW:
        entities.append(Ent(f"x50_{key}", key, "%", "70"))
        entities.append(btn(f"x50_{button}", button))
    vac = await _seed(hass, "dreame_vacuum", "x50", "X50 Master", entities)

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, vac)
    assert set(tasks) == {name for _k, _b, name in DREAME_NEW}
    for key, button, name in DREAME_NEW:
        assert tasks[name]["direction"] == "percent_left", name
        assert tasks[name]["entity_ids"] == [f"sensor.x50_{key}"], name
        assert _reset(tasks[name]) == f"button.x50_{button}", name


async def test_dreame_adopt_wires_the_squeegee_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, global_entry)
    vac = await _seed(
        hass,
        "dreame_vacuum",
        "h15",
        "H15 Pro",
        [Ent("h15_pro_squeegee_left", "squeegee_left", "%", "64"), btn("h15_pro_reset_squeegee", "reset_squeegee")],
    )
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": vac}]})
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "H15 Pro"
    )
    (task,) = obj.data[CONF_TASKS].values()
    assert task["name"] == "Replace Squeegee"
    assert task["trigger_config"]["type"] == "threshold"
    assert task["trigger_config"]["entity_ids"] == ["sensor.h15_pro_squeegee_left"]
    assert task["on_complete_action"]["service"] == "button.press"
    assert task["on_complete_action"]["target"] == {"entity_id": "button.h15_pro_reset_squeegee"}


# ── Ecovacs 2026.11 ──────────────────────────────────────────────────────────


async def test_ecovacs_2026_11_lifespans(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The dust bin and dust container filters join the per-entity filter
    duty, the heavy-duty solution and the mop washing tray split their duties
    per part, the dust bucket and the strainer get their own — every one with
    its reset_lifespan_* button."""
    await setup_integration(hass, global_entry)
    parts = (
        ("filter", "Filter lifespan"),
        ("dust_case_heap", "Dust bin filter lifespan"),
        ("dust_container_filter", "Dust container filter lifespan"),
        ("cleaning_solution", "Cleaning solution lifespan"),
        ("heavy_duty_cleaning_solution", "Heavy-duty cleaning solution lifespan"),
        ("water_sink", "Water sink lifespan"),
        ("mop_washing_tray", "Mop washing tray lifespan"),
        ("dust_bucket", "Dust bucket lifespan"),
        ("strainer", "Strainer lifespan"),
    )
    entities: list[Ent] = []
    for part, name in parts:
        entities.append(Ent(f"x9_{part}_lifespan", f"lifespan_{part}", "%", "60", original_name=name))
        entities.append(btn(f"x9_reset_{part}_lifespan", f"reset_lifespan_{part}"))
    robot = await _seed(hass, "ecovacs", "x9", "DEEBOT X9 PRO OMNI", entities)
    older = await _seed(
        hass,
        "ecovacs",
        "t20",
        "DEEBOT T20",
        [Ent("t20_cleaning_solution_lifespan", "lifespan_cleaning_solution", "%", "50", original_name="Cleaning solution lifespan")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, robot)
    expected = {
        "Replace Filter — Filter lifespan": "filter",
        "Replace Filter — Dust bin filter lifespan": "dust_case_heap",
        "Replace Filter — Dust container filter lifespan": "dust_container_filter",
        "Refill Detergent — Cleaning solution lifespan": "cleaning_solution",
        "Refill Detergent — Heavy-duty cleaning solution lifespan": "heavy_duty_cleaning_solution",
        "Clean Mop Tray — Water sink lifespan": "water_sink",
        "Clean Mop Tray — Mop washing tray lifespan": "mop_washing_tray",
        "Empty and Wash the Dust Bin": "dust_bucket",
        "Replace Dock Strainer": "strainer",
    }
    assert set(tasks) == set(expected)
    for name, part in expected.items():
        assert tasks[name]["entity_ids"] == [f"sensor.x9_{part}_lifespan"], name
        assert _reset(tasks[name]) == f"button.x9_reset_{part}_lifespan", name
    # A robot with a single solution keeps the plain duty name.
    (plain,) = setups[older]["tasks"]
    assert plain["task_name"] == "Refill Detergent"


# ── SwitchBot Air Purifier, VeSync filter reset ──────────────────────────────


async def test_switchbot_purifier_filter_hours_and_lock(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The purifier's filter working time counts UP since its reset: a
    usage_above duty at 2160 h with the reset button wired; a SwitchBot lock
    keeps its cycle-counted lubrication."""
    await setup_integration(hass, global_entry)
    purifier = await _seed(
        hass,
        "switchbot",
        "ap1",
        "Air Purifier Table",
        [
            Ent("air_purifier_table_filter_usage", "filter_usage", "h", "310"),
            Ent("air_purifier_table_pm2_5", None, "µg/m³", "8", original_name="PM2.5"),
            btn("air_purifier_table_reset_filter_usage", "reset_filter_usage"),
        ],
        model="Air Purifier Table",
    )
    lock = await _seed(
        hass, "switchbot", "lk1", "Lock Pro", [Ent("lock_pro", None, None, "unlocked", "lock")], model="Lock Pro"
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (filt,) = setups[purifier]["tasks"]
    assert filt["task_name"] == "Replace Filter" and filt["direction"] == "usage_above"
    assert filt["entity_ids"] == ["sensor.air_purifier_table_filter_usage"]
    assert filt["threshold"] == 2160.0
    assert _reset(filt) == "button.air_purifier_table_reset_filter_usage"
    tc = _trigger(hass, "switchbot", filt)
    assert tc["type"] == "counter" and tc["trigger_baseline_value"] == 0 and tc["trigger_target_value"] == 2160.0
    (cyl,) = setups[lock]["tasks"]
    assert cyl["task_name"] == "Lubricate Cylinder" and cyl["entity_ids"] == ["lock.lock_pro"]


async def test_vesync_filter_reset_when_the_purifier_has_one(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    core600 = await _seed(
        hass,
        "vesync",
        "c600",
        "Core 600S",
        [Ent("core_600s_filter_life", "filter_life", "%", "71"), btn("core_600s_reset_filter", "reset_filter")],
    )
    older = await _seed(hass, "vesync", "c200", "Core 200S", [Ent("core_200s_filter_life", "filter_life", "%", "40")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (with_button,) = setups[core600]["tasks"]
    assert with_button["task_name"] == "Replace Filter"
    assert _reset(with_button) == "button.core_600s_reset_filter"
    (without,) = setups[older]["tasks"]
    assert without["reset"] is None
    assert SIGNATURES["vesync"].tasks == (_shared.FILTER_LIFE_RESET_FILTER,)
    assert _shared.FILTER_LIFE_RESET_FILTER in SIGNATURES["tuya"].tasks


# ── HP Printer, Škoda (new in core 2026.11) ──────────────────────────────────


async def test_hp_printer_one_task_per_cartridge(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A colour laser's four toners get a duty each; the pages-remaining
    twins and the page counters match nothing; a mono printer's single
    toner keeps the plain name."""
    await setup_integration(hass, global_entry)
    colour = await _seed(
        hass,
        "hp_printer",
        "m479",
        "HP Color LaserJet MFP M479fdw",
        [
            Ent("hp_color_laserjet_black_level", "black_level", "%", "64", original_name="Black level"),
            Ent("hp_color_laserjet_cyan_level", "cyan_level", "%", "12", original_name="Cyan level"),
            Ent("hp_color_laserjet_magenta_level", "magenta_level", "%", "38", original_name="Magenta level"),
            Ent("hp_color_laserjet_yellow_level", "yellow_level", "%", "51", original_name="Yellow level"),
            Ent("hp_color_laserjet_black_pages_remaining", "black_pages_remaining", None, "2100"),
            Ent("hp_color_laserjet_total_pages", "total_pages", None, "18311"),
        ],
        model="HP Color LaserJet MFP M479fdw",
    )
    mono = await _seed(
        hass,
        "hp_printer",
        "m209",
        "HP LaserJet M209dw",
        [
            Ent("hp_laserjet_black_level", "black_level", "%", "80", original_name="Black level"),
            Ent("hp_laserjet_black_pages_remaining", "black_pages_remaining", None, "900"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, colour)
    assert set(tasks) == {f"Replace Ink or Toner — {c} level" for c in ("Black", "Cyan", "Magenta", "Yellow")}
    assert tasks["Replace Ink or Toner — Cyan level"]["entity_ids"] == ["sensor.hp_color_laserjet_cyan_level"]
    (single,) = setups[mono]["tasks"]
    assert single["task_name"] == "Replace Ink or Toner"
    assert single["entity_ids"] == ["sensor.hp_laserjet_black_level"]


async def test_skoda_mileage_drives_the_shared_odometer_duties(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    car = await _seed(
        hass,
        "skoda",
        "tmb1",
        "Enyaq",
        [
            Ent("enyaq_mileage", "mileage", "km", "23450"),
            Ent("enyaq_battery_percentage", "battery_percentage", "%", "76"),
        ],
        model="Enyaq",
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, car)
    assert set(tasks) == {"Annual Service", "Tire Rotation"}
    assert tasks["Annual Service"]["threshold"] == 15000.0
    assert tasks["Tire Rotation"]["threshold"] == 10000.0
    assert tasks["Tire Rotation"]["entity_ids"] == ["sensor.enyaq_mileage"]
    assert SIGNATURES["skoda"].tasks == (_shared.ANNUAL_SERVICE_MILEAGE, _shared.TIRE_ROTATION_MILEAGE)


def test_round17a_entries_cite_the_sweep() -> None:
    for domain in ("hp_printer", "skoda"):
        assert SIGNATURES[domain].verified.startswith("2026-10-25 @ home-assistant/core dev"), domain
    for domain in ("dreame_vacuum", "vesync", "switchbot"):
        assert "2026-10-25" in SIGNATURES[domain].verified, domain
    assert "2026.11" in SIGNATURES["ecovacs"].source
