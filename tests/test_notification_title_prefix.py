"""D#248: an optional prefix in front of every notification's title.

Two Home Assistant instances with similar tasks sent the same titles to one
phone ("Maintenance Overdue!"), so a reminder did not tell which home it came
from. The prefix is put in front where every notification passes
(``async_emit_and_dispatch``): every kind and every title style, the event
and the extra-data template see the title the phone shows, and the test
button shows it too. Stored trimmed, on one line, at most 40 characters;
"" (the default, and an emptied field in the options flow) is no prefix.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock

from homeassistant.core import Event, HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATION_TITLE_PREFIX,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFY_EXTRA_DATA,
    CONF_QUIET_HOURS_ENABLED,
    EVENT_NOTIFICATION,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
from custom_components.maintenance_supporter.helpers.notify_hooks import prefixed_title
from custom_components.maintenance_supporter.helpers.settings_sanitize import (
    clean_title_prefix,
    sanitize_settings_input,
)

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry, setup_integration


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    return make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, **options},
    )


def _object(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(task_id=TASK_ID_1, name="Clean filter")
    return make_object_entry(hass, tasks={TASK_ID_1: task}, name="Dishwasher", unique_id="ms_prefix_obj")


def _wire(hass: HomeAssistant) -> tuple[AsyncMock, list[Event]]:
    events: list[Event] = []
    hass.bus.async_listen(EVENT_NOTIFICATION, events.append)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    return calls, events


def _sent_titles(calls: AsyncMock) -> list[str]:
    return [c[0][0].data["title"] for c in calls.call_args_list]


def test_the_prefix_joins_with_a_dot_or_the_users_own_separator() -> None:
    assert prefixed_title("Rental", "Maintenance Overdue!") == "Rental · Maintenance Overdue!"
    assert prefixed_title("  Rental ", "Dishwasher") == "Rental · Dishwasher"
    assert prefixed_title("Rental:", "Dishwasher") == "Rental: Dishwasher", "a prefix ending in a separator gets a space only"
    assert prefixed_title("[Rental]", "Dishwasher") == "[Rental] Dishwasher"
    assert prefixed_title("Rental –", "Dishwasher") == "Rental – Dishwasher"
    assert prefixed_title("", "Dishwasher") == "Dishwasher"
    assert prefixed_title("   ", "Dishwasher") == "Dishwasher"
    assert prefixed_title("Rental", "") == "Rental"


async def test_a_status_reminder_carries_it_to_the_phone_the_event_and_the_template(hass: HomeAssistant) -> None:
    _global(hass, **{
        CONF_NOTIFICATION_TITLE_PREFIX: "Rental",
        CONF_NOTIFICATION_TITLE_STYLE: "object_name",
        CONF_NOTIFY_EXTRA_DATA: '{"seen_title": "{{ title }}"}',
    })
    obj = _object(hass)
    calls, events = _wire(hass)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Clean filter", object_name="Dishwasher", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    sent = calls.call_args[0][0].data
    assert sent["title"] == "Rental · Dishwasher", "in front of the object-name style"
    assert events[0].data["title"] == "Rental · Dishwasher", "the event shows what the phone shows"
    assert sent["data"]["seen_title"] == "Rental · Dishwasher", "the template sees it too"
    assert "Clean filter" in sent["message"] and "Rental" not in sent["message"], "the message is left alone"


async def test_every_kind_gets_it(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.config_flow_options_global import send_test_notification

    entry = _global(hass, **{CONF_NOTIFICATION_TITLE_PREFIX: "Rental"})
    obj = _object(hass)
    calls, events = _wire(hass)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Clean filter", object_name="Dishwasher", new_status=MaintenanceStatus.DUE_SOON, days_until_due=3)
    await mgr.async_send_bundled(obj.entry_id, "Dishwasher", [{"task_id": TASK_ID_1, "task_name": "Clean filter", "status": "overdue"}, {"task_id": "t2", "task_name": "Salt", "status": "due_soon"}])
    await mgr.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Clean filter", "Dishwasher", days=3, next_due="2026-09-10")
    await mgr.async_send_weekly_digest(overdue=2, due_soon=5)
    await mgr.async_send_warranty_reminder(["Dishwasher"], 30)
    assert await send_test_notification(hass, dict(entry.data)) == "success"
    await hass.async_block_till_done()
    kinds = sorted(str(e.data["kind"]) for e in events)
    assert kinds == ["bundle", "digest", "lead_time", "status", "test", "warranty"], kinds
    assert all(str(e.data["title"]).startswith("Rental · ") for e in events), [e.data["title"] for e in events]
    titles = _sent_titles(calls)
    assert len(titles) == 6 and all(t.startswith("Rental · ") for t in titles), titles


async def test_without_a_prefix_the_titles_stay_as_they_were(hass: HomeAssistant) -> None:
    _global(hass)
    obj = _object(hass)
    calls, events = _wire(hass)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Clean filter", object_name="Dishwasher", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    assert calls.call_args[0][0].data["title"] == "Maintenance Overdue!"
    assert events[0].data["title"] == "Maintenance Overdue!"


def test_stored_on_one_line_trimmed_and_capped() -> None:
    assert clean_title_prefix("  Rental\nflat\t ") == "Rental flat", "a pasted line break would split the title"
    assert clean_title_prefix("x" * 60) == "x" * 40
    assert clean_title_prefix(("a " * 30).strip()).endswith("a"), "no trailing space after the cut"
    assert clean_title_prefix(None) == "" and clean_title_prefix(7) == ""
    filtered, err = sanitize_settings_input({CONF_NOTIFICATION_TITLE_PREFIX: "  Rental  "})
    assert err is None and filtered[CONF_NOTIFICATION_TITLE_PREFIX] == "Rental"
    filtered, _ = sanitize_settings_input({CONF_NOTIFICATION_TITLE_PREFIX: "y" * 80})
    assert filtered[CONF_NOTIFICATION_TITLE_PREFIX] == "y" * 40, "an over-long value is cut, not dropped"
    filtered, _ = sanitize_settings_input({CONF_NOTIFICATION_TITLE_PREFIX: ["Rental"]})
    assert CONF_NOTIFICATION_TITLE_PREFIX not in filtered, "not text: refused"


async def test_the_options_flow_saves_and_clears_it(hass: HomeAssistant) -> None:
    """HA's form leaves an emptied field out of the submission: absence must
    clear the prefix (the extra-data template's old trap)."""
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_NOTIFICATION_TITLE_PREFIX: "Home"})
    await setup_integration(hass, g)
    flow = await hass.config_entries.options.async_init(g.entry_id)
    flow = await hass.config_entries.options.async_configure(flow["flow_id"], {"next_step_id": "notification_settings"})
    schema_keys = [str(k) for k in flow["data_schema"].schema]
    assert CONF_NOTIFICATION_TITLE_PREFIX in schema_keys
    await hass.config_entries.options.async_configure(flow["flow_id"], user_input={CONF_NOTIFICATION_TITLE_PREFIX: "  Rental\n "})
    assert g.options[CONF_NOTIFICATION_TITLE_PREFIX] == "Rental"
    flow = await hass.config_entries.options.async_init(g.entry_id)
    flow = await hass.config_entries.options.async_configure(flow["flow_id"], {"next_step_id": "notification_settings"})
    await hass.config_entries.options.async_configure(flow["flow_id"], user_input={})
    assert g.options[CONF_NOTIFICATION_TITLE_PREFIX] == ""
