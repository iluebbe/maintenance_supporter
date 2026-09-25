"""Catalog wave 2026-09-25 (B): kitchen appliances + home IT, and the two
event-latch engine extensions they need.

Engine:
* ``ok_state`` — a from-only latch for LEVEL enums whose alert is "anything
  but OK" (homeconnect_ws salt: empty / nearly_empty / full). Unavailable and
  unknown must never read as leaving the OK state.
* several keys in ONE event signature — one latch watching every matched
  entity with ``entity_logic: any`` (Home Connect salt_nearly_empty +
  salt_lack + program_blocked_salt_lack).

Catalog: Home Connect 2026.9 dishwasher events + older coffee/i-Dos/robot
gaps, Home Connect Local (homeconnect_ws), core Midea, the midea_ac_lan
purifier fix, Electrolux OCP, GE Home, Candy, Unraid x3, UniFi UNAS x2, MOS.
"""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any, cast

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID, ScheduleType
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
    build_setup_trigger,
    discover_integration_setups,
)
from custom_components.maintenance_supporter.helpers.signatures._model import (
    ConsumableSignature,
    IntegrationSignature,
    _entity_matches,
)
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


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


# (object_id suffix, translation_key or None, unit or None, state, original_name)
_Ent = tuple[str, str | None, str | None, str, str | None]


async def _seed(
    hass: HomeAssistant,
    domain: str,
    uid: str,
    device_name: str,
    entities: list[_Ent],
    *,
    model: str | None = None,
    platform_domain: str = "sensor",
) -> str:
    """One device of `domain` with entities seeded like the real integration:
    translation_key (or None for suffix-only matching), unit, live state and
    optionally the registry original_name (per-entity labels)."""
    source = MockConfigEntry(domain=domain, title=domain)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=device_name, model=model
    )
    ent_reg = er.async_get(hass)
    for key, tkey, unit, state, original_name in entities:
        entry = ent_reg.async_get_or_create(
            platform_domain,
            domain,
            f"{uid}_{key}",
            config_entry=source,
            device_id=device.id,
            translation_key=tkey,
            original_name=original_name,
            suggested_object_id=f"{domain}_{uid}_{key}",
        )
        hass.states.async_set(entry.entity_id, state, {"unit_of_measurement": unit} if unit else {})
    return device.id


def _sig(domain: str, task_name: str, direction: str) -> ConsumableSignature:
    return next(s for s in SIGNATURES[domain].tasks if s.task_name == task_name and s.direction == direction)


def _tasks(setup: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {t["task_name"]: t for t in setup["tasks"]}


# ─── Engine: ok_state + multi-key latch ─────────────────────────────────────


def test_ok_state_only_on_event_signatures_and_builds_from_only_latch(hass: HomeAssistant) -> None:
    """Tripwire over the FULL catalog: ok_state belongs to event latches only
    and replaces (never combines with) a named alert state. The trigger it
    builds is from-only — no To-state, so the #167 predicate reads 'alert ==
    anything but the OK state'."""
    for domain, cat in SIGNATURES.items():
        for sig in cat.tasks:
            if sig.ok_state:
                assert sig.direction == "event_present", f"{domain}/{sig.task_name}: ok_state on {sig.direction}"
                assert not sig.on_states, f"{domain}/{sig.task_name}: ok_state AND on_states"

    salt = _sig("homeconnect_ws", "Refill Salt", "event_present")
    trigger = build_setup_trigger(salt, hass, ["sensor.dw_salt"])
    assert trigger["type"] == "state_change"
    assert trigger["trigger_from_state"] == "full"
    assert "trigger_to_state" not in trigger
    assert trigger["trigger_target_changes"] == 1 and trigger["auto_complete_on_recovery"] is True
    assert "entity_logic" not in trigger  # single entity: stored shape unchanged

    # Legacy named-state latches keep their exact shape.
    legacy = build_setup_trigger(_sig("mydolphin_plus", "Filter Cleaning", "event_present"), hass, ["sensor.x"])
    assert legacy["trigger_to_state"] == "full" and "trigger_from_state" not in legacy


def test_multi_key_event_signature_builds_one_any_latch(hass: HomeAssistant) -> None:
    salt = _sig("home_connect", "Refill Salt", "event_present")
    assert set(salt.keys) == {"salt_nearly_empty", "salt_lack", "program_blocked_salt_lack"}
    ids = ["sensor.dw_program_blocked_salt_lack", "sensor.dw_salt_lack", "sensor.dw_salt_nearly_empty"]
    trigger = build_setup_trigger(salt, hass, ids)
    assert trigger["entity_ids"] == ids and trigger["entity_id"] == ids[0]
    assert trigger["entity_logic"] == "any"
    assert trigger["trigger_to_state"] == "present"


_SALT = "sensor.homeconnect_ws_dw_sensor_salt"


async def _read_task(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    for obj in conn.send_result.call_args.args[1]["objects"]:
        if obj["entry_id"] == entry_id:
            return next(t for t in obj["tasks"] if t["id"] == TASK_ID_1)
    raise AssertionError("task not found")


def _object_with_trigger(hass: HomeAssistant, trigger_config: dict[str, Any], name: str) -> MockConfigEntry:
    task = build_task_data(
        name=name,
        last_performed="2026-03-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config=trigger_config,
    )
    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Dishwasher",
        data=build_object_entry_data(
            object_data=build_object_data(name="Dishwasher", object_id="objid_dw"), tasks={TASK_ID_1: task}
        ),
        source="user",
        unique_id="maintenance_supporter_dw_b",
    )
    obj.add_to_hass(hass)
    return obj


async def test_ok_state_latch_lifecycle_ignores_unavailable_and_unknown(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """homeconnect_ws salt: full → nearly_empty fires; moving on to empty is
    not a second trigger; unavailable/unknown neither fire nor recover (and
    never auto-complete); back to full recovers and auto-completes exactly
    once. A blip on a healthy sensor does not fire, but a blip that hides the
    drop (full → unavailable → nearly_empty) still does."""
    hass.states.async_set(_SALT, "full")
    trigger = build_setup_trigger(_sig("homeconnect_ws", "Refill Salt", "event_present"), hass, [_SALT])
    obj = _object_with_trigger(hass, trigger, "Refill Salt")
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        p0 = (await _read_task(hass, obj.entry_id))["times_performed"]

        # Blip on a healthy sensor: no fire either way.
        for state in ("unavailable", "full", "unknown", "full"):
            hass.states.async_set(_SALT, state)
            await hass.async_block_till_done()
            assert (await _read_task(hass, obj.entry_id))["trigger_active"] is False, state

        hass.states.async_set(_SALT, "nearly_empty")
        await hass.async_block_till_done()
        assert (await _read_task(hass, obj.entry_id))["trigger_active"] is True

        # Escalation and outages keep the latch — no recovery, no completion.
        for state in ("empty", "unavailable", "unknown", "empty"):
            hass.states.async_set(_SALT, state)
            await hass.async_block_till_done()
            mid = await _read_task(hass, obj.entry_id)
            assert mid["trigger_active"] is True, state
            assert mid["times_performed"] == p0, state

        # Refilled: back to the OK state → recover + auto-complete once.
        hass.states.async_set(_SALT, "full")
        await hass.async_block_till_done()
        rec = await _read_task(hass, obj.entry_id)
        assert rec["trigger_active"] is False
        assert rec["times_performed"] == p0 + 1

    with freeze_time("2026-06-01 09:00:00"):
        # The drop happens while the appliance is offline: the last real
        # state (full) is the effective From-state, so it still fires.
        hass.states.async_set(_SALT, "unavailable")
        await hass.async_block_till_done()
        hass.states.async_set(_SALT, "nearly_empty")
        await hass.async_block_till_done()
        assert (await _read_task(hass, obj.entry_id))["trigger_active"] is True
        hass.states.async_set(_SALT, "full")
        await hass.async_block_till_done()
        assert (await _read_task(hass, obj.entry_id))["times_performed"] == p0 + 2


async def test_ok_state_latch_restart_reconcile(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A latch persisted as active whose sensor restores at the OK state was
    refilled while HA was down: cleared quietly, no completion recorded."""
    hass.states.async_set(_SALT, "full")
    trigger = build_setup_trigger(_sig("homeconnect_ws", "Refill Salt", "event_present"), hass, [_SALT])
    trigger["trigger_change_count"] = 1
    obj = _object_with_trigger(hass, trigger, "Refill Salt")
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        after = await _read_task(hass, obj.entry_id)
    assert after["trigger_active"] is False
    assert after["times_performed"] == 0


async def test_multi_key_latch_fires_on_any_event_and_completes_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Home Connect salt: the newer salt_lack event alone fires the shared
    latch (the older key never moved); when the refill clears every event at
    once, exactly ONE completion is recorded; the next cycle can start from
    the other key."""
    ids = [
        "sensor.dishwasher_program_blocked_salt_lack",
        "sensor.dishwasher_salt_lack",
        "sensor.dishwasher_salt_nearly_empty",
    ]
    for eid in ids:
        hass.states.async_set(eid, "off")
    trigger = build_setup_trigger(_sig("home_connect", "Refill Salt", "event_present"), hass, ids)
    obj = _object_with_trigger(hass, trigger, "Refill Salt")
    with freeze_time("2026-05-01 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await hass.async_block_till_done()
        p0 = (await _read_task(hass, obj.entry_id))["times_performed"]

        hass.states.async_set("sensor.dishwasher_salt_lack", "present")
        await hass.async_block_till_done()
        assert (await _read_task(hass, obj.entry_id))["trigger_active"] is True

        hass.states.async_set("sensor.dishwasher_program_blocked_salt_lack", "present")
        await hass.async_block_till_done()
        assert (await _read_task(hass, obj.entry_id))["trigger_active"] is True

        # Refill clears both — one auto-completion, not two.
        hass.states.async_set("sensor.dishwasher_salt_lack", "off")
        hass.states.async_set("sensor.dishwasher_program_blocked_salt_lack", "off")
        await hass.async_block_till_done()
        rec = await _read_task(hass, obj.entry_id)
        assert rec["trigger_active"] is False
        assert rec["times_performed"] == p0 + 1

    with freeze_time("2026-06-01 09:00:00"):
        hass.states.async_set("sensor.dishwasher_salt_nearly_empty", "present")
        await hass.async_block_till_done()
        assert (await _read_task(hass, obj.entry_id))["trigger_active"] is True
        hass.states.async_set("sensor.dishwasher_salt_nearly_empty", "off")
        await hass.async_block_till_done()
        assert (await _read_task(hass, obj.entry_id))["times_performed"] == p0 + 2


# ─── Home Connect (core) ────────────────────────────────────────────────────


async def test_home_connect_2026_9_dishwasher_events_and_older_gaps(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    ev = [
        "salt_nearly_empty",
        "salt_lack",
        "program_blocked_salt_lack",
        "rinse_aid_nearly_empty",
        "rinse_aid_lack",
        "machine_care_reminder",
        "machine_care_and_filter_cleaning_reminder",
        "machine_care_and_low_maintenance_filter_cleaning_reminder",
        "smart_filter_cleaning_reminder",
        # not cataloged: a finished program is no maintenance duty
        "program_finished",
    ]
    dw = await _seed(hass, "home_connect", "dw", "Dishwasher", [(k, k, None, "off", None) for k in ev])
    coffee_keys = [
        "device_should_be_descaled",
        "device_descaling_overdue",
        "device_descaling_blockage",
        "device_should_be_calc_n_cleaned",
        "device_calc_n_clean_overdue",
        "device_calc_n_clean_blockage",
        "device_should_be_cleaned",
        "device_cleaning_overdue",
        "descaling_in_5_cups",  # pre-warning — deliberately not cataloged
        "calc_n_clean_in5cups",
    ]
    coffee = await _seed(hass, "home_connect", "cm", "Coffee Maker", [(k, k, None, "off", None) for k in coffee_keys])
    washer = await _seed(
        hass,
        "home_connect",
        "wm",
        "Washer",
        [
            ("poor_i_dos_1_fill_level", "poor_i_dos_1_fill_level", None, "off", "Poor i-Dos 1 fill level"),
            ("poor_i_dos_2_fill_level", "poor_i_dos_2_fill_level", None, "off", "Poor i-Dos 2 fill level"),
        ],
    )
    robot = await _seed(
        hass,
        "home_connect",
        "rv",
        "Roxxter",
        [("empty_dust_box_and_clean_filter", "empty_dust_box_and_clean_filter", None, "off", None)],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    d = _tasks(setups[dw])
    assert set(d) == {"Refill Salt", "Refill Rinse Aid", "Clean Appliance", "Filter Cleaning"}
    assert all(t["direction"] == "event_present" for t in d.values())
    assert len(d["Refill Salt"]["entity_ids"]) == 3
    assert len(d["Refill Rinse Aid"]["entity_ids"]) == 2
    assert d["Clean Appliance"]["entity_ids"] == sorted(
        f"sensor.home_connect_dw_{k}"
        for k in (
            "machine_care_reminder",
            "machine_care_and_filter_cleaning_reminder",
            "machine_care_and_low_maintenance_filter_cleaning_reminder",
        )
    )
    # The combined reminder backs BOTH duties; the low-maintenance one (filter
    # cleaning optional) only machine care.
    assert d["Filter Cleaning"]["entity_ids"] == [
        "sensor.home_connect_dw_machine_care_and_filter_cleaning_reminder",
        "sensor.home_connect_dw_smart_filter_cleaning_reminder",
    ]

    c = _tasks(setups[coffee])
    assert set(c) == {"Descale Appliance", "Clean Appliance"}
    assert len(c["Descale Appliance"]["entity_ids"]) == 6
    assert c["Clean Appliance"]["entity_ids"] == [
        "sensor.home_connect_cm_device_cleaning_overdue",
        "sensor.home_connect_cm_device_should_be_cleaned",
    ]

    # Two independently refilled i-Dos tanks → one duty per tank.
    w = setups[washer]["tasks"]
    assert [t["task_name"] for t in w] == [
        "Refill Detergent — Poor i-Dos 1 fill level",
        "Refill Detergent — Poor i-Dos 2 fill level",
    ]
    assert all(len(t["entity_ids"]) == 1 for t in w)

    (r,) = setups[robot]["tasks"]
    assert r["task_name"] == "Empty Dustbin" and r["direction"] == "event_present"

    # Adopt the dishwasher: the salt duty is ONE any-latch over all three events.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": dw, "task_names": ["Refill Salt"]}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("ha_device_id") == dw
    )
    (task,) = obj.data[CONF_TASKS].values()
    tc = task["trigger_config"]
    assert tc["type"] == "state_change" and tc["trigger_to_state"] == "present"
    assert len(tc["entity_ids"]) == 3 and tc["entity_logic"] == "any"
    assert tc["auto_complete_on_recovery"] is True


# ─── Home Connect Local (homeconnect_ws) ────────────────────────────────────


async def test_homeconnect_ws_level_latch_hood_saturation_and_coffee_countdowns(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    dw = await _seed(
        hass,
        "homeconnect_ws",
        "dw",
        "Dishwasher (local)",
        [
            ("sensor_salt", "sensor_salt", None, "full", None),
            ("sensor_rinse_aid", "sensor_rinse_aid", None, "nearly_empty", None),
            ("sensor_program_phase", "sensor_program_phase", None, "drying", None),
        ],
    )
    hood = await _seed(
        hass,
        "homeconnect_ws",
        "hd",
        "Hood",
        [
            ("sensor_grease_filter_saturation", "sensor_grease_filter_saturation", "%", "42", None),
            ("sensor_carbon_filter_saturation", "sensor_carbon_filter_saturation", "%", "17", None),
        ],
    )
    coffee = await _seed(
        hass,
        "homeconnect_ws",
        "cm",
        "Coffee (local)",
        [
            ("sensor_countdown_descaling", "sensor_countdown_descaling", None, "153", None),
            ("sensor_countdown_cleaning", "sensor_countdown_cleaning", None, "38", None),
            ("sensor_countdown_water_filter", "sensor_countdown_water_filter", None, "48", None),
            ("sensor_countdown_calc_n_clean", "sensor_countdown_calc_n_clean", None, "153", None),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    d = _tasks(setups[dw])
    assert set(d) == {"Refill Salt", "Refill Rinse Aid"}
    assert all(t["direction"] == "event_present" and t["threshold"] == 0.0 for t in d.values())

    h = _tasks(setups[hood])
    assert h["Clean Grease Filter"]["direction"] == "alert_above" and h["Clean Grease Filter"]["threshold"] == 90.0
    assert h["Replace Filter"]["direction"] == "alert_above" and h["Replace Filter"]["threshold"] == 90.0

    c = _tasks(setups[coffee])
    assert set(c) == {"Descale Appliance", "Clean Appliance", "Replace Water Filter"}  # calc_n_clean: skipped
    assert all(t["direction"] == "value_below" and t["threshold"] == 10.0 for t in c.values())

    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": dw}]})
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("ha_device_id") == dw
    )
    triggers = {t["name"]: t["trigger_config"] for t in obj.data[CONF_TASKS].values()}
    assert set(triggers) == {"Refill Salt", "Refill Rinse Aid"}
    for tc in triggers.values():
        assert tc["type"] == "state_change" and tc["trigger_from_state"] == "full"
        assert "trigger_to_state" not in tc and tc["auto_complete_on_recovery"] is True


# ─── Midea (core) + midea_ac_lan purifier fix ───────────────────────────────


async def test_midea_core_model_routed_filters_and_softener_salt(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Core midea shares tk 'filter_life_level' between the ED water purifier
    and the FC air purifier — the device model routes it."""
    await setup_integration(hass, global_entry)
    ed = await _seed(
        hass,
        "midea",
        "ed1",
        "Water Purifier",
        [
            ("life1", "filter_life_level", "%", "80", None),
            ("life2", "filter_life_level", "%", "60", None),
            ("life3", "filter_life_level", "%", "40", None),
            ("filter1", "filter_available_days", "d", "120", None),
        ],
        model="Water Drinking Appliance",
    )
    softener = await _seed(
        hass,
        "midea",
        "ed2",
        "Softener",
        [("left_salt", "salt_available", "%", "55", None)],
        model="Water Drinking Appliance",
    )
    fc = await _seed(
        hass,
        "midea",
        "fc1",
        "Air Purifier",
        [("filter1_life", "filter_life_level", "%", "70", None), ("filter2_life", "filter_life_level", "%", "90", None)],
        model="Air Purifier",
    )
    toilet = await _seed(hass, "midea", "c2", "Toilet", [("filter_life", "filter_life", "%", "70", None)], model="Toilet")
    unknown = await _seed(hass, "midea", "x1", "Mystery", [("life1", "filter_life_level", "%", "50", None)], model="Dehumidifier")

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (w,) = setups[ed]["tasks"]
    assert w["task_name"] == "Replace Water Filter" and w["direction"] == "percent_left"
    assert len(w["entity_ids"]) == 3  # the days countdowns are not a second duty
    (s,) = setups[softener]["tasks"]
    assert s["task_name"] == "Refill Softener Salt" and s["threshold"] == 10.0
    (f,) = setups[fc]["tasks"]
    assert f["task_name"] == "Replace Filter" and len(f["entity_ids"]) == 2
    (t,) = setups[toilet]["tasks"]
    assert t["task_name"] == "Replace Filter"
    assert unknown not in setups


async def test_midea_ac_lan_air_purifier_no_longer_gets_water_filter(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Fix: the 0xFC air purifier reuses tk filter1_life/filter2_life and was
    proposed 'Replace Water Filter'. Model string = '<type name> <model>'."""
    await setup_integration(hass, global_entry)
    fc = await _seed(
        hass,
        "midea_ac_lan",
        "fc1",
        "Bedroom Purifier",
        [("filter1_life", "filter1_life", "%", "70", None), ("filter2_life", "filter2_life", "%", "90", None)],
        model="Air Purifier FC-35",
    )
    ed = await _seed(
        hass,
        "midea_ac_lan",
        "ed1",
        "Kitchen Purifier",
        [("filter1_life", "filter1_life", "%", "70", None), ("filter3_life", "filter3_life", "%", "90", None)],
        model="Water Drinking Appliance 00000Q17",
    )
    toilet = await _seed(
        hass, "midea_ac_lan", "c2", "Toilet", [("filter_life", "filter_life", "%", "70", None)], model="Toilet 171H1"
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    (f,) = setups[fc]["tasks"]
    assert f["task_name"] == "Replace Filter" and len(f["entity_ids"]) == 2
    (w,) = setups[ed]["tasks"]
    assert w["task_name"] == "Replace Water Filter" and len(w["entity_ids"]) == 2
    (t,) = setups[toilet]["tasks"]
    assert t["task_name"] == "Replace Filter"


# ─── Electrolux OCP, GE Home, Candy ─────────────────────────────────────────


async def test_electrolux_ocp_purifier_filters_per_entity(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    single = await _seed(hass, "electrolux", "a9", "Pure A9", [("FilterLife", "filterlife", "%", "63", "Filter Life")])
    dual = await _seed(
        hass,
        "electrolux",
        "uh500",
        "UltimateHome 500",
        [
            ("FilterLife_1", "filterlife_1", "%", "80", "Filter Life"),
            ("FilterLife_2", "filterlife_2", "%", "30", "Filter Life 2"),
        ],
    )
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    (s,) = setups[single]["tasks"]
    assert s["task_name"] == "Replace Filter" and s["direction"] == "percent_left"
    assert [t["task_name"] for t in setups[dual]["tasks"]] == [
        "Replace Filter — Filter Life",
        "Replace Filter — Filter Life 2",
    ]


async def test_ge_home_fridge_and_whole_home_filter_by_suffix(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """GE sets no translation_key: '<serial> Water Filter Status Percent
    Remaining' → entity-id suffix. The inverted low-salt binary (ON while the
    salt is OK) is deliberately not cataloged."""
    await setup_integration(hass, global_entry)
    fridge = await _seed(
        hass,
        "ge_home",
        "fr1",
        "GE Fridge",
        [
            ("water_filter_status_percent_remaining", None, "%", "35", None),
            ("water_filter_status_days_remaining", None, "d", "60", None),
        ],
    )
    whf = await _seed(
        hass, "ge_home", "wf1", "Whole Home Filter", [("wh_filter_life_remaining_life_remaining", None, "%", "70", None)]
    )
    softener = await _seed(
        hass,
        "ge_home",
        "ws1",
        "Softener",
        [("wh_softener_low_salt", None, None, "on", None)],
        platform_domain="binary_sensor",
    )
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    (f,) = setups[fridge]["tasks"]
    assert f["task_name"] == "Replace Water Filter" and f["direction"] == "percent_left"
    assert f["entity_ids"] == ["sensor.ge_home_fr1_water_filter_status_percent_remaining"]
    (w,) = setups[whf]["tasks"]
    assert w["task_name"] == "Replace Water Filter"
    assert softener not in setups


async def test_candy_cycles_and_opt_in_maintenance_countdowns(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    washer = await _seed(
        hass,
        "candy",
        "wm1",
        "Washing machine",
        [
            ("wash_total_cycles", "wash_total_cycles", None, "412", None),
            ("wash_maint_limescale", "wash_maint_limescale", None, "37", None),
            ("wash_maint_filter", "wash_maint_filter", None, "0", None),
            ("wash_maint_full_checkup", "wash_maint_full_checkup", None, "12", None),
        ],
    )
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    t = _tasks(setups[washer])
    assert set(t) == {"Clean Tub", "Descaling", "Filter Cleaning"}  # full check-up: skipped
    assert t["Clean Tub"]["direction"] == "usage_delta" and t["Clean Tub"]["threshold"] == 30.0
    assert t["Descaling"]["direction"] == "value_below" and t["Descaling"]["threshold"] == 1.0
    assert t["Filter Cleaning"]["direction"] == "value_below" and t["Filter Cleaning"]["threshold"] == 1.0

    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": washer}]})
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("ha_device_id") == washer
    )
    triggers = {tk["name"]: tk["trigger_config"] for tk in obj.data[CONF_TASKS].values()}
    assert triggers["Clean Tub"]["type"] == "counter" and triggers["Clean Tub"]["trigger_delta_mode"] is True
    assert triggers["Filter Cleaning"]["type"] == "threshold" and triggers["Filter Cleaning"]["trigger_below"] == 1.0


# ─── Home IT: Unraid, UniFi UNAS, MOS ───────────────────────────────────────


async def test_nas_storage_cleanup_unraid_unas_mos(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    devices = {
        "unraid": await _seed(hass, "unraid", "t1", "Tower", [("array_usage", "array_usage", "%", "71.2", None)]),
        "unraid_api": await _seed(hass, "unraid_api", "t2", "Tower API", [("array_usage", "array_usage", "%", "71.2", None)]),
        "unraid_management_agent": await _seed(
            hass, "unraid_management_agent", "t3", "Tower UMA", [("array_usage", "array_usage", "%", "71.2", None)]
        ),
        "unifi_unas_rest": await _seed(
            hass, "unifi_unas_rest", "u1", "UNAS Pro", [("storage_usage", "storage_usage", "%", "40", None)]
        ),
        "mos": await _seed(hass, "mos", "p1", "Pool data", [("usage", "pool_usage", "%", "90", None)]),
    }
    # MQTT flavour: no translation_key, pool sensors named 'Storage Pool <n> Usage'.
    unas = await _seed(
        hass,
        "unifi_unas",
        "u2",
        "UNAS",
        [
            ("storage_pool_1_usage", None, "%", "40", None),
            ("storage_pool_2_usage", None, "%", "88", None),
            ("unas_cpu_usage", None, "%", "3", None),  # '..._usage' but not a pool
            ("storage_pool_1_size", None, "GB", "8000", None),
        ],
    )
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    for domain, dev in devices.items():
        (task,) = setups[dev]["tasks"]
        assert task["task_name"] == "Storage Cleanup", domain
        assert task["direction"] == "alert_above" and task["threshold"] == 85.0, domain
    (u,) = setups[unas]["tasks"]
    assert u["entity_ids"] == [
        "sensor.unifi_unas_u2_storage_pool_1_usage",
        "sensor.unifi_unas_u2_storage_pool_2_usage",
    ]


# ─── Engine: opt-in authoritative translation keys ──────────────────────────


def _reg_entry(entity_id: str, translation_key: str | None) -> er.RegistryEntry:
    """The two fields the matcher reads (a full RegistryEntry needs ~20)."""
    return cast(er.RegistryEntry, SimpleNamespace(entity_id=entity_id, translation_key=translation_key))


def test_entity_matches_translation_keys_authoritative_is_opt_in() -> None:
    """The id-suffix fallback exists for entities WITHOUT a translation_key.
    Flagged integrations keep it off entities that carry a DIFFERENT one; the
    default stays permissive because xiaomi_miot sets a noisy tk
    ('filter-filter_life_level') and is matched by suffix on purpose."""
    next_service = _reg_entry("sensor.bike_next_service_odometer", "next_service_odometer")
    odometer = _reg_entry("sensor.bike_odometer", "odometer")
    no_tk = _reg_entry("sensor.bike_total_odometer", None)
    xiaomi = _reg_entry("sensor.zhimi_v7_1234_filter_life_level", "filter-filter_life_level")

    assert _entity_matches(next_service, "odometer")  # the reported mis-claim (default)
    assert not _entity_matches(next_service, "odometer", tk_authoritative=True)
    assert _entity_matches(odometer, "odometer", tk_authoritative=True)
    assert _entity_matches(no_tk, "odometer", tk_authoritative=True)  # fallback kept without a tk
    # Why it is NOT the global default: the real xiaomi_miot entity.
    assert _entity_matches(xiaomi, "filter_life_level")
    assert not _entity_matches(xiaomi, "filter_life_level", tk_authoritative=True)
    assert SIGNATURES["xiaomi_miot"].translation_keys_authoritative is False


@pytest.mark.parametrize("authoritative", [False, True])
async def test_translation_keys_authoritative_scopes_discovery(
    hass: HomeAssistant, global_entry: MockConfigEntry, monkeypatch: pytest.MonkeyPatch, authoritative: bool
) -> None:
    """End to end through discovery (keys + require_sibling_keys): a flagged
    integration's odometer duty watches only the real odometer (and an
    untagged one), not the service/ride odometers with their own tks."""
    monkeypatch.setitem(
        SIGNATURES,
        "b_test_bike",
        IntegrationSignature(
            name="Test bike",
            source="test",
            verified="test",
            translation_keys_authoritative=authoritative,
            tasks=(
                ConsumableSignature(
                    ("odometer",), "Bike Service", "usage_delta", delta_units=1000, require_sibling_keys=("battery",)
                ),
            ),
        ),
    )
    await setup_integration(hass, global_entry)
    bike = await _seed(
        hass,
        "b_test_bike",
        "b1",
        "E-Bike",
        [
            ("odometer", "odometer", "km", "812", None),
            ("next_service_odometer", "next_service_odometer", "km", "2000", None),
            ("last_ride_start_odometer", "last_ride_start_odometer", "km", "790", None),
            ("trip_odometer", None, "km", "12", None),
            ("battery", None, "%", "80", None),  # sibling gate via suffix, no tk
        ],
    )
    (task,) = {s["device_id"]: s for s in discover_integration_setups(hass)}[bike]["tasks"]
    expected = {"sensor.b_test_bike_b1_odometer", "sensor.b_test_bike_b1_trip_odometer"}
    if not authoritative:
        expected |= {
            "sensor.b_test_bike_b1_next_service_odometer",
            "sensor.b_test_bike_b1_last_ride_start_odometer",
        }
    assert set(task["entity_ids"]) == expected
