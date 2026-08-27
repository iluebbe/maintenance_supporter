"""Task phases (#139): cyclic content rotation on one shared cadence.

Pins the cursor rules the ROADMAP design fixed:
- a LATEST completion advances the cursor and stamps phase_id on the entry
- a pure backfill advances nothing and stamps nothing
- skip / missed / reset leave the cursor untouched (the physical state did
  not change — the same step stays due, only the clock restarts)
- phase fields OVERRIDE task fields (required fields, consumed parts)
- sanitizers enforce slug ids / caps / known-def sequences
- the Store cursor is clamped when an edit shortens the sequence
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.completion_requirements import (
    required_completion_fields,
)
from custom_components.maintenance_supporter.helpers.phases import (
    clamp_phase_cursor,
    current_phase,
    effective_field,
    sanitize_phase_defs,
    sanitize_phase_sequence,
)
from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_set_task_phase,
    ws_update_task,
)

from .conftest import (
    TASK_ID_1,
    assert_ws_error,
    assert_ws_success,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

PHASES = {
    "swap": {"name": "Swap cutting disks"},
    "flip": {"name": "Flip blades"},
    "replace": {
        "name": "Replace blades",
        "consumes_parts": [{"part_id": "p_blades", "quantity": 14}],
        "required_completion_fields": ["cost"],
    },
}
SEQUENCE = ["swap", "flip", "swap", "replace"]


def _task(cursor: int = 0, **over: Any) -> MaintenanceTask:
    return MaintenanceTask(
        id=TASK_ID_1,
        name="Mower blades",
        interval_days=30,
        last_performed="2026-08-01",
        phases=dict(PHASES),
        phase_sequence=list(SEQUENCE),
        phase_cursor=cursor,
        **over,
    )


# ─── model rotation ──────────────────────────────────────────────────────


def test_complete_advances_cursor_and_stamps_phase_id() -> None:
    task = _task(cursor=0)
    task.complete(completed_at=datetime(2026, 8, 26, 10, 0))
    assert task.phase_cursor == 1
    assert task.history[-1]["phase_id"] == "swap"

    task.complete(completed_at=datetime(2026, 8, 27, 10, 0))
    assert task.phase_cursor == 2
    assert task.history[-1]["phase_id"] == "flip"


def test_cycle_wraps_around() -> None:
    task = _task(cursor=3)
    task.complete(completed_at=datetime(2026, 8, 26, 10, 0))
    assert task.history[-1]["phase_id"] == "replace"
    assert task.phase_cursor == 0


def test_backfill_neither_advances_nor_attributes() -> None:
    task = _task(cursor=1)
    # older than last_performed → pure backfill
    task.complete(completed_at=datetime(2026, 7, 15, 10, 0))
    assert task.phase_cursor == 1
    assert "phase_id" not in task.history[-1]


def test_skip_and_reset_leave_the_cursor() -> None:
    task = _task(cursor=2)
    task.skip("busy")
    assert task.phase_cursor == 2
    task.skip("gone", as_missed=True)
    assert task.phase_cursor == 2
    task.reset(dt_util.now().date())
    assert task.phase_cursor == 2


def test_phaseless_task_is_untouched() -> None:
    task = MaintenanceTask(id=TASK_ID_1, name="Plain", interval_days=30, last_performed="2026-08-01")
    task.complete(completed_at=datetime(2026, 8, 26, 10, 0))
    assert "phase_id" not in task.history[-1]
    assert "phase_cursor" not in task.to_dict()


# ─── effective fields (override, not merge) ──────────────────────────────


def _task_dict(cursor: int) -> dict[str, Any]:
    return {
        "name": "Mower blades",
        "phases": PHASES,
        "phase_sequence": SEQUENCE,
        "phase_cursor": cursor,
        "consumes_parts": [{"part_id": "p_oil", "quantity": 1}],
        "required_completion_fields": ["notes"],
    }


def test_effective_fields_fall_through_when_phase_is_silent() -> None:
    td = _task_dict(cursor=0)  # "swap" sets nothing
    assert effective_field(td, "consumes_parts") == [{"part_id": "p_oil", "quantity": 1}]
    assert required_completion_fields(td) == ["notes"]


def test_effective_fields_override_when_phase_speaks() -> None:
    td = _task_dict(cursor=3)  # "replace" overrides parts + required fields
    assert effective_field(td, "consumes_parts") == [{"part_id": "p_blades", "quantity": 14}]
    assert required_completion_fields(td) == ["cost"]


def test_current_phase_clamps_out_of_range_cursor() -> None:
    td = _task_dict(cursor=99)
    phase = current_phase(td)
    assert phase is not None and phase["id"] == SEQUENCE[99 % len(SEQUENCE)]
    assert clamp_phase_cursor("garbage", 4) == 0
    assert clamp_phase_cursor(-3, 4) == 0


# ─── sanitizers ──────────────────────────────────────────────────────────


def test_sanitize_keeps_the_empty_required_fields_override() -> None:
    """[] is a meaningful phase override ("this phase demands nothing") —
    dropping it would make the task-level requirement fall through (#139
    follow-up: the dialog's override toggle relies on this surviving)."""
    defs = sanitize_phase_defs({
        "flip": {"name": "Flip", "required_completion_fields": []},
        "junky": {"name": "J", "required_completion_fields": ["bogus"]},
    })
    assert defs["flip"]["required_completion_fields"] == []
    # garbage-only input sanitizes to the empty override too (harmless)
    assert defs["junky"]["required_completion_fields"] == []
    td = {
        "name": "T",
        "phases": defs,
        "phase_sequence": ["flip"],
        "phase_cursor": 0,
        "required_completion_fields": ["cost"],
    }
    assert required_completion_fields(td) == []


def test_sanitize_defs_and_sequence() -> None:
    defs = sanitize_phase_defs(
        {
            "swap": {"name": "  Swap  ", "checklist": ["a", "", 42, "b"], "junk": "dropped"},
            "BAD ID": {"name": "x"},
            "noname": {"checklist": ["a"]},
            "replace": {"name": "R", "required_completion_fields": ["cost", "bogus"]},
        }
    )
    assert set(defs) == {"swap", "replace"}
    assert defs["swap"] == {"name": "Swap", "checklist": ["a", "b"]}
    assert defs["replace"]["required_completion_fields"] == ["cost"]
    assert "junk" not in defs["swap"]

    seq = sanitize_phase_sequence(["swap", "ghost", "replace", "swap", 7], defs)
    assert seq == ["swap", "replace", "swap"]
    assert sanitize_phase_sequence(["swap"], {}) == []


# ─── WS: set_phase + sequence-edit clamp ─────────────────────────────────


def _global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2026-08-01", interval_days=30)
    task["phases"] = {k: dict(v) for k, v in PHASES.items()}
    task["phase_sequence"] = list(SEQUENCE)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Mower",
        data=build_object_entry_data(
            object_data=build_object_data(name="Mower"), tasks={TASK_ID_1: task},
        ),
        source="user", unique_id="maintenance_supporter_phases_obj",
    )
    entry.add_to_hass(hass)
    return entry


async def test_ws_set_phase_validates_and_persists(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(ws_set_task_phase, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/set_phase",
        "entry_id": obj.entry_id, "task_id": TASK_ID_1, "cursor": 3,
    })
    assert_ws_success(conn)
    store = obj.runtime_data.store
    assert store.get_task_state(TASK_ID_1).get("phase_cursor") == 3

    conn2 = make_ws_connection()
    await call_ws_handler(ws_set_task_phase, hass, conn2, {
        "id": 1, "type": "maintenance_supporter/task/set_phase",
        "entry_id": obj.entry_id, "task_id": TASK_ID_1, "cursor": 4,
    })
    code, _ = assert_ws_error(conn2)
    assert code == "invalid_cursor"


async def test_sequence_edit_clamps_the_store_cursor(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    store = obj.runtime_data.store
    store.set_phase_cursor(TASK_ID_1, 3)

    conn = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": obj.entry_id, "task_id": TASK_ID_1,
        "phases": {"swap": {"name": "Swap"}, "flip": {"name": "Flip"}},
        "phase_sequence": ["swap", "flip"],
    })
    assert_ws_success(conn)
    assert store.get_task_state(TASK_ID_1).get("phase_cursor") == 1  # 3 % 2

    # removing the cycle entirely clears the cursor
    conn2 = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn2, {
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": obj.entry_id, "task_id": TASK_ID_1,
        "phases": None, "phase_sequence": None,
    })
    assert_ws_success(conn2)
    tasks = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS]
    assert "phases" not in tasks[TASK_ID_1]
    assert "phase_cursor" not in store.get_task_state(TASK_ID_1)


async def test_read_model_exposes_current_phase(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.objects import ws_get_object

    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    obj.runtime_data.store.set_phase_cursor(TASK_ID_1, 1)
    await obj.runtime_data.coordinator.async_refresh_now()

    conn = make_ws_connection()
    await call_ws_handler(ws_get_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object", "entry_id": obj.entry_id,
    })
    payload = conn.send_result.call_args[0][1]
    task = next(t for t in payload["tasks"] if t["id"] == TASK_ID_1)
    assert task["phase_sequence"] == SEQUENCE
    assert task["current_phase"] == {"id": "flip", "name": "Flip blades", "index": 1, "count": 4}
