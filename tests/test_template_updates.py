"""2.118 (D#85): what a template has learned since a task was made from it.

"If a template is modified after I have utilized it, am I missing something?"
Each template task records what its template gave it (``origin.applied``)
and in which language; three values per field tell "the template changed"
(offered, ticked) from "the user changed it" (left alone) and "both"
(offered, unticked). Tasks from before 2.118 get their base once, from what
the template ever said (templates_history.py). Later template tasks are
offered to objects made before them; declined offers stay declined.
"""

from __future__ import annotations

import dataclasses
from typing import Any
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS
from custom_components.maintenance_supporter.helpers import template_updates as tu
from custom_components.maintenance_supporter.helpers.task_origin import ORIGIN_KEY, sanitize_origin, template_origin
from custom_components.maintenance_supporter.helpers.template_fingerprint import applied_fingerprints, fingerprint
from custom_components.maintenance_supporter.templates import async_build_template_tasks, build_template_task, get_template_by_id
from custom_components.maintenance_supporter.templates_i18n import localize_template_text
from custom_components.maintenance_supporter.websocket.template_updates import ws_apply_template_updates, ws_template_updates

from .conftest import assert_ws_success, call_ws_handler, make_global_entry, make_object_entry, make_ws_connection, setup_integration

NORTH = tu.Home(hemisphere="north", has_winter=True, country="DE", region=None)


def _tt(template_id: str, key: str):
    template = get_template_by_id(template_id)
    assert template is not None
    return next(tt for tt in template.tasks if tt.key == key)


def _made(template_id: str, key: str, lang: str = "en", home: tu.Home = NORTH, **override: Any) -> dict[str, Any]:
    """A task as the template builds it today, with its 2.118 origin."""
    tt = _tt(template_id, key)
    built = tu.built_task(tt, lang, home)
    task = {"id": "t1", "object_id": "o1", "created_at": "2026-11-02", **built, **override}
    task[ORIGIN_KEY] = template_origin(template_id, tt.key, lang=lang, applied=applied_fingerprints(built))
    return task


def _changed_template(template_id: str, key: str, **fields: Any):
    """Patch one template task (the catalog as a later release would have it)."""
    template = get_template_by_id(template_id)
    assert template is not None
    i = next(i for i, tt in enumerate(template.tasks) if tt.key == key)
    new = dataclasses.replace(template.tasks[i], **fields)
    tasks = [*template.tasks]
    tasks[i] = new
    return patch.object(template, "tasks", tasks)


# ─── the three cases per field ─────────────────────────────────────────────


def test_a_new_template_task_records_its_base_and_language() -> None:
    task = _made("appliance_dishwasher", "Filter Cleaning", "de")
    origin = task[ORIGIN_KEY]
    assert origin["lang"] == "de" and origin["task"] == "Filter Cleaning"
    assert set(origin["applied"]) == {"name", "notes", "recurrence", "warning_days"}
    assert tu.task_changes("t1", task, NORTH, "en") == [], "fresh from the template: nothing to offer"


def test_the_template_changed_and_the_task_did_not_offered_ticked() -> None:
    task = _made("appliance_dishwasher", "Spray Arm Cleaning")
    with _changed_template("appliance_dishwasher", "Spray Arm Cleaning", interval_days=60, notes="Rinse the arms under the tap."):
        changes = {c.field: c for c in tu.task_changes("t1", task, NORTH, "en")}
    assert set(changes) == {"recurrence", "notes"}
    assert not changes["recurrence"].conflict and changes["recurrence"].before == {"kind": "interval", "every": 90}
    assert changes["recurrence"].after == {"kind": "interval", "every": 60}
    assert changes["notes"].before == "" and changes["notes"].after == "Rinse the arms under the tap."


def test_the_user_changed_it_and_the_template_did_not_left_alone() -> None:
    task = _made("appliance_dishwasher", "Spray Arm Cleaning", name="Sprüharme spülen", warning_days=3)
    assert tu.task_changes("t1", task, NORTH, "en") == []


def test_both_changed_offered_unticked() -> None:
    task = _made("appliance_dishwasher", "Spray Arm Cleaning", warning_days=3)
    with _changed_template("appliance_dishwasher", "Spray Arm Cleaning", warning_days=21):
        (change,) = tu.task_changes("t1", task, NORTH, "en")
    assert change.field == "warning_days" and change.conflict is True
    assert change.before == 3 and change.after == 21


def test_a_declined_value_is_not_offered_again_but_a_later_one_is() -> None:
    task = _made("appliance_dishwasher", "Spray Arm Cleaning")
    with _changed_template("appliance_dishwasher", "Spray Arm Cleaning", warning_days=21):
        (change,) = tu.task_changes("t1", task, NORTH, "en")
        task[ORIGIN_KEY]["declined"] = {"warning_days": change.after_fp}
        assert tu.task_changes("t1", task, NORTH, "en") == []
    with _changed_template("appliance_dishwasher", "Spray Arm Cleaning", warning_days=28):
        assert [c.after for c in tu.task_changes("t1", task, NORTH, "en")] == [28]


def test_the_change_comes_in_the_tasks_language() -> None:
    task = _made("appliance_dishwasher", "Spray Arm Cleaning", "de")
    with _changed_template("appliance_dishwasher", "Spray Arm Cleaning", notes="Filter Cleaning"):
        (change,) = tu.task_changes("t1", task, NORTH, "en")
    # The patched note is a catalog string, so its German text is known.
    assert change.after == localize_template_text("Filter Cleaning", "de") != "Filter Cleaning", "German, the task's language"


# ─── tasks made before 2.118 ───────────────────────────────────────────────


def _old_mowing(**override: Any) -> dict[str, Any]:
    """A lawn task as 2.80 made it: every 10 days all year (the window
    came on 2026-09-26), origin without a base."""
    task = {
        "id": "t1",
        "object_id": "o1",
        "type": "cleaning",
        "enabled": True,
        "warning_days": 2,
        "schedule": {"kind": "interval", "every": 10},
        "created_at": "2026-08-01",
        ORIGIN_KEY: {"kind": "template", "template": "garden_lawn", "task": "Mowing"},
    }
    # Everything else as the template says today: only the recurrence is old.
    today = tu.built_task(_tt("garden_lawn", "Mowing"), "en", NORTH)
    task.update({"name": today["name"], "warning_days": today["warning_days"]})
    if today.get("notes"):
        task["notes"] = today["notes"]
    task.update(override)
    return task


def test_an_old_task_holding_an_old_template_value_is_offered_the_new_one() -> None:
    data = {CONF_OBJECT: {"id": "o1", "name": "Lawn", "template_id": "garden_lawn"}, CONF_TASKS: {"t1": _old_mowing()}}
    synced = tu.sync_bases(data, NORTH, "en")
    assert synced is not None
    task = synced[CONF_TASKS]["t1"]
    assert task[ORIGIN_KEY]["lang"] == "en"
    (change,) = tu.task_changes("t1", task, NORTH, "en")
    assert change.field == "recurrence" and not change.conflict
    assert change.after == {"kind": "interval", "every": 10, "season_months": [4, 5, 6, 7, 8, 9, 10]}
    assert tu.sync_bases(synced, NORTH, "en") is None, "once"


def test_an_old_task_the_user_changed_is_theirs() -> None:
    data = {CONF_TASKS: {"t1": _old_mowing(schedule={"kind": "interval", "every": 5})}}
    synced = tu.sync_bases(data, NORTH, "en")
    assert synced is not None
    assert tu.task_changes("t1", synced[CONF_TASKS]["t1"], NORTH, "en") == [], "5 days was never the template's"


def test_where_the_user_made_the_templates_change_the_base_moves_on() -> None:
    task = _made("appliance_dishwasher", "Spray Arm Cleaning")
    with _changed_template("appliance_dishwasher", "Spray Arm Cleaning", warning_days=21):
        task["warning_days"] = 21
        synced = tu.sync_bases({CONF_TASKS: {"t1": task}}, NORTH, "en")
        assert synced is not None
        moved = synced[CONF_TASKS]["t1"][ORIGIN_KEY]["applied"]["warning_days"]
        assert moved == fingerprint(21)
    with _changed_template("appliance_dishwasher", "Spray Arm Cleaning", warning_days=28):
        (change,) = tu.task_changes("t1", synced[CONF_TASKS]["t1"], NORTH, "en")
    assert not change.conflict, "the next change is an update, not a conflict"


def test_the_language_is_read_from_the_name_when_not_recorded() -> None:
    tt = _tt("appliance_dishwasher", "Filter Cleaning")
    german = build_template_task(tt, "de")["name"]
    task = {"name": german, ORIGIN_KEY: {"kind": "template", "template": "appliance_dishwasher", "task": "Filter Cleaning"}}
    assert tu.task_language(task, tt, "en") == "de"
    assert tu.task_language({"name": "Mine", ORIGIN_KEY: task[ORIGIN_KEY]}, tt, "fr") == "fr", "a renamed task: the fallback"


# ─── tasks the template gained ─────────────────────────────────────────────


def _car(created: str, *, declined: list[str] | None = None) -> dict[str, Any]:
    tasks = {}
    for i, key in enumerate(("Oil Change", "Brake Fluid")):
        task = _made("vehicle_car", key, created_at=created)
        task["id"] = f"t{i}"
        tasks[f"t{i}"] = task
    obj = {"id": "o1", "name": "Car", "template_id": "vehicle_car"}
    if declined:
        obj["template_declined"] = declined
    return {CONF_OBJECT: obj, CONF_TASKS: tasks}


def test_a_task_added_after_the_object_was_made_is_offered() -> None:
    offered = [tt.key for tt in tu.new_tasks(_car("2026-08-01"), NORTH)]
    assert "Cabin Air Filter" in offered, "added to the car template on 2026-09-26"
    assert "Oil Change" not in offered and "Brake Fluid" not in offered, "it has those"
    assert all(tu.task_added("vehicle_car", _tt("vehicle_car", k)) > "2026-08-01" for k in offered)


def test_one_the_object_could_have_had_is_not_offered() -> None:
    offered = [tt.key for tt in tu.new_tasks(_car("2026-10-15"), NORTH)]
    assert offered == [], "everything was in the template then: a missing task was deleted or left out"


def test_a_declined_new_task_is_not_offered_again() -> None:
    offered = [tt.key for tt in tu.new_tasks(_car("2026-08-01", declined=["Cabin Air Filter"]), NORTH)]
    assert "Cabin Air Filter" not in offered


def test_a_task_added_from_now_on_carries_its_day() -> None:
    template = get_template_by_id("vehicle_car")
    assert template is not None
    later = dataclasses.replace(template.tasks[0], name="Check Coolant", key="", added="2027-03-01")
    with patch.object(template, "tasks", [*template.tasks, dataclasses.replace(later, key="Check Coolant")]):
        offered = [tt.key for tt in tu.new_tasks(_car("2026-12-01"), NORTH)]
    assert offered == ["Check Coolant"]


def test_every_template_task_has_its_day() -> None:
    """A task added to a template after the freeze must say when (``added``),
    or objects made before it could not be offered it."""
    from custom_components.maintenance_supporter.templates import TEMPLATES

    missing = [(t.id, tt.key) for t in TEMPLATES for tt in t.tasks if tu.task_added(t.id, tt) is None]
    assert missing == []


def test_every_template_key_is_unique_within_its_template() -> None:
    from custom_components.maintenance_supporter.templates import TEMPLATES

    for t in TEMPLATES:
        keys = [tt.key for tt in t.tasks]
        assert len(keys) == len(set(keys)), t.id


# ─── apply ─────────────────────────────────────────────────────────────────


def test_the_recurrence_keeps_the_users_anchor_and_end() -> None:
    task = {"schedule": {"kind": "interval", "every": 10, "anchor": "planned", "ends": {"count": 5}}}
    out = tu.apply_recurrence(task, {"kind": "interval", "every": 10, "season_months": [4, 5, 6]})
    assert out["schedule"] == {"kind": "interval", "every": 10, "anchor": "planned", "season_months": [4, 5, 6], "ends": {"count": 5}}
    other = tu.apply_recurrence(task, {"kind": "day_of_month", "day": 15, "months": [9]})
    assert other["schedule"] == {"kind": "day_of_month", "day": 15, "months": [9]}, "another kind: the template's"


def test_the_origin_keeps_its_fingerprints_and_drops_junk() -> None:
    raw = {"kind": "template", "template": "x", "task": "y", "lang": "de", "applied": {"name": "1234abcd", "bogus": "1234abcd", "notes": 7}, "declined": "no"}
    assert sanitize_origin(raw) == {"kind": "template", "template": "x", "task": "y", "lang": "de", "applied": {"name": "1234abcd"}}


@pytest.fixture
def _home_north():
    # The test home is San Diego (no winter, so no season windows): build
    # for a German home everywhere, setup included.
    with patch("custom_components.maintenance_supporter.websocket.template_updates.async_home", return_value=NORTH), patch(
        "custom_components.maintenance_supporter.helpers.template_updates.async_home", return_value=NORTH
    ):
        yield


async def test_the_panel_reads_and_applies(hass: HomeAssistant, _home_north: None) -> None:
    g = make_global_entry(hass)
    old = _old_mowing()
    keep = _made("garden_lawn", "Weeding", created_at="2026-08-01")
    keep["id"] = "t2"
    obj = make_object_entry(
        hass,
        tasks={"t1": old, "t2": keep},
        name="Lawn",
        unique_id="ms_tplupd_lawn",
        object_data={"id": "o1", "name": "Lawn", "template_id": "garden_lawn", "task_ids": ["t1", "t2"]},
    )
    await setup_integration(hass, g, obj)
    conn = make_ws_connection()
    await call_ws_handler(ws_template_updates, hass, conn, {"id": 1, "type": "maintenance_supporter/template_updates", "entry_id": obj.entry_id})
    got = assert_ws_success(conn)
    assert got["template_id"] == "garden_lawn" and got["template_name"] == "Lawn Care"
    assert [(c["task_id"], c["field"], c["conflict"]) for c in got["changes"]] == [("t1", "recurrence", False)]
    new_keys = [n["key"] for n in got["new_tasks"]]
    assert new_keys == [], "the lawn template had all its tasks by 2026-08-01"

    conn = make_ws_connection()
    await call_ws_handler(
        ws_apply_template_updates,
        hass,
        conn,
        {"id": 2, "type": "maintenance_supporter/template_updates/apply", "entry_id": obj.entry_id, "changes": [{"task_id": "t1", "field": "recurrence", "accept": True}]},
    )
    assert assert_ws_success(conn) == {"applied": 1, "declined": 0, "added": 0}
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None
    task = entry.data[CONF_TASKS]["t1"]
    assert task["schedule"]["season_months"] == [4, 5, 6, 7, 8, 9, 10]
    assert task["name"] == old["name"] and task["warning_days"] == old["warning_days"], "only the field said yes to"
    history = entry.runtime_data.store.get_history("t1")
    assert history[-1]["type"] == "updated" and history[-1]["notes"] == "From the template: recurrence"

    conn = make_ws_connection()
    await call_ws_handler(ws_template_updates, hass, conn, {"id": 3, "type": "maintenance_supporter/template_updates", "entry_id": obj.entry_id})
    assert assert_ws_success(conn)["changes"] == [], "nothing left"


async def test_a_no_is_remembered_and_a_new_task_is_added(hass: HomeAssistant, _home_north: None) -> None:
    g = make_global_entry(hass)
    data = _car("2026-08-01")
    obj = make_object_entry(
        hass,
        tasks=data[CONF_TASKS],
        name="Car",
        unique_id="ms_tplupd_car",
        object_data={**data[CONF_OBJECT], "task_ids": list(data[CONF_TASKS])},
    )
    await setup_integration(hass, g, obj)
    offered = [tt.key for tt in tu.new_tasks(obj.data, NORTH)]
    assert "Cabin Air Filter" in offered and "Roadworthiness Test" in offered, "both came on 2026-09-26"
    assert "Tire Rotation" not in offered, "there from the start: deleted or left out"
    conn = make_ws_connection()
    await call_ws_handler(
        ws_apply_template_updates,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/template_updates/apply",
            "entry_id": obj.entry_id,
            "new_tasks": [{"key": "Cabin Air Filter", "accept": True}, {"key": "Roadworthiness Test", "accept": False}, {"key": "Nonsense", "accept": True}],
        },
    )
    assert assert_ws_success(conn) == {"applied": 0, "declined": 1, "added": 1}
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None
    added = [t for t in entry.data[CONF_TASKS].values() if t.get(ORIGIN_KEY, {}).get("task") == "Cabin Air Filter"]
    assert len(added) == 1 and added[0][ORIGIN_KEY]["applied"] == applied_fingerprints(added[0]), "made with its base"
    assert added[0]["id"] in entry.data[CONF_OBJECT]["task_ids"]
    assert entry.data[CONF_OBJECT]["template_declined"] == ["Roadworthiness Test"]
    left = [tt.key for tt in tu.new_tasks(entry.data, NORTH)]
    assert "Cabin Air Filter" not in left and "Roadworthiness Test" not in left


async def test_building_from_the_gallery_records_the_base(hass: HomeAssistant, _home_north: None) -> None:
    template = get_template_by_id("appliance_dishwasher")
    assert template is not None
    tasks = await async_build_template_tasks(hass, template, "fr", "o1")
    for task in tasks.values():
        assert task[ORIGIN_KEY]["lang"] == "fr"
        assert task[ORIGIN_KEY]["applied"] == applied_fingerprints(task)


# ─── the verb-first names (pkolbus, D#85) ──────────────────────────────────


def test_a_renamed_task_keeps_its_old_name_as_its_key() -> None:
    tt = _tt("garden_lawn", "Mowing")
    assert (tt.name, tt.key) == ("Mow Lawn", "Mowing")
    assert _tt("appliance_dishwasher", "Filter Cleaning").name == "Clean Filter"


def test_an_old_task_is_offered_the_new_name_in_its_own_language() -> None:
    old_de = localize_template_text("Mowing", "de")
    new_de = localize_template_text("Mow Lawn", "de")
    task = _old_mowing(name=old_de)
    synced = tu.sync_bases({CONF_TASKS: {"t1": task}}, NORTH, "en")
    assert synced is not None
    origin = synced[CONF_TASKS]["t1"][ORIGIN_KEY]
    assert origin["lang"] == "de", "read from the old German name"
    changes = {c.field: c for c in tu.task_changes("t1", synced[CONF_TASKS]["t1"], NORTH, "en")}
    if old_de != new_de:
        assert changes["name"].after == new_de and not changes["name"].conflict
    else:
        assert "name" not in changes, "the German name was a verb phrase already"
    english = tu.sync_bases({CONF_TASKS: {"t1": _old_mowing(name="Mowing")}}, NORTH, "en")
    assert english is not None
    (name,) = [c for c in tu.task_changes("t1", english[CONF_TASKS]["t1"], NORTH, "en") if c.field == "name"]
    assert (name.before, name.after, name.conflict) == ("Mowing", "Mow Lawn", False)


def test_a_task_the_user_renamed_is_not_offered_the_new_name() -> None:
    synced = tu.sync_bases({CONF_TASKS: {"t1": _old_mowing(name="Rasen mähen (vorne)")}}, NORTH, "en")
    assert synced is not None
    fields = [c.field for c in tu.task_changes("t1", synced[CONF_TASKS]["t1"], NORTH, "en")]
    assert "name" not in fields and fields == ["recurrence"], "its own name stays; the old recurrence is still offered"


async def test_an_old_task_is_still_found_by_its_old_name(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.task_origin import backfill_origins

    data = {
        CONF_OBJECT: {"id": "o1", "name": "Dishwasher", "template_id": "appliance_dishwasher"},
        CONF_TASKS: {"t1": {"id": "t1", "name": localize_template_text("Filter Cleaning", "fr"), "type": "cleaning"}},
    }
    out = backfill_origins(hass, data)
    assert out is not None
    assert out[CONF_TASKS]["t1"][ORIGIN_KEY] == {"kind": "template", "template": "appliance_dishwasher", "task": "Filter Cleaning"}


def test_an_object_from_before_is_still_recognised_by_its_old_task_names() -> None:
    from custom_components.maintenance_supporter.helpers.template_usage import match_template

    assert match_template("Mein Geschirrspüler", ["Filter Cleaning", "Spray Arm Cleaning", "Descaling"]) == "appliance_dishwasher"


async def test_a_no_to_a_field_is_remembered(hass: HomeAssistant, _home_north: None) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={"t1": _old_mowing()},
        name="Lawn",
        unique_id="ms_tplupd_lawn_no",
        object_data={"id": "o1", "name": "Lawn", "template_id": "garden_lawn", "task_ids": ["t1"]},
    )
    await setup_integration(hass, g, obj)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_apply_template_updates,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/template_updates/apply", "entry_id": obj.entry_id, "changes": [{"task_id": "t1", "field": "recurrence", "accept": False}]},
    )
    assert assert_ws_success(conn) == {"applied": 0, "declined": 1, "added": 0}
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(obj.entry_id)
    assert entry is not None
    task = entry.data[CONF_TASKS]["t1"]
    assert task["schedule"] == {"kind": "interval", "every": 10}, "kept"
    assert set(task[ORIGIN_KEY]["declined"]) == {"recurrence"}
    assert entry.runtime_data.store.get_history("t1") == [], "a no writes no history"
    conn = make_ws_connection()
    await call_ws_handler(ws_template_updates, hass, conn, {"id": 2, "type": "maintenance_supporter/template_updates", "entry_id": obj.entry_id})
    assert assert_ws_success(conn)["changes"] == [], "not offered again"


async def test_the_panel_sees_the_new_tasks_and_takes_a_name_and_a_note(hass: HomeAssistant, _home_north: None) -> None:
    g = make_global_entry(hass)
    # Made before 2.118: the old name, no base yet (the setup gives it one).
    old = _made("vehicle_car", "Oil Change", created_at="2026-08-01", name="Oil Change")
    old[ORIGIN_KEY] = {"kind": "template", "template": "vehicle_car", "task": "Oil Change"}
    plain = make_object_entry(hass, tasks={}, name="Shelf", unique_id="ms_tplupd_plain", object_data={"id": "o9", "name": "Shelf", "task_ids": []})
    car = make_object_entry(
        hass,
        tasks={"t1": old},
        name="Car",
        unique_id="ms_tplupd_car2",
        object_data={"id": "o1", "name": "Car", "template_id": "vehicle_car", "task_ids": ["t1"]},
    )
    await setup_integration(hass, g, plain, car)

    conn = make_ws_connection()
    await call_ws_handler(ws_template_updates, hass, conn, {"id": 1, "type": "maintenance_supporter/template_updates", "entry_id": plain.entry_id})
    assert assert_ws_success(conn) == {"template_id": None, "template_name": None, "changes": [], "new_tasks": []}, "not made from a template"

    conn = make_ws_connection()
    await call_ws_handler(ws_template_updates, hass, conn, {"id": 2, "type": "maintenance_supporter/template_updates", "entry_id": car.entry_id, "language": "de"})
    got = assert_ws_success(conn)
    assert got["template_name"] == localize_template_text("Car", "de"), "the template in the panel's language"
    assert [c["field"] for c in got["changes"]] == ["name"]
    assert got["changes"][0]["after"] == localize_template_text("Change Oil", "en") == "Change Oil", "in the task's language, not the panel's"
    cabin = next(n for n in got["new_tasks"] if n["key"] == "Cabin Air Filter")
    assert cabin["name"] == "Replace Cabin Air Filter" and cabin["schedule"] == {"kind": "interval", "every": 365} and cabin["warning_days"] == 30

    conn = make_ws_connection()
    await call_ws_handler(
        ws_apply_template_updates,
        hass,
        conn,
        {
            "id": 3,
            "type": "maintenance_supporter/template_updates/apply",
            "entry_id": car.entry_id,
            "changes": [
                {"task_id": "t1", "field": "name", "accept": True},
                {"task_id": "t1", "field": "warning_days", "accept": True},
                {"task_id": "nope", "field": "name", "accept": True},
            ],
        },
    )
    assert assert_ws_success(conn) == {"applied": 1, "declined": 0, "added": 0}, "what was not offered is ignored"
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(car.entry_id)
    assert entry is not None
    task = entry.data[CONF_TASKS]["t1"]
    assert task["name"] == "Change Oil" and task["notes"] == old["notes"]
    assert entry.runtime_data.store.get_history("t1")[-1]["notes"] == "From the template: name"


def test_an_object_without_a_stored_template_goes_by_its_tasks_and_odd_origins_are_ignored() -> None:
    task = _made("appliance_dishwasher", "Spray Arm Cleaning")
    assert tu.object_template({CONF_OBJECT: {"name": "Dishwasher"}, CONF_TASKS: {"t1": task}}) == "appliance_dishwasher"
    assert tu.object_template({CONF_OBJECT: {"name": "Shelf"}, CONF_TASKS: {}}) is None
    assert tu.new_tasks({CONF_OBJECT: {"name": "Shelf"}, CONF_TASKS: {}}, NORTH) == []
    for origin in (None, {"kind": "integration"}, {"kind": "template", "template": "no_such"}, {"kind": "template", "template": "vehicle_car", "task": "Gone"}):
        assert tu.template_task(origin) is None, origin
        assert tu.task_changes("t1", {"name": "x", ORIGIN_KEY: origin}, NORTH, "en") == []
