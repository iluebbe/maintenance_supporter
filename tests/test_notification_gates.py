"""The per-task notification gates live in ONE place (DRY review 2026-09-12).

``helpers.notification_gates.task_may_notify`` applies the global switch, the
per-task mute (#173), the per-status reminder toggle, the saved-view scope,
vacation mode and the snooze — each only for the kinds whose ``KindSpec``
declares it — and names the blocking gate. The bundle path used to enforce
none of its declared gates itself (it relied on the coordinator's
pre-filter); it now filters its members through the same function, so a
snoozed or muted task never rides inside a bundle even when the bundle is
sent directly.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_SCOPE_VIEW_ID,
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_gates import (
    STATUS_ENABLED_KEYS,
    GateResult,
    status_reminder_enabled,
    task_may_notify,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager, notification_key
from custom_components.maintenance_supporter.helpers.notify_hooks import (
    KIND_BUNDLE,
    KIND_COMPLETED,
    KIND_LEAD_TIME,
    KIND_STATUS,
    NOTIFICATION_KINDS,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_task_data,
    make_global_entry,
    make_object_entry,
)

_TASK_KINDS = (KIND_STATUS, KIND_LEAD_TIME, KIND_BUNDLE, KIND_COMPLETED)


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    return make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, **options},
    )


def _object(hass: HomeAssistant, tasks: dict[str, dict[str, Any]], *, uid: str) -> MockConfigEntry:
    return make_object_entry(hass, tasks=tasks, name="Pool Pump", uid=uid)


class _Manager:
    """The two things the gate consults on the manager."""

    def __init__(self, *, enabled: bool = True, snoozed: bool = False) -> None:
        self.enabled = enabled
        self._snoozed = snoozed

    def is_snoozed(self, entry_id: str, task_id: str, status: str) -> bool:
        return self._snoozed


class _Vacation:
    def __init__(self, silent: bool) -> None:
        self._silent = silent

    def is_silent_for(self, task_id: str) -> bool:
        return self._silent


def _gate(hass: HomeAssistant, kind: str, task: dict[str, Any] | None = None, *, status: str = MaintenanceStatus.OVERDUE, manager: Any = None) -> GateResult:
    return task_may_notify(hass, "entry", TASK_ID_1, status, task or {}, kind=kind, manager=manager or _Manager())


def test_gate_result_is_truthy_only_when_allowed() -> None:
    assert GateResult(True)
    assert not GateResult(False, "snooze")
    assert GateResult(False, "snooze").blocked_by == "snooze"


def test_status_reminder_toggle_reads_the_registry_default() -> None:
    assert status_reminder_enabled({}, MaintenanceStatus.OVERDUE) is True
    assert status_reminder_enabled({CONF_NOTIFY_OVERDUE_ENABLED: False}, MaintenanceStatus.OVERDUE) is False
    assert status_reminder_enabled({}, "bogus") is False
    assert set(STATUS_ENABLED_KEYS) == {MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED}


@pytest.mark.parametrize("kind", _TASK_KINDS)
async def test_global_switch_gates_every_kind_that_declares_it(hass: HomeAssistant, kind: str) -> None:
    _global(hass)
    result = _gate(hass, kind, manager=_Manager(enabled=False))
    assert bool(result) is ("enabled" not in NOTIFICATION_KINDS[kind].gates)
    if not result:
        assert result.blocked_by == "enabled"


@pytest.mark.parametrize("kind", _TASK_KINDS)
async def test_per_task_mute_gates_per_kind_flags(hass: HomeAssistant, kind: str) -> None:
    _global(hass)
    muted = {"name": "Filter", "notify_enabled": False}
    result = _gate(hass, kind, muted)
    assert bool(result) is ("task_mute" not in NOTIFICATION_KINDS[kind].gates)
    if not result:
        assert result.blocked_by == "task_mute"
    assert _gate(hass, kind, {"name": "Filter"}), "an unmuted task passes"


@pytest.mark.parametrize("kind", _TASK_KINDS)
async def test_status_toggle_gates_only_the_status_kind(hass: HomeAssistant, kind: str) -> None:
    _global(hass, **{CONF_NOTIFY_OVERDUE_ENABLED: False})
    result = _gate(hass, kind, status=MaintenanceStatus.OVERDUE)
    assert bool(result) is (kind != KIND_STATUS)
    if not result:
        assert result.blocked_by == "kind_enabled"
    assert _gate(hass, kind, status=MaintenanceStatus.DUE_SOON), "the due-soon toggle is still on"


@pytest.mark.parametrize("kind", _TASK_KINDS)
async def test_saved_view_scope_gates_per_kind_flags(hass: HomeAssistant, kind: str) -> None:
    _global(hass, **{CONF_NOTIFY_SCOPE_VIEW_ID: "v1"})
    views = [{"id": "v1", "name": "Kitchen", "filters": {"label": "kitchen"}}]
    with patch("custom_components.maintenance_supporter.helpers.saved_views.list_saved_views", return_value=views):
        outside = _gate(hass, kind, {"name": "Filter", "labels": ["garden"]})
        inside = _gate(hass, kind, {"name": "Filter", "labels": ["kitchen"]})
    assert inside
    assert bool(outside) is ("scope" not in NOTIFICATION_KINDS[kind].gates)
    if not outside:
        assert outside.blocked_by == "scope"


async def test_stale_scope_view_never_silences_everything(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_SCOPE_VIEW_ID: "gone"})
    with patch("custom_components.maintenance_supporter.helpers.saved_views.list_saved_views", return_value=[]):
        assert _gate(hass, KIND_STATUS, {"name": "Filter", "labels": []})


@pytest.mark.parametrize("kind", _TASK_KINDS)
async def test_vacation_gates_per_kind_flags(hass: HomeAssistant, kind: str) -> None:
    _global(hass)
    with patch("custom_components.maintenance_supporter.helpers.vacation.get_vacation_state", return_value=_Vacation(True)):
        result = _gate(hass, kind)
    assert bool(result) is ("vacation" not in NOTIFICATION_KINDS[kind].gates)
    if not result:
        assert result.blocked_by == "vacation"


@pytest.mark.parametrize("kind", _TASK_KINDS)
async def test_snooze_gates_per_kind_flags(hass: HomeAssistant, kind: str) -> None:
    _global(hass)
    result = _gate(hass, kind, manager=_Manager(snoozed=True))
    assert bool(result) is ("snooze" not in NOTIFICATION_KINDS[kind].gates)
    if not result:
        assert result.blocked_by == "snooze"


async def test_manager_is_resolved_from_hass_data_when_not_given(hass: HomeAssistant) -> None:
    _global(hass)
    nm = NotificationManager(hass)
    from custom_components.maintenance_supporter.const import NOTIFICATION_MANAGER_KEY

    hass.data.setdefault(DOMAIN, {})[NOTIFICATION_MANAGER_KEY] = nm
    nm.snooze_task("entry", TASK_ID_1)
    result = task_may_notify(hass, "entry", TASK_ID_1, MaintenanceStatus.OVERDUE, {}, kind=KIND_STATUS)
    assert not result and result.blocked_by == "snooze"
    assert nm.is_snoozed("entry", TASK_ID_1, MaintenanceStatus.OVERDUE)
    assert nm._is_snoozed(notification_key("entry", TASK_ID_1, MaintenanceStatus.OVERDUE))
    assert not nm.is_snoozed("entry", TASK_ID_2, MaintenanceStatus.OVERDUE)


# ─── the bundle honours its gates WITHOUT the coordinator pre-filter ────────


def _bundle_tasks() -> list[dict[str, Any]]:
    return [
        {"task_id": TASK_ID_1, "task_name": "Filter", "status": MaintenanceStatus.OVERDUE, "days_until_due": -3},
        {"task_id": TASK_ID_2, "task_name": "Impeller", "status": MaintenanceStatus.DUE_SOON, "days_until_due": 2},
    ]


async def _seed(hass: HomeAssistant, *, uid: str, task2_over: dict[str, Any] | None = None) -> tuple[NotificationManager, MockConfigEntry, AsyncMock]:
    _global(hass)
    ago = (dt_util.now().date() - timedelta(days=40)).isoformat()
    t2 = build_task_data(task_id=TASK_ID_2, name="Impeller", last_performed=ago)
    t2.update(task2_over or {})
    obj = _object(hass, {TASK_ID_1: build_task_data(name="Filter", last_performed=ago), TASK_ID_2: t2}, uid=uid)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    return NotificationManager(hass), obj, calls


async def test_bundle_drops_a_snoozed_member_by_itself(hass: HomeAssistant) -> None:
    nm, obj, calls = await _seed(hass, uid="bundle_snooze")
    nm.snooze_task(obj.entry_id, TASK_ID_1)
    await nm.async_send_bundled(entry_id=obj.entry_id, object_name="Pool Pump", tasks=_bundle_tasks())
    await hass.async_block_till_done()
    assert calls.call_count == 1
    message = calls.call_args[0][0].data["message"]
    assert "Impeller" in message and "Filter" not in message, "the snoozed task must not ride inside the bundle"


async def test_bundle_with_every_member_gated_sends_nothing(hass: HomeAssistant) -> None:
    nm, obj, calls = await _seed(hass, uid="bundle_all_snoozed")
    nm.snooze_task(obj.entry_id, TASK_ID_1)
    nm.snooze_task(obj.entry_id, TASK_ID_2)
    await nm.async_send_bundled(entry_id=obj.entry_id, object_name="Pool Pump", tasks=_bundle_tasks())
    await hass.async_block_till_done()
    assert not calls.called


async def test_bundle_drops_a_muted_member_by_itself(hass: HomeAssistant) -> None:
    nm, obj, calls = await _seed(hass, uid="bundle_mute", task2_over={"notify_enabled": False})
    await nm.async_send_bundled(entry_id=obj.entry_id, object_name="Pool Pump", tasks=_bundle_tasks())
    await hass.async_block_till_done()
    assert calls.call_count == 1
    message = calls.call_args[0][0].data["message"]
    assert "Filter" in message and "Impeller" not in message


async def test_bundle_drops_a_vacation_silenced_member_by_itself(hass: HomeAssistant) -> None:
    nm, obj, calls = await _seed(hass, uid="bundle_vacation")

    class _Vac:
        def is_silent_for(self, task_id: str) -> bool:
            return task_id == TASK_ID_2

    with patch("custom_components.maintenance_supporter.helpers.vacation.get_vacation_state", return_value=_Vac()):
        await nm.async_send_bundled(entry_id=obj.entry_id, object_name="Pool Pump", tasks=_bundle_tasks())
    await hass.async_block_till_done()
    assert calls.call_count == 1
    assert "Impeller" not in calls.call_args[0][0].data["message"]


async def test_status_path_applies_the_gates_itself(hass: HomeAssistant) -> None:
    """A direct call to the per-task status path is gated too (mute) - not
    only the coordinator's pre-filter."""
    nm, obj, calls = await _seed(hass, uid="status_mute", task2_over={"notify_enabled": False})
    await nm.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_2, task_name="Impeller", object_name="Pool Pump", new_status=MaintenanceStatus.OVERDUE)
    await hass.async_block_till_done()
    assert not calls.called
    await nm.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Pool Pump", new_status=MaintenanceStatus.OVERDUE)
    await hass.async_block_till_done()
    assert calls.call_count == 1
