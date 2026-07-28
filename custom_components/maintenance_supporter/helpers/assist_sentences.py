"""Install the Assist sentence files into Home Assistant's config directory.

Home Assistant's classic (non-LLM) conversation agent loads custom sentences
from exactly one place: ``<config>/custom_sentences/<language>/`` — see
``conversation/default_agent.py``. There is no mechanism for an integration to
contribute sentences from its own package, so the documentation used to ask
users to copy a file out of the repository by hand.

That instruction quietly did not work for HACS installs at all: the sentence
files lived outside ``custom_components/`` and the release ZIP carries only the
integration, so the file the docs pointed at did not exist on disk. The classic
agent therefore matched none of our intents, silently — the LLM pipelines were
unaffected, which is why it went unnoticed.

The files now ship inside the integration, and this module performs the copy
the user would have done, on request:

* opt-in only (``CONF_INSTALL_ASSIST_SENTENCES``) — writing into somebody's
  config directory is not something to do because we can;
* every file we write carries a provenance stamp with the SHA-256 of the
  content we wrote. On a later upgrade we refuse to touch a file whose hash no
  longer matches, because that means the user edited it and their sentences
  are worth more than ours;
* turning the setting off removes only files we still recognise as ours.

LLM-based Assist pipelines never need any of this: they pick the intents up as
tools directly.
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

#: Directory inside the integration holding the shipped sentence files.
_PACKAGE_DIR = Path(__file__).parent.parent / "assist_sentences"

#: Name every installed file gets; also how we recognise our own files.
_FILENAME = "maintenance_supporter.yaml"

#: Marker line prefixed to every file we write. The hash covers the body only.
_STAMP = "# maintenance_supporter:managed "


def available_languages() -> list[str]:
    """Languages we ship sentences for, in a stable order."""
    if not _PACKAGE_DIR.is_dir():
        return []
    return sorted(p.name for p in _PACKAGE_DIR.iterdir() if (p / _FILENAME).is_file())


def _body(language: str) -> str | None:
    source = _PACKAGE_DIR / language / _FILENAME
    try:
        return source.read_text(encoding="utf-8")
    except OSError:
        _LOGGER.debug("No shipped sentences for %s", language, exc_info=True)
        return None


def _stamped(body: str) -> str:
    digest = hashlib.sha256(body.encode("utf-8")).hexdigest()
    return f"{_STAMP}{digest}\n{body}"


def _is_ours(text: str) -> bool:
    """True when *text* is a file we wrote and nobody has edited since.

    A file we wrote but that was then edited fails this check, which is the
    point: it protects the user's own sentences from being overwritten by an
    upgrade.
    """
    first, _, body = text.partition("\n")
    if not first.startswith(_STAMP):
        return False
    return hashlib.sha256(body.encode("utf-8")).hexdigest() == first[len(_STAMP) :].strip()


def _target(hass: HomeAssistant, language: str) -> Path:
    return Path(hass.config.path("custom_sentences", language, _FILENAME))


def _sync(hass: HomeAssistant, enabled: bool) -> tuple[list[str], list[str]]:
    """Blocking half of :func:`async_sync` — runs in the executor."""
    written: list[str] = []
    skipped: list[str] = []

    for language in available_languages():
        body = _body(language)
        if body is None:
            continue
        target = _target(hass, language)

        if not enabled:
            # Only remove what is still recognisably ours.
            try:
                if target.is_file() and _is_ours(target.read_text(encoding="utf-8")):
                    target.unlink()
                    written.append(language)
            except OSError:
                _LOGGER.warning("Could not remove %s", target, exc_info=True)
            continue

        desired = _stamped(body)
        try:
            if target.is_file():
                current = target.read_text(encoding="utf-8")
                if current == desired:
                    continue  # already up to date
                if not _is_ours(current):
                    # Hand-written or edited — leave it alone and say so.
                    skipped.append(language)
                    continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(desired, encoding="utf-8")
            written.append(language)
        except OSError:
            _LOGGER.warning("Could not write %s", target, exc_info=True)

    return written, skipped


async def async_sync(hass: HomeAssistant, enabled: bool) -> tuple[list[str], list[str]]:
    """Install (or remove) the sentence files and reload the conversation agent.

    Returns ``(changed_languages, skipped_languages)``; *skipped* are files that
    exist but are not ours to touch.
    """
    written, skipped = await hass.async_add_executor_job(_sync, hass, enabled)

    if skipped:
        _LOGGER.info(
            "Left existing custom_sentences files untouched for %s — they were "
            "edited or written by hand",
            ", ".join(skipped),
        )

    if written:
        _LOGGER.info(
            "%s Assist sentences for %s",
            "Installed" if enabled else "Removed",
            ", ".join(written),
        )
        # Without a reload the agent keeps its cached intents until restart.
        if hass.services.has_service("conversation", "reload"):
            try:
                await hass.services.async_call("conversation", "reload", blocking=True)
            except Exception:  # noqa: BLE001 - a failed reload must not break setup
                _LOGGER.debug("conversation.reload failed", exc_info=True)

    return written, skipped
