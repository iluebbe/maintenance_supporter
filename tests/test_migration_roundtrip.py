"""Moving to another Home Assistant, end to end (round-trip audit 2026-09-29).

Seed a rich instance → export everything the settings page offers (objects
JSON with history, settings JSON, documents archive) → wipe the instance the
way a new one looks (no objects, no documents, default settings, the people
re-created under NEW user ids) → import in the order a person would → compare
EVERY stored key before and after.

There is no curated field list: ids are translated to names and the whole
storage is diffed, so a key added anywhere later is compared automatically.
What deliberately does not travel is named below, each with its reason. The
curated ``test_export_roundtrip`` fixtures seed the tasks, so a field added
there is exercised here too; ``e2e/migration-roundtrip.mjs`` is the Docker
twin that moves between two real instances.
"""

from __future__ import annotations

import io
import json
import re
import zipfile
from pathlib import Path
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_GROUPS,
    CONF_SAVED_FILTER_VIEWS,
    CONF_TASKS,
    CONF_VACATION_EXEMPT_TASK_IDS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    STORES_CACHE_KEY,
)
from custom_components.maintenance_supporter.helpers import doc_archive
from custom_components.maintenance_supporter.helpers.global_options import get_global_options
from custom_components.maintenance_supporter.storage import legacy_runtime_to_trigger_state
from custom_components.maintenance_supporter.websocket.io import (
    ws_export_data,
    ws_export_settings,
    ws_import_json,
)

from .conftest import (
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)
from .test_export_roundtrip import FULL_OBJECT, FULL_PART, FULL_TASK, _full_trigger_config, _make_fleet_entry

ROOT = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter"

# What a move deliberately does not carry — shared with the Docker twin.
_EXPECT = json.loads((Path(__file__).resolve().parent / "fixtures" / "migration_expectations.json").read_text("utf-8"))
PORTABLE_STATE: set[str] = set(_EXPECT["portable_state"])
RUNTIME_ONLY: dict[str, str] = _EXPECT["runtime_only_state"]
EXPECTED_DIFFS: dict[str, str] = _EXPECT["expected_diffs"]
NON_PORTABLE_OPTIONS: set[str] = set(_EXPECT["non_portable_options"])

# The recurrences FULL_TASK (an interval task) cannot show.
ONE_TIME_TASK = {"name": "Chimney sweep", "type": "inspection", "schedule_type": "one_time", "due_date": "2026-11-20"}
CALENDAR_TASK = {
    "name": "Put the bins out",
    "type": "cleaning",
    "schedule": {"kind": "nth_weekday", "nth": 1, "weekday": 5, "season_months": [4, 5, 6, 7, 8, 9], "ends": {"count": 24}},
}

GROUP_ID = "grp_weekly"
VIEW_ID = "view_alice"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, title="Maintenance Supporter", data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


# ─── seeding ────────────────────────────────────────────────────────────────


async def _seed(hass: HomeAssistant, global_entry: MockConfigEntry) -> dict[str, Any]:
    """Every kind of data a person builds up, through the storage the running
    integration reads (the curated round-trip fixtures + what they lack)."""
    from custom_components.maintenance_supporter.helpers.parts import normalize_part
    alice = await hass.auth.async_create_user("Alice")
    bob = await hass.auth.async_create_user("Bob")
    # Two batteries the fleet sees; the garage remote at 35 % is above "low"
    # (20 %) but below "recovered" (50 %) — only its latch keeps it listed.
    for entity_id, level in (("sensor.hall_smoke_battery", "80"), ("sensor.garage_remote_battery", "35")):
        hass.states.async_set(entity_id, level, {"device_class": "battery", "unit_of_measurement": "%"})

    task = dict(build_task_data(task_id="rig_task"), **FULL_TASK, trigger_config=_full_trigger_config())
    task["object_id"] = "rig_obj"
    task["created_at"] = "2026-01-15"
    task["responsible_user_id"] = alice.id
    task["assignee_pool"] = [alice.id, bob.id]
    task["rotation_strategy"] = "round_robin"
    task["history"] = [{**FULL_TASK["history"][0], "completed_by": alice.id}]
    rig_data = build_object_entry_data(tasks={task["id"]: task})
    rig_data = {
        **rig_data,
        "object": {**rig_data["object"], **FULL_OBJECT, "id": "rig_obj"},
        "parts": {"part_a": normalize_part({**FULL_PART, "auto_buy_task": True})},
    }
    rig = MockConfigEntry(domain=DOMAIN, title=FULL_OBJECT["name"], data=rig_data, unique_id="maintenance_supporter_migration_rig")
    rig.add_to_hass(hass)

    kitchen_task = {**build_task_data(task_id="kitchen_task", name="Descale"), "object_id": "kitchen_obj", "created_at": "2026-02-01"}
    one_time = {**build_task_data(task_id="once_task"), **ONE_TIME_TASK, "object_id": "kitchen_obj", "created_at": "2026-03-01"}
    calendar = {**build_task_data(task_id="bins_task"), **CALENDAR_TASK, "object_id": "kitchen_obj", "created_at": "2026-03-02"}
    for flat in ("schedule_type", "interval_days", "interval_unit", "interval_anchor"):
        calendar.pop(flat, None)
    one_time.pop("interval_days", None)
    kitchen_data = build_object_entry_data(tasks={"kitchen_task": kitchen_task, "once_task": one_time, "bins_task": calendar})
    kitchen_data = {**kitchen_data, "object": {**kitchen_data["object"], "id": "kitchen_obj", "name": "Küche: Spülmaschine"}}
    kitchen = MockConfigEntry(domain=DOMAIN, title="Küche", data=kitchen_data, unique_id="maintenance_supporter_migration_kitchen")
    kitchen.add_to_hass(hass)

    fleet = await _make_fleet_entry(hass)
    await setup_integration(hass, global_entry, rig, kitchen, fleet)

    rig_store = hass.data[STORES_CACHE_KEY][rig.entry_id]
    rig_store.set_part_stock("part_a", 1)  # below the threshold → a buy task
    rig_store.set_checklist_progress(task["id"], {"step1": True})
    await rig_store.async_save()
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks

    await async_reconcile_buy_tasks(hass, hass.config_entries.async_get_entry(rig.entry_id))
    await hass.async_block_till_done()

    fleet_store = hass.data[STORES_CACHE_KEY][fleet.entry_id]
    fleet_task_id = next(iter(fleet.data[CONF_TASKS]))
    fleet_store.update_task_state(
        fleet_task_id,
        battery_replacements={
            "sensor.hall_smoke_battery": {"type": "9V", "model": "Acme|S1", "dates": ["2024-11-10", "2025-10-02"], "anchored": True}
        },
        battery_low_latch={"sensor.garage_remote_battery": {"at": "2026-09-20T08:00:00+00:00", "last_replaced": "2025-09-04"}},
    )
    await fleet_store.async_save()

    # Documents: a manual linked to the task (with a page), a completion
    # photo on the history entry, a web link — and one on the other object.
    from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY

    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    rig_obj_id = "rig_obj"
    manual = await docs.async_add_file(rig_obj_id, content=b"%PDF-1.4 manual", filename="manual.pdf", mime="application/pdf", tags=["manual"])
    await docs.async_update(manual["id"], task_ids=[task["id"]], task_pages={task["id"]: 12}, part_ids=["part_a"])
    photo = await docs.async_add_file(rig_obj_id, content=b"\xff\xd8\xff photo", filename="IMG_0001.jpg", mime="image/jpeg", tags=["photo"])
    await docs.async_add_weblink(rig_obj_id, url="https://example.org/service", title="Service schedule", tags=["other"])
    await docs.async_add_file("kitchen_obj", content=b"%PDF-1.4 warranty", filename="Garantie.pdf", mime="application/pdf", tags=["warranty"])
    history = list(rig_store.get_history(task["id"]))
    history[0] = {**history[0], "photo_doc_ids": [photo["id"]]}
    rig_store.set_history(task["id"], history)
    await rig_store.async_save()

    # Global settings: a group over both objects, a view on Alice, a
    # vacation exemption, a couple of scalars.
    options = dict(global_entry.options)
    options.update(
        {
            CONF_GROUPS: {
                GROUP_ID: {
                    "name": "Weekly round",
                    "description": "",
                    "task_refs": [
                        {"entry_id": rig.entry_id, "task_id": task["id"]},
                        {"entry_id": kitchen.entry_id, "task_id": "kitchen_task"},
                    ],
                }
            },
            CONF_SAVED_FILTER_VIEWS: [
                {
                    "id": VIEW_ID,
                    "name": "Alice's",
                    "filters": {
                        "status": "", "user_id": alice.id, "label": None, "priority": "", "archived": False,
                        "sort_mode": "due_date", "group_by": "none",
                    },
                }
            ],
            CONF_VACATION_EXEMPT_TASK_IDS: ["kitchen_task"],
            "default_warning_days": 9,
            "budget_monthly": 42.0,
        }
    )
    hass.config_entries.async_update_entry(global_entry, options=options)
    await hass.async_block_till_done()
    return {"alice": alice, "bob": bob, "task_id": task["id"]}


# ─── snapshot: the whole storage, ids translated to names ───────────────────

_ENTRY_KEYS = {"entry_id", "parent_entry_id", "predecessor_entry_id", "replaced_by_entry_id"}
_TASK_LIST_KEYS = {"task_ids", CONF_VACATION_EXEMPT_TASK_IDS}
_USER_KEYS = {"responsible_user_id", "completed_by", "user_id"}


async def _snapshot(hass: HomeAssistant) -> tuple[dict[str, Any], set[str]]:
    """(the storage with ids translated to names, Store task-state keys seen)."""
    from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY

    users = {u.id: u.name for u in await hass.auth.async_get_users()}
    entries = [e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]
    entry_name = {e.entry_id: e.data["object"]["name"] for e in entries}
    object_name = {e.data["object"].get("id"): e.data["object"]["name"] for e in entries}
    task_name = {tid: f"{e.data['object']['name']}/{t.get('name')}" for e in entries for tid, t in e.data.get(CONF_TASKS, {}).items()}
    part_name = {pid: f"{e.data['object']['name']}/{p.get('name')}" for e in entries for pid, p in (e.data.get("parts") or {}).items()}
    doc_store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc_name = {did: f"{object_name.get(d.get('object_id'))}/{d.get('kind')}:{d.get('title')}" for did, d in doc_store.documents.items()}

    def tr(value: Any, key: str | None = None) -> Any:
        if isinstance(value, dict):
            if key == "task_pages":
                return {task_name.get(k, f"?{k}"): v for k, v in value.items()}
            # Absent, None, empty and the model default mean the same thing
            # to every reader; only a difference in meaning counts.
            return {
                k: tr(v, k)
                for k, v in value.items()
                if v not in (None, "", [], {}) and not (k == "priority" and v == "normal")
            }
        if isinstance(value, list):
            if key in _TASK_LIST_KEYS:
                return sorted(task_name.get(x, f"?{x}") for x in value)
            if key == "assignee_pool":
                return [users.get(x, f"?{x}") for x in value]
            if key == "photo_doc_ids":
                return [doc_name.get(x, f"?{x}") for x in value]
            if key == "part_ids":
                return sorted(part_name.get(x, f"?{x}") for x in value)
            return [tr(v, key) for v in value]
        if not isinstance(value, str):
            return value
        if key in _ENTRY_KEYS:
            return entry_name.get(value, f"?{value}")
        if key == "object_id":
            return object_name.get(value, f"?{value}")
        if key == "task_id":
            return task_name.get(value, f"?{value}")
        if key == "part_id":
            return part_name.get(value, f"?{value}")
        if key == "doc_id":
            return doc_name.get(value, f"?{value}")
        if key in _USER_KEYS:
            return users.get(value, f"?{value}")
        return value

    seen_state: set[str] = set()
    objects: dict[str, Any] = {}
    for e in entries:
        store = e.runtime_data.store
        obj = {k: v for k, v in e.data["object"].items() if k != "id"}
        rec: dict[str, Any] = {
            "object": tr(obj),
            "data": tr({k: v for k, v in e.data.items() if k not in ("object", CONF_TASKS, "parts")}),
            "options": tr(dict(e.options)),
            "tasks": {},
            "parts": {},
        }
        for tid, t in e.data.get(CONF_TASKS, {}).items():
            state = dict(store.get_task_state(tid))
            seen_state |= set(state)
            # The counters are the same whether still in the pre-Store flat
            # shape or already per entity — compare what the trigger restores.
            legacy = state.pop("trigger_runtime_legacy", None)
            if legacy and not state.get("trigger_runtime") and t.get("trigger_config"):
                state["trigger_runtime"] = legacy_runtime_to_trigger_state(t["trigger_config"], legacy)
            portable = {k: v for k, v in state.items() if k not in RUNTIME_ONLY}
            rec["tasks"][t["name"]] = tr({**{k: v for k, v in t.items() if k != "id"}, "_state": portable})
        for pid, p in (e.data.get("parts") or {}).items():
            rec["parts"][p["name"]] = tr({**{k: v for k, v in p.items() if k != "id"}, "_stock": store.get_part_stock(pid)})
        objects[e.data["object"]["name"]] = rec

    documents: dict[str, Any] = {}
    for did, d in doc_store.documents.items():
        rec = tr({k: v for k, v in d.items() if k != "id"})
        if d.get("kind") == "file":
            rec["_blob_on_disk"] = doc_store.blob_path(d["hash"]).is_file()
        documents[doc_name[did]] = rec

    options = {k: v for k, v in get_global_options(hass).items() if k not in NON_PORTABLE_OPTIONS}
    groups = options.get(CONF_GROUPS) or {}
    options[CONF_GROUPS] = {
        gid: {**g, "task_refs": sorted(f"{entry_name.get(r['entry_id'], '?')}|{task_name.get(r['task_id'], '?')}" for r in g.get("task_refs") or [])}
        for gid, g in groups.items()
    }
    return {"objects": objects, "documents": documents, "settings": tr(options)}, seen_state


def _diff(a: Any, b: Any, path: str, out: list[str]) -> list[str]:
    if isinstance(a, dict) and isinstance(b, dict):
        for k in sorted(set(a) | set(b), key=str):
            if k not in b:
                out.append(f"LOST    {path}.{k} = {json.dumps(a[k], ensure_ascii=False, default=str)[:160]}")
            elif k not in a:
                out.append(f"ADDED   {path}.{k} = {json.dumps(b[k], ensure_ascii=False, default=str)[:160]}")
            else:
                _diff(a[k], b[k], f"{path}.{k}", out)
    elif isinstance(a, list) and isinstance(b, list) and len(a) == len(b):
        for i, (x, y) in enumerate(zip(a, b, strict=True)):
            _diff(x, y, f"{path}[{i}]", out)
    elif a != b:
        out.append(f"CHANGED {path}: {json.dumps(a, ensure_ascii=False, default=str)[:160]} -> {json.dumps(b, ensure_ascii=False, default=str)[:160]}")
    return out


# ─── the move ───────────────────────────────────────────────────────────────


async def _export_all(hass: HomeAssistant) -> tuple[str, str, bytes]:
    conn = make_ws_connection()
    await call_ws_handler(ws_export_data, hass, conn, {"id": 1, "type": "x", "format": "json", "include_history": True})
    objects_json = conn.send_result.call_args[0][1]["data"]
    conn = make_ws_connection()
    await call_ws_handler(ws_export_settings, hass, conn, {"id": 2, "type": "x"})
    settings_json = conn.send_result.call_args[0][1]["data"]
    archive = await hass.async_add_executor_job(doc_archive.build_documents_archive, hass, None)
    return objects_json, settings_json, archive


async def _wipe_to_a_new_instance(hass: HomeAssistant, global_entry: MockConfigEntry, people: dict[str, Any]) -> None:
    """No objects, no documents, default settings; Alice and Bob exist again
    under new user ids, as they would on another Home Assistant."""
    for e in [e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]:
        await hass.config_entries.async_remove(e.entry_id)
    await hass.async_block_till_done()
    hass.config_entries.async_update_entry(global_entry, options={})
    for key in ("alice", "bob"):
        await hass.auth.async_remove_user(people[key])
        await hass.auth.async_create_user(people[key].name)
    await hass.async_block_till_done()


async def _import_json(hass: HomeAssistant, content: str) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 3, "type": "x", "json_content": content})
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()
    return conn.send_result.call_args[0][1]


@pytest.mark.parametrize("settings_first", [True, False], ids=["settings-then-objects", "objects-then-settings"])
async def test_a_move_to_another_instance_keeps_everything(
    hass: HomeAssistant, global_entry: MockConfigEntry, settings_first: bool
) -> None:
    people = await _seed(hass, global_entry)
    before, seen_state = await _snapshot(hass)
    objects_json, settings_json, archive = await _export_all(hass)

    await _wipe_to_a_new_instance(hass, global_entry, people)
    assert not [e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]

    results = []
    for content in ([settings_json, objects_json] if settings_first else [objects_json, settings_json]):
        results.append(await _import_json(hass, content))
    restored = await doc_archive.import_documents_archive(hass, archive)
    assert "error" not in restored, restored
    await hass.async_block_till_done()
    assert not any(r.get("unmatched_users") for r in results), results

    after, _ = await _snapshot(hass)
    diffs = _diff(before, after, "", [])
    unexpected = [d for d in diffs if not any(k in d for k in EXPECTED_DIFFS)]
    assert not unexpected, "a move lost or changed:\n" + "\n".join(unexpected)
    # The seed really exercised the Store keys a move must carry.
    assert {"history", "checklist_progress", "battery_replacements", "battery_low_latch"} <= seen_state, seen_state


# ─── tripwires: new fields and Store keys cannot slip past the move ────────


def _ws_schema_keys(fn: Any) -> set[str]:
    import voluptuous as vol

    schema = getattr(fn, "_ws_schema", None)
    raw = schema.schema if isinstance(schema, vol.Schema) else (schema or {})
    return {k.schema if isinstance(k, vol.Marker) else k for k in raw} - {"type", "id", "entry_id", "task_id", "dry_run"}


def test_the_seed_carries_every_task_field_the_panel_can_write() -> None:
    """A field the task dialog can store but the seed lacks would never be
    compared — so the seed must name every one (task_type is the WS alias
    of ``type``)."""
    from custom_components.maintenance_supporter.websocket import tasks_crud

    writable = _ws_schema_keys(tasks_crud.ws_create_task) | _ws_schema_keys(tasks_crud.ws_update_task)
    seeded = set(FULL_TASK) | set(ONE_TIME_TASK) | set(CALENDAR_TASK) | {
        "trigger_config", "responsible_user_id", "assignee_pool", "rotation_strategy", "name", "type", "enabled", "warning_days",
    }
    aliases = {"task_type"}
    missing = sorted(writable - seeded - aliases)
    assert not missing, f"add these task fields to FULL_TASK (test_export_roundtrip) so a move compares them: {missing}"


def _string_constants() -> dict[str, str]:
    consts: dict[str, str] = {}
    for p in ROOT.rglob("*.py"):
        for name, value in re.findall(r'^([A-Z][A-Z0-9_]+)\s*=\s*"([^"]+)"', p.read_text("utf-8"), re.M):
            consts.setdefault(name, value)
    return consts


def test_every_store_key_is_either_moved_or_named_as_runtime() -> None:
    """A new key in a task's Store state must be decided: travel with a move
    (export + import, then it is compared above) or stay behind with a
    reason in RUNTIME_ONLY."""
    consts = _string_constants()
    keys: set[str] = set()
    for p in ROOT.rglob("*.py"):
        text = p.read_text("utf-8")
        for args in re.findall(r"update_task_state\(([^)]*)\)", text):
            keys |= set(re.findall(r"\b([a-z_]+)=", args))
            keys |= {consts.get(c, c) for c in re.findall(r"\*\*\{([A-Z_]+):", args)}
    storage = (ROOT / "storage.py").read_text("utf-8")
    keys |= set(re.findall(r'state\["([a-z_]+)"\]\s*=', storage))
    keys |= set(re.findall(r'_ensure_task\([^)]*\)\["([a-z_]+)"\]', storage))
    unclassified = sorted(keys - PORTABLE_STATE - set(RUNTIME_ONLY))
    assert not unclassified, f"Store keys a move neither carries nor names as runtime-only: {unclassified}"


def test_the_non_portable_options_match_the_export() -> None:
    """The shared expectations and the exporter agree on what stays behind."""
    from custom_components.maintenance_supporter.export import _NON_PORTABLE_SETTINGS

    assert set(_NON_PORTABLE_SETTINGS) == NON_PORTABLE_OPTIONS


def test_the_split_only_fields_name_the_fleet_keys() -> None:
    """storage keeps the fleet keys as literals (no helper imports there)."""
    from custom_components.maintenance_supporter.helpers.battery_fleet import LOW_LATCH_KEY
    from custom_components.maintenance_supporter.helpers.battery_lifetime import REPLACEMENT_LOG_KEY
    from custom_components.maintenance_supporter.storage import _SPLIT_ONLY_TASK_FIELDS

    assert {REPLACEMENT_LOG_KEY, LOW_LATCH_KEY} <= set(_SPLIT_ONLY_TASK_FIELDS)


# ─── the moves that cannot be exact, said out loud ─────────────────────────


async def test_people_missing_here_are_named_and_their_assignments_cleared(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    people = await _seed(hass, global_entry)
    objects_json, _settings, _archive = await _export_all(hass)
    await _wipe_to_a_new_instance(hass, global_entry, people)
    # Bob is not on the new instance.
    bob_again = next(u for u in await hass.auth.async_get_users() if u.name == "Bob")
    await hass.auth.async_remove_user(bob_again)

    result = await _import_json(hass, objects_json)
    assert result["unmatched_users"] == ["Bob"]
    rig = next(e for e in hass.config_entries.async_entries(DOMAIN) if (e.data.get("object") or {}).get("name") == FULL_OBJECT["name"])
    task = next(t for t in rig.data[CONF_TASKS].values() if t["name"] == FULL_TASK["name"])
    alice_here = next(u for u in await hass.auth.async_get_users() if u.name == "Alice")
    assert task["responsible_user_id"] == alice_here.id
    # A rotation of one is no rotation (the boot-time sweep's rule).
    assert not task.get("assignee_pool")


async def test_the_documents_archive_is_browsable(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Version 2: one folder per object, completion photos in the task's
    folder named by the day done, other files by category, links as text."""
    await _seed(hass, global_entry)
    _objects, _settings, archive = await _export_all(hass)
    with zipfile.ZipFile(io.BytesIO(archive)) as zf:
        names = set(zf.namelist())
        manifest = json.loads(zf.read(doc_archive.MANIFEST_NAME))
        links = zf.read(f"{FULL_OBJECT['name']}/Links.txt").decode("utf-8")
    rig = FULL_OBJECT["name"]
    day = FULL_TASK["history"][0]["timestamp"][:10]
    assert {
        "README.txt",
        "manifest.json",
        f"{rig}/Manuals/manual.pdf",
        f"{rig}/{FULL_TASK['name']}/{day} IMG_0001.jpg",
        f"{rig}/Links.txt",
        "Küche Spülmaschine/Warranty/Garantie.pdf",
    } <= names, sorted(names)
    assert not any(n.startswith(doc_archive.BLOB_DIR) for n in names)
    assert "https://example.org/service" in links
    assert manifest["version"] == doc_archive.ARCHIVE_VERSION == 2


async def test_a_version_1_archive_still_restores(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Archives made before the readable layout keep restoring."""
    import hashlib

    await _seed(hass, global_entry)
    _objects, _settings, v2 = await _export_all(hass)
    with zipfile.ZipFile(io.BytesIO(v2)) as zf:
        manifest = json.loads(zf.read(doc_archive.MANIFEST_NAME))
        files = {d["hash"]: zf.read(d["path"]) for o in manifest["objects"] for d in o["documents"] if d.get("path")}
    for o in manifest["objects"]:
        o.pop("folder", None)
        for d in o["documents"]:
            d.pop("path", None)
    manifest["version"] = 1
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr(doc_archive.MANIFEST_NAME, json.dumps(manifest))
        for digest, content in files.items():
            assert hashlib.sha256(content).hexdigest() == digest
            zf.writestr(f"{doc_archive.BLOB_DIR}{digest}", content)

    from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY

    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    for digest in files:
        docs.blob_path(digest).unlink()
    result = await doc_archive.import_documents_archive(hass, buf.getvalue())
    assert result["blobs_written"] == len(files), result
    assert all(docs.blob_path(d).is_file() for d in files)


# ─── the edges of the mapping ──────────────────────────────────────────────


async def test_a_copy_next_to_the_originals_leaves_their_references_alone(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Only references that resolve nowhere are repaired: importing a backup
    next to the objects it came from must not move the group members or the
    vacation exemptions over to the copies."""
    await _seed(hass, global_entry)
    before = get_global_options(hass)
    objects_json, _settings, _archive = await _export_all(hass)
    payload = json.loads(objects_json)
    for obj in payload["objects"]:
        obj["object"]["name"] += " (copy)"
    await _import_json(hass, json.dumps(payload))
    after = get_global_options(hass)
    assert after[CONF_GROUPS] == before[CONF_GROUPS]
    assert after[CONF_VACATION_EXEMPT_TASK_IDS] == before[CONF_VACATION_EXEMPT_TASK_IDS]


async def test_a_name_that_fits_two_tasks_is_not_guessed(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.helpers.import_mapping import resolve_task_refs_by_name

    await _seed(hass, global_entry)
    settings = {
        CONF_GROUPS: {"g": {"name": "G", "task_refs": [{"entry_id": "gone", "task_id": "gone_task"}]}},
        CONF_VACATION_EXEMPT_TASK_IDS: ["gone_task", "other_gone"],
    }
    # Two objects share the task name "Descale"? Make them so.
    kitchen = next(e for e in hass.config_entries.async_entries(DOMAIN) if (e.data.get("object") or {}).get("name") == "Küche: Spülmaschine")
    hints = {
        "gone_task": {"object": "Küche: Spülmaschine", "task": "Descale"},
        "other_gone": {"object": "Nowhere", "task": "Descale"},
    }
    tasks = dict(kitchen.data[CONF_TASKS])
    tasks["twin"] = {**tasks["kitchen_task"], "id": "twin"}
    hass.config_entries.async_update_entry(kitchen, data={**kitchen.data, CONF_TASKS: tasks})
    resolve_task_refs_by_name(hass, settings, hints)
    assert settings[CONF_GROUPS]["g"]["task_refs"] == [{"entry_id": "gone", "task_id": "gone_task"}]
    assert settings[CONF_VACATION_EXEMPT_TASK_IDS] == ["gone_task", "other_gone"]


async def test_an_invalid_part_is_named_not_dropped_silently(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The flow step always validated imported parts, but threw a bad one
    away without a word; the import now says which and why."""
    await setup_integration(hass, global_entry)
    payload = {
        "objects": [
            {
                "object": {"name": "Parts only"},
                "tasks": [],
                "parts": [{"id": "p1", "name": "Good", "stock": 4}, {"id": "p2", "name": "Bad", "cost": "a lot"}],
            }
        ]
    }
    result = await _import_json(hass, json.dumps(payload))
    (created,) = result["imported"]
    assert any("'Bad' dropped" in w for w in created["warnings"]), created
    entry = hass.config_entries.async_get_entry(created["entry_id"])
    (part_id,) = entry.data["parts"]
    assert entry.runtime_data.store.get_part_stock(part_id) == 4


def test_imported_fleet_state_is_shape_checked() -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet import sanitize_low_latch
    from custom_components.maintenance_supporter.helpers.battery_lifetime import sanitize_replacement_log

    log = sanitize_replacement_log(
        {
            "sensor.ok_battery": {"type": "CR2032", "model": "m", "dates": ["2025-01-02", "nonsense", "2024-01-01T00:00:00"], "anchored": "yes"},
            "not an entity": {"dates": ["2025-01-01"]},
            "sensor.no_dates": {"type": "AA", "dates": []},
        }
    )
    assert log == {"sensor.ok_battery": {"type": "CR2032", "model": "m", "dates": ["2024-01-01", "2025-01-02"], "anchored": False}}
    latch = sanitize_low_latch(
        {
            "sensor.a_battery": {"at": "2026-09-20T08:00:00+00:00", "last_replaced": "2025-09-04"},
            "sensor.b_battery": {"at": "yesterday"},
            "sensor.c_battery": "low",
        }
    )
    assert latch == {"sensor.a_battery": {"at": "2026-09-20T08:00:00+00:00", "last_replaced": "2025-09-04"}}


def test_a_document_keeps_when_it_was_added() -> None:
    from custom_components.maintenance_supporter.helpers.documents import imported_added_at

    assert imported_added_at({"added_at": "2026-03-01T10:00:00+00:00"}) == "2026-03-01T10:00:00+00:00"
    for bad in ({"added_at": "2999-01-01T00:00:00+00:00"}, {"added_at": "last week"}, {"added_at": "2026-03-01T10:00:00"}, {}):
        assert imported_added_at(bad) != bad.get("added_at")
