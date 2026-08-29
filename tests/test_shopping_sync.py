"""Shopping-list sync: buy tasks mirrored into a user-picked todo entity.

The sync owns exactly the rows it created (uid mapping in its own Store):
buy task appears → row added; buy task gone → row removed; row checked →
the buy task completes through the choke point (restocking the part) and
the row is dropped. Foreign rows are never touched.

The buy tasks come from the REAL reconcile (parts_runtime) — a part below
its reorder threshold — not hand-seeded task dicts, so the whole chain
low stock → buy task → list row is what's pinned.
"""

from __future__ import annotations

from homeassistant.components.todo import (
    DOMAIN as TODO_DOMAIN,
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    setup_test_component_platform,
)

from custom_components.maintenance_supporter.const import (
    CONF_PARTS,
    CONF_SHOPPING_LIST_ENTITY,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks
from custom_components.maintenance_supporter.shopping_sync import SHOPPING_SYNC_KEY

from .conftest import (
    build_global_entry_data,
    build_object_entry_data,
    setup_integration,
)

LIST_ENTITY = "todo.shop"


class WritableTodoList(TodoListEntity):
    """A real (test-platform) todo entity the sync's entity services hit."""

    _attr_name = "Shop"
    _attr_unique_id = "shop"
    _attr_supported_features = (
        TodoListEntityFeature.CREATE_TODO_ITEM
        | TodoListEntityFeature.DELETE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
    )

    def __init__(self) -> None:
        self._attr_todo_items: list[TodoItem] = []
        self._n = 0

    def seed(self, summary: str) -> str:
        self._n += 1
        uid = f"uid-{self._n}"
        self._attr_todo_items.append(
            TodoItem(summary=summary, uid=uid, status=TodoItemStatus.NEEDS_ACTION)
        )
        if self.hass is not None:
            self.async_write_ha_state()
        return uid

    def check_off(self, uid: str) -> None:
        for i, item in enumerate(self._attr_todo_items):
            if item.uid == uid:
                self._attr_todo_items[i] = TodoItem(
                    summary=item.summary, uid=uid, status=TodoItemStatus.COMPLETED
                )
        self.async_write_ha_state()

    def drop(self, uid: str) -> None:
        self._attr_todo_items = [i for i in self._attr_todo_items if i.uid != uid]
        self.async_write_ha_state()

    def summaries(self) -> list[str]:
        return [i.summary or "" for i in self._attr_todo_items]

    def uids(self) -> list[str]:
        return [i.uid or "" for i in self._attr_todo_items]

    async def async_create_todo_item(self, item: TodoItem) -> None:
        self._n += 1
        self._attr_todo_items.append(
            TodoItem(summary=item.summary, uid=f"uid-{self._n}", status=TodoItemStatus.NEEDS_ACTION)
        )
        self.async_write_ha_state()

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        self._attr_todo_items = [i for i in self._attr_todo_items if i.uid not in uids]
        self.async_write_ha_state()

    async def async_update_todo_item(self, item: TodoItem) -> None:
        self._attr_todo_items = [item if i.uid == item.uid else i for i in self._attr_todo_items]
        self.async_write_ha_state()


async def _setup(hass: HomeAssistant, *, option: str = LIST_ENTITY, low: bool = True):
    """Todo platform + one object with part p1 (threshold 2, restock 5)."""
    todo = WritableTodoList()
    setup_test_component_platform(hass, TODO_DOMAIN, [todo])
    assert await async_setup_component(hass, TODO_DOMAIN, {TODO_DOMAIN: {"platform": "test"}})
    await hass.async_block_till_done()
    assert hass.states.get(LIST_ENTITY) is not None

    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), options={CONF_SHOPPING_LIST_ENTITY: option},
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    data = build_object_entry_data(tasks={})
    data[CONF_PARTS] = {
        "p1": {"id": "p1", "name": "Filter", "reorder_threshold": 2, "restock_quantity": 5, "auto_buy_task": True},
    }
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Heater",
        data=data, source="user", unique_id="maintenance_supporter_shopping_sync",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    if low:
        entry.runtime_data.store.set_part_stock("p1", 1)  # below threshold 2
        await async_reconcile_buy_tasks(hass, entry)
        await hass.async_block_till_done()
        entry = hass.config_entries.async_get_entry(entry.entry_id)  # reconcile reloaded

    sync = hass.data[DOMAIN][SHOPPING_SYNC_KEY]
    return todo, entry, sync


def _buy_task_id(entry: ConfigEntry) -> str:
    return next(tid for tid, td in entry.data[CONF_TASKS].items() if td.get("part_ref"))


async def test_buy_task_mirrors_into_the_list(hass: HomeAssistant) -> None:
    todo, entry, sync = await _setup(hass)
    assert _buy_task_id(entry)  # the real reconcile minted the reminder
    foreign = todo.seed("Milk")

    await sync.async_resync()

    assert any("Filter" in s for s in todo.summaries())
    mapped = list(sync._data["items"].values())
    assert len(mapped) == 1
    assert mapped[0]["uid"] is not None  # uid claimed via re-list
    assert foreign in todo.uids()  # foreign row untouched

    # Resync converges — no duplicate rows.
    await sync.async_resync()
    assert sum("Filter" in s for s in todo.summaries()) == 1


async def test_checked_row_completes_and_restocks(hass: HomeAssistant) -> None:
    todo, entry, sync = await _setup(hass)
    buy_id = _buy_task_id(entry)
    await sync.async_resync()
    (rec,) = sync._data["items"].values()

    todo.check_off(rec["uid"])
    await sync.async_resync()

    store = entry.runtime_data.store
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[buy_id]
    done = [h for h in merged["history"] if h["type"] == "completed"]
    assert done and "shopping list" in (done[-1].get("notes") or "")
    assert store.get_part_stock("p1") == 6  # 1 + restock_quantity
    assert not any("Filter" in s for s in todo.summaries())  # row dropped
    assert not sync._data["items"]


async def test_restocked_part_drops_the_row(hass: HomeAssistant) -> None:
    todo, entry, sync = await _setup(hass)
    await sync.async_resync()
    assert any("Filter" in s for s in todo.summaries())

    # Restocked through the panel → the reconcile removes the open reminder.
    entry.runtime_data.store.set_part_stock("p1", 10)
    await async_reconcile_buy_tasks(hass, entry)
    await hass.async_block_till_done()
    await sync.async_resync()

    assert not any("Filter" in s for s in todo.summaries())
    assert not sync._data["items"]


async def test_cleared_option_pulls_our_rows_out(hass: HomeAssistant) -> None:
    todo, entry, sync = await _setup(hass)
    foreign = todo.seed("Milk")
    await sync.async_resync()
    assert any("Filter" in s for s in todo.summaries())

    gentry = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id == GLOBAL_UNIQUE_ID)
    hass.config_entries.async_update_entry(gentry, options={CONF_SHOPPING_LIST_ENTITY: ""})
    await hass.async_block_till_done()
    sync = hass.data[DOMAIN][SHOPPING_SYNC_KEY]  # option change reloads the global entry
    await sync.async_resync()

    assert not any("Filter" in s for s in todo.summaries())
    assert foreign in todo.uids()
    assert not sync._data["items"]


async def test_hand_deleted_row_comes_back(hass: HomeAssistant) -> None:
    """Declarative: the task is still open, so the row reappears."""
    todo, entry, sync = await _setup(hass)
    await sync.async_resync()
    (rec,) = sync._data["items"].values()
    todo.drop(rec["uid"])

    await sync.async_resync()
    assert any("Filter" in s for s in todo.summaries())


async def test_unconfigured_sync_is_inert(hass: HomeAssistant) -> None:
    todo, entry, sync = await _setup(hass, option="")
    await sync.async_resync()
    assert todo.summaries() == []
    assert not sync._data["items"]


# ── edge coverage: plumbing, error paths, guards ─────────────────────────


async def test_mapping_survives_a_restart(hass: HomeAssistant) -> None:
    """The uid mapping persists — a fresh instance loads it and converges."""
    from custom_components.maintenance_supporter.shopping_sync import ShoppingListSync

    todo, entry, sync = await _setup(hass)
    await sync.async_resync()
    (rec,) = sync._data["items"].values()

    reborn = ShoppingListSync(hass)
    await reborn.async_setup()
    assert reborn._data["items"] and next(iter(reborn._data["items"].values()))["uid"] == rec["uid"]
    await reborn.async_resync()  # converges — no duplicate row
    assert sum("Filter" in s for s in todo.summaries()) == 1
    reborn.async_teardown()


async def test_setup_before_started_waits_for_ha(hass: HomeAssistant) -> None:
    from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
    from homeassistant.core import CoreState

    from custom_components.maintenance_supporter.shopping_sync import ShoppingListSync

    hass.set_state(CoreState.starting)
    sync = ShoppingListSync(hass)
    await sync.async_setup()
    assert sync._debounce is None  # nothing scheduled yet
    hass.set_state(CoreState.running)
    hass.bus.async_fire(EVENT_HOMEASSISTANT_STARTED)
    await hass.async_block_till_done()
    assert sync._debounce is not None  # boot resync armed
    sync.async_teardown()
    assert sync._debounce is None


async def test_rename_follows_the_configured_list(hass: HomeAssistant) -> None:
    todo, entry, sync = await _setup(hass)
    await sync.async_resync()
    assert sync._data["entity_id"] == LIST_ENTITY

    await sync.async_handle_rename(LIST_ENTITY, "todo.pantry")
    assert sync._data["entity_id"] == "todo.pantry"
    assert sync._listening_to == "todo.pantry"
    assert sync._debounce is not None


async def test_debounced_trigger_fires_the_resync(hass: HomeAssistant) -> None:
    from datetime import timedelta

    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    todo, entry, sync = await _setup(hass)
    sync.schedule_resync()
    sync.schedule_resync()  # re-arm cancels the first timer
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=6))
    await hass.async_block_till_done()
    assert any("Filter" in s for s in todo.summaries())  # the fired pass mirrored


async def test_missing_entity_is_a_quiet_noop(hass: HomeAssistant) -> None:
    todo, entry, sync = await _setup(hass, option="todo.not_loaded_yet")
    await sync.async_resync()
    assert not sync._data["items"]


async def test_switch_to_gone_list_skips_old_cleanup(hass: HomeAssistant) -> None:
    """Old list vanished entirely — nothing to clean, mapping still resets."""
    todo, entry, sync = await _setup(hass)
    await sync.async_resync()
    assert sync._data["items"]

    hass.states.async_remove(LIST_ENTITY)
    gentry = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id == GLOBAL_UNIQUE_ID)
    hass.config_entries.async_update_entry(gentry, options={CONF_SHOPPING_LIST_ENTITY: ""})
    await hass.async_block_till_done()
    sync = hass.data[DOMAIN][SHOPPING_SYNC_KEY]
    await sync.async_resync()
    assert not sync._data["items"]


async def test_resync_pass_failure_is_contained(hass: HomeAssistant, monkeypatch) -> None:
    todo, entry, sync = await _setup(hass)

    async def boom() -> None:
        raise RuntimeError("kaboom")

    monkeypatch.setattr(sync, "_resync_locked", boom)
    await sync.async_resync()  # must not raise


async def test_service_error_paths_are_soft(hass: HomeAssistant) -> None:
    """A broken todo provider degrades to warnings, never exceptions.

    hass.services can't be monkeypatched, so the probe instance gets a stub
    hass whose service registry always raises.
    """
    from types import SimpleNamespace

    from custom_components.maintenance_supporter.shopping_sync import ShoppingListSync

    todo, entry, sync = await _setup(hass)

    class _BrokenServices:
        async def async_call(self, *a, **kw):
            raise RuntimeError("provider down")

    probe = ShoppingListSync(hass)
    probe._hass = SimpleNamespace(services=_BrokenServices(), states=hass.states)
    assert await probe._get_items(LIST_ENTITY) is None
    assert await probe._add_item(LIST_ENTITY, "x") is False
    await probe._remove_item(LIST_ENTITY, {"uid": "u1"})  # logged, not raised
    await probe._remove_item(LIST_ENTITY, {})  # no uid/summary → nothing to do
    probe._data["items"]["k"] = {"uid": "u1", "summary": "x"}
    await probe._remove_all_from(LIST_ENTITY)  # errors stay soft here too


async def test_complete_buy_task_guards(hass: HomeAssistant, monkeypatch) -> None:
    todo, entry, sync = await _setup(hass)
    buy_id = _buy_task_id(entry)

    await sync._complete_buy_task("gone-entry:whatever")  # unknown entry
    await sync._complete_buy_task(f"{entry.entry_id}:not_a_task")  # unknown task

    # a failing complete is logged, never raised
    async def boom(**kw):
        raise RuntimeError("nope")

    monkeypatch.setattr(entry.runtime_data.coordinator, "complete_maintenance", boom)
    await sync._complete_buy_task(f"{entry.entry_id}:{buy_id}")
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[buy_id]
    assert not [h for h in merged["history"] if h["type"] == "completed"]

    # already completed elsewhere → guard, no second attempt — and _desired
    # now skips it as history (part_ref still attached, but done)
    entry.runtime_data.store.set_last_performed(buy_id, "2026-08-01")
    await sync._complete_buy_task(f"{entry.entry_id}:{buy_id}")
    assert f"{entry.entry_id}:{buy_id}" not in sync._desired()

    # entry without a coordinator/store (the global entry) → guard
    gentry = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id == GLOBAL_UNIQUE_ID)
    await sync._complete_buy_task(f"{gentry.entry_id}:whatever")


async def test_desired_skips_plain_and_disabled_tasks(hass: HomeAssistant) -> None:
    todo, entry, sync = await _setup(hass)
    buy_id = _buy_task_id(entry)

    new_data = dict(entry.data)
    tasks = dict(new_data[CONF_TASKS])
    tasks["plain"] = {"id": "plain", "name": "No ref", "enabled": True}
    disabled = dict(tasks[buy_id])
    disabled["enabled"] = False
    tasks["off"] = {**disabled, "id": "off"}
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    # an added-but-never-loaded entry (no runtime_data) is skipped, not fatal
    MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Ghost",
        data=build_object_entry_data(tasks={}), source="user",
        unique_id="maintenance_supporter_shopping_ghost",
    ).add_to_hass(hass)

    desired = sync._desired()
    assert f"{entry.entry_id}:{buy_id}" in desired
    assert not any(k.endswith(":plain") or k.endswith(":off") for k in desired)


async def test_partial_failures_and_second_part(hass: HomeAssistant, monkeypatch) -> None:
    """get_items failure aborts the pass; a failed add just skips the row;
    an already-claimed uid is left alone when the next part joins."""
    todo, entry, sync = await _setup(hass)
    await sync.async_resync()
    assert len(sync._data["items"]) == 1

    # a failing get_items ends the pass cleanly (mapping untouched)
    async def none_items(entity):
        return None

    monkeypatch.setattr(sync, "_get_items", none_items)
    await sync.async_resync()
    assert len(sync._data["items"]) == 1
    monkeypatch.undo()

    # second part goes low -> second buy task
    new_data = dict(entry.data)
    parts = dict(new_data[CONF_PARTS])
    parts["p2"] = {"id": "p2", "name": "Belt", "reorder_threshold": 2, "restock_quantity": 1, "auto_buy_task": True}
    new_data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(entry, data=new_data)
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    entry.runtime_data.store.set_part_stock("p2", 0)
    await async_reconcile_buy_tasks(hass, entry)
    await hass.async_block_till_done()

    # its add fails -> skipped this pass, first row untouched
    async def no_add(entity, summary):
        return False

    monkeypatch.setattr(sync, "_add_item", no_add)
    await sync.async_resync()
    assert len(sync._data["items"]) == 1
    monkeypatch.undo()

    # next pass claims only the new row; the first keeps its uid (continue)
    await sync.async_resync()
    assert len(sync._data["items"]) == 2
    assert all(rec["uid"] for rec in sync._data["items"].values())


async def test_setting_the_option_in_the_panel_starts_the_mirror(hass: HomeAssistant) -> None:
    """Regression: the global-options listener does not reload the entry, so
    saving the setting in the panel (global/update) has to nudge the sync
    itself — the demo instance sat with an empty list until a restart."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    from custom_components.maintenance_supporter.websocket.dashboard import ws_update_global_settings

    from .conftest import call_ws_handler, make_ws_connection

    todo, entry, sync = await _setup(hass, option="")
    assert todo.summaries() == []
    # Drain the boot/reconcile debounce first: with the option still empty
    # that pass is a no-op, and afterwards NO timer is pending - exactly the
    # state a long-running instance is in when the user saves the setting.
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=3))
    await hass.async_block_till_done()
    assert sync._debounce is None
    assert todo.summaries() == []

    conn = make_ws_connection()
    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1, "type": "x", "settings": {"shopping_list_entity": LIST_ENTITY},
    })
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()  # the options listener runs as a task
    # No manual resync: only the debounce the listener armed.
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=6))
    await hass.async_block_till_done()
    assert any("Filter" in s for s in todo.summaries())

    # Clearing it the same way pulls the row back out.
    conn = make_ws_connection()
    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 2, "type": "x", "settings": {"shopping_list_entity": ""},
    })
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=12))
    await hass.async_block_till_done()
    assert not any("Filter" in s for s in todo.summaries())
