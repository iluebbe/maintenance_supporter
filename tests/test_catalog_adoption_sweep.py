"""Every signature of the catalog, end to end.

The per-round catalog tests pin what one integration's entities look like;
this sweep drives EVERY signature through the path a person takes: a device
built from the signature itself (tests/catalog_devices.py) is discovered,
its duty proposed (with the reset button when the duty has one), adopted
into an object with the pre-wired trigger and the fingerprint, driven into
the state that fires the trigger, and completed — which presses the
integration's reset button. A signature added to the catalog is covered the
moment it exists; one whose keys, unit, gates or reset do not fit together
fails here.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.signatures import (
    SIGNATURES,
    build_setup_trigger,
    discover_integration_setups,
)
from custom_components.maintenance_supporter.helpers.task_origin import task_origin
from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups
from custom_components.maintenance_supporter.websocket.tasks_actions import ws_complete_task

from .catalog_devices import SWEEP_CYCLES, fire, seed_device, source_entry
from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, title="Maintenance Supporter", data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


def _adopted(hass: HomeAssistant, device_id: str) -> tuple[Any, list[tuple[str, dict[str, Any]]]]:
    entry = next(
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and (e.data.get(CONF_OBJECT) or {}).get("ha_device_id") == device_id
    )
    return entry, list(entry.data.get(CONF_TASKS, {}).items())


@pytest.mark.parametrize("domain", sorted(SIGNATURES))
async def test_every_duty_is_proposed_adopted_fired_and_reset(
    hass: HomeAssistant, hass_admin_user: Any, global_entry: MockConfigEntry, freezer: Any, domain: str
) -> None:
    await setup_integration(hass, global_entry)
    presses = async_mock_service(hass, "button", "press")
    source = source_entry(hass, domain)
    seeded = [seed_device(hass, source, domain, sig, i) for i, sig in enumerate(SIGNATURES[domain].tasks)]
    await hass.async_block_till_done()
    problems: list[str] = []

    # 1) Discovery proposes each duty on its device, with its reset button.
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    for dev in seeded:
        sig = dev.signature
        tasks = (setups.get(dev.device_id) or {}).get("tasks") or []
        proposal = next(
            (t for t in tasks if t["catalog_task_name"] == sig.task_name and t["direction"] == sig.direction and dev.entity_id in t["entity_ids"]),
            None,
        )
        if proposal is None:
            problems.append(f"{sig.task_name} ({sig.direction}): not proposed for {dev.entity_id}")
        elif dev.button_entity_id and (proposal.get("reset") or {}).get("entity_id") != dev.button_entity_id:
            problems.append(f"{sig.task_name}: reset {proposal.get('reset')} instead of {dev.button_entity_id}")
    assert not problems, f"{domain}: " + "; ".join(problems)

    # 2) Adoption builds the object, the trigger, the fingerprint and the reset.
    conn = make_ws_connection()
    conn.user.id = hass_admin_user.id  # the completion action runs as this user
    await call_ws_handler(
        ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": d.device_id} for d in seeded]}
    )
    assert not conn.send_error.called, conn.send_error.call_args
    assert not conn.send_result.call_args[0][1].get("errors"), conn.send_result.call_args[0][1]
    await hass.async_block_till_done()

    for dev in seeded:
        sig = dev.signature
        entry, tasks = _adopted(hass, dev.device_id)
        hits = [
            (tid, t) for tid, t in tasks
            if (task_origin(t) or {}).get("duty") == sig.task_name and dev.entity_id in (t.get("trigger_config") or {}).get("entity_ids", [])
        ]
        if len(hits) != 1:
            problems.append(f"{sig.task_name}: {len(hits)} adopted tasks watch {dev.entity_id}")
            continue
        task_id, task = hits[0]
        expected = build_setup_trigger(sig, hass, [dev.entity_id])
        got = {k: v for k, v in task["trigger_config"].items() if not k.startswith("_")}
        if {k: got.get(k) for k in expected} != expected:
            problems.append(f"{sig.task_name}: trigger {got} is not the catalog's {expected}")
        if dev.button_entity_id:
            action = task.get("on_complete_action") or {}
            if action.get("service") != "button.press" or action.get("target") != {"entity_id": dev.button_entity_id}:
                problems.append(f"{sig.task_name}: reset action {action}")
            if er.async_get(hass).async_get(dev.button_entity_id).disabled_by is not None:
                problems.append(f"{sig.task_name}: reset button left disabled")

        # 3) The entity crossing its mark fires the task.
        if sig.direction == "cycle_count":
            # Hundreds of lock cycles in the catalog; the mechanics fire at a few.
            data = dict(entry.data)
            data[CONF_TASKS] = {**data[CONF_TASKS], task_id: {**task, "trigger_config": {**task["trigger_config"], "trigger_target_changes": SWEEP_CYCLES}}}
            hass.config_entries.async_update_entry(entry, data=data)
            await hass.config_entries.async_reload(entry.entry_id)
            await hass.async_block_till_done()
        await fire(hass, dev, freezer)
        coordinator = hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        status = coordinator.data[CONF_TASKS][task_id].get("_status")
        if status != "triggered":
            problems.append(f"{sig.task_name} ({sig.direction}): status {status!r} after the entity crossed its mark")
            continue

        # 4) Completing it here resets the integration's own counter.
        before = len(presses)
        conn.send_error.reset_mock()
        await call_ws_handler(ws_complete_task, hass, conn, {"id": 2, "type": "x", "entry_id": entry.entry_id, "task_id": task_id})
        await hass.async_block_till_done()
        if conn.send_error.called:
            problems.append(f"{sig.task_name}: completion refused {conn.send_error.call_args}")
        elif dev.button_entity_id and not any(
            dev.button_entity_id in (call.data.get("entity_id") or []) for call in presses[before:]
        ):
            problems.append(f"{sig.task_name}: completing did not press {dev.button_entity_id}")

    assert not problems, f"{domain}: " + "; ".join(problems)
