"""Bug audit 2026-10-16, tranche 1 — the backend half.

- F1: a CSV saved by a spreadsheet as "CSV UTF-8" starts with a byte-order
  mark that glued itself to the first header cell (the panel half, the
  export no longer recognised as CSV, is in the frontend specs).
- F2: the daily sweep deleted every photo filed in the Documents section
  under "Photo" after a day: only the ``photo`` tag marked a completion photo.
- G1: editing a yearly template task (day 1 of September) in the panel or
  the options flow made it monthly — the month restriction was dropped.
- T3: a backdated completion older than the last one reset the triggers
  (runtime hours, delta baseline, counts) like a fresh completion.
- P1: the Undo of an archive or a pause restored the task with a fresh
  cycle from today, clearing overdue and postponed dates.
- Calendar: an overdue task moved onto today is all-day, and a timed event
  that has ended is not the calendar entity's next event.

Each docstring names the failure, so a red test says which bug came back.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_OBJECT,
    CONF_TASKS,
    DOCUMENT_STORE_KEY,
    DOMAIN,
    SIGNAL_TASK_RESET,
)

from .conftest import (
    assert_ws_error,
    assert_ws_success,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_ws_connection,
    setup_integration,
)

TASK = "t1"
YEARLY = {"kind": "day_of_month", "day": 1, "months": [9]}


def _days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


def _object(hass: HomeAssistant, *, uid: str = "boiler", **task_over: Any) -> MockConfigEntry:
    task = build_task_data(task_id=TASK, interval_days=30, last_performed=_days_ago(40), object_id=uid)
    task["name"] = "Annual inspection"
    task.update(task_over)
    if "schedule" in task_over:
        task.pop("interval_days", None)
        task.pop("schedule_type", None)
    data = build_object_entry_data(object_data=build_object_data(name="Boiler", object_id=uid), tasks={TASK: task})
    obj = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title="Boiler", data=data, source="user", unique_id=f"maintenance_supporter_{uid}"
    )
    obj.add_to_hass(hass)
    return obj


async def _setup(hass: HomeAssistant, **task_over: Any) -> MockConfigEntry:
    obj = _object(hass, **task_over)
    await setup_integration(hass, make_global_entry(hass), obj)
    return obj


def _live(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id)


def _task(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    return dict(_live(hass, entry).data[CONF_TASKS][TASK])


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any], *, admin: bool = True) -> Any:
    conn = make_ws_connection()
    conn.user.is_admin = admin
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return conn


# ─── F1: a spreadsheet's byte-order mark ─────────────────────────────────


def test_a_csv_with_a_byte_order_mark_keeps_its_first_column() -> None:
    """The mark glued itself to "object_entry_id": the rows of a replaced
    pair (same name) were grouped by name again and merged into one."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = "\ufeffobject_entry_id,object_name,task_name\nold,Boiler,Service\nnew,Boiler,Service\n"
    objects = import_objects_csv(csv_content)
    assert [o["entry_id"] for o in objects] == ["old", "new"]


# ─── F2: the sweep keeps photos filed in the Documents section ───────────


async def _doc(hass: HomeAssistant, *, completion_photo: bool, content: bytes) -> str:
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await store.async_add_file(
        "boiler", content=content, filename="p.jpg", mime="image/jpeg", tags=["photo"], completion_photo=completion_photo
    )
    return str(doc["id"])


async def test_the_sweep_keeps_a_photo_filed_under_the_photo_category(hass: HomeAssistant, freezer: Any) -> None:
    """A photo uploaded in the Documents section under "Photo" (or with its
    camera button) carries the tag ``photo`` and no links: the daily sweep
    took it for an abandoned completion photo and deleted it after 24 h."""
    from custom_components.maintenance_supporter.helpers.retention import async_run_retention_sweep

    freezer.move_to("2026-10-10 12:00:00")
    await _setup(hass)
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    filed = await _doc(hass, completion_photo=False, content=b"filed")
    orphan = await _doc(hass, completion_photo=True, content=b"orphan")
    freezer.move_to("2026-10-12 12:00:00")
    await async_run_retention_sweep(hass)
    assert docs.get(filed) is not None, "a filed photo was swept"
    assert docs.get(orphan) is None, "an abandoned completion photo stays an orphan to sweep"


async def test_a_household_member_cannot_discard_a_filed_photo(hass: HomeAssistant) -> None:
    """documents/discard_upload (read tier) removed any unlinked ``photo``
    document, a filed one included."""
    from custom_components.maintenance_supporter.websocket.documents import ws_documents_discard_upload

    entry = await _setup(hass)
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    filed = await _doc(hass, completion_photo=False, content=b"filed")
    conn = await _ws(
        hass, ws_documents_discard_upload, {"type": f"{DOMAIN}/documents/discard_upload", "entry_id": entry.entry_id, "doc_id": filed}, admin=False
    )
    assert_ws_error(conn, "not_found")
    assert docs.get(filed) is not None


async def test_the_upload_view_marks_only_completion_photos(
    hass: HomeAssistant, hass_client: Any, hass_read_only_access_token: str
) -> None:
    """The complete dialog says purpose=completion; the Documents section
    does not; a household member can only upload completion photos."""
    from aiohttp import FormData

    from custom_components.maintenance_supporter.views import UPLOAD_URL

    entry = await _setup(hass)
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]

    async def _upload(client: Any, body: bytes, purpose: str | None) -> dict[str, Any]:
        form = FormData()
        form.add_field("entry_id", entry.entry_id)
        form.add_field("tags", "photo")
        if purpose:
            form.add_field("purpose", purpose)
        form.add_field("file", body, filename="p.jpg", content_type="image/jpeg")
        resp = await client.post(UPLOAD_URL, data=form)
        assert resp.status == 200, await resp.text()
        return docs.get((await resp.json())["id"])

    admin = await hass_client()
    assert (await _upload(admin, b"a", "completion")).get("completion_photo") is True
    assert "completion_photo" not in await _upload(admin, b"b", None)
    member = await hass_client(hass_read_only_access_token)
    assert (await _upload(member, b"c", None)).get("completion_photo") is True


# ─── G1: a yearly task stays yearly ──────────────────────────────────────


async def test_a_panel_edit_keeps_the_month_restriction(hass: HomeAssistant) -> None:
    """The dialog sent the pattern without ``months`` and the stored
    schedule was replaced: "day 1 of September" became "day 1 of every
    month". An omitted ``months`` now keeps it; ``[]`` clears it."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    entry = await _setup(hass, schedule=YEARLY)
    base = {"type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": TASK}

    assert_ws_success(await _ws(hass, ws_update_task, {**base, "name": "Boiler service", "schedule": {"kind": "day_of_month", "day": 1}}))
    assert _task(hass, entry)["schedule"]["months"] == [9]

    assert_ws_success(await _ws(hass, ws_update_task, {**base, "schedule": {"kind": "day_of_month", "day": 15, "months": [10]}}))
    assert _task(hass, entry)["schedule"]["months"] == [10]

    assert_ws_success(await _ws(hass, ws_update_task, {**base, "schedule": {"kind": "day_of_month", "day": 15, "months": []}}))
    assert "months" not in _task(hass, entry)["schedule"]

    assert_ws_success(await _ws(hass, ws_update_task, {**base, "schedule": {"kind": "nth_weekday", "nth": 1, "weekday": 5}}))
    assert "months" not in _task(hass, entry)["schedule"], "a new kind starts without the old restriction"


async def test_an_options_flow_edit_keeps_the_month_restriction(hass: HomeAssistant) -> None:
    """The options flow's calendar form has no month field and rebuilt the
    schedule without it: opening the task and saving made it monthly."""
    entry = await _setup(hass, schedule=YEARLY)
    r = await hass.config_entries.options.async_init(entry.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "manage_tasks"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"selected_task": TASK})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "edit_task"})
    assert r["step_id"] == "edit_task"
    unchanged: dict[str, Any] = {}
    for key in r["data_schema"].schema:
        if isinstance(key, vol.Optional | vol.Required) and key.default is not vol.UNDEFINED:
            value = key.default()
            if value is not None:
                unchanged[str(key)] = value
    await hass.config_entries.options.async_configure(r["flow_id"], unchanged)
    await hass.async_block_till_done()
    schedule = _task(hass, entry)["schedule"]
    assert schedule["kind"] == "day_of_month"
    assert schedule["months"] == [9]


# ─── T3: a backfill keeps the trigger progress ───────────────────────────


async def test_a_backfilled_completion_does_not_reset_the_triggers(hass: HomeAssistant) -> None:
    """A completion dated before the last one closes no cycle, but it sent
    the reset signal: a runtime task lost its hours, a delta counter its
    baseline, and a cooldown started."""
    entry = await _setup(hass)
    coordinator = _live(hass, entry).runtime_data.coordinator
    signals: list[int] = []
    async_dispatcher_connect(hass, SIGNAL_TASK_RESET.format(entry_id=entry.entry_id, task_id=TASK), lambda: signals.append(1))

    await coordinator.complete_maintenance(TASK)
    await hass.async_block_till_done()
    assert signals == [1], "a fresh completion resets the triggers"
    coordinator._completion_cooldown.discard(TASK)

    await coordinator.complete_maintenance(TASK, completed_at=dt_util.now() - timedelta(days=20))
    await hass.async_block_till_done()
    assert signals == [1], "the backfill reset the triggers"
    assert not coordinator.in_completion_cooldown(TASK)
    history = coordinator.data[CONF_TASKS][TASK].task["history"]
    assert sum(1 for h in history if h.get("type") == "completed") == 2


# ─── P1: Undo keeps the dates ────────────────────────────────────────────


async def test_undo_of_a_task_archive_keeps_its_dates(hass: HomeAssistant) -> None:
    """Undo (task/unarchive undo) restored an overdue task as due in 30 days."""
    from custom_components.maintenance_supporter.websocket.tasks_lifecycle import ws_archive_task, ws_unarchive_task

    entry = await _setup(hass)
    base = {"entry_id": entry.entry_id, "task_id": TASK}
    store = _live(hass, entry).runtime_data.store
    assert_ws_success(await _ws(hass, ws_archive_task, {"type": f"{DOMAIN}/task/archive", **base}))
    assert_ws_success(await _ws(hass, ws_unarchive_task, {"type": f"{DOMAIN}/task/unarchive", **base, "undo": True}))
    assert store.get_task_state(TASK)["last_performed"] == _days_ago(40)
    assert _live(hass, entry).runtime_data.coordinator.data[CONF_TASKS][TASK].status == "overdue"

    assert_ws_success(await _ws(hass, ws_archive_task, {"type": f"{DOMAIN}/task/archive", **base}))
    assert_ws_success(await _ws(hass, ws_unarchive_task, {"type": f"{DOMAIN}/task/unarchive", **base}))
    assert _live(hass, entry).runtime_data.store.get_task_state(TASK)["last_performed"] == dt_util.now().date().isoformat(), (
        "a plain unarchive still starts a fresh cycle"
    )


async def test_undo_of_a_task_pause_keeps_a_postponed_date(hass: HomeAssistant) -> None:
    """Undo of a pause (task/resume undo) dropped a postpone and re-anchored."""
    from custom_components.maintenance_supporter.websocket.tasks_lifecycle import ws_pause_task, ws_resume_task

    entry = await _setup(hass)
    coordinator = _live(hass, entry).runtime_data.coordinator
    until = dt_util.now().date() + timedelta(days=9)
    await coordinator.async_postpone_task(TASK, until)
    base = {"entry_id": entry.entry_id, "task_id": TASK}
    assert_ws_success(await _ws(hass, ws_pause_task, {"type": f"{DOMAIN}/task/pause", **base}))
    assert_ws_success(await _ws(hass, ws_resume_task, {"type": f"{DOMAIN}/task/resume", **base, "undo": True}))
    data = _live(hass, entry).runtime_data.coordinator.data[CONF_TASKS][TASK]
    assert data.next_due[:10] == until.isoformat()
    assert _live(hass, entry).runtime_data.store.get_task_state(TASK)["last_performed"] == _days_ago(40)


async def test_undo_of_an_object_archive_or_pause_keeps_the_dates(hass: HomeAssistant) -> None:
    """object/unarchive and object/resume with undo keep every task's dates."""
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_archive_object,
        ws_pause_object,
        ws_resume_object,
        ws_unarchive_object,
    )

    entry = await _setup(hass)
    base = {"entry_id": entry.entry_id}
    assert_ws_success(await _ws(hass, ws_archive_object, {"type": f"{DOMAIN}/object/archive", **base}))
    assert_ws_success(await _ws(hass, ws_unarchive_object, {"type": f"{DOMAIN}/object/unarchive", **base, "undo": True}))
    assert _live(hass, entry).runtime_data.store.get_task_state(TASK)["last_performed"] == _days_ago(40)
    assert _live(hass, entry).data[CONF_OBJECT].get("archived_at") is None

    assert_ws_success(await _ws(hass, ws_pause_object, {"type": f"{DOMAIN}/object/pause", **base}))
    assert_ws_success(await _ws(hass, ws_resume_object, {"type": f"{DOMAIN}/object/resume", **base, "undo": True}))
    assert _live(hass, entry).runtime_data.store.get_task_state(TASK)["last_performed"] == _days_ago(40)
    assert _live(hass, entry).data[CONF_OBJECT].get("paused_at") is None
    assert _live(hass, entry).runtime_data.coordinator.data[CONF_TASKS][TASK].status == "overdue"


# ─── Calendar: overdue on today is all-day; an ended event is not next ───


async def test_an_overdue_timed_task_on_today_is_all_day(hass: HomeAssistant, freezer: Any) -> None:
    """With a time of day, the overdue task moved onto today became a
    30-minute event at that time: already over when the day was half gone,
    and the calendar entity showed that ended event as its next one."""
    freezer.move_to(datetime(2026, 10, 16, 15, 0, tzinfo=dt_util.DEFAULT_TIME_ZONE))
    gentry = make_global_entry(hass, options={CONF_ADVANCED_SCHEDULE_TIME: True})
    tasks = {
        TASK: build_task_data(task_id=TASK, name="Descale", interval_days=7, last_performed="2026-10-06", schedule_time="09:00", object_id="espresso"),
        "t_ok": build_task_data(task_id="t_ok", name="Wipe", interval_days=1, last_performed="2026-10-15", schedule_time="08:00", object_id="espresso"),
        "t_next": build_task_data(task_id="t_next", name="Beans", interval_days=2, last_performed="2026-10-15", schedule_time="07:00", object_id="espresso"),
    }
    data = build_object_entry_data(object_data=build_object_data(name="Espresso", object_id="espresso"), tasks=tasks)
    obj = MockConfigEntry(version=1, minor_version=4, domain=DOMAIN, title="Espresso", data=data, source="user", unique_id="maintenance_supporter_espresso")
    obj.add_to_hass(hass)
    await setup_integration(hass, gentry, obj)

    calendar = hass.data[DOMAIN]["_calendar_entity"]
    assert calendar._is_schedule_time_feature_enabled()
    now = dt_util.now()
    events = await calendar.async_get_events(hass, now - timedelta(days=1), now + timedelta(days=3))
    descale = next(e for e in events if " Descale (" in e.summary)
    assert descale.start == date(2026, 10, 16), f"the overdue task is an all-day event today, got {descale.start!r}"
    wipe = next(e for e in events if " Wipe (" in e.summary)
    assert isinstance(wipe.start, datetime) and wipe.start.hour == 8, "a task due today keeps its time"

    calendar._cache_time = None
    nxt = calendar.event
    assert nxt is not None
    assert " Wipe (" not in nxt.summary, "the 08:00 event ended at 08:30 and is not the next one"
