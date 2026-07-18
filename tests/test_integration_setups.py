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
                "runtime_hours",
                "alert_above",
                "value_below",
                "cycle_count",
            )
            # Empty keys = "the device's single entity of that domain" — only
            # safe for non-sensor domains (a sensor catalog entry without keys
            # would swallow every sensor of the integration).
            assert sig.keys or sig.entity_domain != "sensor", (
                f"{domain}: {sig.task_name!r} has empty keys on a sensor signature"
            )
            assert sig.direction not in ("runtime_hours", "cycle_count") or sig.on_states, (
                f"{domain}: {sig.task_name!r} runtime/cycle signature needs on_states"
            )
            assert cat.source, f"{domain} lacks a source reference"
            assert cat.verified, f"{domain} lacks a verified date/ref"
    assert not missing, "\n".join(missing)


def test_every_signature_has_a_drift_probe() -> None:
    """Tripwire: scripts/signature_probes.json (the weekly upstream drift
    watchdog's input) must cover exactly the SIGNATURES domains — a new
    catalog entry without a probe would silently escape freshness control."""
    import json
    from pathlib import Path

    probes_file = Path(__file__).parent.parent / "scripts" / "signature_probes.json"
    if not probes_file.exists():
        # The ha-maint dev container only mounts custom_components + tests;
        # CI checks out the full repo and enforces this tripwire there.
        pytest.skip("scripts/ not mounted in this environment (enforced in CI)")
    probes = json.loads(probes_file.read_text(encoding="utf-8"))
    probes.pop("_comment", None)
    assert set(probes) == set(SIGNATURES), (
        f"probe/catalog mismatch: only-in-probes={set(probes) - set(SIGNATURES)}, "
        f"missing-probes={set(SIGNATURES) - set(probes)}"
    )
    for domain, probe in probes.items():
        assert probe.get("urls") and probe.get("strings"), f"{domain}: empty probe"


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

    # Husqvarna also exposes lifetime statistics -> extra derived duties.
    ent_reg = er.async_get(hass)
    stat = ent_reg.async_get_or_create(
        "sensor", "husqvarna_automower", "am1_total_cutting_time",
        config_entry=hass.config_entries.async_entries("husqvarna_automower")[0],
        device_id=dr.async_get(hass).async_get_device({("husqvarna_automower", "am1")}).id,
        translation_key="total_cutting_time",
        suggested_object_id="am1_total_cutting_time",
    )
    hass.states.async_set(stat.entity_id, "310", {"unit_of_measurement": "h"})

    setups = {s2["integration"]: s2 for s2 in discover_integration_setups(hass)}
    assert set(setups) == {"husqvarna_automower", "landroid_cloud"}
    hq_by_name = {t["task_name"]: t for t in setups["husqvarna_automower"]["tasks"]}
    assert set(hq_by_name) == {"Replace Blades", "Clean Undercarriage"}
    hq = hq_by_name["Replace Blades"]
    assert hq["direction"] == "usage_above"
    assert hq["threshold"] == 100.0  # hours display -> 100 h
    assert hq_by_name["Clean Undercarriage"]["threshold"] == 25.0
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
    assert res["tasks_created"] == 2  # blades + undercarriage (multi-duty adopt-all)
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Automower 305"
    )
    task = next(t for t in obj.data[CONF_TASKS].values() if "Undercarriage" not in t["name"])
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
    model: str | None = None,
) -> str:
    """Seed one device of `domain` with (key, translation_key, unit) sensors.
    A None translation_key seeds an entity_id-suffix-only match (HACS style)."""
    source = MockConfigEntry(domain=domain, title=domain)
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=device_name,
        model=model,
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
        by_name = {t["task_name"]: t for t in setups[dev]["tasks"]}
        assert set(by_name) == {"Annual Service", "Tire Rotation"}  # one odometer, two duties
        assert by_name["Annual Service"]["threshold"] == 15000.0
        assert by_name["Tire Rotation"]["threshold"] == 10000.0
    tesla_by_name = {t["task_name"]: t for t in setups[tesla]["tasks"]}
    assert tesla_by_name["Annual Service"]["threshold"] == 9320.55  # 15000 km in miles
    assert tesla_by_name["Tire Rotation"]["threshold"] == 6213.7  # 10000 km in miles


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


async def test_navimow_runtime_hours_on_lawn_mower_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Navimow exposes NO usage counter — the signature targets the device's
    lawn_mower STATE entity (empty keys = the single entity of that domain) and
    wires a runtime trigger: the engine accumulates 'mowing' time itself and
    fires after 100 hours; completing resets the accumulation."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    source = MockConfigEntry(domain="navimow", title="Navimow")
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=source.entry_id, identifiers={("navimow", "h1500")}, name="Navimow H1500"
    )
    ent_reg = er.async_get(hass)
    mower = ent_reg.async_get_or_create(
        "lawn_mower", "navimow", "h1500",
        config_entry=source, device_id=device.id, suggested_object_id="navimow_h1500",
    )
    hass.states.async_set(mower.entity_id, "docked")
    # A sensor on the same device must NOT be swallowed by the empty-keys sig.
    battery = ent_reg.async_get_or_create(
        "sensor", "navimow", "h1500_battery",
        config_entry=source, device_id=device.id, suggested_object_id="navimow_h1500_battery",
    )
    hass.states.async_set(battery.entity_id, "80", {"unit_of_measurement": "%"})

    (setup,) = discover_integration_setups(hass)
    by_name = {t["task_name"]: t for t in setup["tasks"]}
    assert set(by_name) == {"Replace Blades", "Clean Undercarriage"}  # multi-duty
    blades = by_name["Replace Blades"]
    assert blades["direction"] == "runtime_hours" and blades["threshold"] == 100.0
    assert blades["entity_ids"] == ["lawn_mower.navimow_h1500"]
    assert by_name["Clean Undercarriage"]["threshold"] == 25.0

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": device.id}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Navimow H1500"
    )
    tasks = list(obj.data[CONF_TASKS].values())
    assert len(tasks) == 2  # both duties adopted, both watching the mower
    blades_task = next(t for t in tasks if "Blades" in t["name"] or "Messer" in t["name"])
    tc = blades_task["trigger_config"]
    assert tc["type"] == "runtime"
    assert tc["trigger_on_states"] == ["mowing"] and tc["trigger_runtime_hours"] == 100.0
    assert tc["entity_id"] == "lawn_mower.navimow_h1500"


async def test_gardena_mower_operating_hours_delta(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Gardena Sileno mowers expose a lifetime operating_hours counter (no
    translation_key -> entity_id-suffix match) -> Replace Blades every 100
    mowing-hours via the delta counter."""
    await setup_integration(hass, global_entry)
    mower = await _seed_sensor(
        hass, "gardena_smart_system", "sileno1", "Sileno City",
        [("operating_hours", None, "h")],
    )
    (setup,) = discover_integration_setups(hass)
    assert setup["device_id"] == mower
    # Multi-duty: ONE operating_hours entity backs BOTH mower duties.
    by_name = {t["task_name"]: t for t in setup["tasks"]}
    assert set(by_name) == {"Replace Blades", "Clean Undercarriage"}
    assert by_name["Replace Blades"]["threshold"] == 100.0
    assert by_name["Clean Undercarriage"]["threshold"] == 25.0
    assert (
        by_name["Replace Blades"]["entity_ids"] == by_name["Clean Undercarriage"]["entity_ids"]
    )


async def test_miele_fill_levels_dishwasher_and_washer(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Miele exposes real PERCENT fill levels: dishwasher salt/rinse-aid/
    PowerDisk, washer TwinDos containers — the two detergent reservoirs
    collapse into one any-low 'Refill Detergent' task per device. Both
    appliance types carry an identical 'status' ENUM sensor: the sibling-gated
    Clean Tub signature must fire ONLY on the washer."""
    await setup_integration(hass, global_entry)
    dw = await _seed_sensor(
        hass, "miele", "g7460", "Miele Dishwasher",
        [
            ("salt_level", "salt_level", "%"),
            ("rinse_aid_level", "rinse_aid_level", "%"),
            ("power_disk_level", "power_disk_level", "%"),
            ("state_status", "status", None),  # same key as the washer's!
        ],
    )
    washer = await _seed_sensor(
        hass, "miele", "wwe860", "Miele Washer",
        [
            ("twin_dos_1_level", "twin_dos_1_level", "%"),
            ("twin_dos_2_level", "twin_dos_2_level", "%"),
            ("state_status", "status", None),
        ],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    dw_tasks = {t["task_name"]: t for t in setups[dw]["tasks"]}
    # No Clean Tub on the dishwasher despite the identical status sensor.
    assert set(dw_tasks) == {"Refill Salt", "Refill Rinse Aid", "Refill Detergent"}
    assert all(t["direction"] == "percent_left" and t["threshold"] == 10.0 for t in dw_tasks.values())

    w_tasks = {t["task_name"]: t for t in setups[washer]["tasks"]}
    assert set(w_tasks) == {"Refill Detergent", "Clean Tub"}  # sibling gate passed
    assert len(w_tasks["Refill Detergent"]["entity_ids"]) == 2  # both TwinDos, any-low
    tub = w_tasks["Clean Tub"]
    assert tub["direction"] == "runtime_hours" and tub["threshold"] == 60.0


async def test_bambu_model_gate_enclosed_vs_open_frame(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Device-model gate: the chamber-filter duty applies to enclosed printers
    (registry model X1C/P1S/...) only — an open-frame A1 gets just the
    lubrication task from the same usage-hours entity."""
    await setup_integration(hass, global_entry)
    x1c = await _seed_sensor(
        hass, "bambu_lab", "x1c1", "X1C_123",
        [("total_usage_hours", "total_usage_hours", "h")], model="X1C",
    )
    a1 = await _seed_sensor(
        hass, "bambu_lab", "a1m1", "A1_456",
        [("total_usage_hours", "total_usage_hours", "h")], model="A1MINI",
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    x1_tasks = {t["task_name"]: t for t in setups[x1c]["tasks"]}
    # Enclosed CoreXY: filter + carbon rods on top of the generic lubrication.
    assert set(x1_tasks) == {"Lubricate Rails and Rods", "Replace Filter", "Clean Carbon Rods"}
    assert x1_tasks["Replace Filter"]["threshold"] == 300.0
    assert x1_tasks["Clean Carbon Rods"]["threshold"] == 100.0

    a1_tasks = {t["task_name"]: t for t in setups[a1]["tasks"]}
    # Open-frame bed-slinger: purge wiper instead of filter/carbon rods.
    assert set(a1_tasks) == {"Lubricate Rails and Rods", "Replace Purge Wiper"}
    assert a1_tasks["Replace Purge Wiper"]["threshold"] == 300.0


async def test_bambu_ams_desiccant_alert_above_and_lite_excluded(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """AMS units (separate devices) propose desiccant replacement via a plain
    above-threshold on their humidity sensor (auto-resolving when fresh
    desiccant pulls the value down); the AMS Lite has no desiccant compartment
    and is excluded despite the 'AMS' substring."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    ams = await _seed_sensor(
        hass, "bambu_lab", "ams1", "AMS_2_Pro_1",
        [("humidity", "humidity", "%")], model="AMS 2 Pro",
    )
    lite = await _seed_sensor(
        hass, "bambu_lab", "amsl1", "AMS_Lite_1",
        [("humidity", "humidity", "%")], model="AMS Lite",
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    assert lite not in setups  # no desiccant compartment -> no proposal

    (task,) = setups[ams]["tasks"]
    assert task["task_name"] == "Replace Desiccant" and task["direction"] == "alert_above"
    assert task["threshold"] == 40.0

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": ams}]},
    )
    assert not conn.send_error.called
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "AMS_2_Pro_1"
    )
    (t,) = obj.data[CONF_TASKS].values()
    tc = t["trigger_config"]
    assert tc["type"] == "threshold" and tc["trigger_above"] == 40.0
    assert tc["auto_complete_on_recovery"] is True and "trigger_below" not in tc


async def test_second_identical_device_still_proposed_after_first_adopted(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Duplicate suppression is per ENTITY, not per device type: adopting the
    first of two identical vacuums removes ITS proposals, while the second
    device keeps being proposed."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    dev_a = await _seed_sensor(
        hass, "roborock", "twin_a", "Roborock Upstairs",
        [("filter_time_left", "filter_time_left", "h")],
    )
    dev_b = await _seed_sensor(
        hass, "roborock", "twin_b", "Roborock Downstairs",
        [("filter_time_left", "filter_time_left", "h")],
    )
    assert {s["device_id"] for s in discover_integration_setups(hass)} == {dev_a, dev_b}

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": dev_a}]},
    )
    assert not conn.send_error.called

    # First device fully adopted -> gone; the second twin is still proposed.
    remaining = discover_integration_setups(hass)
    assert {s["device_id"] for s in remaining} == {dev_b}


async def test_existing_task_name_on_bound_object_not_reproposed(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A manually created CALENDAR task (no watched entity) with the same duty
    name on the device-bound object must suppress the proposal — in discovery
    AND as an adopt-time second layer (any catalog language counts)."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )
    from uuid import uuid4

    from custom_components.maintenance_supporter.websocket.objects import async_create_object
    from custom_components.maintenance_supporter.websocket.tasks_persist import (
        async_persist_task,
    )

    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)  # Replace Main Brush + Replace Filter
    entry_id = await async_create_object(hass, name="Vac", ha_device_id=device_id)
    entry = hass.config_entries.async_get_entry(entry_id)
    # German name of "Replace Filter" — a calendar task, watches no entity.
    await async_persist_task(
        hass, entry,
        {
            "id": uuid4().hex,
            "object_id": entry.data[CONF_OBJECT]["id"],
            "name": "Filter ersetzen",
            "type": "replacement",
            "enabled": True,
            "schedule": {"kind": "interval", "interval_days": 90},
        },
    )

    (setup,) = discover_integration_setups(hass)
    names = {t["task_name"] for t in setup["tasks"]}
    assert names == {"Replace Main Brush"}  # Replace Filter suppressed by name

    # Adopt-time layer: even a forced full selection cannot duplicate it.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": device_id}]},
    )
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 1  # only Replace Main Brush
    entry = hass.config_entries.async_get_entry(entry_id)
    names_after = [t["name"] for t in entry.data[CONF_TASKS].values()]
    assert sorted(names_after) == ["Filter ersetzen", "Replace Main Brush"]


async def test_prod_gap_wave_nas_wallbox_boiler(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Prod-registry gap wave: NAS volume usage fires ABOVE 85 % (cleanup
    lowers it -> auto-resolve); Easee cable inspection every 5,000 kWh of
    lifetime energy; the bosch component names entities WITHOUT a device
    prefix (sensor.system_pressure) -> exact-object-id match + value_below."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    nas = await _seed_sensor(
        hass, "synology_dsm", "ds218", "Synology DS218+",
        [("volume_percentage_used", "volume_percentage_used", "%")],
    )
    wallbox = await _seed_sensor(
        hass, "easee", "eh1", "Easee Home",
        [("lifetime_energy", "lifetime_energy", "kWh")],
    )
    # bosch: unprefixed entity id, no translation_key.
    source = MockConfigEntry(domain="bosch", title="Bosch")
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    boiler = dev_reg.async_get_or_create(
        config_entry_id=source.entry_id, identifiers={("bosch", "rc300")}, name="Buderus RC300"
    )
    ent_reg = er.async_get(hass)
    pressure = ent_reg.async_get_or_create(
        "sensor", "bosch", "rc300_pressure",
        config_entry=source, device_id=boiler.id, suggested_object_id="system_pressure",
    )
    assert pressure.entity_id == "sensor.system_pressure"
    hass.states.async_set(pressure.entity_id, "1.5", {"unit_of_measurement": "bar"})

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (nas_task,) = setups[nas]["tasks"]
    assert nas_task["task_name"] == "Storage Cleanup" and nas_task["direction"] == "alert_above"
    assert nas_task["threshold"] == 85.0

    (wb_task,) = setups[wallbox]["tasks"]
    assert wb_task["task_name"] == "Inspect Cable and Plug"
    assert wb_task["direction"] == "usage_delta" and wb_task["threshold"] == 5000.0

    (b_task,) = setups[boiler.id]["tasks"]
    assert b_task["task_name"] == "Refill Heating Water" and b_task["direction"] == "value_below"
    assert b_task["entity_ids"] == ["sensor.system_pressure"]

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": boiler.id}]},
    )
    assert not conn.send_error.called
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Buderus RC300"
    )
    (t,) = obj.data[CONF_TASKS].values()
    tc = t["trigger_config"]
    assert tc["type"] == "threshold" and tc["trigger_below"] == 1.0
    assert tc["auto_complete_on_recovery"] is True


async def test_safety_binary_sensors_adoptable(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """device_class safety (NAS disk-health thresholds) and tamper are now
    adoptable like problem sensors; other classes stay excluded."""
    from custom_components.maintenance_supporter.helpers.problem_sensors import (
        discover_problem_sensors,
    )

    await setup_integration(hass, global_entry)
    hass.states.async_set(
        "binary_sensor.nas_disk_health", "off",
        {"device_class": "safety", "friendly_name": "Disk health threshold"},
    )
    hass.states.async_set(
        "binary_sensor.front_door", "off", {"device_class": "door", "friendly_name": "Door"}
    )
    ids = {s["entity_id"] for s in discover_problem_sensors(hass)}
    assert "binary_sensor.nas_disk_health" in ids
    assert "binary_sensor.front_door" not in ids


async def test_wallbox_energy_and_lock_cycle_wave(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """KEBA (kWh) and go-e (native Wh -> converted target) wallboxes propose
    cable inspection by delivered energy; Nuki and Matter locks get
    engine-counted locking cycles (state_change, 500 transitions to
    'locked', reset on completion)."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    keba = await _seed_sensor(
        hass, "keba", "p30", "KEBA P30",
        [("total_energy", None, "kWh")],
    )
    goe = await _seed_sensor(
        hass, "goecharger_api2", "g11", "go-e Charger",
        [("eto", None, "Wh")],
    )
    # Locks: nuki + matter, one lock entity per device.
    locks = {}
    for domain, uid, name in (
        ("nuki", "n1", "Front Door"),
        ("matter", "m1", "Back Door"),
        ("zwave_js", "z1", "Cellar Door"),
        ("tedee", "t1", "Side Door"),
    ):
        source = MockConfigEntry(domain=domain, title=domain)
        source.add_to_hass(hass)
        dev = dr.async_get(hass).async_get_or_create(
            config_entry_id=source.entry_id, identifiers={(domain, uid)}, name=name
        )
        lock = er.async_get(hass).async_get_or_create(
            "lock", domain, uid, config_entry=source, device_id=dev.id,
            suggested_object_id=f"{domain}_{uid}",
        )
        hass.states.async_set(lock.entity_id, "locked")
        locks[domain] = dev.id

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (kt,) = setups[keba]["tasks"]
    assert kt["task_name"] == "Inspect Cable and Plug" and kt["threshold"] == 5000.0
    (gt,) = setups[goe]["tasks"]
    assert gt["threshold"] == 5000000.0  # 5,000 kWh in native Wh

    for domain in ("nuki", "matter", "zwave_js", "tedee"):
        (lt,) = setups[locks[domain]]["tasks"]
        assert lt["task_name"] == "Lubricate Cylinder" and lt["direction"] == "cycle_count"
        assert lt["threshold"] == 500.0

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "x", "selections": [{"device_id": locks["nuki"]}]},
    )
    assert not conn.send_error.called
    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Front Door"
    )
    (t,) = obj.data[CONF_TASKS].values()
    tc = t["trigger_config"]
    assert tc["type"] == "state_change"
    assert tc["trigger_to_state"] == "locked" and tc["trigger_target_changes"] == 500
    assert tc["entity_id"] == "lock.nuki_n1"
    assert "auto_complete_on_recovery" not in tc  # cycles don't recover


async def test_candidate_wave_dyson_weback_mercedes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Third candidate wave: Dyson HEPA+carbon filters collapse into one
    any-low percent task; WeBack (no sensors at all) gets TWO engine-runtime
    duties on its vacuum entity; a Mercedes odometer carries both car duties."""
    await setup_integration(hass, global_entry)
    dyson = await _seed_sensor(
        hass, "hass_dyson", "d1", "Dyson Purifier",
        [
            ("hepa_filter_life", "filter_life", "%"),
            ("carbon_filter_life", "filter_life", "%"),
        ],
    )
    # WeBack: only a vacuum STATE entity, nothing else.
    source = MockConfigEntry(domain="weback_vacuum", title="WeBack")
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    wb_dev = dev_reg.async_get_or_create(
        config_entry_id=source.entry_id, identifiers={("weback_vacuum", "wb1")}, name="WeBack Robot"
    )
    ent_reg = er.async_get(hass)
    vac = ent_reg.async_get_or_create(
        "vacuum", "weback_vacuum", "wb1",
        config_entry=source, device_id=wb_dev.id, suggested_object_id="weback_robot",
    )
    hass.states.async_set(vac.entity_id, "docked")
    mb = await _seed_sensor(
        hass, "mbapi2020", "w205", "Mercedes C-Class",
        [("odometer", None, "km")],
    )

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (dy_task,) = setups[dyson]["tasks"]
    assert dy_task["task_name"] == "Replace Filter" and dy_task["direction"] == "percent_left"
    assert len(dy_task["entity_ids"]) == 2  # hepa + carbon, any-low

    wb_tasks = {t["task_name"]: t for t in setups[wb_dev.id]["tasks"]}
    assert set(wb_tasks) == {"Filter Cleaning", "Clean Main Brush"}
    assert wb_tasks["Filter Cleaning"]["direction"] == "runtime_hours"
    assert wb_tasks["Filter Cleaning"]["threshold"] == 15.0
    assert wb_tasks["Clean Main Brush"]["threshold"] == 30.0

    mb_tasks = {t["task_name"]: t for t in setups[mb]["tasks"]}
    assert set(mb_tasks) == {"Annual Service", "Tire Rotation"}
    assert mb_tasks["Annual Service"]["threshold"] == 15000.0


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
