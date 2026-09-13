"""Bug audit 2026-09-12 — persistence findings.

1. ``task/move``: refuses buy / fleet tasks and unloaded entries; stamps
   part links inside phases; carries the vacation exemption; re-stamps
   ``object_id``; re-homes completion photos and keeps document links.
2. Settings sanitiser: bool is not a number, an integral float is an int.
3. JSON import: ``entity_slug`` normalised like the WS paths; a malformed
   document record neither crashes the store nor sinks the import.
4. Document upload view: filename / title / tags capped like the WS paths.
5. ``task/update``: an edited ``last_performed`` lands in the Store (the
   system of record) instead of being masked by it.
"""

from __future__ import annotations

import json
from datetime import timedelta
from http import HTTPStatus
from typing import Any
from unittest.mock import AsyncMock

import pytest
from aiohttp import FormData
from homeassistant.config_entries import ConfigEntryDisabler
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import (
    BATTERY_FLEET_TASK_FLAG,
    CONF_BUDGET_MONTHLY,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_OBJECT,
    CONF_TASKS,
    CONF_VACATION_EXEMPT_TASK_IDS,
    DOMAIN,
    MAX_NAME_LENGTH,
)
from custom_components.maintenance_supporter.helpers.documents import DocumentStore, _safe_size
from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD
from custom_components.maintenance_supporter.views import SERVE_URL, UPLOAD_URL
from custom_components.maintenance_supporter.websocket.dashboard import sanitize_settings_input
from custom_components.maintenance_supporter.websocket.io import ws_import_json
from custom_components.maintenance_supporter.websocket.tasks import ws_create_task, ws_move_task, ws_update_task

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_object_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

_VALID_HASH = "a" * 64


pytestmark = pytest.mark.usefixtures("isolated_docs_dir")


def _global(hass: HomeAssistant, *, options: dict[str, Any] | None = None) -> MockConfigEntry:
    return make_global_entry(hass, options=options)


def _object(hass: HomeAssistant, name: str, tasks: dict[str, Any], *, uid: str) -> MockConfigEntry:
    obj = build_object_data(name=name, object_id=f"obj_{uid}")
    for task in tasks.values():
        task["object_id"] = obj["id"]
    return make_object_entry(hass, tasks=tasks, name=name, uid=uid, object_data=obj)


def _entry(hass: HomeAssistant, entry_id: str) -> MockConfigEntry:
    e = hass.config_entries.async_get_entry(entry_id)
    assert e is not None
    return e  # type: ignore[return-value]


def _doc_store(hass: HomeAssistant) -> DocumentStore:
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    return store


async def _move(hass: HomeAssistant, src: MockConfigEntry, dst: MockConfigEntry, task_id: str = TASK_ID_1) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(
        ws_move_task,
        hass,
        conn,
        {"id": 1, "type": "x", "entry_id": src.entry_id, "task_id": task_id, "target_entry_id": dst.entry_id},
    )
    await hass.async_block_till_done()
    return conn


# ─── 1a: buy task / fleet task stay with their object ───────────────────────


@pytest.mark.parametrize("marker", [PART_REF_FIELD, BATTERY_FLEET_TASK_FLAG])
async def test_move_refuses_buy_task_and_fleet_task(hass: HomeAssistant, marker: str) -> None:
    task = build_task_data(name="Buy filters")
    task[marker] = {"part_id": "p1"} if marker == PART_REF_FIELD else True
    src = _object(hass, "Espresso", {TASK_ID_1: task}, uid=f"nm_src_{marker}")
    dst = _object(hass, "Kettle", {}, uid=f"nm_dst_{marker}")
    await setup_integration(hass, _global(hass), src, dst)

    conn = await _move(hass, src, dst)
    conn.send_result.assert_not_called()
    assert conn.send_error.call_args[0][1] == "task_not_movable"
    assert TASK_ID_1 in _entry(hass, src.entry_id).data[CONF_TASKS], "nothing moved"
    assert TASK_ID_1 not in _entry(hass, dst.entry_id).data[CONF_TASKS]


# ─── 1b: both Stores must be loaded ─────────────────────────────────────────


@pytest.mark.parametrize("side", ["target", "source"])
async def test_move_refuses_unloaded_entry_before_the_delete_leg(hass: HomeAssistant, side: str) -> None:
    task = build_task_data(name="Descale", last_performed="2026-01-01")
    src = _object(hass, "Espresso", {TASK_ID_1: task}, uid=f"nl_src_{side}")
    dst = _object(hass, "Kettle", {}, uid=f"nl_dst_{side}")
    await setup_integration(hass, _global(hass), src, dst)
    if side == "target":
        # A disabled entry is unloaded → no runtime_data / Store.
        await hass.config_entries.async_set_disabled_by(dst.entry_id, ConfigEntryDisabler.USER)
    else:
        assert await hass.config_entries.async_unload(src.entry_id)
    await hass.async_block_till_done()
    assert getattr(_entry(hass, dst.entry_id if side == "target" else src.entry_id), "runtime_data", None) is None

    conn = await _move(hass, src, dst)
    conn.send_result.assert_not_called()
    assert conn.send_error.call_args[0][1] == "object_not_loaded"
    # The delete leg never ran: config still on the source, nothing on the target.
    assert TASK_ID_1 in _entry(hass, src.entry_id).data[CONF_TASKS]
    assert TASK_ID_1 not in _entry(hass, dst.entry_id).data.get(CONF_TASKS, {})
    if side == "target":
        assert get_task_store_state(hass, src.entry_id, TASK_ID_1).get("last_performed") == "2026-01-01"


# ─── 1c + 1e: part links inside phases stamped, object_id re-stamped ────────


async def test_move_stamps_phase_part_links_and_restamps_object_id(hass: HomeAssistant) -> None:
    task = build_task_data(name="Service")
    task["consumes_parts"] = [{"part_id": "p_top", "quantity": 1}]
    task["phases"] = {
        "minor": {"name": "Minor", "consumes_parts": [{"part_id": "p_minor", "quantity": 2}]},
        "major": {"name": "Major", "consumes_parts": [{"part_id": "p_foreign", "quantity": 1, "entry_id": "elsewhere"}]},
    }
    task["phase_sequence"] = ["minor", "major"]
    src = _object(hass, "Espresso", {TASK_ID_1: task}, uid="ph_src")
    dst = _object(hass, "Kettle", {}, uid="ph_dst")
    await setup_integration(hass, _global(hass), src, dst)

    conn = await _move(hass, src, dst)
    conn.send_error.assert_not_called()
    moved = _entry(hass, dst.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert moved["object_id"] == _entry(hass, dst.entry_id).data[CONF_OBJECT]["id"]
    assert moved["consumes_parts"] == [{"part_id": "p_top", "quantity": 1, "entry_id": src.entry_id}]
    assert moved["phases"]["minor"]["consumes_parts"] == [{"part_id": "p_minor", "quantity": 2, "entry_id": src.entry_id}]
    # An already-foreign link keeps its own pool.
    assert moved["phases"]["major"]["consumes_parts"][0]["entry_id"] == "elsewhere"


# ─── 1d: vacation exemption follows the task ────────────────────────────────


async def test_move_keeps_vacation_exemption(hass: HomeAssistant) -> None:
    src = _object(hass, "Espresso", {TASK_ID_1: build_task_data(name="Descale")}, uid="vac_src")
    dst = _object(hass, "Kettle", {}, uid="vac_dst")
    g = _global(hass, options={CONF_VACATION_EXEMPT_TASK_IDS: [TASK_ID_1, "other-task"]})
    await setup_integration(hass, g, src, dst)

    conn = await _move(hass, src, dst)
    conn.send_error.assert_not_called()
    exempt = _entry(hass, g.entry_id).options[CONF_VACATION_EXEMPT_TASK_IDS]
    assert sorted(exempt) == sorted([TASK_ID_1, "other-task"])
    assert exempt.count(TASK_ID_1) == 1


# ─── 1f: completion photos re-homed, document links kept ────────────────────


async def test_move_rehomes_completion_photos_and_keeps_document_links(hass: HomeAssistant) -> None:
    src = _object(hass, "Espresso", {TASK_ID_1: build_task_data(name="Descale"), TASK_ID_2: build_task_data(task_id=TASK_ID_2, name="Other")}, uid="doc_src")
    dst = _object(hass, "Kettle", {}, uid="doc_dst")
    await setup_integration(hass, _global(hass), src, dst)
    src_obj_id = _entry(hass, src.entry_id).data[CONF_OBJECT]["id"]
    dst_obj_id = _entry(hass, dst.entry_id).data[CONF_OBJECT]["id"]
    docs = _doc_store(hass)

    # A photo of this task only, a photo shared with another task, and a
    # manual linked to the task with a page hint.
    own_photo = await docs.async_add_file(src_obj_id, content=b"own", filename="own.jpg", mime="image/jpeg", tags=["photo"])
    shared_photo = await docs.async_add_file(src_obj_id, content=b"shared", filename="shared.jpg", mime="image/jpeg", tags=["photo"])
    manual = await docs.async_add_file(src_obj_id, content=b"manual", filename="manual.pdf", mime="application/pdf", tags=["manual"])
    await docs.async_update(manual["id"], task_ids=[TASK_ID_1, TASK_ID_2], task_pages={TASK_ID_1: 7})
    await docs.async_update(shared_photo["id"], task_ids=[TASK_ID_2])

    coordinator = _entry(hass, src.entry_id).runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1, photo_doc_ids=[own_photo["id"], shared_photo["id"]])
    await hass.async_block_till_done()
    assert docs.get(own_photo["id"])["task_ids"] == [TASK_ID_1]
    assert sorted(docs.get(shared_photo["id"])["task_ids"]) == sorted([TASK_ID_2, TASK_ID_1])

    conn = await _move(hass, src, dst)
    conn.send_error.assert_not_called()

    own = docs.get(own_photo["id"])
    assert own["object_id"] == dst_obj_id, "the task's own photo moved with it"
    assert own["task_ids"] == [TASK_ID_1]
    shared = docs.get(shared_photo["id"])
    assert shared["object_id"] == src_obj_id, "a photo shared with another task stays"
    assert TASK_ID_1 in shared["task_ids"] and TASK_ID_2 in shared["task_ids"]
    man = docs.get(manual["id"])
    assert man["object_id"] == src_obj_id
    assert TASK_ID_1 in man["task_ids"] and man["task_pages"] == {TASK_ID_1: 7}, "link + page hint survived"
    # The history entry still points at both photos, and the moved photo
    # now shows under the target object's documents.
    history = get_task_store_state(hass, dst.entry_id, TASK_ID_1)["history"]
    assert history[-1]["photo_doc_ids"] == [own_photo["id"], shared_photo["id"]]
    assert [d["id"] for d in docs.for_object(dst_obj_id)] == [own_photo["id"]]


async def test_document_store_relink_task_skips_unknown_ids(hass: HomeAssistant) -> None:
    s = DocumentStore(hass)
    await s.async_load()
    doc = await s.async_add_weblink("obj1", url="https://x/manual")
    assert s.task_links("t1") == {}
    touched = await s.async_relink_task("t1", {doc["id"]: 3, "gone": None}, rehome_doc_ids={doc["id"]}, object_id="obj2")
    assert touched == 1
    assert s.get(doc["id"])["task_ids"] == ["t1"]
    assert s.get(doc["id"])["task_pages"] == {"t1": 3}
    assert s.get(doc["id"])["object_id"] == "obj2"
    assert s.task_links("t1") == {doc["id"]: 3}


# ─── 2: settings sanitiser numeric types ────────────────────────────────────


def test_settings_sanitiser_rejects_bool_for_numeric_specs() -> None:
    filtered, _ = sanitize_settings_input({CONF_DEFAULT_WARNING_DAYS: True, CONF_BUDGET_MONTHLY: False})
    assert CONF_DEFAULT_WARNING_DAYS not in filtered
    assert CONF_BUDGET_MONTHLY not in filtered
    # A real bool spec still takes a bool.
    filtered, _ = sanitize_settings_input({CONF_NOTIFICATIONS_ENABLED: True})
    assert filtered[CONF_NOTIFICATIONS_ENABLED] is True


def test_settings_sanitiser_coerces_integral_float_for_int_spec() -> None:
    # The options flow persists NumberSelector values as floats (7.0).
    filtered, _ = sanitize_settings_input({CONF_DEFAULT_WARNING_DAYS: 7.0})
    assert filtered[CONF_DEFAULT_WARNING_DAYS] == 7
    assert type(filtered[CONF_DEFAULT_WARNING_DAYS]) is int
    for bad in (7.5, float("nan"), float("inf")):
        filtered, _ = sanitize_settings_input({CONF_DEFAULT_WARNING_DAYS: bad})
        assert CONF_DEFAULT_WARNING_DAYS not in filtered, bad
    # Out-of-range integral floats still fall to the range check.
    filtered, _ = sanitize_settings_input({CONF_DEFAULT_WARNING_DAYS: 400.0})
    assert CONF_DEFAULT_WARNING_DAYS not in filtered


# ─── 3i: entity_slug on JSON import ─────────────────────────────────────────


async def test_import_json_normalises_invalid_entity_slug(hass: HomeAssistant) -> None:
    await setup_integration(hass, _global(hass))
    conn = make_ws_connection()
    payload = {
        "version": 1,
        "objects": [
            {
                "object": {"name": "Slug Pump"},
                "tasks": [
                    {"name": "Fine", "entity_slug": "fine_slug"},
                    {"name": "Mixed", "entity_slug": "Descale-It Now"},
                    {"name": "Junk", "entity_slug": "!!!"},
                    {"name": "Wrong type", "entity_slug": 42},
                ],
            }
        ],
    }
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(payload)})
    await hass.async_block_till_done()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1
    entry = _entry(hass, result["imported"][0]["entry_id"])
    by_name = {t["name"]: t for t in entry.data[CONF_TASKS].values()}
    assert by_name["Fine"]["entity_slug"] == "fine_slug"
    assert by_name["Mixed"]["entity_slug"] == "descale_it_now"
    assert "entity_slug" not in by_name["Junk"]
    assert "entity_slug" not in by_name["Wrong type"]
    warnings = result["imported"][0]["warnings"]
    assert any("Mixed" in w and "descale_it_now" in w for w in warnings)
    assert any("Junk" in w and "dropped" in w for w in warnings)


# ─── 3ii: malformed document records ────────────────────────────────────────


def test_safe_size_degrades_junk_to_zero() -> None:
    assert _safe_size(1234) == 1234
    assert _safe_size(12.0) == 12
    for junk in ("huge", None, True, -5, float("nan"), float("inf"), [1]):
        assert _safe_size(junk) == 0, junk


async def test_import_documents_skips_malformed_record_keeps_the_rest(hass: HomeAssistant) -> None:
    s = DocumentStore(hass)
    await s.async_load()
    docs = [
        {"kind": "file", "hash": _VALID_HASH, "size": "huge", "filename": "a.pdf"},  # size junk → 0
        {"kind": "file", "hash": _VALID_HASH, "tags": 5},  # tags not iterable → record skipped
        {"kind": "weblink", "url": "https://x/manual"},
    ]
    created = await s.async_import_documents("obj1", docs)
    assert created == 2
    sizes = [d["size"] for d in s.for_object("obj1") if d["kind"] == "file"]
    assert sizes == [0]
    assert s.blobs[_VALID_HASH]["refcount"] == 1


async def test_import_json_survives_document_store_failure(hass: HomeAssistant) -> None:
    """The documents call sits outside the per-object try: a crash there must
    become a per-object warning, not a silent abort of the whole import."""
    await setup_integration(hass, _global(hass))
    _doc_store(hass).async_import_documents = AsyncMock(side_effect=RuntimeError("boom"))  # type: ignore[method-assign]
    conn = make_ws_connection()
    payload = {
        "version": 1,
        "objects": [
            {
                "object": {"name": "Doc Pump"},
                "tasks": [{"name": "T"}],
                "documents": [{"kind": "weblink", "url": "https://x/manual"}],
            }
        ],
    }
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(payload)})
    await hass.async_block_till_done()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1
    assert any(w.startswith("documents:") for w in result["imported"][0]["warnings"])


# ─── 4: upload view caps ────────────────────────────────────────────────────


async def test_upload_caps_filename_title_and_tags(hass: HomeAssistant, hass_client: ClientSessionGenerator) -> None:
    obj = _object(hass, "Pool Pump", {}, uid="upload_caps")
    await setup_integration(hass, _global(hass), obj)
    client = await hass_client()
    form = FormData()
    form.add_field("entry_id", obj.entry_id)
    form.add_field("title", "T" * 5000)
    form.add_field("tags", "g" * 500)
    form.add_field("tags", "manual")
    form.add_field("file", b"pdf-bytes", filename="f" * 5000 + ".pdf", content_type="application/pdf")
    resp = await client.post(UPLOAD_URL, data=form)
    assert resp.status == HTTPStatus.OK
    doc = await resp.json()
    stored = _doc_store(hass).get(doc["id"])
    assert stored is not None
    assert len(stored["filename"]) == MAX_NAME_LENGTH
    assert len(stored["title"]) == MAX_NAME_LENGTH
    assert [len(t) for t in stored["tags"]] == [64, len("manual")]
    # The echoed Content-Disposition can't carry a multi-KB name any more.
    serve = await client.get(SERVE_URL.format(doc_id=doc["id"]))
    assert serve.status == HTTPStatus.OK
    assert len(serve.headers["Content-Disposition"]) < 3 * MAX_NAME_LENGTH + 64


# ─── 5: task/update last_performed lands in the Store ───────────────────────


async def test_update_last_performed_lands_in_store_for_a_completed_task(hass: HomeAssistant) -> None:
    obj = _object(hass, "Pool Pump", {}, uid="lp_update")
    await setup_integration(hass, _global(hass), obj)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {"id": 1, "type": "x", "entry_id": obj.entry_id, "name": "Filter", "interval_days": 30, "last_performed": "2026-01-10"},
    )
    await hass.async_block_till_done()
    task_id = conn.send_result.call_args[0][1]["task_id"]
    assert get_task_store_state(hass, obj.entry_id, task_id).get("last_performed") == "2026-01-10"

    # A completion stamps the Store — the case the old entry.data-only write masked.
    coordinator = _entry(hass, obj.entry_id).runtime_data.coordinator
    await coordinator.complete_maintenance(task_id, completed_at=dt_util.now() - timedelta(days=5))
    await hass.async_block_till_done()

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 2, "type": "x", "entry_id": obj.entry_id, "task_id": task_id, "last_performed": "2026-03-03"},
    )
    await hass.async_block_till_done()
    conn.send_error.assert_not_called()
    assert get_task_store_state(hass, obj.entry_id, task_id).get("last_performed") == "2026-03-03"
    entry = _entry(hass, obj.entry_id)
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[task_id]
    assert merged["last_performed"] == "2026-03-03"

    # Clearing works the same way.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 3, "type": "x", "entry_id": obj.entry_id, "task_id": task_id, "last_performed": None},
    )
    await hass.async_block_till_done()
    conn.send_error.assert_not_called()
    assert "last_performed" not in get_task_store_state(hass, obj.entry_id, task_id)
