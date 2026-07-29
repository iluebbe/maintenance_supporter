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

import re
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


_INSTALL_ROOT: Path | None = None


def _installed(hass: HomeAssistant, language: str) -> Path:
    assert _INSTALL_ROOT is not None, "the isolation fixture did not run"
    return _INSTALL_ROOT / language / "maintenance_supporter.yaml"


@pytest.fixture(autouse=True)
def _isolated_install_dir(tmp_path, monkeypatch):
    """Install into a per-test directory, never the shared test config.

    The `hass` fixture hands out a FIXED config directory shared by every
    worker. Under `pytest -n auto` that made this module race with
    `test_ws_roundtrip`, which sets `install_assist_sentences: True` and so
    triggers a real install into the same place — the failure showed up as
    "installing twice is a no-op" seeing a file it had not written.

    A per-test root removes the shared state entirely, which is better than
    cleaning up after it: nothing to leak, and nothing to collide with.
    """
    from custom_components.maintenance_supporter.helpers import assist_sentences

    global _INSTALL_ROOT
    root = tmp_path / "custom_sentences"
    _INSTALL_ROOT = root
    monkeypatch.setattr(
        assist_sentences,
        "_target",
        lambda hass, language: root / language / assist_sentences._FILENAME,
    )
    yield
    _INSTALL_ROOT = None


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


def test_sentences_never_use_home_assistants_reserved_name_list() -> None:
    """`{name}` is NOT a free-text placeholder.

    It references Home Assistant's built-in list of exposed ENTITY names, and
    the default agent resolves it against the registry before dispatching — so
    every sentence using it answered *"Sorry, I am not aware of any device
    called ..."* and our handler never ran. Five intents shipped that way from
    v2.26 until it was caught by asking a live agent; nothing in the unit
    suite could see it, because the tests drive `intent.async_handle` directly
    and never go through sentence matching.

    hassil's `{our_list:name}` alias is the fix: our own wildcard list supplies
    the text, and it still arrives in the `name` slot, so the REST and LLM
    contracts are unchanged.
    """
    placeholder = re.compile(r"\{(\w+)(?::(\w+))?\}")
    offenders: list[str] = []
    for language in available_languages():
        parsed = yaml.safe_load(
            (_PACKAGE_DIR / language / "maintenance_supporter.yaml").read_text(encoding="utf-8")
        )
        declared = set(parsed.get("lists", {}))
        assert "name" not in declared, (
            f"{language}: a list called 'name' cannot override Home Assistant's built-in one"
        )
        for intent_name, cfg in parsed["intents"].items():
            for group in cfg["data"]:
                for sentence in group["sentences"]:
                    for match in placeholder.finditer(sentence):
                        list_name = match.group(1)
                        if list_name == "name":
                            offenders.append(f"{language}/{intent_name}: {sentence!r}")
                        elif list_name not in declared:
                            offenders.append(
                                f"{language}/{intent_name}: undeclared list "
                                f"{{{list_name}}} in {sentence!r}"
                            )
    assert not offenders, (
        "sentences referencing the reserved entity-name list (use "
        "{task_name:name} instead): " + "; ".join(offenders)
    )


def test_the_responses_directory_is_not_mistaken_for_a_language() -> None:
    """`assist_sentences/` holds one directory per language AND the
    `responses/` directory of spoken texts. The language scan must not offer
    to install "responses" as a language — it would look for a sentence file
    that does not exist and, worse, could create a bogus
    `config/custom_sentences/responses/` directory.

    Guarded rather than assumed: the two live under one parent for cohesion,
    which is exactly the arrangement that invites this mistake later.
    """
    assert (_PACKAGE_DIR / "responses").is_dir(), "the responses directory moved"
    assert "responses" not in available_languages()


# ─── the defensive paths ──────────────────────────────────────────────────


def test_no_package_directory_means_no_languages(tmp_path, monkeypatch) -> None:
    from custom_components.maintenance_supporter.helpers import assist_sentences

    monkeypatch.setattr(assist_sentences, "_PACKAGE_DIR", tmp_path / "missing")
    assert assist_sentences.available_languages() == []


def test_an_unreadable_shipped_file_is_reported_as_no_body(tmp_path, monkeypatch) -> None:
    from custom_components.maintenance_supporter.helpers import assist_sentences

    monkeypatch.setattr(assist_sentences, "_PACKAGE_DIR", tmp_path)
    assert assist_sentences._body("nope") is None


async def test_an_unremovable_file_does_not_raise(hass: HomeAssistant) -> None:
    """Turning the setting off on a read-only config dir must not blow up
    setup — it is a cleanup, not a correctness step.

    Patched as a context manager rather than via monkeypatch: unlink is what
    this module's own cleanup fixture uses, so a patch outliving the call
    breaks the teardown instead of the code under test.
    """
    from unittest.mock import patch as mock_patch

    await async_sync(hass, True)
    with mock_patch(
        "custom_components.maintenance_supporter.helpers.assist_sentences.Path.unlink",
        side_effect=OSError("read-only"),
    ):
        written, _skipped = await async_sync(hass, False)
    assert written == []


def test_a_file_without_our_stamp_is_not_ours() -> None:
    from custom_components.maintenance_supporter.helpers.assist_sentences import _is_ours, _stamped

    body = "language: en\nintents: {}\n"
    assert _is_ours(_stamped(body))
    assert not _is_ours(body)
    assert not _is_ours("# maintenance_supporter:managed deadbeef\n" + body)
