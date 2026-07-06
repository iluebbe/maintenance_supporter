"""Journey backlog batch 2: cross-feature interactions + time + repairs.

L1 vacation-exempt cleanup on task delete, H3 year rollover with a Workday
holiday calendar, P2 language-switch follow-through, F1/J1 repair lifecycle
(entity vanishes → issue → returns → clears, across a restart).
See docs/design/user-journeys.md.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_VACATION_EXEMPT_TASK_IDS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.schedule import Schedule
from custom_components.maintenance_supporter.helpers.workday import (
    set_business_day_provider,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
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


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


def _make_entry(hass: HomeAssistant, unique_id: str, task: dict[str, Any] | None = None) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Interaction Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Interaction Object"),
            tasks={TASK_ID_1: task or build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── L1: deleting a task cleans the vacation exempt list ────────────────────


async def test_task_delete_cleans_vacation_exempt_list(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "l1_exempt")
    await setup_integration(hass, global_entry, obj_entry)

    hass.config_entries.async_update_entry(
        global_entry,
        options={
            **dict(global_entry.options or {}),
            CONF_VACATION_EXEMPT_TASK_IDS: [TASK_ID_1, "other-task"],
        },
    )

    await hass.services.async_call(
        DOMAIN,
        "delete_task",
        {"entry_id": obj_entry.entry_id, "task_id": TASK_ID_1},
        blocking=True,
    )
    await hass.async_block_till_done()

    exempt = global_entry.options[CONF_VACATION_EXEMPT_TASK_IDS]
    assert TASK_ID_1 not in exempt, "deleted task id lingers in exempt list"
    assert "other-task" in exempt  # unrelated ids untouched


async def test_options_flow_delete_runs_the_full_cleanup(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The options-flow delete must do the SAME side-state cleanup as the WS
    command / service (it used to be an inline copy that skipped the Store,
    notification state, exempt list, and repair issues)."""
    from homeassistant.data_entry_flow import FlowResultType

    obj_entry = _make_entry(hass, "l1_flow")
    await setup_integration(hass, global_entry, obj_entry)

    hass.config_entries.async_update_entry(
        global_entry,
        options={CONF_VACATION_EXEMPT_TASK_IDS: [TASK_ID_1]},
    )
    store = obj_entry.runtime_data.store
    store.set_last_performed(TASK_ID_1, "2026-01-01")
    await store.async_save()

    result = await hass.config_entries.options.async_init(obj_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "delete_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"confirm": True, "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU
    await hass.async_block_till_done()

    from custom_components.maintenance_supporter.const import CONF_TASKS

    assert TASK_ID_1 not in obj_entry.data[CONF_TASKS]
    assert TASK_ID_1 not in (global_entry.options.get(CONF_VACATION_EXEMPT_TASK_IDS) or []), (
        "options-flow delete left the task on the vacation exempt list"
    )
    assert store.get_last_performed(TASK_ID_1) is None, "options-flow delete left dynamic state in the Store"


# ─── H3: year rollover with a holiday calendar ───────────────────────────────


def test_year_rollover_last_business_day_across_new_year() -> None:
    """Dec 31 is a Friday in 2027; make it a holiday → Dec 30. The NEXT cycle
    lands in the new year and must consult 2028's calendar lazily."""
    holidays = {date(2027, 12, 31), date(2028, 12, 29)}
    set_business_day_provider(lambda d: d.weekday() < 5 and d not in holidays)
    try:
        sched = Schedule.from_dict({"kind": "day_of_month", "day": -1, "business": True})
        dec = sched.next_due(
            last_performed=None,
            created_at=date(2027, 12, 1),
            last_planned_due=None,
            today=date(2027, 12, 1),
        )
        assert dec == date(2027, 12, 30)  # Fri 31 is a holiday → Thu 30

        jan = sched.next_due(
            last_performed=dec,
            created_at=None,
            last_planned_due=None,
            today=dec,
        )
        # Jan 31 2028 is a Monday, no holiday → the plain last business day.
        assert jan == date(2028, 1, 31)

        # And Dec 2028: Sun 31 → Fri 29 is ALSO a holiday → Thu 28.
        nov = date(2028, 12, 1)
        dec28 = sched.next_due(
            last_performed=nov,
            created_at=None,
            last_planned_due=None,
            today=nov,
        )
        assert dec28 == date(2028, 12, 28)
    finally:
        set_business_day_provider(None)


# ─── H2: DST spring-forward × schedule_time ──────────────────────────────────


def test_schedule_time_in_dst_gap_degrades_gracefully() -> None:
    """Europe/Berlin 2027-03-28: 02:00–03:00 local does not exist. A task with
    schedule_time inside that gap must not crash and must still flip to
    overdue the same day (at 03:00, when local time jumps past 02:30)."""
    from unittest.mock import patch
    from zoneinfo import ZoneInfo

    from custom_components.maintenance_supporter.models.maintenance_task import (
        MaintenanceTask,
    )
    from custom_components.maintenance_supporter.const import MaintenanceStatus

    berlin = ZoneInfo("Europe/Berlin")
    task = MaintenanceTask.from_dict(
        {
            "task_id": TASK_ID_1,
            "name": "Gap",
            "type": "custom",
            "interval_days": 7,
            "warning_days": 0,
            "last_performed": "2027-03-21",  # next due exactly on the DST day
            "schedule_time": "02:30",
        }
    )

    def _at(hour: int, minute: int) -> Any:
        from datetime import datetime

        return datetime(2027, 3, 28, hour, minute, tzinfo=berlin)

    with patch(
        "custom_components.maintenance_supporter.models.maintenance_task.dt_util.now",
        return_value=_at(1, 30),
    ):
        assert task.status == MaintenanceStatus.DUE_SOON  # before the gap

    # 03:05 local — the clock has jumped over 02:30; overdue, no crash.
    with patch(
        "custom_components.maintenance_supporter.models.maintenance_task.dt_util.now",
        return_value=_at(3, 5),
    ):
        assert task.status == MaintenanceStatus.OVERDUE


# ─── P2: language switch follows through the backend surfaces ────────────────


async def test_language_switch_reaches_logbook_and_notifications(
    hass: HomeAssistant,
) -> None:
    from homeassistant.core import Event

    from custom_components.maintenance_supporter.const import (
        EVENT_TASK_COMPLETED,
    )
    from custom_components.maintenance_supporter.logbook import (
        async_describe_events,
    )

    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(
            notifications_enabled=True,
            notify_service="notify.mobile_app",
        ),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    obj_entry = _make_entry(hass, "p2_lang")
    await setup_integration(hass, global_entry, obj_entry)

    callbacks: dict[str, Any] = {}
    async_describe_events(hass, lambda _d, et, cb: callbacks.__setitem__(et, cb))
    event = Event(
        EVENT_TASK_COMPLETED,
        {"task_id": TASK_ID_1, "task_name": "T", "object_name": "O"},
    )

    hass.config.language = "en"
    assert callbacks[EVENT_TASK_COMPLETED](event)["message"] == "was completed"

    # The switch: German everywhere, no reload required.
    hass.config.language = "de"
    assert callbacks[EVENT_TASK_COMPLETED](event)["message"] == "wurde erledigt"

    # Notifications localize too: the lead reminder renders German text.
    from unittest.mock import patch

    nm = hass.data[DOMAIN]["_notification_manager"]
    calls: list[Any] = []

    async def handler(call: Any) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("notify", "mobile_app", handler)
    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await nm.async_send_lead_reminder(
            entry_id=obj_entry.entry_id,
            task_id=TASK_ID_1,
            task_name="Filterwechsel",
            object_name="Heizung",
            days=3,
            next_due="2027-01-01",
        )
        await hass.async_block_till_done()
    assert calls
    text = str(calls[0])
    assert "Filterwechsel" in text
    # German message fragment (due-soon strings) — never the English one.
    assert "due" not in text.lower() or "fällig" in text.lower()


# ─── F1: repair replace → restart → the issue stays gone ────────────────────


async def test_repair_replace_then_restart_does_not_reissue(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from unittest.mock import patch

    from custom_components.maintenance_supporter.const import (
        MISSING_ENTITY_THRESHOLD_REFRESHES,
    )
    from custom_components.maintenance_supporter.repairs import (
        MissingTriggerEntityRepairFlow,
    )

    from .journey import simulate_restart

    task = build_task_data(task_id=TASK_ID_1, interval_days=None)
    task["schedule_type"] = "sensor_based"
    task["trigger_config"] = {
        "type": "threshold",
        "entity_id": "sensor.f1_gone",
        "trigger_below": 10,
    }
    obj_entry = _make_entry(hass, "f1_repair", task=task)
    hass.states.async_set("sensor.f1_replacement", "42")
    await setup_integration(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator

    old_issue = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.f1_gone"
    with patch(
        "custom_components.maintenance_supporter.coordinator.STARTUP_GRACE_PERIOD_SECONDS",
        0,
    ):
        for _ in range(MISSING_ENTITY_THRESHOLD_REFRESHES + 1):
            await coordinator.async_refresh()
    issue_reg = ir.async_get(hass)
    assert issue_reg.async_get_issue(DOMAIN, old_issue) is not None

    # User fixes it via the repair flow: replace with the new entity.
    flow = MissingTriggerEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": obj_entry.entry_id,
        "task_id": TASK_ID_1,
        "task_name": "T",
        "object_name": "Interaction Object",
        "entity_id": "sensor.f1_gone",
    }
    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.f1_replacement"})
    assert result["type"] == "create_entry"
    await hass.async_block_till_done()
    # The repairs framework removes the issue when the flow completes; the
    # direct-step test bypass has to do that part itself.
    ir.async_delete_issue(hass, DOMAIN, old_issue)

    # HA restarts. The coordinator's miss counters start from zero — nothing
    # may bring the old issue back, and the healthy replacement raises none.
    await simulate_restart(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator
    with patch(
        "custom_components.maintenance_supporter.coordinator.STARTUP_GRACE_PERIOD_SECONDS",
        0,
    ):
        for _ in range(MISSING_ENTITY_THRESHOLD_REFRESHES + 1):
            await coordinator.async_refresh()

    ours = [i for i in issue_reg.issues.values() if i.domain == DOMAIN and i.issue_id.startswith("missing_trigger_")]
    assert not ours, f"repair issues resurrected after restart: {ours}"


# ─── J1: repair issue lifecycle — entity vanishes, then returns ──────────────


async def test_missing_trigger_entity_issue_clears_when_entity_returns(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.const import (
        MISSING_ENTITY_THRESHOLD_REFRESHES,
        STARTUP_GRACE_PERIOD_SECONDS,
    )

    task = build_task_data(task_id=TASK_ID_1, interval_days=None)
    task["schedule_type"] = "sensor_based"
    task["trigger_config"] = {
        "type": "threshold",
        "entity_id": "sensor.j1_source",
        "trigger_below": 10,
    }
    obj_entry = _make_entry(hass, "j1_repair", task=task)

    # Entity exists at setup...
    hass.states.async_set("sensor.j1_source", "42")
    await setup_integration(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator

    # ...then its integration is removed.
    hass.states.async_remove("sensor.j1_source")

    from unittest.mock import patch

    issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.j1_source"
    with patch(
        "custom_components.maintenance_supporter.coordinator.STARTUP_GRACE_PERIOD_SECONDS",
        0,
    ):
        for _ in range(MISSING_ENTITY_THRESHOLD_REFRESHES + 1):
            await coordinator.async_refresh()
            await hass.async_block_till_done()

    issue_reg = ir.async_get(hass)
    assert issue_reg.async_get_issue(DOMAIN, issue_id) is not None, "missing-entity repair issue never appeared"

    # The user reinstalls the source integration — same entity id returns.
    hass.states.async_set("sensor.j1_source", "42")
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert issue_reg.async_get_issue(DOMAIN, issue_id) is None, "issue did not auto-clear when the entity returned"
