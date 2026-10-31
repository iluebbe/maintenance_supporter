"""DRY audit 2026-10-12, round 5, tranche 2 — the drift bugs, backend half.

Each finding is a rule two or more surfaces spelled out on their own, and
one of them got it wrong:

- BR5-A2: undoing a purchase left the reopened buy reminder without its part
  link (the buy-task re-plan then created a second one) and kept the price
  the purchase had set.
- BR5-A6: four readers walked a completion action's entities; two read the
  target only — a device swap, the stale-target repair and its scan missed
  ``data.entity_id``, and the repair overwrote a whole target list.
- BR5-A8: voice "bought …" took a completed buy reminder for an open one.
- BR5-A9: a completion whose only money was its parts' value, and an undo,
  left the budget totals stale.
- BI5-A2: duplicating an object twice, or creating one under a taken name,
  failed with a bare ``already_configured``.
- BI5-A3: deleting a part left phase links and other objects' pool links on it.
- BI5-A4: the add_task service, the options flow and the adoption wrote new
  tasks into an archived object.
- BI5-A5: task/create and task/update stored contradicting flat recurrences.
- BI5-A7: a duplicate kept the source's pause and replacement chain.
- BI5-A9: the settings import took any vacation buffer, kept duplicate exempt
  tasks and cut group descriptions to a name's length.
- BI5-A10: the JSON and the CSV import read intervals, warning days and due
  dates by different rules.
- BI5-A11: the CSV dropped the place; the flows stored blank names; a link
  ignored the per-object document cap; stray untranslated errors.
- S8 / FE5-A4: the parts overview missed phase consumers; a saved view had
  no place.

Each docstring names the failure, so a red test says which bug came back.
"""

from __future__ import annotations

import json
from datetime import timedelta
from typing import Any
from unittest.mock import patch

import pytest
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_PARTS,
    CONF_PARTS_COST_MODE,
    CONF_TASKS,
    DOCUMENT_STORE_KEY,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_DOCS_PER_OBJECT,
    MAX_NAME_LENGTH,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD, normalize_part

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

TASK = "t1"


# ─── helpers ─────────────────────────────────────────────────────────────


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
    task = build_task_data(task_id=task_id, interval_days=30, last_performed="2026-09-01", object_id=uid)
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


async def _add_object(hass: HomeAssistant, **kwargs: Any) -> MockConfigEntry:
    """A further object on an already set-up integration."""
    obj = _object(hass, **kwargs)
    await hass.config_entries.async_setup(obj.entry_id)
    await hass.async_block_till_done()
    return obj


def _live(hass: HomeAssistant, entry_id: str) -> Any:
    return hass.config_entries.async_get_entry(entry_id)


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any], *, user: str = "u1") -> Any:
    conn = make_ws_connection()
    conn.user.id = user
    conn.user.is_admin = True
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return conn


def _translation_key(conn: Any) -> str | None:
    return conn.send_error.call_args.kwargs.get("translation_key")


def _buy_tasks(hass: HomeAssistant, entry_id: str, part_id: str) -> list[str]:
    tasks = _live(hass, entry_id).data[CONF_TASKS]
    return [tid for tid, t in tasks.items() if (t.get(PART_REF_FIELD) or {}).get("part_id") == part_id]


# ─── BR5-A2: undoing a purchase ──────────────────────────────────────────

_SPRAY = {
    "id": "spray",
    "name": "Glass cleaner",
    "unit": "ml",
    "cost": 4.99,
    "package_size": 500,
    "restock_quantity": 2,
    "reorder_threshold": 200,
    "auto_buy_task": True,
}


async def test_undoing_a_purchase_reopens_the_one_buy_reminder(hass: HomeAssistant) -> None:
    """The re-plan after the purchase detaches the done reminder from its
    part. The undo reopened it without the link, so the next re-plan created
    a second reminder — and the price the purchase set stayed."""
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_complete_task, ws_undo_completion

    entry = await _setup(hass, options={CONF_PARTS_COST_MODE: "use"}, parts={"spray": _SPRAY})
    entry.runtime_data.store.set_part_stock("spray", 0)
    await async_reconcile_buy_tasks(hass, entry)
    await hass.async_block_till_done()
    (buy_id,) = _buy_tasks(hass, entry.entry_id, "spray")

    msg = {"type": "x", "entry_id": entry.entry_id, "task_id": buy_id, "cost": 30, "restock_quantity": 2}
    assert_ws_success(await _ws(hass, ws_complete_task, msg))
    await hass.async_block_till_done()
    live = _live(hass, entry.entry_id)
    assert live.runtime_data.store.get_part_stock("spray") == 1000
    assert live.data[CONF_PARTS]["spray"]["cost"] == 15.0
    assert _buy_tasks(hass, entry.entry_id, "spray") == [], "precondition: the re-plan detached the done reminder"

    assert_ws_success(await _ws(hass, ws_undo_completion, {"type": "x", "entry_id": entry.entry_id, "task_id": buy_id}))
    await hass.async_block_till_done()

    live = _live(hass, entry.entry_id)
    assert live.runtime_data.store.get_part_stock("spray") == 0
    assert live.data[CONF_PARTS]["spray"]["cost"] == 4.99
    assert _buy_tasks(hass, entry.entry_id, "spray") == [buy_id], "a second reminder was created"
    assert not [h for h in live.runtime_data.store.get_history(buy_id) if h.get("type") == HistoryEntryType.COMPLETED]


# ─── BR5-A6: a completion action's entities ──────────────────────────────


def test_action_entity_ids_reads_target_and_data() -> None:
    from custom_components.maintenance_supporter.helpers.action_listener import action_entity_ids, map_action_entity_ids

    action = {"service": "button.press", "target": {"entity_id": ["button.a", "button.b"]}, "data": {"entity_id": "button.c"}}
    assert action_entity_ids(action) == ["button.a", "button.b", "button.c"]
    assert action_entity_ids({"service": "x", "data": {"entity_id": "button.a"}, "target": {"entity_id": "button.a"}}) == ["button.a"]
    assert action_entity_ids(None) == [] and action_entity_ids({"target": "button.a"}) == []

    moved, changed = map_action_entity_ids(action, lambda e: e.replace("button.b", "button.z").replace("button.c", "button.y"))
    assert changed
    assert moved["target"]["entity_id"] == ["button.a", "button.z"] and moved["data"]["entity_id"] == "button.y"
    assert action["data"]["entity_id"] == "button.c", "the input was mutated"
    assert map_action_entity_ids(action, lambda e: e) == (action, False)


def _vacuum(hass: HomeAssistant, serial: str, name: str) -> tuple[dr.DeviceEntry, str]:
    """A device with a reset button named the same way on every unit."""
    cfg = MockConfigEntry(domain="roborock", title=name)
    cfg.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=cfg.entry_id, identifiers={("roborock", serial)}, name=name)
    button = er.async_get(hass).async_get_or_create(
        "button",
        "roborock",
        f"{serial}_reset_filter",
        config_entry=cfg,
        device_id=device.id,
        translation_key="reset_filter",
        original_name="Reset filter",
        suggested_object_id=f"{name.lower().replace(' ', '_')}_reset_filter",
    )
    return device, button.entity_id


async def test_a_device_swap_moves_an_action_entity_in_the_data(hass: HomeAssistant) -> None:
    """``button.press`` takes its button as ``data.entity_id`` too; the swap
    rewrote the target only and left the action pressing the old unit."""
    from custom_components.maintenance_supporter.helpers.device_swap import move_tasks_to_device

    old_dev, old_button = _vacuum(hass, "old", "Robot Old")
    new_dev, new_button = _vacuum(hass, "new", "Robot New")
    task = build_task_data(task_id="f", name="Filter")
    task["on_complete_action"] = {"service": "button.press", "data": {"entity_id": old_button}}

    moved, report = move_tasks_to_device(hass, {"f": task}, {old_dev.id}, new_dev.id, user_id=None)

    assert moved["f"]["on_complete_action"]["data"]["entity_id"] == new_button
    assert report.moved == 1
    assert task["on_complete_action"]["data"]["entity_id"] == old_button, "the input was mutated"


async def test_the_stale_action_scan_sees_an_entity_in_the_data(hass: HomeAssistant) -> None:
    """The scan read ``target.entity_id`` only: an action naming a deleted
    button in its data failed every completion without a repair."""
    from custom_components.maintenance_supporter.helpers.issues import stale_action_issue_id

    entry = await _setup(hass, on_complete_action={"service": "button.press", "data": {"entity_id": "button.gone"}})
    coordinator = entry.runtime_data.coordinator
    with patch.object(coordinator, "_in_startup_grace_period", return_value=False):
        coordinator._check_stale_action_entities()
    assert ir.async_get(hass).async_get_issue(DOMAIN, stale_action_issue_id(entry.entry_id, TASK, "button.gone")) is not None


async def test_the_stale_action_repair_replaces_only_the_missing_entity(hass: HomeAssistant) -> None:
    """The repair overwrote the whole target with the new entity: the other
    lights of a list were dropped, and a stale entity in the data stayed."""
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    action = {"service": "light.turn_off", "target": {"entity_id": ["light.kitchen", "light.gone"]}}
    entry = await _setup(hass, on_complete_action=action)
    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {"entry_id": entry.entry_id, "task_id": TASK, "task_name": "Change Filter", "stale_entity": "light.gone"}

    flow._patch_action_entity(_live(hass, entry.entry_id), "light.hall")
    stored = _live(hass, entry.entry_id).data[CONF_TASKS][TASK]["on_complete_action"]
    assert stored["target"]["entity_id"] == ["light.kitchen", "light.hall"]

    data_action = {"service": "button.press", "data": {"entity_id": "button.gone"}}
    hass.config_entries.async_update_entry(
        entry, data={**entry.data, CONF_TASKS: {TASK: {**entry.data[CONF_TASKS][TASK], "on_complete_action": data_action}}}
    )
    flow.data = {**flow.data, "stale_entity": "button.gone"}
    flow._patch_action_entity(_live(hass, entry.entry_id), "button.new")
    stored = _live(hass, entry.entry_id).data[CONF_TASKS][TASK]["on_complete_action"]
    assert stored["data"]["entity_id"] == "button.new"
    assert "target" not in stored


# ─── BR5-A8: the open buy reminder ───────────────────────────────────────

_FILTERS = {"p1": {"id": "p1", "name": "Water filter", "reorder_threshold": 2, "restock_quantity": 3, "auto_buy_task": True}}


async def test_voice_does_not_take_a_done_buy_reminder_for_an_open_one(hass: HomeAssistant) -> None:
    """Voice "bought …" matched any task carrying the part link; a reminder
    completed a moment before (its link not yet detached) was completed a
    second time — two restocks for one purchase."""
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks, open_buy_task_id

    entry = await _setup(hass, parts=_FILTERS)
    entry.runtime_data.store.set_part_stock("p1", 1)
    await async_reconcile_buy_tasks(hass, entry)
    await hass.async_block_till_done()
    (buy_id,) = _buy_tasks(hass, entry.entry_id, "p1")
    live = _live(hass, entry.entry_id)

    assert open_buy_task_id(live, "p1") == buy_id
    with patch.object(live.runtime_data.store, "get_last_performed", side_effect=lambda tid: "2026-10-16" if tid == buy_id else None):
        assert open_buy_task_id(live, "p1") is None


def test_the_open_buy_reminder_rule() -> None:
    from custom_components.maintenance_supporter.helpers.parts import buy_task_part_id, is_open_buy_task

    task = {"id": "b", "enabled": True, PART_REF_FIELD: {"part_id": "p1"}}
    assert buy_task_part_id(task) == "p1" and buy_task_part_id({"id": "x"}) is None
    assert is_open_buy_task(task, {}, None)
    assert not is_open_buy_task(task, {}, "2026-10-16")
    assert not is_open_buy_task({**task, "enabled": False}, {}, None)
    assert not is_open_buy_task(task, {"paused_at": "2026-10-01T00:00:00+00:00"}, None)
    assert not is_open_buy_task({"id": "t", "enabled": True}, {}, None)


# ─── BR5-A9: the budget follows every money-carrying write ───────────────


async def test_the_parts_value_alone_refreshes_the_budget(hass: HomeAssistant) -> None:
    """ "When used", a completion's only money can be its parts' value; the
    budget refreshed for a typed cost only and stayed stale for the hour.
    An undo bypassed the refresh altogether."""
    parts = {"spray": {"id": "spray", "name": "Glass cleaner", "unit": "ml", "cost": 5.0, "package_size": 500}}
    entry = await _setup(hass, options={CONF_PARTS_COST_MODE: "use"}, parts=parts, consumes_parts=[{"part_id": "spray", "quantity": 100}])
    entry.runtime_data.store.set_part_stock("spray", 1000)
    coordinator = entry.runtime_data.coordinator

    with patch.object(coordinator, "recalculate_budget_cache", wraps=coordinator.recalculate_budget_cache) as spy:
        await coordinator.complete_maintenance(TASK)
        assert spy.called, "a completion with only a parts value did not refresh the budget"
        spy.reset_mock()
        await coordinator.async_restore_task_fields(TASK, {"history": []}, {})
        assert spy.called, "an undo did not refresh the budget"


# ─── BI5-A2: object names ────────────────────────────────────────────────


async def test_duplicating_twice_numbers_the_copies(hass: HomeAssistant) -> None:
    """The duplicate always proposed "X (copy)": the second one failed."""
    from custom_components.maintenance_supporter.websocket.objects import ws_duplicate_object

    entry = await _setup(hass)
    msg = {"type": f"{DOMAIN}/object/duplicate", "entry_id": entry.entry_id}
    first = assert_ws_success(await _ws(hass, ws_duplicate_object, msg))["entry_id"]
    second = assert_ws_success(await _ws(hass, ws_duplicate_object, msg))["entry_id"]
    assert _live(hass, first).data[CONF_OBJECT]["name"] == "Washer (copy)"
    assert _live(hass, second).data[CONF_OBJECT]["name"] == "Washer (copy) 2"


async def test_object_create_refuses_a_taken_name_also_on_a_dry_run(hass: HomeAssistant) -> None:
    """The dry run called a taken name valid; the create then failed with a
    bare "already_configured" nobody could read."""
    from custom_components.maintenance_supporter.websocket.objects import ws_create_object

    await _setup(hass)
    for dry_run in (True, False):
        conn = await _ws(hass, ws_create_object, {"type": f"{DOMAIN}/object/create", "name": " washer ", "dry_run": dry_run})
        assert_ws_error(conn, "invalid_input")
        assert _translation_key(conn) == "object_name_taken"


async def test_add_object_service_refuses_a_taken_or_overlong_name(hass: HomeAssistant) -> None:
    """The service answered a taken name with "could not be carried out:
    already_configured", and stored names up to 255 characters no other
    surface could save again."""
    await _setup(hass)
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "add_object", {"name": "Washer"}, blocking=True)
    assert err.value.translation_key == "object_name_taken"
    with pytest.raises((vol.Invalid, HomeAssistantError)):
        await hass.services.async_call(DOMAIN, "add_object", {"name": "x" * (MAX_NAME_LENGTH + 1)}, blocking=True)


async def test_unique_object_name(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.object_names import unique_object_name

    await _setup(hass)
    await _add_object(hass, name="Washer 2", uid="washer2")
    assert unique_object_name(hass, "Dryer") == "Dryer"
    assert unique_object_name(hass, "Washer") == "Washer 3"
    assert len(unique_object_name(hass, "y" * (MAX_NAME_LENGTH + 20))) == MAX_NAME_LENGTH


# ─── BI5-A7: a duplicate is a new unit ───────────────────────────────────


async def test_a_duplicate_is_not_paused_or_chained_and_owns_its_tasks(hass: HomeAssistant) -> None:
    """The copy kept the source's pause (a frozen new object), its "Replaces /
    Replaced by" links, and the template origin of every task."""
    from custom_components.maintenance_supporter.websocket.objects import ws_duplicate_object

    paused = (dt_util.now() - timedelta(days=1)).isoformat()
    entry = await _setup(
        hass,
        object_extra={
            "paused_at": paused,
            "paused_until": (dt_util.now().date() + timedelta(days=30)).isoformat(),
            "predecessor_entry_id": "a" * 32,
            "replaced_by_entry_id": "b" * 32,
        },
        origin={"kind": "template", "template_id": "washing_machine", "task_key": "filter"},
    )
    assert _live(hass, entry.entry_id).data[CONF_TASKS][TASK].get("origin"), "precondition: the source task has an origin"

    copy_id = assert_ws_success(await _ws(hass, ws_duplicate_object, {"type": f"{DOMAIN}/object/duplicate", "entry_id": entry.entry_id}))[
        "entry_id"
    ]
    copy = _live(hass, copy_id)
    for key in ("paused_at", "paused_until", "predecessor_entry_id", "replaced_by_entry_id"):
        assert not copy.data[CONF_OBJECT].get(key), key
    assert all("origin" not in t for t in copy.data[CONF_TASKS].values())


# ─── BI5-A3 / S8: every part link ────────────────────────────────────────

_FILTER = {"p1": {"id": "p1", "name": "Filter cartridge"}}
_PHASES = {
    "phases": {"replace": {"name": "Replace", "consumes_parts": [{"part_id": "p1", "quantity": 1}]}, "clean": {"name": "Clean"}},
    "phase_sequence": ["replace", "clean"],
}


async def test_deleting_a_part_prunes_phase_and_pool_links(hass: HomeAssistant) -> None:
    """Only this object's task-level links were pruned: a phase link and a
    borrower's pool link dangled and raised a broken-part-link repair."""
    from custom_components.maintenance_supporter.websocket.parts import ws_delete_part

    owner = await _setup(hass, parts=_FILTER, **_PHASES)
    pool_phases = {"replace": {"name": "Replace", "consumes_parts": [{"part_id": "p1", "quantity": 1, "entry_id": owner.entry_id}]}}
    spa = await _add_object(
        hass,
        name="Spa",
        uid="spa",
        task_id="b1",
        consumes_parts=[{"part_id": "p1", "quantity": 2, "entry_id": owner.entry_id}, {"part_id": "own", "quantity": 1}],
        phases=pool_phases,
        phase_sequence=["replace"],
    )

    assert_ws_success(await _ws(hass, ws_delete_part, {"type": f"{DOMAIN}/part/delete", "entry_id": owner.entry_id, "part_id": "p1"}))

    own_task = _live(hass, owner.entry_id).data[CONF_TASKS][TASK]
    assert "consumes_parts" not in own_task["phases"]["replace"]
    borrower = _live(hass, spa.entry_id).data[CONF_TASKS]["b1"]
    assert borrower["consumes_parts"] == [{"part_id": "own", "quantity": 1}], "a link of the borrower's own was dropped"
    assert "consumes_parts" not in borrower["phases"]["replace"]


async def test_the_parts_overview_lists_phase_consumers(hass: HomeAssistant) -> None:
    """A phase consumes too (#139); the overview listed task-level links only."""
    from custom_components.maintenance_supporter.websocket.parts import ws_parts_overview

    await _setup(hass, parts=_FILTER, **_PHASES)
    result = assert_ws_success(await _ws(hass, ws_parts_overview, {"type": f"{DOMAIN}/parts/overview"}))
    (row,) = result["parts"]
    assert [c["object_name"] for c in row["consumers"]] == ["Washer"]


# ─── BI5-A4: an archived object gets no new tasks ────────────────────────

_ARCHIVED = {"archived_at": "2026-09-01T00:00:00+00:00"}


async def test_an_archived_object_gets_no_new_tasks_from_any_surface(hass: HomeAssistant) -> None:
    """task/create refused it; the add_task service, the options flow and the
    adoption of discovered duties wrote into it — hidden tasks that notify."""
    from custom_components.maintenance_supporter.helpers.entry_tasks import ArchivedObjectError, insert_new_task
    from custom_components.maintenance_supporter.websocket.adopt_batch import AdoptBatch

    entry = await _setup(hass, object_extra=_ARCHIVED)
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "add_task", {"entry_id": entry.entry_id, "name": "New"}, blocking=True)
    assert err.value.translation_key == "archived_no_new_tasks"
    with pytest.raises(ArchivedObjectError):
        insert_new_task(hass, _live(hass, entry.entry_id), build_task_data(task_id="n", name="New"))
    assert AdoptBatch(hass).target_entry(entry.entry_id) is None
    assert list(_live(hass, entry.entry_id).data[CONF_TASKS]) == [TASK]


# ─── BI5-A5: a flat recurrence that contradicts itself ───────────────────


@pytest.mark.parametrize(
    ("fields", "reason"),
    [
        ({"schedule_type": "weekly"}, "Unknown schedule_type"),
        ({"schedule_type": "one_time"}, "needs a due_date"),
        ({"schedule_type": "manual", "interval_days": 30}, "no interval"),
    ],
)
async def test_task_create_refuses_a_contradicting_recurrence(hass: HomeAssistant, fields: dict[str, Any], reason: str) -> None:
    """The add_task service refused these; task/create stored them — any
    text as the kind, a one-time task without a date, a manual interval."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task

    entry = await _setup(hass)
    conn = await _ws(hass, ws_create_task, {"type": f"{DOMAIN}/task/create", "entry_id": entry.entry_id, "name": "New", **fields})
    _code, message = assert_ws_error(conn, "invalid_input")
    assert reason in message
    assert list(_live(hass, entry.entry_id).data[CONF_TASKS]) == [TASK]


async def test_task_update_checks_the_recurrence_against_the_stored_date(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    entry = await _setup(hass)
    base = {"type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": TASK}
    assert_ws_error(await _ws(hass, ws_update_task, {**base, "schedule_type": "one_time"}), "invalid_input")
    assert_ws_error(await _ws(hass, ws_update_task, {**base, "schedule_type": "manual", "interval_days": 7}), "invalid_input")
    due = (dt_util.now().date() + timedelta(days=9)).isoformat()
    assert_ws_success(await _ws(hass, ws_update_task, {**base, "schedule_type": "one_time", "due_date": due}))
    # The date is stored now: re-saving the kind alone is fine.
    assert_ws_success(await _ws(hass, ws_update_task, {**base, "schedule_type": "one_time"}))


# ─── BI5-A9: vacation settings ───────────────────────────────────────────


def test_the_vacation_rules() -> None:
    from custom_components.maintenance_supporter.helpers.vacation import clean_exempt_task_ids, valid_buffer_days

    assert [valid_buffer_days(v) for v in (0, 14, 15, -1, True, "3", 3.0)] == [0, 14, None, None, None, None, None]
    assert clean_exempt_task_ids([" a ", "a", "", 5, "b", "x" * 300]) == ["a", "b"]


async def test_the_settings_import_applies_the_vacation_and_group_rules(hass: HomeAssistant) -> None:
    """The import took any int as buffer, kept duplicate exempt tasks, and
    cut a group description to 200 characters (groups/create allows 2000)."""
    from custom_components.maintenance_supporter.helpers.global_options import get_global_entry
    from custom_components.maintenance_supporter.websocket.io import _apply_settings_import

    await setup_integration(hass, _global(hass))
    description = "d" * 500
    raw = {
        "vacation_buffer_days": 99,
        "vacation_exempt_task_ids": ["t1", " t1 ", "t2"],
        "groups": {"g1": {"name": "Weekly", "description": description, "task_refs": []}},
    }
    applied = _apply_settings_import(hass, raw)
    g = get_global_entry(hass)
    settings = {**g.data, **g.options}
    assert "vacation_buffer_days" not in applied
    assert settings["vacation_exempt_task_ids"] == ["t1", "t2"]
    assert settings["groups"]["g1"]["description"] == description

    _apply_settings_import(hass, {"vacation_buffer_days": 5})
    g = get_global_entry(hass)
    assert {**g.data, **g.options}["vacation_buffer_days"] == 5


# ─── BI5-A10: one import rule per field ──────────────────────────────────


def test_the_import_field_rules() -> None:
    from custom_components.maintenance_supporter.helpers.task_fields import import_due_date, import_interval_days, import_warning_days

    assert [import_interval_days(v) for v in (30, "30", "30.0", 0, "0", -5, 2.5, "x", None, True, 10**9)] == [
        30, 30, 30, None, None, None, None, None, None, None, None,
    ]
    assert [import_warning_days(v, 7) for v in (0, "14", 365, 366, -1, "x", None, False)] == [0, 14, 365, 7, 7, 7, 7, 7]
    assert [import_due_date(v) for v in ("2026-12-01", " 2026-12-01 ", "2026-02-31", "2026-12-01T10:00", 20261201, None)] == [
        "2026-12-01", "2026-12-01", None, None, None, None,
    ]


def test_the_csv_import_applies_the_json_rules() -> None:
    """The CSV kept a zero interval and 999 warning days for the sanitizer to
    clamp (1 and 365), and took 2026-02-31 as a due date."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_text = (
        "object_name,task_name,schedule_type,interval_days,warning_days,due_date\n"
        "Shed,Oil,time_based,0,999,\n"
        "Shed,Paint,one_time,,5,2026-02-31\n"
        "Shed,Grease,time_based,30.0,14,\n"
    )
    (obj,) = import_objects_csv(csv_text)
    tasks = {t["name"]: t for t in obj["tasks"].values()}
    assert "interval_days" not in tasks["Oil"] and tasks["Oil"]["warning_days"] == 7
    assert "due_date" not in tasks["Paint"]
    assert tasks["Grease"]["interval_days"] == 30 and tasks["Grease"]["warning_days"] == 14


async def test_the_json_import_checks_the_due_date_and_reads_numeric_text(hass: HomeAssistant) -> None:
    """The JSON import stored any due date, and dropped "30" (text) intervals
    the CSV import read."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, _global(hass))
    payload = {
        "objects": [
            {
                "object": {"name": "Imported"},
                "tasks": [
                    {"name": "Once", "schedule_type": "one_time", "due_date": "2026-02-31"},
                    {"name": "Text", "interval_days": "30", "warning_days": "3"},
                ],
            }
        ]
    }
    res = assert_ws_success(await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)}))
    assert any("2026-02-31" in w for w in res["imported"][0].get("warnings", []))
    tasks = {t["name"]: t for t in _live(hass, res["imported"][0]["entry_id"]).data[CONF_TASKS].values()}
    assert "due_date" not in tasks["Once"]
    assert tasks["Text"]["schedule"]["every"] == 30 and tasks["Text"]["warning_days"] == 3


# ─── BI5-A11: the stragglers ─────────────────────────────────────────────


async def test_the_csv_round_trip_keeps_the_place(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        export_object_records_csv,
        export_objects_csv,
        import_objects_csv,
    )

    await _setup(hass, object_extra={"place": "zone.cabin", "remind_on_site": True})
    await _add_object(hass, name="Dryer", uid="dryer")
    assert "zone.cabin" in export_object_records_csv(hass)
    objects = {o["object"]["name"]: o["object"] for o in import_objects_csv(export_objects_csv(hass))}
    assert objects["Washer"]["place"] == "zone.cabin" and objects["Washer"]["remind_on_site"] is True
    assert objects["Dryer"]["place"] is None and objects["Dryer"]["remind_on_site"] is False
    (bad,) = import_objects_csv("object_name,task_name,object_place\nShed,Oil,home\n")
    assert bad["object"]["place"] is None


async def test_checklist_progress_without_a_store_answers_not_loaded(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_checklist_progress

    entry = await _setup(hass, checklist=["Rinse"])
    with patch.object(_live(hass, entry.entry_id).runtime_data, "store", None):
        conn = await _ws(
            hass,
            ws_checklist_progress,
            {"type": f"{DOMAIN}/task/checklist_progress", "entry_id": entry.entry_id, "task_id": TASK, "checklist_state": {"Rinse": True}},
        )
    assert_ws_error(conn, "not_loaded")


async def test_a_future_history_date_is_refused_translated(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_update_history_entry

    stamp = "2026-09-01T10:00:00+00:00"
    entry = await _setup(hass, history=[{"timestamp": stamp, "type": "completed"}])
    future = (dt_util.now() + timedelta(days=3)).isoformat()
    msg = {"type": "x", "entry_id": entry.entry_id, "task_id": TASK, "original_timestamp": stamp, "timestamp": future}
    conn = await _ws(hass, ws_update_history_entry, msg)
    assert_ws_error(conn, "invalid_date")
    assert _translation_key(conn) == "date_in_future"


async def test_a_link_counts_toward_the_document_cap(hass: HomeAssistant) -> None:
    """Uploads stopped at 100 documents per object; links had no cap."""
    from custom_components.maintenance_supporter.websocket.documents import ws_documents_add_link

    entry = await _setup(hass)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    object_id = entry.data[CONF_OBJECT]["id"]
    for i in range(MAX_DOCS_PER_OBJECT):
        store.documents[f"d{i}"] = {"object_id": object_id, "kind": "weblink", "url": "https://example.com"}
    msg = {"type": f"{DOMAIN}/documents/add_link", "entry_id": entry.entry_id, "url": "https://example.com/manual.pdf"}
    assert_ws_error(await _ws(hass, ws_documents_add_link, msg), "limit_reached")


async def test_the_flows_trim_names_and_refuse_blank_ones(hass: HomeAssistant) -> None:
    """The flows stored "  Boiler " and a name of spaces."""
    from custom_components.maintenance_supporter.const import CONF_TASK_NAME, CONF_TASK_SCHEDULE_TYPE, CONF_TASK_TYPE

    await setup_integration(hass, _global(hass))
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "create_object"})
    blank = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"name": "   "})
    assert blank["type"] == FlowResultType.FORM and blank["errors"] == {"name": "name_empty"}

    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"name": "  Boiler "})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "add_task"})
    task_input = {CONF_TASK_NAME: "  ", CONF_TASK_TYPE: "cleaning", CONF_TASK_SCHEDULE_TYPE: "time_based"}
    blank_task = await hass.config_entries.flow.async_configure(result["flow_id"], user_input=task_input)
    assert blank_task["type"] == FlowResultType.FORM and blank_task["errors"] == {CONF_TASK_NAME: "name_empty"}
    hass.config_entries.flow.async_abort(result["flow_id"])


async def test_the_options_flow_keeps_names_and_refuses_blank_ones(hass: HomeAssistant) -> None:
    entry = await _setup(hass)

    r = await hass.config_entries.options.async_init(entry.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "object_settings"})
    blank = await hass.config_entries.options.async_configure(r["flow_id"], {"name": "  "})
    assert blank["type"] == FlowResultType.FORM and blank["errors"] == {"name": "name_empty"}
    hass.config_entries.options.async_abort(r["flow_id"])

    r = await hass.config_entries.options.async_init(entry.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "manage_tasks"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"selected_task": TASK})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "edit_task"})
    defaults: dict[str, Any] = {}
    for key in r["data_schema"].schema:
        if isinstance(key, vol.Optional | vol.Required) and key.default is not vol.UNDEFINED and key.default() is not None:
            defaults[str(key)] = key.default()
    await hass.config_entries.options.async_configure(r["flow_id"], {**defaults, "name": "   "})
    await hass.async_block_till_done()
    assert _live(hass, entry.entry_id).data[CONF_TASKS][TASK]["name"] == "Change Filter"


# ─── FE5-A4: a saved view keeps its place ────────────────────────────────


def test_a_saved_view_keeps_its_place() -> None:
    from custom_components.maintenance_supporter.helpers.saved_views import _clean_filters

    assert _clean_filters({"place": "zone.cabin"})["place"] == "zone.cabin"
    assert _clean_filters({"place": "home"})["place"] == "home"
    assert [_clean_filters({"place": p})["place"] for p in ("garage", 5, "zone." + "x" * 300)] == ["", "", ""]
    assert _clean_filters({})["place"] == ""
