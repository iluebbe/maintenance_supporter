"""Shipping the Assist sentence files into the config directory.

The classic conversation agent reads sentences from
``<config>/custom_sentences/<language>/`` and nowhere else. Ours used to live
outside ``custom_components/``, so the HACS release ZIP never carried them and
the file the docs told people to copy did not exist on their disk — the classic
agent matched none of our six intents, silently, because LLM pipelines were
unaffected and nobody else noticed.

These tests hold the fix to the two properties that make it safe to write into
somebody else's config directory: it only happens when asked, and it never
destroys work the user did by hand.
"""

from __future__ import annotations

from pathlib import Path

import pytest
import yaml
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter import intent as intent_module
from custom_components.maintenance_supporter.helpers.assist_sentences import (
    _PACKAGE_DIR,
    async_sync,
    available_languages,
)


def _installed(hass: HomeAssistant, language: str) -> Path:
    return Path(hass.config.path("custom_sentences", language, "maintenance_supporter.yaml"))


@pytest.fixture(autouse=True)
def _clean_config_sentences(hass: HomeAssistant):
    """Give every test an empty ``custom_sentences/``.

    The test ``hass`` fixture hands out a FIXED config directory, so anything
    written here outlives the test that wrote it — and this module deliberately
    leaves edited files behind. Without this, one test's leftovers made the
    next one skip its install and fail for the wrong reason, and the repo's
    testing_config directory slowly filled with generated YAML.
    """

    def _wipe() -> None:
        for language in available_languages():
            target = _installed(hass, language)
            if target.exists():
                target.unlink()
            # Remove the language dir too when we emptied it.
            if target.parent.is_dir() and not any(target.parent.iterdir()):
                target.parent.rmdir()
        root = Path(hass.config.path("custom_sentences"))
        if root.is_dir() and not any(root.iterdir()):
            root.rmdir()

    _wipe()
    yield
    _wipe()


# ─── the packaging defect itself ──────────────────────────────────────────


def test_the_sentence_files_ship_inside_the_integration() -> None:
    """The regression that started this: the files must sit under
    ``custom_components/maintenance_supporter/`` or the HACS ZIP drops them.

    The release archive is built from the integration directory alone, so a
    sentence file one level up reaches nobody who installed through HACS.
    """
    assert _PACKAGE_DIR.is_dir(), "assist_sentences/ is missing from the package"
    parts = _PACKAGE_DIR.resolve().parts
    assert "custom_components" in parts, f"{_PACKAGE_DIR} is outside custom_components/"
    assert parts[parts.index("custom_components") + 1] == "maintenance_supporter"
    assert available_languages(), "no shipped sentence languages found"


def test_every_shipped_file_is_valid_and_declares_its_language() -> None:
    for language in available_languages():
        raw = (_PACKAGE_DIR / language / "maintenance_supporter.yaml").read_text(encoding="utf-8")
        parsed = yaml.safe_load(raw)
        assert parsed["language"] == language, f"{language} file declares {parsed['language']}"
        assert parsed["intents"], f"{language} file has no intents"


# ─── A2: the sentences and the handlers must not drift apart ──────────────


def test_every_registered_intent_has_sentences_in_every_language() -> None:
    """A seventh intent shipping with no sentences would be invisible to the
    classic agent and nothing would fail. This is that missing failure."""
    registered = {
        value
        for name, value in vars(intent_module).items()
        if name.startswith("INTENT_") and isinstance(value, str)
    }
    assert registered, "no INTENT_* constants found — did they move?"

    for language in available_languages():
        parsed = yaml.safe_load(
            (_PACKAGE_DIR / language / "maintenance_supporter.yaml").read_text(encoding="utf-8")
        )
        covered = set(parsed["intents"])
        missing = sorted(registered - covered)
        extra = sorted(covered - registered)
        assert not missing, f"{language}: intents without sentences: {missing}"
        assert not extra, f"{language}: sentences for unknown intents: {extra}"


# ─── installing ───────────────────────────────────────────────────────────


async def test_nothing_is_written_until_asked(hass: HomeAssistant) -> None:
    """Opt-in means opt-in: the default must not touch the config directory."""
    await async_sync(hass, False)
    for language in available_languages():
        assert not _installed(hass, language).exists()


async def test_enabling_installs_every_shipped_language(hass: HomeAssistant) -> None:
    written, skipped = await async_sync(hass, True)

    assert not skipped
    assert set(written) == set(available_languages())
    for language in available_languages():
        target = _installed(hass, language)
        assert target.is_file(), f"{language} not installed"
        text = target.read_text(encoding="utf-8")
        # The body must be the shipped file verbatim — a mangled copy would
        # match no sentences at all.
        source = (_PACKAGE_DIR / language / "maintenance_supporter.yaml").read_text(encoding="utf-8")
        assert text.endswith(source)
        assert yaml.safe_load(text)["language"] == language


async def test_installing_twice_is_a_no_op(hass: HomeAssistant) -> None:
    await async_sync(hass, True)
    written, skipped = await async_sync(hass, True)
    assert written == [], "an unchanged file was rewritten"
    assert skipped == []


async def test_a_file_the_user_edited_is_never_overwritten(hass: HomeAssistant) -> None:
    """The whole reason for the provenance stamp.

    Someone who tuned their own sentences has something more valuable than our
    defaults; an upgrade must not silently replace it.
    """
    language = available_languages()[0]
    await async_sync(hass, True)

    target = _installed(hass, language)
    mine = target.read_text(encoding="utf-8") + '\n# my own sentence\n'
    target.write_text(mine, encoding="utf-8")

    written, skipped = await async_sync(hass, True)

    assert language in skipped
    assert language not in written
    assert target.read_text(encoding="utf-8") == mine


async def test_a_hand_written_file_is_never_overwritten(hass: HomeAssistant) -> None:
    """A file that was there before we ever ran carries no stamp at all."""
    language = available_languages()[0]
    target = _installed(hass, language)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("language: xx\nintents: {}\n", encoding="utf-8")

    written, skipped = await async_sync(hass, True)

    assert language in skipped
    assert target.read_text(encoding="utf-8") == "language: xx\nintents: {}\n"


# ─── removing ─────────────────────────────────────────────────────────────


async def test_disabling_removes_what_we_installed(hass: HomeAssistant) -> None:
    await async_sync(hass, True)
    await async_sync(hass, False)
    for language in available_languages():
        assert not _installed(hass, language).exists()


async def test_disabling_leaves_a_users_own_file_alone(hass: HomeAssistant) -> None:
    """Turning the setting off must not delete sentences we did not write."""
    language = available_languages()[0]
    target = _installed(hass, language)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("language: xx\nintents: {}\n", encoding="utf-8")

    await async_sync(hass, False)

    assert target.is_file(), "a hand-written file was deleted"


async def test_an_edited_file_survives_disabling_too(hass: HomeAssistant) -> None:
    language = available_languages()[0]
    await async_sync(hass, True)
    target = _installed(hass, language)
    target.write_text(target.read_text(encoding="utf-8") + "\n# mine\n", encoding="utf-8")

    await async_sync(hass, False)

    assert target.is_file(), "an edited file was deleted on disable"


# ─── the agent has to be told ─────────────────────────────────────────────


async def test_the_conversation_agent_is_reloaded(hass: HomeAssistant) -> None:
    """Without a reload the new sentences sit on disk unread until restart."""
    calls: list[tuple[str, str]] = []

    async def _reload(call) -> None:
        calls.append((call.domain, call.service))

    hass.services.async_register("conversation", "reload", _reload)

    await async_sync(hass, True)
    await hass.async_block_till_done()

    assert ("conversation", "reload") in calls


async def test_a_missing_reload_service_does_not_break_setup(hass: HomeAssistant) -> None:
    """conversation may not be loaded at all; installing must still succeed."""
    assert not hass.services.has_service("conversation", "reload")
    written, _ = await async_sync(hass, True)
    assert written, "install was abandoned because the agent could not be reloaded"


@pytest.mark.parametrize("enabled", [True, False])
async def test_an_unwritable_config_directory_is_survivable(
    hass: HomeAssistant, enabled: bool
) -> None:
    """A read-only config dir must not take the integration down with it."""
    import unittest.mock

    with unittest.mock.patch(
        "custom_components.maintenance_supporter.helpers.assist_sentences.Path.write_text",
        side_effect=OSError("read-only"),
    ):
        written, _ = await async_sync(hass, enabled)

    assert written == [] or not enabled
