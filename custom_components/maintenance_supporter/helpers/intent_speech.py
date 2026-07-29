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
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant

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
    from .i18n import normalize_language_code

    if not _TABLE:
        # async_load has not run (a direct handler call in a test, or setup
        # raced); read synchronously rather than answer nothing.
        _TABLE.update(_load_all())

    lang = normalize_language_code(language)
    text = _TABLE.get(lang, {}).get(key)
    if text is None:
        text = _TABLE.get(FALLBACK_LANGUAGE, {}).get(key)
    if text is None:
        return key
    try:
        return text.format(**fmt)
    except (KeyError, IndexError):
        # A translation with a stray placeholder must not take the answer down;
        # the parity test exists to keep this branch unreachable.
        _LOGGER.warning("Malformed Assist response %s/%s", lang, key)
        english = _TABLE.get(FALLBACK_LANGUAGE, {}).get(key, key)
        try:
            return english.format(**fmt)
        except (KeyError, IndexError):
            return english
