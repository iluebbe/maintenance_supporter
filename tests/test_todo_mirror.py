"""To-do mirror (D#183): a due task is mirrored into external to-do lists.

Pins: a due task puts one "<Object>: <Task>" row on EVERY configured list
(uid remembered in the object's Store, no duplicates across refreshes); a
task that is not due adds nothing; status back to OK (completion in the
panel) removes the rows; a row checked off in ANY list completes the task
through the choke point with ``source="todo_mirror"`` and clears the rows
on every list; a missing list is logged once and skipped; a hand-deleted
row comes back while the task is due; a list dropped from the config loses
its row; the WS create/update paths validate/cap the field and refuse our
own to-do platform; the service wrappers degrade to log lines.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.components.todo import (
    DOMAIN as TODO_DOMAIN,
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    async_fire_time_changed,
    setup_test_component_platform,
)

from custom_components.maintenance_supporter.const import (
    COMPLETION_PROVENANCE_NOTES,
    CONF_TASKS,
    DOMAIN,
    EVENT_TASK_COMPLETED,
)
from custom_components.maintenance_supporter.helpers.sanitize import sanitize_mirror_todo_entities
from custom_components.maintenance_supporter.helpers.todo_mirror import (
    MIRROR_STATE_KEY,
    TODO_MIRROR_KEY,
    TodoMirror,
    schedule_check,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_update_task

from .conftest import (
    TASK_ID_1,
    assert_ws_success,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

FAMILY = "todo.family"
KIDS = "todo.kids"
SUMMARY = "Test Object: Filter Cleaning"


class ListEntity(TodoListEntity):
    """A real (test-platform) todo entity the mirror's entity services hit."""

    _attr_supported_features = (
        TodoListEntityFeature.CREATE_TODO_ITEM
        | TodoListEntityFeature.DELETE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
    )

    def __init__(self, name: str) -> None:
        self._attr_name = name
        self._attr_unique_id = name.lower()
        self._attr_todo_items: list[TodoItem] = []
        self._n = 0

    def _mint(self, summary: str, status: TodoItemStatus = TodoItemStatus.NEEDS_ACTION) -> str:
        self._n += 1
        uid = f"{self._attr_unique_id}-{self._n}"
        self._attr_todo_items.append(TodoItem(summary=summary, uid=uid, status=status))
        return uid

    def seed(self, summary: str) -> str:
        uid = self._mint(summary)
        if self.hass is not None:
            self.async_write_ha_state()
        return uid

    def check_off(self, uid: str) -> None:
        self._attr_todo_items = [
            TodoItem(summary=i.summary, uid=i.uid, status=TodoItemStatus.COMPLETED) if i.uid == uid else i
            for i in self._attr_todo_items
        ]
        self.async_write_ha_state()

    def drop(self, uid: str) -> None:
        self._attr_todo_items = [i for i in self._attr_todo_items if i.uid != uid]
        self.async_write_ha_state()

    def summaries(self) -> list[str]:
        return [i.summary or "" for i in self._attr_todo_items]

    def uids(self) -> list[str]:
        return [i.uid or "" for i in self._attr_todo_items]

    async def async_create_todo_item(self, item: TodoItem) -> None:
        self._mint(item.summary or "")
        self.async_write_ha_state()

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        self._attr_todo_items = [i for i in self._attr_todo_items if i.uid not in uids]
        self.async_write_ha_state()

    async def async_update_todo_item(self, item: TodoItem) -> None:
        self._attr_todo_items = [item if i.uid == item.uid else i for i in self._attr_todo_items]
        self.async_write_ha_state()


def _task(*, days_ago: int | None = 60, lists: list[str] | None = None) -> dict:
    last = (dt_util.now().date() - timedelta(days=days_ago)).isoformat() if days_ago is not None else None
    task = build_task_data(interval_days=30, warning_days=3, last_performed=last)
    task["mirror_todo_entities"] = [FAMILY, KIDS] if lists is None else lists
    return task


async def _setup(hass: HomeAssistant, task: dict | None = None):
    """Two real todo lists + one object whose task mirrors into both."""
    family, kids = ListEntity("Family"), ListEntity("Kids")
    setup_test_component_platform(hass, TODO_DOMAIN, [family, kids])
    assert await async_setup_component(hass, TODO_DOMAIN, {TODO_DOMAIN: {"platform": "test"}})
    await hass.async_block_till_done()
    assert hass.states.get(FAMILY) is not None and hass.states.get(KIDS) is not None

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task or _task()}, uid="todo_mirror")
    await setup_integration(hass, g, obj)
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    mirror = hass.data[DOMAIN][TODO_MIRROR_KEY]
    return family, kids, entry, mirror


def _record(entry) -> dict | None:
    return entry.runtime_data.store.get_task_state(TASK_ID_1).get(MIRROR_STATE_KEY)


async def _refresh(hass: HomeAssistant, entry) -> None:
    await entry.runtime_data.coordinator.async_refresh_now()
    await hass.async_block_till_done()


# ─── the reconcile ───────────────────────────────────────────────────────────


async def test_due_task_mirrors_one_row_into_every_list(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass)
    foreign = family.seed("Milk")

    assert family.summaries().count(SUMMARY) == 1
    assert kids.summaries().count(SUMMARY) == 1
    rec = _record(entry)
    assert set(rec) == {FAMILY, KIDS}
    assert rec[FAMILY]["summary"] == SUMMARY and rec[FAMILY]["uid"] in family.uids()
    assert rec[KIDS]["uid"] in kids.uids()
    assert mirror.listening_to == {FAMILY, KIDS}

    # Converges — a second refresh adds nothing, foreign rows are untouched.
    await _refresh(hass, entry)
    assert family.summaries().count(SUMMARY) == 1 and kids.summaries().count(SUMMARY) == 1
    assert foreign in family.uids()


async def test_task_that_is_not_due_adds_nothing(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass, _task(days_ago=0))
    await _refresh(hass, entry)
    assert family.summaries() == [] and kids.summaries() == []
    assert _record(entry) is None


async def test_status_back_to_ok_removes_the_rows(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass)
    assert SUMMARY in family.summaries()

    # Completed in the panel → the completion's own refresh clears the rows.
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, notes="done", source="panel")
    await hass.async_block_till_done()

    assert SUMMARY not in family.summaries() and SUMMARY not in kids.summaries()
    assert _record(entry) is None


async def test_check_off_in_one_list_completes_and_clears_both(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass)
    events: list[Event] = []
    hass.bus.async_listen(EVENT_TASK_COMPLETED, events.append)
    rec = _record(entry)

    kids.check_off(rec[KIDS]["uid"])
    await mirror.async_check_lists()
    await hass.async_block_till_done()

    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    done = [h for h in merged["history"] if h["type"] == "completed"]
    assert done and done[-1].get("notes") == COMPLETION_PROVENANCE_NOTES["todo_mirror"]
    assert events and events[-1].data["source"] == "todo_mirror"
    assert SUMMARY not in family.summaries() and SUMMARY not in kids.summaries()
    assert _record(entry) is None
    # Nothing comes back: the task is OK now.
    await mirror.async_check_lists()
    assert SUMMARY not in family.summaries()


async def test_list_change_triggers_the_debounced_check(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass)
    rec = _record(entry)
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()  # drain the add-triggered checks first

    family.check_off(rec[FAMILY]["uid"])  # state change → listener → timer
    assert mirror._debounce.pending
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()

    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    assert [h for h in merged["history"] if h["type"] == "completed"]
    assert SUMMARY not in kids.summaries()


async def test_hand_deleted_row_comes_back_while_due(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass)
    family.drop(_record(entry)[FAMILY]["uid"])
    assert SUMMARY not in family.summaries()

    await mirror.async_check_lists()
    assert family.summaries().count(SUMMARY) == 1
    assert _record(entry)[FAMILY]["uid"] in family.uids()


async def test_list_dropped_from_the_config_loses_its_row(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass)
    tasks = {TASK_ID_1: {**entry.data[CONF_TASKS][TASK_ID_1], "mirror_todo_entities": [FAMILY]}}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    await _refresh(hass, entry)

    assert SUMMARY in family.summaries() and SUMMARY not in kids.summaries()
    assert set(_record(entry)) == {FAMILY}
    assert mirror.listening_to == {FAMILY}


async def test_renamed_task_rewrites_the_row(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass)
    tasks = {TASK_ID_1: {**entry.data[CONF_TASKS][TASK_ID_1], "name": "Filter Swap"}}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    await _refresh(hass, entry)

    assert family.summaries() == ["Test Object: Filter Swap"]
    assert _record(entry)[FAMILY]["summary"] == "Test Object: Filter Swap"


async def test_missing_list_is_logged_once_and_skipped(hass: HomeAssistant, caplog) -> None:
    family, kids, entry, mirror = await _setup(hass, _task(lists=["todo.not_there", FAMILY]))
    await _refresh(hass, entry)
    await _refresh(hass, entry)

    assert SUMMARY in family.summaries()
    assert set(_record(entry)) == {FAMILY}
    assert caplog.text.count("todo.not_there is not available") == 1


async def test_own_todo_platform_is_skipped_with_a_warning(hass: HomeAssistant, caplog) -> None:
    family, kids, entry, mirror = await _setup(hass, _task(days_ago=0))
    own = next(e.entity_id for e in er.async_get(hass).entities.values() if e.platform == DOMAIN and e.domain == "todo")
    tasks = {TASK_ID_1: {**entry.data[CONF_TASKS][TASK_ID_1], "mirror_todo_entities": [own]}}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    # The Store's anchor wins over entry data — move it back so the task is due.
    entry.runtime_data.store.set_anchor(TASK_ID_1, (dt_util.now().date() - timedelta(days=60)).isoformat())
    await _refresh(hass, entry)

    assert _record(entry) is None
    assert "own list and is skipped" in caplog.text


async def test_refused_completion_is_logged_and_the_row_reappears(hass: HomeAssistant, caplog, monkeypatch) -> None:
    family, kids, entry, mirror = await _setup(hass)
    rec = _record(entry)

    async def boom(**kw):
        raise RuntimeError("note required")

    monkeypatch.setattr(entry.runtime_data.coordinator, "complete_maintenance", boom)
    family.check_off(rec[FAMILY]["uid"])
    await mirror.async_check_lists()

    assert "did not complete the task" in caplog.text
    # The checked row was cleared, the task is still due → a fresh row.
    assert family.summaries().count(SUMMARY) == 1
    assert _record(entry)[FAMILY]["uid"] != rec[FAMILY]["uid"]


# ─── plumbing ───────────────────────────────────────────────────────────────


async def test_overlapping_checks_coalesce_and_failures_are_contained(hass: HomeAssistant, monkeypatch, caplog) -> None:
    family, kids, entry, mirror = await _setup(hass)

    async def slow() -> None:
        await mirror.async_check_lists()  # re-entrant call → flagged for a re-run

    monkeypatch.setattr(mirror, "_check_lists", slow)
    await mirror.async_check_lists()
    assert mirror._debounce.pending  # the coalesced re-check was armed
    monkeypatch.undo()

    async def boom() -> None:
        raise RuntimeError("kaboom")

    monkeypatch.setattr(mirror, "_check_lists", boom)
    await mirror.async_check_lists()  # must not raise
    assert "list check failed" in caplog.text
    monkeypatch.undo()

    monkeypatch.setattr(mirror, "_sync_entry_locked", boom)
    await _refresh(hass, entry)  # the coordinator refresh survives a broken pass
    assert "mirror pass for entry" in caplog.text


async def test_teardown_closes_timer_and_listeners(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass)
    assert mirror.listening_to == {FAMILY, KIDS}
    mirror.async_teardown()
    assert mirror.listening_to == set()
    mirror.schedule_check()
    assert not mirror._debounce.pending
    hass.data[DOMAIN].pop(TODO_MIRROR_KEY)
    schedule_check(hass)  # no mirror → no-op


async def test_service_error_paths_are_soft(hass: HomeAssistant) -> None:
    from types import SimpleNamespace

    family, kids, entry, mirror = await _setup(hass, _task(days_ago=0))

    class _BrokenServices:
        async def async_call(self, *a, **kw):
            raise RuntimeError("provider down")

        def has_service(self, *a):
            return True

    probe = TodoMirror(hass)
    probe._hass = SimpleNamespace(services=_BrokenServices(), states=hass.states)
    assert await probe._get_items(FAMILY) is None
    assert await probe._add_item(FAMILY, "x") is False
    await probe._remove_item(FAMILY, {"uid": "u1"})  # logged, not raised
    await probe._remove_item(FAMILY, {})  # nothing to remove
    await probe._remove_item("todo.gone", {"uid": "u1"})  # list gone entirely

    # A provider that hides the new row: add succeeds, uid stays None.
    async def no_items(entity):
        return []

    probe2 = TodoMirror(hass)
    probe2._get_items = no_items  # type: ignore[method-assign]
    assert await probe2._add_item(FAMILY, "hidden") is None
    assert "hidden" in family.summaries()


# ─── the field: WS + sanitize ───────────────────────────────────────────────


def test_sanitize_mirror_todo_entities() -> None:
    assert sanitize_mirror_todo_entities(None) == []
    assert sanitize_mirror_todo_entities("todo.x") == []
    assert sanitize_mirror_todo_entities([" todo.a ", "todo.a", "light.b", "todo.Bad", 3, ""]) == ["todo.a"]
    assert sanitize_mirror_todo_entities([f"todo.l{i}" for i in range(9)]) == [f"todo.l{i}" for i in range(5)]


async def test_ws_create_and_update_validate_the_field(hass: HomeAssistant) -> None:
    family, kids, entry, mirror = await _setup(hass, _task(days_ago=0))

    conn = make_ws_connection()
    await call_ws_handler(ws_create_task, hass, conn, {
        "id": 1, "type": "x", "entry_id": entry.entry_id, "name": "Mirrored",
        "mirror_todo_entities": [KIDS, KIDS, "light.nope"],
    })
    task_id = assert_ws_success(conn)["task_id"]
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.data[CONF_TASKS][task_id]["mirror_todo_entities"] == [KIDS]

    # Our own to-do platform is refused.
    own = next(e.entity_id for e in er.async_get(hass).entities.values() if e.platform == DOMAIN and e.domain == "todo")
    conn = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn, {
        "id": 2, "type": "x", "entry_id": entry.entry_id, "task_id": task_id, "mirror_todo_entities": [own],
    })
    assert conn.send_error.call_args[0][1] == "invalid_mirror_todo"
    conn = make_ws_connection()
    await call_ws_handler(ws_create_task, hass, conn, {
        "id": 3, "type": "x", "entry_id": entry.entry_id, "name": "Circular", "mirror_todo_entities": [own],
    })
    assert conn.send_error.call_args[0][1] == "invalid_mirror_todo"

    # Update swaps the lists; an empty list clears the key.
    conn = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn, {
        "id": 4, "type": "x", "entry_id": entry.entry_id, "task_id": task_id, "mirror_todo_entities": [FAMILY],
    })
    assert_ws_success(conn)
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.data[CONF_TASKS][task_id]["mirror_todo_entities"] == [FAMILY]
    conn = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn, {
        "id": 5, "type": "x", "entry_id": entry.entry_id, "task_id": task_id, "mirror_todo_entities": [],
    })
    assert_ws_success(conn)
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert "mirror_todo_entities" not in entry.data[CONF_TASKS][task_id]
