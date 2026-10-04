"""Catalog round 16, part A (air treatment, heating, home IT, transports).

Pins the round-16 additions verified against Home Assistant core 2026.10.0b0
(every key already ships in 2026.9): the Salda Smarty and Vallox ventilation
units report the DATE the filter is due (due_date with a week's lead — the
Smarty 'reset_filters_timer' button is wired as the reset, Vallox's change
date is a date entity and stays unwired), and Ecoforest pellet stoves count
their total working hours (usage_delta → Stove Service every 1,500 h; the
sensor ships disabled). Also pins the re-checked skips in integrations the
catalog already had: one duty per part (ViCare's filter hours next to the
filter countdown, Rehlko's lifetime runtime next to the runtime since the
last maintenance) and OpenTherm's burner/pump running times left out.

Entities are seeded the way the real integrations register them: the
translation_key the integration sets, the entity-id suffix its (translated)
name produces, the unit it reports, and — for buttons and disabled-by-default
sensors — the registry state the integration gives them.
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


def _smarty_entities(due_in_days: int = 30) -> list[Ent]:
    """A Salda Smarty as core smarty registers it: every entity carries a
    translation_key (the fan 'fan'), 'filter_days_left' is a TIMESTAMP
    sensor (now + the unit's filter-timer days) and the reset button is
    enabled."""
    due = (dt_util.utcnow() + timedelta(days=due_in_days)).isoformat()
    return [
        Ent("smarty", "fan", platform="fan", state="on"),
        Ent("smarty_filter_days_left", "filter_days_left", None, due),
        Ent("smarty_supply_air_temperature", "supply_air_temperature", "°C", "19.5"),
        Ent("smarty_extract_fan_speed", "extract_fan_speed", "rpm", "1450"),
        Ent("smarty_warning", "warning", platform="binary_sensor", state="off"),
        Ent(
            "smarty_reset_filters_timer",
            "reset_filters_timer",
            platform="button",
            state="unknown",
            original_name="Reset filters timer",
        ),
    ]


async def test_smarty_filter_due_date_with_its_timer_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Salda Smarty: the filter change DATE drives a due_date duty with a
    week's lead, and completing it presses 'Reset filters timer' (which moves
    the date forward). The unit's own alarm/warning binaries are problem-class
    (adoption path) and add nothing here."""
    await setup_integration(hass, global_entry)
    smarty = await _seed(hass, "smarty", "sm1", "Smarty", _smarty_entities())

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[smarty]["tasks"]
    assert task["task_name"] == "Replace Ventilation Filter" and task["direction"] == "due_date"
    assert task["entity_ids"] == ["sensor.smarty_filter_days_left"]
    assert task["threshold"] == 7.0
    assert task["reset"] == {
        "entity_id": "button.smarty_reset_filters_timer",
        "name": "Reset filters timer",
        "disabled": False,
    }
    tc = _trigger(hass, "smarty", task)
    assert tc["type"] == "due_date" and tc["trigger_days_before"] == 7
    assert tc["entity_ids"] == ["sensor.smarty_filter_days_left"]
    assert tc["auto_complete_on_recovery"] is True


async def test_smarty_adopt_wires_the_timer_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Adopting a Smarty stores the due-date trigger and wires the filter
    timer reset as the task's completion action."""
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, global_entry)
    smarty = await _seed(hass, "smarty", "sm1", "Smarty", _smarty_entities(due_in_days=3))
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": smarty}]})
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Smarty"
    )
    (task,) = obj.data[CONF_TASKS].values()
    assert task["trigger_config"]["type"] == "due_date"
    assert task["trigger_config"]["trigger_days_before"] == 7
    assert task["trigger_config"]["entity_ids"] == ["sensor.smarty_filter_days_left"]
    assert task["on_complete_action"]["service"] == "button.press"
    assert task["on_complete_action"]["target"] == {"entity_id": "button.smarty_reset_filters_timer"}


async def test_vallox_filter_due_date_without_a_reset(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Vallox reports the next filter change (last change + interval, at
    13:00 local) — a due_date duty with a week's lead. The change date is a
    CONFIG date entity, not a button: nothing is wired as the reset."""
    await setup_integration(hass, global_entry)
    due = (dt_util.now() + timedelta(days=40)).replace(hour=13, minute=0, second=0, microsecond=0)
    vallox = await _seed(
        hass,
        "vallox",
        "v1",
        "Vallox",
        [
            Ent("vallox", platform="fan", state="on"),
            Ent("vallox_remaining_time_for_filter", "remaining_time_for_filter", None, due.isoformat()),
            Ent("vallox_filter_change_date", "filter_change_date", None, "2026-05-02", platform="date"),
            Ent("vallox_fan_speed", "fan_speed", "%", "40"),
            Ent("vallox_cell_state", "cell_state", None, "heat_recovery"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[vallox]["tasks"]
    assert task["task_name"] == "Replace Ventilation Filter" and task["direction"] == "due_date"
    assert task["entity_ids"] == ["sensor.vallox_remaining_time_for_filter"]
    assert task["threshold"] == 7.0
    assert task["reset"] is None
    tc = _trigger(hass, "vallox", task)
    assert tc == {
        "type": "due_date",
        "entity_id": "sensor.vallox_remaining_time_for_filter",
        "entity_ids": ["sensor.vallox_remaining_time_for_filter"],
        "trigger_days_before": 7,
        "auto_complete_on_recovery": True,
    }


async def test_ecoforest_stove_service_by_working_hours(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Ecoforest counts the stove's TOTAL working hours (no reset anywhere):
    a Stove Service every 1,500 h counted from adoption (delta, no 0
    baseline). The sensor ships disabled — until it is enabled the stove has
    nothing to propose."""
    await setup_integration(hass, global_entry)
    stove = await _seed(
        hass,
        "ecoforest",
        "cg1",
        "Ecoforest",
        [
            Ent("ecoforest_temperature", None, "°C", "21.5"),
            Ent("ecoforest_status", "status", None, "on"),
            Ent("ecoforest_alarm", "alarm", None, "none"),
            Ent("ecoforest_working_time", "working_hours", "h", "2140"),
            Ent("ecoforest_ignitions", "ignitions", "ignitions", "310", disabled=True),
        ],
    )
    fresh = await _seed(
        hass,
        "ecoforest",
        "cg2",
        "Ecoforest Cellar",
        [
            Ent("ecoforest_cellar_status", "status", None, "off"),
            Ent("ecoforest_cellar_working_time", "working_hours", "h", disabled=True),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[stove]["tasks"]
    assert task["task_name"] == "Stove Service" and task["direction"] == "usage_delta"
    assert task["entity_ids"] == ["sensor.ecoforest_working_time"]
    assert task["threshold"] == 1500.0
    assert task["reset"] is None
    tc = _trigger(hass, "ecoforest", task)
    assert tc["type"] == "counter" and tc["trigger_delta_mode"] is True
    assert tc["trigger_target_value"] == 1500.0
    assert "trigger_baseline_value" not in tc  # lifetime counter: baseline = value at adoption
    assert fresh not in setups


async def test_rechecked_integrations_keep_one_duty_per_part(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Round-16 re-check of catalogued integrations: ViCare's filter
    operating/overdue hours read the same filter as the countdown, Rehlko's
    total runtime and next-maintenance date the same service as the runtime
    since the last maintenance — neither adds a duty. OpenTherm's burner and
    pump running times stay out (each sensor exists on the boiler AND the
    thermostat device, and no gate tells them apart)."""
    await setup_integration(hass, global_entry)
    vitoair = await _seed(
        hass,
        "vicare",
        "va1",
        "Vitoair",
        [
            Ent("vitoair_filter_remaining_hours", "filter_remaining_hours", "h", "900"),
            Ent("vitoair_filter_hours", "filter_hours", "h", "3500"),
            Ent("vitoair_filter_overdue_hours", "filter_overdue_hours", "h", "0"),
            Ent("vitoair_supply_fan_hours", "supply_fan_hours", "h", "9000"),
        ],
    )
    genset = await _seed(
        hass,
        "rehlko",
        "k1",
        "Kohler 20RESC",
        [
            Ent("kohler_20resc_runtime_since_last_maintenance", "runtime_since_last_maintenance", "h", "12"),
            Ent("kohler_20resc_total_runtime", "total_runtime", "h", "412"),
            Ent("kohler_20resc_next_maintainance", "next_maintainance", None, "2027-03-01T00:00:00+00:00"),
        ],
    )
    boiler = await _seed(
        hass,
        "opentherm_gw",
        "gw1-boiler",
        "OpenTherm Boiler",
        [
            Ent("opentherm_boiler_central_heating_pressure", "central_heating_pressure", "bar", "1.6"),
            Ent("opentherm_boiler_burner_running_time", "total_burner_hours", "h", "8120"),
            Ent("opentherm_boiler_central_heating_pump_running_time", "central_heating_pump_hours", "h", "15020"),
            Ent("opentherm_boiler_hot_water_burner_running_time", "hot_water_burner_hours", "h", "940"),
            Ent("opentherm_boiler_hot_water_pump_running_time", "hot_water_pump_hours", "h", "1210"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (filt,) = setups[vitoair]["tasks"]
    assert filt["task_name"] == "Replace Filter" and filt["direction"] == "duration_left"
    assert filt["entity_ids"] == ["sensor.vitoair_filter_remaining_hours"]

    (oil,) = setups[genset]["tasks"]
    assert oil["task_name"] == "Oil Service" and oil["direction"] == "usage_above"
    assert oil["entity_ids"] == ["sensor.kohler_20resc_runtime_since_last_maintenance"]

    (water,) = setups[boiler]["tasks"]
    assert water["task_name"] == "Refill Heating Water"
    assert water["entity_ids"] == ["sensor.opentherm_boiler_central_heating_pressure"]


def test_round16a_entries_cite_core_2026_10() -> None:
    for domain in ("smarty", "vallox", "ecoforest"):
        catalog = SIGNATURES[domain]
        assert catalog.verified.startswith("2026-10-03 @ home-assistant/core 2026.10.0b0"), domain
        assert "2026.9" in catalog.verified and catalog.source, domain
    assert {pair for s in SIGNATURES["smarty"].tasks for pair in s.resets} == {("filter_days_left", "reset_filters_timer")}
    assert not any(s.resets for s in SIGNATURES["vallox"].tasks)
    assert SIGNATURES["smarty"].translation_keys_authoritative is True
