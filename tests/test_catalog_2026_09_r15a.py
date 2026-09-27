"""Catalog round 15, part A (vacuums, printers, pets, kitchen — HA core gaps).

Pins the core 2026.9 additions: Tapo robot-vacuum consumable countdowns with
their reset buttons, Xiaomi purifier / Air Fresh filters (the T2017's two
filters split per entity, each with its own reset), the SmartThings Clean
Station dust bag, Samsung SyncThru toners/drums, the Dremel lifetime usage
counter, LG ThinQ's dishwasher rinse-aid and fridge fresh-air-filter latches
and the Whirlpool bulk-detergent tank.

Entities are seeded the way the real integrations register them: the
translation_key the integration sets, the entity-id suffix its (translated)
name produces, the unit it reports, and — for buttons — whether the
integration ships them disabled.
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


def _trigger(hass: HomeAssistant, domain: str, task: dict) -> dict:
    sig = next(
        s for s in SIGNATURES[domain].tasks if s.task_name == task["catalog_task_name"] and s.direction == task["direction"]
    )
    return build_setup_trigger(sig, hass, task["entity_ids"])


def _tapo_entities(prefix: str, *, sensor_unit: str = "h") -> list[Ent]:
    """A Tapo RV robot as core tplink registers it: tk = the python-kasa
    feature id, consumable sensors and reset buttons disabled by default."""
    out = [Ent(prefix, platform="vacuum", state="docked")]
    for part, name in (
        ("main_brush", "Main brush"),
        ("side_brush", "Side brush"),
        ("filter", "Filter"),
        ("sensor", "Sensor"),
        ("charging_contacts", "Charging contacts"),
    ):
        remaining = "4" if part in ("sensor", "charging_contacts") else "150"
        if part == "sensor" and sensor_unit == "min":
            remaining = "240"
        out.append(Ent(f"{prefix}_{part}_remaining", f"{part}_remaining", sensor_unit if part == "sensor" else "h", remaining))
        out.append(Ent(f"{prefix}_{part}_used", f"{part}_used", "h", "20", disabled=True))
        out.append(
            Ent(
                f"{prefix}_reset_{part}_consumable",
                f"{part}_reset",
                platform="button",
                original_name=f"Reset {name.lower()} consumable",
                disabled=True,
            )
        )
    return out


async def test_tapo_vacuum_consumables_with_resets(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Tapo robots get the five consumable countdowns next to the engine-runtime
    cleaning duties; each duty names its (integration-disabled) reset button,
    the short 30-hour cleaning items warn at 6 h — unit-converted — and the
    disabled '*_used' twins add nothing. A Tapo plug has no duties."""
    await setup_integration(hass, global_entry)
    robot = await _seed(hass, "tplink", "rv30", "Tapo RV30", _tapo_entities("tapo_rv30"))
    minutes = await _seed(hass, "tplink", "rv20", "Tapo RV20", _tapo_entities("tapo_rv20", sensor_unit="min"))
    plug = await _seed(hass, "tplink", "p110", "Tapo P110", [Ent("tapo_p110_current_consumption", "current_consumption", "W")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, robot)
    assert set(tasks) == {
        "Filter Cleaning",
        "Clean Main Brush",
        "Replace Main Brush",
        "Replace Side Brush",
        "Replace Filter",
        "Clean Sensors",
        "Clean Charging Contacts",
    }
    assert tasks["Replace Main Brush"]["entity_ids"] == ["sensor.tapo_rv30_main_brush_remaining"]
    assert tasks["Replace Filter"]["direction"] == "duration_left" and tasks["Replace Filter"]["threshold"] == 24.0
    assert tasks["Clean Sensors"]["threshold"] == 6.0
    assert tasks["Clean Charging Contacts"]["threshold"] == 6.0
    for name, part in (
        ("Replace Main Brush", "main_brush"),
        ("Replace Side Brush", "side_brush"),
        ("Replace Filter", "filter"),
        ("Clean Sensors", "sensor"),
        ("Clean Charging Contacts", "charging_contacts"),
    ):
        reset = tasks[name]["reset"]
        assert reset is not None, name
        assert reset["entity_id"] == f"button.tapo_rv30_reset_{part}_consumable"
        assert reset["disabled"] is True
    # The engine-runtime duties watch the vacuum, not a counter — no reset.
    assert tasks["Filter Cleaning"]["reset"] is None

    trig = _trigger(hass, "tplink", tasks["Clean Charging Contacts"])
    assert trig["type"] == "threshold" and trig["trigger_below"] == 6.0 and trig["auto_complete_on_recovery"] is True

    # A sensor shown in minutes: the 6 h floor converts to 360 min.
    assert _by_name(setups, minutes)["Clean Sensors"]["threshold"] == 360.0
    assert plug not in setups


async def test_tapo_adopt_wires_and_enables_the_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Adopting a Tapo robot wires each consumable duty to its reset button and
    enables the button the integration shipped disabled."""
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, global_entry)
    robot = await _seed(hass, "tplink", "rv30", "Tapo RV30", _tapo_entities("tapo_rv30"))
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": robot}]})
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Tapo RV30"
    )
    tasks = {t["name"]: t for t in obj.data[CONF_TASKS].values()}
    contacts = next(t for n, t in tasks.items() if "Contacts" in n)
    assert contacts["on_complete_action"]["service"] == "button.press"
    assert contacts["on_complete_action"]["target"] == {"entity_id": "button.tapo_rv30_reset_charging_contacts_consumable"}
    assert er.async_get(hass).async_get("button.tapo_rv30_reset_charging_contacts_consumable").disabled_by is None
    wired = {t["on_complete_action"]["target"]["entity_id"] for t in tasks.values() if "on_complete_action" in t}
    assert len(wired) == 5


async def test_xiaomi_purifier_and_air_fresh_filters(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Xiaomi Miio: a purifier's filter % (its days/hours twins stay unmatched,
    no reset button — only a service); the Air Fresh A1's single dust filter
    keeps the plain name with its reset; the T2017's dust and upper filters
    are separate tasks, each wired to its own reset button."""
    await setup_integration(hass, global_entry)
    purifier = await _seed(
        hass,
        "xiaomi_miio",
        "zhimi4",
        "Air Purifier 4",
        [
            Ent("air_purifier_4_filter_life_remaining", "filter_life_remaining", "%", "8"),
            Ent("air_purifier_4_filter_lifetime_remaining", "filter_left_time", "d", "20"),
            Ent("air_purifier_4_filter_use", "filter_hours_used", "h", "3000"),
        ],
    )
    a1 = await _seed(
        hass,
        "xiaomi_miio",
        "a1",
        "Air Fresh A1",
        [
            Ent("air_fresh_a1_dust_filter_life_remaining", "dust_filter_life_remaining", "%"),
            Ent("air_fresh_a1_dust_filter_lifetime_remaining_days", "dust_filter_life_remaining_days", "d"),
            Ent("air_fresh_a1_reset_dust_filter", "reset_dust_filter", platform="button", original_name="Reset dust filter"),
        ],
    )
    t2017 = await _seed(
        hass,
        "xiaomi_miio",
        "t2017",
        "Air Fresh T2017",
        [
            Ent("air_fresh_t2017_dust_filter_life_remaining", "dust_filter_life_remaining", "%", original_name="Dust filter life remaining"),
            Ent("air_fresh_t2017_upper_filter_life_remaining", "upper_filter_life_remaining", "%", original_name="Upper filter life remaining"),
            Ent("air_fresh_t2017_upper_filter_lifetime_remaining_days", "upper_filter_life_remaining_days", "d"),
            Ent("air_fresh_t2017_reset_dust_filter", "reset_dust_filter", platform="button", original_name="Reset dust filter"),
            Ent("air_fresh_t2017_reset_upper_filter", "reset_upper_filter", platform="button", original_name="Reset upper filter"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (pf,) = setups[purifier]["tasks"]
    assert pf["task_name"] == "Replace Filter" and pf["direction"] == "percent_left"
    assert pf["entity_ids"] == ["sensor.air_purifier_4_filter_life_remaining"]
    assert pf["reset"] is None

    (a1_task,) = setups[a1]["tasks"]
    assert a1_task["task_name"] == "Replace Filter"
    assert a1_task["entity_ids"] == ["sensor.air_fresh_a1_dust_filter_life_remaining"]
    assert a1_task["reset"]["entity_id"] == "button.air_fresh_a1_reset_dust_filter"
    assert a1_task["reset"]["disabled"] is False

    t_tasks = _by_name(setups, t2017)
    assert set(t_tasks) == {"Replace Filter — Dust filter life remaining", "Replace Filter — Upper filter life remaining"}
    dust = t_tasks["Replace Filter — Dust filter life remaining"]
    upper = t_tasks["Replace Filter — Upper filter life remaining"]
    assert dust["entity_ids"] == ["sensor.air_fresh_t2017_dust_filter_life_remaining"]
    assert dust["reset"]["entity_id"] == "button.air_fresh_t2017_reset_dust_filter"
    assert upper["entity_ids"] == ["sensor.air_fresh_t2017_upper_filter_life_remaining"]
    assert upper["reset"]["entity_id"] == "button.air_fresh_t2017_reset_upper_filter"


async def test_smartthings_clean_station_dust_bag_latch(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """SmartThings Jet Bot: the station's plain 'Dust bag full' binary latches
    'Replace Dust Bag'; the stick cleaner's problem-class dust bag binary is
    left to problem-sensor adoption; the HEPA reset button has no duty."""
    await setup_integration(hass, global_entry)
    jetbot = await _seed(
        hass,
        "smartthings",
        "jet1",
        "Jet Bot AI+",
        [
            Ent("jet_bot_ai", platform="vacuum", state="docked"),
            Ent("jet_bot_ai_dust_bag_full", "robot_cleaner_dust_bag", state="off", platform="binary_sensor"),
            Ent("jet_bot_ai_reset_hepa_filter", "reset_hepa_filter", platform="button"),
        ],
    )
    stick = await _seed(
        hass,
        "smartthings",
        "stick1",
        "Bespoke Jet",
        [Ent("bespoke_jet_dust_bag_full", "stick_cleaner_dust_bag", state="on", platform="binary_sensor")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, jetbot)
    assert set(tasks) == {"Filter Cleaning", "Clean Main Brush", "Replace Dust Bag"}
    bag = tasks["Replace Dust Bag"]
    assert bag["direction"] == "event_present" and bag["entity_ids"] == ["binary_sensor.jet_bot_ai_dust_bag_full"]
    trig = _trigger(hass, "smartthings", bag)
    assert trig["type"] == "state_change" and trig["trigger_to_state"] == "on"
    assert trig["auto_complete_on_recovery"] is True
    assert stick not in setups


async def test_syncthru_toners_and_drums(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Samsung SyncThru: a colour laser gets one task per toner and per drum;
    a mono laser keeps the plain names; tray/alert status sensors are ignored."""
    await setup_integration(hass, global_entry)
    colour = await _seed(
        hass,
        "syncthru",
        "c480",
        "SL-C480W",
        [
            Ent("sl_c480w_black_toner_level", "toner_black", "%", "55", original_name="Black toner level"),
            Ent("sl_c480w_cyan_toner_level", "toner_cyan", "%", "8", original_name="Cyan toner level"),
            Ent("sl_c480w_magenta_toner_level", "toner_magenta", "%", "60", original_name="Magenta toner level"),
            Ent("sl_c480w_yellow_toner_level", "toner_yellow", "%", "70", original_name="Yellow toner level"),
            Ent("sl_c480w_black_drum_level", "drum_black", "%", "80", original_name="Black drum level"),
            Ent("sl_c480w_cyan_drum_level", "drum_cyan", "%", "80", original_name="Cyan drum level"),
            Ent("sl_c480w_active_alerts", "active_alerts", "alerts", "1"),
            Ent("sl_c480w_input_tray_1", "tray", None, "Ready"),
        ],
    )
    mono = await _seed(
        hass,
        "syncthru",
        "m2020",
        "SL-M2020W",
        [
            Ent("sl_m2020w_black_toner_level", "toner_black", "%", original_name="Black toner level"),
            Ent("sl_m2020w_black_drum_level", "drum_black", "%", original_name="Black drum level"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, colour)
    assert set(tasks) == {
        "Replace Toner — Black toner level",
        "Replace Toner — Cyan toner level",
        "Replace Toner — Magenta toner level",
        "Replace Toner — Yellow toner level",
        "Replace Drum Unit — Black drum level",
        "Replace Drum Unit — Cyan drum level",
    }
    cyan = tasks["Replace Toner — Cyan toner level"]
    assert cyan["entity_ids"] == ["sensor.sl_c480w_cyan_toner_level"]
    assert cyan["direction"] == "percent_left" and cyan["threshold"] == 10.0
    assert all(t["reset"] is None for t in tasks.values())

    assert set(_by_name(setups, mono)) == {"Replace Toner", "Replace Drum Unit"}


async def test_dremel_lifetime_usage_hours(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Dremel 3D printers: the printer's lifetime usage counter (hours, no
    reset) drives rail lubrication every 200 h from the adoption point."""
    await setup_integration(hass, global_entry)
    printer = await _seed(
        hass,
        "dremel_3d_printer",
        "3d45",
        "DREMEL 3D45",
        [
            Ent("dremel_3d45_hours_used", "hours_used", "h", "312"),
            Ent("dremel_3d45_job_phase", "job_phase", None, "idle"),
            Ent("dremel_3d45_running", None, state="off", platform="binary_sensor"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (lube,) = setups[printer]["tasks"]
    assert lube["task_name"] == "Lubricate Rails and Rods"
    assert lube["direction"] == "usage_delta" and lube["threshold"] == 200.0
    trig = _trigger(hass, "dremel_3d_printer", lube)
    assert trig["type"] == "counter" and trig["trigger_delta_mode"] is True
    assert "trigger_baseline_value" not in trig


async def test_lg_thinq_rinse_refill_and_fresh_air_filter(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """LG ThinQ (core): the dishwasher's rinse-refill binary (no problem class)
    latches 'Refill Rinse Aid' while the preference binaries and the rinse
    SETTING stay unmatched; the fridge's read-only fresh-air-filter ENUM latches
    'Replace Filter' on 'replace' and its percent twin (same tk) is kept out by
    the unit gate — no second filter task."""
    await setup_integration(hass, global_entry)
    dishwasher = await _seed(
        hass,
        "lg_thinq",
        "dw1",
        "Dishwasher",
        [
            Ent("dishwasher_rinse_refill_needed", "rinse_refill", state="off", platform="binary_sensor"),
            Ent("dishwasher_machine_clean_reminder", "machine_clean_reminder", state="on", platform="binary_sensor"),
            Ent("dishwasher_clean_indicator_light", "clean_light_reminder", state="on", platform="binary_sensor"),
            Ent("dishwasher_rinse_aid_dispenser_level", "rinse_level", None, "rinselevel_2"),
        ],
    )
    fridge = await _seed(
        hass,
        "lg_thinq",
        "rf2",
        "Fridge",
        [
            Ent("fridge_fresh_air_filter", "fresh_air_filter", None, "auto"),
            Ent("fridge_fresh_air_filter_2", "fresh_air_filter", "%", "35"),
            Ent("fridge_water_filter", "water_filter_1_remain_percent", "%", "60"),
            Ent("fridge_water_filter_used", "used_time", "m", "4"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (rinse,) = setups[dishwasher]["tasks"]
    assert rinse["task_name"] == "Refill Rinse Aid" and rinse["direction"] == "event_present"
    assert rinse["entity_ids"] == ["binary_sensor.dishwasher_rinse_refill_needed"]
    assert _trigger(hass, "lg_thinq", rinse)["trigger_to_state"] == "on"

    tasks = _by_name(setups, fridge)
    assert set(tasks) == {"Replace Filter", "Replace Water Filter"}
    fresh = tasks["Replace Filter"]
    assert fresh["direction"] == "event_present" and fresh["entity_ids"] == ["sensor.fridge_fresh_air_filter"]
    trig = _trigger(hass, "lg_thinq", fresh)
    assert trig["type"] == "state_change" and trig["trigger_to_state"] == "replace"
    assert tasks["Replace Water Filter"]["entity_ids"] == ["sensor.fridge_water_filter"]


def test_lg_rinse_refill_latch_is_one_object_for_both_lg_integrations() -> None:
    core = next(s for s in SIGNATURES["lg_thinq"].tasks if s.keys == ("rinse_refill",))
    hacs = next(s for s in SIGNATURES["smartthinq_sensors"].tasks if s.keys == ("rinse_refill",))
    assert core is hacs


async def test_whirlpool_bulk_detergent_tank(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Whirlpool washers with a bulk dispenser: the 'Detergent level' ENUM
    latches 'Refill Detergent' on 'empty', next to the engine tub-clean duty."""
    await setup_integration(hass, global_entry)
    washer = await _seed(
        hass,
        "whirlpool",
        "ww2",
        "Whirlpool Washer",
        [
            Ent("whirlpool_washer_state", "washer_state", None, "standby"),
            Ent("whirlpool_washer_detergent_level", "whirlpool_tank", None, "25"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks = _by_name(setups, washer)
    assert set(tasks) == {"Clean Tub", "Refill Detergent"}
    det = tasks["Refill Detergent"]
    assert det["direction"] == "event_present" and det["entity_ids"] == ["sensor.whirlpool_washer_detergent_level"]
    assert _trigger(hass, "whirlpool", det)["trigger_to_state"] == "empty"


def test_round15a_entries_cite_core_2026_9() -> None:
    for domain in ("tplink", "xiaomi_miio", "smartthings", "syncthru", "dremel_3d_printer", "lg_thinq", "whirlpool", "litterrobot"):
        catalog = SIGNATURES[domain]
        assert "2026-09-27" in catalog.verified and "2026.9" in catalog.verified, domain
        assert catalog.source, domain
    resets = {pair for s in SIGNATURES["tplink"].tasks for pair in s.resets}
    assert resets == {
        ("main_brush_remaining", "main_brush_reset"),
        ("side_brush_remaining", "side_brush_reset"),
        ("filter_remaining", "filter_reset"),
        ("sensor_remaining", "sensor_reset"),
        ("charging_contacts_remaining", "charging_contacts_reset"),
    }
