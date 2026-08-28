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
