"""Tripwires for the drift classes the 2026-08 DRY audit found.

Each consolidation from that audit exists because hand-copied blocks had
silently diverged (a fix or parameter landing in one copy but not its twins).
These tests pin the consolidations two ways: source scans that fail when a
forbidden pattern is re-introduced, and behavior tests for the drifts that
were actual bugs.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.sanitize import strip_task_runtime_state

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

COMPONENT = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter"
FRONTEND = COMPONENT / "frontend-src"


def _frontend_sources() -> list[Path]:
    """Our TS sources — never node_modules, never the built frontend/."""
    return [p for p in FRONTEND.rglob("*.ts") if "node_modules" not in p.parts]


# ─── Source scans ─────────────────────────────────────────────────────────


def test_ws_modules_do_not_enumerate_entries_inline() -> None:
    """WS handlers resolve entries via the shared helpers (_load_object_entry,
    _get_object_entries, _load_global_options, get_global_entry) — the audit
    found six inline re-implementations, two of them re-typed verbatim."""
    offenders = [
        p.name
        for p in (COMPONENT / "websocket").glob("*.py")
        if p.name != "__init__.py" and "async_entries(DOMAIN)" in p.read_text(encoding="utf-8")
    ]
    assert not offenders, f"inline config-entry enumeration in websocket/: {offenders} — use the shared helpers"


def test_lang_getters_delegate_to_langof() -> None:
    """Every component's _lang getter delegates to styles.langOf — the 23
    hand-copied getters had drifted into three different resolution rules."""
    for p in _frontend_sources():
        text = p.read_text(encoding="utf-8")
        idx = 0
        while True:
            idx = text.find("get _lang(): string {", idx)
            if idx == -1:
                break
            body = text[idx : idx + 200]
            assert "return langOf(this.hass);" in body, f"{p.name}: _lang getter does not delegate to langOf()"
            idx += 1
        if p.name != "styles.ts":
            assert "navigator.language" not in text, f"{p.name}: hand-rolled language resolution — use langOf()"


def test_localstorage_only_via_guarded_helper() -> None:
    """localStorage can throw (Safari private mode) — the audit found two
    unguarded writes. All access goes through lsGet/lsSet in storage-keys.ts.

    Call syntax only (comments may mention localStorage); tests stub it."""
    calls = ("localStorage.getItem(", "localStorage.setItem(", "localStorage.removeItem(", "localStorage.clear(")
    offenders = [
        p.name
        for p in _frontend_sources()
        if p.name != "storage-keys.ts"
        and "__tests__" not in p.parts
        and any(c in p.read_text(encoding="utf-8") for c in calls)
    ]
    assert not offenders, f"direct localStorage use in {offenders} — use lsGet/lsSet from helpers/storage-keys"


def test_signed_document_urls_single_source() -> None:
    """The auth/sign_path dance lives ONLY in helpers/document-url.ts — nine
    hand-copied call sites had drifted (page-fragment handling, popup close,
    one anchor download bypassing the Companion-safe helper)."""
    offenders = [
        p.name
        for p in _frontend_sources()
        if p.name != "document-url.ts"
        and "__tests__" not in p.parts
        and 'type: "auth/sign_path"' in p.read_text(encoding="utf-8")
    ]
    assert not offenders, f"inline auth/sign_path call in {offenders} — use helpers/document-url"


def test_custom_card_registration_single_source() -> None:
    """window.customCards is only touched by registerCustomCard — of the five
    hand-rolled pushes only the calendar card deduplicated, so a double
    bundle-load duplicated the other picker entries."""
    offenders = [
        p.name
        for p in _frontend_sources()
        if p.name != "register-card.ts"
        and "__tests__" not in p.parts
        and ".customCards" in p.read_text(encoding="utf-8")
    ]
    assert not offenders, f"direct customCards access in {offenders} — use registerCustomCard"


def test_currency_fallback_single_source() -> None:
    """The panel's currency symbol comes from ONE getter — two of the seven
    call sites had drifted to an empty-string fallback."""
    text = (FRONTEND / "maintenance-panel.ts").read_text(encoding="utf-8")
    assert text.count("currency_symbol ||") == 1, "currency fallback duplicated — route through _currencySymbol"


def test_fresh_task_copy_strip_list_single_source() -> None:
    """The fresh-copy strip list lives ONLY in sanitize.strip_task_runtime_state,
    and all three copy surfaces (task duplicate, object duplicate, object
    replace) route through it — the hand-copied lists had drifted."""
    tasks_crud = (COMPONENT / "websocket" / "tasks_crud.py").read_text(encoding="utf-8")
    objects = (COMPONENT / "websocket" / "objects.py").read_text(encoding="utf-8")
    assert tasks_crud.count("strip_task_runtime_state(") == 1, "task-duplicate no longer uses the shared strip helper"
    assert objects.count("strip_task_runtime_state(") == 2, "object duplicate/replace no longer use the shared strip helper"


def test_add_task_schedule_steps_single_source() -> None:
    """The anchor selector (and with it the add-task schedule schemas) exists
    once — the setup wizard, options add-task, and task-edit form carried
    drifting copies."""
    marker = "From planned date (no drift)"
    owners = sorted(p.name for p in COMPONENT.glob("*.py") if marker in p.read_text(encoding="utf-8"))
    assert owners == ["config_flow_helpers.py"], f"interval-anchor selector duplicated into: {owners}"


# ─── Behavior: the drifts that were real bugs ─────────────────────────────


def test_strip_task_runtime_state_covers_all_dynamic_keys() -> None:
    """The strip list itself: unique identity, lifecycle state, archive
    markers, AND the one-shot due_override defer all go; config stays."""
    task = {
        "id": "t1",
        "name": "Filter",
        "interval_days": 30,
        "entity_slug": "filter",
        "nfc_tag_id": "abc",
        "history": [{"type": "completed"}],
        "last_performed": "2026-01-01",
        "last_planned_due": "2026-02-01",
        "due_override": "2026-03-01",
        "adaptive_config": {"enabled": True},
        "archived_at": "2026-01-15T00:00:00",
        "archived_reason": "seasonal",
        "trigger_config": {"type": "threshold", "_trigger_state": {"active": True}},
    }
    strip_task_runtime_state(task)
    assert task == {
        "id": "t1",
        "name": "Filter",
        "interval_days": 30,
        "trigger_config": {"type": "threshold"},
    }


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: build_task_data(last_performed="2026-01-01")}),
        unique_id="maintenance_supporter_pool_pump",
    )
    entry.add_to_hass(hass)
    return entry


async def test_duplicate_task_starts_unarchived_without_defer(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Duplicating an archived, snoozed task yields an ACTIVE copy without the
    one-shot defer — the task-duplicate strip list had drifted behind the
    object-duplicate one (archive markers) and both missed due_override."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_duplicate_task

    await setup_integration(hass, global_entry, object_entry)

    new_data = dict(object_entry.data)
    new_tasks = dict(new_data[CONF_TASKS])
    new_tasks[TASK_ID_1] = {
        **new_tasks[TASK_ID_1],
        "archived_at": "2026-08-01T00:00:00+00:00",
        "archived_reason": "paused for summer",
        "due_override": "2026-12-24",
    }
    new_data[CONF_TASKS] = new_tasks
    hass.config_entries.async_update_entry(object_entry, data=new_data)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_duplicate_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/duplicate", "entry_id": object_entry.entry_id, "task_id": TASK_ID_1},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    new_id = conn.send_result.call_args[0][1]["task_id"]

    copy = object_entry.data[CONF_TASKS][new_id]
    assert "archived_at" not in copy
    assert "archived_reason" not in copy
    assert "due_override" not in copy
    # The source keeps its state untouched.
    source = object_entry.data[CONF_TASKS][TASK_ID_1]
    assert source["archived_at"] == "2026-08-01T00:00:00+00:00"
    assert source["due_override"] == "2026-12-24"


async def test_checklist_progress_clean_error_when_store_missing(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Checklist ticks live ONLY in the Store — with the Store unavailable the
    handler must answer storage_unavailable, not crash with AttributeError
    (the audit found this as the one unguarded rd.store access)."""
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_checklist_progress

    await setup_integration(hass, global_entry, object_entry)
    object_entry.runtime_data.store = None

    conn = make_ws_connection()
    await call_ws_handler(
        ws_checklist_progress,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/checklist_progress",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "checklist_state": {},
        },
    )
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "storage_unavailable"


async def test_readopt_restores_pooled_part_link(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """A stashed POOLED (#111) part link survives un-adopt → re-adopt.

    The adoption path's sanitize call had forgotten foreign_part_ids (the CRUD
    paths pass it), silently dropping the cross-object link on re-adopt."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_delete_task

    from .test_problem_sensors import _adopt, _adopted_object_and_task, _problem_sensor

    await setup_integration(hass, global_entry)

    # Another object owns the pool the link draws from.
    owner = MockConfigEntry(
        domain=DOMAIN,
        title="Supply Cabinet",
        data={
            **build_object_entry_data(tasks={}),
            "parts": {"part_salt": {"id": "part_salt", "name": "Salt pellets"}},
        },
        unique_id="maintenance_supporter_supply_cabinet",
    )
    owner.add_to_hass(hass)

    _problem_sensor(hass, "binary_sensor.softener_salt_low", "Softener salt low", "on")
    await _adopt(hass, "binary_sensor.softener_salt_low", "Softener salt low", "Water softener")
    obj, task = _adopted_object_and_task(hass, "Water softener")

    pooled_link = {"part_id": "part_salt", "quantity": 2, "entry_id": owner.entry_id}
    new_data = dict(obj.data)
    new_tasks = dict(new_data[CONF_TASKS])
    new_tasks[task["id"]] = {**task, "consumes_parts": [pooled_link]}
    new_data[CONF_TASKS] = new_tasks
    hass.config_entries.async_update_entry(obj, data=new_data)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/delete", "entry_id": obj.entry_id, "task_id": task["id"]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()

    await _adopt(hass, "binary_sensor.softener_salt_low", "Softener salt low", "Water softener 2")
    _, task2 = _adopted_object_and_task(hass, "Water softener 2")
    assert task2.get("consumes_parts") == [pooled_link], "pooled part link lost on re-adopt"
