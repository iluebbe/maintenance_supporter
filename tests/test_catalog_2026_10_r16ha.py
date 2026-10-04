"""Catalog round 16, HACS wave part A (air treatment, heating, home IT).

Pins the round-16 HACS additions, each verified against the integration's
current default branch: smoke/CO alarms that report their end of life (Nest
Protect's replace-by DATE → due_date, Kidde HomeSafe's days/weeks countdown),
heating-loop pressure (Ariston, HeishaMon Aquarea, Bosch HomeCom and Nefit
Easy — the latter two share the bosch duty through one _shared constant), the
MCZ pellet-stove service countdown, the AC filter-cleaning runtime for
Panasonic Comfort Cloud, Mitsubishi Heavy WF-RAC, Toshiba, Fujitsu Airstage,
AUX Cloud and Daikin Onecta (gated to AC adapters so Altherma heat pumps stay
out), and the decentral ventilation filters of Ambientika, Siku/Blauberg,
EcoVent and Waterkotte BasicVent (with the Ambientika and Siku resets wired).

Entities are seeded the way the real integrations register them: the
translation_key where the integration sets one, else the entity id and the
original (registry) name its naming code produces; disabled-by-default
sensors are seeded disabled, device models where a duty is model-gated.
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

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.dates import due_instant
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
    build_setup_trigger,
    discover_integration_setups,
)
from custom_components.maintenance_supporter.helpers.signatures import _shared, air

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration

AC_STATES = ["auto", "cool", "dry", "fan_only", "heat"]
HEAT_COOL_STATES = ["cool", "dry", "fan_only", "heat", "heat_cool"]


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


def _object_named(hass: HomeAssistant, name: str) -> MockConfigEntry:
    return next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == name
    )


# ── Safety detectors: end of life ────────────────────────────────────────────


async def test_nest_protect_replace_by_date(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Nest Protect reports the alarm's replace-by DATE (a naive datetime under
    the DATE class renders as an ISO datetime): a due_date duty a month ahead.
    The last self-test dates are last-done dates and propose nothing; a Nest
    Temperature Sensor of the same integration has no replace-by key."""
    await setup_integration(hass, global_entry)
    replace_by = (dt_util.utcnow() + timedelta(days=900)).replace(tzinfo=None, microsecond=0).isoformat()
    protect = await _seed(
        hass,
        "nest_protect",
        "topaz1",
        "Nest Protect (Hallway)",
        [
            Ent("nest_protect_hallway_replace_by", "replace_by_date_utc_secs", None, replace_by),
            Ent("nest_protect_hallway_last_audio_self_test", "last_audio_self_test_end_utc_secs", None, "2026-09-01T03:12:00"),
            Ent("nest_protect_hallway_last_manual_test", "latest_manual_test_end_utc_secs", None, "2026-08-14T18:40:00"),
            Ent("nest_protect_hallway_battery_level", "battery_level", "%", "92"),
            Ent("nest_protect_hallway_smoke_status", "smoke_status", None, "off", "binary_sensor"),
            Ent("nest_protect_hallway_smoke_test", "component_smoke_test_passed", None, "off", "binary_sensor"),
        ],
    )
    thermo = await _seed(
        hass,
        "nest_protect",
        "kryptonite1",
        "Nest Temperature Sensor (Bedroom)",
        [
            Ent("nest_temperature_sensor_bedroom_battery_level", "battery_level", "%", "80"),
            Ent("nest_temperature_sensor_bedroom_current_temperature", "current_temperature", "°C", "20.5"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[protect]["tasks"]
    assert task["task_name"] == "Replace Detectors" and task["direction"] == "due_date"
    assert task["entity_ids"] == ["sensor.nest_protect_hallway_replace_by"]
    assert task["threshold"] == 30.0
    assert task["reset"] is None
    tc = _trigger(hass, "nest_protect", task)
    assert tc["type"] == "due_date" and tc["trigger_days_before"] == 30
    assert tc["auto_complete_on_recovery"] is True
    # The DATE sensor's ISO datetime is a due instant the trigger can read.
    assert due_instant(hass.states.get("sensor.nest_protect_hallway_replace_by").state) is not None
    assert thermo not in setups


async def test_kidde_life_countdown_in_days_and_weeks(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Kidde HomeSafe names the 'life' sensor by board model: DETECT alarms
    count DAYS to replacement, older models WEEKS. One end-of-life duty, the
    30-day lead converted into the entity's unit."""
    await setup_integration(hass, global_entry)
    detect = await _seed(
        hass,
        "kidde_homesafe",
        "hall",
        "Hall Smoke",
        [
            Ent("hall_smoke_days_to_replace", None, "d", "2400", original_name="Days to replace"),
            Ent("hall_smoke_smoke_level", None, None, "0", original_name="Smoke Level"),
            Ent("hall_smoke_end_of_life_fault", None, None, "off", "binary_sensor", "End of Life Fault"),
        ],
    )
    older = await _seed(
        hass,
        "kidde_homesafe",
        "garage",
        "Garage CO",
        [
            Ent("garage_co_weeks_to_replace", None, "w", "310", original_name="Weeks to replace"),
            Ent("garage_co_co_level", None, None, "0", original_name="CO Level"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (days,) = setups[detect]["tasks"]
    assert days["task_name"] == "Replace Detectors" and days["direction"] == "duration_left"
    assert days["entity_ids"] == ["sensor.hall_smoke_days_to_replace"]
    assert days["threshold"] == 30.0
    (weeks,) = setups[older]["tasks"]
    assert weeks["entity_ids"] == ["sensor.garage_co_weeks_to_replace"]
    assert weeks["threshold"] == round(720 / 168, 3)
    tc = _trigger(hass, "kidde_homesafe", weeks)
    assert tc["type"] == "threshold" and tc["trigger_below"] == round(720 / 168, 3)


# ── Heating-loop pressure, stove service ─────────────────────────────────────


async def test_ariston_and_heishamon_heating_loop_pressure(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Ariston names the pressure without a device prefix (a second boiler's
    _2 id is recognised by its original name); HeishaMon builds the entity id
    from the MQTT key and ships the K/L-series water pressure disabled — the
    refrigerant high/low pressures never match."""
    await setup_integration(hass, global_entry)
    galevo = await _seed(
        hass,
        "ariston",
        "gal1",
        "Ariston Genus One",
        [
            Ent("ariston_heating_circuit_pressure", None, "bar", "1.4", original_name="Ariston heating circuit pressure"),
            Ent("ariston_ch_flow_setpoint_temp", None, "°C", "55", original_name="Ariston CH flow setpoint temp"),
        ],
    )
    second = await _seed(
        hass,
        "ariston",
        "gal2",
        "Ariston Cellar",
        [Ent("ariston_heating_circuit_pressure_2", None, "bar", "0.8", original_name="Ariston heating circuit pressure")],
    )
    heatpump = await _seed(
        hass,
        "aquarea",
        "hm1",
        "Aquarea HeatPump",
        [
            Ent("panasonic_heat_pump_main_water_pressure", None, "bar", "1.9", original_name="Aquarea Water Pressure"),
            Ent("panasonic_heat_pump_main_high_pressure", None, "kPa", "2400", original_name="Aquarea High pressure"),
            Ent("panasonic_heat_pump_main_low_pressure", None, "kPa", "800", original_name="Aquarea Low Pressure"),
        ],
    )
    hidden = await _seed(
        hass,
        "aquarea",
        "hm2",
        "Aquarea HeatPump J",
        [
            Ent("hm2_main_water_pressure", None, "bar", original_name="Aquarea Water Pressure", disabled=True),
            Ent("hm2_main_low_pressure", None, "kPa", "800", original_name="Aquarea Low Pressure"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for device_id, entity_id in (
        (galevo, "sensor.ariston_heating_circuit_pressure"),
        (second, "sensor.ariston_heating_circuit_pressure_2"),
        (heatpump, "sensor.panasonic_heat_pump_main_water_pressure"),
    ):
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Refill Heating Water" and task["direction"] == "value_below"
        assert task["entity_ids"] == [entity_id]
        assert task["threshold"] == 1.0
    tc = _trigger(hass, "ariston", setups[galevo]["tasks"][0])
    assert tc["type"] == "threshold" and tc["trigger_below"] == 1.0 and tc["auto_complete_on_recovery"] is True
    assert hidden not in setups
    assert SIGNATURES["aquarea"].tasks[0] is _shared.HEATING_WATER_PRESSURE_LOW


async def test_bosch_homecom_system_pressure_on_k40_and_icom(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Bosch HomeCom: the K40 heat source's pressure carries translation_key
    'system_pressure'; an ICOM device additionally exposes the same reading
    as 'hs_system_pressure' — one duty watches both copies (any-low)."""
    await setup_integration(hass, global_entry)
    k40 = await _seed(
        hass,
        "bosch_homecom",
        "k40",
        "Compress 7000i",
        [
            Ent("compress_7000i_system_pressure", "system_pressure", "bar", "1.7"),
            Ent("compress_7000i_supply_temperature", "supply_temperature", "°C", "38"),
            Ent("compress_7000i_compressor_working_time", "compressor_working_time", "s", "8640000"),
        ],
    )
    icom = await _seed(
        hass,
        "bosch_homecom",
        "icom",
        "Condens 7000",
        [
            Ent("condens_7000_system_pressure", "system_pressure", "bar", "1.5"),
            Ent("condens_7000_hs_system_pressure", None, "bar", "1.5", original_name="hs_system_pressure"),
            Ent("condens_7000_hs_working_time", None, "h", "9120", original_name="hs_working_time"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (k40_task,) = setups[k40]["tasks"]
    assert k40_task["task_name"] == "Refill Heating Water" and k40_task["threshold"] == 1.0
    assert k40_task["entity_ids"] == ["sensor.compress_7000i_system_pressure"]
    (icom_task,) = setups[icom]["tasks"]
    assert icom_task["entity_ids"] == ["sensor.condens_7000_hs_system_pressure", "sensor.condens_7000_system_pressure"]
    tc = _trigger(hass, "bosch_homecom", icom_task)
    assert tc["entity_logic"] == "any" and tc["trigger_below"] == 1.0


async def test_nefiteasy_bare_object_id_and_a_second_boiler(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Nefit Easy names its sensors without a device prefix: the first
    boiler's sensor.system_pressure matches as the exact object id, the
    second boiler's _2 id by its original name."""
    await setup_integration(hass, global_entry)
    first = await _seed(
        hass,
        "nefiteasy",
        "n1",
        "Nefit",
        [
            Ent("system_pressure", None, "bar", "1.8", original_name="System pressure"),
            Ent("supply_temperature", None, "°C", "45", original_name="Supply temperature"),
            Ent("year_total", None, "m³", "1200", original_name="Year total"),
        ],
    )
    second = await _seed(
        hass,
        "nefiteasy",
        "n2",
        "Nefit Annex",
        [Ent("system_pressure_2", None, "bar", "0.9", original_name="System pressure")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[first]["tasks"]
    assert task["task_name"] == "Refill Heating Water" and task["entity_ids"] == ["sensor.system_pressure"]
    (task2,) = setups[second]["tasks"]
    assert task2["entity_ids"] == ["sensor.system_pressure_2"]


def test_bosch_family_shares_one_system_pressure_duty() -> None:
    """bosch, bosch_homecom and nefiteasy all watch 'system_pressure' with the
    same 1-bar floor — one shared object (DRY tripwire)."""
    shared = _shared.HEATING_SYSTEM_PRESSURE_LOW
    for domain in ("bosch", "bosch_homecom", "nefiteasy"):
        (sig,) = SIGNATURES[domain].tasks
        assert sig is shared, domain
    assert shared.keys == ("system_pressure",) and shared.direction == "value_below" and shared.delta_units == 1


async def test_maestro_mcz_stove_service_countdown(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """MCZ stoves report the hours to the next maintenance: a Stove Service
    24 burn hours ahead; the problem-class alarm binary adds nothing."""
    await setup_integration(hass, global_entry)
    stove = await _seed(
        hass,
        "maestro_mcz",
        "mcz1",
        "Living Room Stove",
        [
            Ent("living_room_stove_next_maintenance", None, "h", "1310", original_name="Next Maintenance"),
            Ent("living_room_stove_transport_screw_speed", None, "rpm", "0", original_name="Transport Screw Speed"),
            Ent("living_room_stove_alarm", None, None, "off", "binary_sensor", "Alarm"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[stove]["tasks"]
    assert task["task_name"] == "Stove Service" and task["direction"] == "duration_left"
    assert task["entity_ids"] == ["sensor.living_room_stove_next_maintenance"]
    assert task["threshold"] == 24.0
    tc = _trigger(hass, "maestro_mcz", task)
    assert tc["type"] == "threshold" and tc["trigger_below"] == 24.0


async def test_waterkotte_basicvent_filter_days(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Waterkotte's BasicVent filter countdown (days, shipped disabled): a
    week's lead once enabled; while disabled the heat pump proposes nothing."""
    await setup_integration(hass, global_entry)
    key = "basicvent_filter_change_remaining_operating_days_a4504"
    enabled = await _seed(
        hass,
        "waterkotte_heatpump",
        "wk1",
        "Waterkotte",
        [
            Ent(f"wkh_{key}", key, "d", "61"),
            Ent("wkh_basicvent_filter_change_operating_days_a4498", "basicvent_filter_change_operating_days_a4498", "d", "120"),
            Ent("wkh_temperature_outside", "temperature_outside", "°C", "11"),
        ],
    )
    fresh = await _seed(
        hass,
        "waterkotte_heatpump",
        "wk2",
        "Waterkotte Annex",
        [Ent(f"wkh_wk2_{key}", key, "d", disabled=True), Ent("wkh_wk2_temperature_outside", "temperature_outside", "°C", "11")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[enabled]["tasks"]
    assert task["task_name"] == "Replace Ventilation Filter" and task["direction"] == "duration_left"
    assert task["entity_ids"] == [f"sensor.wkh_{key}"]
    assert task["threshold"] == 7.0
    assert task["reset"] is None
    assert fresh not in setups


# ── Air conditioners: engine runtime ─────────────────────────────────────────


async def test_panasonic_ac_runtime_and_aquarea_zones_stay_out(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Panasonic Comfort Cloud: the AC climate (tk 'climate') accumulates
    runtime in every mode but off — 'auto' reports heat_cool. The Aquarea heat
    pump of the same integration carries zone climates with their own tk; even
    a zone whose name ends in 'climate' stays out (authoritative keys)."""
    await setup_integration(hass, global_entry)
    ac = await _seed(
        hass,
        "panasonic_cc",
        "cs1",
        "Living Room AC",
        [
            Ent("living_room_ac", "climate", None, "heat_cool", "climate"),
            Ent("living_room_ac_inside_temperature", "inside_temperature", "°C", "22"),
            Ent("living_room_ac_nanoe", "nanoe_mode", None, "on", "switch"),
        ],
    )
    aquarea = await _seed(
        hass,
        "panasonic_cc",
        "aq1",
        "Aquarea",
        [
            Ent("aquarea_zone_climate", "zone-1-climate", None, "heat", "climate", "Zone climate"),
            Ent("aquarea_house", "zone-2-climate", None, "heat", "climate", "House"),
            Ent("aquarea_outdoor_temperature", "outdoor_temperature", "°C", "6"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[ac]["tasks"]
    assert task["task_name"] == "Filter Cleaning" and task["direction"] == "runtime_hours"
    assert task["entity_ids"] == ["climate.living_room_ac"]
    assert task["threshold"] == 100.0
    tc = _trigger(hass, "panasonic_cc", task)
    assert tc["type"] == "runtime" and tc["trigger_on_states"] == HEAT_COOL_STATES
    assert "attribute" not in tc
    assert aquarea not in setups


async def test_ac_only_integrations_share_the_runtime_duty(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Mitsubishi Heavy WF-RAC, Toshiba and Fujitsu Airstage run their single
    climate through auto/cool/dry/fan_only/heat — the gree/midea_ac object.
    AUX Cloud keys the same duty to its AC climate: its heat pump stays out."""
    await setup_integration(hass, global_entry)
    wfrac = await _seed(
        hass, "mitsubishi_wf_rac", "w1", "Bedroom", [Ent("bedroom", "mitsubishi_wf_rac", None, "cool", "climate")]
    )
    toshiba = await _seed(
        hass,
        "toshiba_ac",
        "t1",
        "Office",
        [Ent("office", None, None, "fan_only", "climate"), Ent("office_power_consumption", None, "kWh", "12")],
    )
    airstage = await _seed(hass, "fujitsu_airstage", "f1", "Den", [Ent("den", None, None, "auto", "climate")])
    aux_ac = await _seed(
        hass,
        "aux_cloud",
        "a1",
        "Guest Room",
        [Ent("guest_room_air_conditioner", "aux_ac", None, "dry", "climate", "Air Conditioner")],
    )
    aux_hp = await _seed(
        hass, "aux_cloud", "a2", "Heat Pump", [Ent("heat_pump_heater", "aux_heater", None, "heat", "climate", "Heater")]
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for domain, device_id, entity_id in (
        ("mitsubishi_wf_rac", wfrac, "climate.bedroom"),
        ("toshiba_ac", toshiba, "climate.office"),
        ("fujitsu_airstage", airstage, "climate.den"),
        ("aux_cloud", aux_ac, "climate.guest_room_air_conditioner"),
    ):
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Filter Cleaning" and task["direction"] == "runtime_hours", domain
        assert task["entity_ids"] == [entity_id] and task["threshold"] == 100.0, domain
        tc = _trigger(hass, domain, task)
        assert tc["type"] == "runtime" and tc["trigger_on_states"] == AC_STATES, domain
    assert aux_hp not in setups
    for domain in ("mitsubishi_wf_rac", "toshiba_ac", "fujitsu_airstage"):
        assert SIGNATURES[domain].tasks[0] is air._AC_FILTER_CLEANING_RUNTIME, domain
    (aux_sig,) = SIGNATURES["aux_cloud"].tasks
    assert aux_sig.keys == ("aux_ac",) and aux_sig.on_states == air._AC_FILTER_CLEANING_RUNTIME.on_states


async def test_daikin_onecta_ac_runtime_gated_to_ac_adapters(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Daikin Onecta: an AC's 'roomtemperature' climate gets the runtime duty
    on the AC WLAN adapter families (BRP069C4x/C8x, BRP069B4x, BRP069A4x).
    The same climate key on an Altherma heat pump (BRP069A78 / A71) or a
    Daikin gas boiler (DRGATEWAYAA) proposes nothing."""
    await setup_integration(hass, global_entry)

    def room(prefix: str, state: str = "cool") -> Ent:
        return Ent(f"{prefix}_room_temperature", "roomtemperature", None, state, "climate", "Room Temperature")

    perfera = await _seed(hass, "daikin_onecta", "dx4a", "Johnny Maaike", [room("johnny_maaike")], model="BRP069C4x")
    skyair = await _seed(hass, "daikin_onecta", "dx23a", "Shop", [room("shop", "heat_cool")], model="BRP069C8x")
    ururu = await _seed(hass, "daikin_onecta", "dx23b", "Ururu", [room("ururu", "dry")], model="BRP069B4x")
    older = await _seed(hass, "daikin_onecta", "dx23c", "Attic", [room("attic", "fan_only")], model="BRP069A4x")
    altherma = await _seed(
        hass,
        "daikin_onecta",
        "alth",
        "Altherma",
        [
            room("altherma", "heat"),
            Ent("altherma_leaving_water_offset", "leavingwateroffset", None, "heat", "climate", "Leaving Water Offset"),
            Ent("altherma_leaving_water_temperature", "leavingwatertemperature", None, "heat", "climate"),
        ],
        model="BRP069A78",
    )
    altherma4 = await _seed(hass, "daikin_onecta", "alth4", "Altherma 4", [room("altherma_4", "heat")], model="BRP069A71")
    gas = await _seed(hass, "daikin_onecta", "ndj", "Gas Boiler", [room("gas_boiler", "heat")], model="DRGATEWAYAA")

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for device_id, entity_id in (
        (perfera, "climate.johnny_maaike_room_temperature"),
        (skyair, "climate.shop_room_temperature"),
        (ururu, "climate.ururu_room_temperature"),
        (older, "climate.attic_room_temperature"),
    ):
        (task,) = setups[device_id]["tasks"]
        assert task["task_name"] == "Filter Cleaning" and task["direction"] == "runtime_hours"
        assert task["entity_ids"] == [entity_id] and task["threshold"] == 100.0
    tc = _trigger(hass, "daikin_onecta", setups[perfera]["tasks"][0])
    assert tc["type"] == "runtime" and tc["trigger_on_states"] == HEAT_COOL_STATES
    for device_id in (altherma, altherma4, gas):
        assert device_id not in setups


# ── Decentral ventilation filters ────────────────────────────────────────────


def _ambientika_entities(prefix: str, filter_state: str = "medium") -> list[Ent]:
    """An Ambientika unit as the integration registers it: every entity has a
    translation_key; the filter-reset button has no translated name, so its
    entity id is the bare device name."""
    return [
        Ent(prefix, "climate", None, "fan_only", "climate"),
        Ent(f"{prefix}_filter_status", "filter_status", None, filter_state),
        Ent(f"{prefix}_air_quality", "air_quality", None, "good"),
        Ent(f"{prefix}_humidity_alarm", "humidity_alarm", None, "off", "binary_sensor"),
        btn(prefix, "filter_reset"),
    ]


async def test_ambientika_filter_status_latch_with_its_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Ambientika's filter status (bad / medium / good) latches on 'bad' —
    'medium' is only the pre-warning — and completing presses the unit's
    filter reset."""
    await setup_integration(hass, global_entry)
    unit = await _seed(hass, "ambientika", "amb1", "Living Room", _ambientika_entities("living_room"))

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[unit]["tasks"]
    assert task["task_name"] == "Replace Ventilation Filter" and task["direction"] == "event_present"
    assert task["entity_ids"] == ["sensor.living_room_filter_status"]
    assert _reset(task) == "button.living_room"
    tc = _trigger(hass, "ambientika", task)
    assert tc["type"] == "state_change" and tc["trigger_to_state"] == "bad"
    assert tc["auto_complete_on_recovery"] is True


async def test_ambientika_adopt_wires_the_filter_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, global_entry)
    unit = await _seed(hass, "ambientika", "amb1", "Bedroom", _ambientika_entities("bedroom", "bad"))
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": unit}]})
    assert not conn.send_error.called, conn.send_error.call_args
    (task,) = _object_named(hass, "Bedroom").data[CONF_TASKS].values()
    assert task["trigger_config"]["type"] == "state_change"
    assert task["trigger_config"]["trigger_to_state"] == "bad"
    assert task["on_complete_action"]["service"] == "button.press"
    assert task["on_complete_action"]["target"] == {"entity_id": "button.bedroom"}


async def test_siku_filter_countdown_with_its_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Siku/Blauberg (V2 API): the filter countdown (shown in days) warns a
    week ahead and completing presses 'Reset filter alarm'. The integration
    names entities without a device prefix — a second fan's _2 ids are
    recognised by their original names. A V1 fan (no countdown) proposes
    nothing."""
    await setup_integration(hass, global_entry)
    fan = await _seed(
        hass,
        "siku",
        "s1",
        "Siku Fan",
        [
            Ent("filter_timer_countdown", None, "d", "41.5", original_name="Filter timer countdown"),
            Ent("filter_replacement_timer_setup", None, "d", "90", original_name="Filter replacement timer setup"),
            Ent("timer_countdown", None, "min", "0", original_name="Timer countdown"),
            btn("reset_filter_alarm", original_name="Reset filter alarm"),
            btn("party_mode", original_name="Party mode"),
        ],
    )
    second = await _seed(
        hass,
        "siku",
        "s2",
        "Siku Fan Bath",
        [
            Ent("filter_timer_countdown_2", None, "d", "3.2", original_name="Filter timer countdown"),
            btn("reset_filter_alarm_2", original_name="Reset filter alarm"),
        ],
    )
    v1 = await _seed(hass, "siku", "s3", "Siku V1", [Ent("alarm", None, None, "False", original_name="Alarm")])

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[fan]["tasks"]
    assert task["task_name"] == "Replace Ventilation Filter" and task["direction"] == "duration_left"
    assert task["entity_ids"] == ["sensor.filter_timer_countdown"]
    assert task["threshold"] == 7.0
    assert _reset(task) == "button.reset_filter_alarm"
    (task2,) = setups[second]["tasks"]
    assert task2["entity_ids"] == ["sensor.filter_timer_countdown_2"]
    assert _reset(task2) == "button.reset_filter_alarm_2"
    assert v1 not in setups


async def test_ecovent_filter_percent_remaining(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """EcoVent: the integration's '% filter remaining' (countdown ÷ setpoint)
    drives the duty at the household floor; the hours countdown of the same
    filter is not a second duty, and a legacy hours entity that still carries
    the _filter_remaining id is kept out by its unit."""
    await setup_integration(hass, global_entry)
    vento = await _seed(
        hass,
        "ecovent_v2",
        "v1",
        "Vento",
        [
            Ent("vento_filter_remaining", None, "%", "37", original_name="Filter remaining"),
            Ent("vento_filter_change_in", None, "h", "1580", original_name="Filter change in"),
            Ent("vento_humidity", None, "%", "48", original_name="Humidity"),
        ],
    )
    legacy = await _seed(
        hass,
        "ecovent_v2",
        "v2",
        "Vento Old",
        [Ent("vento_old_filter_remaining", None, "h", "1580", original_name="Filter change in")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[vento]["tasks"]
    assert task["task_name"] == "Replace Ventilation Filter" and task["direction"] == "percent_left"
    assert task["entity_ids"] == ["sensor.vento_filter_remaining"]
    assert task["threshold"] == 10.0
    assert task["reset"] is None
    assert legacy not in setups


def test_round16ha_entries_cite_the_hacs_default_branch() -> None:
    domains = (
        "nest_protect",
        "kidde_homesafe",
        "ariston",
        "aquarea",
        "maestro_mcz",
        "bosch_homecom",
        "nefiteasy",
        "waterkotte_heatpump",
        "panasonic_cc",
        "mitsubishi_wf_rac",
        "toshiba_ac",
        "fujitsu_airstage",
        "aux_cloud",
        "daikin_onecta",
        "ambientika",
        "siku",
        "ecovent_v2",
    )
    for domain in domains:
        catalog = SIGNATURES[domain]
        assert catalog.verified.startswith("2026-10-03 @ "), domain
        assert "(" in catalog.verified and catalog.source.startswith("HACS "), domain
    assert {pair for s in SIGNATURES["ambientika"].tasks for pair in s.resets} == {("filter_status", "filter_reset")}
    assert {pair for s in SIGNATURES["siku"].tasks for pair in s.resets} == {("filter_timer_countdown", "reset_filter_alarm")}
    assert SIGNATURES["panasonic_cc"].translation_keys_authoritative is True
    (onecta,) = SIGNATURES["daikin_onecta"].tasks
    assert onecta.models and not any(m.upper().startswith(("BRP069A6", "BRP069A7")) for m in onecta.models)
