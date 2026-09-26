"""JSON import + settings export — the forgiving-but-safe edge paths.

The JSON importer's contract is "one bad field never sinks the object, and
nothing malformed is persisted": every link that cannot be re-pointed at a
freshly minted id is dropped, a foreign-pool link survives only when that
pool exists in THIS instance, and shape-invalid fields fall back to "unset".
These tests feed a deliberately messy backup through the real WS handler and
assert what actually lands in the new config entry.
"""

from __future__ import annotations

import json
from typing import Any
from unittest.mock import patch

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN
from custom_components.maintenance_supporter.websocket.io import (
    _apply_settings_import,
    ws_export_settings,
    ws_import_json,
)

from .conftest import (
    TASK_ID_1,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


async def _import(hass: HomeAssistant, payload: dict[str, Any]) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(payload)})
    await hass.async_block_till_done()
    assert not conn.send_error.called, conn.send_error.call_args
    return conn.send_result.call_args[0][1]


def _imported(hass: HomeAssistant, result: dict[str, Any], name: str) -> MockConfigEntry:
    info = next(i for i in result["imported"] if i["name"] == name)
    entry = hass.config_entries.async_get_entry(info["entry_id"])
    assert entry is not None
    return entry


def _task_by_name(entry: Any, name: str) -> dict[str, Any]:
    return next(t for t in entry.data[CONF_TASKS].values() if t["name"] == name)


async def _with_shared_pool(hass: HomeAssistant) -> MockConfigEntry:
    """A live object in THIS instance whose part pool foreign links may target."""
    g = make_global_entry(hass)
    shelf = make_object_entry(
        hass,
        tasks={TASK_ID_1: build_task_data(name="Inventory")},
        name="Shelf",
        uid="io_shelf",
        extra_data={"parts": {"bags": {"id": "bags", "name": "Vacuum bags"}}},
    )
    await setup_integration(hass, g, shelf)
    return shelf


async def test_messy_part_links_are_remapped_kept_or_dropped(hass: HomeAssistant) -> None:
    shelf = await _with_shared_pool(hass)
    payload = {
        "objects": [
            {
                "object": {"name": "Robot Vacuum"},
                "parts": [
                    {"id": "old_filter", "name": "HEPA filter", "stock": 3},
                    {"id": "nameless", "name": "   "},
                    "not-a-part",
                ],
                "tasks": [
                    "not-a-task",
                    {
                        "name": "Swap filter",
                        "consumes_parts": [
                            "junk",
                            {"part_id": "old_filter", "quantity": 2},
                            {"entry_id": shelf.entry_id, "part_id": "bags", "quantity": 1},
                            {"entry_id": "entry_from_another_instance", "part_id": "zz"},
                        ],
                    },
                    {"name": "Buy HEPA filter", "schedule_type": "one_time", "part_ref": {"part_id": "old_filter"}},
                    {
                        "name": "Dangling links",
                        "consumes_parts": [{"part_id": "never_exported"}],
                        "part_ref": {"part_id": "never_exported"},
                    },
                    {"name": "Garbage links", "consumes_parts": "not-a-list"},
                ],
            }
        ]
    }

    handed_to_flow: list[dict[str, Any]] = []
    real_init = hass.config_entries.flow.async_init

    async def _spy(*args: Any, **kwargs: Any) -> Any:
        handed_to_flow.append(kwargs["data"])
        return await real_init(*args, **kwargs)

    with patch.object(hass.config_entries.flow, "async_init", _spy):
        result = await _import(hass, payload)

    assert result["created"] == 1, result
    entry = _imported(hass, result, "Robot Vacuum")
    (new_pid,) = entry.data["parts"]  # nameless + non-dict parts were skipped
    assert new_pid != "old_filter"
    assert entry.data["parts"][new_pid]["name"] == "HEPA filter"
    assert entry.runtime_data.store.get_part_stock(new_pid) == 3

    swap = _task_by_name(entry, "Swap filter")
    assert swap["consumes_parts"] == [
        {"part_id": new_pid, "quantity": 2},
        {"entry_id": shelf.entry_id, "part_id": "bags", "quantity": 1},
    ]
    dangling = _task_by_name(entry, "Dangling links")
    assert "consumes_parts" not in dangling
    assert "part_ref" not in dangling
    assert "consumes_parts" not in _task_by_name(entry, "Garbage links")

    # The auto-buy marker is re-pointed before the entry is created (the
    # buy-task reconcile owns it afterwards, so assert what import handed over).
    (flow_data,) = handed_to_flow
    imported_names = sorted(t["name"] for t in flow_data[CONF_TASKS].values())
    assert imported_names == ["Buy HEPA filter", "Dangling links", "Garbage links", "Swap filter"]
    buy = next(t for t in flow_data[CONF_TASKS].values() if t["name"] == "Buy HEPA filter")
    assert buy["part_ref"] == {"part_id": new_pid}


async def test_phase_part_links_follow_the_same_rules(hass: HomeAssistant) -> None:
    shelf = await _with_shared_pool(hass)
    payload = {
        "objects": [
            {
                "object": {"name": "Mower"},
                "parts": [{"id": "old_blade", "name": "Blade set"}],
                "tasks": [
                    {
                        "name": "Blade protocol",
                        "interval_days": 30,
                        "phases": {
                            "flip": {
                                "name": "Flip blades",
                                "notes": "  wear gloves  ",
                                "consumes_parts": [
                                    "junk",
                                    {"part_id": "old_blade"},
                                    {"entry_id": shelf.entry_id, "part_id": "bags", "quantity": 1},
                                    {"entry_id": "gone_entry", "part_id": "x"},
                                ],
                            },
                            "replace": {"name": "Replace blades", "consumes_parts": [{"part_id": "unknown"}]},
                            "broken": "not-a-definition",
                        },
                        "phase_sequence": ["flip", "replace", "broken"],
                        "phase_cursor": 7,
                    }
                ],
            }
        ]
    }

    result = await _import(hass, payload)

    entry = _imported(hass, result, "Mower")
    (new_pid,) = entry.data["parts"]
    task = _task_by_name(entry, "Blade protocol")
    assert task["phase_sequence"] == ["flip", "replace"]
    flip = task["phases"]["flip"]
    assert flip["notes"] == "wear gloves"
    assert flip["consumes_parts"] == [
        {"part_id": new_pid, "quantity": 1},
        {"entry_id": shelf.entry_id, "part_id": "bags", "quantity": 1},
    ]
    assert "consumes_parts" not in task["phases"]["replace"]
    assert "broken" not in task["phases"]
    # The imported cursor 7 is clamped into the two-step cycle (7 % 2).
    assert entry.runtime_data.store.get_task_state(task["id"]).get("phase_cursor") == 1


async def test_shape_invalid_task_fields_are_dropped_with_a_warning(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    payload = {
        "objects": [
            {
                "object": {"name": "Heat Pump"},
                "tasks": [
                    {
                        "name": "Annual service",
                        "interval_days": 365,
                        "last_performed": "the day before yesterday",
                        "readings": "not-a-slot-list",
                        "notify_icon": 12345,
                        "trigger_config": "not-a-mapping",
                    }
                ],
            }
        ]
    }

    result = await _import(hass, payload)

    info = result["imported"][0]
    assert info["warnings"] == ["Annual service: trigger dropped — not a mapping"]
    task = _task_by_name(_imported(hass, result, "Heat Pump"), "Annual service")
    for dropped in ("last_performed", "readings", "notify_icon", "trigger_config"):
        assert dropped not in task, dropped


async def test_history_without_photos_is_left_alone_when_documents_are_remapped(hass: HomeAssistant) -> None:
    """Only history entries that carry photos are rewritten; a plain completion
    keeps its shape, and the imported web-link gets a fresh id."""
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    payload = {
        "objects": [
            {
                "object": {"name": "Boiler"},
                "tasks": [
                    {
                        "id": "old_task",
                        "name": "Service",
                        "interval_days": 365,
                        "history": [
                            {"timestamp": "2025-01-10T09:00:00+00:00", "type": "completed", "notes": "plain"},
                            {"timestamp": "2025-06-10T09:00:00+00:00", "type": "completed", "photo_doc_ids": ["old_doc"]},
                        ],
                    }
                ],
                "documents": [
                    {"id": "old_doc", "kind": "weblink", "url": "https://example.com/manual", "title": "Manual"},
                ],
            }
        ]
    }

    result = await _import(hass, payload)

    entry = _imported(hass, result, "Boiler")
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY].for_object(entry.data["object"]["id"])
    (new_doc,) = docs
    assert new_doc["id"] != "old_doc"
    task = next(iter(entry.runtime_data.coordinator._get_merged_tasks_data().values()))
    by_notes = {h.get("notes"): h for h in task["history"]}
    assert "photo_doc_ids" not in by_notes["plain"]
    assert [h for h in task["history"] if h.get("photo_doc_ids")][0]["photo_doc_ids"] == [new_doc["id"]]


# ─── the global-settings half ────────────────────────────────────────────


async def test_settings_export_ws_returns_the_portable_settings(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, options={"default_warning_days": 11, "admin_panel_user_ids": ["u1"]})
    await setup_integration(hass, g)
    conn = make_ws_connection()

    await call_ws_handler(ws_export_settings, hass, conn, {"id": 5, "type": "x"})

    result = conn.send_result.call_args[0][1]
    assert result["format"] == "json"
    exported = json.loads(result["data"])["global_settings"]
    assert exported["default_warning_days"] == 11
    assert "admin_panel_user_ids" not in exported  # instance-bound, never exported


async def test_settings_import_without_a_global_entry_or_payload_applies_nothing(hass: HomeAssistant) -> None:
    assert _apply_settings_import(hass, {"default_warning_days": 9}) == []
    make_global_entry(hass)
    assert _apply_settings_import(hass, "not-a-mapping") == []  # type: ignore[arg-type]
    # Only non-portable / unknown keys and a nameless group: nothing to apply.
    assert _apply_settings_import(hass, {"admin_panel_user_ids": ["x"], "groups": {"g": {"name": "  "}}}) == []


async def test_settings_import_drops_an_invalid_notify_service_but_keeps_the_rest(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, options={"default_warning_days": 7})

    applied = _apply_settings_import(
        hass,
        {
            "default_warning_days": 21,
            "notify_service": "not a valid service!!",
            "groups": {
                "bad": {"name": ""},
                "ok": {"name": " Heating ", "task_refs": [{"entry_id": "e", "task_id": "t"}, "junk"]},
            },
        },
    )

    assert "notify_service" not in applied
    assert set(applied) == {"default_warning_days", "groups"}
    assert g.options["default_warning_days"] == 21
    assert "notify_service" not in g.options
    assert g.options["groups"] == {"ok": {"name": "Heating", "description": "", "task_refs": [{"entry_id": "e", "task_id": "t"}]}}


async def test_settings_import_drops_every_invalid_field_and_validates_the_rest(hass: HomeAssistant, caplog: Any) -> None:
    """The sanitizer stops at the first invalid field. The import used to
    drop only notify_service after any error — a javascript: search template
    was saved as-is, and the checks after the first failure never ran.
    ``global/update`` rejects the same input. (The shopping list is
    instance-bound and never imported at all.)"""
    g = make_global_entry(hass, options={"default_warning_days": 7})

    applied = _apply_settings_import(
        hass,
        {
            "default_warning_days": 21,
            "part_search_url_template": "javascript:alert(1)//{q}",
            "shopping_list_entity": "light.kitchen",
            "notify_service": "not a valid service!!",
        },
    )

    assert applied == ["default_warning_days"]
    assert g.options["default_warning_days"] == 21
    assert "shopping_list_entity" not in g.options
    for dropped in ("part_search_url_template", "notify_service"):
        assert dropped not in g.options
        assert any(dropped in r.getMessage() for r in caplog.records if r.levelname == "WARNING")
    # A valid template in the same payload survives its invalid neighbours.
    _apply_settings_import(hass, {"part_search_url_template": "https://shop.example/s?q={q}", "shopping_list_entity": "light.x"})
    assert g.options["part_search_url_template"] == "https://shop.example/s?q={q}"
