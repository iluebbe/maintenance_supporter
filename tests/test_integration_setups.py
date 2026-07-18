"""Integration-aware suggested setups (roadmap): verified entity signatures
propose maintenance objects with sensor triggers PRE-WIRED.

The catalog (helpers/integration_signatures) is source-verified per entry;
these tests pin the matching (translation_key + entity-id-suffix fallback),
the unit-aware thresholds, the i18n completeness of every signature task name,
and the full discover -> adopt WS cycle against registry-seeded entities.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
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


def test_every_signature_task_name_is_fully_translated() -> None:
    """Tripwire: signature task names localize like template strings — a new
    catalog entry without its 17 translations fails here."""
    from custom_components.maintenance_supporter.templates_i18n import _T

    langs = ("de", "es", "fr", "it", "nl", "pt", "ru", "uk", "pl", "cs", "sv", "da", "nb", "fi", "ja", "hi", "zh")
    missing = []
    for domain, cat in SIGNATURES.items():
        for sig in cat.tasks:
            entry = _T.get(sig.task_name)
            if entry is None:
                missing.append(f"{domain}: {sig.task_name!r} has no translation entry")
            else:
                gaps = [lg for lg in langs if not entry.get(lg)]
                if gaps:
                    missing.append(f"{domain}: {sig.task_name!r} missing {gaps}")
            assert sig.direction in (
                "duration_left",
                "percent_left",
                "usage_above",
                "event_present",
                "usage_delta",
            )
            assert cat.source, f"{domain} lacks a source reference"
            assert cat.verified, f"{domain} lacks a verified date/ref"
    assert not missing, "\n".join(missing)


async def _seed_roborock(hass: HomeAssistant) -> str:
    """A fake Roborock device with two consumable sensors (translation_key
    match) — states in HOURS like HA's suggested display unit."""
    source = MockConfigEntry(domain="roborock", title="Roborock")
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=source.entry_id,
        identifiers={("roborock", "s7maxv")},
        name="Roborock S7 MaxV",
    )
    ent_reg = er.async_get(hass)
    for key in ("main_brush_time_left", "filter_time_left"):
        entry = ent_reg.async_get_or_create(
            "sensor",
            "roborock",
            f"s7_{key}",
            config_entry=source,
            device_id=device.id,
            translation_key=key,
            suggested_object_id=f"roborock_s7_{key}",
        )
        hass.states.async_set(entry.entity_id, "120", {"unit_of_measurement": "h"})
    return device.id


async def test_discover_matches_and_builds_unit_aware_thresholds(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)

    (setup,) = discover_integration_setups(hass)
    assert setup["device_id"] == device_id
    assert setup["integration"] == "roborock"
    assert setup["suggested_object_name"] == "Roborock S7 MaxV"
    by_name = {t["task_name"]: t for t in setup["tasks"]}
    assert set(by_name) == {"Replace Main Brush", "Replace Filter"}
    assert by_name["Replace Filter"]["threshold"] == 24.0


async def test_adopt_creates_object_with_prewired_triggers(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
        ws_discover_integration_setups,
    )

    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": device_id}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 2 and res["objects_created"] == 1

    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Roborock S7 MaxV"
    )
    assert obj.data[CONF_OBJECT].get("ha_device_id") == device_id
    tasks = list(obj.data[CONF_TASKS].values())
    assert len(tasks) == 2
    tc = next(t for t in tasks if "Filter" in t["name"])["trigger_config"]
    assert tc["type"] == "threshold"
    assert tc["trigger_below"] == 24.0
    assert tc["entity_ids"] == ["sensor.roborock_s7_filter_time_left"]
    assert tc["auto_complete_on_recovery"] is True

    # Re-discovery: the wired entities are now watched — nothing proposed.
    conn2 = make_ws_connection()
    await call_ws_handler(ws_discover_integration_setups, hass, conn2, {"id": 2, "type": "x"})
    assert conn2.send_result.call_args[0][1]["setups"] == []


async def test_adopt_subset_and_seconds_unit_scaling(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """task_names subset adopts only that task; a seconds-unit entity gets the
    threshold scaled (24 h -> 86400 s)."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)
    hass.states.async_set(
        "sensor.roborock_s7_filter_time_left", "432000", {"unit_of_measurement": "s"}
    )

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {
            "id": 1,
            "type": "x",
            "selections": [{"device_id": device_id, "task_names": ["Replace Filter"], "object_name": "Vac"}],
        },
    )
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 1
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Vac"
    )
    (task,) = obj.data[CONF_TASKS].values()
    assert task["trigger_config"]["trigger_below"] == 86400.0


async def test_adopt_unknown_device_reports_error(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": "ghost"}]},
    )
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 0
    assert res["errors"][0]["reason"] == "no suggestion for this device"


async def test_adopt_extends_existing_object_and_flags_bad_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A maintenance object already bound to the device is EXTENDED (no new
    object); an explicit bogus entry_id lands in errors, nothing created."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )
    from custom_components.maintenance_supporter.websocket.objects import async_create_object

    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)
    existing_id = await async_create_object(hass, name="My Vacuum", ha_device_id=device_id)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": device_id}]},
    )
    res = conn.send_result.call_args[0][1]
    assert res["objects_created"] == 0 and res["tasks_created"] == 2
    entry = hass.config_entries.async_get_entry(existing_id)
    assert len(entry.data[CONF_TASKS]) == 2  # tasks landed on the EXISTING object

    # Bogus explicit entry_id -> error row, nothing more created. The wired
    # entities are consumed, so re-seed a fresh device for a live suggestion.
    device2 = await _seed_roborock2(hass)
    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn2,
        {"id": 2, "type": "x", "selections": [{"device_id": device2, "entry_id": "bogus"}]},
    )
    res2 = conn2.send_result.call_args[0][1]
    assert res2["tasks_created"] == 0
    assert res2["errors"][0]["reason"] == "target object not found"


async def _seed_roborock2(hass: HomeAssistant) -> str:
    source = MockConfigEntry(domain="roborock", title="Roborock 2")
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=source.entry_id,
        identifiers={("roborock", "q8")},
        name="Roborock Q8",
    )
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get_or_create(
        "sensor",
        "roborock",
        "q8_filter_time_left",
        config_entry=source,
        device_id=device.id,
        translation_key="filter_time_left",
        suggested_object_id="roborock_q8_filter_time_left",
    )
    hass.states.async_set(entry.entity_id, "80", {"unit_of_measurement": "h"})
    return device.id


async def test_usage_above_direction_husqvarna_and_landroid(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Wear counters that count UP get trigger_above thresholds, unit-aware:
    Husqvarna blade time (h display) -> above 100; Landroid current blade
    runtime in native minutes -> above 6000."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    for domain, uid, key, unit, dev_name in (
        ("husqvarna_automower", "am1", "cutting_blade_usage_time", "h", "Automower 305"),
        ("landroid_cloud", "lr1", "blade_runtime_current", "min", "Landroid M500"),
    ):
        source = MockConfigEntry(domain=domain, title=domain)
        source.add_to_hass(hass)
        dev_reg = dr.async_get(hass)
        device = dev_reg.async_get_or_create(
            config_entry_id=source.entry_id,
            identifiers={(domain, uid)},
            name=dev_name,
        )
        ent_reg = er.async_get(hass)
        entry = ent_reg.async_get_or_create(
            "sensor", domain, f"{uid}_{key}",
            config_entry=source, device_id=device.id, translation_key=key,
            suggested_object_id=f"{uid}_{key}",
        )
        hass.states.async_set(entry.entity_id, "42", {"unit_of_measurement": unit})

    setups = {s2["integration"]: s2 for s2 in discover_integration_setups(hass)}
    assert set(setups) == {"husqvarna_automower", "landroid_cloud"}
    hq = setups["husqvarna_automower"]["tasks"][0]
    assert hq["task_name"] == "Replace Blades" and hq["direction"] == "usage_above"
    assert hq["threshold"] == 100.0  # hours display -> 100 h
    lr = setups["landroid_cloud"]["tasks"][0]
    assert lr["threshold"] == 6000.0  # native minutes -> 100 h * 60

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": setups["husqvarna_automower"]["device_id"]}]},
    )
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 1
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Automower 305"
    )
    (task,) = obj.data[CONF_TASKS].values()
    tc = task["trigger_config"]
    # Resettable wear counters wire a DELTA counter from an explicit 0 baseline
    # (absolute at adoption; manual completion re-baselines instead of
    # re-firing; a device-side reset re-baselines AND auto-completes).
    assert tc["type"] == "counter" and tc["trigger_delta_mode"] is True
    assert tc["trigger_target_value"] == 100.0 and tc["trigger_baseline_value"] == 0
    assert tc["auto_complete_on_recovery"] is True


async def _seed_sensor(
    hass: HomeAssistant,
    domain: str,
    uid: str,
    device_name: str,
    entities: list[tuple[str, str | None, str | None]],
    area_name: str | None = None,
) -> str:
    """Seed one device of `domain` with (key, translation_key, unit) sensors.
    A None translation_key seeds an entity_id-suffix-only match (HACS style)."""
    source = MockConfigEntry(domain=domain, title=domain)
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=device_name
    )
    if area_name is not None:
        from homeassistant.helpers import area_registry as ar

        area = ar.async_get(hass).async_get_or_create(area_name)
        dev_reg.async_update_device(device.id, area_id=area.id)
    ent_reg = er.async_get(hass)
    for key, tkey, unit in entities:
        entry = ent_reg.async_get_or_create(
            "sensor", domain, f"{uid}_{key}",
            config_entry=source, device_id=device.id, translation_key=tkey,
            suggested_object_id=f"{domain}_{uid}_{key}",
        )
        attrs = {"unit_of_measurement": unit} if unit is not None else {}
        hass.states.async_set(entry.entity_id, "40", attrs)
    return device.id


async def test_lg_thinq_shared_key_unit_disambiguation(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """LG ThinQ reuses translation_key 'filter_lifetime' for an HOURS sensor
    (AC) and a PERCENT sensor (purifier). The unit-aware matcher must route the
    hours entity to duration_left and the percent entity to percent_left."""
    await setup_integration(hass, global_entry)
    ac = await _seed_sensor(
        hass, "lg_thinq", "ac1", "Living Room AC",
        [("filter_lifetime", "filter_lifetime", "h")],
    )
    purifier = await _seed_sensor(
        hass, "lg_thinq", "ap1", "Air Purifier",
        [
            ("filter_remain_percent", "filter_lifetime", "%"),
            ("top_filter", "top_filter_remain_percent", "%"),
        ],
    )
    fridge = await _seed_sensor(
        hass, "lg_thinq", "rf1", "Fridge",
        [
            ("wf1", "water_filter_1_remain_percent", "%"),
            ("wf2", "water_filter_2_remain_percent", "%"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (ac_task,) = setups[ac]["tasks"]
    assert ac_task["task_name"] == "Replace Filter"
    assert ac_task["direction"] == "duration_left" and ac_task["threshold"] == 24.0

    (pf_task,) = setups[purifier]["tasks"]
    assert pf_task["task_name"] == "Replace Filter"
    assert pf_task["direction"] == "percent_left" and pf_task["threshold"] == 10.0
    assert len(pf_task["entity_ids"]) == 2  # both % filters -> one task, any-low

    (rf_task,) = setups[fridge]["tasks"]
    assert rf_task["task_name"] == "Replace Water Filter"
    assert rf_task["direction"] == "percent_left" and len(rf_task["entity_ids"]) == 2

    # Adopt the AC: the trigger must use the duration branch (below 24 h), NOT
    # the collided percent branch.
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": ac}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Living Room AC"
    )
    (task,) = obj.data[CONF_TASKS].values()
    assert task["trigger_config"]["trigger_below"] == 24.0


async def test_smartthinq_entity_id_suffix_and_tub_clean_counter(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """HACS smartthinq_sensors set no translation_key -> matched by entity_id
    suffix; the unitless tub-clean counter is a usage_above wear counter."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    washer = await _seed_sensor(
        hass, "smartthinq_sensors", "w1", "Washing Machine",
        [("tub_clean_counter", None, None), ("filter_remaining_life", None, "%")],
    )

    (setup,) = discover_integration_setups(hass)
    by_name = {t["task_name"]: t for t in setup["tasks"]}
    assert set(by_name) == {"Clean Tub", "Replace Filter"}
    assert by_name["Clean Tub"]["direction"] == "usage_above"
    assert by_name["Clean Tub"]["threshold"] == 30.0
    assert by_name["Replace Filter"]["direction"] == "percent_left"

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": washer}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Washing Machine"
    )
    tub = next(t for t in obj.data[CONF_TASKS].values() if "Tub" in t["name"])["trigger_config"]
    assert tub["type"] == "counter" and tub["trigger_delta_mode"] is True
    assert tub["trigger_target_value"] == 30.0 and tub["trigger_baseline_value"] == 0
    assert tub["auto_complete_on_recovery"] is True


async def test_home_connect_event_present_state_latch(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Home Connect exposes ENUM event sensors (present/off), not numeric
    consumables. They must adopt as a state_change LATCH on 'present' with
    auto-complete-on-recovery — one task per event, single-entity."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    dw = await _seed_sensor(
        hass, "home_connect", "dw1", "Dishwasher",
        [
            ("salt_nearly_empty", "salt_nearly_empty", None),
            ("rinse_aid_nearly_empty", "rinse_aid_nearly_empty", None),
        ],
    )
    # A numeric sensor sharing an event key must NOT be mistaken for an event.
    ent_reg = er.async_get(hass)
    stray = ent_reg.async_get_or_create(
        "sensor", "home_connect", "dw1_bogus",
        translation_key="salt_nearly_empty", suggested_object_id="home_connect_dw1_num",
    )
    hass.states.async_set(stray.entity_id, "50", {"unit_of_measurement": "%"})

    (setup,) = discover_integration_setups(hass)
    by_name = {t["task_name"]: t for t in setup["tasks"]}
    assert set(by_name) == {"Refill Salt", "Refill Rinse Aid"}
    salt = by_name["Refill Salt"]
    assert salt["direction"] == "event_present" and salt["threshold"] == 0.0
    # The %-unit stray was rejected: exactly the ENUM event entity is watched.
    assert salt["entity_ids"] == ["sensor.home_connect_dw1_salt_nearly_empty"]

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": dw, "task_names": ["Refill Salt"]}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Dishwasher"
    )
    (task,) = obj.data[CONF_TASKS].values()
    tc = task["trigger_config"]
    assert tc["type"] == "state_change"
    assert tc["trigger_to_state"] == "present" and tc["trigger_target_changes"] == 1
    assert tc["entity_id"] == "sensor.home_connect_dw1_salt_nearly_empty"
    assert tc["auto_complete_on_recovery"] is True


async def test_xiaomi_miot_percent_filter_and_brush(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """xiaomi_miot builds generic MIoT-spec entities; we match the percent
    filter/brush life by entity_id suffix (the property name). One % task per
    filter — the days/used-hours counterparts of the same filter are NOT
    cataloged, so a device gets exactly one 'Replace Filter'."""
    await setup_integration(hass, global_entry)
    purifier = await _seed_sensor(
        hass, "xiaomi_miot", "ap1", "Air Purifier",
        [
            ("filter_life_level", None, "%"),
            # Same filter, different views — must NOT create extra tasks.
            ("filter_left_time", None, "d"),
            ("filter_used_time", None, "h"),
        ],
    )
    vac = await _seed_sensor(
        hass, "xiaomi_miot", "v1", "Robot Vacuum",
        [("filter_life_level", None, "%"), ("brush_life_level", None, "%")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (pf,) = setups[purifier]["tasks"]  # exactly one task despite three filter sensors
    assert pf["task_name"] == "Replace Filter"
    assert pf["direction"] == "percent_left" and pf["threshold"] == 10.0
    assert pf["entity_ids"] == ["sensor.xiaomi_miot_ap1_filter_life_level"]

    vt = {t["task_name"]: t for t in setups[vac]["tasks"]}
    assert set(vt) == {"Replace Filter", "Replace Main Brush"}
    assert vt["Replace Main Brush"]["direction"] == "percent_left"


async def test_usage_delta_lifetime_counters_bambu_and_vicare(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Lifetime counters with no reset (printer usage hours, burner hours) get
    a DELTA counter trigger: fire every N hours of use since the last
    completion; adopting wires type=counter with trigger_delta_mode."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    printer = await _seed_sensor(
        hass, "bambu_lab", "p1s", "Bambu P1S",
        [("total_usage_hours", "total_usage_hours", "h")],
    )
    boiler = await _seed_sensor(
        hass, "vicare", "vb1", "Vitodens",
        [("burner_hours", "burner_hours", "h")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (pt,) = setups[printer]["tasks"]
    assert pt["task_name"] == "Lubricate Rails and Rods"
    assert pt["direction"] == "usage_delta" and pt["threshold"] == 500.0

    (bt,) = setups[boiler]["tasks"]
    assert bt["task_name"] == "Annual Inspection"
    assert bt["direction"] == "usage_delta" and bt["threshold"] == 2000.0

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": printer}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Bambu P1S"
    )
    (task,) = obj.data[CONF_TASKS].values()
    tc = task["trigger_config"]
    assert tc["type"] == "counter"
    assert tc["trigger_delta_mode"] is True and tc["trigger_target_value"] == 500.0
    assert tc["entity_id"] == "sensor.bambu_lab_p1s_total_usage_hours"
    assert "auto_complete_on_recovery" not in tc  # lifetime counters never recover


async def test_car_odometer_usage_delta_km_and_miles(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Car odometers (lifetime km/mi counters) propose 'Annual Service' every
    15,000 km via the delta counter; a miles-display odometer gets the target
    converted (15000 km -> 9320.55 mi)."""
    await setup_integration(hass, global_entry)
    kia = await _seed_sensor(
        hass, "kia_uvo", "ev6", "Kia EV6",
        [("odometer", "odometer", "km")],
    )
    tesla = await _seed_sensor(
        hass, "tesla_custom", "m3", "Model 3",
        [("odometer", None, "mi")],  # no translation_key -> suffix match
    )
    renault = await _seed_sensor(
        hass, "renault", "zoe", "Zoe",
        [("mileage", "mileage", "km")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    for dev in (kia, renault):
        (t,) = setups[dev]["tasks"]
        assert t["task_name"] == "Annual Service" and t["direction"] == "usage_delta"
        assert t["threshold"] == 15000.0
    (tt,) = setups[tesla]["tasks"]
    assert tt["threshold"] == 9320.55  # 15000 km in miles


async def test_midea_water_purifier_and_xiaomi_home_infix(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """midea_ac_lan: three water-purifier filter stages (translation_key
    filter1/2/3_life, %) collapse into ONE any-low 'Replace Water Filter' task.
    xiaomi_home embeds the property mid-entity_id with a _p_{siid}_{piid} tail
    and no translation_key — matched via the '_<key>_p_' infix."""
    await setup_integration(hass, global_entry)
    purifier = await _seed_sensor(
        hass, "midea_ac_lan", "wp1", "Water Purifier",
        [
            ("life1", "filter1_life", "%"),
            ("life2", "filter2_life", "%"),
            ("life3", "filter3_life", "%"),
        ],
    )
    # xiaomi_home style: property name mid-string, _p_siid_piid tail, no tk.
    xh = await _seed_sensor(
        hass, "xiaomi_home", "zhimi1", "Zhimi Purifier",
        [("filter_life_level_p_4_1", None, "%")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (mt,) = setups[purifier]["tasks"]
    assert mt["task_name"] == "Replace Water Filter" and mt["direction"] == "percent_left"
    assert len(mt["entity_ids"]) == 3  # all three stages, entity_logic any

    (xt,) = setups[xh]["tasks"]
    assert xt["task_name"] == "Replace Filter"
    assert xt["entity_ids"] == ["sensor.xiaomi_home_zhimi1_filter_life_level_p_4_1"]


async def test_miele_fill_levels_dishwasher_and_washer(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Miele exposes real PERCENT fill levels: dishwasher salt/rinse-aid/
    PowerDisk, washer TwinDos containers — the two detergent reservoirs
    collapse into one any-low 'Refill Detergent' task per device."""
    await setup_integration(hass, global_entry)
    dw = await _seed_sensor(
        hass, "miele", "g7460", "Miele Dishwasher",
        [
            ("salt_level", "salt_level", "%"),
            ("rinse_aid_level", "rinse_aid_level", "%"),
            ("power_disk_level", "power_disk_level", "%"),
        ],
    )
    washer = await _seed_sensor(
        hass, "miele", "wwe860", "Miele Washer",
        [
            ("twin_dos_1_level", "twin_dos_1_level", "%"),
            ("twin_dos_2_level", "twin_dos_2_level", "%"),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    dw_tasks = {t["task_name"]: t for t in setups[dw]["tasks"]}
    assert set(dw_tasks) == {"Refill Salt", "Refill Rinse Aid", "Refill Detergent"}
    assert all(t["direction"] == "percent_left" and t["threshold"] == 10.0 for t in dw_tasks.values())

    (w_task,) = setups[washer]["tasks"]
    assert w_task["task_name"] == "Refill Detergent"
    assert len(w_task["entity_ids"]) == 2  # both TwinDos containers, any-low


async def test_vicare_ventilation_filter_signature(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """ViCare exposes a real ventilation-filter countdown (filter_remaining_hours,
    hours) -> duration_left, the first heating-domain signature."""
    await setup_integration(hass, global_entry)
    dev = await _seed_sensor(
        hass, "vicare", "vh1", "Vitovent",
        [("filter_remaining_hours", "filter_remaining_hours", "h")],
        area_name="Basement",
    )
    (setup,) = discover_integration_setups(hass)
    assert setup["device_id"] == dev and setup["integration"] == "vicare"
    assert setup["area_name"] == "Basement"  # device area flows into the suggestion
    (task,) = setup["tasks"]
    assert task["task_name"] == "Replace Filter" and task["direction"] == "duration_left"
    assert task["threshold"] == 24.0
