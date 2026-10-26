"""Bug audit 2026-10-16, tranche 3 — the low findings, backend half.

Grouped by the audit's lenses (W = WS API, T = triggers, C = core, F =
import / export / documents, S = parts, G = flows, N = notifications and
voice). Each docstring names the failure, so a red test says which bug came
back.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
    HistoryEntryType,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.parts import normalize_part

from .conftest import (
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
from .task_results import as_results

TASK = "t1"


def _days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    g = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options=options,
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    g.add_to_hass(hass)
    return g


def _object(
    hass: HomeAssistant,
    *,
    name: str = "Washer",
    uid: str = "washer",
    task_id: str = TASK,
    parts: dict[str, Any] | None = None,
    object_extra: dict[str, Any] | None = None,
    **task_over: Any,
) -> MockConfigEntry:
    task = build_task_data(task_id=task_id, interval_days=30, last_performed=_days_ago(10), object_id=uid)
    task["name"] = "Change Filter"
    task.update(task_over)
    obj_data = build_object_data(name=name, object_id=uid)
    obj_data.update(object_extra or {})
    data = build_object_entry_data(object_data=obj_data, tasks={task_id: task})
    if parts:
        data[CONF_PARTS] = {pid: normalize_part(p) for pid, p in parts.items()}
    obj = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title=name, data=data, source="user", unique_id=f"maintenance_supporter_{uid}"
    )
    obj.add_to_hass(hass)
    return obj


async def _setup(hass: HomeAssistant, *, options: dict[str, Any] | None = None, **kwargs: Any) -> MockConfigEntry:
    g = _global(hass, **(options or {}))
    obj = _object(hass, **kwargs)
    await setup_integration(hass, g, obj)
    return obj


def _live(hass: HomeAssistant, entry_id: str) -> Any:
    return hass.config_entries.async_get_entry(entry_id)


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    conn.user.id = "u1"
    conn.user.is_admin = True
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return conn


def _nm(hass: HomeAssistant) -> Any:
    return hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]


# ─── W: the WS API ───────────────────────────────────────────────────────


async def test_w4_a_task_is_not_restored_inside_an_archived_object(hass: HomeAssistant) -> None:
    """Restored alone, the task was live in an object nobody sees."""
    from custom_components.maintenance_supporter.websocket.tasks_lifecycle import ws_unarchive_task

    archived = "2026-09-01T00:00:00+00:00"
    entry = await _setup(hass, object_extra={"archived_at": archived}, archived_at=archived, archived_reason="manual")
    conn = await _ws(hass, ws_unarchive_task, {"type": "x", "entry_id": entry.entry_id, "task_id": TASK})
    assert_ws_error(conn, "archived")
    assert _live(hass, entry.entry_id).data[CONF_TASKS][TASK]["archived_at"] == archived


async def test_w5_an_object_edit_pushes_to_other_clients(hass: HomeAssistant) -> None:
    """object/update wrote the entry but told no subscriber; other panels
    showed the old name until the next 5-minute refresh."""
    from custom_components.maintenance_supporter.websocket.objects import ws_update_object

    entry = await _setup(hass)
    coordinator = entry.runtime_data.coordinator
    with patch.object(coordinator, "async_update_listeners") as push:
        assert_ws_success(await _ws(hass, ws_update_object, {"type": "x", "entry_id": entry.entry_id, "name": "Washing machine"}))
    assert push.called


async def test_w6_last_performed_is_stored_canonical(hass: HomeAssistant) -> None:
    """fromisoformat reads "20261001" too; stored as such it broke every
    string comparison of dates."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    entry = await _setup(hass)
    basic = (dt_util.now().date() - timedelta(days=3)).strftime("%Y%m%d")
    assert_ws_success(await _ws(hass, ws_update_task, {"type": "x", "entry_id": entry.entry_id, "task_id": TASK, "last_performed": basic}))
    store = _live(hass, entry.entry_id).runtime_data.store
    assert store.get_last_performed(TASK) == _days_ago(3)


async def test_w7_deleting_one_of_two_same_moment_entries_keeps_the_other(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_delete_history_entry

    stamp = "2026-09-01T10:00:00+00:00"
    history = [{"timestamp": stamp, "type": "reset"}, {"timestamp": stamp, "type": "completed"}]
    entry = await _setup(hass, history=history)
    assert_ws_success(await _ws(hass, ws_delete_history_entry, {"type": "x", "entry_id": entry.entry_id, "task_id": TASK, "timestamp": stamp}))
    left = _live(hass, entry.entry_id).runtime_data.store.get_history(TASK)
    assert [h["type"] for h in left] == ["completed"]


async def test_w8_adoption_drops_an_unknown_user(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    entry = await _setup(hass)
    hass.states.async_set("binary_sensor.printer_problem", "off")
    sel = {"entity_id": "binary_sensor.printer_problem", "name": "Printer problem", "entry_id": entry.entry_id, "responsible_user_id": "nobody"}
    assert_ws_success(await _ws(hass, ws_adopt_problem_sensors, {"type": "x", "selections": [sel]}))
    tasks = _live(hass, entry.entry_id).data[CONF_TASKS]
    adopted = next(t for tid, t in tasks.items() if tid != TASK)
    assert "responsible_user_id" not in adopted


async def test_w_compound_logic_null_is_and(hass: HomeAssistant) -> None:
    """``"compound_logic": null`` answered unknown_error (``.upper()`` on None)."""
    from custom_components.maintenance_supporter.websocket.tasks_validation import _validate_compound_trigger

    cond = {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 1}
    errors, _warnings = _validate_compound_trigger(
        hass, {"type": "compound", "compound_logic": None, "conditions": [cond, {**cond, "entity_id": "sensor.b"}]}
    )
    assert not any("compound_logic" in e for e in errors)


def test_w_an_unknown_interval_anchor_reads_as_completion() -> None:
    from custom_components.maintenance_supporter.helpers.schedule import Schedule

    assert Schedule.from_dict({"kind": "interval", "every": 30, "anchor": "weird"}).anchor == "completion"
    assert Schedule.from_dict({"kind": "interval", "every": 30, "anchor": "planned"}).anchor == "planned"


async def test_w_postpone_into_the_past_is_refused(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    with pytest.raises(ServiceValidationError) as err:
        await entry.runtime_data.coordinator.async_postpone_task(TASK, dt_util.now().date() - timedelta(days=2))
    assert err.value.translation_key == "postpone_in_past"


async def test_w_a_rename_keeps_settings_held_in_data(hass: HomeAssistant) -> None:
    """A hub entry whose settings live in ``data`` got options of the renamed
    key alone, and every other setting vanished behind them."""
    from homeassistant.helpers import entity_registry as er

    from custom_components.maintenance_supporter.helpers.global_options import get_global_options

    g = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Maintenance Supporter",
        # The feature flags in data too: the start-up flag migration would
        # otherwise copy everything into options and hide the case.
        data={**build_global_entry_data(), "shopping_list_entity": "todo.shop", "default_warning_days": 11, "advanced_adaptive_visible": True},
        options={},
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    g.add_to_hass(hass)
    await setup_integration(hass, g)
    # Settings held in data with empty options (the start-up migrations fill
    # options; an entry restored or edited by hand may not have them).
    hass.config_entries.async_update_entry(g, options={})
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    other = MockConfigEntry(domain="local_todo")
    other.add_to_hass(hass)
    ent = reg.async_get_or_create("todo", "local_todo", "shop", config_entry=other, suggested_object_id="shop")
    reg.async_update_entity(ent.entity_id, new_entity_id="todo.groceries")
    await hass.async_block_till_done()
    settings = get_global_options(hass)
    assert settings["shopping_list_entity"] == "todo.groceries"
    assert settings["default_warning_days"] == 11


# ─── T: triggers and entities ────────────────────────────────────────────


async def test_t6_runtime_pauses_while_its_entity_stays_missing(hass: HomeAssistant) -> None:
    """A restored on-since kept booking hours every tick while the entity was
    missing — for good if it never came back."""
    from custom_components.maintenance_supporter.entity.triggers.runtime import RuntimeTrigger

    entity = MagicMock()
    entity.hass = hass
    entity.entity_id = "sensor.maintenance_supporter_pump"
    entity._task_id = TASK
    entity.coordinator = AsyncMock()
    on_since = (dt_util.utcnow() - timedelta(minutes=10)).isoformat()
    trigger = RuntimeTrigger(hass, entity, {"entity_id": "sensor.gone", "type": "runtime", "trigger_runtime_hours": 100, "trigger_on_since": on_since})
    with patch.object(trigger, "_persist_runtime", AsyncMock()), patch.object(trigger, "_update_evaluation"):
        trigger._periodic_callback(dt_util.utcnow())
        booked = trigger._accumulated_seconds
        assert trigger._on_since_dt is None
        trigger._periodic_callback(dt_util.utcnow() + timedelta(minutes=5))
    assert 590 <= booked <= 700
    assert trigger._accumulated_seconds == booked


async def test_t7_editing_a_done_todo_item_records_nothing(hass: HomeAssistant) -> None:
    """Renaming an item the list shows as done sent it back as completed —
    a new completion."""
    from homeassistant.components.todo import TodoItem, TodoItemStatus

    from custom_components.maintenance_supporter.todo import MaintenanceTodoList

    entry = await _setup(hass)  # done 10 days ago, every 30 days: OK
    todo = MaintenanceTodoList(hass)
    with patch.object(entry.runtime_data.coordinator, "complete_maintenance", AsyncMock()) as complete:
        await todo.async_update_todo_item(TodoItem(uid=f"{entry.entry_id}:{TASK}", summary="x", status=TodoItemStatus.COMPLETED))
    complete.assert_not_called()


async def test_t8_an_attribute_trigger_gets_no_prediction(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    predictor = SensorPredictor(hass)
    task = {
        "schedule_type": "sensor_based",
        "trigger_config": {"type": "threshold", "entity_ids": ["vacuum.robot"], "attribute": "battery_level", "trigger_below": 20},
    }
    with patch.object(predictor, "_async_fetch_statistics_points", AsyncMock(return_value=[(0.0, 5.0)] * 20)) as fetch:
        result = await predictor.async_analyze(task, {})
    assert result is None
    fetch.assert_not_called()


async def test_t_a_deleted_area_takes_its_cost_sensors_along(hass: HomeAssistant) -> None:
    from homeassistant.helpers import area_registry as ar
    from homeassistant.helpers import entity_registry as er

    area = ar.async_get(hass).async_create("Shed")
    entry = await _setup(hass, object_extra={"area_id": area.id})
    reg = er.async_get(hass)
    ours = lambda: [e for e in reg.entities.values() if area.id in (e.unique_id or "") and e.platform == DOMAIN]  # noqa: E731
    assert ours()
    # The object leaves the area, then the area goes.
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_OBJECT: {**entry.data[CONF_OBJECT], "area_id": None}})
    await entry.runtime_data.coordinator.async_refresh_now()
    await hass.async_block_till_done()
    ar.async_get(hass).async_delete(area.id)
    await hass.async_block_till_done()
    assert ours() == []


# ─── C: core ─────────────────────────────────────────────────────────────


async def test_cg_a_second_skip_within_seconds_is_the_same_tap(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    coordinator = entry.runtime_data.coordinator
    await coordinator.skip_maintenance(TASK)
    await coordinator.skip_maintenance(TASK)
    skips = [h for h in entry.runtime_data.store.get_history(TASK) if h.get("type") in ("skipped", "missed")]
    assert len(skips) == 1


@pytest.mark.parametrize("between", ["reset", "complete"])
async def test_cg_a_skip_after_a_new_cycle_is_no_double_tap(hass: HomeAssistant, between: str) -> None:
    """The guard outlived the reset or completion that started a new cycle:
    the skip of that cycle was dropped without a word."""
    entry = await _setup(hass)
    coordinator = entry.runtime_data.coordinator
    await coordinator.skip_maintenance(TASK)
    if between == "reset":
        await coordinator.reset_maintenance(TASK)
    else:
        await coordinator.complete_maintenance(TASK)
    await coordinator.skip_maintenance(TASK)
    skips = [h for h in entry.runtime_data.store.get_history(TASK) if h.get("type") in ("skipped", "missed")]
    assert len(skips) == 2


async def test_cg_a_skip_that_failed_to_save_can_be_retried(hass: HomeAssistant) -> None:
    """The retry reaches the save instead of being dropped as a double tap."""
    entry = await _setup(hass)
    coordinator = entry.runtime_data.coordinator
    persist = AsyncMock(side_effect=[OSError("disk full"), None])
    with patch.object(coordinator, "_persist_and_signal_task_change", persist):
        with pytest.raises(OSError):
            await coordinator.skip_maintenance(TASK)
        await coordinator.skip_maintenance(TASK)
    assert persist.await_count == 2


@pytest.mark.parametrize(
    ("every", "unit", "last", "expected"),
    [
        # Every 2 weeks from Oct 20: the grid's first April date, not Apr 1.
        (2, "weeks", "2026-10-20", ["2027-04-06", "2027-04-20", "2027-05-04"]),
        # Monthly on the 15th: Apr 15, not Apr 1.
        (1, "months", "2026-10-15", ["2027-04-15", "2027-05-15", "2027-06-15"]),
    ],
)
def test_cf_a_planned_series_keeps_its_grid_through_the_off_season(every: int, unit: str, last: str, expected: list[str]) -> None:
    """Rolled to the 1st of the season's first month, that 1st became the
    next planned anchor: the series sat on the 1st for good."""
    from datetime import date

    from custom_components.maintenance_supporter.helpers.schedule import Schedule, preview_occurrences

    season = {"season_months": [4, 5, 6, 7, 8, 9, 10]}
    planned = Schedule.from_dict({"kind": "interval", "every": every, "unit": unit, "anchor": "planned", **season})
    lp = date.fromisoformat(last)
    first = planned.next_due(last_performed=lp, created_at=None, last_planned_due=lp, today=lp)
    assert first == date.fromisoformat(expected[0])
    later, _ = preview_occurrences(planned, last_performed=first, today=first, count=2)
    assert [d.isoformat() for d in later] == expected[1:]
    # A completion-anchored series still starts the season on the 1st.
    completion = Schedule.from_dict({"kind": "interval", "every": every, "unit": unit, **season})
    assert completion.next_due(last_performed=lp, created_at=None, last_planned_due=None, today=lp) == date(2027, 4, 1)


async def test_ci_a_paused_task_gets_no_repair(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.issues import missing_trigger_issue_id

    entry = await _setup(
        hass,
        paused_at="2026-10-01T00:00:00+00:00",
        trigger_config={"type": "threshold", "entity_ids": ["sensor.gone"], "entity_id": "sensor.gone", "trigger_above": 5},
    )
    coordinator = entry.runtime_data.coordinator
    with patch.object(coordinator, "_in_startup_grace_period", return_value=False):
        for _ in range(6):
            await coordinator.async_refresh_now()
    assert ir.async_get(hass).async_get_issue(DOMAIN, missing_trigger_issue_id(entry.entry_id, TASK, "sensor.gone")) is None


async def test_cj_archived_and_disabled_reads_archived_with_totals(hass: HomeAssistant) -> None:
    entry = await _setup(hass, enabled=False, archived_at="2026-09-01T00:00:00+00:00", archived_reason="manual")
    other = _object(hass, name="Dryer", uid="dryer", enabled=False, history=[{"timestamp": f"{_days_ago(10)}T08:00:00+00:00", "type": "completed", "cost": 4.0}])
    await hass.config_entries.async_setup(other.entry_id)
    await hass.async_block_till_done()
    assert entry.runtime_data.coordinator.data[CONF_TASKS][TASK].status == MaintenanceStatus.ARCHIVED
    disabled = _live(hass, other.entry_id).runtime_data.coordinator.data[CONF_TASKS][TASK]
    assert disabled.status == MaintenanceStatus.OK
    assert (disabled.times_performed, disabled.total_cost) == (1, 4.0)


async def test_ck_a_done_one_time_task_is_not_postponed(hass: HomeAssistant) -> None:
    entry = await _setup(hass, schedule_type="one_time", interval_days=None, due_date=_days_ago(5), last_performed=_days_ago(4))
    with pytest.raises(ServiceValidationError) as err:
        await entry.runtime_data.coordinator.async_postpone_task(TASK, dt_util.now().date() + timedelta(days=3))
    assert err.value.translation_key == "postpone_done"


async def test_cl_a_reset_clears_the_checklist_ticks(hass: HomeAssistant) -> None:
    entry = await _setup(hass, checklist=["Rinse", "Dry"])
    store = entry.runtime_data.store
    store.set_checklist_progress(TASK, {"Rinse": True})
    await entry.runtime_data.coordinator.reset_maintenance(TASK)
    assert not store.get_task_state(TASK).get("checklist_progress")


async def test_cm_the_rotated_person_is_published_at_once(hass: HomeAssistant) -> None:
    users = [await hass.auth.async_create_user(name) for name in ("Ann", "Ben")]
    pool = [u.id for u in users]
    entry = await _setup(hass, assignee_pool=pool, rotation_strategy="round_robin", responsible_user_id=pool[0])
    coordinator = entry.runtime_data.coordinator
    await coordinator.complete_maintenance(TASK)
    assert coordinator.data[CONF_TASKS][TASK].task["responsible_user_id"] == pool[1]


def test_stamps_compare_as_instants() -> None:
    """A completion after the clocks went back (or after a UTC backup) sorted
    before the latest entry as text and was taken for a backfill."""
    from custom_components.maintenance_supporter.helpers.dates import stamp_instant
    from custom_components.maintenance_supporter.helpers.history import latest_anchor_stamp
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    history = [{"type": "completed", "timestamp": "2026-10-16T22:00:00+00:00"}, {"type": "completed", "timestamp": "2026-10-16T23:30:00+02:00"}]
    assert latest_anchor_stamp(history) == "2026-10-16T22:00:00+00:00"
    task = MaintenanceTask.from_dict({**build_task_data(task_id=TASK, name="T"), "history": history, "last_performed": "2026-10-16"})
    assert task.would_be_latest(datetime.fromisoformat("2026-10-17T01:00:00+02:00"))  # 23:00 UTC
    assert not task.would_be_latest(datetime.fromisoformat("2026-10-16T23:00:00+02:00"))  # 21:00 UTC
    assert stamp_instant("nonsense") < stamp_instant("2000-01-01")


async def test_a_refused_suggestion_is_reported(hass: HomeAssistant) -> None:
    """The suggestion is a day count; a calendar schedule refuses it — and the
    panel said "applied"."""
    from custom_components.maintenance_supporter.websocket.analysis import ws_apply_suggestion

    entry = await _setup(hass, schedule={"kind": "weekdays", "weekdays": [0]}, interval_days=None)
    conn = await _ws(hass, ws_apply_suggestion, {"type": "x", "entry_id": entry.entry_id, "task_id": TASK, "interval": 20})
    assert_ws_error(conn, "invalid_input")


# ─── F: import, export, documents ────────────────────────────────────────


def test_f6_a_semicolon_csv_imports() -> None:
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    (obj,) = import_objects_csv("object_name;task_name;interval_days\nShed;Oil;30\n")
    assert obj["object"]["name"] == "Shed" and [t["name"] for t in obj["tasks"].values()] == ["Oil"]


async def test_f6_a_broken_csv_is_refused_cleanly(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.io import ws_import_csv

    await setup_integration(hass, _global(hass))
    with patch("custom_components.maintenance_supporter.helpers.csv_handler.import_objects_csv", side_effect=__import__("csv").Error("boom")):
        conn = await _ws(hass, ws_import_csv, {"type": "x", "csv_content": "object_name\nX\n"})
    assert_ws_error(conn, "empty_csv")


async def test_f7_the_csv_keeps_task_less_objects_and_a_tasks_own_state(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.csv_handler import export_objects_csv, import_objects_csv

    archived = "2026-09-01T00:00:00+00:00"
    await _setup(hass, archived_at=archived, archived_reason="manual")
    empty = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Shelf",
        data=build_object_entry_data(object_data=build_object_data(name="Shelf", object_id="shelf"), tasks={}),
        source="user",
        unique_id="maintenance_supporter_shelf",
    )
    empty.add_to_hass(hass)
    await hass.config_entries.async_setup(empty.entry_id)
    await hass.async_block_till_done()
    objects = {o["object"]["name"]: o for o in import_objects_csv(export_objects_csv(hass))}
    assert "Shelf" in objects and objects["Shelf"]["tasks"] == {}
    (task,) = objects["Washer"]["tasks"].values()
    assert task["archived_at"] == archived and task["archived_reason"] == "manual"


async def test_f8_imported_document_fields_get_their_types(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import DOCUMENT_STORE_KEY

    entry = await _setup(hass)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    record = {"kind": "file", "hash": "a" * 64, "title": 42, "filename": ["x"], "mime": ["image/png"], "size": 10}
    assert await store.async_import_documents(entry.data[CONF_OBJECT]["id"], [record]) == 1
    (doc,) = store.for_object(entry.data[CONF_OBJECT]["id"])
    assert doc["title"] == "document" and doc["filename"] == "document" and doc["mime"] == "application/octet-stream"


async def test_f10_an_unmatched_object_is_named_and_its_file_kept(hass: HomeAssistant) -> None:
    """The restore read as a plain success when an object matched nothing;
    its file stays on disk so a JSON import run afterwards still finds it."""
    import hashlib
    import io
    import zipfile

    from custom_components.maintenance_supporter.const import DOCUMENT_STORE_KEY
    from custom_components.maintenance_supporter.helpers.doc_archive import import_documents_archive

    await _setup(hass)
    content = b"%PDF-1.4 ghost manual"
    digest = hashlib.sha256(content).hexdigest()
    doc = {"id": "d1", "kind": "file", "hash": digest, "path": "Ghost/m.pdf", "filename": "m.pdf", "mime": "application/pdf"}
    manifest = {"version": 2, "objects": [{"object_id": "ghost", "object_name": "Ghost", "documents": [doc]}]}
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr("manifest.json", json.dumps(manifest))
        zf.writestr("Ghost/m.pdf", content)
    result = await import_documents_archive(hass, io.BytesIO(buf.getvalue()))
    assert result["objects_unmatched"] == ["Ghost"] and result["documents_created"] == 0
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    assert await hass.async_add_executor_job(store.blob_path(digest).exists)


async def test_f11_the_completion_counter_rides_the_backup(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.export import build_export_data
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    entry = await _setup(hass)
    entry.runtime_data.store.update_task_state(TASK, next_history_ref=9)
    data = build_export_data(hass)
    (task,) = data["objects"][0]["tasks"]
    assert task["next_history_ref"] == 9
    data["objects"][0]["object"]["name"] = "Washer restored"
    res = assert_ws_success(await _ws(hass, ws_import_json, {"type": "x", "json_content": json.dumps({"objects": data["objects"]})}))
    new = _live(hass, res["imported"][0]["entry_id"])
    (tid,) = new.data[CONF_TASKS]
    assert new.runtime_data.store.get_task_state(tid).get("next_history_ref") == 9


async def test_f_a_refused_file_changes_no_setting(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.global_options import get_global_options
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, _global(hass))
    payload = {"global_settings": {"default_warning_days": 21}, "objects": {"not": "a list"}}
    assert_ws_error(await _ws(hass, ws_import_json, {"type": "x", "json_content": json.dumps(payload)}), "invalid_format")
    assert get_global_options(hass).get("default_warning_days") != 21


def test_f_an_action_aimed_at_a_device_follows_the_move() -> None:
    from custom_components.maintenance_supporter.helpers.import_mapping import remap_task_device

    task = {"on_complete_action": {"service": "button.press", "target": {"device_id": ["old", "keep"]}}}
    remap_task_device(task, {"old": "new"})
    assert task["on_complete_action"]["target"]["device_id"] == ["new", "keep"]


async def test_f_document_views_answer_404_without_the_integration(hass: HomeAssistant) -> None:
    from aiohttp import web

    from custom_components.maintenance_supporter.views import _get_store

    with pytest.raises(web.HTTPNotFound):
        _get_store(hass)


# ─── S: parts and the battery fleet ──────────────────────────────────────


def test_s4_a_renamed_battery_keeps_its_fleet_records() -> None:
    from custom_components.maintenance_supporter.helpers.entity_rename import rewrite_store

    state = {
        "battery_low_latch": {"sensor.old": {"at": "2026-10-01"}},
        "battery_replacements": {"sensor.old": {"dates": ["2026-01-01"]}},
        "battery_recorded_replacements": {"sensor.old": "2026-10-01"},
    }
    store = MagicMock()
    store.all_task_states.return_value = {"fleet": state}
    assert rewrite_store(store, "sensor.old", "sensor.new")
    for key in state:
        assert list(state[key]) == ["sensor.new"], key


def test_s5_a_cost_on_a_skip_is_no_spending() -> None:
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    task = MaintenanceTask.from_dict(
        {
            **build_task_data(task_id=TASK, name="T"),
            "history": [{"type": "completed", "timestamp": "2026-09-01T10:00:00+00:00", "cost": 10}, {"type": "skipped", "timestamp": "2026-10-01T10:00:00+00:00", "cost": 99}],
        }
    )
    assert task.total_cost == 10


def test_s6_giving_back_a_used_one_already_ready_again_adds_nothing() -> None:
    from custom_components.maintenance_supporter.parts_runtime import _book_use

    stock = {"p": 5.0}
    pile = {"p": 0.0}
    store = MagicMock()
    store.get_part_stock.side_effect = lambda pid: stock[pid]
    store.get_part_restoring.side_effect = lambda pid: pile[pid]
    store.set_part_stock.side_effect = lambda pid, v: stock.__setitem__(pid, v)
    store.set_part_restoring.side_effect = lambda pid, v: pile.__setitem__(pid, v)
    part = {"id": "p", "reuse": "charge"}
    _book_use(store, part, -1)
    assert (stock["p"], pile["p"]) == (5.0, 0.0)
    pile["p"] = 1.0
    _book_use(store, part, -1)
    assert (stock["p"], pile["p"]) == (6.0, 0.0)


def test_s7_a_merged_battery_part_moves_phase_links_too() -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import _repoint_tasks

    tasks = {"t": {"phases": {"swap": {"name": "Swap", "consumes_parts": [{"part_id": "batt_lr6", "quantity": 2}]}}}}
    out, changed = _repoint_tasks(tasks, {"batt_lr6": "batt_aa"}, owner_id="fleet", foreign=False)
    assert changed
    assert out["t"]["phases"]["swap"]["consumes_parts"] == [{"part_id": "batt_aa", "quantity": 2}]


async def test_s_a_renamed_part_renames_its_stock_sensor(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.parts import ws_update_part

    entry = await _setup(hass, parts={"p1": {"id": "p1", "name": "Filter"}})
    entry.runtime_data.store.set_part_stock("p1", 3)
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert_ws_success(await _ws(hass, ws_update_part, {"type": "x", "entry_id": entry.entry_id, "part_id": "p1", "name": "Pleated filter"}))
    states = [s for s in hass.states.async_all("sensor") if s.attributes.get("part_name") == "Pleated filter"]
    assert states and states[0].name.endswith("Pleated filter stock")


# ─── G: config and options flows ─────────────────────────────────────────


async def _open_edit_task(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    r = await hass.config_entries.options.async_init(entry.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "manage_tasks"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"selected_task": TASK})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "edit_task"})
    assert r["step_id"] == "edit_task"
    return r


def _schema_key(form: Any, name: str) -> Any:
    return next(k for k in form["data_schema"].schema if str(k) == name)


async def test_g6_g7_the_edit_form_prefills_the_date_and_lets_people_go(hass: HomeAssistant) -> None:
    import voluptuous as vol

    due = (dt_util.now().date() + timedelta(days=9)).isoformat()
    entry = await _setup(hass, schedule={"kind": "one_time", "due_date": due}, interval_days=None)
    form = await _open_edit_task(hass, entry)
    assert _schema_key(form, "due_date").default() == due
    user_key = _schema_key(form, "responsible_user_id")
    assert user_key.default is vol.UNDEFINED, "a default re-inserts the stored person when the field is emptied"


async def test_g12_a_shared_list_survives_a_save_without_its_fields(hass: HomeAssistant) -> None:
    """With fewer than two active users the pool fields are not shown; read
    as cleared, every save dissolved the shared list."""
    ann = await hass.auth.async_create_user("Ann")
    ben = await hass.auth.async_create_user("Ben")
    await hass.auth.async_deactivate_user(ben)  # one active user: no pool fields
    pool = [ann.id, ben.id]
    entry = await _setup(hass, assignee_pool=pool, rotation_strategy="round_robin", responsible_user_id=ann.id)
    form = await _open_edit_task(hass, entry)
    assert "assignee_pool" not in {str(k) for k in form["data_schema"].schema}
    submit = {"name": "Change Filter", "type": "cleaning"}
    await hass.config_entries.options.async_configure(form["flow_id"], submit)
    await hass.async_block_till_done()
    task = _live(hass, entry.entry_id).data[CONF_TASKS][TASK]
    assert task["assignee_pool"] == pool and task["rotation_strategy"] == "round_robin"


async def test_g8_closing_the_options_flow_reloads_a_changed_object(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    r = await hass.config_entries.options.async_init(entry.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "object_settings"})
    await hass.config_entries.options.async_configure(r["flow_id"], {"name": "Washer 2000"})
    with patch.object(hass.config_entries, "async_schedule_reload") as reload:
        hass.config_entries.options.async_abort(r["flow_id"])
    reload.assert_called_once_with(entry.entry_id)


async def test_g11_a_shared_tag_does_not_block_editing(hass: HomeAssistant) -> None:
    entry = await _setup(hass, nfc_tag_id="tag-1")
    other = _object(hass, name="Dryer", uid="dryer", nfc_tag_id="tag-1")
    await hass.config_entries.async_setup(other.entry_id)
    await hass.async_block_till_done()
    form = await _open_edit_task(hass, entry)
    result = await hass.config_entries.options.async_configure(form["flow_id"], {"name": "Change Filter", "type": "cleaning", "nfc_tag_id": "tag-1"})
    assert result.get("errors") in (None, {})


# ─── N: notifications and voice ──────────────────────────────────────────


async def test_n3_a_stale_repair_is_purged_and_changes_nothing(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.issues import async_purge_unnamed_entity_issues, stale_action_issue_id
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    action = {"service": "button.press", "target": {"entity_id": "button.new"}}
    entry = await _setup(hass, on_complete_action=action)
    issue_id = stale_action_issue_id(entry.entry_id, TASK, "button.old")
    ir.async_create_issue(
        hass, DOMAIN, issue_id, is_fixable=True, severity=ir.IssueSeverity.WARNING, translation_key="stale_action_entity",
        data={"entry_id": entry.entry_id, "task_id": TASK, "task_name": "x", "stale_entity": "button.old"},
    )
    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.issue_id = issue_id
    flow.data = {"entry_id": entry.entry_id, "task_id": TASK, "stale_entity": "button.old"}
    result = await flow.async_step_replace_entity({"new_entity": "button.other"})
    assert result["type"] == FlowResultType.ABORT and result["reason"] == "already_fixed"
    assert _live(hass, entry.entry_id).data[CONF_TASKS][TASK]["on_complete_action"]["target"]["entity_id"] == "button.new"
    assert ir.async_get(hass).async_get_issue(DOMAIN, issue_id) is None
    assert async_purge_unnamed_entity_issues(hass, entry.entry_id, TASK, trigger_entities=set(), action_entities={"button.new"}) == 0


async def test_n3_removing_a_trigger_keeps_a_calendar_schedule(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    trigger = {"type": "threshold", "entity_ids": ["sensor.gone"], "entity_id": "sensor.gone", "trigger_above": 5}
    entry = await _setup(hass, schedule={"kind": "weekdays", "weekdays": [0, 3]}, interval_days=None, trigger_config=trigger)
    flow = MissingTriggerEntityRepairFlow()
    flow.hass = hass
    flow.data = {"entry_id": entry.entry_id, "task_id": TASK, "entity_id": "sensor.gone"}
    await flow.async_step_remove_trigger({})
    await hass.async_block_till_done()
    task = _live(hass, entry.entry_id).data[CONF_TASKS][TASK]
    assert "trigger_config" not in task
    assert task["schedule"]["kind"] == "weekdays"


async def test_n4_due_today_does_not_list_a_task_due_in_three_weeks(hass: HomeAssistant) -> None:
    from homeassistant.helpers import intent

    from custom_components.maintenance_supporter.intent import INTENT_LIST_TASKS, async_setup_intents

    await _setup(hass, warning_days=30, last_performed=_days_ago(9))  # due in 21 days: due soon
    await async_setup_intents(hass)
    response = await intent.async_handle(hass, "test", INTENT_LIST_TASKS, {"within_days": {"value": 0}}, language="en")
    assert "Change Filter" not in str(response.speech.get("plain", {}).get("speech", ""))


async def test_n6_a_reminder_waiting_for_a_slot_is_not_seeded_as_sent(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.notification_manager import notification_key, task_key_of

    entry = await _setup(hass)
    nm = _nm(hass)
    nm._deferred_today.add(task_key_of(entry.entry_id, TASK))
    nm._last_notified.pop(notification_key(entry.entry_id, TASK, MaintenanceStatus.OVERDUE), None)
    nm.seed_startup_state(entry.entry_id, TASK, MaintenanceStatus.OVERDUE)
    assert notification_key(entry.entry_id, TASK, MaintenanceStatus.OVERDUE) not in nm._last_notified


async def test_n8_a_persistent_notification_replaces_its_predecessor(hass: HomeAssistant) -> None:
    from pytest_homeassistant_custom_component.common import async_mock_service

    from custom_components.maintenance_supporter.helpers.notification_manager import async_dispatch_notify

    calls = async_mock_service(hass, "notify", "persistent_notification")
    await async_dispatch_notify(hass, "notify.persistent_notification", {"title": "t", "message": "m", "data": {"tag": "ms_task_1"}})
    assert calls[0].data["data"]["notification_id"] == f"{DOMAIN}_ms_task_1"


async def test_n11_nobody_to_tell_is_logged_once(hass: HomeAssistant, caplog: pytest.LogCaptureFixture) -> None:
    entry = await _setup(hass)
    nm = _nm(hass)
    with patch.object(type(nm), "notify_service", new=""), patch.object(type(nm), "event_only", new=False):
        for _ in range(3):
            await nm._resolve_and_send(None, title="t", message="m", entry_id=entry.entry_id, task_id=TASK, context={})
    assert caplog.text.count("No notification target") == 1


async def test_n12_a_silent_arrival_sets_no_cooldown(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.places import PlaceArrivals

    await _setup(hass, object_extra={"place": "zone.cabin"})
    arrivals = PlaceArrivals(hass)
    arrivals._known["person.ann"] = {"zone.cabin"}
    hass.states.async_set("person.ann", "Cabin", {"user_id": "u1"})
    nm = _nm(hass)
    with (
        patch.object(nm, "async_place_arrival", AsyncMock(return_value=False)),
        patch("custom_components.maintenance_supporter.helpers.places.due_tasks_at", return_value=[{"task_id": TASK}]),
    ):
        arrivals._stayed("person.ann", "zone.cabin", dt_util.utcnow())
        await hass.async_block_till_done()
    assert ("person.ann", "zone.cabin") not in arrivals._last_sent


async def test_g10_the_adaptive_error_form_keeps_the_task_name(hass: HomeAssistant) -> None:
    entry = await _setup(hass, options={"advanced_adaptive_visible": True})
    r = await hass.config_entries.options.async_init(entry.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "manage_tasks"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"selected_task": TASK, "go_back": False})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "adaptive_scheduling"})
    r = await hass.config_entries.options.async_configure(
        r["flow_id"], {"adaptive_enabled": True, "min_interval_days": 90, "max_interval_days": 10}
    )
    assert r["errors"] == {"min_interval_days": "min_exceeds_max"}
    assert r["description_placeholders"] == {"task_name": "Change Filter"}


async def test_the_own_calendar_is_no_calendar_schedule_source(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.config_flow_helpers import calendar_schema, own_calendar_entity_ids

    await setup_integration(hass, _global(hass))
    own = own_calendar_entity_ids(hass)
    assert own, "precondition: the integration's calendar is registered"
    key = next(k for k in calendar_schema("calendar", exclude=own).schema if str(k) == "entity_id")
    selector = calendar_schema("calendar", exclude=own).schema[key]
    assert selector.config["exclude_entities"] == own


async def test_n5_the_quiet_summary_leaves_out_what_is_done_since(hass: HomeAssistant) -> None:
    """Held hours ago, a task completed since was still in the summary."""
    from custom_components.maintenance_supporter.helpers.notification_manager import notification_key

    entry = await _setup(hass, options={"notifications_enabled": True, "notify_service": "notify.test"})  # OK: done 10 days ago
    nm = _nm(hass)
    key = notification_key(entry.entry_id, TASK, MaintenanceStatus.OVERDUE)
    nm._quiet_held[key] = {"entry_id": entry.entry_id, "task_id": TASK, "task_name": "Change Filter", "status": MaintenanceStatus.OVERDUE}
    with (
        patch.object(nm, "_is_quiet_hours", return_value=False),
        patch("custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", AsyncMock(return_value=True)) as send,
    ):
        sent = await nm.async_flush_quiet_held()
    send.assert_not_called()
    assert sent is False
    assert key not in nm._quiet_held


async def test_n7_a_bundle_counts_only_reminders_due_now(hass: HomeAssistant) -> None:
    """One task reminded an hour ago and one new: the threshold of two was met
    and the new one went out as a "bundle" to the household — without its
    person's routing and buttons."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATION_BUNDLE_THRESHOLD,
        CONF_NOTIFICATION_BUNDLING_ENABLED,
        CONF_QUIET_HOURS_ENABLED,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import notification_key

    g = _global(
        hass,
        notifications_enabled=True,
        notify_service="notify.household",
        **{CONF_NOTIFICATION_BUNDLING_ENABLED: True, CONF_NOTIFICATION_BUNDLE_THRESHOLD: 2, CONF_QUIET_HOURS_ENABLED: False},
    )
    tasks = {
        tid: {**build_task_data(task_id=tid, interval_days=30, last_performed=_days_ago(60), object_id="pump"), "name": name}
        for tid, name in (("t1", "Clean gutters"), ("t2", "Sweep chimney"))
    }
    obj = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title="Pump",
        data=build_object_entry_data(object_data=build_object_data(name="Pump", object_id="pump"), tasks=tasks),
        source="user", unique_id="maintenance_supporter_pump",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    coord = obj.runtime_data.coordinator
    nm = _nm(hass)
    nm._last_notified.clear()
    nm._last_notified[notification_key(obj.entry_id, "t1", MaintenanceStatus.OVERDUE)] = dt_util.now()
    with (
        patch.object(nm, "async_send_bundled", new_callable=AsyncMock) as bundled,
        patch.object(nm, "async_task_status_changed", new_callable=AsyncMock) as per_task,
    ):
        coord._previous_statuses = {}
        await coord._async_notify_status_changes(as_results(coord.data[CONF_TASKS]))
    assert bundled.call_count == 0
    assert per_task.call_count == 2
