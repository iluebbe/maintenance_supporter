"""The small grammar of spoken answers: number forms, dates, refusals, numbers.

Voice audit 2026-09-30: answers read "1 hours" and "1 checklist steps",
Russian said "2 дней" (it is "2 дня"), dates came out as "2026-10-03", every
refusal ("this task needs a note") was English whatever the language, and
nothing parsed "12,5" as twelve and a half.
"""

from __future__ import annotations

import json
from datetime import date
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import DOMAIN
from custom_components.maintenance_supporter.helpers import intent_speech
from custom_components.maintenance_supporter.helpers.intent_speech import (
    async_refusal,
    plural_category,
    speak_count,
    spoken_date,
    spoken_iso_date,
)
from custom_components.maintenance_supporter.intent_household import parse_spoken_number, say_number

# ─── number forms ─────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("language", "count", "category"),
    [
        ("en", 1, "one"), ("en", 2, "other"), ("en", 21, "other"),
        ("ru", 1, "one"), ("ru", 21, "one"), ("ru", 11, "other"), ("ru", 3, "few"),
        ("ru", 22, "few"), ("ru", 12, "other"), ("ru", 5, "other"),
        ("uk", 101, "one"), ("uk", 104, "few"), ("uk", 114, "other"),
        ("pl", 1, "one"), ("pl", 21, "other"), ("pl", 23, "few"), ("pl", 13, "other"),
        ("cs", 1, "one"), ("cs", 4, "few"), ("cs", 22, "other"),
    ],
)
def test_the_plural_category_follows_the_language(language: str, count: int, category: str) -> None:
    assert plural_category(language, count) == category


def test_russian_days_take_the_form_the_number_needs() -> None:
    assert speak_count("st_overdue", "ru", 1, days=1) == intent_speech.speak("st_overdue_one", "ru")
    assert speak_count("st_overdue", "ru", 3, days=3) == "просрочка 3 дня"
    assert speak_count("st_overdue", "ru", 21, days=21) == "просрочка 21 день"
    assert speak_count("st_overdue", "ru", 5, days=5) == "просрочка 5 дней"
    assert speak_count("st_overdue", "ru", 12, days=12) == "просрочка 12 дней"


def test_one_hour_is_not_one_hours() -> None:
    spoken = speak_count("snoozed", "en", 1, task="Filter", object="Pool", hours=1)
    assert "one hour" in spoken and "hours" not in spoken
    assert "4 hours" in speak_count("snoozed", "en", 4, task="Filter", object="Pool", hours=4)


def test_a_language_without_a_few_form_uses_its_plural() -> None:
    """German has no few-form key; the plural text is right for 3."""
    assert speak_count("st_overdue", "de", 3, days=3) == "seit 3 Tagen überfällig"


# ─── dates ────────────────────────────────────────────────────────────────


def test_dates_are_said_not_read_out() -> None:
    year = dt_util.now().year
    assert spoken_date(date(year, 10, 3), "en") == "October 3"
    assert spoken_date(date(year, 10, 3), "de") == "3. Oktober"
    assert spoken_date(date(year, 10, 3), "ru") == "3 октября"
    assert spoken_date(date(year, 10, 3), "ja") == "10月3日"
    # Another year is named; this year's is not.
    assert spoken_date(date(year + 1, 1, 15), "en") == f"January 15, {year + 1}"
    assert spoken_date(date(year + 1, 1, 15), "hu") == f"{year + 1}. január 15."


def test_every_language_has_twelve_months() -> None:
    for language in intent_speech.available_languages():
        months = intent_speech.load_language(language)["months"].split(",")
        assert len(months) == 12 and all(m.strip() for m in months), language


def test_a_broken_month_list_falls_back_to_an_unambiguous_date(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setitem(intent_speech._TABLE, "xx", {"months": "only,three,months"})
    assert spoken_date(date(2031, 2, 1), "xx") == "2031-02-01"


def test_stored_iso_strings_are_spoken_or_none() -> None:
    year = dt_util.now().year
    assert spoken_iso_date(f"{year}-10-03T08:00:00+02:00", "en") == "October 3"
    assert spoken_iso_date("not-a-date", "en") is None
    assert spoken_iso_date(None, "en") is None


# ─── refusals ─────────────────────────────────────────────────────────────


async def test_a_refusal_is_spoken_in_the_speakers_language(hass: HomeAssistant) -> None:
    err = ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key="tag_scan_required",
        translation_placeholders={"task_name": "Filter"},
    )
    english = await async_refusal(hass, err, "en")
    german = await async_refusal(hass, err, "de")
    assert "Filter" in english and "Filter" in german
    assert english != german
    expected = json.loads(
        (intent_speech._RESPONSE_DIR.parent.parent / "translations" / "de.json").read_text(encoding="utf-8")
    )["exceptions"]["tag_scan_required"]["message"]
    assert german == expected.format(task_name="Filter")


async def test_an_untranslated_error_falls_back_to_its_message(hass: HomeAssistant) -> None:
    plain = HomeAssistantError("something broke")
    assert await async_refusal(hass, plain, "de") == "something broke"
    foreign = ServiceValidationError(translation_domain="other", translation_key="x")
    assert await async_refusal(hass, foreign, "de") == str(foreign)


async def test_a_translation_lookup_failure_costs_only_the_translation(hass: HomeAssistant) -> None:
    err = ServiceValidationError("fallback text", translation_domain=DOMAIN, translation_key="too_early")
    with patch(
        "homeassistant.helpers.translation.async_get_translations", side_effect=RuntimeError("boom")
    ):
        assert await async_refusal(hass, err, "de") == str(err)


@pytest.mark.parametrize(("language", "expected"), [("pt-BR", "pt-BR"), ("zh-CN", "zh-Hans"), ("de-CH", "de")])
def test_the_translation_file_for_a_regional_code(language: str, expected: str) -> None:
    assert intent_speech._translation_language(language) == expected


# ─── spoken numbers ───────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("text", "language", "value"),
    [
        ("1234.5", "en", 1234.5),
        ("1,234", "en", 1234.0),
        ("1,234.5 kWh", "en", 1234.5),
        ("12,5", "en", 12.5),
        ("12,5", "de", 12.5),
        ("12.500", "de", 12500.0),
        ("1.234,5", "de", 1234.5),
        ("1 234,5", "fr", 1234.5),
        ("12.5", "de", 12.5),
        ("-3", "en", -3.0),
        ("about 42 cubic metres", "en", 42.0),
        ("zwölf", "de", None),
        ("", "en", None),
    ],
)
def test_a_spoken_value_parses_with_the_languages_separators(text: str, language: str, value: float | None) -> None:
    assert parse_spoken_number(text, language) == value


def test_a_number_is_said_back_the_way_the_language_writes_it() -> None:
    assert say_number(12.5, "de") == "12,5"
    assert say_number(12.5, "en") == "12.5"
    assert say_number(4.0, "fr") == "4"
