"""Numbers in reminders read as a person writes them (2.121).

A trigger's detail attribute was written with ``:g``: six significant
digits, so a reminder said "0.123457" for a reading, "21.4568" for a
temperature and "1.23457e+06" for a counter. A reading reported as text
("21.456789") went out as it came.

* ``plain_number``: at most two decimals (two significant digits below
  one), no trailing zeros, no exponent, the decimal mark of the language
  the text is for
* the trigger detail uses it for a number, in a list and a mapping too, and
  for a text that is nothing but a long decimal; numbers with a decimal
  comma are listed with "; "
* who reads it decides the mark: the reminder the notification language,
  the to-do list Home Assistant's; the event and the panel get a point,
  the panel with the decimals named so it writes them as its viewer does
* the auto-completion's history note holds the reading to four decimals:
  a reminder is read at a glance, the history to find out what happened
* the budget event carries the amounts to the cent
"""

from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATION_LANGUAGE,
    CONF_QUIET_HOURS_ENABLED,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.i18n import DECIMAL_COMMA_LANGUAGES, plain_number
from custom_components.maintenance_supporter.helpers.notification_manager import _NOTIFICATION_STRINGS, NotificationManager
from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_STATUS, notification_context
from custom_components.maintenance_supporter.helpers.trigger_detail import format_attribute_value, trigger_detail

from .conftest import (
    TASK_ID_1,
    build_task_data,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    setup_integration,
)

SENSOR = "sensor.cellar_humidity"


def _tc(**extra: Any) -> dict[str, Any]:
    return {"type": "threshold", "entity_id": SENSOR, "entity_ids": [SENSOR], "trigger_above": 70, "detail_attribute": "reading", **extra}


def _reading(hass: HomeAssistant, value: Any) -> None:
    hass.states.async_set(SENSOR, "80", {"reading": value, "friendly_name": "Cellar humidity"})


# ─── the number ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("value", "text"),
    [
        (21.4567891, "21.46"),
        (0.123456789, "0.12"),
        (6.4, "6.4"),
        (2.50, "2.5"),
        (7.0, "7"),
        (1234567.0, "1234567"),
        (12345.678, "12345.68"),
        (99.99999999, "100"),
        (3.0000000001, "3"),
        (0.1 + 0.2, "0.3"),
        (-0.0001, "-0.0001"),
        (-0.004, "-0.004"),
        (0.0, "0"),
        (-0.0, "0"),
        # below one: two significant digits, not two decimals. 0.015 read
        # "0.01" (a third off) while 0.0096 kept both its digits.
        (0.5, "0.5"),
        (0.999, "1"),
        (0.0949, "0.095"),
        (0.015, "0.015"),
        (0.0099, "0.0099"),
        (0.0096, "0.0096"),
        (0.0042, "0.0042"),
        (0.000012345, "0.000012"),
        (1e-20, "0"),
    ],
)
def test_a_number_reads_as_a_person_writes_it(value: float, text: str) -> None:
    assert plain_number(value) == text
    assert "e" not in plain_number(value)


def test_the_decimal_mark_follows_the_language() -> None:
    assert plain_number(21.4567891, "de") == "21,46"
    assert plain_number(21.4567891, "en") == "21.46"
    assert plain_number(21.4567891, "pt-BR") == "21,46"
    assert plain_number(21.4567891, "ja") == "21.46"
    assert plain_number(7.0, "de") == "7"
    assert plain_number(float("inf"), "de") == "inf", "not a number to write: as it is"
    # more for a reader who looks things up
    assert plain_number(21.4567891, digits=4) == "21.4568"
    assert plain_number(0.0042, digits=4) == "0.0042"
    assert plain_number(7.0, digits=4) == "7"
    # every language the notifications speak is on one side of the list
    assert set(_NOTIFICATION_STRINGS) > DECIMAL_COMMA_LANGUAGES
    assert {"en", "zh", "ja", "ko", "hi"}.isdisjoint(DECIMAL_COMMA_LANGUAGES)


# ─── the trigger detail ─────────────────────────────────────────────────────


def test_a_detail_rounds_numbers_wherever_they_sit() -> None:
    assert format_attribute_value(21.4567891) == "21.46"
    assert format_attribute_value(1234567.0) == "1234567"
    assert format_attribute_value(Decimal("21.4567891")) == "21.46"
    assert format_attribute_value([21.4567891, 0.5, 3]) == "21.46, 0.5, 3"
    assert format_attribute_value({"Cellar": 81.23456, "Attic": 40}) == "Cellar: 81.23, Attic: 40"
    assert format_attribute_value({"Cellar": 81.23456}, "de") == "Cellar: 81,23"
    # with a decimal comma a list of numbers is told apart by "; "
    assert format_attribute_value([21.4567891, 0.5, 3], "de") == "21,46; 0,5; 3"
    assert format_attribute_value({"Cellar": 81.23456, "Attic": 40}, "de") == "Cellar: 81,23; Attic: 40"
    assert format_attribute_value(["Trulicity: 3 left", "Ozempic: 1 left"], "de") == "Trulicity: 3 left, Ozempic: 1 left"
    assert format_attribute_value([21.4567891, 0.5], "en") == "21.46, 0.5"
    assert format_attribute_value(7) == "7", "a whole number is untouched"
    assert format_attribute_value(1234567) == "1234567"


def test_a_long_decimal_reported_as_text_is_rounded_too() -> None:
    assert format_attribute_value("21.456789") == "21.46"
    assert format_attribute_value(" 21.456789 ", "de") == "21,46"
    assert format_attribute_value("-0.123456") == "-0.12"
    # a short one may be a version or an amount as its integration writes it
    for kept in ("1.10", "2.5", "21.45", "192.168.1.10", "1.2.345", "v21.456789", "21.456789 %", "12345678", "1e5"):
        assert format_attribute_value(kept) == kept


async def test_the_detail_is_written_for_its_reader(hass: HomeAssistant) -> None:
    _reading(hass, 81.23456789)
    assert trigger_detail(hass, _tc()) == "81.23", "Home Assistant speaks English here"
    assert trigger_detail(hass, _tc(), "de") == "81,23"
    hass.config.language = "de"
    assert trigger_detail(hass, _tc()) == "81,23", "the to-do list and the panel: Home Assistant's language"
    assert trigger_detail(hass, _tc(), "en") == "81.23"


async def test_the_panel_is_told_which_numbers_to_write_its_own_way(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.models.task_result import TaskResult
    from custom_components.maintenance_supporter.websocket import _build_task_summary

    hass.config.language = "de"
    numbers: list[str] = []
    _reading(hass, {"Cellar": 81.23456, "Attic": 40.0, "Shed": 81.23456, "Firmware": "1.10"})
    assert trigger_detail(hass, _tc(), "en", numbers) == "Cellar: 81.23, Attic: 40, Shed: 81.23, Firmware: 1.10"
    assert numbers == ["81.23"], "each decimal once; a whole number and the entity's own text are not named"

    task = build_task_data(name="Air the cellar", schedule_type="sensor_based", interval_days=None, trigger_config=_tc())
    _reading(hass, 81.23456789)
    active = _build_task_summary(hass, TASK_ID_1, task, TaskResult(task={}, trigger_active=True))
    assert active["trigger_detail"] == "81.23", "a point whatever Home Assistant speaks: the panel knows its viewer"
    assert active["trigger_detail_numbers"] == ["81.23"]
    _reading(hass, ["Trulicity: 3 left"])
    plain = _build_task_summary(hass, TASK_ID_1, task, TaskResult(task={}, trigger_active=True))
    assert plain["trigger_detail"] == "Trulicity: 3 left" and plain["trigger_detail_numbers"] is None
    idle = _build_task_summary(hass, TASK_ID_1, task, TaskResult(task={}))
    assert idle["trigger_detail"] is None and idle["trigger_detail_numbers"] is None


async def test_the_reminder_speaks_the_notification_language_and_the_event_a_point(hass: HomeAssistant) -> None:
    make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_QUIET_HOURS_ENABLED: False, CONF_NOTIFICATION_LANGUAGE: "de"})
    _reading(hass, 81.23456789)
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: build_task_data(name="Air the cellar", schedule_type="sensor_based", interval_days=None, trigger_config=_tc())},
        name="Cellar",
        uid="rounding_2121",
    )
    assert hass.config.language == "en"
    nm = NotificationManager(hass)
    assert nm._trigger_detail(MaintenanceStatus.TRIGGERED, obj.entry_id, TASK_ID_1) == "81,23"
    ctx = notification_context(hass, KIND_STATUS, status="triggered", entry_id=obj.entry_id, task_id=TASK_ID_1)
    assert ctx["trigger_detail"] == "81.23", "rounded like the push, with a point: an automation may read the number"

    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    await nm.async_task_status_changed(
        entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Air the cellar", object_name="Cellar", new_status=MaintenanceStatus.TRIGGERED
    )
    await hass.async_block_till_done()
    message = calls.call_args[0][0].data["message"]
    assert message.endswith("\n81,23"), message
    assert "81.23456789" not in message and "81.2346" not in message


# ─── the history note and the budget event ──────────────────────────────────


async def test_the_auto_completion_note_holds_the_reading_to_four_decimals(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    last = (dt_util.now().date() - timedelta(days=40)).isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(last_performed=last, interval_days=30)}, name="Softener", uid="rounding_note_2121")
    await setup_integration(hass, g, obj)
    await obj.runtime_data.coordinator.async_auto_complete_on_recovery(TASK_ID_1, 1234567.891234)
    notes = [h.get("notes") for h in get_task_store_state(hass, obj.entry_id, TASK_ID_1).get("history", []) if h.get("type") == "completed"]
    assert notes[-1] == "Auto-completed: sensor recovered (1234567.8912)", "a point: the panel translates the note"


async def test_the_budget_event_carries_the_amounts_to_the_cent(hass: HomeAssistant) -> None:
    make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_QUIET_HOURS_ENABLED: False})
    spent = 0.1 + 0.2 + 123.15 + 0.004
    assert len(repr(spent)) > 8, "the sum of costs is not a round number"
    with patch(
        "custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", AsyncMock(return_value=True)
    ) as sent:
        await NotificationManager(hass).async_budget_alert("monthly", spent, 150.0, "€", decimals=2)
    payload, context = sent.await_args.args[2], sent.await_args.args[3]
    assert "123.45€" in payload["message"]
    assert context["spent"] == 123.45 and context["budget"] == 150.0 and context["percent"] == 82
    with patch(
        "custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", AsyncMock(return_value=True)
    ) as sent:
        await NotificationManager(hass).async_budget_alert("yearly", 950.6 + 1e-9, 1000.0, "€", decimals=0)
    # The message has no decimals by default; the event keeps the cents.
    assert "951€" in sent.await_args.args[2]["message"]
    assert sent.await_args.args[3]["spent"] == 950.6
    with patch(
        "custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", AsyncMock(return_value=True)
    ) as sent:
        await NotificationManager(hass).async_budget_alert("monthly", 12.34567, 15.0, "BHD", decimals=3)
    assert sent.await_args.args[3]["spent"] == 12.346, "a currency of three decimals keeps three"


# ─── the due date ───────────────────────────────────────────────────────────


@pytest.mark.parametrize(("lang", "written"), [("en", "November 20"), ("de", "20. November"), ("fr", "20 novembre")])
async def test_the_due_date_is_written_out_in_the_notification_language(hass: HomeAssistant, lang: str, written: str) -> None:
    """ "(Due: 2026-11-20)" is not read at a glance; the event keeps the ISO date."""
    from freezegun import freeze_time

    make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_QUIET_HOURS_ENABLED: False, CONF_NOTIFICATION_LANGUAGE: lang})
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(name="Clean filter")}, name="Dishwasher", uid=f"due_date_{lang}")
    with (
        freeze_time("2026-11-14 10:00:00"),
        patch(
            "custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", AsyncMock(return_value=True)
        ) as sent,
    ):
        nm = NotificationManager(hass)
        title, message = nm._build_message(MaintenanceStatus.DUE_SOON, lang, "Clean filter", "Dishwasher", 6, "2026-11-20")
        assert written in message and "2026-11-20" not in message, message
        # another year is named, an unknown date reads "?", a text that is no date stays
        assert "2027" in nm._build_message(MaintenanceStatus.DUE_SOON, lang, "Clean filter", "Dishwasher", 400, "2027-12-19")[1]
        assert "?" in nm._build_message(MaintenanceStatus.DUE_SOON, lang, "Clean filter", "Dishwasher", None, None)[1]
        assert "soon" in nm._build_message(MaintenanceStatus.DUE_SOON, lang, "Clean filter", "Dishwasher", 3, "soon")[1]
        # the task's own text gets the same {due}
        own = {"notification_texts": {"due_soon": {"message": "{task}: {due}"}}}
        assert nm._build_message(MaintenanceStatus.DUE_SOON, lang, "Clean filter", "Dishwasher", 6, "2026-11-20", task=own)[1] == f"Clean filter: {written}"

        await nm.async_task_status_changed(
            entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Clean filter", object_name="Dishwasher",
            new_status=MaintenanceStatus.DUE_SOON, days_until_due=6, next_due="2026-11-20",
        )
    payload, context = sent.await_args.args[2], sent.await_args.args[3]
    assert written in payload["message"]
    assert context["next_due"] == "2026-11-20", "an automation reads the ISO date"
