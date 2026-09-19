"""Integration side of the ``calendar`` schedule kind (#187 / D#157).

The coordinator prefetches every referenced calendar entity's events through
``calendar.get_events`` (mocked here with a response-only service) into the
shared cache, installs nothing per entry, and the schedule engine reads the
dates through the provider registered at shared setup. Also pins the WS
create/update round-trip, the friendly-name enrichment on the task summary,
the ``schedule/preview`` on-demand fetch and the config-flow step.
"""

from __future__ import annotations

import time
from datetime import date, datetime, timedelta
from typing import Any

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.config_flow_helpers import (
    CALENDAR_KIND_VALUES,
    calendar_current,
    calendar_schema,
    schedule_from_calendar_input,
)
from custom_components.maintenance_supporter.const import (
    CONF_TASK_NAME,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    MaintenanceTypeEnum,
)
from custom_components.maintenance_supporter.helpers.calendar_source import (
    CALENDAR_OCCURRENCES_KEY,
    CALENDAR_REFRESH_SECONDS,
    all_calendar_entity_ids,
    async_refresh_calendar_occurrences,
    calendar_entity_ids,
    event_start_date,
    occurrences_from_response,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    KIND_CALENDAR,
    calendar_occurrences,
)
from custom_components.maintenance_supporter.websocket import _build_task_summary
from custom_components.maintenance_supporter.websocket.dashboard import ws_schedule_preview
from custom_components.maintenance_supporter.websocket.tasks import ws_create_task, ws_update_task

from .conftest import (
    TASK_ID_1,
    assert_ws_success,
    build_global_entry_data,
    build_object_entry_data,
    call_ws_handler,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

BIO = "calendar.bio_waste"
PAPER = "calendar.paper"


def _iso(d: date) -> str:
    return d.isoformat()


class FakeCalendar:
    """A response-only ``calendar.get_events`` twin with per-entity event lists.

    Our own calendar platform loads HA's ``calendar`` component during setup,
    which registers the REAL ``get_events`` over this fake — so tests call
    :meth:`arm` again after ``setup_integration`` (and after an entry reload)
    before asserting anything that needs the fake's events.
    """

    def __init__(self, hass: HomeAssistant, events: dict[str, list[dict[str, Any]]]) -> None:
        self.hass = hass
        self.events = events
        self.calls: list[dict[str, Any]] = []
        self.fail: set[str] = set()
        self.arm()

    def arm(self) -> None:
        async def _handler(call: ServiceCall) -> ServiceResponse:
            self.calls.append(dict(call.data))
            eid = call.data["entity_id"]
            if eid in self.fail:
                raise HomeAssistantError(f"{eid} is unavailable")
            return {eid: {"events": list(self.events.get(eid, []))}}

        self.hass.services.async_register("calendar", "get_events", _handler, supports_response=SupportsResponse.ONLY)


def _calendar_task(entity_id: str = BIO, **extra: Any) -> dict[str, Any]:
    return {
        "id": TASK_ID_1,
        "name": "Bins out",
        "type": "custom",
        "enabled": True,
        "schedule": {"kind": KIND_CALENDAR, "entity_id": entity_id},
        "warning_days": 1,
        "history": [],
        **extra,
    }


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# ─── pure helpers ────────────────────────────────────────────────────────


def test_event_start_date_handles_all_day_timed_and_garbage() -> None:
    assert event_start_date("2026-09-22") == date(2026, 9, 22)
    # A timed event is taken on its LOCAL start date (the test harness runs in
    # US/Pacific, so 04:00 UTC is still the evening BEFORE locally).
    local = dt_util.as_local(datetime(2026, 9, 22, 4, tzinfo=dt_util.UTC)).date()
    assert event_start_date("2026-09-22T04:00:00+00:00") == local
    assert event_start_date(datetime(2026, 9, 22, 4, tzinfo=dt_util.UTC)) == local
    assert event_start_date("2026-09-22T20:00:00+00:00") == date(2026, 9, 22)
    assert event_start_date(date(2026, 9, 22)) == date(2026, 9, 22)
    for bad in ("", "  ", "not-a-date", "2026-13-40", None, 5):
        assert event_start_date(bad) is None


def test_occurrences_from_response_sorts_dedupes_and_tolerates_shape() -> None:
    resp = {BIO: {"events": [{"start": "2026-10-06"}, {"start": "2026-09-22"}, {"start": "2026-09-22T20:00:00+00:00"}, "junk", {"start": None}]}}
    assert occurrences_from_response(BIO, resp) == (date(2026, 9, 22), date(2026, 10, 6))
    assert occurrences_from_response(BIO, {}) == ()
    assert occurrences_from_response(BIO, {BIO: {"events": "nope"}}) == ()
    assert occurrences_from_response(BIO, None) == ()


def test_calendar_entity_ids_collects_only_calendar_kind_schedules() -> None:
    tasks = {
        "a": _calendar_task(BIO),
        "b": _calendar_task(PAPER),
        "c": {"schedule": {"kind": "weekdays", "weekdays": [0]}},
        "d": {"schedule": {"kind": KIND_CALENDAR, "entity_id": "sensor.nope"}},
        "e": {"schedule": {"kind": KIND_CALENDAR}},
        "f": "garbage",
    }
    assert calendar_entity_ids(tasks) == {BIO, PAPER}


# ─── coordinator prefetch ────────────────────────────────────────────────


async def test_coordinator_prefetches_events_and_task_comes_due_once_per_event(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    today = dt_util.now().date()
    nxt = today + timedelta(days=3)
    later = today + timedelta(days=17)
    cal = FakeCalendar(hass, {BIO: [{"start": _iso(today - timedelta(days=11)), "end": _iso(today - timedelta(days=10)), "summary": "Bio"}, {"start": _iso(nxt)}, {"start": _iso(later)}]})
    entry = make_object_entry(hass, tasks={TASK_ID_1: _calendar_task(created_at=_iso(today - timedelta(days=30)))}, uid="cal_prefetch")
    await setup_integration(hass, global_entry, entry)
    cal.arm()
    coordinator = entry.runtime_data.coordinator
    await coordinator.async_refresh_now()

    # The shared cache was warmed from this object's refresh …
    assert calendar_occurrences(BIO) == (today - timedelta(days=11), nxt, later)
    assert all_calendar_entity_ids(hass) == {BIO}
    assert cal.calls, "calendar.get_events was called"
    call = cal.calls[-1]
    assert call["entity_id"] == BIO
    assert dt_util.parse_datetime(call["start_date_time"]) < dt_util.now() - timedelta(days=59)
    assert dt_util.parse_datetime(call["end_date_time"]) > dt_util.now() + timedelta(days=399)

    # … and the never-done task is overdue: its first occurrence on/after
    # created_at is the pickup 11 days ago (#30 semantics: visibly overdue).
    task = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task["_next_due"] == _iso(today - timedelta(days=11))
    assert task["_status"] == MaintenanceStatus.OVERDUE

    # Completing it moves to the NEXT event — not back onto the handled one.
    await coordinator.complete_maintenance(TASK_ID_1, notes=None, unattended=True)
    await hass.async_block_till_done()
    task = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task["_next_due"] == _iso(nxt)
    assert task["_status"] == MaintenanceStatus.OK


async def test_refresh_is_cached_for_15_minutes_and_forced_by_user_refresh(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    today = dt_util.now().date()
    cal = FakeCalendar(hass, {BIO: [{"start": _iso(today + timedelta(days=2))}]})
    entry = make_object_entry(hass, tasks={TASK_ID_1: _calendar_task()}, uid="cal_cache")
    await setup_integration(hass, global_entry, entry)
    cal.arm()
    coordinator = entry.runtime_data.coordinator
    await coordinator.async_refresh_now()
    n = len(cal.calls)
    assert n >= 1
    assert calendar_occurrences(BIO) == (today + timedelta(days=2),)

    # A plain periodic refresh within the window hits the cache.
    await coordinator.async_refresh()
    assert len(cal.calls) == n

    # A user action refetches this object's calendars right away.
    cal.events[BIO] = [{"start": _iso(today + timedelta(days=5))}]
    await coordinator.async_refresh_now()
    assert len(cal.calls) == n + 1
    assert calendar_occurrences(BIO) == (today + timedelta(days=5),)

    # An aged cache entry is refetched by the periodic refresh.
    hass.data[DOMAIN][CALENDAR_OCCURRENCES_KEY][BIO]["fetched"] = time.monotonic() - CALENDAR_REFRESH_SECONDS - 1
    await coordinator.async_refresh()
    assert len(cal.calls) == n + 2


async def test_fetch_failure_keeps_previous_dates(hass: HomeAssistant, global_entry: MockConfigEntry, caplog: pytest.LogCaptureFixture) -> None:
    today = dt_util.now().date()
    cal = FakeCalendar(hass, {BIO: [{"start": _iso(today + timedelta(days=2))}]})
    entry = make_object_entry(hass, tasks={TASK_ID_1: _calendar_task()}, uid="cal_fail")
    await setup_integration(hass, global_entry, entry)
    cal.arm()
    coordinator = entry.runtime_data.coordinator
    await coordinator.async_refresh_now()
    assert calendar_occurrences(BIO) == (today + timedelta(days=2),)

    caplog.clear()
    cal.fail.add(BIO)
    await coordinator.async_refresh_now()
    await coordinator.async_refresh_now()
    assert calendar_occurrences(BIO) == (today + timedelta(days=2),), "a flapping calendar must not wipe the cache"
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] == _iso(today + timedelta(days=2))
    # Logged at debug, once — not again for the repeated failure.
    failures = [r for r in caplog.records if "Could not read events" in r.getMessage()]
    assert len(failures) == 1 and failures[0].levelname == "DEBUG"
    # Once the calendar answers again the log gate re-arms.
    cal.fail.clear()
    await coordinator.async_refresh_now()
    cal.fail.add(BIO)
    await coordinator.async_refresh_now()
    assert len([r for r in caplog.records if "Could not read events" in r.getMessage()]) == 2


async def test_missing_calendar_service_means_no_dates_not_a_crash(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    entry = make_object_entry(hass, tasks={TASK_ID_1: _calendar_task()}, uid="cal_nosvc")
    await setup_integration(hass, global_entry, entry)
    task = entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task["_next_due"] is None
    assert task["_status"] == MaintenanceStatus.OK
    assert calendar_occurrences(BIO) == ()


async def test_cache_is_shared_across_entries(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Two objects on the same calendar: one fetch, both read it."""
    today = dt_util.now().date()
    cal = FakeCalendar(hass, {BIO: [{"start": _iso(today + timedelta(days=1))}], PAPER: [{"start": _iso(today + timedelta(days=4))}]})
    e1 = make_object_entry(hass, tasks={TASK_ID_1: _calendar_task(BIO)}, name="Kitchen", uid="cal_shared_1")
    e2 = make_object_entry(hass, tasks={"t2": _calendar_task(PAPER, id="t2"), "t3": _calendar_task(BIO, id="t3")}, name="Garage", uid="cal_shared_2")
    await setup_integration(hass, global_entry, e1, e2)
    cal.arm()
    cal.calls.clear()
    # Drop what the real service left behind so both calendars count as stale:
    # ONE object's refresh fetches every referenced calendar, once each.
    hass.data[DOMAIN][CALENDAR_OCCURRENCES_KEY].clear()
    await e1.runtime_data.coordinator.async_refresh_now()
    assert sorted(c["entity_id"] for c in cal.calls) == [BIO, PAPER]
    await e2.runtime_data.coordinator.async_refresh()
    assert len(cal.calls) == 2, "the second object reads the shared cache"
    assert e1.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] == _iso(today + timedelta(days=1))
    assert e2.runtime_data.coordinator.data[CONF_TASKS]["t2"]["_next_due"] == _iso(today + timedelta(days=4))
    assert e2.runtime_data.coordinator.data[CONF_TASKS]["t3"]["_next_due"] == _iso(today + timedelta(days=1))


async def test_removing_the_last_entry_removes_the_provider(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The shared runtime goes with the last REGISTERED entry (a plain unload
    keeps it, as for the notification manager) — and the provider with it."""
    from custom_components.maintenance_supporter.helpers import schedule as schedule_mod

    today = dt_util.now().date()
    cal = FakeCalendar(hass, {BIO: [{"start": _iso(today + timedelta(days=1))}]})
    entry = make_object_entry(hass, tasks={TASK_ID_1: _calendar_task()}, uid="cal_unload")
    await setup_integration(hass, global_entry, entry)
    cal.arm()
    await entry.runtime_data.coordinator.async_refresh_now()
    assert calendar_occurrences(BIO) != ()
    assert schedule_mod._calendar_provider is not None
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert schedule_mod._calendar_provider is not None, "the global entry is still registered"
    await hass.config_entries.async_remove(global_entry.entry_id)
    await hass.async_block_till_done()
    assert schedule_mod._calendar_provider is None
    assert calendar_occurrences(BIO) == ()


async def test_refresh_helper_direct_no_stale_no_call(hass: HomeAssistant) -> None:
    cal = FakeCalendar(hass, {BIO: []})
    hass.data.setdefault(DOMAIN, {})
    await async_refresh_calendar_occurrences(hass, [BIO])
    assert len(cal.calls) == 1
    await async_refresh_calendar_occurrences(hass, [BIO])
    assert len(cal.calls) == 1
    await async_refresh_calendar_occurrences(hass, [BIO], force={BIO})
    assert len(cal.calls) == 2
    await async_refresh_calendar_occurrences(hass, [])
    assert len(cal.calls) == 2


# ─── WS surface ──────────────────────────────────────────────────────────


async def test_ws_create_update_roundtrip_and_summary_name(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    today = dt_util.now().date()
    cal = FakeCalendar(hass, {BIO: [{"start": _iso(today + timedelta(days=2))}], PAPER: [{"start": _iso(today + timedelta(days=6))}]})
    hass.states.async_set(BIO, "off", {"friendly_name": "Bio waste"})
    entry = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN, title="Kitchen",
        data=build_object_entry_data(tasks={}), source="user", unique_id="maintenance_supporter_cal_ws",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)
    cal.arm()

    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task, hass, conn,
        {"id": 1, "type": f"{DOMAIN}/task/create", "entry_id": entry.entry_id, "name": "Bins out",
         "schedule": {"kind": "calendar", "entity_id": BIO, "offset": -1, "season_months": [1, 12]}},
    )
    task_id = assert_ws_success(conn)["task_id"]
    await hass.async_block_till_done()
    stored = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][task_id]
    assert stored["schedule"] == {"kind": "calendar", "entity_id": BIO, "offset": -1, "season_months": [1, 12]}
    assert "interval_days" not in stored and "schedule_type" not in stored

    summary = _build_task_summary(hass, task_id, stored, None)
    assert summary["schedule_type"] == "calendar"
    assert summary["schedule"]["entity_id"] == BIO
    assert summary["schedule_entity_name"] == "Bio waste"

    # Non-recurrence edits keep the calendar schedule; a schedule edit switches the entity.
    conn = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn, {"id": 2, "type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": task_id, "warning_days": 3})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    stored = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][task_id]
    assert stored["schedule"]["entity_id"] == BIO and stored["warning_days"] == 3

    conn = make_ws_connection()
    await call_ws_handler(ws_update_task, hass, conn, {"id": 3, "type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": task_id, "schedule": {"kind": "calendar", "entity_id": PAPER}})
    assert_ws_success(conn)
    await hass.async_block_till_done()
    stored = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][task_id]
    assert stored["schedule"] == {"kind": "calendar", "entity_id": PAPER}
    # The reloaded coordinator fetched the new calendar and computed a date from it.
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    cal.arm()
    await entry.runtime_data.coordinator.async_refresh_now()
    assert entry.runtime_data.coordinator.data[CONF_TASKS][task_id]["_next_due"] == _iso(today + timedelta(days=6))
    # A summary without a loaded calendar state omits the name rather than inventing one.
    assert "schedule_entity_name" not in _build_task_summary(hass, task_id, stored, None)


async def test_schedule_preview_fetches_the_calendar_on_demand(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    today = dt_util.now().date()
    cal = FakeCalendar(hass, {BIO: [{"start": _iso(today + timedelta(days=2))}, {"start": _iso(today + timedelta(days=16))}, {"start": _iso(today + timedelta(days=30))}]})
    await setup_integration(hass, global_entry)
    cal.arm()
    cal.calls.clear()
    conn = make_ws_connection()
    await call_ws_handler(ws_schedule_preview, hass, conn, {"id": 1, "type": f"{DOMAIN}/schedule/preview", "schedule": {"kind": "calendar", "entity_id": BIO}})
    res = assert_ws_success(conn)
    assert res["occurrences"] == [_iso(today + timedelta(days=2)), _iso(today + timedelta(days=16)), _iso(today + timedelta(days=30))]
    assert res["series_ended"] is False
    assert len(cal.calls) == 1
    # With a last completion on the first pickup the preview starts at the next one.
    conn = make_ws_connection()
    await call_ws_handler(ws_schedule_preview, hass, conn, {"id": 2, "type": f"{DOMAIN}/schedule/preview", "schedule": {"kind": "calendar", "entity_id": BIO}, "last_performed": _iso(today + timedelta(days=2))})
    res = assert_ws_success(conn)
    assert res["occurrences"] == [_iso(today + timedelta(days=16)), _iso(today + timedelta(days=30))]
    assert res["series_ended"] is False
    assert len(cal.calls) == 1, "second preview within the window reads the cache"


# ─── config / options flow ───────────────────────────────────────────────


def test_flow_helpers_offer_the_kind() -> None:
    assert KIND_CALENDAR in CALENDAR_KIND_VALUES
    schema = calendar_schema(KIND_CALENDAR)
    assert {str(k) for k in schema.schema} == {"entity_id", "offset"}
    assert schedule_from_calendar_input(KIND_CALENDAR, {"entity_id": BIO, "offset": -1}) == {"kind": "calendar", "entity_id": BIO, "offset": -1}
    assert schedule_from_calendar_input(KIND_CALENDAR, {"entity_id": "sensor.x"}) is None
    assert schedule_from_calendar_input(KIND_CALENDAR, {}) is None
    assert calendar_current({"schedule": {"kind": "calendar", "entity_id": BIO}})["entity_id"] == BIO
    prefilled = calendar_schema(KIND_CALENDAR, calendar_current({"schedule": {"kind": "calendar", "entity_id": BIO}}))
    entity_key = next(k for k in prefilled.schema if str(k) == "entity_id")
    assert entity_key.default() == BIO


async def test_setup_flow_calendar_entity_kind(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from .test_config_flow import _navigate_to_add_task

    await setup_integration(hass, global_entry)
    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_NAME: "Bins out", CONF_TASK_TYPE: MaintenanceTypeEnum.CUSTOM, CONF_TASK_SCHEDULE_TYPE: "calendar"},
    )
    assert result["step_id"] == "calendar"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={"entity_id": BIO, "offset": -1, CONF_TASK_WARNING_DAYS: 1}
    )
    assert result["type"] == FlowResultType.MENU and result["step_id"] == "task_menu"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "finish"})
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = next(iter(result["data"][CONF_TASKS].values()))
    assert task["schedule"] == {"kind": "calendar", "entity_id": BIO, "offset": -1}
    assert result["flow_id"]  # silence "unused" on config_entries import paths
    assert config_entries.SOURCE_USER == "user"
