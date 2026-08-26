"""Journey: a mowing season on cycle phases (#139).

The robot mower's blade protocol — flip, flip, REPLACE on one 30-day
cadence — walked through the real surfaces (WS create/complete/skip/
set_phase, options flow, export/import) across the persistence boundary:

* every latest completion performs the step the cursor points at, stamps
  its ``phase_id`` and advances (wrapping); the replace step consumes the
  phase's OWN part quantity and demands the phase's required cost,
* skips and refusals leave the cursor where it was; a backfilled invoice
  neither advances nor gets a phase stamp,
* the cursor survives a restart (Store), an options-flow edit mid-cycle
  keeps ids stable and clamps the cursor, and a JSON backup restored
  mid-cycle resumes at the SAME step — consuming from the copy's remapped
  part pool, not restarting at step one.
"""

from __future__ import annotations

import json
from datetime import timedelta

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers.parts import normalize_part
from custom_components.maintenance_supporter.helpers.phases import current_phase
from custom_components.maintenance_supporter.websocket.io import ws_import_json
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_set_task_phase,
    ws_update_task,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
    ws_skip_task,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection as _conn,
    setup_integration,
)
from .journey import simulate_restart

PHASES = {
    "flip": {"name": "Flip blades"},
    "replace": {
        "name": "Replace blades",
        "consumes_parts": [{"part_id": "p_blades", "quantity": 2}],
        "required_completion_fields": ["cost"],
    },
}
SEQUENCE = ["flip", "flip", "replace"]


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _mower(hass: HomeAssistant, *, season_start_days_ago: int = 60) -> MockConfigEntry:
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Mower blades",
        interval_days=30,
        last_performed=(dt_util.now().date() - timedelta(days=season_start_days_ago)).isoformat(),
    )
    task["checklist"] = ["Clean deck"]
    task["phases"] = {pid: json.loads(json.dumps(d)) for pid, d in PHASES.items()}
    task["phase_sequence"] = list(SEQUENCE)
    data = build_object_entry_data(
        object_data=build_object_data(name="Robot Mower"),
        tasks={TASK_ID_1: task},
    )
    data[CONF_PARTS] = {"p_blades": normalize_part({"id": "p_blades", "name": "Blade set"})}
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Robot Mower",
        data=data, source="user", unique_id="maintenance_supporter_journey_phases",
    )
    entry.add_to_hass(hass)
    return entry


async def _complete(hass: HomeAssistant, entry: MockConfigEntry, *, expect_error: str | None = None, **fields):
    conn = _conn()
    await call_ws_handler(
        ws_complete_task, hass, conn,
        {"id": 1, "type": "maintenance_supporter/task/complete",
         "entry_id": entry.entry_id, "task_id": TASK_ID_1, **fields},
    )
    if expect_error:
        assert conn.send_error.called, f"expected {expect_error}, got success"
        assert conn.send_error.call_args[0][1] == expect_error
    else:
        assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()


def _merged(entry: MockConfigEntry) -> dict:
    return entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]


def _days_ago(days: int) -> str:
    return (dt_util.now() - timedelta(days=days)).replace(microsecond=0).isoformat()


async def test_journey_a_mowing_season(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The season arc: flip → restart → flip → skip → refused → replace → invoice."""
    mower = _mower(hass)
    await setup_integration(hass, global_entry, mower)
    store = mower.runtime_data.store
    store.set_part_stock("p_blades", 10)

    # 1. First service of the season: the FLIP step. No parts consumed (the
    #    flip phase sets none and the task level has none), no cost demanded.
    await _complete(hass, mower, completed_at=_days_ago(50), notes="spring flip")
    task = _merged(mower)
    assert task["history"][-1]["phase_id"] == "flip"
    assert task["phase_cursor"] == 1
    assert store.get_part_stock("p_blades") == 10

    # 2. HA restarts mid-season — the cursor is Store state and survives.
    await simulate_restart(hass, global_entry, mower)
    store = mower.runtime_data.store
    assert _merged(mower)["phase_cursor"] == 1

    # 3. Second flip, a month later.
    await _complete(hass, mower, completed_at=_days_ago(40))
    assert _merged(mower)["phase_cursor"] == 2

    # 4. Vacation skip: the REPLACE step stays due — only the clock restarts.
    conn = _conn()
    await call_ws_handler(
        ws_skip_task, hass, conn,
        {"id": 1, "type": "maintenance_supporter/task/skip",
         "entry_id": mower.entry_id, "task_id": TASK_ID_1, "reason": "vacation"},
    )
    assert not conn.send_error.called
    await hass.async_block_till_done()
    assert _merged(mower)["phase_cursor"] == 2

    # 5. Trying to sign off the replace without the cost it demands → refused;
    #    nothing moved, nothing consumed.
    await _complete(hass, mower, expect_error="completion_details_required")
    assert _merged(mower)["phase_cursor"] == 2
    assert store.get_part_stock("p_blades") == 10

    # 6. The real replace: phase-level parts + cost. Cursor wraps to 0.
    #    Done NOW — the skip re-anchored the clock on today, so a backdated
    #    moment would (correctly) count as a mere backfill.
    await _complete(hass, mower, cost=24.9)
    task = _merged(mower)
    assert task["history"][-1]["phase_id"] == "replace"
    assert task["phase_cursor"] == 0
    assert store.get_part_stock("p_blades") == 8
    assert task["history"][-1]["used_parts"][0]["part_id"] == "p_blades"

    # 7. An old invoice from BEFORE the season: pure backfill — recorded, but
    #    no phase stamp and no cursor movement (it did not perform the step
    #    currently due).
    await _complete(hass, mower, completed_at=_days_ago(200), cost=19.0, notes="old invoice")
    task = _merged(mower)
    completed = [h for h in task["history"] if h["type"] == "completed"]
    assert completed[-1]["notes"] == "old invoice"
    assert "phase_id" not in completed[-1]
    assert task["phase_cursor"] == 0

    # 8. And the whole story still stands after another restart.
    await simulate_restart(hass, global_entry, mower)
    task = _merged(mower)
    assert task["phase_cursor"] == 0
    stamps = [h.get("phase_id") for h in task["history"] if h["type"] == "completed"]
    assert stamps == ["flip", "flip", "replace", None]


async def test_journey_corrections_and_mid_cycle_edits(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Adopting mid-cycle, editing the cycle in the options flow, retiring it."""
    mower = _mower(hass)
    await setup_integration(hass, global_entry, mower)
    store = mower.runtime_data.store

    # 1. The machine arrives mid-cycle: the operator points the cursor at the
    #    replace step (index 2) instead of completing fake flips.
    conn = _conn()
    await call_ws_handler(
        ws_set_task_phase, hass, conn,
        {"id": 1, "type": "maintenance_supporter/task/set_phase",
         "entry_id": mower.entry_id, "task_id": TASK_ID_1, "cursor": 2},
    )
    assert not conn.send_error.called
    assert current_phase(_merged(mower))["id"] == "replace"

    # 2. An options-flow edit mid-cycle: drop the second flip (3 steps → 2).
    #    Ids stay stable via the name match, the replace phase keeps its
    #    panel-managed part link, and the cursor clamps (2 % 2 = 0).
    result = await hass.config_entries.options.async_init(mower.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], user_input={"selected_task": TASK_ID_1, "go_back": False}
    )
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_phases"})
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], user_input={"phases_text": "Flip blades\nReplace blades", "go_back": False}
    )
    await hass.async_block_till_done()

    task_data = hass.config_entries.async_get_entry(mower.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert task_data["phase_sequence"] == ["flip", "replace"]
    assert task_data["phases"]["replace"]["consumes_parts"] == [{"part_id": "p_blades", "quantity": 2}]
    assert store.get_task_state(TASK_ID_1).get("phase_cursor") == 0

    # 3. Restart: the edited cycle and the clamped cursor hold.
    await simulate_restart(hass, global_entry, mower)
    store = mower.runtime_data.store
    task = _merged(mower)
    assert task["phase_sequence"] == ["flip", "replace"]
    assert current_phase(task)["id"] == "flip"

    # 4. Retiring the cycle over WS clears everything; completions go back
    #    to plain, unstamped ones.
    conn = _conn()
    await call_ws_handler(
        ws_update_task, hass, conn,
        {"id": 1, "type": "maintenance_supporter/task/update",
         "entry_id": mower.entry_id, "task_id": TASK_ID_1,
         "phases": None, "phase_sequence": None},
    )
    assert not conn.send_error.called
    await hass.async_block_till_done()
    task_data = hass.config_entries.async_get_entry(mower.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert "phases" not in task_data
    assert "phase_cursor" not in store.get_task_state(TASK_ID_1)

    await _complete(hass, mower, completed_at=_days_ago(1))
    assert "phase_id" not in _merged(mower)["history"][-1]


async def test_journey_backup_restored_mid_cycle(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A JSON backup taken mid-cycle resumes at the SAME step on the copy —
    and its replace consumes from the COPY's remapped part pool."""
    mower = _mower(hass)
    await setup_integration(hass, global_entry, mower)
    mower.runtime_data.store.set_part_stock("p_blades", 10)

    # Mid-cycle: two flips done, replace due next.
    await _complete(hass, mower, completed_at=_days_ago(50))
    await _complete(hass, mower, completed_at=_days_ago(40))
    assert _merged(mower)["phase_cursor"] == 2

    exported = next(
        e for e in build_export_data(hass, include_history=True)["objects"]
        if e["object"]["name"] == "Robot Mower"
    )
    assert exported["tasks"][0]["phase_cursor"] == 2

    exported["object"]["name"] = "Robot Mower Copy"
    conn = _conn()
    await call_ws_handler(
        ws_import_json, hass, conn,
        {"id": 1, "type": "maintenance_supporter/json/import",
         "json_content": json.dumps({"objects": [exported]})},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()

    copy = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.title == "Robot Mower Copy")
    copy_task_id = next(iter(copy.data[CONF_TASKS]))
    copy_store = copy.runtime_data.store
    copy_part_id = next(iter(copy.data[CONF_PARTS]))
    copy_store.set_part_stock(copy_part_id, 6)

    merged = copy.runtime_data.coordinator._get_merged_tasks_data()[copy_task_id]
    assert merged["phase_cursor"] == 2, "restore must resume mid-cycle, not restart"
    # The phase's part link followed the regenerated part id.
    assert merged["phases"]["replace"]["consumes_parts"][0]["part_id"] == copy_part_id

    # The next completion on the copy performs the REPLACE step: demands the
    # cost, consumes 2 from the copy's own pool, stamps the phase.
    conn = _conn()
    await call_ws_handler(
        ws_complete_task, hass, conn,
        {"id": 1, "type": "maintenance_supporter/task/complete",
         "entry_id": copy.entry_id, "task_id": copy_task_id},
    )
    assert conn.send_error.called and conn.send_error.call_args[0][1] == "completion_details_required"

    conn = _conn()
    await call_ws_handler(
        ws_complete_task, hass, conn,
        {"id": 1, "type": "maintenance_supporter/task/complete",
         "entry_id": copy.entry_id, "task_id": copy_task_id, "cost": 24.9},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()

    merged = copy.runtime_data.coordinator._get_merged_tasks_data()[copy_task_id]
    assert merged["history"][-1]["phase_id"] == "replace"
    assert merged["phase_cursor"] == 0
    assert copy_store.get_part_stock(copy_part_id) == 4
    # The original is untouched by everything the copy did.
    assert _merged(mower)["phase_cursor"] == 2
    assert mower.runtime_data.store.get_part_stock("p_blades") == 10
