"""Bug audit 2026-10-17, tranche 2: the medium findings.

Each test names its finding; the fix it pins is described there.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager, notification_key

from .conftest import build_global_entry_data


def _notify_global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(notifications_enabled=True, notify_service="notify.mobile_app"),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile_app",
            CONF_NOTIFY_OVERDUE_INTERVAL: 12,
            CONF_NOTIFY_TRIGGERED_INTERVAL: 0,
            CONF_MAX_NOTIFICATIONS_PER_DAY: 0,
            # Quiet hours (22:00-08:00 in the fixtures' US/Pacific) held the
            # reminder whenever the suite ran in them.
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    entry.add_to_hass(hass)
    return entry


async def _offer(nm: NotificationManager, task: str, status: str) -> None:
    await nm.async_task_status_changed(
        entry_id="e1", task_id=task, task_name=f"Task {task}", object_name="Obj", new_status=status,
        task_data={"priority": "normal", "notify_enabled": True},
    )


# ─── N-5: the startup seed and the restored bookkeeping ─────────────────────


async def test_n5_a_reminder_never_sent_is_not_seeded_after_a_restart(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    """The seed stamped every task already due at the first refresh as sent,
    skipping only persisted, deferred and held ones. A filter that triggered
    during the vacation (silenced, never stamped) was seeded by a restart
    during the vacation and, *triggered* being a once-only status, never
    announced. The bookkeeping is persisted: once it was loaded, a reminder
    it has no stamp for is still owed."""
    _notify_global(hass)
    first = NotificationManager(hass)
    await first.async_load()
    assert first.begin_startup_seed("e1"), "no bookkeeping saved yet: the first run seeds, as before"
    await first._store.async_save(first._snapshot())

    nm = NotificationManager(hass)
    sent = AsyncMock(return_value=True)
    patch.object(nm, "_resolve_and_send", sent).start()
    await nm.async_load()
    assert nm.begin_startup_seed("e1") is False
    await _offer(nm, "filter", MaintenanceStatus.TRIGGERED)
    assert sent.await_count == 1, "announced once the vacation is over"
    assert notification_key("e1", "filter", MaintenanceStatus.TRIGGERED) in nm._last_notified


# ─── W-1: the one battery fleet ─────────────────────────────────────────────


def _fleet_object(hass: HomeAssistant, name: str, *, archived: bool = False) -> MockConfigEntry:
    from custom_components.maintenance_supporter.const import BATTERY_FLEET_OBJECT_FLAG

    from .conftest import build_object_data, build_object_entry_data

    obj_data = build_object_data(name=name)
    obj_data[BATTERY_FLEET_OBJECT_FLAG] = True
    if archived:
        obj_data["archived_at"] = "2026-10-01T10:00:00+00:00"
    entry = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title=name,
        data=build_object_entry_data(object_data=obj_data), source="user", unique_id=f"ms_w1_{name}",
    )
    entry.add_to_hass(hass)
    return entry


async def test_w1_the_battery_fleet_cannot_be_replaced(hass: HomeAssistant) -> None:
    """object/replace copied the fleet object: a second fleet ran a task
    whose parts no fleet code reaches, and every fleet command acted on the
    archived predecessor. Refused like object/duplicate."""
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    from .conftest import call_ws_handler, make_ws_connection, setup_integration

    fleet = _fleet_object(hass, "Batteries")
    await setup_integration(hass, _notify_global(hass), fleet)
    conn = make_ws_connection()
    await call_ws_handler(ws_replace_object, hass, conn, {"id": 1, "type": f"{DOMAIN}/object/replace", "entry_id": fleet.entry_id})
    assert conn.send_error.call_args.kwargs["translation_key"] == "fleet_not_replaceable"
    assert len([e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]) == 1
    assert not fleet.data["object"].get("archived_at")


def test_w1_a_live_fleet_wins_over_an_archived_one(hass: HomeAssistant) -> None:
    """A fleet replaced before the refusal left its flag on the archived
    predecessor, which is listed first."""
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_entry

    archived = _fleet_object(hass, "Batteries", archived=True)
    assert find_fleet_entry(hass) is archived, "an archived fleet alone is still the fleet"
    live = _fleet_object(hass, "Batteries 2")
    assert find_fleet_entry(hass) is live


# ─── W-2: dates an import cannot read ───────────────────────────────────────


def test_w2_the_csv_import_drops_a_date_it_cannot_read() -> None:
    """A spreadsheet saves "01.10.2026" back. Stored as it was, the task never
    fell due and the object dialog, which sends the date back on every save,
    refused every edit of the object."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = (
        "object_name,object_installation_date,object_warranty_expiry,task_name,schedule_type,interval_days,last_performed\n"
        "Boiler,01.10.2026,20301231,Service,time_based,365,01.10.2026\n"
        "Boiler,,,Bleed,time_based,30,20261001\n"
    )
    (boiler,) = import_objects_csv(csv_content)
    assert boiler["object"]["installation_date"] is None
    assert boiler["object"]["warranty_expiry"] == "2030-12-31"
    service, bleed = boiler["tasks"].values()
    assert "last_performed" not in service and "last_performed" not in str(service.get("schedule"))
    assert bleed["last_performed"] == "2026-10-01"
    assert "Boiler: installation date '01.10.2026' is not a date — dropped" in boiler["warnings"]
    assert "Service: last performed date '01.10.2026' is not a date — dropped" in boiler["warnings"]


async def test_w2_the_json_import_drops_or_mends_the_dates(hass: HomeAssistant) -> None:
    import json

    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    from .conftest import assert_ws_success, call_ws_handler, make_ws_connection, setup_integration

    await setup_integration(hass, _notify_global(hass))
    payload = {
        "objects": [
            {
                "object": {"name": "Boiler", "installation_date": "01.10.2026", "warranty_expiry": "20301231"},
                "tasks": [{"name": "Service", "interval_days": 365, "last_performed": "20261001"}],
            }
        ]
    }
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)})
    await hass.async_block_till_done()
    (info,) = assert_ws_success(conn)["imported"]
    entry = hass.config_entries.async_get_entry(info["entry_id"])
    assert entry is not None
    assert entry.data["object"]["installation_date"] is None
    assert entry.data["object"]["warranty_expiry"] == "2030-12-31"
    assert info["warnings"] == ["Boiler: installation date '01.10.2026' is not a date — dropped"]
    store = entry.runtime_data.store
    (task_id,) = entry.data["tasks"]
    assert store.get_last_performed(task_id) == "2026-10-01"


# ─── C-1: a corrected completion keeps the occurrence it covered ────────────


def _completed(day: str) -> dict[str, Any]:
    return {"type": "completed", "timestamp": f"{day}T10:00:00+00:00"}


def test_c1_correcting_the_latest_completion_keeps_the_planned_grid(hass: HomeAssistant) -> None:
    """A monthly task planned on the 1st, completed late on the 5th (it
    covered the 1 October occurrence). Correcting the completion to the 4th
    dropped ``last_planned_due``, and the task fell due on the 4th of every
    month from then on."""
    from custom_components.maintenance_supporter.storage import MaintenanceStore, reanchor_from_history

    store = MaintenanceStore(hass, "c1")
    store.update_task_state("t", last_performed="2026-10-05", last_planned_due="2026-10-01", planned_day=1, due_override="2026-11-10")
    before = [_completed("2026-09-01"), _completed("2026-10-05")]
    assert reanchor_from_history(store, "t", before, [before[0], _completed("2026-10-04")]) == "2026-10-04"
    state = store.get_task_state("t")
    assert (state["last_planned_due"], state["planned_day"]) == ("2026-10-01", 1)
    assert "due_override" not in state, "a postpone goes with any re-dated anchor (test_anchor_modifiers)"

    # Another entry becomes the latest, or the latest is deleted: a new cycle.
    store.update_task_state("t", last_performed="2026-10-05")
    later = [_completed("2026-10-07"), _completed("2026-10-05")]
    assert reanchor_from_history(store, "t", before, later) == "2026-10-07"
    assert "last_planned_due" not in store.get_task_state("t")
    store.update_task_state("t", last_performed="2026-10-05", last_planned_due="2026-10-01")
    assert reanchor_from_history(store, "t", before, [before[0]]) == "2026-09-01"
    assert "last_planned_due" not in store.get_task_state("t")


# ─── T-4: an AND/OR trigger inside the post-completion cooldown ─────────────


def _compound_task(**extra: Any) -> dict[str, Any]:
    from custom_components.maintenance_supporter.const import ScheduleType

    from .conftest import build_task_data

    return build_task_data(
        task_id="task_1",
        name="Filter",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "compound",
            "compound_logic": "OR",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.a", "entity_ids": ["sensor.a", "sensor.b"], "entity_logic": "all", "trigger_above": 30}
            ],
            **extra,
        },
    )


async def _compound_entry(hass: HomeAssistant, **extra: Any) -> Any:
    from .conftest import make_global_entry, make_object_entry, setup_integration

    hass.states.async_set("sensor.a", "40")
    hass.states.async_set("sensor.b", "40")
    obj = make_object_entry(hass, tasks={"task_1": _compound_task(**extra)}, name="Pool", uid="t4")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    coordinator = obj.runtime_data.coordinator
    assert coordinator.data["tasks"]["task_1"]["_trigger_active"] is True
    return coordinator


async def _readings(hass: HomeAssistant, a: str, b: str) -> None:
    hass.states.async_set("sensor.a", a)
    hass.states.async_set("sensor.b", b)
    await hass.async_block_till_done()


async def test_t4_a_held_back_activation_comes_back_after_the_cooldown(hass: HomeAssistant) -> None:
    """Completed while both sensors still read high: inside the cooldown the
    activation is not applied (the user completed before fixing it). The
    sensor triggers re-latch after it through the fallback; the compound had
    none, and the task read OK while its conditions held, until a reload."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    from custom_components.maintenance_supporter.const import TRIGGER_COMPLETION_COOLDOWN_SECONDS

    coordinator = await _compound_entry(hass)
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await _readings(hass, "41", "41")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"]["_trigger_active"] is False, "held back inside the cooldown"

    coordinator._recently_completed["task_1"] -= TRIGGER_COMPLETION_COOLDOWN_SECONDS + 5
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=TRIGGER_COMPLETION_COOLDOWN_SECONDS + 5))
    await hass.async_block_till_done()
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"]["_trigger_active"] is True


async def test_t4_clear_and_back_within_the_cooldown_is_a_new_problem(hass: HomeAssistant) -> None:
    """The compound never recorded "seen clear since the completion": a
    problem back within ten minutes was taken for the old one. And its end
    auto-completed a task the held-back activation never latched."""
    coordinator = await _compound_entry(hass, auto_complete_on_recovery=True)
    await coordinator.complete_maintenance("task_1")
    await hass.async_block_till_done()
    await _readings(hass, "41", "41")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"]["_trigger_active"] is False
    with patch.object(coordinator, "async_auto_complete_on_recovery", AsyncMock()) as auto:
        await _readings(hass, "41", "10")
        auto.assert_not_awaited()
    await _readings(hass, "41", "45")
    await coordinator.async_refresh_now()
    assert coordinator.data["tasks"]["task_1"]["_trigger_active"] is True, "a new edge, applied at once"


# ─── T-5: an entity rename reaches an object that is not loaded ─────────────


async def test_t5_a_rename_rewrites_the_store_of_a_disabled_object(hass: HomeAssistant) -> None:
    """The rename listener read the Store through the loaded entry only. A
    disabled object (or one in setup retry, or mid-reload) kept its counter
    baseline under the old id: the counter started over after the rename."""
    from homeassistant.config_entries import ConfigEntryDisabler
    from homeassistant.helpers import entity_registry as er

    from custom_components.maintenance_supporter.storage import MaintenanceStore

    from .conftest import build_object_data, build_object_entry_data, make_global_entry, setup_integration

    obj = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title="Pump", unique_id="ms_t5_pump",
        data=build_object_entry_data(object_data=build_object_data(name="Pump")), source="user",
        disabled_by=ConfigEntryDisabler.USER,
    )
    obj.add_to_hass(hass)
    store = MaintenanceStore(hass, obj.entry_id)
    store.update_task_state("t1", trigger_runtime={"sensor.pump_hours": {"trigger_baseline_value": 1200}})
    await store.async_save()
    await setup_integration(hass, make_global_entry(hass))

    reg = er.async_get(hass)
    entity = reg.async_get_or_create("sensor", "test", "pump", suggested_object_id="pump_hours")
    reg.async_update_entity(entity.entity_id, new_entity_id="sensor.pump_runtime")
    await hass.async_block_till_done()

    fresh = MaintenanceStore(hass, obj.entry_id)
    await fresh.async_load()
    assert fresh.get_task_state("t1")["trigger_runtime"] == {"sensor.pump_runtime": {"trigger_baseline_value": 1200}}


# ─── S-5 / S-6: the battery fleet task and the parts money ──────────────────


async def test_s5_a_fleet_completion_records_no_parts_it_does_not_take(hass: HomeAssistant) -> None:
    """The fleet consumes per device, never its task's own links. A link
    added by hand was still recorded on every fleet completion: shown as
    used, valued in the budget, and put back on the shelf by a history
    delete although it never left it."""
    from custom_components.maintenance_supporter.const import BATTERY_FLEET_OBJECT_FLAG, BATTERY_FLEET_TASK_FLAG

    from .conftest import build_object_data, build_object_entry_data, build_task_data, make_global_entry, setup_integration

    task = build_task_data(task_id="fleet_task", name="Replace low batteries", interval_days=None)
    task[BATTERY_FLEET_TASK_FLAG] = True
    task["consumes_parts"] = [{"part_id": "batt_aa", "quantity": 2}]
    obj_data = build_object_data(name="Battery Fleet")
    obj_data[BATTERY_FLEET_OBJECT_FLAG] = True
    data = build_object_entry_data(object_data=obj_data, tasks={"fleet_task": task})
    data["parts"] = {"batt_aa": {"id": "batt_aa", "name": "AA battery", "unit": "pcs", "unit_price": 0.5}}
    fleet = MockConfigEntry(version=1, minor_version=4, domain=DOMAIN, title="Battery Fleet", data=data, source="user", unique_id="ms_s5_fleet")
    fleet.add_to_hass(hass)
    await setup_integration(hass, make_global_entry(hass), fleet)
    store = fleet.runtime_data.store
    store.set_part_stock("batt_aa", 10)

    await fleet.runtime_data.coordinator.complete_maintenance("fleet_task")
    await hass.async_block_till_done()
    last = store.get_history("fleet_task")[-1]
    assert last["type"] == "completed" and "used_parts" not in last and "parts_cost" not in last
    assert store.get_part_stock("batt_aa") == 10


def test_s6_battery_purchases_count_when_bought_in_use_mode() -> None:
    """Under "count when used" a purchase is stock, valued at its use. The
    fleet's swaps write no completion that could value them, so batteries
    cost nothing anywhere."""
    from types import SimpleNamespace

    from custom_components.maintenance_supporter.const import BATTERY_FLEET_OBJECT_FLAG
    from custom_components.maintenance_supporter.helpers import parts_cost

    def booked(fleet: bool) -> float:
        entry = SimpleNamespace(data={"object": {BATTERY_FLEET_OBJECT_FLAG: True} if fleet else {}})
        record: dict[str, Any] = {"type": "completed", "cost": 12.0}
        with patch.object(parts_cost, "parts_cost_mode", return_value="use"):
            parts_cost.annotate_completion(MagicMock(), entry, {"part_ref": {"part_id": "batt_aa"}}, record)
        return parts_cost.entry_spend(record)

    assert booked(fleet=True) == 12.0
    assert booked(fleet=False) == 0.0, "any other purchase is stock, spent when used"


# ─── S-7: the history follows a shared pool to its new home ─────────────────


async def test_s7_a_replaced_owners_borrowers_book_back_onto_the_successor(hass: HomeAssistant) -> None:
    """Replacing a pool's owner relinked the borrowers' task links, not their
    history: deleting a completion put its parts back on the archived
    predecessor's hidden copy, and the successor's shelf stayed short."""
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_delete_history_entry

    from .conftest import assert_ws_success
    from .test_audit_2026_09_27_t4_interfaces import _add_object, _live, _setup, _ws

    owner = await _setup(hass, name="Pool", uid="pool", parts={"p1": {"id": "p1", "name": "Chlorine tabs"}})
    _live(hass, owner.entry_id).runtime_data.store.set_part_stock("p1", 4)
    spa = await _add_object(hass, name="Spa", uid="spa", task_id="b1", consumes_parts=[{"part_id": "p1", "quantity": 1, "entry_id": owner.entry_id}])
    await _live(hass, spa.entry_id).runtime_data.coordinator.complete_maintenance("b1")
    await hass.async_block_till_done()
    succ_id = assert_ws_success(await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": owner.entry_id}))["entry_id"]
    (new_pid,) = _live(hass, succ_id).data["parts"]
    assert _live(hass, succ_id).runtime_data.store.get_part_stock(new_pid) == 3

    done = _live(hass, spa.entry_id).runtime_data.store.get_history("b1")[-1]
    assert [(u["part_id"], u["entry_id"]) for u in done["used_parts"]] == [(new_pid, succ_id)]
    msg = {"type": f"{DOMAIN}/task/history/delete", "entry_id": spa.entry_id, "task_id": "b1", "timestamp": done["timestamp"]}
    assert_ws_success(await _ws(hass, ws_delete_history_entry, msg))
    assert _live(hass, succ_id).runtime_data.store.get_part_stock(new_pid) == 4


def test_s7_relink_history_moves_only_the_pools_links(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.shared_parts import relink_history
    from custom_components.maintenance_supporter.storage import MaintenanceStore

    store = MaintenanceStore(hass, "heir")
    used = [
        {"part_id": "p1", "quantity": 1, "entry_id": "owner"},
        {"part_id": "p2", "quantity": 1, "entry_id": "owner"},
        {"part_id": "p1", "quantity": 1, "entry_id": "elsewhere"},
        {"part_id": "own", "quantity": 1},
    ]
    store.set_history("t", [{"type": "completed", "timestamp": "2026-10-01T10:00:00+00:00", "used_parts": used}])
    assert relink_history(store, "owner", "", {"p1": "p1_moved"})
    assert store.get_history("t")[0]["used_parts"] == [
        {"part_id": "p1_moved", "quantity": 1},
        used[1],
        used[2],
        used[3],
    ]
    assert not relink_history(store, "owner", "", {"p1": "p1_moved"}), "nothing left to move"


async def test_s7_the_heir_of_a_deleted_owner_books_back_onto_its_own_shelf(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.objects import ws_delete_object
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_delete_history_entry

    from .conftest import assert_ws_success
    from .test_audit_2026_09_27_t4_interfaces import _add_object, _live, _setup, _ws

    owner = await _setup(hass, name="Pool", uid="pool", parts={"p1": {"id": "p1", "name": "Chlorine tabs"}})
    _live(hass, owner.entry_id).runtime_data.store.set_part_stock("p1", 5)
    spa = await _add_object(hass, name="Spa", uid="spa", task_id="b1", consumes_parts=[{"part_id": "p1", "quantity": 1, "entry_id": owner.entry_id}])
    await _live(hass, spa.entry_id).runtime_data.coordinator.complete_maintenance("b1")
    await hass.async_block_till_done()
    assert_ws_success(await _ws(hass, ws_delete_object, {"type": f"{DOMAIN}/object/delete", "entry_id": owner.entry_id}))
    heir = _live(hass, spa.entry_id)
    assert heir.runtime_data.store.get_part_stock("p1") == 4
    done = heir.runtime_data.store.get_history("b1")[-1]
    assert done["used_parts"][0]["part_id"] == "p1" and "entry_id" not in done["used_parts"][0]
    msg = {"type": f"{DOMAIN}/task/history/delete", "entry_id": spa.entry_id, "task_id": "b1", "timestamp": done["timestamp"]}
    assert_ws_success(await _ws(hass, ws_delete_history_entry, msg))
    assert _live(hass, spa.entry_id).runtime_data.store.get_part_stock("p1") == 5
