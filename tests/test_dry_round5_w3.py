"""DRY audit 2026-10-12, round 5, wave 3 — the consolidation backlog.

Rules spelled out more than once now live in one place. Most of the merge
changes nothing; these tests pin the copies that did differ, so a red test
names the drift that came back:

- the JSON import's own http(s) pre-filter let "HTTPS://…" through, the
  part check refused it, and the whole part was dropped;
- an archived task paused on its own came back from the archive "done today";
- a pause end, an object date and a vacation day were stored as typed
  (``20261231``); a backup's ``paused_until`` with a time resumed at once;
- the CSV import capped labels before dropping duplicates and dropped an
  unknown priority the JSON import kept;
- the settings import took group references of any length and a number for
  a group name;
- a task's documentation link kept its surrounding blanks;
- the WS completion read a completion's day in the offset's zone, the
  coordinator in HA's;
- a fleet part merge dropped ``reuse``, so the carried-over pile counted for
  nothing;
- the "completed by" notification used the login name, voice the person's.
"""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
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


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    g = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options=options,
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    g.add_to_hass(hass)
    return g


def _object(hass: HomeAssistant, *, name: str = "Washer", uid: str = "washer", **task_over: Any) -> MockConfigEntry:
    task = build_task_data(task_id=TASK, interval_days=30, last_performed="2026-09-01", object_id=uid)
    task["name"] = "Change Filter"
    task.update(task_over)
    data = build_object_entry_data(object_data=build_object_data(name=name, object_id=uid), tasks={TASK: task})
    obj = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title=name, data=data, source="user", unique_id=f"maintenance_supporter_{uid}"
    )
    obj.add_to_hass(hass)
    return obj


async def _setup(hass: HomeAssistant, **task_over: Any) -> MockConfigEntry:
    g = _global(hass)
    obj = _object(hass, **task_over)
    await setup_integration(hass, g, obj)
    return obj


def _live(hass: HomeAssistant, entry_id: str) -> Any:
    return hass.config_entries.async_get_entry(entry_id)


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    conn.user.id = "u1"
    conn.user.is_admin = True
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return conn


# ─── part links ──────────────────────────────────────────────────────────


async def test_an_upper_case_shop_link_keeps_its_part(hass: HomeAssistant) -> None:
    """The import's pre-filter read the scheme in any case, the part check
    only in lower case: the whole part was dropped. An over-long link now
    loses only the link."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, _global(hass))
    payload = {
        "objects": [
            {
                "object": {"name": "Imported"},
                "tasks": [],
                "parts": [
                    {"id": "p1", "name": "Filter", "product_url": "HTTPS://shop.example/filter"},
                    {"id": "p2", "name": "Belt", "product_url": "https://shop.example/" + "x" * 600},
                ],
            }
        ]
    }
    res = assert_ws_success(await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)}))
    parts = {p["name"]: p for p in _live(hass, res["imported"][0]["entry_id"]).data[CONF_PARTS].values()}
    assert parts["Filter"]["product_url"] == "HTTPS://shop.example/filter"
    assert "Belt" in parts and not parts["Belt"].get("product_url")


def test_a_backups_stock_and_pile_follow_one_rule() -> None:
    from custom_components.maintenance_supporter.helpers.parts import portable_stock

    reusable = {"reuse": "charge"}
    assert portable_stock(reusable, {"stock": 3, "restoring": 2}) == {"stock": 3, "restoring": 2}
    assert portable_stock({}, {"stock": 3, "restoring": 2}) == {"stock": 3}
    assert portable_stock(reusable, {"stock": 0, "restoring": 0}) == {"stock": 0}
    assert portable_stock(reusable, {"stock": -1, "restoring": 2}) == {}
    assert portable_stock(reusable, {"stock": True}) == {} and portable_stock(reusable, None) == {}


def test_a_fleet_part_merge_keeps_reuse() -> None:
    """The pile of a reusable alias moved over, but the canonical part had
    no ``reuse``: the charging cells counted for nothing."""
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import _merge_parts

    merged = _merge_parts({"id": "batt_aa", "name": "AA"}, {"id": "aa_old", "name": "AA", "reuse": "charge", "package_size": 4})
    assert merged["reuse"] == "charge" and merged["package_size"] == 4


# ─── coming back from the archive ────────────────────────────────────────


async def test_an_archived_self_paused_task_keeps_its_dates(hass: HomeAssistant) -> None:
    """Unarchived, it re-anchored to today although it stays paused: the
    task read "done today"; the end of its own pause restarts it."""
    from custom_components.maintenance_supporter.websocket.tasks_lifecycle import ws_unarchive_task

    entry = await _setup(
        hass,
        archived_at="2026-09-20T00:00:00+00:00",
        archived_reason="manual",
        paused_at="2026-09-10T00:00:00+00:00",
    )
    assert_ws_success(await _ws(hass, ws_unarchive_task, {"type": "x", "entry_id": entry.entry_id, "task_id": TASK}))
    live = _live(hass, entry.entry_id)
    assert live.data[CONF_TASKS][TASK].get("paused_at") is not None
    assert live.runtime_data.store.get_task_state(TASK).get("last_performed") == "2026-09-01"


# ─── dates stored canonical ──────────────────────────────────────────────


async def test_a_pause_end_is_stored_as_a_day(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.objects import ws_pause_object
    from custom_components.maintenance_supporter.websocket.tasks_lifecycle import ws_pause_task

    entry = await _setup(hass)
    res = assert_ws_success(await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": TASK, "until": "20991231"}))
    assert res["paused_until"] == "2099-12-31"
    assert _live(hass, entry.entry_id).data[CONF_TASKS][TASK]["paused_until"] == "2099-12-31"
    assert_ws_success(await _ws(hass, ws_pause_object, {"type": "x", "entry_id": entry.entry_id, "until": "20991130"}))
    assert _live(hass, entry.entry_id).data[CONF_OBJECT]["paused_until"] == "2099-11-30"


def test_a_backups_pause_end_with_a_time_names_its_day() -> None:
    """The import kept a timestamp; the auto-resume could not read it as a
    day and resumed the restored object on its first refresh."""
    from custom_components.maintenance_supporter.helpers.pause import pause_end_day

    assert pause_end_day("2099-12-01T00:00:00") == "2099-12-01"
    assert pause_end_day("2099-12-01T08:00:00Z") == "2099-12-01"
    assert pause_end_day("20991201") == "2099-12-01"
    assert pause_end_day("soon") is None and pause_end_day("") is None and pause_end_day(None) is None


async def test_object_and_vacation_days_are_stored_canonical(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.global_options import get_global_entry
    from custom_components.maintenance_supporter.websocket.objects import ws_create_object
    from custom_components.maintenance_supporter.websocket.vacation import ws_vacation_update

    await setup_integration(hass, _global(hass))
    res = assert_ws_success(await _ws(hass, ws_create_object, {"type": "x", "name": "Boiler", "installation_date": "20240315"}))
    assert _live(hass, res["entry_id"]).data[CONF_OBJECT]["installation_date"] == "2024-03-15"
    day = dt_util.now().date() + timedelta(days=30)
    assert_ws_success(await _ws(hass, ws_vacation_update, {"type": "x", "start": day.strftime("%Y%m%d")}))
    g = get_global_entry(hass)
    assert {**g.data, **g.options}["vacation_start"] == day.isoformat()


# ─── import rules ────────────────────────────────────────────────────────


def test_the_csv_drops_duplicate_labels_before_capping() -> None:
    """The CSV capped the cell to 25 lines first: 30 repeats of one label
    left that single label of the 55 given."""
    from custom_components.maintenance_supporter.const import MAX_LABELS
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    cell = "\n".join(["dup"] * 30 + [f"l{i}" for i in range(MAX_LABELS)])
    (obj,) = import_objects_csv(f'object_name,task_name,interval_days,labels\nShed,Oil,30,"{cell}"\n')
    (task,) = obj["tasks"].values()
    labels = cap_task_fields(dict(task))["labels"]
    assert len(labels) == MAX_LABELS and labels[:2] == ["dup", "l0"]


def test_an_unknown_priority_is_dropped_by_every_import() -> None:
    """The CSV import dropped an unknown priority, the JSON import kept it."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    assert "priority" not in cap_task_fields({"name": "x", "priority": "urgent"})
    assert cap_task_fields({"name": "x", "priority": "high"})["priority"] == "high"
    (obj,) = import_objects_csv("object_name,task_name,interval_days,priority\nShed,Oil,30,High\n")
    (task,) = obj["tasks"].values()
    assert cap_task_fields(dict(task))["priority"] == "high"


async def test_the_settings_import_cleans_groups_like_group_create(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.global_options import get_global_entry
    from custom_components.maintenance_supporter.websocket.io import _apply_settings_import

    await setup_integration(hass, _global(hass))
    raw = {
        "groups": {
            "g1": {"name": " Weekly ", "task_refs": [{"entry_id": "e" * 300, "task_id": "t"}, {"entry_id": "e1", "task_id": "t1"}]},
            "g2": {"name": 42},
        }
    }
    _apply_settings_import(hass, raw)
    g = get_global_entry(hass)
    groups = {**g.data, **g.options}["groups"]
    assert set(groups) == {"g1"}
    assert groups["g1"]["name"] == "Weekly" and groups["g1"]["task_refs"] == [{"entry_id": "e1", "task_id": "t1"}]


async def test_a_task_link_is_trimmed(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task

    entry = await _setup(hass)
    res = assert_ws_success(
        await _ws(
            hass,
            ws_create_task,
            {"type": "x", "entry_id": entry.entry_id, "name": "Oil", "schedule_type": "time_based", "interval_days": 30,
             "documentation_url": "  https://manual.example/oil  "},
        )
    )
    assert _live(hass, entry.entry_id).data[CONF_TASKS][res["task_id"]]["documentation_url"] == "https://manual.example/oil"


# ─── a completion's day ──────────────────────────────────────────────────


@freeze_time("2026-10-17 19:00:00+00:00")  # 12:00 in the test zone (US/Pacific)
async def test_a_completion_day_is_hass_local_everywhere(hass: HomeAssistant) -> None:
    """02:00 UTC on the 17th is the evening of the 16th here: past-dated for
    the coordinator, today for the WS pre-check, which then refused it."""
    from custom_components.maintenance_supporter.helpers.dates import is_past_dated

    assert dt_util.now().date().isoformat() == "2026-10-17"
    assert is_past_dated(datetime(2026, 10, 17, 2, 0, tzinfo=UTC)) is True
    assert is_past_dated(datetime(2026, 10, 17, 8, 0, tzinfo=UTC)) is False
    assert is_past_dated(datetime(2026, 10, 16, 23, 0)) is True  # naive = local
    assert is_past_dated(None) is False


# ─── a person's name ─────────────────────────────────────────────────────


async def test_a_person_is_named_like_voice_names_them(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.assignees import person_display_name

    user = await hass.auth.async_create_user("jane_login")
    assert await person_display_name(hass, user.id) == "jane_login"
    hass.states.async_set("person.jane", "home", {"user_id": user.id, "friendly_name": "Jane"})
    assert await person_display_name(hass, user.id) == "Jane"
    assert await person_display_name(hass, None) is None
    assert await person_display_name(hass, "nobody") is None


@pytest.mark.parametrize("value", ["12", "nan", True, float("inf")])
def test_money_is_a_real_finite_number(value: Any) -> None:
    from custom_components.maintenance_supporter.helpers.history import strict_amount

    assert strict_amount(value) is None
    assert strict_amount(-5) == -5.0 and strict_amount(2.5) == 2.5
