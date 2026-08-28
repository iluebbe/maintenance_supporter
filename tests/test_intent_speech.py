"""What the voice intents say, in every shipped language.

The spoken texts carry placeholders — `{task}`, `{days}`, `{count}` — that are
filled at runtime. A translation that renames, drops or invents one does not
fail at import; it fails when somebody asks a question, deep inside
`str.format`, and only in that language. These gates make that a test failure
instead.

The UI ships 22 languages. Sentence PATTERNS deliberately do not (they are
grammar, not text, and a wildcard cannot inflect a task name), but the response
texts can and should follow the UI.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest

from custom_components.maintenance_supporter.helpers.intent_speech import (
    FALLBACK_LANGUAGE,
    _RESPONSE_DIR,
    available_languages,
    load_language,
    speak,
)

_PLACEHOLDER = re.compile(r"\{(\w+)\}")
_UI_LOCALES = (
    Path(__file__).parent.parent
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
    / "locales"
)


def _ui_languages() -> set[str]:
    return {p.stem for p in _UI_LOCALES.glob("*.json")}


def _english() -> dict[str, str]:
    return load_language(FALLBACK_LANGUAGE)


# ─── coverage ─────────────────────────────────────────────────────────────


def test_english_exists_and_is_the_fallback() -> None:
    assert FALLBACK_LANGUAGE in available_languages()
    assert _english(), "the fallback language has no texts"


def test_every_ui_language_can_be_spoken() -> None:
    """A language good enough for the panel is good enough for the answer.

    Patterns are a separate question — this is only about the words the
    assistant says once an intent has been matched (which, for 20 of the 22,
    happens through an LLM pipeline).
    """
    missing = sorted(_ui_languages() - set(available_languages()))
    assert not missing, f"UI languages without spoken responses: {missing}"


def test_no_response_file_for_a_language_the_ui_does_not_have() -> None:
    """Otherwise a typo'd filename silently ships as a language."""
    extra = sorted(set(available_languages()) - _ui_languages())
    assert not extra, f"response files for unknown languages: {extra}"


# ─── the part that breaks at runtime ──────────────────────────────────────


@pytest.mark.parametrize("language", available_languages())
def test_keys_and_placeholders_match_english(language: str) -> None:
    english = _english()
    texts = load_language(language)

    missing = sorted(set(english) - set(texts))
    assert not missing, f"{language}: missing keys {missing}"
    extra = sorted(set(texts) - set(english))
    assert not extra, f"{language}: unknown keys {extra}"

    wrong: list[str] = []
    for key, source in english.items():
        expected = set(_PLACEHOLDER.findall(source))
        actual = set(_PLACEHOLDER.findall(texts[key]))
        if expected != actual:
            wrong.append(
                f"{key}: expected {sorted(expected) or 'none'}, "
                f"got {sorted(actual) or 'none'} — {texts[key]!r}"
            )
    assert not wrong, f"{language}: placeholder mismatch\n  " + "\n  ".join(wrong)


@pytest.mark.parametrize("language", available_languages())
def test_every_text_actually_formats(language: str) -> None:
    """The failure this really guards: a stray brace or a `{}` left behind.

    `str.format` raises on those, and the raise happens while answering a
    question — the one moment nobody is watching a log.
    """
    values = {name: "X" for name in {"days", "count", "hours", "qty", "stock", "page", "index"}}
    values |= {
        name: "X"
        for name in {
            "task", "object", "date", "items", "name", "candidates", "segments",
            "notes", "steps", "title", "part", "extras", "loc", "low",
            # cycle phases (#139 voice pass)
            "phase", "next",
        }
    }
    for key, text in load_language(language).items():
        try:
            text.format(**values)
        except (KeyError, IndexError, ValueError) as err:
            pytest.fail(f"{language}/{key} does not format: {err} — {text!r}")


@pytest.mark.parametrize("language", available_languages())
def test_no_text_is_left_in_english(language: str) -> None:
    """A copy-paste that forgot to translate is worse than an obvious gap: it
    looks finished. Short shared words and proper nouns are legitimate, so this
    only flags whole texts identical to English."""
    if language == FALLBACK_LANGUAGE:
        return
    english = _english()
    texts = load_language(language)
    identical = [
        key
        for key, text in texts.items()
        # Fragments of one or two words are often genuinely the same.
        if text == english.get(key) and len(text.split()) > 2
    ]
    assert not identical, f"{language}: untranslated (identical to English): {identical}"


# ─── the lookup itself ────────────────────────────────────────────────────


def test_an_unknown_language_falls_back_to_english() -> None:
    assert speak("none_due", "xx-YY") == _english()["none_due"]


def test_a_regional_variant_resolves_to_its_base() -> None:
    assert speak("none_due", "de-AT") == load_language("de")["none_due"]


def test_formatting_reaches_the_translation() -> None:
    spoken = speak("st_overdue", "de", days=3)
    assert "3" in spoken
    assert spoken != load_language("en")["st_overdue"].format(days=3)


def test_an_unknown_key_does_not_explode() -> None:
    assert speak("no_such_key_at_all", "en") == "no_such_key_at_all"


def test_response_files_are_plain_flat_string_maps() -> None:
    """Guards the loader's assumption; a nested object would stringify into
    something unspeakable."""
    for language in available_languages():
        data = json.loads((_RESPONSE_DIR / f"{language}.json").read_text(encoding="utf-8"))
        assert isinstance(data, dict), f"{language}: not an object"
        bad = [k for k, v in data.items() if not isinstance(v, str)]
        assert not bad, f"{language}: non-string values for {bad}"


# ─── the singular that was wrong in every language ────────────────────────


@pytest.mark.parametrize(
    ("days", "expected_key"),
    [(-3, "st_overdue"), (-1, "st_overdue_one"), (0, "st_due_today"), (1, "st_due_in_one"), (5, "st_due_in")],
)
def test_the_right_number_form_is_chosen(days: int, expected_key: str) -> None:
    """Shipped English said "1 days overdue" and German "seit 1 Tagen".

    Nobody noticed until the Slavic translations forced the question: there the
    numeral governs the noun's CASE, so one string cannot serve both. The fix is
    a separate singular key — and this is the test that it is actually picked,
    which the data files alone cannot show.
    """
    from custom_components.maintenance_supporter.intent import _describe

    task = {
        "name": "Descale",
        "object_name": "Coffee Machine",
        "status": "overdue" if days < 0 else "due_soon",
        "days_until_due": days,
    }
    spoken = _describe(task, "en")
    english = _english()
    assert english[expected_key].format(days=abs(days)) in spoken


def test_one_day_never_reads_as_a_plural_in_any_language() -> None:
    """The regression itself, across the board: whatever each language says for
    a single day, it must not be the same string it uses for several."""
    for language in available_languages():
        texts = load_language(language)
        assert texts["st_overdue_one"] != texts["st_overdue"], f"{language}: st_overdue_one"
        assert texts["st_due_in_one"] != texts["st_due_in"], f"{language}: st_due_in_one"


def test_the_singular_keys_take_no_placeholder() -> None:
    """The count is known to be one, so writing it out is the point; a stray
    {days} would reintroduce the digit the singular exists to avoid."""
    for language in available_languages():
        texts = load_language(language)
        for key in ("st_overdue_one", "st_due_in_one"):
            assert not _PLACEHOLDER.findall(texts[key]), f"{language}/{key}: {texts[key]!r}"


# ─── the paths that only run when something is wrong ──────────────────────


def test_a_missing_response_directory_degrades_to_the_key(tmp_path, monkeypatch) -> None:
    """A partial install must not take every spoken answer down with it."""
    from custom_components.maintenance_supporter.helpers import intent_speech

    monkeypatch.setattr(intent_speech, "_RESPONSE_DIR", tmp_path / "gone")
    monkeypatch.setattr(intent_speech, "_TABLE", {})
    assert intent_speech.available_languages() == []
    assert intent_speech._load_all() == {}
    assert intent_speech.speak("none_due", "en") == "none_due"


def test_an_unreadable_response_file_is_skipped_not_fatal(tmp_path, monkeypatch) -> None:
    """One corrupt file must cost that language, not the whole table."""
    from custom_components.maintenance_supporter.helpers import intent_speech

    (tmp_path / "en.json").write_text('{"none_due": "All good."}', encoding="utf-8")
    (tmp_path / "de.json").write_text("{ this is not json", encoding="utf-8")
    monkeypatch.setattr(intent_speech, "_RESPONSE_DIR", tmp_path)

    table = intent_speech._load_all()
    assert set(table) == {"en"}, "a broken file took a good one with it"


def test_a_non_object_response_file_is_ignored(tmp_path, monkeypatch) -> None:
    from custom_components.maintenance_supporter.helpers import intent_speech

    (tmp_path / "en.json").write_text('["not", "a", "map"]', encoding="utf-8")
    monkeypatch.setattr(intent_speech, "_RESPONSE_DIR", tmp_path)
    assert intent_speech._load_all() == {}


def test_a_stray_placeholder_falls_back_instead_of_raising(monkeypatch) -> None:
    """`str.format` raises on an unknown placeholder, and it would raise while
    answering a spoken question. The parity gate keeps this unreachable; this
    proves what happens if it ever is reached."""
    from custom_components.maintenance_supporter.helpers import intent_speech

    monkeypatch.setattr(
        intent_speech,
        "_TABLE",
        {"de": {"k": "{nonexistent} kaputt"}, "en": {"k": "{task} is fine"}},
    )
    assert intent_speech.speak("k", "de", task="Descale") == "Descale is fine"


def test_a_stray_placeholder_in_english_too_returns_the_raw_text(monkeypatch) -> None:
    from custom_components.maintenance_supporter.helpers import intent_speech

    monkeypatch.setattr(
        intent_speech,
        "_TABLE",
        {"de": {"k": "{nope} x"}, "en": {"k": "{alsonope} y"}},
    )
    assert intent_speech.speak("k", "de", task="X") == "{alsonope} y"


async def test_async_load_is_idempotent(hass) -> None:
    """It is called on every intent registration; re-reading 22 files each
    time would be waste."""
    from custom_components.maintenance_supporter.helpers import intent_speech

    intent_speech._TABLE.clear()
    await intent_speech.async_load(hass)
    first = dict(intent_speech._TABLE)
    assert first
    intent_speech._TABLE["marker"] = {"x": "y"}
    await intent_speech.async_load(hass)
    assert "marker" in intent_speech._TABLE, "async_load re-read an already-loaded table"
    intent_speech._TABLE.pop("marker", None)
