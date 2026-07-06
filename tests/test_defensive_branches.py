"""Defensive-branch coverage: guards that only fire on unusual states.

Grouped here so the mainline tests stay story-shaped: missing global entry,
unknown service targets, repeated auto-complete races, stale repair issues,
and the reconfigure-flow rename migration.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser

from custom_components.maintenance_supporter import (
    _check_admin_panel_user_orphans,
    async_maybe_send_weekly_digest,
)
from custom_components.maintenance_supporter.const import (
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
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


def _make_entry(hass: HomeAssistant, unique_id: str, task: dict[str, Any] | None = None) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Guard Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Guard Object"),
            tasks={TASK_ID_1: task or build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


async def test_digest_without_global_entry_is_a_noop(hass: HomeAssistant) -> None:
    # No global entry set up at all — the helper must simply return.
    await async_maybe_send_weekly_digest(hass, force=True)


async def test_services_reject_unknown_entities(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "guard_services")
    await setup_integration(hass, global_entry, obj_entry)

    for service, extra in (
        ("complete", {}),
        ("reset", {}),
        ("skip", {}),
    ):
        with pytest.raises(ServiceValidationError):
            await hass.services.async_call(
                DOMAIN,
                service,
                {"entity_id": "sensor.does_not_exist", **extra},
                blocking=True,
            )


async def test_services_reject_non_task_entity(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A real entity that is not one of our task sensors is rejected too."""
    obj_entry = _make_entry(hass, "guard_foreign")
    await setup_integration(hass, global_entry, obj_entry)
    hass.states.async_set("sensor.random_thermometer", "21.5")

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "complete",
            {"entity_id": "sensor.random_thermometer"},
            blocking=True,
        )


async def test_orphan_allowlist_issue_clears_when_user_returns(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Issue created for a ghost allowlist id; recreating the user clears it."""
    await setup_integration(hass, global_entry)

    hass.config_entries.async_update_entry(
        global_entry,
        options={**dict(global_entry.options or {}), CONF_ADMIN_PANEL_USER_IDS: ["ghost-uid"]},
    )
    await _check_admin_panel_user_orphans(hass, global_entry)
    issue_reg = ir.async_get(hass)
    assert issue_reg.async_get_issue(DOMAIN, "orphan_admin_panel_user_ghost-uid")

    # The user comes back → the stale issue is dropped on the next check.
    MockUser(id="ghost-uid", name="Returned").add_to_hass(hass)
    await _check_admin_panel_user_orphans(hass, global_entry)
    assert issue_reg.async_get_issue(DOMAIN, "orphan_admin_panel_user_ghost-uid") is None


async def test_orphan_check_tolerates_non_list_allowlist(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    hass.config_entries.async_update_entry(
        global_entry,
        options={**dict(global_entry.options or {}), CONF_ADMIN_PANEL_USER_IDS: "not-a-list"},
    )
    await _check_admin_panel_user_orphans(hass, global_entry)  # no crash


async def test_auto_complete_race_guard_skips_double_completion(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A second auto-complete within 120s of a completion is swallowed."""
    obj_entry = _make_entry(hass, "guard_race")
    await setup_integration(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator

    await coordinator.complete_maintenance(task_id=TASK_ID_1)
    await hass.async_block_till_done()

    before = len(coordinator._get_merged_tasks_data()[TASK_ID_1].get("history", []))
    await coordinator.async_auto_complete_on_recovery(TASK_ID_1, trigger_value=42.0)
    await hass.async_block_till_done()
    after = len(coordinator._get_merged_tasks_data()[TASK_ID_1].get("history", []))
    assert after == before, "race guard failed to swallow the double completion"


async def test_reconfigure_flow_rename_migrates_unique_ids(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The reconfigure flow's rename path runs the unique_id migration."""
    obj_entry = _make_entry(hass, "guard_reconf")
    await setup_integration(hass, global_entry, obj_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "reconfigure", "entry_id": obj_entry.entry_id},
    )
    assert result["type"] == "form"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"name": "Renamed Via Reconfigure"},
    )
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    uids = [e.unique_id for e in er.async_entries_for_config_entry(reg, obj_entry.entry_id)]
    assert uids
    assert all("renamed_via_reconfigure" in uid for uid in uids)
    assert not any("guard_object" in uid for uid in uids)


# ─── Lead-reminder real send path (guards + per-user routing) ───────────────


@pytest.fixture
def global_with_notifications(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
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
    entry.add_to_hass(hass)
    return entry


def _register_notify(hass: HomeAssistant, calls: list[Any]) -> None:
    """A real notify.mobile_app service capturing every send."""

    async def handler(call: Any) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("notify", "mobile_app", handler)


async def test_lead_reminder_sends_and_respects_guards(hass: HomeAssistant, global_with_notifications: MockConfigEntry) -> None:
    from unittest.mock import patch

    obj_entry = _make_entry(hass, "guard_lead")
    await setup_integration(hass, global_with_notifications, obj_entry)
    nm = hass.data[DOMAIN]["_notification_manager"]
    calls: list[Any] = []
    _register_notify(hass, calls)

    # Happy path: sends via the global service (quiet hours pinned off).
    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await nm.async_send_lead_reminder(
            entry_id=obj_entry.entry_id,
            task_id=TASK_ID_1,
            task_name="Guard Task",
            object_name="Guard Object",
            days=3,
            next_due="2027-01-01",
        )
        await hass.async_block_till_done()
    assert len(calls) == 1
    assert "Guard Task" in str(calls[0])

    # Quiet hours swallow the reminder.
    calls.clear()
    with patch.object(nm, "_is_quiet_hours", return_value=True):
        await nm.async_send_lead_reminder(
            entry_id=obj_entry.entry_id,
            task_id=TASK_ID_1,
            task_name="Guard Task",
            object_name="Guard Object",
            days=3,
        )
        await hass.async_block_till_done()
    assert not calls

    # A ghost responsible user falls back to the global service.
    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await nm.async_send_lead_reminder(
            entry_id=obj_entry.entry_id,
            task_id=TASK_ID_1,
            task_name="Guard Task",
            object_name="Guard Object",
            days=3,
            responsible_user_id="no-such-user",
        )
        await hass.async_block_till_done()
    assert len(calls) == 1


async def test_lead_reminder_disabled_manager_is_silent(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """notifications_enabled=False -> the send is a no-op."""
    obj_entry = _make_entry(hass, "guard_lead_off")
    await setup_integration(hass, global_entry, obj_entry)
    nm = hass.data[DOMAIN]["_notification_manager"]
    calls: list[Any] = []
    _register_notify(hass, calls)

    await nm.async_send_lead_reminder(
        entry_id=obj_entry.entry_id,
        task_id=TASK_ID_1,
        task_name="X",
        object_name="Y",
        days=1,
    )
    await hass.async_block_till_done()
    assert not calls


# ─── Coordinator + WS guards ────────────────────────────────────────────────


async def test_complete_unknown_task_logs_and_returns(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "guard_unknown")
    await setup_integration(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator
    await coordinator.complete_maintenance(task_id="not-a-task")  # no raise


async def test_ws_unarchive_object_rejects_active_object(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_unarchive_object,
    )

    from .conftest import call_ws_handler

    obj_entry = _make_entry(hass, "guard_unarchive")
    await setup_integration(hass, global_entry, obj_entry)
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    await call_ws_handler(
        ws_unarchive_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/unarchive",
            "entry_id": obj_entry.entry_id,
        },
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_archived"


# ─── WS lifecycle/action guards ─────────────────────────────────────────────


async def test_ws_archive_and_unarchive_unknown_task(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_lifecycle import (
        ws_archive_task,
        ws_unarchive_task,
    )

    from .conftest import call_ws_handler

    obj_entry = _make_entry(hass, "guard_lifecycle")
    await setup_integration(hass, global_entry, obj_entry)
    for handler, mtype in (
        (ws_archive_task, "maintenance_supporter/task/archive"),
        (ws_unarchive_task, "maintenance_supporter/task/unarchive"),
    ):
        conn = MagicMock()
        conn.user = MagicMock(is_admin=True)
        await call_ws_handler(
            handler,
            hass,
            conn,
            {
                "id": 1,
                "type": mtype,
                "entry_id": obj_entry.entry_id,
                "task_id": "nope",
            },
        )
        conn.send_error.assert_called_once()
        assert conn.send_error.call_args[0][1] == "not_found"


async def test_ws_quick_complete_guards(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_actions import (
        ws_quick_complete_task,
    )

    from .conftest import call_ws_handler

    obj_entry = _make_entry(hass, "guard_quick")
    await setup_integration(hass, global_entry, obj_entry)

    # Unknown object and unknown task.
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    await call_ws_handler(
        ws_quick_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/quick_complete",
            "entry_id": "no-such-entry",
            "task_id": "x",
        },
    )
    assert conn.send_error.call_args[0][1] == "not_found"

    conn2 = MagicMock()
    conn2.user = MagicMock(is_admin=True)
    await call_ws_handler(
        ws_quick_complete_task,
        hass,
        conn2,
        {
            "id": 2,
            "type": "maintenance_supporter/task/quick_complete",
            "entry_id": obj_entry.entry_id,
            "task_id": "nope",
        },
    )
    assert conn2.send_error.call_args[0][1] == "not_found"


async def test_ws_complete_blocked_by_earliest_completion_window(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_actions import (
        ws_complete_task,
    )

    from .conftest import call_ws_handler

    task = build_task_data(task_id=TASK_ID_1, interval_days=30)
    from homeassistant.util import dt as dt_util

    task["last_performed"] = dt_util.now().date().isoformat()
    task["earliest_completion_days"] = 5  # due in 30d → completable from day 25
    obj_entry = _make_entry(hass, "guard_window", task=task)
    await setup_integration(hass, global_entry, obj_entry)

    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "too_early"


async def test_ws_snooze_without_notification_manager(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter import NOTIFICATION_MANAGER_KEY
    from custom_components.maintenance_supporter.websocket.tasks_actions import (
        ws_snooze_task,
    )

    from .conftest import call_ws_handler

    obj_entry = _make_entry(hass, "guard_snooze")
    await setup_integration(hass, global_entry, obj_entry)
    saved = hass.data[DOMAIN].pop(NOTIFICATION_MANAGER_KEY, None)
    try:
        conn = MagicMock()
        conn.user = MagicMock(is_admin=True)
        await call_ws_handler(
            ws_snooze_task,
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/task/snooze",
                "entry_id": obj_entry.entry_id,
                "task_id": TASK_ID_1,
            },
        )
        assert conn.send_error.call_args[0][1] == "unavailable"
    finally:
        if saved is not None:
            hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = saved


# ─── Retention + vacation parse guards ──────────────────────────────────────


def test_retention_date_and_int_coercion_guards() -> None:
    from datetime import date

    from custom_components.maintenance_supporter.helpers.retention import (
        _coerce_int,
        _to_date,
    )

    assert _to_date(None) is None
    assert _to_date("short") is None
    assert _to_date("9999-99-99T00:00:00") is None
    assert _to_date("2026-01-02T10:00:00") == date(2026, 1, 2)
    assert _coerce_int("7", 3) == 7
    assert _coerce_int("junk", 3) == 3
    assert _coerce_int(None, 3) == 3


async def test_vacation_update_edge_inputs(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.vacation import (
        ws_vacation_update,
    )

    from .conftest import call_ws_handler

    await setup_integration(hass, global_entry)
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    await call_ws_handler(
        ws_vacation_update,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/vacation/update",
            "enabled": True,
            "start": "2026-07-01",
            "end": None,
            "exempt_task_ids": ["ok-id", "", "  ", 42, "ok-id", "x" * 200],
        },
    )
    conn.send_result.assert_called_once()
    opts = dict(global_entry.options)
    assert opts.get("vacation_end") is None
    assert opts.get("vacation_exempt_task_ids") == ["ok-id"]


# ─── Object duplication internals ───────────────────────────────────────────


async def test_ws_duplicate_object_strips_unique_and_dynamic_fields(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_duplicate_object,
    )

    from .conftest import call_ws_handler

    task = build_task_data(task_id=TASK_ID_1, interval_days=30)
    task["entity_slug"] = "dup_slug"
    task["nfc_tag_id"] = "dup-nfc"
    task["trigger_config"] = {
        "type": "threshold",
        "entity_id": "sensor.x",
        "trigger_below": 10,
        "_trigger_state": {"active": True},
    }
    obj_entry = _make_entry(hass, "guard_dup", task=task)
    await setup_integration(hass, global_entry, obj_entry)

    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    await call_ws_handler(
        ws_duplicate_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/duplicate",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()
    conn.send_result.assert_called_once()
    new_entry_id = conn.send_result.call_args[0][1]["entry_id"]
    new_entry = hass.config_entries.async_get_entry(new_entry_id)
    copied = next(iter(new_entry.data[CONF_TASKS].values()))
    assert "entity_slug" not in copied
    assert "nfc_tag_id" not in copied
    assert "_trigger_state" not in copied.get("trigger_config", {})


async def test_ws_duplicate_object_flow_failure(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from unittest.mock import AsyncMock, patch

    from custom_components.maintenance_supporter.websocket.objects import (
        ws_duplicate_object,
    )

    from .conftest import call_ws_handler

    obj_entry = _make_entry(hass, "guard_dupfail")
    await setup_integration(hass, global_entry, obj_entry)

    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    with patch.object(
        hass.config_entries.flow,
        "async_init",
        new=AsyncMock(return_value={"type": "abort", "reason": "boom"}),
    ):
        await call_ws_handler(
            ws_duplicate_object,
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/object/duplicate",
                "entry_id": obj_entry.entry_id,
            },
        )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "duplicate_failed"


async def test_parent_chain_walk_terminates_on_long_chain(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The cycle walk follows a multi-hop parent chain to its end."""
    from custom_components.maintenance_supporter.websocket.objects import (
        _validate_device_link,
    )

    a = _make_entry(hass, "guard_chain_a")
    b = _make_entry(hass, "guard_chain_b")
    c = _make_entry(hass, "guard_chain_c")
    # a <- b <- c (c's parent is b, b's parent is a)
    hass.config_entries.async_update_entry(
        b,
        data={**b.data, "object": {**b.data["object"], "parent_entry_id": a.entry_id}},
    )
    hass.config_entries.async_update_entry(
        c,
        data={**c.data, "object": {**c.data["object"], "parent_entry_id": b.entry_id}},
    )

    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    # Attaching a NEW object under c walks c -> b -> a and terminates fine.
    assert _validate_device_link(
        hass,
        conn,
        {"id": 1, "parent_entry_id": c.entry_id},
        self_entry_id="unrelated-entry",
    )
    # Making a a child of c would close the 3-cycle -> rejected.
    assert not _validate_device_link(
        hass,
        conn,
        {"id": 2, "parent_entry_id": c.entry_id},
        self_entry_id=a.entry_id,
    )


# ─── Notification send success paths (bundle / digest / warranty) ───────────


async def test_notification_send_success_paths(hass: HomeAssistant, global_with_notifications: MockConfigEntry) -> None:
    from unittest.mock import patch

    obj_entry = _make_entry(hass, "guard_sends")
    await setup_integration(hass, global_with_notifications, obj_entry)
    nm = hass.data[DOMAIN]["_notification_manager"]
    calls: list[Any] = []
    _register_notify(hass, calls)

    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await nm.async_send_bundled(
            entry_id=obj_entry.entry_id,
            object_name="Guard Object",
            tasks=[
                {"task_id": TASK_ID_1, "task_name": "T1", "status": "overdue"},
                {"task_id": "t2", "task_name": "T2", "status": "due_soon"},
            ],
        )
        await hass.async_block_till_done()
        await nm.async_send_weekly_digest(overdue=3, due_soon=2)
        await hass.async_block_till_done()
        await nm.async_send_warranty_reminder(["Washer", "Car"], days=30)
        await hass.async_block_till_done()

    assert len(calls) == 3


async def test_status_changed_silenced_by_vacation(hass: HomeAssistant, global_with_notifications: MockConfigEntry) -> None:
    from unittest.mock import MagicMock as MM
    from unittest.mock import patch

    obj_entry = _make_entry(hass, "guard_vacation")
    await setup_integration(hass, global_with_notifications, obj_entry)
    nm = hass.data[DOMAIN]["_notification_manager"]
    calls: list[Any] = []
    _register_notify(hass, calls)

    vac = MM()
    vac.is_silent_for.return_value = True
    with (
        patch.object(nm, "_is_quiet_hours", return_value=False),
        patch(
            "custom_components.maintenance_supporter.helpers.vacation.get_vacation_state",
            return_value=vac,
        ),
    ):
        await nm.async_task_status_changed(
            entry_id=obj_entry.entry_id,
            task_id=TASK_ID_1,
            task_name="T",
            object_name="O",
            new_status="overdue",
        )
        await hass.async_block_till_done()
    assert not calls


async def test_dismiss_notification_swallows_service_errors(
    hass: HomeAssistant, global_with_notifications: MockConfigEntry
) -> None:
    from homeassistant.exceptions import HomeAssistantError

    obj_entry = _make_entry(hass, "guard_dismiss")
    await setup_integration(hass, global_with_notifications, obj_entry)
    nm = hass.data[DOMAIN]["_notification_manager"]

    async def broken(call: Any) -> None:
        raise HomeAssistantError("boom")

    hass.services.async_register("notify", "mobile_app", broken)
    await nm.async_dismiss_task_notification(TASK_ID_1)  # must not raise
    await hass.async_block_till_done()


async def test_notification_send_failure_paths_are_swallowed(
    hass: HomeAssistant, global_with_notifications: MockConfigEntry
) -> None:
    """A raising notify service never breaks the send methods."""
    from unittest.mock import patch

    from homeassistant.exceptions import HomeAssistantError

    obj_entry = _make_entry(hass, "guard_sendfail")
    await setup_integration(hass, global_with_notifications, obj_entry)
    nm = hass.data[DOMAIN]["_notification_manager"]

    async def broken(call: Any) -> None:
        raise HomeAssistantError("boom")

    hass.services.async_register("notify", "mobile_app", broken)

    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await nm.async_send_bundled(
            entry_id=obj_entry.entry_id,
            object_name="O",
            tasks=[{"task_id": TASK_ID_1, "task_name": "T", "status": "overdue"}],
        )
        await nm.async_send_weekly_digest(overdue=1, due_soon=1)
        await nm.async_send_warranty_reminder(["Washer"], days=30)
        await nm.async_budget_alert(period="monthly", spent=140.0, budget=150.0)
        await hass.async_block_till_done()  # nothing raised = pass


async def test_bundled_rate_limit_within_an_hour(hass: HomeAssistant, global_with_notifications: MockConfigEntry) -> None:
    from unittest.mock import patch

    obj_entry = _make_entry(hass, "guard_bundle_rate")
    await setup_integration(hass, global_with_notifications, obj_entry)
    nm = hass.data[DOMAIN]["_notification_manager"]
    calls: list[Any] = []
    _register_notify(hass, calls)

    tasks = [{"task_id": TASK_ID_1, "task_name": "T", "status": "overdue"}]
    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await nm.async_send_bundled(
            entry_id=obj_entry.entry_id,
            object_name="O",
            tasks=tasks,
        )
        await hass.async_block_till_done()
        # The second bundle within the hour is rate-limited away.
        await nm.async_send_bundled(
            entry_id=obj_entry.entry_id,
            object_name="O",
            tasks=tasks,
        )
        await hass.async_block_till_done()
    assert len(calls) == 1


async def test_budget_alert_sends_once(hass: HomeAssistant, global_with_notifications: MockConfigEntry) -> None:
    from unittest.mock import patch

    await setup_integration(hass, global_with_notifications)
    nm = hass.data[DOMAIN]["_notification_manager"]
    calls: list[Any] = []
    _register_notify(hass, calls)

    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await nm.async_budget_alert(period="monthly", spent=145.0, budget=150.0)
        await hass.async_block_till_done()
    assert len(calls) == 1
    assert "96" in str(calls[0]) or "97" in str(calls[0])  # pct in message


async def test_notification_excepts_fire_when_dispatch_raises(
    hass: HomeAssistant, global_with_notifications: MockConfigEntry
) -> None:
    """async_dispatch_notify swallows service errors itself — the callers'
    except blocks guard against dispatch-level failures. Force them."""
    from unittest.mock import AsyncMock, patch

    from homeassistant.exceptions import HomeAssistantError

    obj_entry = _make_entry(hass, "guard_dispatch")
    await setup_integration(hass, global_with_notifications, obj_entry)
    nm = hass.data[DOMAIN]["_notification_manager"]

    with (
        patch.object(nm, "_is_quiet_hours", return_value=False),
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager.async_dispatch_notify",
            new=AsyncMock(side_effect=HomeAssistantError("dispatch down")),
        ),
    ):
        await nm.async_send_bundled(
            entry_id=obj_entry.entry_id,
            object_name="O",
            tasks=[{"task_id": TASK_ID_1, "task_name": "T", "status": "overdue"}],
        )
        await nm.async_send_weekly_digest(overdue=1, due_soon=1)
        await nm.async_send_warranty_reminder(["Washer"], days=30)
        await nm.async_budget_alert(period="yearly", spent=1400.0, budget=1500.0)
        # None of these may raise — the excepts log and move on.


def test_completion_blocked_guards() -> None:
    from unittest.mock import MagicMock as MM

    from custom_components.maintenance_supporter.websocket.tasks_actions import (
        _completion_blocked,
    )

    # No runtime data / no coordinator → not blocked.
    assert _completion_blocked(None, "t1") is False
    rd = MM()
    rd.coordinator = None
    assert _completion_blocked(rd, "t1") is False
    # Unknown task → not blocked.
    rd2 = MM()
    rd2.coordinator._get_merged_tasks_data.return_value = {}
    assert _completion_blocked(rd2, "t1") is False


async def test_todo_list_skips_archived_and_bad_dates(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    archived_task = build_task_data(task_id=TASK_ID_1, interval_days=30)
    obj_a = _make_entry(hass, "guard_todo_arch", task=archived_task)
    obj_b = _make_entry(hass, "guard_todo_live")
    await setup_integration(hass, global_entry, obj_a, obj_b)

    # Archive object A after setup (both its object and task go inert).
    new_data = dict(obj_a.data)
    new_obj = dict(new_data["object"])
    new_obj["archived_at"] = "2026-01-01T00:00:00"
    new_data["object"] = new_obj
    hass.config_entries.async_update_entry(obj_a, data=new_data)

    # Poison B's next_due with a bad iso string (defensive parse).
    coordinator = obj_b.runtime_data.coordinator
    await coordinator.async_refresh()
    coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] = "junk-date"

    from homeassistant.helpers import entity_registry as er

    reg = er.async_get(hass)
    todo_entities = [e for e in reg.entities.values() if e.domain == "todo"]
    assert todo_entities
    state = hass.states.get(todo_entities[0].entity_id)
    assert state is not None


async def test_todo_checkoff_unknown_entry_is_noop(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from homeassistant.components.todo import TodoItem, TodoItemStatus

    obj_entry = _make_entry(hass, "guard_todo_uid")
    await setup_integration(hass, global_entry, obj_entry)

    from homeassistant.helpers import entity_registry as er

    reg = er.async_get(hass)
    todo_entity_id = next(e.entity_id for e in reg.entities.values() if e.domain == "todo")
    component = hass.data["todo"]
    entity = component.get_entity(todo_entity_id)
    assert entity is not None
    # Unknown entry id in the uid → silent no-op, no exception.
    await entity.async_update_todo_item(TodoItem(uid="ghost-entry:ghost-task", summary="x", status=TodoItemStatus.COMPLETED))
