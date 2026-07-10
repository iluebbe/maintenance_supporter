"""Spare parts & consumables — pure rules + the consume→buy→restock loop."""

from __future__ import annotations

from datetime import date

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_PARTS, CONF_TASKS, DOMAIN
from custom_components.maintenance_supporter.helpers import parts as parts_mod
from custom_components.maintenance_supporter.helpers.parts import (
    PART_REF_FIELD,
    PartValidationError,
    normalize_part,
    part_is_low,
    reconcile_buy_tasks,
    resolve_shopping_url,
    sanitize_consumes_parts,
    stock_transition,
    validate_gtin,
)
from tests.conftest import (
    GLOBAL_UNIQUE_ID,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

# ─── Pure rules ──────────────────────────────────────────────────────────────


def test_gtin_family_validates_worldwide_formats() -> None:
    assert validate_gtin("4006381333931") == "4006381333931"  # EAN-13
    assert validate_gtin("036000291452") == "036000291452"  # UPC-A (GTIN-12)
    assert validate_gtin("96385074") == "96385074"  # EAN-8
    assert validate_gtin(" 4006381-333931 ") == "4006381333931"  # tolerated separators
    assert validate_gtin("") is None
    assert validate_gtin(None) is None
    with pytest.raises(PartValidationError):
        validate_gtin("4006381333932")  # bad check digit
    with pytest.raises(PartValidationError):
        validate_gtin("12345")  # bad length


def test_normalize_part_defaults_and_caps() -> None:
    part = normalize_part({"name": "  Filter  ", "cost": "24.9", "reorder_threshold": 1})
    assert part["name"] == "Filter"
    assert part["cost"] == 24.9
    assert part["restock_quantity"] is None
    assert part["auto_buy_task"] is False
    with pytest.raises(PartValidationError):
        normalize_part({"name": ""})
    with pytest.raises(PartValidationError):
        normalize_part({"name": "x", "product_url": "ftp://nope"})
    with pytest.raises(PartValidationError):
        normalize_part({"name": "x", "reorder_threshold": -1})


def test_sanitize_consumes_parts_clamps_and_drops_unknown() -> None:
    links = sanitize_consumes_parts(
        [
            {"part_id": "a", "quantity": 5000},  # clamped
            {"part_id": "b", "quantity": 0},  # floored to 1
            {"part_id": "ghost"},  # unknown → dropped
            "junk",
            {"part_id": "a", "quantity": 2},  # duplicate → last wins
        ],
        valid_part_ids={"a", "b"},
    )
    assert {(x["part_id"], x["quantity"]) for x in links} == {("a", 2), ("b", 1)}


def test_stock_transitions_are_edge_triggered() -> None:
    part = {"reorder_threshold": 2}
    assert stock_transition(part, 3, 2) == "low"
    assert stock_transition(part, 2, 1) is None  # already low — no re-nag
    assert stock_transition(part, 1, 0) == "out"
    assert stock_transition(part, 0, 5) == "restocked"
    assert stock_transition(part, None, 5) is None  # start of tracking, not a crossing
    assert part_is_low({"reorder_threshold": 1}, None) is False  # untracked never low


def test_shopping_url_precedence_gtin_then_mpn_then_name() -> None:
    base = {"name": "Filter Ä", "vendor": "Bosch", "mpn": "00754869", "gtin": "4006381333931"}
    assert resolve_shopping_url(base, None, "de") == "https://www.amazon.de/s?k=4006381333931"
    no_gtin = {**base, "gtin": None}
    assert "Bosch+00754869" in resolve_shopping_url(no_gtin, None, "en")
    name_only = {"name": "Filter Ä"}
    assert "Filter" in resolve_shopping_url(name_only, "https://shop.example/find?q={q}", "de")
    direct = {**base, "product_url": "https://example.com/x"}
    assert resolve_shopping_url(direct, None, "de") == "https://example.com/x"


def _buy_part(**over: object) -> dict:
    return normalize_part({"name": "Seal", "reorder_threshold": 1, "auto_buy_task": True, **over})


def test_reconcile_low_episode_semantics() -> None:
    part = _buy_part()
    kw = {"object_id": "o", "lang": "en", "search_template": None, "today": date(2026, 7, 10)}

    # low → one buy task; idempotent on re-run
    t1, created, _, _ = reconcile_buy_tasks({part["id"]: part}, {part["id"]: 1}, {}, is_task_done=lambda t: False, **kw)
    assert len(created) == 1
    _, c2, r2, ch2 = reconcile_buy_tasks({part["id"]: part}, {part["id"]: 1}, t1, is_task_done=lambda t: False, **kw)
    assert not ch2 and not c2 and not r2

    # completed but still low → occupies the episode (no respawn)
    _, c3, r3, _ = reconcile_buy_tasks({part["id"]: part}, {part["id"]: 0}, t1, is_task_done=lambda t: True, **kw)
    assert not c3 and not r3

    # restocked with an OPEN reminder → orphan-removed
    _, _, r4, _ = reconcile_buy_tasks({part["id"]: part}, {part["id"]: 5}, t1, is_task_done=lambda t: False, **kw)
    assert len(r4) == 1

    # restocked with a COMPLETED reminder → kept (cost history!), marker detached,
    # and the NEXT low episode creates a fresh reminder.
    t5, c5, r5, ch5 = reconcile_buy_tasks({part["id"]: part}, {part["id"]: 5}, t1, is_task_done=lambda t: True, **kw)
    tid = created[0]
    assert not r5 and not c5 and ch5 and PART_REF_FIELD not in t5[tid]
    _, c6, _, _ = reconcile_buy_tasks({part["id"]: part}, {part["id"]: 1}, t5, is_task_done=lambda t: True, **kw)
    assert len(c6) == 1, "detached marker must re-arm the next episode"


def test_buy_task_is_self_contained() -> None:
    part = _buy_part(
        mpn="00754869",
        vendor="Bosch",
        gtin="4006381333931",
        storage_location="Keller Regal B",
        cost=12.5,
        restock_quantity=2,
        unit="pcs",
    )
    task = parts_mod.build_buy_task(
        part, 0, object_id="o", lang="de", search_template=None, today=date(2026, 7, 10)
    )
    assert task["name"] == "Seal kaufen"
    assert task["labels"] == ["shopping"]
    assert task["custom_icon"] == "mdi:cart"
    assert task["schedule"] == {"kind": "one_time", "due_date": "2026-07-10"}
    assert task[PART_REF_FIELD] == {"part_id": part["id"]}
    for needle in ("MPN: 00754869", "GTIN: 4006381333931", "Keller Regal B", "Bosch"):
        assert needle in task["notes"], f"buy-task notes missing {needle}"
    assert task["documentation_url"].startswith("https://www.amazon.de/s?k=4006381333931")


# ─── The full loop through the real integration ──────────────────────────────


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


def _object_with_part(hass: HomeAssistant, *, auto_buy: bool = True) -> MockConfigEntry:
    part = normalize_part(
        {
            "id": "p1",
            "name": "HEPA-Filter",
            "reorder_threshold": 1,
            "restock_quantity": 2,
            "auto_buy_task": auto_buy,
            "storage_location": "Shelf B",
            "cost": 10.0,
        }
    )
    task = build_task_data(name="Filter wechseln", last_performed="2026-01-01")
    task["consumes_parts"] = [{"part_id": "p1", "quantity": 1}]
    data = build_object_entry_data(object_data=build_object_data(name="Vacuum"), tasks={TASK_ID_1: task})
    data[CONF_PARTS] = {"p1": part}
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Vacuum",
        data=data,
        source="user",
        unique_id="maintenance_supporter_vacuum_loop",
    )
    entry.add_to_hass(hass)
    return entry


async def test_consume_low_buy_restock_loop(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The whole story: complete consumes → low → auto buy task → completing it
    restocks (dialog qty override) → the reminder detaches and the stock
    sensor reflects every step."""
    entry = _object_with_part(hass)
    await setup_integration(hass, global_entry, entry)
    entry.runtime_data.store.set_part_stock("p1", 2)

    # Complete the consuming task → stock 2→1 (== threshold → low episode).
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()  # runs the scheduled reconcile + reload

    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.runtime_data.store.get_part_stock("p1") == 1
    buy_tasks = {
        tid: td for tid, td in entry.data[CONF_TASKS].items() if (td.get(PART_REF_FIELD) or {}).get("part_id") == "p1"
    }
    assert len(buy_tasks) == 1, "auto buy task not created on the low crossing"
    buy_id, buy_td = next(iter(buy_tasks.items()))
    assert "Shelf B" in (buy_td.get("notes") or "")

    # Stock sensor exists and reads the tracked count.
    state = hass.states.get("sensor.vacuum_hepa_filter_stock")
    assert state is not None, [s for s in hass.states.async_entity_ids("sensor") if "vacuum" in s]
    assert state.state == "1"
    assert state.attributes.get("is_low") is True

    # Complete the buy task with a dialog override of 3 → stock 1+3=4.
    await entry.runtime_data.coordinator.complete_maintenance(buy_id, restock_quantity=3)
    await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.runtime_data.store.get_part_stock("p1") == 4
    # Completed reminder survives (cost history) but its marker is detached.
    assert buy_id in entry.data[CONF_TASKS]
    assert PART_REF_FIELD not in entry.data[CONF_TASKS][buy_id]

    # Global reorder counter reads 0 again.
    reorder = hass.states.get("sensor.maintenance_supporter_parts_to_reorder")
    assert reorder is not None and reorder.state == "0"


async def test_ws_part_crud_and_restock(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """part/create → payload exposes every field; part/restock adjusts;
    part/delete prunes links + store state."""
    from custom_components.maintenance_supporter.websocket import _build_object_response
    from custom_components.maintenance_supporter.websocket.parts import (
        ws_create_part,
        ws_delete_part,
        ws_restock_part,
    )

    entry = _object_with_part(hass, auto_buy=False)
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_part,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/part/create",
            "entry_id": entry.entry_id,
            "name": "Brush",
            "gtin": "96385074",
            "stock": 5,
            "reorder_threshold": 2,
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    new_pid = conn.send_result.call_args[0][1]["part_id"]
    # The WS envelope id must never leak into the part id (uuid4 hex).
    assert isinstance(new_pid, str) and len(new_pid) == 32, new_pid
    await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(entry.entry_id)
    payload = _build_object_response(hass, entry, None)
    by_id = {p["id"]: p for p in payload["parts"]}
    assert by_id[new_pid]["stock"] == 5
    assert by_id[new_pid]["is_low"] is False
    assert by_id[new_pid]["shopping_url"].endswith("96385074")

    conn = make_ws_connection()
    await call_ws_handler(
        ws_restock_part,
        hass,
        conn,
        {"id": 2, "type": "maintenance_supporter/part/restock", "entry_id": entry.entry_id, "part_id": new_pid, "delta": -4},
    )
    assert conn.send_result.call_args[0][1]["stock"] == 1

    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_part,
        hass,
        conn,
        {"id": 3, "type": "maintenance_supporter/part/delete", "entry_id": entry.entry_id, "part_id": "p1"},
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert "p1" not in (entry.data.get(CONF_PARTS) or {})
    assert "consumes_parts" not in entry.data[CONF_TASKS][TASK_ID_1], "stale link not pruned"
    assert entry.runtime_data.store.get_part_stock("p1") is None


async def test_setup_migration_does_not_clobber_concurrent_writes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Lost-update regression: async_setup_entry's store migration awaits disk
    I/O; a WS write landing in that window used to be clobbered because the
    already-migrated early-return was identity-compared against the LIVE
    entry.data (replaced by the write) instead of the captured snapshot —
    async_setup_entry then wrote the pre-await snapshot back. Seen live when
    rapid part creates raced a reload. The race is injected deterministically
    by mutating entry.data from inside the store-load await.
    """
    from unittest.mock import patch

    from custom_components.maintenance_supporter.storage import MaintenanceStore

    entry = _object_with_part(hass, auto_buy=False)
    await setup_integration(hass, global_entry, entry)  # store now exists (migrated)

    real_load = MaintenanceStore.async_load

    async def racing_load(self):  # type: ignore[no-untyped-def]
        result = await real_load(self)
        # A concurrent writer lands DURING the migration's await window.
        current = hass.config_entries.async_get_entry(entry.entry_id)
        new_data = dict(current.data)
        parts = dict(new_data.get(CONF_PARTS, {}))
        parts["race"] = normalize_part({"id": "race", "name": "Written mid-await"})
        new_data[CONF_PARTS] = parts
        hass.config_entries.async_update_entry(current, data=new_data)
        return result

    with patch.object(MaintenanceStore, "async_load", racing_load):
        await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()

    current = hass.config_entries.async_get_entry(entry.entry_id)
    assert "race" in (current.data.get(CONF_PARTS) or {}), (
        "concurrent write during the migration await was clobbered by the setup snapshot"
    )


# ─── Coverage: WS error paths + update handler + pure-rule edges ─────────────


async def test_ws_update_part_edits_fields_stock_and_untrack(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.parts import ws_update_part

    entry = _object_with_part(hass, auto_buy=False)
    await setup_integration(hass, global_entry, entry)

    # Edit fields + set stock in the same call.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_part, hass, conn,
        {
            "id": 1, "type": "maintenance_supporter/part/update",
            "entry_id": entry.entry_id, "part_id": "p1",
            "name": "HEPA-Filter H14", "storage_location": "Attic", "stock": 7,
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    part = entry.data[CONF_PARTS]["p1"]
    assert part["name"] == "HEPA-Filter H14"
    assert part["storage_location"] == "Attic"
    assert part["reorder_threshold"] == 1, "unset fields must keep their stored values"
    assert entry.runtime_data.store.get_part_stock("p1") == 7
    await hass.async_block_till_done()

    # stock: None untracks (catalog-only).
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_part, hass, conn,
        {
            "id": 2, "type": "maintenance_supporter/task/update".replace("task", "part"),
            "entry_id": entry.entry_id, "part_id": "p1", "name": "HEPA-Filter H14", "stock": None,
        },
    )
    assert not conn.send_error.called
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.runtime_data.store.get_part_stock("p1") is None
    await hass.async_block_till_done()

    # Validation error + unknown part id.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_part, hass, conn,
        {"id": 3, "type": "maintenance_supporter/part/update", "entry_id": entry.entry_id, "part_id": "p1", "name": "x", "gtin": "123"},
    )
    assert conn.send_error.call_args[0][1] == "invalid_input"
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_part, hass, conn,
        {"id": 4, "type": "maintenance_supporter/part/update", "entry_id": entry.entry_id, "part_id": "ghost", "name": "x"},
    )
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_ws_part_error_paths(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from unittest.mock import patch as mock_patch

    from custom_components.maintenance_supporter.websocket import parts as ws_parts

    entry = _object_with_part(hass, auto_buy=False)
    await setup_integration(hass, global_entry, entry)

    # create: invalid gtin
    conn = make_ws_connection()
    await call_ws_handler(
        ws_parts.ws_create_part, hass, conn,
        {"id": 1, "type": "maintenance_supporter/part/create", "entry_id": entry.entry_id, "name": "X", "gtin": "999"},
    )
    assert conn.send_error.call_args[0][1] == "invalid_input"

    # create: per-object limit
    with mock_patch.object(ws_parts, "MAX_PARTS_PER_OBJECT", 1):
        conn = make_ws_connection()
        await call_ws_handler(
            ws_parts.ws_create_part, hass, conn,
            {"id": 2, "type": "maintenance_supporter/part/create", "entry_id": entry.entry_id, "name": "Over"},
        )
        assert conn.send_error.call_args[0][1] == "limit_reached"

    # delete: unknown part
    conn = make_ws_connection()
    await call_ws_handler(
        ws_parts.ws_delete_part, hass, conn,
        {"id": 3, "type": "maintenance_supporter/part/delete", "entry_id": entry.entry_id, "part_id": "ghost"},
    )
    assert conn.send_error.call_args[0][1] == "not_found"

    # restock: neither/both of delta & absolute, and unknown part
    conn = make_ws_connection()
    await call_ws_handler(
        ws_parts.ws_restock_part, hass, conn,
        {"id": 4, "type": "maintenance_supporter/part/restock", "entry_id": entry.entry_id, "part_id": "p1"},
    )
    assert conn.send_error.call_args[0][1] == "invalid_input"
    conn = make_ws_connection()
    await call_ws_handler(
        ws_parts.ws_restock_part, hass, conn,
        {"id": 5, "type": "maintenance_supporter/part/restock", "entry_id": entry.entry_id, "part_id": "p1", "delta": 1, "absolute": 2},
    )
    assert conn.send_error.call_args[0][1] == "invalid_input"
    conn = make_ws_connection()
    await call_ws_handler(
        ws_parts.ws_restock_part, hass, conn,
        {"id": 6, "type": "maintenance_supporter/part/restock", "entry_id": entry.entry_id, "part_id": "ghost", "delta": 1},
    )
    assert conn.send_error.call_args[0][1] == "not_found"


def test_pure_rule_edges_for_coverage() -> None:
    from custom_components.maintenance_supporter.helpers.parts import (
        buy_task_notes,
        default_search_template,
        normalize_part as np,
    )

    # String/URL/cost/stock validation edges.
    with pytest.raises(PartValidationError):
        np({"name": "x" * 101})
    with pytest.raises(PartValidationError):
        np({"name": "x", "cost": "abc"})
    with pytest.raises(PartValidationError):
        np({"name": "x", "cost": -1})
    with pytest.raises(PartValidationError):
        np({"name": "x", "reorder_threshold": "abc"})
    with pytest.raises(PartValidationError):
        np(["not-a-mapping"])  # type: ignore[arg-type]
    with pytest.raises(PartValidationError):
        np({"name": "x", "product_url": "https://" + "y" * 600})

    # consumes sanitization: non-list input.
    assert sanitize_consumes_parts("junk") == []
    assert sanitize_consumes_parts(None) == []

    # transitions: untracked never transitions; equal stock is no crossing.
    part = {"reorder_threshold": 1}
    assert stock_transition(part, 5, None) is None
    assert stock_transition(part, 3, 3) is None

    # search template fallback + template without {q} placeholder.
    assert default_search_template("xx").startswith("https://www.amazon.com")
    assert "q=" in resolve_shopping_url({"name": "a b"}, "https://shop.example/search", "en")

    # buy-task notes: minimal part (no unit/cost/gtin/location) still renders.
    minimal = np({"name": "Plain"})
    notes = buy_task_notes(minimal, None)
    assert "Plain" in notes


async def test_runtime_guards_for_coverage(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """parts_runtime guard branches: unknown part, missing store, skip paths."""
    from custom_components.maintenance_supporter.parts_runtime import (
        async_change_part_stock,
        async_handle_completion_parts,
    )

    entry = _object_with_part(hass, auto_buy=False)
    await setup_integration(hass, global_entry, entry)

    # Unknown part id → None, no crash.
    assert await async_change_part_stock(hass, entry, "ghost", delta=1) is None

    # Completion effects: malformed link entries + link to a catalog-only part
    # (no tracked stock) are skipped silently.
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    entry.runtime_data.store.set_part_stock("p1", None)  # untrack
    await async_handle_completion_parts(
        hass,
        entry,
        {"consumes_parts": ["junk", {"part_id": "ghost"}, {"part_id": "p1", "quantity": 1}]},
    )
    assert entry.runtime_data.store.get_part_stock("p1") is None  # untouched
    await hass.async_block_till_done()
