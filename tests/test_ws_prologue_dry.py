"""WS-layer prologue helpers (DRY review 2026-09-13).

``websocket._load_object_task`` is THE per-task command prologue (17 inline
copies before), ``_parse_iso_date`` the one ISO-date gate (ten copies),
``helpers.aggregate.get_store`` / ``get_coordinator_data`` the one runtime-data
reach, ``is_object_entry`` the one three-part entry guard. The source tripwires
at the bottom keep the inline spellings from creeping back.
"""

from __future__ import annotations

import re
from datetime import date
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import MAX_TIMESTAMP_LENGTH, MAX_VACATION_EXEMPT_TASKS
from custom_components.maintenance_supporter.helpers.aggregate import (
    get_coordinator_data,
    get_store,
    is_object_entry,
)
from custom_components.maintenance_supporter.websocket import (
    USED_PARTS_FIELD,
    _load_object_task,
    _parse_iso_date,
    async_commit_store,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_task_data,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

WS_DIR = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter" / "websocket"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    return make_global_entry(hass)


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    return make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30)}, uid="prologue_obj")


def _msg(entry_id: str, task_id: str = TASK_ID_1) -> dict:
    return {"id": 7, "type": "x", "entry_id": entry_id, "task_id": task_id}


# ─── _load_object_task ────────────────────────────────────────────────────


async def test_load_object_task_missing_entry_is_not_found(hass: HomeAssistant) -> None:
    conn = make_ws_connection()
    assert _load_object_task(hass, conn, _msg("nope")) is None
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_load_object_task_global_entry_is_not_found(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    conn = make_ws_connection()
    assert _load_object_task(hass, conn, _msg(global_entry.entry_id)) is None
    assert conn.send_error.call_args[0][1] == "not_found"


@pytest.mark.parametrize("merged", [False, True])
async def test_load_object_task_missing_task_is_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry, merged: bool
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    conn = make_ws_connection()
    assert _load_object_task(hass, conn, _msg(object_entry.entry_id, TASK_ID_2), merged=merged) is None
    assert conn.send_error.call_args[0][1] == "not_found"
    assert "Task" in conn.send_error.call_args[0][2]


async def test_load_object_task_raw_and_merged_views(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    """Raw = the config dict; merged = the Store overlay (dynamic fields)."""
    await setup_integration(hass, global_entry, object_entry)
    object_entry.runtime_data.store.set_anchor(TASK_ID_1, "2026-01-02")
    conn = make_ws_connection()

    ctx = _load_object_task(hass, conn, _msg(object_entry.entry_id))
    assert ctx is not None
    entry, rd, raw = ctx
    assert entry is object_entry and rd is object_entry.runtime_data
    assert raw.get("last_performed") != "2026-01-02"

    ctx = _load_object_task(hass, conn, _msg(object_entry.entry_id), merged=True)
    assert ctx is not None
    assert ctx[2]["last_performed"] == "2026-01-02"
    conn.send_error.assert_not_called()


async def test_load_object_task_need_store_sends_not_loaded(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    object_entry.runtime_data.store = None
    conn = make_ws_connection()
    assert _load_object_task(hass, conn, _msg(object_entry.entry_id), need_store=True) is None
    assert conn.send_error.call_args[0][1] == "not_loaded"
    # Without the flag the (store-less) runtime data is handed back as is.
    conn2 = make_ws_connection()
    assert _load_object_task(hass, conn2, _msg(object_entry.entry_id)) is not None
    conn2.send_error.assert_not_called()


async def test_load_object_task_need_coordinator_keeps_not_found_code(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    """The action handlers always answered ``not_found`` for a missing
    coordinator — the frontend keys on the code, so it stays."""
    await setup_integration(hass, global_entry, object_entry)
    object_entry.runtime_data.coordinator = None
    conn = make_ws_connection()
    assert _load_object_task(hass, conn, _msg(object_entry.entry_id), need_coordinator=True) is None
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_load_object_task_unloaded_entry(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """An object entry that never loaded (no runtime_data): the task still
    resolves from the config dict; ``need_store`` refuses it cleanly."""
    entry = make_object_entry(hass, tasks={TASK_ID_1: build_task_data()}, uid="prologue_unloaded")
    conn = make_ws_connection()
    ctx = _load_object_task(hass, conn, _msg(entry.entry_id))
    assert ctx is not None and ctx[1] is None and ctx[2]["id"] == TASK_ID_1
    assert _load_object_task(hass, conn, _msg(entry.entry_id), need_store=True) is None
    assert conn.send_error.call_args[0][1] == "not_loaded"


# ─── _parse_iso_date ──────────────────────────────────────────────────────


def test_parse_iso_date_valid() -> None:
    conn = make_ws_connection()
    assert _parse_iso_date(conn, 1, "2026-03-04", field="until") == date(2026, 3, 4)
    conn.send_error.assert_not_called()


@pytest.mark.parametrize("value", ["04.03.2026", "", None, 20260304, "2026-13-01"])
def test_parse_iso_date_invalid_sends_callers_code(value: object) -> None:
    conn = make_ws_connection()
    assert _parse_iso_date(conn, 9, value, field="last_performed", code="invalid_format") is None
    msg_id, code, text = conn.send_error.call_args[0]
    assert (msg_id, code) == (9, "invalid_format")
    assert "last_performed" in text and "YYYY-MM-DD" in text


def test_parse_iso_date_default_code() -> None:
    conn = make_ws_connection()
    assert _parse_iso_date(conn, 1, "x", field="date") is None
    assert conn.send_error.call_args[0][1] == "invalid_date"


# ─── is_object_entry / get_store / get_coordinator_data ───────────────────


async def test_is_object_entry(hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry) -> None:
    foreign = MockConfigEntry(domain="other", title="Other")
    foreign.add_to_hass(hass)
    assert is_object_entry(None) is False
    assert is_object_entry(foreign) is False
    assert is_object_entry(global_entry) is False
    assert is_object_entry(object_entry) is True


async def test_get_store_and_coordinator_data(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    assert get_store(hass, "nope") is None
    assert get_coordinator_data(hass, "nope") is None
    assert get_store(hass, object_entry.entry_id) is None  # not loaded yet
    await setup_integration(hass, global_entry, object_entry)
    assert get_store(hass, object_entry.entry_id) is object_entry.runtime_data.store
    assert get_coordinator_data(hass, object_entry.entry_id) is object_entry.runtime_data.coordinator.data
    object_entry.runtime_data.coordinator = None
    assert get_coordinator_data(hass, object_entry.entry_id) is None


# ─── async_commit_store ───────────────────────────────────────────────────


async def test_async_commit_store_sequence() -> None:
    rd = MagicMock()
    rd.store.async_save = AsyncMock()
    rd.coordinator.async_refresh_now = AsyncMock()
    await async_commit_store(rd)
    rd.store.async_save.assert_awaited_once()
    rd.coordinator._recalculate_budget_cache.assert_not_called()
    rd.coordinator.async_refresh_now.assert_awaited_once()

    await async_commit_store(rd, budget=True)
    rd.coordinator._recalculate_budget_cache.assert_called_once()

    rd.coordinator = None
    await async_commit_store(rd)  # a store-only runtime still saves, never raises
    assert rd.store.async_save.await_count == 3


# ─── shared schema pieces ─────────────────────────────────────────────────


def test_used_parts_field_defaults_quantity_on_both_paths() -> None:
    """The completion and the history-edit schema share one shape: a bare
    link defaults to quantity 1 (the edit path's stock delta already read a
    missing quantity as 1)."""
    validated = USED_PARTS_FIELD([{"part_id": "p1"}, {"part_id": "p2", "quantity": 2, "entry_id": "e"}])
    assert validated[0]["quantity"] == 1.0 and validated[1]["quantity"] == 2.0
    assert USED_PARTS_FIELD(None) is None
    with pytest.raises(vol.Invalid):
        USED_PARTS_FIELD([{"part_id": "p"}] * 11)
    with pytest.raises(vol.Invalid):
        USED_PARTS_FIELD([{"part_id": "p", "quantity": "2"}])  # strings refused like completion always did


def test_shared_schema_constants_used_by_both_handlers() -> None:
    for name in ("tasks_actions.py", "tasks_history.py"):
        text = (WS_DIR / name).read_text(encoding="utf-8")
        assert "USED_PARTS_FIELD" in text and "READING_VALUES_FIELD" in text, name


# ─── source tripwires ─────────────────────────────────────────────────────


def _ws_sources() -> dict[str, str]:
    return {p.name: p.read_text(encoding="utf-8") for p in WS_DIR.glob("*.py")}


def test_no_inline_task_prologue_in_ws_handlers() -> None:
    """The ``tasks_data = dict(entry.data.get(CONF_TASKS…`` / ``if task_id not
    in tasks_data:`` prologue lives ONLY in ``_load_object_task``."""
    offenders = [
        name
        for name, text in _ws_sources().items()
        if "tasks_data = dict(entry.data.get(CONF_TASKS" in text or "if task_id not in tasks_data:" in text
    ]
    assert not offenders, f"inline task prologue in websocket/: {offenders} — use _load_object_task"


def test_date_fromisoformat_only_in_parse_helper() -> None:
    """``date.fromisoformat`` in the WS layer is ``_parse_iso_date``'s job.

    Documented exceptions: ``dashboard.py`` (schedule preview — out of this
    round's scope) and ``helpers.dates.parse_iso_date`` for non-WS-error
    checks (import sanitisers use that)."""
    pattern = re.compile(r"\bdate(?:_cls)?\.fromisoformat\(")
    offenders = {
        name: len(pattern.findall(text))
        for name, text in _ws_sources().items()
        if pattern.search(text) and name not in ("__init__.py", "dashboard.py")
    }
    assert not offenders, f"inline date.fromisoformat in websocket/: {offenders} — use _parse_iso_date / parse_iso_date"
    init_text = _ws_sources()["__init__.py"]
    assert len(pattern.findall(init_text)) == 1, "exactly one date.fromisoformat call: inside _parse_iso_date"


def test_store_reach_only_via_get_store() -> None:
    """``getattr(rd, "store", None)`` is helpers.aggregate.get_store's spelling —
    no WS module reaches into runtime_data for the Store by hand."""
    offenders = [
        name
        for name, text in _ws_sources().items()
        if 'getattr(rd, "store", None)' in text or 'getattr(entry, "runtime_data", None)' in text
    ]
    assert not offenders, f"hand-rolled Store reach in websocket/: {offenders} — use get_store()"


def test_no_three_part_entry_guard_inline() -> None:
    """``entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID`` is
    ``is_object_entry`` — every WS module goes through the predicate."""
    offenders = [name for name, text in _ws_sources().items() if "entry.unique_id == GLOBAL_UNIQUE_ID" in text]
    assert not offenders, f"inline entry guard in websocket/: {offenders} — use is_object_entry()"


def test_timestamp_and_vacation_caps_are_constants() -> None:
    assert MAX_TIMESTAMP_LENGTH == 64
    assert MAX_VACATION_EXEMPT_TASKS == 2000
    offenders = [name for name, text in _ws_sources().items() if "vol.Length(max=64)" in text]
    assert not offenders, f"literal timestamp cap in websocket/: {offenders} — use MAX_TIMESTAMP_LENGTH"
    for name in ("vacation.py",):
        assert "2000" not in _ws_sources()[name], f"{name}: literal exempt-list cap — use MAX_VACATION_EXEMPT_TASKS"
