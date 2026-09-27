"""Suggested setups without duplicates (2.94).

Reported from a real home: adopting the suggestions created the washer and
the dryer a second time (the user's objects carried the model but no device
link), a second wallbox object (one object stood for both boxes), and
lubrication tasks next to the user's own under other names — plus descaling
for a heat-pump dryer. These pin the fixes: the existing object is found and
becomes the default target, likely duplicates are flagged (and left unticked
by the dialog), exact ones listed as already there, WashData duties follow
its appliance type, and the preview recomputes for another target.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS
from custom_components.maintenance_supporter.helpers.adopt_match import candidate_object, covering_task
from custom_components.maintenance_supporter.helpers.integration_signatures import discover_integration_setups
from custom_components.maintenance_supporter.websocket.integration_setups import (
    ws_adopt_integration_setups,
    ws_preview_integration_setup,
)

from .conftest import (
    assert_ws_success,
    build_object_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


def _tasks(*names: str, trigger: dict[str, Any] | None = None) -> dict[str, dict[str, Any]]:
    return {f"t{i}": {"id": f"t{i}", "name": n, **({"trigger_config": trigger} if trigger else {})} for i, n in enumerate(names)}


# ─── the name / action / quantity heuristic ──────────────────────────────


@pytest.mark.parametrize(
    ("duty", "existing", "reason"),
    [
        ("Filter reinigen", "Laugenfilter reinigen", "similar_name"),
        ("Filter reinigen", "Feinfilter reinigen", "similar_name"),
        ("Trommel reinigen", "Trommelreinigung 90 Grad", "similar_name"),
        ("Zylinder schmieren", "Schließzylinder schmieren, Mechanik prüfen", "similar_name"),
        ("Schienen und Wellen schmieren", "Linearführungen schmieren", "same_action"),
        ("Lubricate Rails", "Grease the linear guides", "same_action"),
    ],
)
async def test_likely_duplicates_are_found(hass: HomeAssistant, duty: str, existing: str, reason: str) -> None:
    hit = covering_task(hass, [duty], [], _tasks(existing))
    assert hit is not None and hit["name"] == existing and hit["reason"] == reason


@pytest.mark.parametrize(
    ("duty", "existing"),
    [
        ("Kabel und Stecker prüfen", "Systemdruck prüfen"),
        ("Türdichtung reinigen", "Trommel reinigen"),
        ("Filter ersetzen", "PTFE-Schläuche ersetzen"),
        ("Filter ersetzen", "Carbon-Stangen reinigen"),
        ("Replace Filter", "Replace Main Brush"),
    ],
)
async def test_different_jobs_are_not_flagged(hass: HomeAssistant, duty: str, existing: str) -> None:
    assert covering_task(hass, [duty], [], _tasks(existing)) is None


async def test_same_quantity_on_another_sensor(hass: HomeAssistant) -> None:
    """Two pressure sensors of one boiler: a refill task on the integration's
    sensor next to the user's pressure check on a template sensor."""
    hass.states.async_set("sensor.boiler_pressure", "1.3", {"device_class": "pressure", "unit_of_measurement": "bar"})
    hass.states.async_set("sensor.my_pressure", "1.3", {"device_class": "pressure", "unit_of_measurement": "bar"})
    existing = _tasks("Systemdruck prüfen", trigger={"type": "threshold", "entity_id": "sensor.my_pressure", "trigger_below": 1.4})
    hit = covering_task(hass, ["Heizungswasser nachfüllen"], ["sensor.boiler_pressure"], existing)
    assert hit is not None and hit["reason"] == "same_quantity"
    # archived tasks never cover anything
    existing["t0"]["archived_at"] = "2026-01-01T00:00:00+00:00"
    assert covering_task(hass, ["Heizungswasser nachfüllen"], ["sensor.boiler_pressure"], existing) is None


# ─── the WashData scenario end to end ────────────────────────────────────


async def _washdata(hass: HomeAssistant, uid: str, name: str, device_type: str | None, *, in_data: bool = False) -> str:
    opts = {"device_type": device_type} if device_type and not in_data else {}
    data = {"device_type": device_type} if device_type and in_data else {}
    source = MockConfigEntry(domain="ha_washdata", title=name, options=opts, data=data)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={("ha_washdata", uid)}, name=name)
    ent = er.async_get(hass).async_get_or_create(
        "sensor", "ha_washdata", f"{uid}_cycle_count", config_entry=source, device_id=device.id,
        translation_key="cycle_count", suggested_object_id=f"{uid}_cycle_count",
    )
    hass.states.async_set(ent.entity_id, "78", {"unit_of_measurement": "cycles", "state_class": "total"})
    return device.id


def _object(hass: HomeAssistant, uid: str, name: str, model: str | None, tasks: tuple[str, ...], device_id: str | None = None):
    data = {**build_object_data(name=name, object_id=f"o_{uid}", model=model, manufacturer="Miele" if model else None)}
    if device_id:
        data["ha_device_id"] = device_id
    return make_object_entry(hass, tasks={f"{uid}{i}": {"id": f"{uid}{i}", "name": n, "type": "cleaning", "enabled": True, "schedule_type": "manual"} for i, n in enumerate(tasks)}, name=name, uid=uid, object_data=data)


async def test_dryer_and_washer_are_matched_to_the_users_objects(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    g = make_global_entry(hass)
    dryer_obj = _object(hass, "tr", "Trockner", "T 8861 WP Edition 111", ("Feinfilter reinigen", "Flusensieb reinigen", "Türdichtung reinigen"))
    washer_obj = _object(hass, "wm", "Waschmaschine", "W 5873 Edition 111", ("Entkalken", "Laugenfilter reinigen", "Trommelreinigung 90 Grad"))
    await setup_integration(hass, g, dryer_obj, washer_obj)
    dryer = await _washdata(hass, "d1", "Trockner Miele T 8861 WP", "dryer")
    washer = await _washdata(hass, "w1", "Waschmaschine Miele W 5873", "washing_machine")

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    d, w = setups[dryer], setups[washer]
    assert d["candidate"] == {"entry_id": dryer_obj.entry_id, "name": "Trockner", "reasons": ["model", "name"]}
    assert d["target_entry_id"] == dryer_obj.entry_id and d["target_task_count"] == 3
    names = {t["task_name"]: t for t in d["tasks"]}
    assert "Descaling" not in names, "a heat-pump dryer has nothing to descale"
    assert names["Filter Cleaning"]["covered_by"]["name"] == "Feinfilter reinigen"
    assert names["Clean Tub"]["covered_by"] is None
    # the washer: descaling exists by name → listed as already there, not proposed
    assert [a["existing_name"] for a in w["already"]] == ["Entkalken"]
    wn = {t["task_name"]: t for t in w["tasks"]}
    assert set(wn) == {"Filter Cleaning", "Clean Tub"}
    assert wn["Filter Cleaning"]["covered_by"]["name"] == "Laugenfilter reinigen"
    assert wn["Clean Tub"]["covered_by"]["name"] == "Trommelreinigung 90 Grad"


async def test_appliance_type_from_data_and_unknown_types(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    old = await _washdata(hass, "d2", "Dryer", "dryer", in_data=True)  # before WashData moved it to options
    unknown = await _washdata(hass, "g1", "Gadget", None)
    setups = {s["device_id"]: {t["task_name"] for t in s["tasks"]} for s in discover_integration_setups(hass)}
    assert "Descaling" not in setups[old]
    assert {"Descaling", "Filter Cleaning", "Clean Tub"} <= setups[unknown]


async def test_preview_recomputes_for_another_target(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    g = make_global_entry(hass)
    dryer_obj = _object(hass, "tr", "Trockner", "T 8861 WP", ("Feinfilter reinigen",))
    await setup_integration(hass, g, dryer_obj)
    dryer = await _washdata(hass, "d1", "Trockner Miele T 8861 WP", "dryer")

    conn = make_ws_connection()
    await call_ws_handler(ws_preview_integration_setup, hass, conn, {"id": 1, "type": "maintenance_supporter/integration_setups/preview", "device_id": dryer, "entry_id": None})
    fresh = assert_ws_success(conn)
    assert fresh["target_entry_id"] is None and fresh["target_task_count"] == 0
    assert all(t["covered_by"] is None for t in fresh["tasks"]) and fresh["already"] == []

    conn = make_ws_connection()
    await call_ws_handler(ws_preview_integration_setup, hass, conn, {"id": 2, "type": "maintenance_supporter/integration_setups/preview", "device_id": dryer, "entry_id": dryer_obj.entry_id})
    judged = assert_ws_success(conn)
    assert {t["task_name"]: t["covered_by"] and t["covered_by"]["name"] for t in judged["tasks"]}["Filter Cleaning"] == "Feinfilter reinigen"

    conn = make_ws_connection()
    await call_ws_handler(ws_preview_integration_setup, hass, conn, {"id": 3, "type": "maintenance_supporter/integration_setups/preview", "device_id": dryer, "entry_id": g.entry_id})
    assert conn.send_error.call_args[0][1] == "not_found", "the global entry is no object"


async def test_adopting_into_the_found_object_links_it_and_adds_only_the_ticked(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    g = make_global_entry(hass)
    dryer_obj = _object(hass, "tr", "Trockner", "T 8861 WP", ("Feinfilter reinigen",))
    await setup_integration(hass, g, dryer_obj)
    dryer = await _washdata(hass, "d1", "Trockner Miele T 8861 WP", "dryer")
    before = len(hass.config_entries.async_entries("maintenance_supporter"))

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn,
        {"id": 1, "type": "maintenance_supporter/integration_setups/adopt",
         "selections": [{"device_id": dryer, "entry_id": dryer_obj.entry_id, "task_names": ["Clean Tub"]}]},
    )
    result = assert_ws_success(conn)
    await hass.async_block_till_done()
    assert result["objects_created"] == 0 and result["tasks_created"] == 1
    assert len(hass.config_entries.async_entries("maintenance_supporter")) == before
    entry = hass.config_entries.async_get_entry(dryer_obj.entry_id)
    assert entry is not None
    assert entry.data[CONF_OBJECT]["ha_device_id"] == dryer
    assert sorted(t["name"] for t in entry.data[CONF_TASKS].values()) == ["Feinfilter reinigen", "Trommel reinigen"]


# ─── the second wallbox ──────────────────────────────────────────────────


async def _easee(hass: HomeAssistant, source: MockConfigEntry, uid: str, name: str) -> str:
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={("easee", uid)}, name=name, manufacturer="Easee", model="Easee Home"
    )
    ent = er.async_get(hass).async_get_or_create(
        "sensor", "easee", f"{uid}_lifetime_energy", config_entry=source, device_id=device.id,
        translation_key="lifetime_energy", suggested_object_id=f"{uid}_lifetime_energy",
    )
    hass.states.async_set(ent.entity_id, "3200", {"unit_of_measurement": "kWh", "device_class": "energy"})
    return device.id


async def test_one_object_for_two_wallboxes_is_the_candidate(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    source = MockConfigEntry(domain="easee", title="Easee")
    source.add_to_hass(hass)
    first = await _easee(hass, source, "b1", "Wallbox 1")
    second = await _easee(hass, source, "b2", "Wallbox 2")
    wallboxes = make_object_entry(hass, name="Easee Wallbox", uid="wb", object_data={**build_object_data(name="Easee Wallbox", object_id="o_wb"), "ha_device_id": first})
    await hass.config_entries.async_setup(wallboxes.entry_id)
    await hass.async_block_till_done()
    assert candidate_object(hass, second) == {"entry_id": wallboxes.entry_id, "name": "Easee Wallbox", "reasons": ["sibling"]}


async def test_two_equally_good_objects_are_not_guessed(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    a = _object(hass, "a", "Trockner", "T 8861 WP", ())
    b = _object(hass, "b", "Trockner", "T 8861 WP", ())
    await setup_integration(hass, g, a, b)
    dryer = await _washdata(hass, "d1", "Trockner Miele T 8861 WP", "dryer")
    assert candidate_object(hass, dryer) is None


# ─── problem sensors (2.94) ──────────────────────────────────────────────


async def _problem_sensor(hass: HomeAssistant, uid: str, device_name: str, sensor_name: str, *, model: str | None = None) -> tuple[str, str]:
    source = MockConfigEntry(domain="acme_appliance", title=device_name)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={("acme_appliance", uid)}, name=device_name, model=model
    )
    ent = er.async_get(hass).async_get_or_create(
        "binary_sensor", "acme_appliance", f"{uid}_problem", config_entry=source, device_id=device.id, suggested_object_id=f"{uid}_problem"
    )
    hass.states.async_set(ent.entity_id, "off", {"device_class": "problem", "friendly_name": sensor_name})
    return device.id, ent.entity_id


async def test_problem_sensor_defaults_to_the_found_object_and_flags_a_duplicate(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.problem_sensors import discover_problem_sensors

    g = make_global_entry(hass)
    dryer_obj = _object(hass, "tr", "Trockner", "T 8861 WP", ("Filter verstopft prüfen",))
    await setup_integration(hass, g, dryer_obj)
    _, entity_id = await _problem_sensor(hass, "d1", "Trockner Miele T 8861 WP", "Trockner Miele T 8861 WP Filter verstopft")
    (sensor,) = [s for s in discover_problem_sensors(hass) if s["entity_id"] == entity_id]
    assert sensor["suggested_entry_id"] is None
    assert sensor["candidate"]["entry_id"] == dryer_obj.entry_id
    assert sensor["target_entry_id"] == dryer_obj.entry_id
    assert sensor["covered_by"]["name"] == "Filter verstopft prüfen"


async def test_device_name_words_do_not_make_a_duplicate(hass: HomeAssistant) -> None:
    """A sensor named after its device ("Nuki Smart Lock … Batterie
    kritisch") must not match "Akku laden (Smart Lock Pro)" on the device
    words alone."""
    from custom_components.maintenance_supporter.helpers.problem_sensors import discover_problem_sensors

    g = make_global_entry(hass)
    await setup_integration(hass, g)
    device_id, entity_id = await _problem_sensor(hass, "n1", "Nuki Smart Lock Haustür", "Nuki Smart Lock Haustür Batterie kritisch")
    lock = make_object_entry(
        hass, name="Nuki Smart Lock Pro", uid="nk",
        tasks={"a": {"id": "a", "name": "Akku laden (Smart Lock Pro)", "type": "service", "enabled": True, "schedule_type": "manual"}},
        object_data={**build_object_data(name="Nuki Smart Lock Pro", object_id="o_nk"), "ha_device_id": device_id},
    )
    await hass.config_entries.async_setup(lock.entry_id)
    await hass.async_block_till_done()
    (sensor,) = [s for s in discover_problem_sensors(hass) if s["entity_id"] == entity_id]
    assert sensor["suggested_entry_id"] == lock.entry_id
    assert sensor["covered_by"] is None


async def test_problem_preview_and_adopt_links_only_the_found_object(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import (
        ws_adopt_problem_sensors,
        ws_preview_problem_sensors,
    )

    g = make_global_entry(hass)
    dryer_obj = _object(hass, "tr", "Trockner", "T 8861 WP", ("Filter verstopft prüfen",))
    other = _object(hass, "ot", "Keller", None, ())
    await setup_integration(hass, g, dryer_obj, other)
    device_id, entity_id = await _problem_sensor(hass, "d1", "Trockner Miele T 8861 WP", "Trockner Miele T 8861 WP Filter verstopft")

    conn = make_ws_connection()
    await call_ws_handler(ws_preview_problem_sensors, hass, conn, {"id": 1, "type": "maintenance_supporter/problem_sensors/preview", "selections": [
        {"entity_id": entity_id, "name": "Trockner Miele T 8861 WP Filter verstopft", "entry_id": dryer_obj.entry_id},
    ]})
    assert assert_ws_success(conn)["covered"][entity_id]["name"] == "Filter verstopft prüfen"
    conn = make_ws_connection()
    await call_ws_handler(ws_preview_problem_sensors, hass, conn, {"id": 2, "type": "maintenance_supporter/problem_sensors/preview", "selections": [
        {"entity_id": entity_id, "name": "Trockner Miele T 8861 WP Filter verstopft", "entry_id": g.entry_id},
        {"entity_id": "binary_sensor.other", "name": "Other", "entry_id": None},
    ]})
    assert assert_ws_success(conn)["covered"] == {entity_id: None, "binary_sensor.other": None}

    # adopting into ANOTHER existing object leaves it unlinked …
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_problem_sensors, hass, conn, {"id": 3, "type": "maintenance_supporter/problem_sensors/adopt", "selections": [
        {"entity_id": entity_id, "name": "Filter verstopft", "entry_id": other.entry_id, "device_id": device_id},
    ]})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    keller = hass.config_entries.async_get_entry(other.entry_id)
    assert keller is not None and not keller.data[CONF_OBJECT].get("ha_device_id")


async def test_problem_adopt_into_the_found_object_links_its_device(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    g = make_global_entry(hass)
    dryer_obj = _object(hass, "tr", "Trockner", "T 8861 WP", ())
    await setup_integration(hass, g, dryer_obj)
    device_id, entity_id = await _problem_sensor(hass, "d1", "Trockner Miele T 8861 WP", "Trockner Miele T 8861 WP Tür offen")
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_problem_sensors, hass, conn, {"id": 1, "type": "maintenance_supporter/problem_sensors/adopt", "selections": [
        {"entity_id": entity_id, "name": "Tür offen", "entry_id": dryer_obj.entry_id, "device_id": device_id},
    ]})
    assert assert_ws_success(conn)["objects_created"] == 0
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(dryer_obj.entry_id)
    assert entry is not None and entry.data[CONF_OBJECT]["ha_device_id"] == device_id
