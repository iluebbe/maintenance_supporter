"""Object pause / seasonal mode (N3) + replace-object successor flow (N1).

The roadmap items born from the equipment-biography journey review: seasonal
equipment pauses without losing anything, and a dead appliance hands over to
a successor without mixing the two machines' records.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_pause_object,
    ws_replace_object,
    ws_resume_object,
)

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import simulate_restart


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




def _make_entry(
    hass: HomeAssistant,
    unique_id: str,
    name: str = "Pool Pump",
    task: dict[str, Any] | None = None,
) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks={
                TASK_ID_1: task
                or build_task_data(
                    task_id=TASK_ID_1,
                    interval_days=30,
                    last_performed=(dt_util.now().date() - timedelta(days=40)).isoformat(),
                )
            },
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


async def _rows(hass: HomeAssistant, entry_id: str) -> list[dict[str, Any]]:
    listed = await hass.services.async_call(
        DOMAIN,
        "list_tasks",
        {"entry_id": entry_id},
        blocking=True,
        return_response=True,
    )
    return list(listed["tasks"])


# ─── N3: pause ───────────────────────────────────────────────────────────────


async def test_pause_freezes_status_and_survives_restart(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "n3_pause")
    await setup_integration(hass, global_entry, obj_entry)
    rows = await _rows(hass, obj_entry.entry_id)
    assert rows[0]["status"] == "overdue"  # 40 of 30 days

    await call_ws_handler(
        ws_pause_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()

    rows = await _rows(hass, obj_entry.entry_id)
    assert rows[0]["status"] == "paused"
    assert obj_entry.data[CONF_OBJECT]["paused_at"] is not None

    # A restart keeps the freeze — no resurrection as overdue.
    await simulate_restart(hass, global_entry, obj_entry)
    rows = await _rows(hass, obj_entry.entry_id)
    assert rows[0]["status"] == "paused"


async def test_pause_silences_notifications(hass: HomeAssistant) -> None:
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(notifications_enabled=True, notify_service="notify.mobile_app"),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    obj_entry = _make_entry(hass, "n3_silent")

    calls: list[Any] = []

    async def handler(call: Any) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("notify", "mobile_app", handler)
    await setup_integration(hass, global_entry, obj_entry)

    await call_ws_handler(
        ws_pause_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()
    calls.clear()

    # Even with the repeat gate forced open, a paused task never notifies.
    from unittest.mock import patch

    nm = hass.data[DOMAIN]["_notification_manager"]
    coordinator = obj_entry.runtime_data.coordinator
    with patch.object(nm, "_is_quiet_hours", return_value=False), patch.object(nm, "_get_interval_hours", return_value=0.0001):
        await coordinator.async_refresh()
        await hass.async_block_till_done()
    assert not calls, "paused object still notified"


async def test_pause_validation_errors(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "n3_valid")
    await setup_integration(hass, global_entry, obj_entry)

    # Past auto-resume date is rejected.
    conn = _conn()
    await call_ws_handler(
        ws_pause_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
            "until": "2020-01-01",
        },
    )
    assert conn.send_error.call_args[0][1] == "invalid_date"

    # Double pause is rejected.
    await call_ws_handler(
        ws_pause_object,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()
    conn = _conn()
    await call_ws_handler(
        ws_pause_object,
        hass,
        conn,
        {
            "id": 3,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
        },
    )
    assert conn.send_error.call_args[0][1] == "already_paused"

    # Resume of a non-paused object is rejected.
    await call_ws_handler(
        ws_resume_object,
        hass,
        _conn(),
        {
            "id": 4,
            "type": "maintenance_supporter/object/resume",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()
    conn = _conn()
    await call_ws_handler(
        ws_resume_object,
        hass,
        conn,
        {
            "id": 5,
            "type": "maintenance_supporter/object/resume",
            "entry_id": obj_entry.entry_id,
        },
    )
    assert conn.send_error.call_args[0][1] == "not_paused"


async def test_resume_reanchors_recurring_tasks(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The pool pump comes back with a fresh cycle, not 5 months overdue."""
    obj_entry = _make_entry(hass, "n3_resume")
    await setup_integration(hass, global_entry, obj_entry)

    await call_ws_handler(
        ws_pause_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()
    await call_ws_handler(
        ws_resume_object,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/object/resume",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()

    rows = await _rows(hass, obj_entry.entry_id)
    assert rows[0]["status"] == "ok"
    store = obj_entry.runtime_data.store
    assert store.get_last_performed(TASK_ID_1) == dt_util.now().date().isoformat()
    assert obj_entry.data[CONF_OBJECT].get("paused_at") is None


async def test_paused_until_auto_resumes_on_refresh(hass: HomeAssistant, global_entry: MockConfigEntry, freezer) -> None:
    freezer.move_to("2026-10-01 18:00:00+00:00")
    obj_entry = _make_entry(hass, "n3_auto")
    await setup_integration(hass, global_entry, obj_entry)

    await call_ws_handler(
        ws_pause_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
            "until": "2027-04-01",
        },
    )
    await hass.async_block_till_done()
    assert (await _rows(hass, obj_entry.entry_id))[0]["status"] == "paused"

    # Winter passes…
    freezer.move_to("2027-04-01 18:00:00+00:00")
    coordinator = obj_entry.runtime_data.coordinator
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    assert obj_entry.data[CONF_OBJECT].get("paused_at") is None
    rows = await _rows(hass, obj_entry.entry_id)
    assert rows[0]["status"] == "ok"
    assert obj_entry.runtime_data.store.get_last_performed(TASK_ID_1) == "2027-04-01"


async def test_paused_object_disappears_from_todo_and_calendar(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from homeassistant.helpers import entity_registry as er

    obj_entry = _make_entry(hass, "n3_views")
    await setup_integration(hass, global_entry, obj_entry)

    await call_ws_handler(
        ws_pause_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    todo_eid = next(e.entity_id for e in reg.entities.values() if e.domain == "todo")
    todo_entity = hass.data["todo"].get_entity(todo_eid)
    uids = {i.uid for i in (todo_entity.todo_items or [])}
    assert f"{obj_entry.entry_id}:{TASK_ID_1}" not in uids

    cal_eid = next(e.entity_id for e in reg.entities.values() if e.domain == "calendar")
    cal_entity = hass.data["calendar"].get_entity(cal_eid)
    events = await cal_entity.async_get_events(hass, dt_util.now() - timedelta(days=60), dt_util.now() + timedelta(days=60))
    assert not [e for e in events if "Pool Pump" in e.summary]


async def test_pause_of_archived_object_is_rejected(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_archive_object,
    )

    obj_entry = _make_entry(hass, "n3_arch")
    await setup_integration(hass, global_entry, obj_entry)
    await call_ws_handler(
        ws_archive_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/archive",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()

    conn = _conn()
    await call_ws_handler(
        ws_pause_object,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
        },
    )
    assert conn.send_error.call_args[0][1] == "archived"


async def test_pause_with_unparseable_until_is_rejected(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "n3_badfmt")
    await setup_integration(hass, global_entry, obj_entry)
    conn = _conn()
    await call_ws_handler(
        ws_pause_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
            "until": "next spring",
        },
    )
    assert conn.send_error.call_args[0][1] == "invalid_date"


async def test_corrupt_paused_until_resumes_instead_of_pausing_forever(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A hand-edited/garbage paused_until must fail OPEN (resume), not leave
    the object frozen forever with no auto-resume ever firing."""
    obj_entry = _make_entry(hass, "n3_garbage")
    data = dict(obj_entry.data)
    obj = dict(data[CONF_OBJECT])
    obj["paused_at"] = dt_util.now().isoformat()
    obj["paused_until"] = "not-a-date"
    data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(obj_entry, data=data)

    await setup_integration(hass, global_entry, obj_entry)
    await hass.async_block_till_done()
    assert obj_entry.data[CONF_OBJECT].get("paused_at") is None
    rows = await _rows(hass, obj_entry.entry_id)
    assert rows[0]["status"] == "ok"


def test_resume_reanchors_legacy_entries_without_store() -> None:
    """The store-less fallback (legacy entry shape) re-anchors in the static
    task dict itself."""
    from custom_components.maintenance_supporter.helpers.pause import (
        build_resumed_entry_data,
    )

    entry_data = {
        CONF_OBJECT: {"name": "Legacy", "paused_at": "2026-01-01T00:00:00"},
        CONF_TASKS: {
            "t1": {"id": "t1", "schedule_type": "time_based", "interval_days": 30, "last_performed": "2025-01-01"},
        },
    }
    out = build_resumed_entry_data(entry_data, None, "2026-07-06")
    assert out[CONF_OBJECT].get("paused_at") is None
    assert out[CONF_TASKS]["t1"]["last_performed"] == "2026-07-06"
    assert "last_planned_due" not in out[CONF_TASKS]["t1"]


def test_dict_twin_reports_paused() -> None:
    """The live-recompute path must not flip a frozen task to TRIGGERED."""
    from custom_components.maintenance_supporter.const import MaintenanceStatus
    from custom_components.maintenance_supporter.helpers.status import (
        compute_status_from_task_dict,
    )

    task = {"_paused": True, "_trigger_active": True, "_days_until_due": -5}
    assert compute_status_from_task_dict(task) == MaintenanceStatus.PAUSED


async def test_paused_object_with_trigger_task_wires_no_triggers(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """After the pause reload, sensor entities skip trigger setup — a sensor
    spike must not flip the frozen task."""
    task = build_task_data(
        task_id=TASK_ID_1,
        interval_days=None,
        schedule_type="sensor_based",
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.n3_pressure",
            "trigger_above": 30,
        },
    )
    obj_entry = _make_entry(hass, "n3_trigger", task=task)
    hass.states.async_set("sensor.n3_pressure", "5")
    await setup_integration(hass, global_entry, obj_entry)

    await call_ws_handler(
        ws_pause_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/pause",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()

    hass.states.async_set("sensor.n3_pressure", "99")  # spike while paused
    await hass.async_block_till_done()
    rows = await _rows(hass, obj_entry.entry_id)
    assert rows[0]["status"] == "paused", "sensor spike broke the freeze"


# ─── N1: replace ─────────────────────────────────────────────────────────────


async def test_replace_retires_old_and_creates_prefilled_successor(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "n1_replace", name="Washer")
    # Unit-specific fields that must NOT transfer.
    data = dict(obj_entry.data)
    obj = dict(data[CONF_OBJECT])
    obj["serial_number"] = "SN-OLD-123"
    obj["warranty_expiry"] = "2026-01-01"
    obj["manufacturer"] = "Miele"
    data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(obj_entry, data=data)
    await setup_integration(hass, global_entry, obj_entry)

    # A manual attached to the old machine.
    doc_store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    old_object_id = obj_entry.data[CONF_OBJECT]["id"]
    await doc_store.async_add_file(
        old_object_id,
        content=b"%PDF manual",
        filename="manual.pdf",
        mime="application/pdf",
    )

    conn = _conn()
    await call_ws_handler(
        ws_replace_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/replace",
            "entry_id": obj_entry.entry_id,
            "name": "Washer (2026)",
        },
    )
    await hass.async_block_till_done()
    new_entry_id = conn.send_result.call_args[0][1]["entry_id"]

    # Predecessor: archived, lineage marker, history intact.
    old_obj = obj_entry.data[CONF_OBJECT]
    assert old_obj["archived_at"] is not None
    assert old_obj["replaced_by_entry_id"] == new_entry_id
    assert obj_entry.data[CONF_TASKS][TASK_ID_1]["archived_at"] is not None

    # Successor: fresh unit, carried configuration.
    new_entry = hass.config_entries.async_get_entry(new_entry_id)
    new_obj = new_entry.data[CONF_OBJECT]
    assert new_obj["name"] == "Washer (2026)"
    assert new_obj["predecessor_entry_id"] == obj_entry.entry_id
    assert new_obj["manufacturer"] == "Miele"  # model line carries over
    assert new_obj.get("serial_number") is None  # the unit does not
    assert new_obj.get("warranty_expiry") is None
    assert new_obj["installation_date"] == dt_util.now().date().isoformat()

    new_tasks = new_entry.data[CONF_TASKS]
    assert len(new_tasks) == 1
    (new_task,) = new_tasks.values()
    assert new_task["id"] != TASK_ID_1  # fresh id
    assert new_task.get("last_performed") is None  # counters start fresh
    assert new_task.get("history") in (None, [])

    rows = await _rows(hass, new_entry_id)
    assert rows[0]["status"] == "ok"

    # The manual followed the machine (blob refcounted, not copied).
    new_docs = doc_store.for_object(new_obj["id"])
    assert len(new_docs) == 1
    assert new_docs[0]["filename"] == "manual.pdf"
    digest = new_docs[0]["hash"]
    assert doc_store.blobs[digest]["refcount"] == 2


async def test_pause_resume_replace_unknown_entry(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    for handler, mtype in (
        (ws_pause_object, "pause"),
        (ws_resume_object, "resume"),
        (ws_replace_object, "replace"),
    ):
        conn = _conn()
        await call_ws_handler(
            handler,
            hass,
            conn,
            {
                "id": 1,
                "type": f"maintenance_supporter/object/{mtype}",
                "entry_id": "does-not-exist",
            },
        )
        assert conn.send_error.called, mtype


async def test_replace_carries_trigger_config_without_runtime_state(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    task = build_task_data(
        task_id=TASK_ID_1,
        interval_days=None,
        schedule_type="sensor_based",
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.n1_pressure",
            "trigger_above": 30,
            "_trigger_state": {"sensor.n1_pressure": {"baseline_value": 12}},
        },
    )
    obj_entry = _make_entry(hass, "n1_trigger", task=task)
    hass.states.async_set("sensor.n1_pressure", "5")
    await setup_integration(hass, global_entry, obj_entry)

    conn = _conn()
    await call_ws_handler(
        ws_replace_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/replace",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()
    new_entry_id = conn.send_result.call_args[0][1]["entry_id"]
    new_entry = hass.config_entries.async_get_entry(new_entry_id)
    (new_task,) = new_entry.data[CONF_TASKS].values()
    tc = new_task["trigger_config"]
    assert tc["entity_id"] == "sensor.n1_pressure"  # config carries over
    assert "_trigger_state" not in tc  # runtime does not


async def test_replace_reports_create_failure(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from unittest.mock import AsyncMock, patch

    obj_entry = _make_entry(hass, "n1_fail")
    await setup_integration(hass, global_entry, obj_entry)

    conn = _conn()
    with patch.object(
        hass.config_entries.flow,
        "async_init",
        AsyncMock(return_value={"type": "abort", "reason": "boom"}),
    ):
        await call_ws_handler(
            ws_replace_object,
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/object/replace",
                "entry_id": obj_entry.entry_id,
            },
        )
    assert conn.send_error.call_args[0][1] == "replace_failed"
    # Nothing was retired on the failed attempt.
    assert obj_entry.data[CONF_OBJECT].get("archived_at") is None


async def test_replace_archived_object_is_rejected(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_archive_object,
    )

    obj_entry = _make_entry(hass, "n1_rejected")
    await setup_integration(hass, global_entry, obj_entry)
    await call_ws_handler(
        ws_archive_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/archive",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()

    conn = _conn()
    await call_ws_handler(
        ws_replace_object,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/object/replace",
            "entry_id": obj_entry.entry_id,
        },
    )
    assert conn.send_error.call_args[0][1] == "archived"


async def test_replace_survives_restart_on_both_sides(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "n1_restart", name="Boiler")
    await setup_integration(hass, global_entry, obj_entry)

    conn = _conn()
    await call_ws_handler(
        ws_replace_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/replace",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()
    new_entry_id = conn.send_result.call_args[0][1]["entry_id"]
    new_entry = hass.config_entries.async_get_entry(new_entry_id)

    await simulate_restart(hass, global_entry, obj_entry, new_entry)

    assert obj_entry.data[CONF_OBJECT]["replaced_by_entry_id"] == new_entry_id
    assert (await _rows(hass, obj_entry.entry_id)) == []  # archived cascade
    rows = await _rows(hass, new_entry_id)
    assert len(rows) == 1 and rows[0]["status"] == "ok"
