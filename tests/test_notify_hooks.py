"""Your own notification rule (#165): the `maintenance_supporter_notification`
event, `notify_event_only` and the `notify_extra_data` template.

Pins: every send path fires the event with the notification's facts
(reference numbers and priority looked up from the entry), event-only
delivery fires the event and calls no notify service while the manager
still records the send, the extra-data template merges into `data` with
the user's keys winning, a broken or non-mapping template is logged once
and ignored, and the Settings test button walks the same hook.
"""

from __future__ import annotations

from unittest.mock import AsyncMock

import pytest
from homeassistant.core import Event, HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_NOTIFY_EVENT_ONLY,
    CONF_NOTIFY_EXTRA_DATA,
    CONF_QUIET_HOURS_ENABLED,
    EVENT_NOTIFICATION,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers import notify_hooks
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
from custom_components.maintenance_supporter.helpers.notify_hooks import (
    KIND_STATUS,
    KIND_TEST,
    notification_context,
    render_extra_data,
)

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_task_data,
    make_global_entry,
    make_object_entry,
)


def _global(hass: HomeAssistant, **options: object) -> MockConfigEntry:
    return make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test",
        # the default quiet hours would silence a night-time CI run
        extra_data={CONF_QUIET_HOURS_ENABLED: False, **options},
    )


def _object(hass: HomeAssistant) -> MockConfigEntry:
    obj = build_object_data(name="Spülmaschine")
    obj["ref_no"] = 8
    task = build_task_data(task_id=TASK_ID_1, name="Filter reinigen")
    task["ref_no"] = 3
    task["priority"] = "high"
    return make_object_entry(hass, tasks={TASK_ID_1: task}, name="Spülmaschine", unique_id="ms_hooks_obj", object_data=obj)


def _capture(hass: HomeAssistant) -> list[Event]:
    events: list[Event] = []
    hass.bus.async_listen(EVENT_NOTIFICATION, events.append)
    return events


@pytest.fixture(autouse=True)
def _reset_template_memo() -> None:
    notify_hooks._last_failed_template = None


def test_notification_context_looks_up_refs_and_priority(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object(hass)
    ctx = notification_context(hass, KIND_STATUS, status="overdue", entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter reinigen", object_name="Spülmaschine", days_until_due=-3)
    assert ctx["object_ref"] == "8" and ctx["task_ref"] == "8.3" and ctx["priority"] == "high"
    assert ctx["url"] == f"/maintenance-supporter?entry_id={obj.entry_id}&task_id={TASK_ID_1}"
    assert ctx["kind"] == "status" and ctx["status"] == "overdue" and ctx["days_until_due"] == -3
    bare = notification_context(hass, KIND_TEST)
    assert bare["object_ref"] is None and bare["task_ref"] is None and bare["url"] == "/maintenance-supporter"


async def test_status_change_fires_the_event_and_still_sends(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object(hass)
    events = _capture(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter reinigen", object_name="Spülmaschine", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    assert calls.called, "the notify service is still called"
    assert len(events) == 1
    d = events[0].data
    assert d["kind"] == "status" and d["status"] == "overdue"
    assert d["target"] == "notify.test" and d["task_ref"] == "8.3" and d["priority"] == "high"
    assert d["title"] and "Filter reinigen" in d["message"]
    assert d["data"]["tag"] == f"maintenance_{TASK_ID_1}" and d["data"]["url"].endswith(f"task_id={TASK_ID_1}")


async def test_event_only_fires_the_event_but_sends_nothing_and_records_the_send(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_EVENT_ONLY: True})
    obj = _object(hass)
    events = _capture(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter reinigen", object_name="Spülmaschine", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    assert not calls.called
    assert len(events) == 1
    assert f"{obj.entry_id}_{TASK_ID_1}_{MaintenanceStatus.OVERDUE}" in mgr._last_notified, "rate limiting still applies"
    assert mgr._daily_count == 1


async def test_extra_data_template_merges_into_data_and_the_user_wins(hass: HomeAssistant) -> None:
    template = '{"category": "maintenance", "critical": {{ priority == "high" }}, "navigate_to": "{{ url }}", "tag": "mine", "ref": "{{ task_ref }}"}'
    _global(hass, **{CONF_NOTIFY_EXTRA_DATA: template, CONF_ACTION_COMPLETE_ENABLED: True})
    obj = _object(hass)
    events = _capture(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter reinigen", object_name="Spülmaschine", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    sent = calls.call_args[0][0].data
    assert sent["data"]["category"] == "maintenance"
    assert sent["data"]["critical"] is True
    assert sent["data"]["navigate_to"] == f"/maintenance-supporter?entry_id={obj.entry_id}&task_id={TASK_ID_1}"
    assert sent["data"]["ref"] == "8.3"
    assert sent["data"]["tag"] == "mine", "the user's key wins over ours"
    assert sent["data"]["actions"][0]["action"].startswith("MS_COMPLETE_"), "our other keys stay"
    assert events[0].data["data"]["category"] == "maintenance", "the event shows the merged data"


def test_render_extra_data_accepts_json_yaml_and_refuses_the_rest(hass: HomeAssistant, caplog: pytest.LogCaptureFixture) -> None:
    variables = {"priority": "high", "url": "/x"}
    assert render_extra_data(hass, '{"a": 1, "b": "{{ url }}"}', variables) == {"a": 1, "b": "/x"}
    assert render_extra_data(hass, "category: maintenance\ncritical: {{ priority == 'high' }}", variables) == {"category": "maintenance", "critical": True}
    assert render_extra_data(hass, "   ", variables) is None
    assert render_extra_data(hass, "just a string", variables) is None
    assert "must render to a mapping" in caplog.text
    caplog.clear()
    assert render_extra_data(hass, "just a string", variables) is None
    assert "must render to a mapping" not in caplog.text, "the same failing text is logged once"
    assert render_extra_data(hass, "{{ this is not jinja", variables) is None
    assert "failed to render" in caplog.text


async def test_broken_template_still_sends_the_plain_notification(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_EXTRA_DATA: "{{ undefined_thing.oops }}"})
    obj = _object(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter reinigen", object_name="Spülmaschine", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    assert calls.called
    assert "category" not in calls.call_args[0][0].data["data"]


async def test_bundle_lead_and_digest_carry_their_kinds(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object(hass)
    events = _capture(hass)
    hass.services.async_register("notify", "test", AsyncMock())
    mgr = NotificationManager(hass)
    await mgr.async_send_bundled(obj.entry_id, "Spülmaschine", [{"task_id": TASK_ID_1, "task_name": "Filter reinigen", "status": "overdue"}, {"task_id": "t2", "task_name": "Salz", "status": "due_soon"}])
    await mgr.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Filter reinigen", "Spülmaschine", days=3, next_due="2026-09-10")
    await mgr.async_send_weekly_digest(overdue=2, due_soon=5)
    await hass.async_block_till_done()
    # Three sends, three events — matched by kind, not by arrival order: the
    # bundle's send runs as a background task on some cores, so its event can
    # land after the lead reminder's (flaked once on the HA-stable CI leg).
    by_kind = {e.data["kind"]: e.data for e in events}
    assert sorted(by_kind) == ["bundle", "digest", "lead_time"] and len(events) == 3
    bundle = by_kind["bundle"]
    assert bundle["object_ref"] == "8" and [t["task_id"] for t in bundle["tasks"]] == [TASK_ID_1, "t2"]
    lead = by_kind["lead_time"]
    assert lead["status"] == "due_soon" and lead["days_until_due"] == 3 and lead["task_ref"] == "8.3"
    assert by_kind["digest"]["overdue"] == 2 and by_kind["digest"]["due_soon"] == 5


async def test_send_test_walks_the_hook(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.config_flow_options_global import send_test_notification

    entry = _global(hass, **{CONF_NOTIFY_EXTRA_DATA: '{"category": "maintenance"}'})
    events = _capture(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    result = await send_test_notification(hass, dict(entry.data))
    await hass.async_block_till_done()
    assert result == "success"
    assert events[0].data["kind"] == "test"
    assert calls.call_args[0][0].data["data"]["category"] == "maintenance"


async def test_settings_roundtrip_and_sanitising(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.dashboard import sanitize_settings_input

    filtered, err = sanitize_settings_input({CONF_NOTIFY_EVENT_ONLY: True, CONF_NOTIFY_EXTRA_DATA: "x" * 2500})
    assert err is None or "notify_extra_data" in str(err)
    assert filtered.get(CONF_NOTIFY_EVENT_ONLY) is True
    if CONF_NOTIFY_EXTRA_DATA in filtered:
        assert len(filtered[CONF_NOTIFY_EXTRA_DATA]) <= 2000
    filtered, _ = sanitize_settings_input({CONF_NOTIFY_EVENT_ONLY: "yes"})
    assert CONF_NOTIFY_EVENT_ONLY not in filtered, "a non-bool is dropped"


# ─── #185: notification icons ride every send ──────────────────────────────


def _object_with_icon(hass: HomeAssistant, notify_icon: str | None = None) -> MockConfigEntry:
    task = build_task_data(task_id=TASK_ID_1, name="Filter")  # type: cleaning
    if notify_icon is not None:
        task["notify_icon"] = notify_icon
    return make_object_entry(hass, tasks={TASK_ID_1: task}, name="Dishwasher", unique_id="ms_hooks_icon")


async def _status_send(hass: HomeAssistant, obj: MockConfigEntry) -> tuple[AsyncMock, list[Event]]:
    events = _capture(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    return calls, events


async def test_default_icon_follows_the_maintenance_type(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object_with_icon(hass)
    calls, events = await _status_send(hass, obj)
    sent = calls.call_args[0][0].data
    assert sent["data"]["notification_icon"] == "mdi:broom", "cleaning task -> the type default"
    assert events[0].data["data"]["notification_icon"] == "mdi:broom", "the event payload carries it too"


async def test_per_task_override_wins_over_the_type_default(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object_with_icon(hass, "mdi:robot-vacuum")
    calls, events = await _status_send(hass, obj)
    assert calls.call_args[0][0].data["data"]["notification_icon"] == "mdi:robot-vacuum"
    assert events[0].data["data"]["notification_icon"] == "mdi:robot-vacuum"


async def test_extra_data_template_icon_wins_over_ours(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_EXTRA_DATA: '{"notification_icon": "mdi:alert", "category": "x"}'})
    obj = _object_with_icon(hass, "mdi:robot-vacuum")
    calls, events = await _status_send(hass, obj)
    sent = calls.call_args[0][0].data
    assert sent["data"]["notification_icon"] == "mdi:alert", "an explicit notification_icon in extra data is never overwritten"
    assert sent["data"]["category"] == "x" and sent["data"]["tag"] == f"maintenance_{TASK_ID_1}", "the rest is untouched"
    assert events[0].data["data"]["notification_icon"] == "mdi:alert"


async def test_task_less_kinds_use_the_kind_default(hass: HomeAssistant) -> None:
    _global(hass)
    _object_with_icon(hass, "mdi:robot-vacuum")
    events = _capture(hass)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    await mgr.async_send_weekly_digest(2, 3)
    await hass.async_block_till_done()
    assert calls.call_args[0][0].data["data"]["notification_icon"] == "mdi:clipboard-list-outline"
    assert events[-1].data["kind"] == "digest" and events[-1].data["data"]["notification_icon"] == "mdi:clipboard-list-outline"
    # The Settings test send resolves through the same hook (its sample
    # entry does not exist -> the `test` kind's bell).
    sample = notify_hooks.sample_notification_context(hass)
    assert await notify_hooks.async_emit_and_dispatch(hass, "notify.test", {"title": "t", "message": "m"}, sample, blocking=True)
    assert calls.call_args[0][0].data["data"]["notification_icon"] == "mdi:bell-ring-outline"
