"""Contract fixture: the REAL ``_build_task_summary`` output for a MAXIMAL task.

The #42/#50/#58/#88/#103/#106 regression class is always the same failure: a
persisted field exists, but one of the read→edit→write surfaces doesn't carry
it, so the next save silently drops or resets it. This module pins the
producer side of the contract:

* A maximal task — every ``TASK_UPDATE_FIELD_MAP`` storage field populated —
  is persisted and rendered through the real ``_build_task_summary``. The
  result must MATCH the committed fixture
  ``frontend-src/__tests__/fixtures/task-summary-contract.json`` byte-for-byte
  (regenerate deliberately with ``MS_REGEN_CONTRACT=1 pytest <this file>``).
* The frontend consumes the SAME fixture: its round-trip test hydrates the
  task dialog from it, saves, and diffs the update payload — so the two sides
  cannot drift apart unnoticed.
* The inventory tripwire fails when a key appears in ``TASK_UPDATE_FIELD_MAP``
  but not in the fixture — a NEW editable field cannot re-open the class
  without extending the contract.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.tasks_crud import TASK_UPDATE_FIELD_MAP

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration

_FIXTURE = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
    / "__tests__"
    / "fixtures"
    / "task-summary-contract.txt"
)

# The maximal task: every TASK_UPDATE_FIELD_MAP storage field carries a
# non-default value. Fixed dates keep the fixture deterministic.
_MAXIMAL_TASK = {
    "id": "contract_task",
    "name": "Contract Fixture Task",
    "type": "service",
    "enabled": True,
    # Interval schedule + trigger = the "safety interval on a sensor task"
    # constellation — the very #42/#58 shape that used to get wiped. No
    # explicit anchor: "completion" is the default and Schedule.to_dict()
    # omits defaults, so seeding it would make the no-op echo test flag a
    # purely representational shape change.
    "schedule": {"kind": "interval", "every": 3, "unit": "months"},
    "trigger_config": {
        "type": "threshold",
        "entity_id": "sensor.contract_a",
        "entity_ids": ["sensor.contract_a", "sensor.contract_b"],
        "entity_logic": "all",
        "attribute": "level",
        "trigger_above": 80,
        "trigger_below": 10,
        "trigger_for_minutes": 5,
        "auto_complete_on_recovery": True,
    },
    "warning_days": 9,
    "earliest_completion_days": 3,
    "last_performed": "2026-06-01",
    "notes": "Contract notes",
    "documentation_url": "https://example.com/manual",
    "responsible_user_id": "user-uuid-1",
    "assignee_pool": ["user-uuid-1", "user-uuid-2"],
    "rotation_strategy": "round_robin",
    "required_completion_fields": ["notes", "cost"],
    "entity_slug": "contract_fixture_task",
    "custom_icon": "mdi:test-tube",
    "nfc_tag_id": "contract-nfc-1",
    "reading_unit": "kWh",
    "consumes_parts": [{"part_id": "part_1", "quantity": 2}],
    # #139: cyclic content rotation — defs + sequence with a repeated step.
    "phases": {
        "swap": {"name": "Swap cutting disks", "checklist": ["six screws"]},
        "replace": {
            "name": "Replace blades",
            "consumes_parts": [{"part_id": "part_1", "quantity": 14}],
            "required_completion_fields": ["cost"],
        },
    },
    "phase_sequence": ["swap", "replace", "swap"],
    "priority": "high",
    "checklist": ["step one", "step two"],
    "labels": ["safety", "seasonal"],
    "schedule_time": "08:30",
    "on_complete_action": {
        "service": "light.turn_off",
        "target": {"entity_id": "light.workshop"},
        "data": {"transition": 2},
    },
    "quick_complete_defaults": {"notes": "quick note", "cost": 5.5, "duration": 15, "feedback": "needed"},
    "created_at": "2026-01-01",
}


async def _build_contract_summary(hass: HomeAssistant) -> dict:
    from custom_components.maintenance_supporter.websocket import _build_task_summary
    from custom_components.maintenance_supporter.websocket.objects import async_create_object
    from custom_components.maintenance_supporter.websocket.tasks_persist import async_persist_task

    global_entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    hass.states.async_set("sensor.contract_a", "42", {"friendly_name": "Contract A", "unit_of_measurement": "%"})
    hass.states.async_set("sensor.contract_b", "7", {"friendly_name": "Contract B", "unit_of_measurement": "%"})

    entry_id = await async_create_object(hass, name="Contract Object")
    entry = hass.config_entries.async_get_entry(entry_id)

    # The maximal task consumes `part_1`, so the object has to own it. It did
    # not, which made the fixture describe a state the product now refuses:
    # `task/update` validates part links (it used to copy them through raw), so
    # replaying the fixture dropped the link and the no-op round-trip stopped
    # being a no-op. The fixture was wrong, not the check.
    hass.config_entries.async_update_entry(
        entry,
        data={
            **entry.data,
            "parts": {
                "part_1": {
                    "id": "part_1",
                    "name": "Contract Part",
                    "unit": "pcs",
                    "reorder_threshold": 1,
                    "restock_quantity": 2,
                    "auto_buy_task": False,
                }
            },
        },
    )
    entry = hass.config_entries.async_get_entry(entry_id)

    task = dict(_MAXIMAL_TASK)
    task["object_id"] = entry.data["object"]["id"]
    await async_persist_task(hass, entry, task)

    entry = hass.config_entries.async_get_entry(entry_id)
    task_data = entry.data[CONF_TASKS]["contract_task"]
    # coordinator_task=None keeps every ct-derived field at its deterministic
    # default; object_slug=None keeps registry lookups out of the fixture.
    return _build_task_summary(hass, "contract_task", task_data, None, None)


async def test_summary_matches_committed_contract_fixture(hass: HomeAssistant) -> None:
    """The committed fixture IS the current summary for the maximal task.

    On mismatch: if the change is intentional, regenerate via
    ``MS_REGEN_CONTRACT=1 python -m pytest tests/test_task_contract_fixture.py``
    and re-run the FRONTEND suite — the dialog round-trip test consumes the
    same file and will tell you whether the dialog carries the new shape.
    """
    summary = await _build_contract_summary(hass)
    # JSON round-trip normalizes tuples/OrderedDicts the same way the WS layer does.
    summary_json = json.loads(json.dumps(summary, default=str, sort_keys=True))

    if os.environ.get("MS_REGEN_CONTRACT"):
        _FIXTURE.parent.mkdir(parents=True, exist_ok=True)
        _FIXTURE.write_text(json.dumps(summary_json, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    assert _FIXTURE.exists(), f"contract fixture missing — regenerate with MS_REGEN_CONTRACT=1 ({_FIXTURE})"
    committed = json.loads(_FIXTURE.read_text(encoding="utf-8"))
    assert summary_json == committed, (
        "task summary drifted from the committed contract fixture; if intentional, "
        "regenerate with MS_REGEN_CONTRACT=1 and re-run the frontend round-trip test"
    )


async def test_every_editable_field_is_in_the_fixture(hass: HomeAssistant) -> None:
    """Inventory tripwire: TASK_UPDATE_FIELD_MAP ⊆ fixture keys.

    A field added to the update map without a populated value in the maximal
    task never gets contract coverage — the exact hole #106 slipped through.
    """
    committed = json.loads(_FIXTURE.read_text(encoding="utf-8"))
    missing_keys = [k for k in TASK_UPDATE_FIELD_MAP.values() if k not in committed]
    assert not missing_keys, f"editable fields missing from the contract fixture: {missing_keys} — extend _MAXIMAL_TASK"
    # schedule_type is a derived label; due_date exists only on one_time
    # schedules, which cannot coexist with the interval+trigger constellation
    # this fixture pins (one_time round-trips are covered by the calendar-kind
    # dialog tests + #42).
    exempt = {"schedule_type", "due_date"}
    unpopulated = [k for k in TASK_UPDATE_FIELD_MAP.values() if k not in exempt and committed.get(k) in (None, [], {})]
    assert not unpopulated, (
        f"editable fields present but EMPTY in the fixture: {unpopulated} — "
        "populate them in _MAXIMAL_TASK so the round-trip actually exercises them"
    )


async def test_update_echo_matches_fixture_after_noop_edit(hass: HomeAssistant) -> None:
    """Server-side closure: replaying the fixture's editable fields through
    ws_update_task must leave the stored task unchanged (no field resets)."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    await _build_contract_summary(hass)
    entry = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.data.get("object", {}).get("name") == "Contract Object")
    before = dict(entry.data[CONF_TASKS]["contract_task"])

    committed = json.loads(_FIXTURE.read_text(encoding="utf-8"))
    msg: dict = {"id": 1, "type": "x", "entry_id": entry.entry_id, "task_id": "contract_task"}
    for wire_key, data_key in TASK_UPDATE_FIELD_MAP.items():
        if wire_key == "schedule_type":
            continue  # derived label; sending it alone must not change storage
        msg[wire_key] = committed[data_key]
    conn = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn, msg)
    assert not conn.send_error.called, conn.send_error.call_args

    entry = hass.config_entries.async_get_entry(entry.entry_id)
    after = dict(entry.data[CONF_TASKS]["contract_task"])
    changed = {k: (before.get(k), after.get(k)) for k in set(before) | set(after) if before.get(k) != after.get(k)}
    assert not changed, f"no-op edit (fixture values replayed) mutated storage: {changed}"
