"""#251: an optional notification language.

The panel follows each user's profile language. Notifications used the Home
Assistant system language, which a household cannot always change. The
``notify_language`` setting picks one of the 22 notification languages for
titles, messages and action buttons; empty (the default) keeps the old
behaviour and follows the system language.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_NOTIFY_LANGUAGE,
    CONF_QUIET_HOURS_ENABLED,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.global_options import (
    get_notification_language,
)
from custom_components.maintenance_supporter.helpers.notification_manager import (
    _NOTIFICATION_STRINGS,
    NotificationManager,
)
from custom_components.maintenance_supporter.helpers.settings_sanitize import (
    sanitize_settings_input,
)
from custom_components.maintenance_supporter.config_flow_options_global import (
    _TEST_NOTIFICATION_RESULTS,
    send_test_notification,
)

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    return make_global_entry(
        hass,
        notifications_enabled=True,
        notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, **options},
    )


def _object(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(task_id=TASK_ID_1, name="Clean filter")
    return make_object_entry(
        hass,
        tasks={TASK_ID_1: task},
        name="Dishwasher",
        unique_id="ms_language_obj",
    )


def _wire(hass: HomeAssistant) -> AsyncMock:
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    return calls


def test_empty_setting_follows_the_system_language(hass: HomeAssistant) -> None:
    hass.config.language = "fr"
    _global(hass)
    assert get_notification_language(hass) == "fr"


def test_explicit_language_wins_over_the_system_language(hass: HomeAssistant) -> None:
    hass.config.language = "en"
    _global(hass, **{CONF_NOTIFY_LANGUAGE: "de"})
    assert get_notification_language(hass) == "de"


def test_unknown_language_falls_back_to_the_system_language(hass: HomeAssistant) -> None:
    hass.config.language = "fr"
    _global(hass, **{CONF_NOTIFY_LANGUAGE: "zz"})
    assert get_notification_language(hass) == "fr"


def test_regional_codes_normalise_to_a_table_key(hass: HomeAssistant) -> None:
    hass.config.language = "en"
    _global(hass, **{CONF_NOTIFY_LANGUAGE: "pt-BR"})
    assert get_notification_language(hass) == "pt-br"
    filtered, error = sanitize_settings_input({CONF_NOTIFY_LANGUAGE: "pt-BR"})
    assert error is None
    assert filtered[CONF_NOTIFY_LANGUAGE] == "pt-br"


def test_an_unknown_language_is_dropped_by_the_settings_sanitiser(
    hass: HomeAssistant,
) -> None:
    filtered, error = sanitize_settings_input({CONF_NOTIFY_LANGUAGE: "zz"})
    assert error is None
    assert CONF_NOTIFY_LANGUAGE not in filtered


def test_an_empty_language_stays_the_system_choice(hass: HomeAssistant) -> None:
    filtered, error = sanitize_settings_input({CONF_NOTIFY_LANGUAGE: ""})
    assert error is None
    assert filtered[CONF_NOTIFY_LANGUAGE] == ""


async def test_a_reminder_uses_the_notification_language(hass: HomeAssistant) -> None:
    hass.config.language = "en"
    _global(hass, **{CONF_NOTIFY_LANGUAGE: "de"})
    obj = _object(hass)
    calls = _wire(hass)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(
        entry_id=obj.entry_id,
        task_id=TASK_ID_1,
        task_name="Clean filter",
        object_name="Dishwasher",
        new_status=MaintenanceStatus.DUE_SOON,
        days_until_due=3,
        next_due="2026-11-12",
    )
    await hass.async_block_till_done()
    sent = calls.call_args[0][0].data
    assert sent["title"] == _NOTIFICATION_STRINGS["de"]["due_soon_title"]
    expected = _NOTIFICATION_STRINGS["de"]["due_soon_message"].format(
        task="Clean filter", object="Dishwasher", days="3", due="2026-11-12"
    )
    assert sent["message"] == expected


async def test_action_buttons_use_the_notification_language(hass: HomeAssistant) -> None:
    hass.config.language = "en"
    _global(hass, **{CONF_NOTIFY_LANGUAGE: "de", CONF_ACTION_COMPLETE_ENABLED: True})
    obj = _object(hass)
    calls = _wire(hass)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(
        entry_id=obj.entry_id,
        task_id=TASK_ID_1,
        task_name="Clean filter",
        object_name="Dishwasher",
        new_status=MaintenanceStatus.OVERDUE,
        days_until_due=-2,
    )
    await hass.async_block_till_done()
    actions = calls.call_args[0][0].data["data"]["actions"]
    assert actions[0]["title"] == f"✅ {_NOTIFICATION_STRINGS['de']['action_complete']}"


async def test_the_test_notification_push_text_uses_the_setting(
    hass: HomeAssistant,
) -> None:
    hass.config.language = "en"
    entry = _global(
        hass,
        **{CONF_NOTIFY_LANGUAGE: "de", CONF_ACTION_COMPLETE_ENABLED: True},
    )
    calls = _wire(hass)
    assert await send_test_notification(hass, dict(entry.data)) == "success"
    await hass.async_block_till_done()
    sent = calls.call_args[0][0].data
    assert sent["message"] == _TEST_NOTIFICATION_RESULTS["de"]["push_message"]
    assert sent["data"]["actions"][0]["title"] == f"✅ {_NOTIFICATION_STRINGS['de']['action_complete']}"
