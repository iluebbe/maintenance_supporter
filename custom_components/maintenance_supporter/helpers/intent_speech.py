"""What the voice intents say, per language.

Split out of ``intent.py`` when the table grew from 2 languages to 22: 38 keys
inline was already the largest block in that module, and 22 would have buried
the handlers it belongs to.

The texts live in JSON next to the sentence files (``assist_sentences/
responses/<lang>.json``) rather than in Python, so a translator can work on one
file without touching code, and so the parity gate can simply compare files.
They are read once, in the executor, when the intents are registered — an
intent handler must never block the event loop on disk I/O, and these strings
are needed on every single spoken answer.

English is the fallback for any language we do not ship and for any key a
translation is missing, so a partial file degrades one sentence rather than
breaking the response.
"""

from __future__ import annotations

import json
import logging
from datetime import date
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

_LOGGER = logging.getLogger(__name__)

_RESPONSE_DIR = Path(__file__).parent.parent / "assist_sentences" / "responses"

#: language code -> key -> text. Populated by :func:`async_load`.
_TABLE: dict[str, dict[str, str]] = {}

FALLBACK_LANGUAGE = "en"


def _load_all() -> dict[str, dict[str, str]]:
    """Blocking read of every shipped response file."""
    table: dict[str, dict[str, str]] = {}
    if not _RESPONSE_DIR.is_dir():
        _LOGGER.warning("No Assist response texts found at %s", _RESPONSE_DIR)
        return table
    for path in sorted(_RESPONSE_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            _LOGGER.warning("Could not read Assist responses from %s", path, exc_info=True)
            continue
        if isinstance(data, dict):
            table[path.stem] = {str(k): str(v) for k, v in data.items()}
    return table


async def async_load(hass: HomeAssistant) -> None:
    """Read the response texts into memory (once)."""
    if _TABLE:
        return
    loaded = await hass.async_add_executor_job(_load_all)
    _TABLE.update(loaded)
    _LOGGER.debug("Loaded Assist responses for %s", ", ".join(sorted(_TABLE)))


def available_languages() -> list[str]:
    """Languages with a shipped response file, read straight from disk.

    Used by the tests and by :func:`speak` before anything is loaded; it does
    not depend on ``async_load`` having run.
    """
    if not _RESPONSE_DIR.is_dir():
        return []
    return sorted(p.stem for p in _RESPONSE_DIR.glob("*.json"))


def load_language(language: str) -> dict[str, str]:
    """The raw texts for one language (test helper; blocking)."""
    path = _RESPONSE_DIR / f"{language}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    # Coerce like the loader does rather than returning json's Any: the
    # annotation is what every caller relies on, and mypy --strict says so.
    return {str(key): str(value) for key, value in data.items()}


def speak(key: str, language: str | None, **fmt: Any) -> str:
    """The spoken text for *key* in *language*, formatted with *fmt*.

    Falls back to English per key, so a translation that is missing one line
    costs that line and not the whole answer.
    """
    from .i18n import format_text, normalize_language_code

    if not _TABLE:
        # async_load has not run (a direct handler call in a test, or setup
        # raced); read synchronously rather than answer nothing.
        _TABLE.update(_load_all())

    # The shared formatter: per-key English fallback, and a translation with a
    # stray placeholder falls back to the English line instead of taking the
    # answer down (the parity test keeps that branch unreachable).
    return format_text(_TABLE, normalize_language_code(language), key, **fmt)


# ─── number forms ─────────────────────────────────────────────────────────

#: Languages whose nouns take a separate form for 2-4 ("2 дня", "3 dny"),
#: and those whose "one" form also covers 21, 31, … ("21 день"). A response
#: file may carry ``<key>_few`` / ``<key>_one_n`` for exactly these; every
#: other language says "{days} days" for anything but one.
FEW_FORM_LANGUAGES = frozenset({"ru", "uk", "pl", "cs"})
ONE_N_FORM_LANGUAGES = frozenset({"ru", "uk"})


def plural_category(language: str | None, count: int) -> str:
    """The CLDR plural category of *count*, reduced to what the texts use:
    ``one``, ``few`` or ``other``."""
    from .i18n import normalize_language_code

    lang = normalize_language_code(language)
    if lang in ONE_N_FORM_LANGUAGES:
        if count % 10 == 1 and count % 100 != 11:
            return "one"
        if 2 <= count % 10 <= 4 and not 12 <= count % 100 <= 14:
            return "few"
        return "other"
    if lang == "pl":
        if count == 1:
            return "one"
        if 2 <= count % 10 <= 4 and not 12 <= count % 100 <= 14:
            return "few"
        return "other"
    if lang == "cs":
        if count == 1:
            return "one"
        return "few" if 2 <= count <= 4 else "other"
    return "one" if count == 1 else "other"


def speak_count(key: str, language: str | None, number: int, **fmt: Any) -> str:
    """:func:`speak` for a text that carries a number.

    ``<key>_one`` is the number-less singular every language has ("due
    tomorrow", "one hour"). ``<key>_few`` and ``<key>_one_n`` exist only in
    the languages that need them, so they are looked up in that language's
    own table — an English fallback would put a Russian noun in the wrong
    case, which is exactly the mistake these keys exist to prevent.
    """
    from .i18n import normalize_language_code

    if not _TABLE:
        _TABLE.update(_load_all())
    own = _TABLE.get(normalize_language_code(language), {})
    category = plural_category(language, number)
    if number == 1 and f"{key}_one" in _TABLE.get(FALLBACK_LANGUAGE, {}):
        return speak(f"{key}_one", language, **fmt)
    if category == "one" and f"{key}_one_n" in own:
        return speak(f"{key}_one_n", language, **fmt)
    if category == "few" and f"{key}_few" in own:
        return speak(f"{key}_few", language, **fmt)
    return speak(key, language, **fmt)


# ─── dates ────────────────────────────────────────────────────────────────


def spoken_date(day: date, language: str | None) -> str:
    """A date the way it is said ("October 3", "3. Oktober"), not ISO.

    The month names and the order live in the response files next to every
    other spoken text, so a translator fixes both in one place. The year is
    named only when it is not this year.
    """
    from homeassistant.util import dt as dt_util

    months = [m.strip() for m in speak("months", language).split(",")]
    if len(months) != 12:  # a broken translation: say the date unambiguously
        return day.isoformat()
    key = "date_format" if day.year == dt_util.now().year else "date_format_year"
    return speak(key, language, day=day.day, month=months[day.month - 1], year=day.year)


def spoken_iso_date(raw: Any, language: str | None) -> str | None:
    """:func:`spoken_date` for a stored ISO date/datetime string, or None."""
    if not isinstance(raw, str) or len(raw) < 10:
        return None
    try:
        return spoken_date(date.fromisoformat(raw[:10]), language)
    except ValueError:
        return None


# ─── refusals ─────────────────────────────────────────────────────────────


def _translation_language(language: str | None) -> str:
    """The ``translations/<file>`` name for a spoken language code."""
    from .i18n import normalize_language_code

    lang = normalize_language_code(language)
    if lang == "pt-br":
        return "pt-BR"
    if lang == "zh":
        return "zh-Hans"
    return lang


async def async_refusal(hass: HomeAssistant, err: HomeAssistantError, language: str | None) -> str:
    """The reason a coordinator refused, in the language that was spoken.

    ``str(err)`` is always English: Home Assistant renders an exception's
    message with its own language hard-coded to "en". The translated text is
    in our ``exceptions`` translations already — the panel shows it — so read
    it for the speaker's language instead, and fall back to ``str(err)`` for
    an error that carries no translation key.
    """
    from homeassistant.helpers.translation import async_get_translations

    from ..const import DOMAIN

    key = getattr(err, "translation_key", None)
    if not key or getattr(err, "translation_domain", None) != DOMAIN:
        return str(err)
    try:
        strings = await async_get_translations(hass, _translation_language(language), "exceptions", [DOMAIN])
    except Exception:  # noqa: BLE001 - a missing translation must not cost the answer
        return str(err)
    template = strings.get(f"component.{DOMAIN}.exceptions.{key}.message")
    if not template:
        return str(err)
    try:
        return template.format(**(getattr(err, "translation_placeholders", None) or {}))
    except (KeyError, IndexError, ValueError):
        return str(err)
