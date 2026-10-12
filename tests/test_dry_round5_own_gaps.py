"""DRY audit round 5 (2026-10-12): the gaps v2.102.0 left next to its own changes.

Each feature of that release had a twin path that kept the old rule:

* #207 app links: the document import (Replace object, JSON import, the
  documents ZIP) still took web links only, so an ``obsidian://`` link was
  dropped on the way.
* #208 reusable parts: a 9V cell's part was keyed without its size (the type
  folding reads "9V" as a voltage), so "9V NiMH" shared a part with a lock's
  built-in "NiMH" pack; the part form and undo booked the stock and the
  waiting pile in two steps.
* D#110 shared tasks: a bundle went to the household service only (none set:
  nobody heard of the tasks), the notification-button dismiss read the
  assignees after the rotation had moved on, and ``task/assign_user`` skipped
  the rotation rule.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_capture_events, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    EVENT_PART_RESTOCKED,
    EVENT_PART_STOCK_LOW,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
)
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import (
    canonical_part_id,
    find_fleet_entry,
    migrate_fleet_part_ids,
    reconcile_fleet_parts_at_start,
)
from custom_components.maintenance_supporter.helpers.battery_lifetime import canonical_type, fleet_part_type
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.helpers.entry_tasks import write_task
from custom_components.maintenance_supporter.helpers.parts import normalize_part
from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock
from custom_components.maintenance_supporter.websocket.battery_fleet import (
    ws_battery_fleet_mark_replaced,
    ws_battery_fleet_setup,
)
from custom_components.maintenance_supporter.websocket.parts import ws_update_part
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task, ws_undo_completion
from custom_components.maintenance_supporter.websocket.users import ws_assign_user

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    assert_ws_success,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _overdue_task(task_id: str, name: str, **over: Any) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(task_id=task_id, name=name, last_performed=last, interval_days=30)
    task.update(over)
    return task


# ─── #207: an app link survives the document import ─────────────────────────


async def test_an_app_link_document_survives_a_reimport(hass: HomeAssistant) -> None:
    """The import (Replace object, JSON import, the documents ZIP) takes the
    links documents/add_link takes, and still refuses the dangerous ones."""
    store = DocumentStore(hass)
    await store.async_load()
    created = await store.async_import_documents(
        "obj1",
        [
            {"kind": "weblink", "url": "obsidian://open?vault=Home&file=Boiler", "title": "Boiler notes"},
            {"kind": "weblink", "url": "onenote:https://example.com/page", "title": "OneNote page"},
            {"kind": "weblink", "url": "https://example.com/manual", "title": "Manual"},
            {"kind": "weblink", "url": "javascript:alert(1)", "title": "Script"},
            {"kind": "weblink", "url": "file:///etc/passwd", "title": "Local file"},
        ],
    )
    assert created == 3
    assert sorted(d["url"] for d in store.documents.values()) == [
        "https://example.com/manual",
        "obsidian://open?vault=Home&file=Boiler",
        "onenote:https://example.com/page",
    ]


# ─── #208: a 9V cell's part keeps its size ──────────────────────────────────


@pytest.mark.parametrize(
    ("label", "key"),
    [
        ("9V NiMH", "9V NIMH"),
        ("NiMH 9V", "9V NIMH"),
        ("9V Li-ion", "9V LI-ION"),
        ("AAA NiMH", "AAA NIMH"),
        ("AA Eneloop", "AA ENELOOP"),
        ("18650", "18650"),
        # v2.102.0's keys of the other sizes do not move.
        ("AA-NiMH", canonical_type("AA-NiMH")),
        # A pack charged in place has no part to draw from.
        ("NiMH", None),
        ("Rechargeable", None),
        ("Li-ion", None),
        # Cells anyone buys keep the canonical type.
        ("9V", "9V"),
        ("LR6", "AA"),
        ("CR2032", "CR2032"),
    ],
)
def test_a_cells_part_keeps_its_size(label: str, key: str | None) -> None:
    assert fleet_part_type(label) == key


def test_the_id_migration_does_not_fold_a_9v_cell_back() -> None:
    assert canonical_part_id("batt_9v nimh") is None
    assert canonical_part_id("batt_aaa nimh") is None
    assert canonical_part_id("batt_nimh") is None, "a pack's key is not re-keyed"
    assert canonical_part_id("batt_lr6") == "batt_aa"
    assert canonical_part_id("batt_aa nimh 1.2v") == "batt_aa nimh"


def _battery(hass: HomeAssistant, name: str, btype: str, qty: int) -> None:
    hass.states.async_set(
        f"sensor.{name}_battery_plus", "8",
        {"device_class": "battery", "battery_type": btype, "battery_quantity": qty, "battery_low": True, "device_name": name},
    )
    hass.states.async_set(f"button.{name}_battery_replaced", "unknown")


async def _fleet(hass: HomeAssistant, global_entry: MockConfigEntry) -> MockConfigEntry:
    await setup_integration(hass, global_entry)
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = find_fleet_entry(hass)
    assert fleet is not None
    return fleet


async def _mark_replaced(hass: HomeAssistant, entity_id: str) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_mark_replaced, hass, conn, {"id": 2, "type": "x", "entity_ids": [entity_id]})
    return conn.send_result.call_args[0][1]


async def test_a_built_in_pack_takes_nothing_from_the_9v_cells(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    _battery(hass, "smoke", "9V NiMH", 1)
    _battery(hass, "lock", "NiMH", 1)
    fleet = await _fleet(hass, global_entry)
    assert "batt_9v nimh" in fleet.data["parts"] and "batt_nimh" not in fleet.data["parts"]
    store = fleet.runtime_data.store
    await async_change_part_stock(hass, fleet, "batt_9v nimh", absolute=2)
    async_mock_service(hass, "button", "press")

    assert (await _mark_replaced(hass, "sensor.lock_battery_plus"))["consumed"] == {}
    assert (store.get_part_stock("batt_9v nimh"), store.get_part_restoring("batt_9v nimh")) == (2, 0)
    assert (await _mark_replaced(hass, "sensor.smoke_battery_plus"))["consumed"] == {"batt_9v nimh": 1}
    assert (store.get_part_stock("batt_9v nimh"), store.get_part_restoring("batt_9v nimh")) == (1, 1)


def _put_part(hass: HomeAssistant, fleet: MockConfigEntry, part: dict[str, Any]) -> None:
    parts = dict(fleet.data["parts"])
    parts[part["id"]] = normalize_part(part)
    hass.config_entries.async_update_entry(fleet, data={**fleet.data, "parts": parts})


async def test_a_9v_part_v2_102_keyed_wrong_is_pruned_while_untouched(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    _battery(hass, "smoke", "9V NiMH", 1)
    fleet = await _fleet(hass, global_entry)
    # What v2.102.0 minted for "9V NiMH" — and one someone has counted since.
    _put_part(hass, fleet, {"id": "batt_nimh", "name": "NIMH battery", "unit": "pcs", "auto_buy_task": False, "reuse": "charge"})
    _put_part(hass, fleet, {"id": "batt_li-ion", "name": "LI-ION battery", "unit": "pcs", "auto_buy_task": False, "reuse": "charge"})
    store = fleet.runtime_data.store
    store.set_part_stock("batt_li-ion", 3)

    result = await reconcile_fleet_parts_at_start(hass, fleet, "en")
    parts = fleet.data["parts"]
    assert result["pruned"] is True
    assert "batt_nimh" not in parts
    assert "batt_li-ion" in parts and store.get_part_stock("batt_li-ion") == 3, "counted: the user's, it stays"
    assert "batt_9v nimh" in parts


async def test_folding_an_alias_part_keeps_its_waiting_cells(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    _battery(hass, "remote", "AA NiMH", 2)
    fleet = await _fleet(hass, global_entry)
    _put_part(hass, fleet, {"id": "batt_aa nimh 1.2v", "name": "AA NIMH 1.2V battery", "unit": "pcs", "auto_buy_task": False, "reuse": "charge"})
    store = fleet.runtime_data.store
    store.set_part_stock("batt_aa nimh 1.2v", 1)
    store.set_part_restoring("batt_aa nimh 1.2v", 2)
    store.set_part_stock("batt_aa nimh", 2)
    store.set_part_restoring("batt_aa nimh", 1)

    assert await migrate_fleet_part_ids(hass, fleet) == {"batt_aa nimh 1.2v": "batt_aa nimh"}
    assert (store.get_part_stock("batt_aa nimh"), store.get_part_restoring("batt_aa nimh")) == (3, 3)


# ─── #208: the stock and the waiting pile are booked together ───────────────

CELLS = "p_cells"


def _reusable_object(threshold: float) -> MockConfigEntry:
    last = (dt_util.now() - timedelta(days=40)).date().isoformat()
    task = build_task_data(last_performed=last, name="Swap remote batteries")
    task["consumes_parts"] = [{"part_id": CELLS, "quantity": 2}]
    data = build_object_entry_data(object_data=build_object_data(name="TV remote"), tasks={TASK_ID_1: task})
    data["parts"] = {
        CELLS: {"id": CELLS, "name": "AAA Eneloop", "unit": "pcs", "auto_buy_task": False, "reuse": "charge", "reorder_threshold": threshold}
    }
    return MockConfigEntry(version=1, minor_version=4, domain=DOMAIN, title="TV remote", data=data, source="user", unique_id="ms_round5_reuse")


async def test_a_first_count_keeps_the_waiting_ones(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """An uncounted reusable part (the fleet starts its cells so) edited to
    4 charged + 2 waiting: the pile used to be written before the stock that
    holds it, and was lost."""
    obj = _reusable_object(threshold=5)
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    low = async_capture_events(hass, EVENT_PART_STOCK_LOW)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_part, hass, conn,
        {"id": 1, "type": "x", "entry_id": obj.entry_id, "part_id": CELLS, "name": "AAA Eneloop", "stock": 4, "restoring": 2},
    )
    assert_ws_success(conn)
    await hass.async_block_till_done()
    store = obj.runtime_data.store
    assert (store.get_part_stock(CELLS), store.get_part_restoring(CELLS)) == (4, 2)
    assert low == [], "6 owned, above the threshold of 5"


async def test_undo_books_the_stock_and_the_pile_at_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Owned stays 4 through a use and its undo; restoring the stock first
    (6 owned) and the pile after (4 again) fired restocked + low."""
    obj = _reusable_object(threshold=5)
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    store = obj.runtime_data.store
    store.set_part_stock(CELLS, 4)
    await store.async_save()

    conn = make_ws_connection()
    await call_ws_handler(ws_complete_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert assert_ws_success(conn)["undo"] is True
    await hass.async_block_till_done()
    low = async_capture_events(hass, EVENT_PART_STOCK_LOW)
    restocked = async_capture_events(hass, EVENT_PART_RESTOCKED)

    conn = make_ws_connection()
    await call_ws_handler(ws_undo_completion, hass, conn, {"id": 2, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    assert (store.get_part_stock(CELLS), store.get_part_restoring(CELLS)) == (4, 0)
    assert (low, restocked) == ([], [])


# ─── D#110: shared tasks ────────────────────────────────────────────────────


async def test_without_a_household_service_a_bundle_goes_out_task_by_task(hass: HomeAssistant) -> None:
    """Bundling sends one message for the object to the household service.
    With none set (every reminder goes to the people's own phones) nobody
    got it: the tasks now go out one by one, each to whom it is meant for."""
    g = make_global_entry(
        hass, notifications_enabled=True, notify_service="",
        extra_data={CONF_NOTIFICATION_BUNDLING_ENABLED: True, CONF_NOTIFICATION_BUNDLE_THRESHOLD: 2, CONF_QUIET_HOURS_ENABLED: False},
    )
    entry = make_object_entry(
        hass,
        tasks={TASK_ID_1: _overdue_task(TASK_ID_1, "Clean gutters"), TASK_ID_2: _overdue_task(TASK_ID_2, "Sweep chimney")},
        uid="round5_bundle",
    )
    await setup_integration(hass, g, entry)
    coord = entry.runtime_data.coordinator
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]

    async def _wave() -> tuple[AsyncMock, AsyncMock]:
        with (
            patch.object(nm, "async_send_bundled", new_callable=AsyncMock) as bundled,
            patch.object(nm, "async_task_status_changed", new_callable=AsyncMock) as per_task,
        ):
            coord._previous_statuses = {}
            await coord._async_notify_status_changes(coord.data[CONF_TASKS])
        return bundled, per_task

    bundled, per_task = await _wave()
    assert bundled.call_count == 0 and per_task.call_count == 2

    # With a household service the same two go out as one bundle.
    hass.config_entries.async_update_entry(g, options={**g.data, CONF_NOTIFY_SERVICE: "notify.household"})
    bundled, per_task = await _wave()
    assert bundled.call_count == 1 and per_task.call_count == 0


async def test_completing_from_a_phone_clears_the_phones_it_reminded_not_the_next_ones(hass: HomeAssistant) -> None:
    """A rotation hands the task on as it is completed; the reminder to
    clear is the one on the phones of whose turn it WAS."""
    ann = await hass.auth.async_create_user("Ann")
    ben = await hass.auth.async_create_user("Ben")
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_QUIET_HOURS_ENABLED: False})
    task = _overdue_task("t", "Take out the bins", assignee_pool=[ann.id, ben.id], rotation_strategy="round_robin", responsible_user_id=ann.id)
    entry = make_object_entry(hass, tasks={"t": task}, uid="round5_rota")
    await setup_integration(hass, g, entry)

    async def _complete(**_kw: Any) -> None:
        write_task(hass, entry, "t", {**entry.data[CONF_TASKS]["t"], "responsible_user_id": ben.id})

    entry.runtime_data.coordinator.complete_maintenance = AsyncMock(side_effect=_complete)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    with patch.object(nm, "async_dismiss_task_notification", new_callable=AsyncMock) as dismiss:
        hass.bus.async_fire("mobile_app_notification_action", {"action": f"MS_COMPLETE_{entry.entry_id}_t"})
        await hass.async_block_till_done()
    assert entry.data[CONF_TASKS]["t"]["responsible_user_id"] == ben.id
    dismiss.assert_called_once_with("t", user_ids=[ann.id])


async def test_assigning_on_a_rotation_keeps_someone_of_its_pool_on_duty(hass: HomeAssistant) -> None:
    """task/assign_user follows task/update's rotation rule: with nobody on
    duty a rotation would now remind its whole pool (D#110)."""
    ann = await hass.auth.async_create_user("Ann")
    ben = await hass.auth.async_create_user("Ben")
    carl = await hass.auth.async_create_user("Carl")
    g = make_global_entry(hass)
    task = _overdue_task("t", "Take out the bins", assignee_pool=[ann.id, ben.id], rotation_strategy="round_robin", responsible_user_id=ben.id)
    entry = make_object_entry(hass, tasks={"t": task}, uid="round5_assign")
    await setup_integration(hass, g, entry)

    async def _assign(user_id: str | None) -> str | None:
        conn = make_ws_connection()
        await call_ws_handler(ws_assign_user, hass, conn, {"id": 1, "type": "x", "entry_id": entry.entry_id, "task_id": "t", "user_id": user_id})
        answer = assert_ws_success(conn)["user_id"]
        assert entry.data[CONF_TASKS]["t"].get("responsible_user_id") == answer
        return answer

    assert await _assign(None) == ann.id
    assert await _assign(carl.id) == ann.id, "outside the pool"
    assert await _assign(ben.id) == ben.id

    # Without a rotation, unassigning still unassigns.
    write_task(hass, entry, "t", {k: v for k, v in entry.data[CONF_TASKS]["t"].items() if k != "rotation_strategy"})
    assert await _assign(None) is None
