"""#231: default to-do lists for the mirror, and the due date on the rows.

Pins: a task without its own lists goes onto the default lists (Settings →
General), its own lists replace them, ``mirror_todo_use_default: False``
keeps it off; changing or clearing the default moves the inheriting tasks'
rows (an unrelated settings save touches nothing); a check-off on a default
list completes the task; a list that takes a due date gets the task's next
due date, follows it when it moves, and an older row gets it once; a list
without due dates gets none; renaming a default list follows it; the WS
task and settings write paths, the sanitizer, the options flow and the
exports keep the rules.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from homeassistant.components.todo import (
    DOMAIN as TODO_DOMAIN,
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    async_fire_time_changed,
    setup_test_component_platform,
)

from custom_components.maintenance_supporter.const import (
    COMPLETION_PROVENANCE_NOTES,
    CONF_MIRROR_TODO_DEFAULT_ENTITIES,
    CONF_TASKS,
    DOMAIN,
)
from custom_components.maintenance_supporter.helpers import todo_mirror
from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields
from custom_components.maintenance_supporter.helpers.todo_mirror import (
    MIRROR_STATE_KEY,
    TODO_MIRROR_KEY,
    mirror_lists,
    task_due_date,
)
from custom_components.maintenance_supporter.websocket.dashboard import ws_update_global_settings
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_update_task

from .conftest import (
    assert_ws_success,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)
from .task_results import as_result

FAMILY = "todo.family"
CLOUD = "todo.cloud"


class ListEntity(TodoListEntity):
    """A test-platform list; ``dated`` lists take a due date on their rows."""

    def __init__(self, name: str, *, dated: bool = False) -> None:
        self._attr_name = name
        self._attr_unique_id = name.lower()
        self._attr_supported_features = (
            TodoListEntityFeature.CREATE_TODO_ITEM
            | TodoListEntityFeature.DELETE_TODO_ITEM
            | TodoListEntityFeature.UPDATE_TODO_ITEM
            | (TodoListEntityFeature.SET_DUE_DATE_ON_ITEM if dated else TodoListEntityFeature(0))
        )
        self._attr_todo_items: list[TodoItem] = []
        self._n = 0

    def rows(self) -> dict[str, TodoItem]:
        return {i.summary or "": i for i in self._attr_todo_items}

    def check_off(self, uid: str) -> None:
        self._attr_todo_items = [
            TodoItem(summary=i.summary, uid=i.uid, status=TodoItemStatus.COMPLETED, due=i.due) if i.uid == uid else i
            for i in self._attr_todo_items
        ]
        self.async_write_ha_state()

    async def async_create_todo_item(self, item: TodoItem) -> None:
        self._n += 1
        self._attr_todo_items.append(
            TodoItem(summary=item.summary, uid=f"{self._attr_unique_id}-{self._n}", status=item.status, due=item.due)
        )
        self.async_write_ha_state()

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        self._attr_todo_items = [i for i in self._attr_todo_items if i.uid not in uids]
        self.async_write_ha_state()

    async def async_update_todo_item(self, item: TodoItem) -> None:
        self._attr_todo_items = [item if i.uid == item.uid else i for i in self._attr_todo_items]
        self.async_write_ha_state()


def _task(task_id: str, name: str, *, days_ago: int = 60, **extra: Any) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=days_ago)).isoformat()
    return {**build_task_data(task_id=task_id, name=name, interval_days=30, warning_days=3, last_performed=last), **extra}


async def _setup(hass: HomeAssistant, defaults: list[str], tasks: dict[str, dict[str, Any]] | None = None):
    family, cloud = ListEntity("Family"), ListEntity("Cloud", dated=True)
    setup_test_component_platform(hass, TODO_DOMAIN, [family, cloud])
    assert await async_setup_component(hass, TODO_DOMAIN, {TODO_DOMAIN: {"platform": "test"}})
    await hass.async_block_till_done()

    g = make_global_entry(hass, extra_data={CONF_MIRROR_TODO_DEFAULT_ENTITIES: defaults})
    obj = make_object_entry(hass, tasks=tasks or {"t1": _task("t1", "Filter")}, uid="todo_default_231")
    await setup_integration(hass, g, obj)
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    return family, cloud, g, entry, hass.data[DOMAIN][TODO_MIRROR_KEY]


def _record(entry, task_id: str = "t1") -> dict | None:
    return entry.runtime_data.store.get_task_state(task_id).get(MIRROR_STATE_KEY)


async def _refresh(hass: HomeAssistant, entry) -> None:
    await entry.runtime_data.coordinator.async_refresh_now()
    await hass.async_block_till_done()


async def _save_settings(hass: HomeAssistant, settings: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(ws_update_global_settings, hass, conn, {"id": 1, "type": "x", "settings": settings})
    await hass.async_block_till_done()
    return conn


async def _settle(hass: HomeAssistant) -> None:
    """Let the debounced list check run."""
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()


# ─── which lists a task goes onto ──────────────────────────────────────────


def test_mirror_lists_rule() -> None:
    assert mirror_lists({}, [CLOUD]) == [CLOUD]
    assert mirror_lists({"mirror_todo_entities": [FAMILY]}, [CLOUD]) == [FAMILY]
    assert mirror_lists({"mirror_todo_use_default": False}, [CLOUD]) == []
    # own lists win over an opt-out left behind
    assert mirror_lists({"mirror_todo_entities": [FAMILY], "mirror_todo_use_default": False}, [CLOUD]) == [FAMILY]
    assert mirror_lists({}) == []
    assert task_due_date(as_result({"_next_due": "2026-11-02"})) == date(2026, 11, 2)
    assert task_due_date(as_result({"_next_due": "soon"})) is None and task_due_date(as_result({})) is None


async def test_default_lists_take_every_task_without_its_own(hass: HomeAssistant) -> None:
    tasks = {
        "t1": _task("t1", "Filter"),
        "t2": _task("t2", "Descale", mirror_todo_entities=[FAMILY]),
        "t3": _task("t3", "Oil", mirror_todo_use_default=False),
    }
    family, cloud, g, entry, mirror = await _setup(hass, [CLOUD], tasks)

    assert set(cloud.rows()) == {"Test Object: Filter"}
    assert set(family.rows()) == {"Test Object: Descale"}
    assert _record(entry, "t3") is None
    assert mirror.listening_to == {CLOUD, FAMILY}


async def test_changing_the_default_moves_the_rows(hass: HomeAssistant) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [FAMILY])
    assert "Test Object: Filter" in family.rows()
    await _settle(hass)  # drain the add-triggered checks first

    # An unrelated settings save leaves the lists alone.
    assert_ws_success(await _save_settings(hass, {"default_warning_days": 5}))
    assert not mirror._debounce.pending

    assert_ws_success(await _save_settings(hass, {CONF_MIRROR_TODO_DEFAULT_ENTITIES: [CLOUD]}))
    assert mirror._debounce.pending
    await _settle(hass)
    assert family.rows() == {} and set(cloud.rows()) == {"Test Object: Filter"}
    assert set(_record(entry)) == {CLOUD}
    assert mirror.listening_to == {CLOUD}

    assert_ws_success(await _save_settings(hass, {CONF_MIRROR_TODO_DEFAULT_ENTITIES: []}))
    await _settle(hass)
    assert cloud.rows() == {} and _record(entry) is None
    assert mirror.listening_to == set()


async def test_check_off_on_a_default_list_completes_the_task(hass: HomeAssistant) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [FAMILY])
    family.check_off(_record(entry)[FAMILY]["uid"])
    await mirror.async_check_lists()
    await hass.async_block_till_done()

    merged = entry.runtime_data.coordinator._get_merged_tasks_data()["t1"]
    done = [h for h in merged["history"] if h["type"] == "completed"]
    assert done and done[-1].get("notes") == COMPLETION_PROVENANCE_NOTES["todo_mirror"]
    assert family.rows() == {} and _record(entry) is None


# ─── the due date ───────────────────────────────────────────────────────────


async def test_a_list_that_takes_a_due_date_gets_the_tasks(hass: HomeAssistant) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [CLOUD, FAMILY])
    due = date.fromisoformat(entry.runtime_data.coordinator.data[CONF_TASKS]["t1"].next_due)

    assert cloud.rows()["Test Object: Filter"].due == due
    assert family.rows()["Test Object: Filter"].due is None  # this list takes none
    rec = _record(entry)
    assert rec[CLOUD]["due"] == due.isoformat() and rec[FAMILY]["due"] is None

    # The date moves (a new anchor: due in two days, still due soon) — the row
    # follows by uid, the list without dates is not touched.
    uid = rec[CLOUD]["uid"]
    entry.runtime_data.store.set_anchor("t1", (dt_util.now().date() - timedelta(days=28)).isoformat())
    await _refresh(hass, entry)
    moved = date.fromisoformat(entry.runtime_data.coordinator.data[CONF_TASKS]["t1"].next_due)
    assert moved != due
    row = cloud.rows()["Test Object: Filter"]
    assert row.due == moved and row.uid == uid
    assert _record(entry)[CLOUD]["due"] == moved.isoformat()
    assert family.rows()["Test Object: Filter"].due is None


async def test_an_older_row_gets_the_date_once_and_a_hand_edit_stays(hass: HomeAssistant, monkeypatch) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [CLOUD])
    store = entry.runtime_data.store
    # A row from before the date: no "due" in the record, none on the list.
    rec = _record(entry)
    store.update_task_state("t1", **{MIRROR_STATE_KEY: {CLOUD: {"summary": rec[CLOUD]["summary"], "uid": rec[CLOUD]["uid"]}}})
    cloud._attr_todo_items = [TodoItem(summary=i.summary, uid=i.uid, status=i.status) for i in cloud._attr_todo_items]

    calls: list[dict[str, Any]] = []
    real = todo_mirror.async_todo_update_item

    async def spy(hass_, entity, rec_, fields):
        calls.append(dict(fields))
        return await real(hass_, entity, rec_, fields)

    monkeypatch.setattr(todo_mirror, "async_todo_update_item", spy)
    await _refresh(hass, entry)
    due = date.fromisoformat(entry.runtime_data.coordinator.data[CONF_TASKS]["t1"].next_due)
    assert calls == [{"due_date": due}]
    assert cloud.rows()["Test Object: Filter"].due == due

    # A person moves the date by hand: it stays while the task's own date holds.
    row = cloud.rows()["Test Object: Filter"]
    await cloud.async_update_todo_item(TodoItem(summary=row.summary, uid=row.uid, status=row.status, due=due + timedelta(days=7)))
    await _refresh(hass, entry)
    assert len(calls) == 1
    assert cloud.rows()["Test Object: Filter"].due == due + timedelta(days=7)


async def test_a_failed_date_update_is_retried(hass: HomeAssistant, monkeypatch) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [CLOUD])
    store = entry.runtime_data.store
    rec = _record(entry)[CLOUD]
    store.update_task_state("t1", **{MIRROR_STATE_KEY: {CLOUD: {**rec, "due": None}}})

    async def refuse(*_a, **_kw):
        return False

    monkeypatch.setattr(todo_mirror, "async_todo_update_item", refuse)
    await _refresh(hass, entry)
    assert _record(entry)[CLOUD]["due"] is None  # not recorded — the next pass tries again
    monkeypatch.undo()
    await _refresh(hass, entry)
    assert _record(entry)[CLOUD]["due"] == entry.runtime_data.coordinator.data[CONF_TASKS]["t1"].next_due


async def test_the_update_wrapper_is_soft(hass: HomeAssistant) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [CLOUD])
    assert await todo_mirror.async_todo_update_item(hass, CLOUD, {}, {"due_date": None}) is False
    # an unknown row: the service raises, the wrapper logs and says no
    assert await todo_mirror.async_todo_update_item(hass, CLOUD, {"uid": "nope"}, {"due_date": None}) is False


# ─── renames ────────────────────────────────────────────────────────────────


async def test_a_renamed_default_list_is_followed(hass: HomeAssistant) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [FAMILY])
    uid = _record(entry)[FAMILY]["uid"]

    er.async_get(hass).async_update_entity(FAMILY, new_entity_id="todo.household")
    await hass.async_block_till_done()
    await _settle(hass)

    g = hass.config_entries.async_get_entry(g.entry_id)
    assert (g.options or g.data)[CONF_MIRROR_TODO_DEFAULT_ENTITIES] == ["todo.household"]
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert _record(entry) == {"todo.household": {"summary": "Test Object: Filter", "uid": uid, "due": None}}
    assert list(family.rows()) == ["Test Object: Filter"]  # the same row, not a second one
    assert "todo.household" in mirror.listening_to


# ─── the write paths ────────────────────────────────────────────────────────


async def test_task_flag_is_stored_only_as_false_without_own_lists(hass: HomeAssistant) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [CLOUD], {"t1": _task("t1", "Filter", days_ago=0)})

    async def ws(handler, **payload: Any) -> dict[str, Any]:
        conn = make_ws_connection()
        await call_ws_handler(handler, hass, conn, {"id": 1, "type": "x", "entry_id": entry.entry_id, **payload})
        return assert_ws_success(conn)

    def stored(task_id: str) -> dict[str, Any]:
        return hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][task_id]

    off = (await ws(ws_create_task, name="Off", mirror_todo_use_default=False))["task_id"]
    assert stored(off)["mirror_todo_use_default"] is False
    own = (await ws(ws_create_task, name="Own", mirror_todo_use_default=False, mirror_todo_entities=[FAMILY]))["task_id"]
    assert "mirror_todo_use_default" not in stored(own)
    plain = (await ws(ws_create_task, name="Plain", mirror_todo_use_default=True))["task_id"]
    assert "mirror_todo_use_default" not in stored(plain)

    await ws(ws_update_task, task_id=plain, mirror_todo_use_default=False)
    assert stored(plain)["mirror_todo_use_default"] is False
    await ws(ws_update_task, task_id=plain, mirror_todo_use_default=None)
    assert "mirror_todo_use_default" not in stored(plain)
    await ws(ws_update_task, task_id=off, mirror_todo_entities=[FAMILY])
    assert "mirror_todo_use_default" not in stored(off) and stored(off)["mirror_todo_entities"] == [FAMILY]

    # The sanitizer keeps the same shape for every other path (import, config flow).
    assert cap_task_fields({"mirror_todo_use_default": False}) == {"mirror_todo_use_default": False}
    assert cap_task_fields({"mirror_todo_use_default": "no"}) == {}
    assert cap_task_fields({"mirror_todo_use_default": True}) == {}
    assert "mirror_todo_use_default" not in cap_task_fields({"mirror_todo_use_default": False, "mirror_todo_entities": [FAMILY]})


async def test_the_summary_and_the_backup_carry_the_opt_out(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.export import build_export_data, build_settings_export
    from custom_components.maintenance_supporter.websocket import _build_task_summary

    tasks = {"t1": _task("t1", "Filter"), "t3": _task("t3", "Oil", mirror_todo_use_default=False)}
    family, cloud, g, entry, mirror = await _setup(hass, [CLOUD], tasks)
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()
    assert _build_task_summary(hass, "t1", merged["t1"], None)["mirror_todo_use_default"] is True
    assert _build_task_summary(hass, "t3", merged["t3"], None)["mirror_todo_use_default"] is False

    exported = {t["name"]: t for o in build_export_data(hass)["objects"] for t in o["tasks"]}
    assert exported["Filter"]["mirror_todo_use_default"] is True
    assert exported["Oil"]["mirror_todo_use_default"] is False
    # The lists themselves are this instance's entities — the settings export leaves them behind.
    assert CONF_MIRROR_TODO_DEFAULT_ENTITIES not in build_settings_export(hass)["global_settings"]


async def test_settings_write_sanitizes_and_refuses_our_own_list(hass: HomeAssistant) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [], {"t1": _task("t1", "Filter", days_ago=0)})
    result = assert_ws_success(await _save_settings(hass, {CONF_MIRROR_TODO_DEFAULT_ENTITIES: [" todo.a ", "todo.a", "light.x", FAMILY]}))
    assert result["general"][CONF_MIRROR_TODO_DEFAULT_ENTITIES] == ["todo.a", FAMILY]

    own = next(e.entity_id for e in er.async_get(hass).entities.values() if e.platform == DOMAIN and e.domain == "todo")
    conn = await _save_settings(hass, {CONF_MIRROR_TODO_DEFAULT_ENTITIES: [own]})
    assert conn.send_error.call_args[0][1] == "invalid_mirror_todo"
    g = hass.config_entries.async_get_entry(g.entry_id)
    assert (g.options or g.data)[CONF_MIRROR_TODO_DEFAULT_ENTITIES] == ["todo.a", FAMILY]


async def test_options_flow_edits_the_default_lists(hass: HomeAssistant) -> None:
    family, cloud, g, entry, mirror = await _setup(hass, [FAMILY], {"t1": _task("t1", "Filter", days_ago=0)})

    async def submit(user_input: dict[str, Any]) -> Any:
        result = await hass.config_entries.options.async_init(g.entry_id)
        result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "general_settings"})
        key = next(k for k in result["data_schema"].schema if str(k) == CONF_MIRROR_TODO_DEFAULT_ENTITIES)
        assert key.description == {"suggested_value": list((g.options or g.data)[CONF_MIRROR_TODO_DEFAULT_ENTITIES])}
        return await hass.config_entries.options.async_configure(result["flow_id"], user_input=user_input)

    await submit({CONF_MIRROR_TODO_DEFAULT_ENTITIES: [CLOUD, FAMILY, CLOUD]})
    assert g.options[CONF_MIRROR_TODO_DEFAULT_ENTITIES] == [CLOUD, FAMILY]

    own = next(e.entity_id for e in er.async_get(hass).entities.values() if e.platform == DOMAIN and e.domain == "todo")
    result = await submit({CONF_MIRROR_TODO_DEFAULT_ENTITIES: [own]})
    assert result["type"] == FlowResultType.FORM
    assert result["errors"] == {CONF_MIRROR_TODO_DEFAULT_ENTITIES: "invalid_mirror_todo"}

    # A cleared selector leaves the key out: the default is off.
    await submit({})
    assert g.options[CONF_MIRROR_TODO_DEFAULT_ENTITIES] == []
