"""Journey C (mutations): a year of reorganizing, with restarts in between.

See docs/design/user-journeys.md. Every step goes through a public surface
(services / WS handlers), and after each interesting mutation a simulated
restart asserts the lifecycle invariants — entity identity, read-back
parity, status correctness. This is the bug class that produced the
object-rename entity orphaning.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    read_legacy_fields,
)
from custom_components.maintenance_supporter.websocket import (
    _build_object_response,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_update_object,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import (
    ws_update_task,
)

from .conftest import build_global_entry_data, call_ws_handler, setup_integration
from .journey import registry_snapshot, simulate_restart


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


def _entry(hass: HomeAssistant, entry_id: str) -> Any:
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    return entry


def _object_response(hass: HomeAssistant, entry: Any) -> dict[str, Any]:
    """The object as the panel sees it — WITH runtime (store-merged) data,
    like ws_get_object; a None coord_data would hide history/status."""
    rd = entry.runtime_data
    coord = rd.coordinator if rd else None
    return _build_object_response(hass, entry, coord.data if coord else None)


async def test_owner_reorganizes_everything_after_a_year(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)

    # ── A new object with a yearly service task (public services) ──────────
    obj = await hass.services.async_call(
        DOMAIN, "add_object",
        {"name": "Garage Door", "manufacturer": "Hörmann"},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN, "add_task",
        {"entry_id": entry_id, "name": "Annual service", "interval_days": 365},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    task_id = res["task_id"]

    # ── The year happens: one completion with cost ─────────────────────────
    await call_ws_handler(ws_complete_task, hass, _conn(), {
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": entry_id, "task_id": task_id,
        "notes": "greased the rail", "cost": 12.5, "duration": 20,
    })
    await hass.async_block_till_done()

    baseline = registry_snapshot(hass, _entry(hass, entry_id))
    assert len(baseline) == 6  # status+next_due sensors, binary, 3 buttons

    # ── Mutation 1: interval becomes 12 months (unit change, issue #58) ────
    await call_ws_handler(ws_update_task, hass, _conn(), {
        "id": 2, "type": "maintenance_supporter/task/update",
        "entry_id": entry_id, "task_id": task_id,
        "interval_days": 12, "interval_unit": "months",
    })
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, _entry(hass, entry_id))

    entry = _entry(hass, entry_id)
    assert registry_snapshot(hass, entry) == baseline, "unit change moved entities"
    fields = read_legacy_fields(entry.data[CONF_TASKS][task_id])
    assert (fields["interval_days"], fields["interval_unit"]) == (12, "months")

    # ── Mutation 2: rename the TASK ────────────────────────────────────────
    await call_ws_handler(ws_update_task, hass, _conn(), {
        "id": 3, "type": "maintenance_supporter/task/update",
        "entry_id": entry_id, "task_id": task_id,
        "name": "Yearly inspection & greasing",
    })
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, _entry(hass, entry_id))

    entry = _entry(hass, entry_id)
    assert registry_snapshot(hass, entry) == baseline, "task rename moved entities"
    # History survived both restarts.
    resp = _object_response(hass, entry)
    task_resp = next(t for t in resp["tasks"] if t["id"] == task_id)
    assert task_resp["name"] == "Yearly inspection & greasing"
    assert task_resp["times_performed"] == 1
    assert task_resp["total_cost"] == 12.5

    # ── Mutation 3: rename the OBJECT (the historical bug) ─────────────────
    await call_ws_handler(ws_update_object, hass, _conn(), {
        "id": 4, "type": "maintenance_supporter/object/update",
        "entry_id": entry_id, "name": "Sectional Door",
    })
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, _entry(hass, entry_id))

    entry = _entry(hass, entry_id)
    after = registry_snapshot(hass, entry)
    # Same entity COUNT and the same entity_ids (identity preserved) — only
    # the unique_id slug prefix moved with the migration.
    assert len(after) == len(baseline)
    assert sorted(after.values()) == sorted(baseline.values()), (
        "object rename changed entity_ids"
    )
    assert all("sectional_door" in uid for uid in after)
    assert not any("garage_door" in uid for uid in after)

    # ── Mutation 4: recurrence switches to a calendar kind ─────────────────
    await call_ws_handler(ws_update_task, hass, _conn(), {
        "id": 5, "type": "maintenance_supporter/task/update",
        "entry_id": entry_id, "task_id": task_id,
        "schedule": {"kind": "day_of_month", "day": -1, "business": True},
    })
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, _entry(hass, entry_id))

    entry = _entry(hass, entry_id)
    assert sorted(registry_snapshot(hass, entry).values()) == sorted(
        baseline.values()
    )
    resp = _object_response(hass, entry)
    task_resp = next(t for t in resp["tasks"] if t["id"] == task_id)
    assert task_resp["schedule"]["kind"] == "day_of_month"
    assert task_resp["schedule"]["day"] == -1
    assert task_resp["times_performed"] == 1, "history lost in type switch"


async def test_feature_toggle_off_mutate_on_keeps_hidden_data(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Journey C7: data behind a disabled feature survives unrelated edits."""
    await setup_integration(hass, global_entry)

    obj = await hass.services.async_call(
        DOMAIN, "add_object", {"name": "Boiler"},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN, "add_task",
        {"entry_id": entry_id, "name": "Descale", "interval_days": 90},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    task_id = res["task_id"]

    # Checklist set while the feature is (implicitly) available at WS level.
    await call_ws_handler(ws_update_task, hass, _conn(), {
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": entry_id, "task_id": task_id,
        "checklist": ["drain", "fill descaler", "rinse twice"],
    })
    await hass.async_block_till_done()

    # An unrelated edit (priority) plus a restart must not shed the checklist.
    await call_ws_handler(ws_update_task, hass, _conn(), {
        "id": 2, "type": "maintenance_supporter/task/update",
        "entry_id": entry_id, "task_id": task_id, "priority": "high",
    })
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, _entry(hass, entry_id))

    task = _entry(hass, entry_id).data[CONF_TASKS][task_id]
    assert task["checklist"] == ["drain", "fill descaler", "rinse twice"]
    assert task["priority"] == "high"


async def test_overdue_task_stays_overdue_across_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Status is recomputed from persisted state, not remembered."""
    await setup_integration(hass, global_entry)

    obj = await hass.services.async_call(
        DOMAIN, "add_object", {"name": "Pump"},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN, "add_task",
        {"entry_id": entry_id, "name": "Clean impeller", "interval_days": 30},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    task_id = res["task_id"]

    # Force it overdue via a reset far in the past (public surface).
    long_ago = (dt_util.now().date() - timedelta(days=90)).isoformat()
    await hass.services.async_call(
        DOMAIN, "update_task",
        {"entry_id": entry_id, "task_id": task_id},
        blocking=True,
    )
    from custom_components.maintenance_supporter.websocket.tasks_actions import (
        ws_reset_task,
    )

    await call_ws_handler(ws_reset_task, hass, _conn(), {
        "id": 1, "type": "maintenance_supporter/task/reset",
        "entry_id": entry_id, "task_id": task_id, "date": long_ago,
    })
    await hass.async_block_till_done()

    await simulate_restart(hass, global_entry, _entry(hass, entry_id))

    listed = await hass.services.async_call(
        DOMAIN, "list_tasks", {"entry_id": entry_id},
        blocking=True, return_response=True,
    )
    assert listed["tasks"][0]["status"] == "overdue"
