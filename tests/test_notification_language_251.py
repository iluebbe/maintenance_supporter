"""#251: a language of their own for the notifications.

The panel follows each person's profile language, the notifications Home
Assistant's system language, and in some homes the people who get the
pushes read neither. ``notification_language`` is "auto" (Home Assistant's
language, as before) or one of the notification tables' languages; titles,
messages and the action buttons follow it, the test push too.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_NOTIFICATION_LANGUAGE,
    CONF_QUIET_HOURS_ENABLED,
    NOTIFICATION_LANGUAGE_AUTO,
    NOTIFICATION_LANGUAGE_NAMES,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import (
    _NOTIFICATION_STRINGS,
    NotificationManager,
    async_dispatch_notify,
    notification_language,
)
from custom_components.maintenance_supporter.helpers.settings_sanitize import sanitize_settings_input

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry, setup_integration


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    return make_global_entry(
        hass,
        notifications_enabled=True,
        notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, CONF_ACTION_COMPLETE_ENABLED: True, CONF_ACTION_SNOOZE_ENABLED: True, **options},
    )


def _object(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(task_id=TASK_ID_1, name="Clean filter")
    return make_object_entry(hass, tasks={TASK_ID_1: task}, name="Dishwasher", unique_id="ms_lang_251")


async def _overdue(hass: HomeAssistant, obj: MockConfigEntry) -> dict[str, Any]:
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    await NotificationManager(hass).async_task_status_changed(
        entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Clean filter", object_name="Dishwasher", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3
    )
    await hass.async_block_till_done()
    return dict(calls.call_args[0][0].data)


def test_the_languages_are_the_tables_languages() -> None:
    assert set(NOTIFICATION_LANGUAGE_NAMES) == set(_NOTIFICATION_STRINGS), "a language the tables lack would speak English"


@pytest.mark.parametrize(
    ("raw", "stored"),
    [
        ("de", "de"),
        ("auto", "auto"),
        ("", "auto"),
        ("pt-BR", "pt-br"),
        ("zh-Hans", "zh"),
        ("FR", "fr"),
    ],
)
def test_the_setting_is_auto_or_a_table_language(raw: str, stored: str) -> None:
    filtered, err = sanitize_settings_input({CONF_NOTIFICATION_LANGUAGE: raw})
    assert err is None and filtered[CONF_NOTIFICATION_LANGUAGE] == stored


@pytest.mark.parametrize("raw", ["xx", "klingon", "Deutsch", "de-", "zh-Hans-CN", 7, None])
def test_anything_else_is_refused(raw: Any) -> None:
    filtered, _ = sanitize_settings_input({CONF_NOTIFICATION_LANGUAGE: raw})
    assert CONF_NOTIFICATION_LANGUAGE not in filtered


async def test_auto_keeps_home_assistants_language(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    _global(hass)
    assert notification_language(hass) == "de"
    sent = await _overdue(hass, _object(hass))
    assert sent["title"] == "Wartung überfällig!"


async def test_a_chosen_language_speaks_in_titles_messages_and_buttons(hass: HomeAssistant) -> None:
    hass.config.language = "en"
    _global(hass, **{CONF_NOTIFICATION_LANGUAGE: "de"})
    sent = await _overdue(hass, _object(hass))
    assert sent["title"] == "Wartung überfällig!"
    assert "überfällig" in sent["message"]
    titles = [a["title"] for a in sent["data"]["actions"]]
    assert any("Erledigt" in t for t in titles) and any("Später" in t for t in titles), titles


async def test_a_language_set_before_and_then_auto_again(hass: HomeAssistant) -> None:
    hass.config.language = "fr"
    _global(hass, **{CONF_NOTIFICATION_LANGUAGE: NOTIFICATION_LANGUAGE_AUTO})
    sent = await _overdue(hass, _object(hass))
    assert sent["title"] == "Maintenance en retard !"


async def test_the_test_push_speaks_it_too(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.config_flow_options_global import send_test_notification

    hass.config.language = "en"
    entry = _global(hass, **{CONF_NOTIFICATION_LANGUAGE: "fr"})
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    assert await send_test_notification(hass, dict(entry.data)) == "success"
    sent = calls.call_args[0][0].data
    assert "Notification de test" in sent["message"]
    assert any("Terminé" in a["title"] for a in sent["data"]["actions"])


async def test_the_link_of_a_persistent_notification_too(hass: HomeAssistant) -> None:
    hass.config.language = "en"
    _global(hass, **{CONF_NOTIFICATION_LANGUAGE: "de"})
    calls = AsyncMock()
    hass.services.async_register("notify", "persistent_notification", calls)
    await async_dispatch_notify(hass, "notify.persistent_notification", {"title": "x", "message": "y", "data": {"url": "/maintenance-supporter"}})
    assert "[Aufgabe öffnen](" in calls.call_args[0][0].data["message"]


async def test_the_options_flow_offers_and_saves_it(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.test")
    await setup_integration(hass, g)
    flow = await hass.config_entries.options.async_init(g.entry_id)
    flow = await hass.config_entries.options.async_configure(flow["flow_id"], {"next_step_id": "notification_settings"})
    field = next(k for k in flow["data_schema"].schema if str(k) == CONF_NOTIFICATION_LANGUAGE)
    assert field.default() == NOTIFICATION_LANGUAGE_AUTO
    options = flow["data_schema"].schema[field].config["options"]
    assert options[0] == {"value": "auto", "label": "Sprache von Home Assistant (Deutsch)"}
    assert {"value": "pt-br", "label": "Português (Brasil)"} in options
    await hass.config_entries.options.async_configure(flow["flow_id"], user_input={CONF_NOTIFICATION_LANGUAGE: "ja"})
    assert g.options[CONF_NOTIFICATION_LANGUAGE] == "ja"
    assert notification_language(hass) == "ja"
