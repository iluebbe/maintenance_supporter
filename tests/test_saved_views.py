"""Saved filter views — shared named filter/sort/group combinations (v2.24).

Backend: a global-entry-stored list of views, listed by any user (read) and
created/deleted with write permission. Everything is re-sanitised on read + save
so a hand-edited entry can't inject unknown keys/values.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_SAVED_FILTER_VIEWS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_SAVED_VIEWS,
)
from custom_components.maintenance_supporter.helpers.saved_views import list_saved_views, sanitize_view

from .conftest import (
    build_global_entry_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


async def _save(hass: HomeAssistant, **msg: object) -> dict:
    from custom_components.maintenance_supporter.websocket.saved_views import ws_save_saved_view

    conn = make_ws_connection()
    await call_ws_handler(ws_save_saved_view, hass, conn, {"id": 1, "type": "x", **msg})
    assert not conn.send_error.called, conn.send_error.call_args
    return conn.send_result.call_args[0][1]


async def _list(hass: HomeAssistant) -> list[dict]:
    from custom_components.maintenance_supporter.websocket.saved_views import ws_list_saved_views

    conn = make_ws_connection()
    await call_ws_handler(ws_list_saved_views, hass, conn, {"id": 1, "type": "x"})
    return conn.send_result.call_args[0][1]["views"]


async def test_list_empty_by_default(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    assert await _list(hass) == []


async def test_save_creates_view_then_lists_it(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    res = await _save(
        hass,
        name="Kitchen overdue",
        filters={"status": "overdue", "group_by": "area", "sort_mode": "area", "archived": False},
    )
    assert res["saved_id"]
    (view,) = res["views"]
    assert view["name"] == "Kitchen overdue"
    assert view["filters"]["status"] == "overdue"
    assert view["filters"]["group_by"] == "area"
    # It persisted on the global entry and re-lists identically.
    assert await _list(hass) == res["views"]


async def test_save_updates_existing_view_in_place(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    created = await _save(hass, name="First", filters={"status": "ok"})
    vid = created["saved_id"]

    updated = await _save(hass, view_id=vid, name="Renamed", filters={"status": "due_soon"})
    assert len(updated["views"]) == 1, "update must not append a duplicate"
    assert updated["views"][0]["id"] == vid
    assert updated["views"][0]["name"] == "Renamed"
    assert updated["views"][0]["filters"]["status"] == "due_soon"


async def test_save_sanitises_unknown_filter_values(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    res = await _save(
        hass,
        name="Junk filters",
        filters={"status": "not-a-status", "sort_mode": "bogus", "group_by": "nope", "user_id": "  "},
    )
    f = res["views"][0]["filters"]
    assert f["status"] == ""  # unknown -> "all"
    assert f["sort_mode"] == "due_date"
    assert f["group_by"] == "none"
    assert f["user_id"] is None


async def test_delete_removes_view(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.saved_views import ws_delete_saved_view

    await setup_integration(hass, global_entry)
    a = await _save(hass, name="A", filters={})
    await _save(hass, name="B", filters={})
    assert len(await _list(hass)) == 2

    conn = make_ws_connection()
    await call_ws_handler(ws_delete_saved_view, hass, conn, {"id": 1, "type": "x", "view_id": a["saved_id"]})
    remaining = conn.send_result.call_args[0][1]["views"]
    assert [v["name"] for v in remaining] == ["B"]


async def test_save_rejects_past_the_cap(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.saved_views import ws_save_saved_view

    await setup_integration(hass, global_entry)
    # Pre-seed the entry with MAX_SAVED_VIEWS views straight on the options.
    seeded = [{"id": f"v{i}", "name": f"View {i}", "filters": {}} for i in range(MAX_SAVED_VIEWS)]
    options = dict(global_entry.options or global_entry.data)
    options[CONF_SAVED_FILTER_VIEWS] = seeded
    hass.config_entries.async_update_entry(global_entry, options=options)
    assert len(await _list(hass)) == MAX_SAVED_VIEWS

    conn = make_ws_connection()
    await call_ws_handler(ws_save_saved_view, hass, conn, {"id": 1, "type": "x", "name": "One too many", "filters": {}})
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "too_many_views"


async def test_views_persist_across_restart(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A saved view survives an entry reload (it lives in entry.options)."""
    await setup_integration(hass, global_entry)
    await _save(hass, name="Durable", filters={"status": "triggered"})

    await hass.config_entries.async_reload(global_entry.entry_id)
    await hass.async_block_till_done()

    views = list_saved_views(hass)
    assert [v["name"] for v in views] == ["Durable"]
    assert views[0]["filters"]["status"] == "triggered"


# ── pure sanitiser ────────────────────────────────────────────────────────────


def test_sanitize_view_rejects_nameless() -> None:
    assert sanitize_view({"filters": {}}) is None
    assert sanitize_view({"name": "   "}) is None
    assert sanitize_view("not-a-dict") is None


def test_sanitize_view_caps_name_and_keeps_id() -> None:
    view = sanitize_view({"id": "keep-me", "name": "x" * 200})
    assert view is not None
    assert view["id"] == "keep-me"
    assert len(view["name"]) == 60  # MAX_VIEW_NAME_LENGTH


def test_sanitize_view_mints_id_when_absent() -> None:
    view = sanitize_view({"name": "Fresh"})
    assert view is not None and view["id"]


def test_label_filter_round_trips_and_is_sanitised() -> None:
    """v2.26: the label dimension survives sanitising; junk is dropped."""
    view = sanitize_view({"name": "Garden", "filters": {"label": " garden "}})
    assert view is not None and view["filters"]["label"] == "garden"
    assert sanitize_view({"name": "X", "filters": {"label": "x" * 100}})["filters"]["label"] is None
    assert sanitize_view({"name": "X", "filters": {"label": 42}})["filters"]["label"] is None
    assert sanitize_view({"name": "X", "filters": {}})["filters"]["label"] is None


def test_view_matches_task_routing_semantics() -> None:
    """Notification routing matches on label + user; status/sort/group are
    display-only; the client-side current_user sentinel means no user filter."""
    from custom_components.maintenance_supporter.helpers.saved_views import view_matches_task

    task = {"labels": ["garden", "safety"], "responsible_user_id": "u1"}
    assert view_matches_task({"label": "garden"}, task) is True
    assert view_matches_task({"label": "kitchen"}, task) is False
    assert view_matches_task({"user_id": "u1"}, task) is True
    assert view_matches_task({"user_id": "u2"}, task) is False
    assert view_matches_task({"user_id": "current_user"}, task) is True  # unresolvable → no filter
    assert view_matches_task({"label": "garden", "user_id": "u1"}, task) is True
    assert view_matches_task({"label": "garden", "user_id": "u2"}, task) is False
    # Display dimensions are ignored.
    assert view_matches_task({"status": "overdue", "sort_mode": "area"}, {"labels": []}) is True
    assert view_matches_task({}, {}) is True


async def test_over_cap_hand_edited_list_not_truncated_on_save_or_delete(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A global entry hand-edited to hold >MAX views must not lose the tail on
    the next save/delete (list_saved_views no longer truncates on read)."""
    from custom_components.maintenance_supporter.websocket.saved_views import ws_delete_saved_view

    over = MAX_SAVED_VIEWS + 5
    seeded = [{"id": f"v{i}", "name": f"View {i}", "filters": {}} for i in range(over)]
    options = dict(global_entry.options or global_entry.data)
    options[CONF_SAVED_FILTER_VIEWS] = seeded
    hass.config_entries.async_update_entry(global_entry, options=options)
    await setup_integration(hass, global_entry)

    assert len(await _list(hass)) == over  # read does not truncate

    # Updating an existing view re-persists the WHOLE list (no silent drop).
    await _save(hass, view_id="v0", name="Renamed", filters={})
    after_save = await _list(hass)
    assert len(after_save) == over
    assert next(v for v in after_save if v["id"] == "v0")["name"] == "Renamed"

    # Deleting one leaves the rest intact.
    conn = make_ws_connection()
    await call_ws_handler(ws_delete_saved_view, hass, conn, {"id": 1, "type": "x", "view_id": "v1"})
    assert len(conn.send_result.call_args[0][1]["views"]) == over - 1
