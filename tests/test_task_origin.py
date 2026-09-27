"""2.95: a task remembers where it came from — its fingerprint (``origin``).

Adopted and template tasks carry it from creation; older ones get it once at
setup where it is certain. A renamed task is then still the duty it came from:
discovery lists it as already there, it is offered its counter reset, and
nothing proposes it twice. A renamed task WITHOUT a fingerprint is offered
the reset unticked ("renamed — check"); wiring it records the fingerprint.
"""

from __future__ import annotations

import json

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import discover_integration_setups
from custom_components.maintenance_supporter.helpers.reset_wiring import reset_offers, wire_resets
from custom_components.maintenance_supporter.helpers.task_origin import ORIGIN_KEY, backfill_origins, sanitize_origin

from .conftest import call_ws_handler, make_global_entry, make_ws_connection, setup_integration

BRUSH_ORIGIN = {"kind": "integration", "integration": "roborock", "duty": "Replace Main Brush", "direction": "duration_left"}


async def _seed(hass: HomeAssistant) -> str:
    source = MockConfigEntry(domain="roborock", title="Roborock")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={("roborock", "q7")}, name="Roborock Q7")
    ent_reg = er.async_get(hass)
    for key in ("main_brush_time_left", "filter_time_left"):
        ent = ent_reg.async_get_or_create("sensor", "roborock", f"q7_{key}", config_entry=source, device_id=device.id, translation_key=key, suggested_object_id=f"q7_{key}")
        hass.states.async_set(ent.entity_id, "120", {"unit_of_measurement": "h"})
    ent_reg.async_get_or_create(
        "button", "roborock", "q7_reset_brush", config_entry=source, device_id=device.id,
        translation_key="reset_main_brush_consumable", suggested_object_id="q7_reset_main_brush_consumable",
    )
    return device.id


def _object(hass: HomeAssistant, name: str) -> MockConfigEntry:
    return next(e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == name)


async def _adopt(hass: HomeAssistant, device_id: str) -> MockConfigEntry:
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device_id}]})
    assert not conn.send_error.called, conn.send_error.call_args
    return _object(hass, "Roborock Q7")


def _rewrite(hass: HomeAssistant, entry: MockConfigEntry, **changes: dict) -> None:
    tasks = {tid: {**t, **changes.get(tid, {})} for tid, t in entry.data[CONF_TASKS].items()}
    for t in tasks.values():
        for key, value in list(t.items()):
            if value is None:
                del t[key]
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})


def _brush_id(entry: MockConfigEntry) -> str:
    return next(tid for tid, t in entry.data[CONF_TASKS].items() if t.get(ORIGIN_KEY, {}).get("duty") == "Replace Main Brush" or "Brush" in t["name"])


async def test_adopting_records_the_fingerprint(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    origins = {t["name"]: t[ORIGIN_KEY] for t in entry.data[CONF_TASKS].values()}
    assert origins["Replace Main Brush"] == {**BRUSH_ORIGIN, "device_id": device_id}
    assert origins["Replace Filter"]["duty"] == "Replace Filter"


async def test_a_renamed_adopted_task_is_still_its_duty(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    brush = _brush_id(entry)
    # renamed and the reset action removed (as a pre-2.95 task would be)
    _rewrite(hass, entry, **{brush: {"name": "Saugi: Bürste tauschen", "on_complete_action": None}})

    # offered its reset, pre-selected (the fingerprint is certain)
    (offer,) = reset_offers(hass)
    assert offer["task_id"] == brush and offer["renamed"] is False


async def test_a_custom_task_with_another_duty_fingerprint_is_not_offered(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    brush = _brush_id(entry)
    other = {**BRUSH_ORIGIN, "duty": "Clean Main Brush", "direction": "runtime_hours"}
    _rewrite(hass, entry, **{brush: {"name": "Replace Main Brush", ORIGIN_KEY: other, "on_complete_action": None}})
    assert reset_offers(hass) == []


async def test_a_renamed_task_without_fingerprint_is_offered_unticked_and_wiring_records_it(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    brush = _brush_id(entry)
    # a pre-2.95 adoption, renamed since: no fingerprint, no action
    _rewrite(hass, entry, **{brush: {"name": "Saugi: Bürste tauschen", ORIGIN_KEY: None, "on_complete_action": None}})
    (offer,) = reset_offers(hass)
    assert offer["task_id"] == brush and offer["renamed"] is True
    assert wire_resets(hass, [{"entry_id": entry.entry_id, "task_id": brush}], None) == 1
    task = _object(hass, "Roborock Q7").data[CONF_TASKS][brush]
    assert task["on_complete_action"]["target"] == {"entity_id": "button.q7_reset_main_brush_consumable"}
    assert task[ORIGIN_KEY] == {**BRUSH_ORIGIN, "device_id": device_id}


async def test_a_renamed_task_with_its_own_trigger_is_not_offered(hass: HomeAssistant) -> None:
    """No fingerprint, another name and a trigger the user built — a custom
    task on the same counter, never a reset candidate."""
    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    brush = _brush_id(entry)
    tc = dict(entry.data[CONF_TASKS][brush]["trigger_config"])
    tc["auto_complete_on_recovery"] = False
    _rewrite(hass, entry, **{brush: {"name": "Bürste entwirren", ORIGIN_KEY: None, "on_complete_action": None, "trigger_config": tc}})
    assert reset_offers(hass) == []


async def test_older_tasks_get_their_fingerprint_where_it_is_certain(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    brush = _brush_id(entry)
    filt = next(tid for tid in entry.data[CONF_TASKS] if tid != brush)
    # pre-2.95: no fingerprints; the filter task was renamed
    _rewrite(hass, entry, **{brush: {ORIGIN_KEY: None, "name": "Hauptbürste ersetzen"}, filt: {ORIGIN_KEY: None, "name": "Filter wechseln"}})
    healed = backfill_origins(hass, _object(hass, "Roborock Q7").data)
    assert healed is not None
    tasks = healed[CONF_TASKS]
    assert tasks[brush][ORIGIN_KEY] == {**BRUSH_ORIGIN, "device_id": device_id}, "named as the duty (German) → certain"
    assert ORIGIN_KEY not in tasks[filt], "renamed → never guessed"
    assert backfill_origins(hass, healed) is None, "idempotent"


async def test_the_backfill_runs_at_setup(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    brush = _brush_id(entry)
    _rewrite(hass, entry, **{brush: {ORIGIN_KEY: None}})
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert _object(hass, "Roborock Q7").data[CONF_TASKS][brush][ORIGIN_KEY]["duty"] == "Replace Main Brush"


async def test_template_tasks_carry_their_template_task(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.templates import get_template_by_id
    from custom_components.maintenance_supporter.websocket.objects import ws_create_from_template

    await setup_integration(hass, make_global_entry(hass))
    conn = make_ws_connection()
    await call_ws_handler(ws_create_from_template, hass, conn, {"id": 1, "type": "x", "template_id": "pool_pump"})
    entry_id = conn.send_result.call_args[0][1]["entry_id"]
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry_id)
    names = {tt.name for tt in get_template_by_id("pool_pump").tasks}
    origins = [t[ORIGIN_KEY] for t in entry.data[CONF_TASKS].values()]
    assert origins and all(o["kind"] == "template" and o["template"] == "pool_pump" and o["task"] in names for o in origins)

    # an older object of that template: the backfill finds each task by name
    stripped = {tid: {k: v for k, v in t.items() if k != ORIGIN_KEY} for tid, t in entry.data[CONF_TASKS].items()}
    healed = backfill_origins(hass, {**entry.data, CONF_TASKS: stripped})
    assert healed is not None
    assert {tid: t[ORIGIN_KEY] for tid, t in healed[CONF_TASKS].items()} == {tid: t[ORIGIN_KEY] for tid, t in entry.data[CONF_TASKS].items()}


async def test_problem_sensor_adoption_records_the_sensor(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    await setup_integration(hass, make_global_entry(hass))
    hass.states.async_set("binary_sensor.boiler_fault", "off", {"device_class": "problem", "friendly_name": "Boiler fault"})
    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors, hass, conn,
        {"id": 1, "type": "x", "selections": [{"entity_id": "binary_sensor.boiler_fault", "name": "Boiler fault", "object_name": "Boiler"}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    (task,) = _object(hass, "Boiler").data[CONF_TASKS].values()
    assert task[ORIGIN_KEY] == {"kind": "problem_sensor", "entity_id": "binary_sensor.boiler_fault"}


async def test_duplicate_drops_it_update_keeps_it(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_duplicate_task, ws_update_task

    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    brush = _brush_id(entry)
    conn = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn, {"id": 1, "type": "x", "entry_id": entry.entry_id, "task_id": brush, "name": "Bürste"})
    assert not conn.send_error.called, conn.send_error.call_args
    assert _object(hass, "Roborock Q7").data[CONF_TASKS][brush][ORIGIN_KEY]["duty"] == "Replace Main Brush"
    conn = make_ws_connection()
    await call_ws_handler(ws_duplicate_task, hass, conn, {"id": 2, "type": "x", "entry_id": entry.entry_id, "task_id": brush})
    copy_id = conn.send_result.call_args[0][1]["task_id"]
    assert ORIGIN_KEY not in _object(hass, "Roborock Q7").data[CONF_TASKS][copy_id]


async def test_it_survives_a_backup_restore_and_junk_is_dropped(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.export import build_export_data
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed(hass)
    entry = await _adopt(hass, device_id)
    backup = build_export_data(hass)
    (obj,) = backup["objects"]
    assert {t["origin"]["duty"] for t in obj["tasks"]} == {"Replace Main Brush", "Replace Filter"}
    # junk is dropped; renamed, so the setup backfill cannot re-derive it
    obj["tasks"][1]["origin"] = {"kind": "evil", "duty": "x"}
    obj["tasks"][1]["name"] = "My own name"
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(backup)})
    assert not conn.send_error.called, conn.send_error.call_args
    restored = [t.get(ORIGIN_KEY) for t in _object(hass, "Roborock Q7").data[CONF_TASKS].values()]
    assert sorted(o["duty"] for o in restored if o) == [obj["tasks"][0]["origin"]["duty"]]
    assert restored.count(None) == 1


def test_sanitize_keeps_only_known_string_fields() -> None:
    assert sanitize_origin({"kind": "template", "template": "car", "task": "Oil Change", "x": 1, "device_id": 5}) == {
        "kind": "template", "template": "car", "task": "Oil Change",
    }
    assert sanitize_origin({"kind": "nope"}) is None
    assert sanitize_origin("integration") is None
    assert len(sanitize_origin({"kind": "problem_sensor", "entity_id": "x" * 999})["entity_id"]) == 255


async def test_a_renamed_duty_blocks_only_itself_and_shows_as_already_there(hass: HomeAssistant) -> None:
    """A mower's one entity backs two duties. Renamed WITH a fingerprint, the
    blades task blocks only its own duty (undercarriage stays proposable) and
    the preview lists it as already there under its new name; a renamed task
    WITHOUT one still claims the whole entity (never re-proposed)."""
    from custom_components.maintenance_supporter.helpers.signatures._discovery import annotate_for_target

    await setup_integration(hass, make_global_entry(hass))
    source = MockConfigEntry(domain="navimow", title="Navimow")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={("navimow", "n1")}, name="Navimow")
    er.async_get(hass).async_get_or_create("lawn_mower", "navimow", "n1", config_entry=source, device_id=device.id, suggested_object_id="navimow")
    hass.states.async_set("lawn_mower.navimow", "docked")
    (setup,) = discover_integration_setups(hass)
    proposals = {t["task_name"]: t for t in setup["tasks"]}
    assert {"Replace Blades", "Clean Undercarriage"} <= set(proposals)

    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device.id, "task_names": ["Replace Blades"]}]})
    entry = _object(hass, "Navimow")
    (blades,) = entry.data[CONF_TASKS]
    _rewrite(hass, entry, **{blades: {"name": "Messer tauschen"}})
    (setup,) = discover_integration_setups(hass)
    assert [t["task_name"] for t in setup["tasks"] if t["task_name"] in proposals] == ["Clean Undercarriage"]
    _, already = annotate_for_target(hass, [proposals["Replace Blades"]], _object(hass, "Navimow"), integration="navimow")
    assert already == [{"task_name": "Replace Blades", "task_name_localized": proposals["Replace Blades"]["task_name_localized"], "existing_name": "Messer tauschen"}]

    _rewrite(hass, _object(hass, "Navimow"), **{blades: {ORIGIN_KEY: None}})
    assert discover_integration_setups(hass) == [] or all(
        t["task_name"] != "Clean Undercarriage" for s in discover_integration_setups(hass) for t in s["tasks"]
    )


def test_template_task_names_are_unique_keys() -> None:
    """A template task's fingerprint is (template id, EN task name) — the name
    must be unique within its template, and renaming one in templates.py needs
    a migration of the stored fingerprints."""
    from custom_components.maintenance_supporter.templates import TEMPLATES

    for template in TEMPLATES:
        names = [tt.name for tt in template.tasks]
        assert len(names) == len(set(names)), f"{template.id}: duplicate task names {names}"
