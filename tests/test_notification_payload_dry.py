"""Notification payload / currency single-sources (DRY/drift round 2026-09-12).

Pins: the ``completed`` kind's notify payload carries the per-task ``tag``
and the deep-link ``url``/``clickAction`` like every other kind (it used to
be a bare title+message); ``build_action_buttons`` is the one builder behind
the status reminder AND the Settings test send — translated labels, the
per-task skip lock honoured, test ids the action listener ignores; the
budget-status and settings ``budget`` blocks come from ``_currency_block``;
the ``decimals`` parameter defaults follow ``DEFAULT_CURRENCY_DECIMALS``;
no ``"€"`` literal is left as a fallback in the package.
"""

from __future__ import annotations

import inspect
import re
from datetime import timedelta
from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    BUDGET_CURRENCIES,
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_NOTIFY_COMPLETED,
    CONF_QUIET_HOURS_ENABLED,
    DEFAULT_BUDGET_CURRENCY,
    DEFAULT_CURRENCY_DECIMALS,
)
from custom_components.maintenance_supporter.helpers import parts as parts_mod
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager, build_action_buttons

from .conftest import (
    TASK_ID_1,
    build_task_data,
    make_global_entry,
    make_object_entry,
    setup_integration,
)

_PACKAGE = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter"


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    return make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, **options},
    )


async def test_completed_payload_carries_tag_and_deep_link(hass: HomeAssistant) -> None:
    g = _global(hass, **{CONF_NOTIFY_COMPLETED: "all"})
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(name="Filter", last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())}, name="Dishwasher", uid="payload_dry")
    await setup_integration(hass, g, obj)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    assert await mgr.async_task_completed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Dishwasher", source="panel", completed_at="2026-09-11T10:00:00+00:00")
    await hass.async_block_till_done()
    sent = calls.call_args[0][0].data
    url = f"/maintenance-supporter?entry_id={obj.entry_id}&task_id={TASK_ID_1}"
    assert sent["data"]["tag"] == f"maintenance_{TASK_ID_1}"
    assert sent["data"]["url"] == url and sent["data"]["clickAction"] == url
    assert "actions" not in sent["data"], "a completion is news — nothing to act on"


def test_build_action_buttons_is_translated_and_honours_the_skip_lock(hass: HomeAssistant) -> None:
    options = {CONF_ACTION_COMPLETE_ENABLED: True, CONF_ACTION_SKIP_ENABLED: True, CONF_ACTION_SNOOZE_ENABLED: True}
    real = build_action_buttons(hass, options, "de", entry_id="e1", task_id="t1", skip_allowed=True)
    assert [a["action"] for a in real] == ["MS_COMPLETE_e1_t1", "MS_SKIP_e1_t1", "MS_SNOOZE_e1_t1"]
    assert real[0]["title"].endswith("Erledigt"), real
    locked = build_action_buttons(hass, options, "en", entry_id="e1", task_id="t1", skip_allowed=False)
    assert [a["action"] for a in locked] == ["MS_COMPLETE_e1_t1", "MS_SNOOZE_e1_t1"]
    test = build_action_buttons(hass, options, "en", entry_id=None, task_id=None, skip_allowed=True)
    assert [a["action"] for a in test] == ["MS_TEST_COMPLETE", "MS_TEST_SKIP", "MS_TEST_SNOOZE"]
    assert build_action_buttons(hass, {}, "en", entry_id="e1", task_id="t1", skip_allowed=True) == []


async def test_test_send_uses_the_translated_buttons(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.config_flow_options_global import send_test_notification

    hass.config.language = "de"
    g = _global(hass, **{CONF_ACTION_COMPLETE_ENABLED: True, CONF_ACTION_SKIP_ENABLED: True})
    await setup_integration(hass, g)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    assert await send_test_notification(hass, dict(g.data)) == "success"
    actions = calls.call_args[0][0].data["data"]["actions"]
    assert [a["action"] for a in actions] == ["MS_TEST_COMPLETE", "MS_TEST_SKIP"]
    assert actions[0]["title"].endswith("Erledigt") and actions[1]["title"].endswith("Überspringen"), actions


async def test_budget_status_and_settings_share_the_currency_block(hass: HomeAssistant, hass_ws_client: Any) -> None:
    from custom_components.maintenance_supporter.const import CONF_BUDGET_CURRENCY, CONF_CURRENCY_DECIMALS

    g = _global(hass, **{CONF_BUDGET_CURRENCY: "GBP", CONF_CURRENCY_DECIMALS: 2})
    await setup_integration(hass, g)
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "maintenance_supporter/budget_status"})
    status = (await client.receive_json())["result"]
    await client.send_json({"id": 2, "type": "maintenance_supporter/settings"})
    settings = (await client.receive_json())["result"]["budget"]
    assert status["currency_symbol"] == settings["currency_symbol"] == "£"
    assert status["currency_decimals"] == settings["currency_decimals"] == 2
    assert settings["currency"] == "GBP"


def test_decimals_defaults_follow_the_setting_default() -> None:
    for fn in (parts_mod.buy_task_notes, parts_mod.build_buy_task, parts_mod.reconcile_buy_tasks, NotificationManager.async_budget_alert):
        assert inspect.signature(fn).parameters["decimals"].default == DEFAULT_CURRENCY_DECIMALS, fn.__name__
    assert inspect.signature(NotificationManager.async_budget_alert).parameters["currency_symbol"].default == BUDGET_CURRENCIES[DEFAULT_BUDGET_CURRENCY]


def test_no_euro_literal_fallback_in_the_package() -> None:
    """``BUDGET_CURRENCIES.get(code, "€")`` re-spelled the default currency's
    symbol; the table is the source (``BUDGET_CURRENCIES[DEFAULT_BUDGET_CURRENCY]``)."""
    offenders = [str(p.relative_to(_PACKAGE)) for p in _PACKAGE.rglob("*.py") if p.name != "const.py" and re.search(r'BUDGET_CURRENCIES\.get\([^)]*"€"\)|=\s*"€"', p.read_text(encoding="utf-8"))]
    assert not offenders, offenders
