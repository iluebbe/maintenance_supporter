"""How a spoken name finds its task (helpers/intent_match).

The first matcher required every word of the phrase to be a literal
substring of "task name + object name". The voice audit of 2026-09-30 found
the phrasings people actually use all failing: an article ("den
Wasserfilter"), the preposition joining task and object ("oil change on the
car" — the example in our own documentation), a plural ("water filters"),
an elided article ("l'huile"), or an accent the speech engine dropped. The
old tests only sent pre-stripped phrases like "oil change car", which is
why none of that showed.
"""

from __future__ import annotations

import pytest

from custom_components.maintenance_supporter.helpers.intent_match import (
    content_tokens,
    fold,
    match_rows,
)


def _rows(*pairs: tuple[str, str]) -> list[dict[str, str]]:
    return [{"name": name, "object_name": obj} for name, obj in pairs]


def _names(result: list[dict[str, str]]) -> list[tuple[str, str]]:
    return [(r["name"], r["object_name"]) for r in result]


HOUSE = _rows(
    ("Oil Change", "Car"),
    ("Oil Change", "Motorbike"),
    ("Water Filter", "Kitchen Sink"),
    ("Filter", "Pool"),
    ("Filter check", "Pool"),
    ("Ölwechsel", "Rasenmäher"),
    ("Entkalken", "Kaffeemaschine"),
    ("Vidange", "Tondeuse"),
    ("Huile", "Tondeuse"),
    ("Descaling", "Espresso Machine"),
)


@pytest.mark.parametrize(
    ("query", "language", "expected"),
    [
        # the documented example — "task on object"
        ("oil change on the car", "en", [("Oil Change", "Car")]),
        ("the oil change of the motorbike", "en", [("Oil Change", "Motorbike")]),
        # articles and German contractions
        ("den Ölwechsel am Rasenmäher", "de", [("Ölwechsel", "Rasenmäher")]),
        ("das Entkalken der Kaffeemaschine", "de", [("Entkalken", "Kaffeemaschine")]),
        # a plural / inflection of the stored name
        ("the water filters", "en", [("Water Filter", "Kitchen Sink")]),
        ("Kaffeemaschinen entkalken", "de", [("Entkalken", "Kaffeemaschine")]),
        # an elided French article, accents dropped by the engine
        ("l'huile de la tondeuse", "fr", [("Huile", "Tondeuse")]),
        ("olwechsel rasenmaher", "de", [("Ölwechsel", "Rasenmäher")]),
        # the whole spoken name beats one that merely contains the words
        ("pool filter", "en", [("Filter", "Pool")]),
        ("filter check on the pool", "en", [("Filter check", "Pool")]),
        # unrelated / nothing
        ("gutter cleaning", "en", []),
    ],
)
def test_the_phrases_people_use_find_their_task(query: str, language: str, expected: list[tuple[str, str]]) -> None:
    assert _names(match_rows(query, HOUSE, language)) == expected


def test_a_name_shared_by_two_objects_stays_ambiguous() -> None:
    """Resolved only by naming the object — never by guessing."""
    assert len(match_rows("oil change", HOUSE, "en")) == 2
    assert _names(match_rows("the oil change on the car", HOUSE, "en")) == [("Oil Change", "Car")]


def test_filler_words_alone_match_nothing() -> None:
    assert match_rows("the on of", HOUSE, "en") == []
    assert match_rows("", HOUSE, "en") == []


def test_a_script_without_spaces_matches_by_the_whole_name() -> None:
    """Japanese and Chinese write "the pool's filter" as one run of
    characters; the words cannot be split out, but the stored name can be
    found inside it."""
    rows = _rows(("フィルター", "プール"), ("フィルター", "浴室"), ("滤水器", "厨房"))
    assert _names(match_rows("プールのフィルター", rows, "ja")) == [("フィルター", "プール")]
    assert _names(match_rows("厨房的滤水器", rows, "zh")) == [("滤水器", "厨房")]
    assert len(match_rows("フィルター", rows, "ja")) == 2


def test_the_ambiguity_answer_is_a_phrase_that_resolves() -> None:
    """The "say it like this" example is "task <connector> object" in the
    speaker's language — it must resolve when repeated, in every language the
    answer is given in."""
    from custom_components.maintenance_supporter.helpers.intent_speech import available_languages, load_language

    rows = _rows(("Water Filter", "Kitchen Sink"), ("Water Filter", "Garage"))
    for language in available_languages():
        example = load_language(language)["item_on"].format(task="Water Filter", object="Garage")
        assert _names(match_rows(example, rows, language)) == [("Water Filter", "Garage")], (language, example)


def test_folding_is_the_same_on_both_sides() -> None:
    assert fold("Straße") == fold("STRASSE")
    assert fold("Café") == fold("cafe")
    assert fold("l’huile") == "l'huile"
    assert content_tokens("den Ölwechsel am Auto", "de") == ["olwechsel", "auto"]
