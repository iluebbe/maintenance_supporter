"""Tests for the i18n language-normalization helper."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.helpers.i18n import normalize_language


@pytest.mark.parametrize(
    ("ha_language", "expected"),
    [
        ("en", "en"),
        ("de", "de"),
        ("zh-Hans", "zh"),  # HA's only Simplified-Chinese code
        ("zh-Hant", "zh"),
        ("pt-BR", "pt"),
        ("en-GB", "en"),
        ("es-419", "es"),
        ("ES", "es"),  # case-folded
        ("", "en"),  # empty -> default
        (None, "en"),  # unset -> default
    ],
)
def test_normalize_language(
    hass: HomeAssistant, ha_language: str | None, expected: str
) -> None:
    """Regional, uppercase, empty and unset HA codes map to a 2-letter key."""
    hass.config.language = ha_language
    assert normalize_language(hass) == expected
