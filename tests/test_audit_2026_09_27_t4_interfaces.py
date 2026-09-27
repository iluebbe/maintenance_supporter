"""Regression tests for the second bug audit of 2026-09-27 (tranche 4) — interfaces.

Backend interfaces (WS commands, services, flows, JSON / CSV import, HTTP
views, the retention sweep): High 1 (import part), High 2 (boundaries), High 4
(R SEC-2), High 5, Medium 7 / 8 / 10 / 12 / 13 (backend) and the Low items of
the interface lens. One test (or a small group) per finding; each docstring
names the failure so a red test says which bug came back.
"""

from __future__ import annotations

import json
from datetime import timedelta
from typing import Any
from unittest.mock import patch

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOCUMENT_STORE_KEY,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

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
FAR_FUTURE = "9999-12-20"


# ─── helpers ─────────────────────────────────────────────────────────────


def _global(hass: HomeAssistant) -> MockConfigEntry:
    g = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
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
    **task_over: Any,
) -> MockConfigEntry:
    task = build_task_data(task_id=task_id, interval_days=30, last_performed="2026-09-01", object_id=uid)
    task["name"] = "Change Filter"
    task.update(task_over)
    data = build_object_entry_data(object_data=build_object_data(name=name, object_id=uid), tasks={task_id: task})
    if parts:
        data["parts"] = parts
    obj = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title=name, data=data, source="user", unique_id=f"maintenance_supporter_{uid}"
    )
    obj.add_to_hass(hass)
    return obj


async def _setup(hass: HomeAssistant, **kwargs: Any) -> MockConfigEntry:
    g = _global(hass)
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


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return conn


def _issues(hass: HomeAssistant) -> list[str]:
    return sorted(i for (d, i) in ir.async_get(hass).issues if d == DOMAIN)


def _defaults(schema: vol.Schema) -> dict[str, Any]:
    """The form's submission when the user changes nothing."""
    out: dict[str, Any] = {}
    for key in schema.schema:
        if isinstance(key, vol.Optional | vol.Required) and key.default is not vol.UNDEFINED:
            out[str(key)] = key.default()
    return {k: v for k, v in out.items() if v is not None}


async def _open_edit_task(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK) -> Any:
    r = await hass.config_entries.options.async_init(entry.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "manage_tasks"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"selected_task": task_id})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "edit_task"})
    assert r["step_id"] == "edit_task"
    return r


async def _photo(hass: HomeAssistant, object_id: str, *, tags: list[str] | None = None, content: bytes = b"img") -> str:
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await store.async_add_file(
        object_id, content=content, filename="p.jpg", mime="image/jpeg", tags=["photo"] if tags is None else tags
    )
    return str(doc["id"])


# ─── High 2: a future reset / last-performed date is refused ─────────────


async def test_ws_reset_refuses_a_future_date(hass: HomeAssistant) -> None:
    """task/reset (read tier — any household member) took 9999-12-20: the
    schedule math overflowed inside every refresh and the object stayed in
    setup-retry across restarts."""
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_reset_task

    entry = await _setup(hass)
    msg = {"type": f"{DOMAIN}/task/reset", "entry_id": entry.entry_id, "task_id": TASK}
    assert_ws_error(await _ws(hass, ws_reset_task, {**msg, "date": FAR_FUTURE}), "invalid_date")
    store = _live(hass, entry.entry_id).runtime_data.store
    assert store.get_last_performed(TASK) == "2026-09-01"
    # A real past date still works.
    assert_ws_success(await _ws(hass, ws_reset_task, {**msg, "date": "2026-09-10"}))
    assert store.get_last_performed(TASK) == "2026-09-10"


async def test_ws_task_create_and_update_refuse_a_future_last_performed(hass: HomeAssistant) -> None:
    """task/create and task/update stored a far-future last_performed the same
    way (the anchor of every later due-date computation)."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_update_task

    entry = await _setup(hass)
    update = {"type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": TASK, "last_performed": FAR_FUTURE}
    assert_ws_error(await _ws(hass, ws_update_task, update), "invalid_date")
    assert _live(hass, entry.entry_id).runtime_data.store.get_last_performed(TASK) == "2026-09-01"

    create = {"type": f"{DOMAIN}/task/create", "entry_id": entry.entry_id, "name": "Future", "interval_days": 7, "last_performed": FAR_FUTURE}
    assert_ws_error(await _ws(hass, ws_create_task, create), "invalid_date")
    assert len(_live(hass, entry.entry_id).data[CONF_TASKS]) == 1


def test_reset_service_schema_refuses_a_future_date() -> None:
    """The reset service's ``cv.date`` accepted any date — the service path of
    the same overflow."""
    from custom_components.maintenance_supporter import SERVICE_RESET_SCHEMA

    with pytest.raises(vol.Invalid):
        SERVICE_RESET_SCHEMA({"entity_id": "sensor.washer_change_filter", "date": FAR_FUTURE})
    today = dt_util.now().date()
    assert SERVICE_RESET_SCHEMA({"entity_id": "sensor.washer_change_filter", "date": today.isoformat()})["date"] == today


async def test_json_import_drops_a_future_last_performed(hass: HomeAssistant) -> None:
    """A backup carrying a year-9999 last_performed restored an object that
    could never refresh; the import now drops it with a warning."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, _global(hass))
    payload = {"objects": [{"object": {"name": "Imported"}, "tasks": [{"name": "Filter", "interval_days": 30, "last_performed": FAR_FUTURE}]}]}
    res = assert_ws_success(await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)}))
    assert res["created"] == 1
    assert any("in the future" in w for w in res["imported"][0].get("warnings", []))
    new = _live(hass, res["imported"][0]["entry_id"])
    assert all(t.get("last_performed") in (None, "") for t in new.data[CONF_TASKS].values())
    await new.runtime_data.coordinator.async_refresh()
    assert new.runtime_data.coordinator.last_update_success


def test_csv_import_drops_a_future_last_performed() -> None:
    """Same boundary for the CSV import (the parser took any date)."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    parsed = import_objects_csv(f"object_name,task_name,interval_days,last_performed\nShed,Oil,30,{FAR_FUTURE}\nShed,Grease,30,2026-01-02\n")
    tasks = {t["name"]: t for t in parsed[0]["tasks"].values()}
    assert "last_performed" not in tasks["Oil"]
    assert tasks["Grease"]["last_performed"] == "2026-01-02"
    assert any("Oil" in w and "future" in w for w in parsed[0]["warnings"])


async def test_options_edit_task_refuses_a_future_last_performed(hass: HomeAssistant) -> None:
    """The options-flow date picker reaches year 9999 as well."""
    entry = await _setup(hass)
    r = await _open_edit_task(hass, entry)
    ui = {**_defaults(r["data_schema"]), "last_performed": FAR_FUTURE}
    r = await hass.config_entries.options.async_configure(r["flow_id"], ui)
    assert r["type"] == FlowResultType.FORM
    assert r["errors"] == {"last_performed": "last_performed_future"}


def test_the_flow_future_date_helper() -> None:
    """The one predicate behind the wizard / options schedule steps."""
    from custom_components.maintenance_supporter.config_flow_helpers import is_future_date

    today = dt_util.now().date()
    assert is_future_date(FAR_FUTURE)
    assert is_future_date((today + timedelta(days=1)).isoformat())
    assert not is_future_date(today.isoformat())
    assert not is_future_date(None)
    assert not is_future_date("garbage")


# ─── High 1 (import part): an absurd vacation end is not restored ────────


async def test_settings_import_drops_an_absurd_vacation_end(hass: HomeAssistant) -> None:
    """vacation/update now refuses a date more than ten years out; a settings
    import still wrote 9999-12-31, whose window overflowed inside every
    object's refresh."""
    from custom_components.maintenance_supporter.helpers.global_options import get_global_entry
    from custom_components.maintenance_supporter.websocket.io import _apply_settings_import

    await setup_integration(hass, _global(hass))
    applied = _apply_settings_import(hass, {"vacation_enabled": True, "vacation_start": "2026-10-01", "vacation_end": "9999-12-31"})
    options = get_global_entry(hass).options
    assert "vacation_end" not in applied
    assert options.get("vacation_end") in (None, "")
    assert options["vacation_start"] == "2026-10-01"


# ─── High 4 (R SEC-2): the action owner survives every re-write ──────────

_ACTION = {"service": "light.turn_on", "target": {"entity_id": "light.x"}}


async def test_update_task_service_keeps_the_action_owner(hass: HomeAssistant) -> None:
    """update_task (operator tier) ran the merged task through
    cap_task_fields, which dropped ``configured_by`` — the operator's action
    ran with system rights again after any edit of the notes."""
    entry = await _setup(hass, on_complete_action={**_ACTION, "configured_by": "operator-id"})
    await hass.services.async_call(DOMAIN, "update_task", {"entry_id": entry.entry_id, "task_id": TASK, "notes": "x"}, blocking=True)
    await hass.async_block_till_done()
    action = _live(hass, entry.entry_id).data[CONF_TASKS][TASK]["on_complete_action"]
    assert action.get("configured_by") == "operator-id"


async def test_options_edit_task_keeps_the_action_owner(hass: HomeAssistant) -> None:
    """The options-flow task edit (no action fields at all) stripped the
    owner through the same sanitiser."""
    entry = await _setup(hass, on_complete_action={**_ACTION, "configured_by": "operator-id"})
    r = await _open_edit_task(hass, entry)
    r = await hass.config_entries.options.async_configure(r["flow_id"], _defaults(r["data_schema"]))
    assert r["type"] == FlowResultType.MENU, r
    assert _live(hass, entry.entry_id).data[CONF_TASKS][TASK]["on_complete_action"].get("configured_by") == "operator-id"


async def test_object_duplicate_and_replace_keep_the_action_owner(hass: HomeAssistant) -> None:
    """object/duplicate and object/replace (operator tier) route the copied
    tasks through the config flow's websocket step, which stripped the owner:
    the copy's action ran with system rights."""
    from custom_components.maintenance_supporter.websocket.objects import ws_duplicate_object, ws_replace_object

    entry = await _setup(hass, on_complete_action={**_ACTION, "configured_by": "operator-id"})
    copy_id = assert_ws_success(await _ws(hass, ws_duplicate_object, {"type": f"{DOMAIN}/object/duplicate", "entry_id": entry.entry_id}))["entry_id"]
    succ_id = assert_ws_success(await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": entry.entry_id}))["entry_id"]
    for new_id in (copy_id, succ_id):
        (task,) = _live(hass, new_id).data[CONF_TASKS].values()
        assert task["on_complete_action"].get("configured_by") == "operator-id", new_id


async def test_json_import_runs_actions_as_the_importing_admin(hass: HomeAssistant) -> None:
    """The import now keeps owners through the websocket step — so it must
    never take the owner a FILE names: every imported action is stamped with
    the admin who imported it (decision documented in CONFIGURATION.md)."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, _global(hass))
    payload = {
        "objects": [
            {"object": {"name": "Imported"}, "tasks": [{"name": "T", "interval_days": 7, "on_complete_action": {**_ACTION, "configured_by": "some-admin"}}]}
        ]
    }
    conn = await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)})
    res = assert_ws_success(conn)
    (task,) = _live(hass, res["imported"][0]["entry_id"]).data[CONF_TASKS].values()
    assert task["on_complete_action"]["configured_by"] == conn.user.id


async def test_ws_create_never_trusts_a_client_owner(hass: HomeAssistant) -> None:
    """The WS create path stamps the connection user over whatever the client
    sent — the one place a client could otherwise name the owner."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task

    entry = await _setup(hass)
    msg = {"type": f"{DOMAIN}/task/create", "entry_id": entry.entry_id, "name": "New", "interval_days": 7, "on_complete_action": {**_ACTION, "configured_by": "admin-id"}}
    conn = await _ws(hass, ws_create_task, msg)
    task_id = assert_ws_success(conn)["task_id"]
    assert _live(hass, entry.entry_id).data[CONF_TASKS][task_id]["on_complete_action"]["configured_by"] == conn.user.id


# ─── High 5: replace lineage survives a backup restore ───────────────────


async def test_a_replaced_pair_survives_a_json_backup_restore(hass: HomeAssistant) -> None:
    """Restoring a replaced pair (same name) onto a clean instance failed with
    ``already_configured`` for the active successor: its
    ``predecessor_entry_id`` still named the SOURCE instance's entry, so the
    replace exemption from the name rule missed."""
    from custom_components.maintenance_supporter.export import build_export_data
    from custom_components.maintenance_supporter.websocket.io import ws_import_json
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    entry = await _setup(hass)
    succ_id = assert_ws_success(await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": entry.entry_id, "name": "Washer"}))["entry_id"]
    backup = build_export_data(hass)
    # The successor first: the importer must order the predecessor before it.
    backup["objects"].sort(key=lambda o: o["object"].get("predecessor_entry_id") is None)
    for eid in (entry.entry_id, succ_id):
        await hass.config_entries.async_remove(eid)
    await hass.async_block_till_done()

    res = assert_ws_success(await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(backup)}))
    assert res["created"] == 2, res
    objs = {e.entry_id: e.data[CONF_OBJECT] for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID}
    (old_id,) = [eid for eid, o in objs.items() if o.get("archived_at")]
    (new_id,) = [eid for eid, o in objs.items() if not o.get("archived_at")]
    assert objs[new_id]["predecessor_entry_id"] == old_id
    assert objs[old_id]["replaced_by_entry_id"] == new_id


async def test_the_csv_keeps_a_replaced_pair_apart(hass: HomeAssistant) -> None:
    """The CSV grouped rows by object NAME: a replaced pair collapsed into one
    object and the archived predecessor's tasks came back active. Rows now
    group by the source entry, and the archive marker + lineage travel."""
    from custom_components.maintenance_supporter.helpers.csv_handler import export_objects_csv, import_objects_csv
    from custom_components.maintenance_supporter.websocket.io import ws_import_csv
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    entry = await _setup(hass)
    succ_id = assert_ws_success(await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": entry.entry_id}))["entry_id"]
    csv_text = export_objects_csv(hass)
    assert len(import_objects_csv(csv_text)) == 2
    for eid in (entry.entry_id, succ_id):
        await hass.config_entries.async_remove(eid)
    await hass.async_block_till_done()

    res = assert_ws_success(await _ws(hass, ws_import_csv, {"type": f"{DOMAIN}/csv/import", "csv_content": csv_text}))
    assert res["created"] == 2, res
    entries = [e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]
    (old,) = [e for e in entries if e.data[CONF_OBJECT].get("archived_at")]
    (new,) = [e for e in entries if not e.data[CONF_OBJECT].get("archived_at")]
    assert all(t.get("archived_at") for t in old.data[CONF_TASKS].values()), "the retired object's tasks came back active"
    assert not any(t.get("archived_at") for t in new.data[CONF_TASKS].values())
    assert new.data[CONF_OBJECT]["predecessor_entry_id"] == old.entry_id
    assert old.data[CONF_OBJECT]["replaced_by_entry_id"] == new.entry_id


def test_an_old_csv_without_the_id_column_still_groups_by_name() -> None:
    """Backward compatibility: a CSV written before the id column existed."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    parsed = import_objects_csv("object_name,task_name,interval_days\nPump,Oil,30\nPump,Seal,90\nShed,Paint,365\n")
    by_name = {o["object"]["name"]: o for o in parsed}
    assert set(by_name) == {"Pump", "Shed"}
    assert sorted(t["name"] for t in by_name["Pump"]["tasks"].values()) == ["Oil", "Seal"]


# ─── Medium 7: the CSV round trip keeps the nested schedule ──────────────


async def test_the_csv_round_trip_keeps_calendar_kinds_and_seasons(hass: HomeAssistant) -> None:
    """The CSV spoke only the flat recurrence: a day-of-month task came back
    as ``manual`` (never due) and a mowing season / series end were lost."""
    from custom_components.maintenance_supporter.helpers.csv_handler import export_objects_csv, import_objects_csv
    from custom_components.maintenance_supporter.helpers.schedule import normalize_task_storage

    monthly = {"kind": "day_of_month", "day": 1, "months": [10]}
    season = {"kind": "interval", "every": 7, "unit": "days", "season_months": [4, 5, 6, 7, 8, 9, 10]}
    await _setup(hass, schedule=monthly)
    entry = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID)
    tasks = dict(entry.data[CONF_TASKS])
    tasks[TASK] = {k: v for k, v in tasks[TASK].items() if k not in ("interval_days", "schedule_type")}
    mow = build_task_data(task_id="t2", object_id="washer", interval_days=None)
    mow.update({"name": "Mow", "schedule": season})
    mow.pop("schedule_type", None)
    tasks["t2"] = mow
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})

    parsed = import_objects_csv(export_objects_csv(hass))
    got = {t["name"]: normalize_task_storage(t)["schedule"] for t in parsed[0]["tasks"].values()}
    assert got["Change Filter"]["kind"] == "day_of_month"
    assert got["Change Filter"]["day"] == 1 and got["Change Filter"]["months"] == [10]
    assert got["Mow"]["kind"] == "interval" and got["Mow"]["every"] == 7
    assert got["Mow"]["season_months"] == [4, 5, 6, 7, 8, 9, 10]


def test_an_edited_flat_interval_cell_wins_over_the_schedule_column() -> None:
    """The flat cells stay authoritative for an interval edited in a
    spreadsheet — the schedule column only adds what they cannot express."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv
    from custom_components.maintenance_supporter.helpers.schedule import normalize_task_storage

    schedule = json.dumps({"kind": "interval", "every": 7, "unit": "days", "season_months": [5, 6]})
    csv_text = "object_name,task_name,schedule_type,interval_days,schedule\n" + f'Lawn,Mow,time_based,14,"{schedule.replace(chr(34), chr(34) * 2)}"\n'
    (obj,) = import_objects_csv(csv_text)
    (task,) = obj["tasks"].values()
    stored = normalize_task_storage(task)["schedule"]
    assert stored["every"] == 14
    assert stored["season_months"] == [5, 6]


# ─── Medium 8: Unicode-aware name rule, and renames obey it ──────────────


def test_the_name_key_is_unicode_aware() -> None:
    """Every non-Latin letter vanished from the ASCII slug the name rule
    compared, so "Кухня 2" and "Ванная 2" were the same name ("2")."""
    from custom_components.maintenance_supporter.helpers.object_names import name_key

    assert name_key("Кухня 2") != name_key("Ванная 2")
    assert name_key("洗碗机 1") != name_key("冰箱 1")
    assert name_key("Pool Pump") == name_key("pool-pump") == name_key("POOL  PUMP") == "pool_pump"
    assert name_key("Küche") == name_key("Kuche") == name_key("KÜCHE")
    assert name_key("Pool Pump") != name_key("Poolpump")
    assert name_key("🔥") != name_key("💧")


async def test_non_latin_names_no_longer_collide(hass: HomeAssistant) -> None:
    """The second non-Latin object was refused as a duplicate."""
    from custom_components.maintenance_supporter.helpers.object_names import name_taken, object_unique_id

    await _setup(hass, name="Ванная 2", uid="bath")
    assert not name_taken(hass, "Кухня 2")
    assert name_taken(hass, "ванная  2")
    assert object_unique_id(hass, "Кухня 2") is not None


async def test_object_update_refuses_a_rename_onto_a_taken_name(hass: HomeAssistant) -> None:
    """object/update renamed onto another object's name without any check;
    an unchanged name — also the successor sharing its archived
    predecessor's name — still saves."""
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object, ws_update_object

    washer = await _setup(hass)
    dryer = await _add_object(hass, name="Dryer", uid="dryer")
    msg = {"type": f"{DOMAIN}/object/update", "entry_id": dryer.entry_id}
    assert_ws_error(await _ws(hass, ws_update_object, {**msg, "name": "washer"}), "invalid_input")
    assert _live(hass, dryer.entry_id).data[CONF_OBJECT]["name"] == "Dryer"
    assert_ws_success(await _ws(hass, ws_update_object, {**msg, "name": "Dryer", "notes": "n"}))

    succ_id = assert_ws_success(await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": washer.entry_id}))["entry_id"]
    assert_ws_success(await _ws(hass, ws_update_object, {"type": f"{DOMAIN}/object/update", "entry_id": succ_id, "name": "Washer", "notes": "new unit"}))


async def test_options_object_settings_refuses_a_taken_name(hass: HomeAssistant) -> None:
    """The options flow's object settings renamed without the name rule."""
    await _setup(hass)
    dryer = await _add_object(hass, name="Dryer", uid="dryer")
    r = await hass.config_entries.options.async_init(dryer.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "object_settings"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"name": "Washer"})
    assert r["type"] == FlowResultType.FORM
    assert r["errors"] == {"name": "name_exists"}
    assert _live(hass, dryer.entry_id).data[CONF_OBJECT]["name"] == "Dryer"


# ─── Medium 10: the options edit no longer rolls a completion back ───────


async def test_an_options_edit_keeps_a_later_completion(hass: HomeAssistant, freezer: Any) -> None:
    """The edit form pre-filled last_performed from the static entry.data
    copy; after a completion (Store only) any unrelated save — a rename —
    submitted the stale date and rolled the anchor (and a postpone) back."""
    freezer.move_to("2026-09-27 12:00:00")
    entry = await _setup(hass)
    # 1) a last-performed date set once through the flow (lands in entry.data)
    r = await _open_edit_task(hass, entry)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {**_defaults(r["data_schema"]), "last_performed": "2026-09-05"})
    assert r["type"] == FlowResultType.MENU, r
    # 2) completed later — the Store moves, entry.data does not
    rd = _live(hass, entry.entry_id).runtime_data
    await rd.coordinator.complete_maintenance(TASK)
    assert rd.store.get_last_performed(TASK) == "2026-09-27"
    # 3) an unrelated rename through the flow
    r = await _open_edit_task(hass, entry)
    ui = _defaults(r["data_schema"])
    assert ui.get("last_performed") == "2026-09-27", "the form must pre-fill the live anchor"
    r = await hass.config_entries.options.async_configure(r["flow_id"], {**ui, "name": "Filter renamed"})
    assert r["type"] == FlowResultType.MENU, r
    assert _live(hass, entry.entry_id).runtime_data.store.get_last_performed(TASK) == "2026-09-27"


# ─── Medium 12: part pools — phase links, replace, duplicate, archive ────

_FILTER = {"p1": {"id": "p1", "name": "Filter cartridge"}}
_PHASES = {
    "phases": {"replace": {"name": "Replace", "consumes_parts": [{"part_id": "p1", "quantity": 1}]}, "clean": {"name": "Clean"}},
    "phase_sequence": ["replace", "clean"],
}


async def test_replace_moves_phase_links_to_the_successor_parts(hass: HomeAssistant) -> None:
    """The replace remap walked the task-level links only: a phase kept
    consuming the retired predecessor's part id — a broken-part-link repair
    on the successor's first completion."""
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    entry = await _setup(hass, parts=_FILTER, **_PHASES)
    _live(hass, entry.entry_id).runtime_data.store.set_part_stock("p1", 5)
    succ_id = assert_ws_success(await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": entry.entry_id}))["entry_id"]
    succ = _live(hass, succ_id)
    (new_pid,) = succ.data["parts"]
    tid, task = next(iter(succ.data[CONF_TASKS].items()))
    assert task["phases"]["replace"]["consumes_parts"] == [{"part_id": new_pid, "quantity": 1}]
    await succ.runtime_data.coordinator.complete_maintenance(tid)
    await hass.async_block_till_done()
    assert not any(i.startswith("broken_part_link") for i in _issues(hass))
    assert _live(hass, succ_id).runtime_data.store.get_part_stock(new_pid) == 4


async def test_an_owner_delete_hands_the_pool_to_a_phase_borrower(hass: HomeAssistant) -> None:
    """borrowers_of / borrowed_part_ids ignored phase-level links: deleting
    the owner handed the pool to nobody, the phase link dangled."""
    from custom_components.maintenance_supporter.websocket.objects import ws_delete_object

    owner = await _setup(hass, parts=_FILTER)
    _live(hass, owner.entry_id).runtime_data.store.set_part_stock("p1", 5)
    phases = {"replace": {"name": "Replace", "consumes_parts": [{"part_id": "p1", "quantity": 1, "entry_id": owner.entry_id}]}}
    spa = await _add_object(hass, name="Spa", uid="spa", task_id="b1", phases=phases, phase_sequence=["replace"])
    assert_ws_success(await _ws(hass, ws_delete_object, {"type": f"{DOMAIN}/object/delete", "entry_id": owner.entry_id}))
    b = _live(hass, spa.entry_id)
    assert "p1" in (b.data.get("parts") or {}), "the pool was not handed to the phase borrower"
    link = b.data[CONF_TASKS]["b1"]["phases"]["replace"]["consumes_parts"][0]
    assert link == {"part_id": "p1", "quantity": 1}
    assert b.runtime_data.store.get_part_stock("p1") == 5


async def test_replace_relinks_the_borrowers_to_the_successor_pool(hass: HomeAssistant) -> None:
    """Replacing a shared pool's owner moved the shelf (fresh ids) but left
    the borrowers on the archived predecessor — whose buy tasks the archive
    suppresses: two diverging pools, no reminder for the one in use."""
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    part = {"id": "p1", "name": "Chlorine tabs", "reorder_threshold": 2, "auto_buy_task": True}
    owner = await _setup(hass, name="Pool", uid="pool", parts={"p1": part})
    _live(hass, owner.entry_id).runtime_data.store.set_part_stock("p1", 4)
    spa = await _add_object(hass, name="Spa", uid="spa", task_id="b1", consumes_parts=[{"part_id": "p1", "quantity": 1, "entry_id": owner.entry_id}])
    succ_id = assert_ws_success(await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": owner.entry_id}))["entry_id"]
    succ = _live(hass, succ_id)
    (new_pid,) = succ.data["parts"]
    b = _live(hass, spa.entry_id)
    assert b.data[CONF_TASKS]["b1"]["consumes_parts"] == [{"part_id": new_pid, "quantity": 1, "entry_id": succ_id}]
    await b.runtime_data.coordinator.complete_maintenance("b1")
    await hass.async_block_till_done()
    assert _live(hass, succ_id).runtime_data.store.get_part_stock(new_pid) == 3


async def test_object_duplicate_carries_the_parts_shelf(hass: HomeAssistant) -> None:
    """object/duplicate copied the tasks' part links but not the parts: every
    completion of the copy raised a broken-part-link repair."""
    from custom_components.maintenance_supporter.websocket.objects import ws_duplicate_object

    entry = await _setup(hass, parts=_FILTER, consumes_parts=[{"part_id": "p1", "quantity": 1}], **_PHASES)
    _live(hass, entry.entry_id).runtime_data.store.set_part_stock("p1", 5)
    copy_id = assert_ws_success(await _ws(hass, ws_duplicate_object, {"type": f"{DOMAIN}/object/duplicate", "entry_id": entry.entry_id}))["entry_id"]
    copy = _live(hass, copy_id)
    (new_pid,) = copy.data["parts"]
    assert new_pid != "p1"
    tid, task = next(iter(copy.data[CONF_TASKS].items()))
    assert task["consumes_parts"] == [{"part_id": new_pid, "quantity": 1}]
    assert task["phases"]["replace"]["consumes_parts"] == [{"part_id": new_pid, "quantity": 1}]
    await copy.runtime_data.coordinator.complete_maintenance(tid)
    await hass.async_block_till_done()
    assert not any(i.startswith("broken_part_link") for i in _issues(hass))
    assert _live(hass, entry.entry_id).runtime_data.store.get_part_stock("p1") == 5, "the copy drew on the source's shelf"


async def test_archiving_a_pool_owner_keeps_its_buy_reminder_live(hass: HomeAssistant) -> None:
    """An archived (or paused) owner desired no buy tasks at all — also for a
    pool other live objects still draw on: they ran it empty without a
    single reminder."""
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks
    from custom_components.maintenance_supporter.websocket.objects import ws_archive_object

    part = {"id": "p1", "name": "Chlorine tabs", "reorder_threshold": 2, "auto_buy_task": True}
    owner = await _setup(hass, name="Pool", uid="pool", parts={"p1": part})
    await _add_object(hass, name="Spa", uid="spa", task_id="b1", consumes_parts=[{"part_id": "p1", "quantity": 1, "entry_id": owner.entry_id}])
    live = _live(hass, owner.entry_id)
    live.runtime_data.store.set_part_stock("p1", 1)
    await async_reconcile_buy_tasks(hass, live)
    await hass.async_block_till_done()
    buy = [tid for tid, t in _live(hass, owner.entry_id).data[CONF_TASKS].items() if t.get("part_ref")]
    assert len(buy) == 1

    assert_ws_success(await _ws(hass, ws_archive_object, {"type": f"{DOMAIN}/object/archive", "entry_id": owner.entry_id}))
    archived = _live(hass, owner.entry_id)
    assert archived.data[CONF_TASKS][buy[0]].get("archived_at") is None, "the shared pool's reminder was archived"
    assert archived.data[CONF_TASKS][TASK].get("archived_at") is not None
    await async_reconcile_buy_tasks(hass, archived)
    await hass.async_block_till_done()
    assert buy[0] in _live(hass, owner.entry_id).data[CONF_TASKS], "the reconcile removed the in-use pool's reminder"


async def test_a_json_restore_relinks_a_shared_pool(hass: HomeAssistant) -> None:
    """The import dropped every link into another object's pool unless the
    SOURCE entry still existed — a full restore lost all shared pools."""
    from custom_components.maintenance_supporter.export import build_export_data
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    owner = await _setup(hass, name="Pool", uid="pool", parts={"p1": {"id": "p1", "name": "Tabs"}})
    spa = await _add_object(hass, name="Spa", uid="spa", task_id="b1", consumes_parts=[{"part_id": "p1", "quantity": 1, "entry_id": owner.entry_id}])
    backup = build_export_data(hass)
    backup["objects"].sort(key=lambda o: o["object"]["name"] != "Spa")  # borrower first
    for eid in (owner.entry_id, spa.entry_id):
        await hass.config_entries.async_remove(eid)
    await hass.async_block_till_done()

    res = assert_ws_success(await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(backup)}))
    assert res["created"] == 2
    ids = {i["name"]: i["entry_id"] for i in res["imported"]}
    new_owner = _live(hass, ids["Pool"])
    (new_pid,) = new_owner.data["parts"]
    (task,) = _live(hass, ids["Spa"]).data[CONF_TASKS].values()
    assert task["consumes_parts"] == [{"part_id": new_pid, "quantity": 1, "entry_id": ids["Pool"]}]


# ─── Medium 13 (backend): unattached completion photos ───────────────────


async def test_discard_upload_removes_only_an_unattached_photo(hass: HomeAssistant) -> None:
    """A non-writer could upload a completion photo but not delete it again
    (documents/delete is write-gated): every cancelled dialog left an orphan
    counting against the object's document cap. The read-tier discard
    removes exactly such a photo — and answers not_found for anything else."""
    from custom_components.maintenance_supporter.websocket.documents import ws_documents_discard_upload

    g = _global(hass)
    washer = _object(hass)
    shed = _object(hass, name="Shed", uid="shed", task_id="s1")
    await setup_integration(hass, g, washer, shed)
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    mine = await _photo(hass, "washer", content=b"a")
    foreign = await _photo(hass, "shed", content=b"b")
    manual = await _photo(hass, "washer", tags=["manual"], content=b"c")
    recorded = await _photo(hass, "washer", content=b"d")
    await _live(hass, washer.entry_id).runtime_data.coordinator.complete_maintenance(TASK, photo_doc_ids=[recorded])
    await hass.async_block_till_done()

    async def _discard(doc_id: str) -> Any:
        conn = make_ws_connection()
        conn.user.is_admin = False  # read tier: any household member
        await call_ws_handler(ws_documents_discard_upload, hass, conn, {"id": 1, "type": f"{DOMAIN}/documents/discard_upload", "entry_id": washer.entry_id, "doc_id": doc_id})
        return conn

    for doc_id in (foreign, manual, recorded, "no-such-doc"):
        assert_ws_error(await _discard(doc_id), "not_found")
        if doc_id != "no-such-doc":
            assert docs.get(doc_id) is not None, doc_id
    assert assert_ws_success(await _discard(mine)) == {"success": True}
    assert docs.get(mine) is None


async def test_the_retention_sweep_clears_stale_unattached_photos(hass: HomeAssistant, freezer: Any) -> None:
    """Orphaned completion photos stayed forever; the daily sweep now removes
    those older than 24 h — never one that is part of a record."""
    from custom_components.maintenance_supporter.helpers.retention import async_run_retention_sweep

    freezer.move_to("2026-09-27 12:00:00")
    entry = await _setup(hass)
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    stale = await _photo(hass, "washer", content=b"a")
    recorded = await _photo(hass, "washer", content=b"b")
    await _live(hass, entry.entry_id).runtime_data.coordinator.complete_maintenance(TASK, photo_doc_ids=[recorded])
    freezer.move_to("2026-09-28 13:00:00")
    fresh = await _photo(hass, "washer", content=b"c")
    await async_run_retention_sweep(hass)
    assert docs.get(stale) is None
    assert docs.get(recorded) is not None
    assert docs.get(fresh) is not None


async def test_a_non_writer_may_keep_only_twenty_unattached_photos(
    hass: HomeAssistant, hass_client: Any, hass_read_only_access_token: str
) -> None:
    """Non-writers may upload photos to any object; without a bound a client
    could fill an object's 100 document slots with orphans."""
    from aiohttp import FormData

    from custom_components.maintenance_supporter.helpers.completion_requirements import MAX_UNATTACHED_PHOTOS_PER_OBJECT
    from custom_components.maintenance_supporter.views import UPLOAD_URL

    entry = await _setup(hass)
    for n in range(MAX_UNATTACHED_PHOTOS_PER_OBJECT):
        await _photo(hass, "washer", content=f"img-{n}".encode())
    client = await hass_client(hass_read_only_access_token)
    form = FormData()
    form.add_field("entry_id", entry.entry_id)
    form.add_field("tags", "photo")
    form.add_field("file", b"\xff\xd8\xff", filename="p.jpg", content_type="image/jpeg")
    resp = await client.post(UPLOAD_URL, data=form)
    assert resp.status == 409, await resp.text()


# ─── Low: history edit / delete, duplicate, add_object, import stamps ────


async def test_a_history_edit_moves_no_stock_for_a_vanished_entry(hass: HomeAssistant) -> None:
    """The parts delta was applied (stock moved and saved — an await) before
    the entry was looked up again: a history/delete landing in that await
    made the edit answer not_found AFTER the stock had already changed. The
    entry is now written before the first await, so a moved stock always
    belongs to an applied edit."""
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_update_history_entry

    entry = await _setup(hass, parts=_FILTER)
    rd = _live(hass, entry.entry_id).runtime_data
    rd.store.set_part_stock("p1", 5)
    stamp = "2026-09-20T10:00:00+00:00"
    rd.store.set_history(TASK, [{"timestamp": stamp, "type": "completed", "used_parts": [{"part_id": "p1", "name": "Filter cartridge", "quantity": 1}]}])
    real_save = rd.store.async_save
    deleted = {"done": False}

    async def _save_while_a_delete_lands() -> None:
        # The first Store save is the first await of the edit: a concurrent
        # history/delete of the same entry lands exactly there.
        if not deleted["done"]:
            deleted["done"] = True
            rd.store.set_history(TASK, [h for h in rd.store.get_history(TASK) if h.get("timestamp") != stamp])
        await real_save()

    msg = {"type": f"{DOMAIN}/task/history/update", "entry_id": entry.entry_id, "task_id": TASK, "original_timestamp": stamp, "used_parts": [{"part_id": "p1", "quantity": 3}]}
    with patch.object(rd.store, "async_save", _save_while_a_delete_lands):
        conn = await _ws(hass, ws_update_history_entry, msg)
    stock = rd.store.get_part_stock("p1")
    # Never both: the stock moved AND the edit was refused as not_found.
    assert not (conn.send_error.called and stock != 5), (conn.send_error.call_args, stock)
    assert_ws_success(conn)
    assert stock == 3


async def test_deleting_the_latest_completion_rewinds_the_phase_cursor(hass: HomeAssistant) -> None:
    """The delete re-derived the anchor but left the cursor advanced: the
    phase whose completion was just un-done was skipped for good."""
    from custom_components.maintenance_supporter.websocket.tasks_history import ws_delete_history_entry

    entry = await _setup(hass, phases={"flip": {"name": "Flip"}, "replace": {"name": "Replace"}}, phase_sequence=["flip", "replace"])
    rd = _live(hass, entry.entry_id).runtime_data
    await rd.coordinator.complete_maintenance(TASK)
    assert rd.store.get_task_state(TASK).get("phase_cursor") == 1
    stamp = rd.store.get_history(TASK)[-1]["timestamp"]
    assert_ws_success(await _ws(hass, ws_delete_history_entry, {"type": f"{DOMAIN}/task/history/delete", "entry_id": entry.entry_id, "task_id": TASK, "timestamp": stamp}))
    assert rd.store.get_task_state(TASK).get("phase_cursor") == 0


async def test_task_duplicate_refuses_a_buy_task_and_the_fleet_task(hass: HomeAssistant) -> None:
    """task/duplicate copied part_ref (a second reminder for one low episode)
    and the battery-fleet flag (a second fleet task) — task/move refuses
    both, duplicate now too."""
    from custom_components.maintenance_supporter.const import BATTERY_FLEET_TASK_FLAG
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_duplicate_task

    g = _global(hass)
    buy = _object(hass, name="Shelf", uid="shelf", part_ref={"part_id": "p1"})
    fleet = _object(hass, name="Batteries", uid="batteries", **{BATTERY_FLEET_TASK_FLAG: True})
    await setup_integration(hass, g, buy, fleet)
    for entry in (buy, fleet):
        conn = await _ws(hass, ws_duplicate_task, {"type": f"{DOMAIN}/task/duplicate", "entry_id": entry.entry_id, "task_id": TASK})
        assert_ws_error(conn, "invalid_input")
        assert len(_live(hass, entry.entry_id).data[CONF_TASKS]) == 1


async def test_add_object_refuses_a_malformed_date(hass: HomeAssistant) -> None:
    """The add_object service stored any string as installation / warranty
    date (the WS path validated them)."""
    from custom_components.maintenance_supporter.websocket.objects import async_create_object

    await setup_integration(hass, _global(hass))
    with pytest.raises(ValueError, match="installation_date"):
        await async_create_object(hass, name="Heat pump", installation_date="next spring")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "add_object", {"name": "Heat pump", "warranty_expiry": "2030-13-45"}, blocking=True)
    entry_id = await async_create_object(hass, name="Heat pump", installation_date="2026-09-01")
    assert _live(hass, entry_id).data[CONF_OBJECT]["installation_date"] == "2026-09-01"


async def test_json_import_repairs_history_timestamps(hass: HomeAssistant) -> None:
    """A numeric (epoch) or junk history timestamp was imported verbatim, and
    the next completion raised TypeError comparing it."""
    from custom_components.maintenance_supporter.websocket.io import _sanitize_history, ws_import_json

    cleaned = _sanitize_history(
        [{"type": "completed", "timestamp": 1695000000, "cost": 5}, {"type": "completed", "timestamp": "yesterday"}, {"type": "completed", "timestamp": [1]}]
    )
    assert len(cleaned) == 1 and cleaned[0]["timestamp"].startswith("2023-09-18T")
    # An absent timestamp is left alone (readers treat it as "").
    assert _sanitize_history([{"type": "completed"}]) == [{"type": "completed"}]

    await setup_integration(hass, _global(hass))
    payload = {"objects": [{"object": {"name": "Imported"}, "tasks": [{"name": "T", "interval_days": 7, "history": [{"type": "completed", "timestamp": 1695000000}]}]}]}
    res = assert_ws_success(await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)}))
    new = _live(hass, res["imported"][0]["entry_id"])
    (task_id,) = new.data[CONF_TASKS]
    await new.runtime_data.coordinator.complete_maintenance(task_id)
    history = _live(hass, new.entry_id).runtime_data.store.get_history(task_id)
    assert all(isinstance(h["timestamp"], str) for h in history)
    assert len([h for h in history if h["type"] == "completed"]) == 2
