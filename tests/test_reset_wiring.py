"""2.95: completing a task also resets the integration's own counter.

Robot vacuums, mowers, filters and litter boxes count consumables
themselves; a catalog duty now names the integration's reset button, adopting
wires it as the task's completion action (enabling a button the integration
shipped disabled), tasks adopted before are offered the same, and a task that
completed ITSELF (its counter recovered) does not press it again.
"""

from __future__ import annotations

import json
from datetime import timedelta
from pathlib import Path
from unittest.mock import patch

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.history import completed_entries
from custom_components.maintenance_supporter.helpers.integration_signatures import SIGNATURES, discover_integration_setups
from custom_components.maintenance_supporter.helpers.reset_wiring import reset_offers, wire_resets
from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

from .conftest import call_ws_handler, make_global_entry, make_ws_connection, setup_integration


async def _seed_roborock(hass: HomeAssistant, *, button_disabled_by: er.RegistryEntryDisabler | None = er.RegistryEntryDisabler.INTEGRATION) -> str:
    source = MockConfigEntry(domain="roborock", title="Roborock")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id, identifiers={("roborock", "s8")}, name="Roborock S8"
    )
    ent_reg = er.async_get(hass)
    for key in ("main_brush_time_left", "filter_time_left"):
        sensor = ent_reg.async_get_or_create(
            "sensor", "roborock", f"s8_{key}", config_entry=source, device_id=device.id, translation_key=key, suggested_object_id=f"s8_{key}"
        )
        hass.states.async_set(sensor.entity_id, "120", {"unit_of_measurement": "h"})
    # Only the main brush has its reset button on this device.
    ent_reg.async_get_or_create(
        "button",
        "roborock",
        "s8_reset_main_brush",
        config_entry=source,
        device_id=device.id,
        translation_key="reset_main_brush_consumable",
        suggested_object_id="s8_reset_main_brush_consumable",
        original_name="Reset main brush consumable",
        disabled_by=button_disabled_by,
    )
    return device.id


def _object(hass: HomeAssistant, name: str = "Roborock S8") -> MockConfigEntry:
    return next(
        e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == name
    )


async def test_discovery_names_the_reset_button(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    await _seed_roborock(hass)
    (setup,) = discover_integration_setups(hass)
    by_name = {t["task_name"]: t for t in setup["tasks"]}
    reset = by_name["Replace Main Brush"]["reset"]
    assert reset == {"entity_id": "button.s8_reset_main_brush_consumable", "name": "Reset main brush consumable", "disabled": True}
    assert by_name["Replace Filter"]["reset"] is None, "no reset button for the filter on this device"


async def test_a_button_the_user_disabled_is_left_alone(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    await _seed_roborock(hass, button_disabled_by=er.RegistryEntryDisabler.USER)
    (setup,) = discover_integration_setups(hass)
    assert all(t["reset"] is None for t in setup["tasks"])


async def test_adopt_wires_and_enables_the_reset(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed_roborock(hass)
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device_id}]})
    assert not conn.send_error.called, conn.send_error.call_args
    tasks = {t["name"]: t for t in _object(hass).data[CONF_TASKS].values()}
    brush = next(t for n, t in tasks.items() if "Brush" in n)
    action = brush["on_complete_action"]
    assert action["service"] == "button.press"
    assert action["target"] == {"entity_id": "button.s8_reset_main_brush_consumable"}
    assert action["skip_auto"] is True and action["configured_by"] == conn.user.id
    assert "on_complete_action" not in next(t for n, t in tasks.items() if "Filter" in n)
    assert er.async_get(hass).async_get("button.s8_reset_main_brush_consumable").disabled_by is None


async def test_completion_presses_the_reset_but_not_when_the_task_completed_itself(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed_roborock(hass, button_disabled_by=None)
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device_id}]})
    entry = _object(hass)
    task_id = next(tid for tid, t in entry.data[CONF_TASKS].items() if "Brush" in t["name"])
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    entry = _object(hass)
    presses: list[ServiceCall] = []

    async def _press(call: ServiceCall) -> None:
        presses.append(call)

    hass.services.async_register("button", "press", _press)
    sensor = "sensor.s8_main_brush_time_left"
    # the brush is worn out: the counter trips the task
    hass.states.async_set(sensor, "1", {"unit_of_measurement": "h"})
    await hass.async_block_till_done()
    # an owner that exists, so the action runs in its name
    with patch.object(hass.auth, "async_get_user", return_value=object()):
        coordinator = entry.runtime_data.coordinator
        await coordinator.complete_maintenance(task_id, notes="new brush")
        await hass.async_block_till_done()
        assert len(presses) == 1
        assert presses[0].data["entity_id"] in ("button.s8_reset_main_brush_consumable", ["button.s8_reset_main_brush_consumable"])
        # the press resets the counter a while later — that recovery is not a
        # second completion (past the 120 s race guard, so the trigger itself
        # must know the task was already done)
        freezer.tick(timedelta(minutes=5))
        hass.states.async_set(sensor, "300", {"unit_of_measurement": "h"})
        await hass.async_block_till_done()
        history = entry.runtime_data.store.get_history(task_id)
        assert len(completed_entries(history)) == 1, history
        assert len(presses) == 1
        # the counter recovered on its own (reset in the vendor app) — no press
        await coordinator.async_auto_complete_on_recovery(task_id, 300.0)
        await hass.async_block_till_done()
        assert len(presses) == 1


async def test_existing_tasks_are_offered_and_wired(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_reset_offers, ws_wire_resets

    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed_roborock(hass)
    # adopted before 2.95: the task watches the counter, no completion action
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device_id}]})
    entry = _object(hass)
    tasks = dict(entry.data[CONF_TASKS])
    brush_id = next(tid for tid, t in tasks.items() if "Brush" in t["name"])
    tasks[brush_id] = {k: v for k, v in tasks[brush_id].items() if k != "on_complete_action"}
    # a custom task that merely watches the same counter is never offered
    # (its own trigger — the catalog shape would make it a "renamed?" offer)
    custom_tc = {**tasks[brush_id]["trigger_config"], "auto_complete_on_recovery": False}
    tasks["custom"] = {k: v for k, v in tasks[brush_id].items() if k != "origin"} | {
        "id": "custom",
        "name": "Clean the brush hairs",
        "trigger_config": custom_tc,
    }
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})

    offers = reset_offers(hass)
    assert [(o["task_id"], o["button_entity_id"]) for o in offers] == [(brush_id, "button.s8_reset_main_brush_consumable")]

    conn = make_ws_connection()
    await call_ws_handler(ws_reset_offers, hass, conn, {"id": 2, "type": "x"})
    assert conn.send_result.call_args[0][1]["offers"][0]["task_id"] == brush_id

    conn = make_ws_connection()
    await call_ws_handler(ws_wire_resets, hass, conn, {"id": 3, "type": "x", "items": [{"entry_id": entry.entry_id, "task_id": brush_id}, {"entry_id": entry.entry_id, "task_id": "custom"}]})
    assert conn.send_result.call_args[0][1] == {"wired": 1}
    wired = _object(hass).data[CONF_TASKS]
    assert wired[brush_id]["on_complete_action"]["target"] == {"entity_id": "button.s8_reset_main_brush_consumable"}
    assert "on_complete_action" not in wired["custom"]
    assert reset_offers(hass) == []
    assert wire_resets(hass, [{"entry_id": entry.entry_id, "task_id": brush_id}], None) == 0


def test_skip_auto_survives_the_sanitizer() -> None:
    task = {"on_complete_action": {"service": "button.press", "target": {"entity_id": "button.x"}, "skip_auto": True, "evil": 1}}
    cap_action_field(task)
    assert task["on_complete_action"] == {"service": "button.press", "target": {"entity_id": "button.x"}, "skip_auto": True}
    task = {"on_complete_action": {"service": "button.press", "skip_auto": "yes"}}
    cap_action_field(task)
    assert "skip_auto" not in task["on_complete_action"]


def test_every_reset_names_a_duty_key_and_a_real_button() -> None:
    """A reset pair's sensor key is one of the duty's keys, and — for core
    integrations — the button key exists in the integration's strings.json
    (checked from 2026.9 on: older cores lack the newer Ecovacs resets, which
    the per-device lookup then simply does not find)."""
    import homeassistant.components as comps
    from homeassistant.const import MAJOR_VERSION, MINOR_VERSION

    core = Path(comps.__file__).parent
    check_buttons = (MAJOR_VERSION, MINOR_VERSION) >= (2026, 9)
    problems = []
    for domain, catalog in SIGNATURES.items():
        buttons = None
        strings = core / domain / "strings.json"
        if check_buttons and strings.exists():
            buttons = set(json.loads(strings.read_text(encoding="utf-8")).get("entity", {}).get("button", {}))
        for sig in catalog.tasks:
            for sensor_key, button_key in sig.resets:
                if sensor_key not in sig.keys:
                    problems.append(f"{domain} {sig.task_name}: {sensor_key!r} is not a duty key")
                if buttons is not None and button_key not in buttons:
                    problems.append(f"{domain} {sig.task_name}: button {button_key!r} not in core strings.json")
    assert not problems, problems
    assert sum(1 for c in SIGNATURES.values() for s in c.tasks if s.resets) >= 30


@pytest.mark.parametrize("domain", ["roborock", "ecovacs", "tuya", "xiaomi_miio", "husqvarna_automower", "litterrobot", "smartthings", "renson"])
def test_the_integrations_with_their_own_reset_are_wired(domain: str) -> None:
    assert any(s.resets for s in SIGNATURES[domain].tasks), domain


async def test_offers_skip_what_cannot_or_should_not_be_wired(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed_roborock(hass)
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device_id}]})
    entry = _object(hass)
    tasks = dict(entry.data[CONF_TASKS])
    brush_id = next(tid for tid, t in tasks.items() if "Brush" in t["name"])
    bare = {k: v for k, v in tasks[brush_id].items() if k != "on_complete_action"}
    tasks[brush_id] = bare
    tasks["archived"] = {**bare, "id": "archived", "archived_at": "2026-09-01T00:00:00+00:00"}
    tasks["paused"] = {**bare, "id": "paused", "enabled": False}
    tasks["manual"] = {**bare, "id": "manual", "trigger_config": None}
    tasks["gone"] = {**bare, "id": "gone", "trigger_config": {"type": "threshold", "entity_id": "sensor.not_registered", "trigger_below": 10}}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})
    assert [o["task_id"] for o in reset_offers(hass)] == [brush_id]
    # an unknown pair or a vanished entry wires nothing
    assert wire_resets(hass, [{"entry_id": "nope", "task_id": brush_id}, {"entry_id": entry.entry_id, "task_id": "archived"}], None) == 0
    # an archived object offers nothing
    obj = dict(entry.data[CONF_OBJECT])
    obj["archived_at"] = "2026-09-01T00:00:00+00:00"
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_OBJECT: obj})
    assert reset_offers(hass) == []


async def test_two_buttons_under_one_key_are_never_guessed(hass: HomeAssistant) -> None:
    """A second button with the same key on the device (a purifier whose two
    filters share one reset key) makes the reset ambiguous — no wiring."""
    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed_roborock(hass)
    source = hass.config_entries.async_entries("roborock")[0]
    er.async_get(hass).async_get_or_create(
        "button",
        "roborock",
        "s8_reset_main_brush_twin",
        config_entry=source,
        device_id=device_id,
        translation_key="reset_main_brush_consumable",
        suggested_object_id="s8_reset_main_brush_consumable_2",
    )
    (setup,) = discover_integration_setups(hass)
    assert all(t["reset"] is None for t in setup["tasks"])


@pytest.mark.parametrize(
    ("unit", "hours"),
    [("d", 7.0), ("days", 7.0), ("Days", 7.0), ("h", 168.0), ("hours", 168.0), ("minutes", 10080.0), ("weeks", 1.0)],
)
def test_spelled_out_units_convert(hass: HomeAssistant, unit: str, hours: float) -> None:
    from custom_components.maintenance_supporter.helpers.signatures._model import ConsumableSignature, _threshold_for

    sig = ConsumableSignature(("salt_days",), "Refill Softener Salt", "duration_left", below_hours=168)
    hass.states.async_set("sensor.softener_salt_days", "30", {"unit_of_measurement": unit})
    assert _threshold_for(sig, hass, "sensor.softener_salt_days") == hours


async def test_one_duty_through_two_sensors_adopts_as_one_task(hass: HomeAssistant) -> None:
    """BWT Perla reports the salt in % and in days — two proposals of the same
    name must not become two identically named tasks."""
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, make_global_entry(hass))
    source = MockConfigEntry(domain="bwt_perla", title="BWT Perla")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={("bwt_perla", "p1")}, name="Softener")
    ent_reg = er.async_get(hass)
    for key, state, unit in (("regenerativ_level", "60", "%"), ("regenerativ_days", "30", "d")):
        ent = ent_reg.async_get_or_create(
            "sensor", "bwt_perla", f"p1_{key}", config_entry=source, device_id=device.id, translation_key=key, suggested_object_id=f"softener_{key}"
        )
        hass.states.async_set(ent.entity_id, state, {"unit_of_measurement": unit})
    (setup,) = discover_integration_setups(hass)
    assert [t["task_name"] for t in setup["tasks"]].count("Refill Softener Salt") == 2
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device.id}]})
    names = [t["name"] for t in _object(hass, "Softener").data[CONF_TASKS].values()]
    assert names.count("Refill Softener Salt") == 1, names


async def test_a_wear_counter_reset_after_completion_is_not_a_second_completion(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    """Automower counts blade hours since its own reset (usage_above, counter
    in delta mode from 0). Complete → the press zeroes the counter → no second
    completion, and the task falls due again after another full blade life."""
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, make_global_entry(hass))
    source = MockConfigEntry(domain="husqvarna_automower", title="Automower")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={("husqvarna_automower", "am1")}, name="Mower")
    ent_reg = er.async_get(hass)
    blades = ent_reg.async_get_or_create(
        "sensor", "husqvarna_automower", "am1_blades", config_entry=source, device_id=device.id, translation_key="cutting_blade_usage_time", suggested_object_id="mower_blade_usage"
    ).entity_id
    ent_reg.async_get_or_create(
        "button", "husqvarna_automower", "am1_reset_blades", config_entry=source, device_id=device.id, translation_key="reset_cutting_blade_usage_time", suggested_object_id="mower_reset_blades"
    )
    hass.states.async_set(blades, "10", {"unit_of_measurement": "h"})
    (setup,) = discover_integration_setups(hass)
    (proposal,) = [t for t in setup["tasks"] if t["task_name"] == "Replace Blades" and t.get("reset")]
    limit = proposal["threshold"]
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device.id}]})
    entry = _object(hass, "Mower")
    task_id = next(tid for tid, t in entry.data[CONF_TASKS].items() if t.get("on_complete_action"))
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    entry = _object(hass, "Mower")
    coordinator = entry.runtime_data.coordinator
    presses: list[ServiceCall] = []

    async def _press(call: ServiceCall) -> None:
        presses.append(call)
        hass.states.async_set(blades, "0", {"unit_of_measurement": "h"})  # the mower zeroes its counter

    hass.services.async_register("button", "press", _press)
    hass.states.async_set(blades, str(limit + 5), {"unit_of_measurement": "h"})
    await hass.async_block_till_done()
    assert coordinator.data["tasks"][task_id]["_trigger_active"] is True
    with patch.object(hass.auth, "async_get_user", return_value=object()):
        await coordinator.complete_maintenance(task_id, notes="new blades")
        await hass.async_block_till_done()
    assert len(presses) == 1
    freezer.tick(timedelta(minutes=5))
    hass.states.async_set(blades, "1", {"unit_of_measurement": "h"})
    await hass.async_block_till_done()
    assert len(completed_entries(entry.runtime_data.store.get_history(task_id))) == 1
    assert coordinator.data["tasks"][task_id]["_trigger_active"] is False
    # a full blade life later the task is due again (the baseline followed the reset)
    hass.states.async_set(blades, str(limit + 1), {"unit_of_measurement": "h"})
    await hass.async_block_till_done()
    assert coordinator.data["tasks"][task_id]["_trigger_active"] is True
