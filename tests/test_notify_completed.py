"""Completion notifications (#173 follow-up) and the notification matrix.

Pins: the ``completed`` kind is off by default; ``automatic`` announces only
completions no person made on the spot (sensor recovery, shopping-list sync,
an automation's service call) and ``all`` every completion; the per-task
mute, quiet hours and the daily cap gate it, repeat/snooze never apply; it is
routed to the household service only (never to the responsible person's
devices) and carries reason / actor / category in the event; the
coordinator's completion chokepoint names its source, hands it to the event
and to the notifier, and skips backfills; every completion surface names a
source; and the matrix in notify_hooks matches the table in ARCHITECTURE.md.
"""

from __future__ import annotations

import re
from datetime import timedelta
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import Event, HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    COMPLETION_SOURCES,
    COMPLETION_SOURCES_AUTOMATIC,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFY_COMPLETED,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    DOMAIN,
    EVENT_NOTIFICATION,
    EVENT_TASK_COMPLETED,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
    NOTIFY_COMPLETED_MODES,
)
from custom_components.maintenance_supporter.helpers import notify_hooks
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_COMPLETED, NOTIFICATION_KINDS

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_task_data,
    make_global_entry,
    make_object_entry,
    setup_integration,
)

_ROOT = Path(__file__).resolve().parent.parent
_COMPONENT = _ROOT / "custom_components" / "maintenance_supporter"


def _global(hass: HomeAssistant, **options: object) -> MockConfigEntry:
    return make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, **options},
    )


def _object(hass: HomeAssistant, *, uid: str, task: dict | None = None, tasks: dict | None = None) -> MockConfigEntry:
    task = task or build_task_data(name="Filter", last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    return make_object_entry(hass, tasks=tasks or {TASK_ID_1: task}, name="Dishwasher", uid=uid)


def _capture(hass: HomeAssistant, event_type: str = EVENT_NOTIFICATION) -> list[Event]:
    events: list[Event] = []
    hass.bus.async_listen(event_type, events.append)
    return events


@pytest.fixture(autouse=True)
def _reset_template_memo() -> None:
    notify_hooks._last_failed_template = None


async def _send(hass: HomeAssistant, obj: MockConfigEntry, *, source: str, completed_by: str | None = None, task_data: dict | None = None) -> bool:
    mgr = NotificationManager(hass)
    return await mgr.async_task_completed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher", source=source, completed_by=completed_by, completed_at="2026-09-11T10:00:00+00:00", task_data=task_data)


# ─── modes ──────────────────────────────────────────────────────────────────


async def test_off_by_default_sends_nothing(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object(hass, uid="c_off")
    events = _capture(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    assert await _send(hass, obj, source="panel") is False
    await hass.async_block_till_done()
    assert not calls.called and not events


async def test_automatic_mode_announces_only_unattended_sources(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_COMPLETED: "automatic"})
    obj = _object(hass, uid="c_auto")
    events = _capture(hass)
    hass.services.async_register("notify", "test", AsyncMock())
    for src in COMPLETION_SOURCES:
        await _send(hass, obj, source=src)
    await hass.async_block_till_done()
    assert sorted(e.data["reason"] for e in events) == sorted(COMPLETION_SOURCES_AUTOMATIC)
    assert {"shopping_list", "service", "auto_recovery"} == COMPLETION_SOURCES_AUTOMATIC


async def test_all_mode_announces_every_source_with_reason_actor_and_category(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_COMPLETED: "all"})
    obj = _object(hass, uid="c_all")
    events = _capture(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    user = await hass.auth.async_create_user("Anna")
    assert await _send(hass, obj, source="qr", completed_by=user.id) is True
    await hass.async_block_till_done()
    assert len(events) == 1
    d = events[0].data
    assert d["kind"] == KIND_COMPLETED and d["category"] == "activity" and d["reason"] == "qr"
    assert d["completed_by"] == user.id and d["completed_by_name"] == "Anna"
    assert d["completed_at"] == "2026-09-11T10:00:00+00:00"
    assert d["object_name"] == "Dishwasher" and d["task_name"] == "Filter" and d["target"] == "notify.test"
    sent = calls.call_args[0][0].data
    assert "Filter" in sent["message"] and "QR" in sent["message"] and "Anna" in sent["message"]
    # An unknown source still goes out, with the neutral reason.
    assert await _send(hass, obj, source="something_new") is True
    await hass.async_block_till_done()
    assert events[-1].data["reason"] == "something_new"


# ─── gates ──────────────────────────────────────────────────────────────────


async def test_muted_task_quiet_hours_and_daily_cap_gate_it(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_COMPLETED: "all", CONF_MAX_NOTIFICATIONS_PER_DAY: 1})
    obj = _object(hass, uid="c_gates")
    events = _capture(hass)
    hass.services.async_register("notify", "test", AsyncMock())
    assert await _send(hass, obj, source="panel", task_data={"notify_enabled": False}) is False, "per-task mute"
    mgr = NotificationManager(hass)
    with patch.object(mgr, "_is_quiet_hours", return_value=True):
        assert await mgr.async_task_completed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher", source="panel") is False, "quiet hours"
    assert await mgr.async_task_completed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher", source="panel") is True
    assert await mgr.async_task_completed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher", source="panel") is False, "daily cap of 1 reached"
    await hass.async_block_till_done()
    assert len(events) == 1


async def test_routed_to_the_household_service_never_the_responsible_person(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_COMPLETED: "all"})
    obj = _object(hass, uid="c_route")
    events = _capture(hass)
    hass.services.async_register("notify", "test", AsyncMock())
    user = await hass.auth.async_create_user("Ben")
    with patch("custom_components.maintenance_supporter.helpers.notification_manager.get_user_notify_services", AsyncMock(return_value=["notify.mobile_app_ben"])) as lookup:
        assert await _send(hass, obj, source="button", completed_by=user.id, task_data={"responsible_user_id": user.id}) is True
    await hass.async_block_till_done()
    assert not lookup.called, "completions are household news, not personal reminders"
    assert events[0].data["target"] == "notify.test"


async def test_event_only_without_a_service_still_fires(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_NOTIFY_EVENT_ONLY

    data = build_global_entry_data(notifications_enabled=True, notify_service="")
    data.update({CONF_NOTIFY_EVENT_ONLY: True, CONF_NOTIFY_COMPLETED: "all", CONF_QUIET_HOURS_ENABLED: False})
    entry = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter", data=data, source="user", unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    obj = _object(hass, uid="c_eo")
    events = _capture(hass)
    assert await _send(hass, obj, source="auto_recovery") is True
    await hass.async_block_till_done()
    assert events[0].data["kind"] == "completed" and events[0].data["target"] is None


# ─── coordinator wiring ─────────────────────────────────────────────────────


async def test_completion_chokepoint_names_the_source_and_notifies(hass: HomeAssistant) -> None:
    g = _global(hass, **{CONF_NOTIFY_COMPLETED: "all"})
    obj = _object(hass, uid="c_coord")
    await setup_integration(hass, g, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    completed_events = _capture(hass, EVENT_TASK_COMPLETED)
    notify = AsyncMock(return_value=True)
    with patch.object(nm, "async_task_completed", notify):
        await coordinator.complete_maintenance(TASK_ID_1, notes="done", source="todo")
        await hass.async_block_till_done()
        assert completed_events[-1].data["source"] == "todo"
        assert notify.await_args.kwargs["source"] == "todo" and notify.await_args.kwargs["task_name"] == "Filter"
        assert notify.await_args.kwargs["task_data"] is not None
        # A backfill (older than the latest completion) is bookkeeping, not news.
        notify.reset_mock()
        await coordinator.complete_maintenance(TASK_ID_1, notes="old", source="panel", completed_at=dt_util.now() - timedelta(days=400))
        await hass.async_block_till_done()
        assert completed_events[-1].data["backfill"] is True
        assert not notify.called
        # Auto-recovery names itself even without an explicit source.
        notify.reset_mock()
        await coordinator.complete_maintenance(TASK_ID_1, notes="auto", auto=True, completed_at=dt_util.now())
        await hass.async_block_till_done()
        assert completed_events[-1].data["source"] == "auto_recovery"
        assert notify.await_args.kwargs["source"] == "auto_recovery"


def test_every_completion_surface_names_its_source() -> None:
    """A new caller of complete_maintenance must say where it comes from."""
    offenders: list[str] = []
    for path in _COMPONENT.rglob("*.py"):
        src = path.read_text(encoding="utf-8")
        for m in re.finditer(r"\.complete_maintenance\(", src):
            if src[m.end() : m.end() + 1] == ")":
                continue  # a docstring mention, not a call
            window = src[m.end() : m.end() + 900]
            call = window[: window.index(")\n") + 2] if ")\n" in window else window
            if "source=" not in call and "auto=True" not in call:
                offenders.append(f"{path.relative_to(_ROOT).as_posix()}:{src[: m.start()].count(chr(10)) + 1}")
    assert not offenders, f"complete_maintenance calls without a source=: {offenders}"
    assert set(NOTIFY_COMPLETED_MODES) == {"off", "automatic", "all"}


# ─── the matrix ──────────────────────────────────────────────────────────────


def test_notification_matrix_matches_the_docs_table() -> None:
    """docs/ARCHITECTURE.md → 'Notification model' lists every kind with its
    category, routing and gates exactly as notify_hooks.NOTIFICATION_KINDS."""
    arch = _ROOT / "docs" / "ARCHITECTURE.md"
    if not arch.exists():
        pytest.skip("docs/ not mounted in this environment (enforced in CI)")
    text = arch.read_text(encoding="utf-8")
    rows = {m.group(1): m for m in re.finditer(r"^\| `([a-z_]+)` \| (\w+) \| (\w+) \| ([^|]+) \| ([^|]+) \|", text, re.M)}
    assert set(rows) == set(NOTIFICATION_KINDS), f"docs rows {sorted(rows)} vs matrix {sorted(NOTIFICATION_KINDS)}"
    for kind, spec in NOTIFICATION_KINDS.items():
        m = rows[kind]
        assert m.group(2) == spec.category, kind
        assert m.group(3) == spec.routing, kind
        documented_gates = {g.strip().strip("`") for g in m.group(5).split(",") if g.strip() and g.strip() != "—"}
        assert documented_gates == set(spec.gates), f"{kind}: docs {sorted(documented_gates)} vs matrix {sorted(spec.gates)}"


# ─── the remaining branches ─────────────────────────────────────────────────


async def test_scope_view_gates_completions(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_NOTIFY_SCOPE_VIEW_ID

    _global(hass, **{CONF_NOTIFY_COMPLETED: "all", CONF_NOTIFY_SCOPE_VIEW_ID: "v1"})
    obj = _object(hass, uid="c_scope")
    hass.services.async_register("notify", "test", AsyncMock())
    views = [{"id": "v1", "name": "Kitchen", "filters": {"object_ids": ["x"]}}]
    with (
        patch("custom_components.maintenance_supporter.helpers.saved_views.list_saved_views", return_value=views),
        patch("custom_components.maintenance_supporter.helpers.saved_views.view_matches_task", return_value=False),
    ):
        assert await _send(hass, obj, source="panel", task_data={"name": "Filter"}) is False
    with (
        patch("custom_components.maintenance_supporter.helpers.saved_views.list_saved_views", return_value=views),
        patch("custom_components.maintenance_supporter.helpers.saved_views.view_matches_task", return_value=True),
    ):
        assert await _send(hass, obj, source="panel", task_data={"name": "Filter"}) is True
    # No task data → the scope cannot be evaluated and does not block.
    assert await _send(hass, obj, source="panel") is True


@pytest.mark.parametrize(("style", "title"), [("object_name", "Dishwasher"), ("task_name", "Filter")])
async def test_title_style_applies_to_completions(hass: HomeAssistant, style: str, title: str) -> None:
    from custom_components.maintenance_supporter.const import CONF_NOTIFICATION_TITLE_STYLE

    _global(hass, **{CONF_NOTIFY_COMPLETED: "all", CONF_NOTIFICATION_TITLE_STYLE: style})
    obj = _object(hass, uid=f"c_title_{style}")
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    assert await _send(hass, obj, source="panel") is True
    await hass.async_block_till_done()
    assert calls.call_args[0][0].data["title"] == title


async def test_hook_without_a_target_fires_the_event_but_sends_nothing(hass: HomeAssistant) -> None:
    _global(hass)
    events = _capture(hass)
    ctx = notify_hooks.notification_context(hass, "test", entry_id=None, task_id=None, task_name=None, object_name=None)
    assert await notify_hooks.async_emit_and_dispatch(hass, "", {"title": "t", "message": "m"}, ctx) is False
    await hass.async_block_till_done()
    assert len(events) == 1 and events[0].data["target"] is None


async def test_completion_survives_a_missing_or_failing_notifier(hass: HomeAssistant) -> None:
    g = _global(hass, **{CONF_NOTIFY_COMPLETED: "all"})
    # Two tasks: a second manual completion of the same task within 30 s is
    # deduplicated as a double-tap.
    obj = _object(hass, uid="c_robust", tasks={TASK_ID_1: build_task_data(name="Filter"), TASK_ID_2: build_task_data(task_id=TASK_ID_2, name="Salt")})
    await setup_integration(hass, g, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    completed_events = _capture(hass, EVENT_TASK_COMPLETED)
    with patch.object(nm, "async_task_completed", AsyncMock(side_effect=RuntimeError("notify down"))):
        await coordinator.complete_maintenance(TASK_ID_1, notes="one", source="panel")
        await hass.async_block_till_done()
    assert len(completed_events) == 1, "a failing notifier never fails the completion"
    await coordinator.complete_maintenance(TASK_ID_2, notes="two", source="qr")
    await hass.async_block_till_done()
    assert len(completed_events) == 2
    # No (or a foreign) notification manager in hass.data: the hook is a no-op.
    from types import SimpleNamespace

    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = object()
    try:
        await coordinator._async_notify_completed(TASK_ID_2, SimpleNamespace(name="Salt"), "qr", None, "2026-09-11T10:00:00+00:00")
    finally:
        hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = nm


async def test_battery_lifetime_catalog_names_models_and_never_raises(hass: HomeAssistant) -> None:
    from types import SimpleNamespace

    from homeassistant.helpers import device_registry as dr

    from custom_components.maintenance_supporter.websocket.dashboard import _battery_lifetime_catalog

    g = _global(hass)
    dr.async_get(hass).async_get_or_create(config_entry_id=g.entry_id, identifiers={(DOMAIN, "lock-1")}, manufacturer="Acme", model="Lock")
    bat = SimpleNamespace(entity_id="sensor.lock_battery", battery_type="CR2032", model_key="acme|lock", last_replaced=None)
    with (
        patch("custom_components.maintenance_supporter.helpers.battery_fleet.read_batteries", return_value=[bat]),
        patch("custom_components.maintenance_supporter.helpers.battery_fleet.discover_battery_types", return_value={"CR2032": 1}),
        patch("custom_components.maintenance_supporter.helpers.battery_lifetime.lifetime_catalog", side_effect=lambda hass, types, *, model_names: [{"types": types, "names": model_names}]) as cat,
    ):
        rows = _battery_lifetime_catalog(hass)
    assert rows == [{"types": ["CR2032"], "names": {"acme|lock": "Acme Lock"}}] and cat.called
    with patch("custom_components.maintenance_supporter.helpers.battery_fleet.read_batteries", side_effect=RuntimeError("boom")):
        assert _battery_lifetime_catalog(hass) == []
